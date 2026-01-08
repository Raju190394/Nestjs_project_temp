import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Since we use HttpOnly cookies, we can check for their existence
    // but we can't read them in the client (or easily in edge middleware without complexity).
    // However, we can check if they ARE present.
    const accessToken = request.cookies.get('access_token')?.value;
    const refreshToken = request.cookies.get('refresh_token')?.value;

    const publicPaths = ['/login', '/register', '/'];
    const isPublicPath = publicPaths.includes(pathname);

    if (!accessToken && !refreshToken && !isPublicPath) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    if ((accessToken || refreshToken) && isPublicPath && pathname !== '/') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
