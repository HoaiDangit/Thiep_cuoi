import { NextResponse } from 'next/server';
export function middleware(){const res=NextResponse.next();res.headers.set('Cache-Control','private, no-store, max-age=0');res.headers.set('Referrer-Policy','no-referrer');res.headers.set('X-Robots-Tag','noindex, nofollow');return res;}
export const config={matcher:['/invite/:path*','/api/:path*','/','/login','/setup','/account']};
