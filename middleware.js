import { NextResponse } from 'next/server';

export function middleware(req) {

    const host = req.headers.get('host') || '';
    const subdomain = host.split('.')[0];
    console.log("Subdomain:", subdomain);
    
    const res = NextResponse.next();
    res.headers.set('x-tenant', subdomain);

    return res;

}
