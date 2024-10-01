import { NextResponse, NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
	// Get a cookie
	const sessionCookie = request.cookies.get('sessionId')

	const response = NextResponse.next()

    if(sessionCookie){
        response.cookies.set({
            name: sessionCookie.name,
            value: sessionCookie.value,
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            expires: new Date(Date.now() + (1 * 24 * 60 * 60 * 1000)), // 1 day
        })
    }
    else{
        const cookieValue = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        response.cookies.set({
            name: 'sessionId',
            value: cookieValue,
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            expires: new Date(Date.now() + (1 * 24 * 60 * 60 * 1000)), // 1 day
        })
    }

	return response
}