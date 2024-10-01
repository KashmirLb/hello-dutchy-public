import { createTRPCRouter, publicProcedure, privateProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { createMolliePayment, getMolliePayment } from "../mollie/molliePayments";
import convertOrderToPayment from "../helpers/convertOrderToPayment";
import { Locale, PaymentStatus } from "@mollie/api-client";
import { convertJsonToOrderItemSummary } from "~/utils/converters";

export const paymentRouter = createTRPCRouter({

    create: publicProcedure.input(z.object({
        orderId: z.string(),
        locale: z.string().optional(),
    })).mutation(async ({ ctx, input }) => {

        const order = await ctx.db.order.findFirst({
            where: {
                orderId: input.orderId
            }
        })

        if(!order){
            return null
        }
        
        // Find locale 
        const locale: Locale = input.locale as Locale ?? "en_GB"

        // Convert json items to orderItemSummary
        const orderItems = convertJsonToOrderItemSummary(order.items)

        const paymentData = convertOrderToPayment(order, locale, orderItems)

        const payment = await createMolliePayment(paymentData)

        return payment
    }),
    getPaymentAndVerify: privateProcedure.input(z.string()).query(async ({ ctx, input }) => {

        const payment = await getMolliePayment(input)

        if(payment && payment.status == PaymentStatus.paid){
            return payment
        }
        return null
    }),
});
