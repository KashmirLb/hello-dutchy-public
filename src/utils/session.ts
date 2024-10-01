import { IncomingMessage, ServerResponse } from 'http';
import { parse, serialize } from 'cookie';

export const getSessionId = (req?: IncomingMessage): string | null => {
  const cookies = req ? parse(req.headers.cookie ?? '') : parse(document.cookie);
  return cookies.sessionId ?? null;
};

export const createSessionId = (res?: ServerResponse): string => {
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

  if (res) {
    res.setHeader('Set-Cookie', serializedCookie);
  } else {
    document.cookie = serializedCookie;
  }

  return sessionId;
};