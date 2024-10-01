import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";
import createOrderId from "~/utils/createOrderId";
import type { CheckoutDataResponse, OrderReceivedClientEmailReplacements, OrderReceivedShopEmailReplacements } from "~/types"
import { nanoid } from "nanoid";
import { randomUUID } from "crypto";
import { sendEmail } from "../helpers/sendEmail";
import { convertDate, convertJsonToOrderItemSummary } from "~/utils/converters";
import convertItemsToTable from "../helpers/convertItemsToTable";
import formatPrices from "../helpers/formatPrices";
import convertItemsToTableIncoming from "../helpers/convertItemsToTableIncoming";
import { getMolliePayment } from "../mollie/molliePayments";
import { PaymentStatus } from "@mollie/api-client";
import { ExtendedPrismaClient } from "~/server/db";
import { deliveryStatuses } from "~/data/Statuses";

type ctxType = {
  db: ExtendedPrismaClient;
  TRPCInnerCall: string | undefined;
};

export const orderRouter = createTRPCRouter({

  /**
   * GETS
   */
  getOneByOrderId: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.db.order.findUnique({
      where: {
        orderId: input
      }
    })
  }),
  getOneByToken: publicProcedure.input(z.string()).query( async({ ctx, input }) => {

    if(input == ""){
      return null
    }
    else{
      const splitInput = input.split("|")

      const order = await ctx.db.order.findFirst({
        where: {
          orderId: splitInput[0]
        }
      })
      if(order && order.token == splitInput[1]){
        return order
      }
      else{
        return null
      }
    }
  }),
  getOneBySessionId: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.db.order.findUnique({
      where: {
        cartSessionId: input
      }
    })
  }),
  getOneBySessionIdMutation: publicProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.db.order.findUnique({
      where: {
        orderId: input
      }
    })
  }),
  // Endpoint called when arriving at the redirectURL after payment
  getOneBySessionAndReference: publicProcedure.input(z.string()).mutation(async ({ ctx, input }) => {

    const orderId = input.split("|")[0]
    const cartSessionId = input.split("|")[1]
    // Get the order related to payment
    const firstOrder = await  ctx.db.order.findUnique({
      where: {
        cartSessionId: cartSessionId,
        orderId: orderId
      }
    })

    // If order is already paid, return the order
    if(firstOrder && firstOrder.paid && firstOrder.token && firstOrder.token != ""){
      return firstOrder
    }
    // If order is not paid, but we have a checkoutId (payment was created), check if payment is paid
    if(firstOrder?.checkoutId && (!firstOrder?.paid || !firstOrder?.token || firstOrder?.token == "")){
      const payment = await getMolliePayment(firstOrder.checkoutId)

      // If payment is paid, process actions to set order as paid, send emails, etc...
      // Return the new order
      if(payment && payment.status == PaymentStatus.paid){
        return await checkOrderisPaidAndUpdate({
          ctx,
          checkout_reference: firstOrder.checkoutId,
          currency: payment.amount.currency,
          checkout_id: payment.id,
          transaction_id: payment.id,
          transaction_code: payment.id,
          errorCode: ""
        })
      }
      // If payment is not paid, return null
      return firstOrder
    }

    // If there is no order, or no checkoutId, return null
    return null
  }),

  /**
   * CHECKS
   */

  checkOrderIsPaid: publicProcedure.input(z.string()).query( async ({ ctx, input }) => {

    if(input == ""){
      return null
    }
    const order = await ctx.db.order.findUnique({
      where: {
        orderId: input
      }
    })

    return order?.paid
  }),
  
  /**
   * CREATES
  */
 
  create: publicProcedure.input(z.object({
    cartSessionId: z.string(),
    paid: z.boolean(),
    addressCity: z.string(),
    addressCountry: z.string(),
    addressLine1: z.string(),
    addressLine2: z.string(),
    addressPostalCode: z.string(),
    addressState: z.string(),
    email: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    phone: z.string(),
    items: z.array(z.object({
      productId: z.number(),
      productName: z.string(),
      productCode: z.string(),
      color: z.string(),
      colorCode: z.string(),
      colorHex: z.string(),
      size: z.string(),
      sizeType: z.string(),
      quantity: z.number(),
      price: z.string()
    }))
  })).mutation(async ({ ctx, input }) => {

    // Generate OrderID, and recreate if it already exists
    let generateOrderId = createOrderId()
    while (await ctx.db.order.findUnique({
      where: {
        orderId: generateOrderId
      }
    }) != null) {
      generateOrderId = createOrderId()
    }
    ///

    /**
     * CALCULATE COSTS
     */
    /// Get all products selected from the DB, to check the prices and calculate the total cost
    const products = await ctx.db.product.findMany({
      where: {
        id: {
          in: input.items.map(item => item.productId)
        }
      }
    })
    // Return an array of cost of each product * the quantity
    const productCosts: number[] = input.items.map(item => {

      const product = products.find(product => product.id == item.productId)
      if(product){
        const price = item.sizeType == "Kids" ? Number.parseFloat(product.kidsPrice.replace(",", "."))*item.quantity : Number.parseFloat(product.price.replace(",", "."))*item.quantity

        const roundedPrice = Math.round(price * 100)/100

        return roundedPrice
      }
      else{
        return 0
      }
    })
    // If any cost was 0, return null (error)
    if(productCosts.some(cost => cost == 0)){
      return null
    }
    // Calculate total cost, plus 4.95 for shipping when applicable
    const totalCost = 
      productCosts.reduce((total, cost) => total + cost, 0) >= 50 ||
      products.some(product => product.productCode == "TESTITEM")
      ? 
      productCosts.reduce((total, cost) => total + cost, 0) : 
      Math.round((productCosts.reduce((total, cost) => total + cost, 0) + 4.95)*100)/100    
    /**
     * END CALCULATE COSTS
     */

    /**
     * CREATE ORDER
     */
    const newOrder = await ctx.db.order.create({
      data: {
        orderId: generateOrderId,
        cartSessionId: input.cartSessionId,
        cost: totalCost,
        paid: input.paid,
        addressCity: input.addressCity,
        addressCountry: input.addressCountry,
        addressLine1: input.addressLine1,
        addressLine2: input.addressLine2,
        addressPostalCode: input.addressPostalCode,
        addressState: input.addressState,
        email: input.email,
        firstName: input.firstName,
        lastName: input.lastName,
        phone: input.phone,
        items: input.items,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    })

    /**
     * UPDATE CART SESSION
     */
    // If order was created, update 'orderCreated' from the CartSession to true.
    if(newOrder){
      await ctx.db.cartSession.update({
        where: {
          sessionId: input.cartSessionId
        },
        data: {
          orderCreated: true
        }
      })
    }

    return newOrder
  }),
  createCheckoutWithOrderId: publicProcedure.input(z.string()).mutation( async ({ ctx, input }) => {
    const order = await ctx.db.order.findUnique({
      where: {
        orderId: input
      }
    })

    if(order){
      try{
        if(process.env.SUMUP_MERCHANT_SECRET != undefined){

          const setReturnUrl = () => {
            if(process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL){
              return `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}/api/verify-checkout-paid`
            }
            else{
              // This is where the SumUp webhook will send the data, so cannot set LOCALHOST
              return ``
            }
          }

          const setRedirectUrl = (reference: string) => {
            if(process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL){
              return `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}/checkout-completed/${reference}`
            }
            else{
              return `http://localhost:3005/checkout-completed/${reference}`
            }
          }

          // Function to create a checkout if it does not already exist
          const createCheckout = async () => {

            const newCheckoutReference = randomUUID()

            const check: CheckoutDataResponse | null = await fetch("https://api.sumup.com/v0.1/checkouts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.SUMUP_MERCHANT_SECRET}`
                },
                body: process.env.VERCEL_URL ?JSON.stringify({
                  "amount": order.cost,
                  "currency": "EUR",
                  "pay_to_email": process.env.SUMUP_PAY_TO_EMAIL,
                  "checkout_reference": newCheckoutReference,
                  "merchant_code": process.env.SUMUP_MERCHANT_CODE,
                  // string of date 5 minutes from now
                  "valid_until": new Date(new Date().getTime() + 300000).toISOString(),
                  "redirect_url": setRedirectUrl(newCheckoutReference),
                  "return_url": setReturnUrl(),
                }) : JSON.stringify({
                  "amount": order.cost,
                  "currency": "EUR",
                  "pay_to_email": process.env.SUMUP_PAY_TO_EMAIL,
                  "checkout_reference": newCheckoutReference,
                  "merchant_code": process.env.SUMUP_MERCHANT_CODE,
                  // string of date 5 minutes from now
                  "valid_until": new Date(new Date().getTime() + 300000).toISOString(),
                  "redirect_url": setRedirectUrl(newCheckoutReference),
                })
            })
              .then(res => res.json() as Promise<CheckoutDataResponse>)
              .then(data => {
                return data
              })
              .catch((error) => null)

            return check
          }

          // Function to find the checkout by the checkout id
          const findCheckout = async () => {

            const check: CheckoutDataResponse | null = await fetch("https://api.sumup.com/v0.1/checkouts?checkout_reference=" + order.checkoutId, {
              method: "GET",
              headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${process.env.SUMUP_MERCHANT_SECRET}`
              }
          })
          .then(res => res.json() as Promise<CheckoutDataResponse[]>)
          .then( async (data) => {
              // If checkout exists...
              if(data && data.length > 0 && data[0]){
                return data[0]
              }
              // If checkout does not exist...
              else{
                return await createCheckout()
              }
            })
            .catch((error) => null)

          return check
          }

          // Function to delete a checkout if the amount is not the same as the order cost
          const deleteCheckout = (id:string) => {

            void fetch("https://api.sumup.com/v0.1/checkouts/" + order.orderId, {
              method: "DELETE",
              headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${process.env.SUMUP_MERCHANT_SECRET}`
              }
            }).then(res => res.json() as Promise<CheckoutDataResponse[]>)
            .then( data => {
                console.log("Checkout deleted")
            })
          }

          // Function to search for an existing checkout, and create a new one if it does not exist or if the amount is not the same as the order cost.
          const obtainCheckout = async () => {

            // If OrderID already has a checkoutID...
            if(order.checkoutId != undefined){

              // Get the checkout from SumUp...
              const getCheckout = await findCheckout()

              // If checkout does not exist...
              if(!getCheckout){
                return await createCheckout()
              }

              // If checkout amount does not match...
              if(getCheckout.amount != order.cost){
                void deleteCheckout(order.checkoutId)
                return await createCheckout()
              }
              if(getCheckout.status?.toString().toLowerCase() != "pending"){ 
                console.log("Checkout status is not pending")
                void deleteCheckout(order.checkoutId) 
                return await createCheckout()
              }
              
              // If checkout exists, and cost matches...
              return getCheckout
            }
            else{
              // If OrderID does not have a checkoutID...
              return await createCheckout()
            }
          }
          const checkout = await obtainCheckout()

          return checkout
        }
        else{
            return null
        }
      }
      catch(e){
          console.error(e);
          return null
      }
    }
    return null
  }),

  /**
   * UPDATES
   */
  updateData: publicProcedure.input(z.object({
    orderId: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string(),
    phone: z.string(),
    addressCountry: z.string(),
    addressState: z.string(),
    addressCity: z.string(),
    addressPostalCode: z.string(),
    addressLine1: z.string(),
    addressLine2: z.string(),
    policyAccepted: z.boolean()
  })).mutation(async ({ ctx, input }) => {

    const order = await ctx.db.order.update({
      where: {
        orderId: input.orderId
      },
      data: {
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        phone: input.phone,
        addressCountry: input.addressCountry,
        addressState: input.addressState,
        addressCity: input.addressCity,
        addressPostalCode: input.addressPostalCode,
        addressLine1: input.addressLine1,
        addressLine2: input.addressLine2,
        policyAccepted: input.policyAccepted,
        updatedAt: new Date()
      }
    })

    return order
  }),
  updateItems: publicProcedure.input(z.object({
    orderId: z.string(),
    cost: z.number(),
    items: z.array(z.object({
      productId: z.number(),
      productName: z.string(),
      productCode: z.string(),
      color: z.string(),
      colorCode: z.string(),
      colorHex: z.string(),
      size: z.string(),
      sizeType: z.string(),
      quantity: z.number(),
      price: z.string()
    }))
  })).mutation(async ({ ctx, input }) => {

    /**
     * CALCULATE COSTS OF ITEMS IN CART
     */
    // Get all products selected from the DB
    const products = await ctx.db.product.findMany({
      where: {
        id: {
          in: input.items.map(item => item.productId)
        }
      }
    })
    // Return an array of cost of each product * the quantity
    const productCosts: number[] = input.items.map(item => {

      const product = products.find(product => product.id == item.productId)
      if(product){
        const price = item.sizeType == "Kids" ? Number.parseFloat(product.kidsPrice.replace(",", "."))*item.quantity : Number.parseFloat(product.price.replace(",", "."))*item.quantity

        const roundedPrice = Math.round(price * 100)/100

        return roundedPrice
      }
      else{
        return 0
      }
    })
    // If any cost was 0, return null (error)
    if(productCosts.some(cost => cost == 0)){
      return null
    }
    // Calculate total cost, plus 4.95 for shipping when applicable
    const totalCost = 
      productCosts.reduce((total, cost) => total + cost, 0) >= 50 ||
      // TEST ITEM CASES
      products.some(product => product.productCode == "TESTITEM") ? 
      productCosts.reduce((total, cost) => total + cost, 0) : 
      Math.round((productCosts.reduce((total, cost) => total + cost, 0) + 4.95)*100)/100
    /**
     * END CALCULATE COSTS
     */

    // UPDATE ORDER ITEMS AND COST
    const order = await ctx.db.order.update({
      where: {
        orderId: input.orderId
      },
      data: {
        cost: totalCost,
        items: input.items
      }
    })

    return order

  }),
  // updatePaid: publicProcedure.input(z.object({
  //   orderId: z.string(),
  //   paid: z.boolean(),
  //   paymentMethod: z.string(),
  //   status: z.string(),
  //   checkoutId: z.string(),
  //   transactionId: z.string(),
  //   transactionCode: z.string(),
  //   totalCost: z.number(),
  //   currency: z.string(),
  //   checkoutReference: z.string(),
  //   errorCode: z.string(),
  //   language: z.string()
  // })).mutation(async ({ ctx, input }) => { 

  //   // Find order to see if it was not already updated to "paid"
  //   const preOrder = await ctx.db.order.findUnique({
  //     where: {
  //       orderId: input.orderId
  //     }
  //   })

  //   if(!preOrder?.paid && preOrder?.token == null && input.paid){
  //     // If not, update order
  //     const order = await ctx.db.order.update({
  //       where: {
  //         orderId: input.orderId
  //       },
  //       data: {
  //         token: nanoid(),
  //         status: "Order Received",
  //         paid: input.paid,
  //         paymentMethod: input.paymentMethod,
  //         updatedAt: new Date()
  //       }
  //     })

  //     // Create checkout with checkout data
  //     await ctx.db.checkout.create({
  //       data: {
  //         orderId: input.orderId,
  //         checkoutReference: input.checkoutReference,
  //         currency: input.currency,
  //         amount: input.totalCost,
  //         status: input.status,
  //         checkout_id: input.checkoutId,
  //         transaction_id: input.transactionId,
  //         transaction_code: input.transactionCode,
  //         error_code: input.errorCode,
  //         createdAt: new Date(),
  //         updatedAt: new Date()
  //       }
  //     })
      
  //     // Update CartSession: Set orderCompleted to true
  //     await ctx.db.cartSession.update({
  //       where: {
  //         sessionId: order.cartSessionId
  //       },
  //       data: {
  //         orderCompleted: input.paid
  //       }
  //     })
      
  //     // Prepare to send emails
  //     const orderItems= convertJsonToOrderItemSummary(order.items)
  //     const orderItemsTableClient = convertItemsToTable(orderItems)
  //     const orderItemsTableShop = convertItemsToTableIncoming(orderItems)

  //     const shopReplacements: OrderReceivedShopEmailReplacements = {
  //       orderId: order.orderId,
  //       orderFirstName: order.firstName,
  //       orderLastName: order.lastName,
  //       orderEmail: order.email,
  //       orderPhone: order.phone,
  //       orderAddressOneAndTwo: order.addressLine2 != "" ? order.addressLine1 + ", " + order.addressLine2 : order.addressLine1,
  //       orderCityAndPostalCode: order.addressCity + ", " + order.addressPostalCode,
  //       orderProvince: order.addressState,
  //       orderCountry: order.addressCountry,
  //       orderItemsInTableFormat: orderItemsTableShop,
  //       orderTotalPrice: formatPrices(order.cost),
  //       orderYear: new Date().getFullYear().toString(),
  //       orderDateWithTime: new Date().toLocaleString("nl-NL", {
  //         timeZone: "Europe/Amsterdam",
  //         hour12: false,
  //         hour: "2-digit",
  //         minute: "2-digit",
  //         second: "2-digit",
  //         day: "2-digit",
  //         month: "long",
  //         year: "numeric",
  //       }),
  //       orderCheckoutId: order.checkoutId ?? "",
  //       orderPaymentStatus: order.paid ? "Betaald" : "Niet betaald"
  //     }

  //     const clientReplacements: OrderReceivedClientEmailReplacements = {
  //       orderId: order.orderId,
  //       orderDate: convertDate(),
  //       orderPhone: order.phone,
  //       orderAddressOneAndTwo: order.addressLine2 != "" ? order.addressLine1 + ", " + order.addressLine2 : order.addressLine1,
  //       orderCityAndPostalCode: order.addressCity + ", " + order.addressPostalCode,
  //       orderCountry: order.addressCountry,
  //       orderItemsInTableFormat: orderItemsTableClient,
  //       orderToken: order.token ?? "",
  //       orderTotalPrice: formatPrices(order.cost),
  //       orderProvince: order.addressState,
  //       orderYear: new Date().getFullYear().toString()
  //     }

  //     const email = process.env.ENVIRONMENT == "PROD" ? order.email : process.env.LOCAL_TEST_MAIL ?? ""

  //     if(process.env.SHOP_OWNER_EMAIL != undefined){
  //       // Send email to shop owner
  //       await sendEmail({
  //         to: process.env.SHOP_OWNER_EMAIL,
  //         subject: "Nieuwe bestelling ontvangen",
  //         text: "Nieuwe bestelling ontvangen",
  //         html: "",
  //         replacements: shopReplacements,
  //         template: "orderConfirmationShop"               
  //       })
  //     }

  //     // Send email to customer
  //     await sendEmail({
  //       to: email,
  //       subject: input.language == "nl" ? "Uw Hello Dutchy bestelling" : "Your Hello Dutchy order",
  //       text: "Your order has been received. Thank you for your purchase!",
  //       html: "",
  //       replacements: clientReplacements,
  //       template: input.language == "nl" ? "orderConfirmationClientNederlands" : "orderConfirmationClientEnglish"               
  //     })
     
  //     // Update order status to "Order Received"
  //     const orderReceived = await ctx.db.order.update({
  //       where: {
  //         orderId: order.orderId
  //       },
  //       data: {
  //         status: "Order Received"
  //       }
  //     })

  //     return orderReceived ?? order
  //   }
  //   else{
  //     // If order was already paid, return the order
  //     return preOrder
  //   }
  // }),
  updateCheckoutId: publicProcedure.input(z.object({
    orderId: z.string(),
    checkoutId: z.string()
  })).mutation(async ({ ctx, input }) => {
    return ctx.db.order.update({
      where: {
        orderId: input.orderId
      },
      data: {
        checkoutId: input.checkoutId
      }
    })
  }),
  updatePaidApi: privateProcedure.input(z.object({
    checkout_reference: z.string(),
    currency: z.string(),
    checkout_id: z.string(),
    transaction_id: z.string(),
    transaction_code: z.string(),
    errorCode: z.string()
  })).query(async ({ ctx, input }) => {
    try{
      await ctx.db.successfulApiCall.update({
        where: {
          route: "verify-checkout-paid"
        },
        data:{
          numberOfCalls: {
            increment: 1
          },
          updatedAt: new Date()
        }
      })
    }
    catch(e){
      console.error(e)
    }
    // Check if order exists and is not already paid
    await checkOrderisPaidAndUpdate({
      ctx,
      checkout_reference: input.checkout_reference,
      currency: input.currency,
      checkout_id: input.checkout_id,
      transaction_id: input.transaction_id,
      transaction_code: input.transaction_code,
      errorCode: input.errorCode
    })
  }),
});


const checkOrderisPaidAndUpdate = async ({ctx, checkout_reference, currency, checkout_id, transaction_id, transaction_code, errorCode} : {ctx: ctxType, checkout_reference: string, currency: string, checkout_id: string, transaction_id: string, transaction_code: string, errorCode: string}) => {
  const prevOrder = await ctx.db.order.findUnique({
    where: {
      checkoutId: checkout_reference
    }
  })

  if(prevOrder && !prevOrder.paid && (prevOrder.token == null || prevOrder.token == "")){
    // If not paid yet, update order
    const order = await ctx.db.order.update({
      where: {
        orderId: prevOrder.orderId
      },
      data: {
        token: nanoid(),
        status: deliveryStatuses.Paid,
        paid: true,
        updatedAt: new Date()
      }
    })

    // Create checkout with checkout data
    await ctx.db.checkout.create({
      data: {
        orderId: order.orderId,
        checkoutReference: checkout_reference,
        currency: currency,
        amount: order.cost,
        status: "PAID",
        checkout_id: checkout_id,
        transaction_id: transaction_id,
        transaction_code: transaction_code,
        error_code: errorCode,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })
    
    // Update CartSession: Set orderCompleted to true
    await ctx.db.cartSession.update({
      where: {
        sessionId: order.cartSessionId
      },
      data: {
        orderCompleted: true
      }
    })
    
    // Prepare to send emails

    //TODO: ADD SHIPPPING COST IN CASE THAT COST < 50
    const orderItems= convertJsonToOrderItemSummary(order.items)

    const orderItemsWithShipping = [...orderItems, {
      productId: 0,
      productName: "Shipping",
      productCode: "Shipping",
      color: "",
      size: "",
      sizeType: "",
      quantity: 1,
      price: orderItems.reduce((total, item) => total + (Number.parseFloat(item.price) * item.quantity), 0) >= 50 ? "0.00" : "4.95",
      colorCode: "",
      colorHex: "",
    }]
      

    const orderItemsTableClient = convertItemsToTable(orderItemsWithShipping)
    const orderItemsTableShop = convertItemsToTableIncoming(orderItemsWithShipping)

    const shopReplacements: OrderReceivedShopEmailReplacements = {
      orderId: order.orderId,
      orderFirstName: order.firstName,
      orderLastName: order.lastName,
      orderEmail: order.email,
      orderPhone: order.phone,
      orderAddressOneAndTwo: order.addressLine2 != "" ? order.addressLine1 + ", " + order.addressLine2 : order.addressLine1,
      orderCityAndPostalCode: order.addressCity + ", " + order.addressPostalCode,
      orderProvince: order.addressState,
      orderCountry: order.addressCountry,
      orderItemsInTableFormat: orderItemsTableShop,
      orderTotalPrice: formatPrices(order.cost),
      orderYear: new Date().getFullYear().toString(),
      orderDateWithTime: new Date().toLocaleString("nl-NL", {
        timeZone: "Europe/Amsterdam",
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
      orderCheckoutId: order.checkoutId ?? "",
      orderPaymentStatus: order.paid ? "Betaald" : "Niet betaald"
    }

    const clientReplacements: OrderReceivedClientEmailReplacements = {
      orderId: order.orderId,
      orderDate: convertDate(),
      orderPhone: order.phone,
      orderAddressOneAndTwo: order.addressLine2 != "" ? order.addressLine1 + ", " + order.addressLine2 : order.addressLine1,
      orderCityAndPostalCode: order.addressCity + ", " + order.addressPostalCode,
      orderCountry: order.addressCountry,
      orderItemsInTableFormat: orderItemsTableClient,
      orderToken: order.token ?? "",
      orderTotalPrice: formatPrices(order.cost),
      orderProvince: order.addressState,
      orderYear: new Date().getFullYear().toString()
    }

    const email = process.env.ENVIRONMENT == "PROD" ? order.email : process.env.LOCAL_TEST_MAIL ?? ""

    if(process.env.SHOP_OWNER_EMAIL != undefined){
      // Send email to shop owner
      await sendEmail({
        to: process.env.SHOP_OWNER_EMAIL,
        subject: "Nieuwe bestelling ontvangen",
        text: "Nieuwe bestelling ontvangen",
        html: "",
        replacements: shopReplacements,
        template: "orderConfirmationShop"               
      })
    }

    // Send email to customer
    await sendEmail({
      to: email,
      subject: "Your Hello Dutchy order",
      text: "Your order has been received. Thank you for your purchase!",
      html: "",
      replacements: clientReplacements,
      template: "orderConfirmationClientEnglish"               
    })
   
    // Update order status to "Order Received"
    return await ctx.db.order.update({
      where: {
        orderId: order.orderId
      },
      data: {
        status: deliveryStatuses.NewOrder
      }
    })
  }
  else{
    // If order was already paid, return the order
    return prevOrder
  }
}
