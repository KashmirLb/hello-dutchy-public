import { serialize } from "cookie";
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try{
        const sessionId =
            Math.random().toString(36).substring(2, 15) +
            Math.random().toString(36).substring(2, 15) +
            Math.random().toString(36).substring(2, 15);
        const serializedCookie = serialize('sessionId', sessionId, {
            maxAge: 1 * 24 * 60 * 60, // 1 day
            path: '/',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });
        res.setHeader('Set-Cookie', serializedCookie);
        return res.status(200).json({ sessionId: sessionId });
    }
    catch(e){
        console.error(e);
        res.status(500).json({ error: "failed to"});
    }
}