import type { Payment } from "@mollie/api-client";
import { createMollieClient } from '@mollie/api-client';
import { PaymentData } from "~/types";

const mollieClient = createMollieClient({ apiKey: process.env.MOLLIE_API_KEY ?? "" });

export const createMolliePayment = async (data: PaymentData) => {

    const { amount, orderId, redirectUrl, webhookUrl, cancelUrl, shippingAddress, locale, lines } = data
    try{
        const payment: Payment = await mollieClient.payments.create({
            amount: {
                currency: amount.currency,
                value: amount.value,
            },
            description: 'Hello Dutchy Order #' + orderId,
            redirectUrl: redirectUrl,
            webhookUrl: webhookUrl,
            cancelUrl: cancelUrl,

            shippingAddress: !shippingAddress ? undefined :{
                givenName: shippingAddress.givenName,
                familyName: shippingAddress.familyName,
                streetAndNumber: shippingAddress.streetAndNumber,
                streetAdditional: shippingAddress.streetAdditional,
                postalCode: shippingAddress.postalCode,
                city: shippingAddress.city,
                country: shippingAddress.country,
                region: shippingAddress.region
            },
            locale: locale,

            metadata: {
                order_id: orderId,
                items: lines
            },            
        })
        return payment
    }
    catch(error){
        console.log(error)
        return null
    }
}

export const getMolliePayment = async (paymentId: string) => {
    try{
        const payment: Payment = await mollieClient.payments.get(paymentId)
        return payment
    }
    catch(error){
        console.log(error)
        return null
    }
}