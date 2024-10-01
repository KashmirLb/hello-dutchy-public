import { NextApiRequest, NextApiResponse } from "next";

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try{
        const cookies = req.cookies.sessionId
        return res.status(200).json({ sessionId: cookies });
    }
    catch(e){
        console.error(e);
        res.status(500).json({ error: "failed to"});
    }
}