import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try{
 
        if(process.env.SUMUP_MERCHANT_SECRET != undefined){
            await fetch("https://api.sumup.com/v0.1/checkouts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.SUMUP_MERCHANT_SECRET}`
                },
                body: JSON.stringify(req.body)
            })
            .then(res => res.json())
            .then(data => {
                return res.status(200).json(data)
            })
        }
        else{
            return res.status(500).json({ error: "no merchant secretInfo missing"})
        }
    }
    catch(e){
        console.error(e);
        res.status(500).json({ error: "failed to"});
    }
}