import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try{
        const headerConfig = (token: string) =>{
            return(
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }
            )
        }

        if(process.env.SUMUP_MERCHANT_SECRET != undefined){
            await fetch("https://api.sumup.com/v0.1/me", headerConfig(process.env.SUMUP_MERCHANT_SECRET))
                .then(res => res.json())
                .then(data => {
                    return res.status(200).json(data)
                })
        }
        else{
            return res.status(500).json({ error: "no merchant secret"})
        }
    }
    catch(e){
        console.error(e);
        res.status(500).json({ error: "failed to"});
    }
}