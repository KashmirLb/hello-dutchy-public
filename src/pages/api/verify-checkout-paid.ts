import { NextApiRequest, NextApiResponse } from "next";
import { createServerSideHelpers } from '@trpc/react-query/server'
import { db } from "~/server/db";
import superjson from 'superjson';
import { appRouter } from "~/server/api/root";
import type { AppRouter } from "~/server/api/root";


type MollieWebHookType = {
    id: string,
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try{

        const { id } = req.body as MollieWebHookType

        const helpers = createServerSideHelpers({
                            router: appRouter,
                            ctx: {
                                db,
                                TRPCInnerCall: process.env.INNER_TRPC_SECRET ?? ""
                            },
                            transformer: superjson
                        })
        const payment = await helpers.payment.getPaymentAndVerify.fetch(id)

        if(payment){
            await helpers.order.updatePaidApi.fetch({
                checkout_reference: payment.id,
                currency: payment.amount.currency,
                checkout_id: payment.id,
                transaction_id: payment.id,
                transaction_code: payment.id,
                errorCode: ""
            })
        }
        res.status(200).json({});
    }
    catch(e){
        console.error(e);
        res.status(200).json({ });
    }
}