import { Order } from "@prisma/client";
import { OrderItemSummary, PaymentData } from "~/types";
import { formatPricesPayment } from "./formatPrices";
import { Locale } from "@mollie/api-client";

export default function convertOrderToPayment(order: Order, locale?: Locale, orderItems?: OrderItemSummary[]): PaymentData {

    return {
        orderId: order.orderId,
        amount: {
            value: formatPricesPayment(order.cost),
            currency: "EUR"
        },
        redirectUrl: setRedirectUrl(order.orderId, order.cartSessionId),
        webhookUrl: setWebhookUrl(),
        cancelUrl: setCancelUrl(),
        shippingAddress: {
            givenName: order.firstName,
            familyName: order.lastName,
            streetAndNumber: order.addressLine1,
            streetAdditional: order.addressLine2 != "" ? order.addressLine2 : undefined,
            postalCode: order.addressPostalCode,
            city: order.addressCity,
            country: countryISO(order.addressCountry),
            region: order.addressState
        },
        locale: locale! ?? "en_GB",
        lines: orderItems?.map(item => {
            return {
                description: `${item.productName}${item.size ? " - " + item.size : ""} ${item.color ? " - " + item.color : ""}`,
                quantity: item.quantity,
                unitPrice: {
                    value: formatPricesPayment(Number(item.price)),
                    currency: "EUR"
                },
                totalAmount: {
                    value: formatPricesPayment(Number(item.price) * item.quantity),
                    currency: "EUR"
                }
            }
          }) ?? []
        
    }
}



const countryISO = (country: string) => {
    switch (country) {
        case "Netherlands":
            return "NL"
        case "Belgium":
            return "BE"
        case "France":
            return "FR"
        case "Germany":
            return "DE"
        case "Luxemburg":
            return "LU"
        case "Spain":
            return "ES"
        case "United Kingdom":
            return "GB"
        default:
            return "EU"
    }
}

const setWebhookUrl = () => {
    if(process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL){
      return `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}/api/verify-checkout-paid`
    }
    else{
      // This is where the SumUp webhook will send the data, so cannot set LOCALHOST
      return undefined
    }
  }

  const setRedirectUrl = (orderId: string, cartSessionId: string) => {
    if(process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL){
      return `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}/checkout-completed/${orderId}|${cartSessionId}`
    }
    else{
      return `http://localhost:3005/checkout-completed/${orderId}|${cartSessionId}`
    }
  }

  const setCancelUrl = () => {
    if(process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL){
      return `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}/cart`
    }
    else{
      return `http://localhost:3005/cart`
    }
  }