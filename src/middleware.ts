import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    const isProtected =
        pathname.startsWith('/dashboard') ||
        pathname.startsWith('/auth') ||
        pathname.startsWith('/api/dashboard') ||
        pathname.startsWith('/api/auth');

    if (!isProtected) {
        return NextResponse.next();
    }
    const cookieStore = await cookies();

    const authHeader = req.headers.get('Authorization');
    const apiToken = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    const token = cookieStore.get('token')?.value || apiToken;
    // const token = cookieStore.get("token")?.value || req.headers.get("token");

    if (!token) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);

        const user_id = payload.user_id as string;
        const email = payload.email as string;

        const requestHeaders = new Headers(req.headers);
        requestHeaders.set('user_id', user_id);
        requestHeaders.set('email', email);

        return NextResponse.next({
            request: {
                headers: requestHeaders
            }
        });
    } catch (error) {
        console.error('JWT verification failed:', error);
        return NextResponse.redirect(new URL('/login', req.url));
    }
}
