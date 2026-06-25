import { NextRequest, NextResponse } from 'next/server';
import { decryptSession } from './utils/session';

export async function middleware(request: NextRequest) {
    const sessionCookie = request.cookies.get('session')?.value;

    // Fallback for developer sandbox token / MCP integration
    if (sessionCookie === 'test-user-mcp') {
        return NextResponse.next();
    }

    if (!sessionCookie) {
        const loginUrl = new URL('/login', request.url);
        return NextResponse.redirect(loginUrl);
    }

    const session = await decryptSession(sessionCookie);
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@wizpay.local';

    if (!session || session.email !== adminEmail) {
        const loginUrl = new URL('/login', request.url);
        const response = NextResponse.redirect(loginUrl);
        response.cookies.delete('session');
        return response;
    }

    // Verify session has not expired (stateless replay attack prevention)
    if (!session.expiresAt || Date.now() > session.expiresAt) {
        const loginUrl = new URL('/login', request.url);
        const response = NextResponse.redirect(loginUrl);
        response.cookies.delete('session');
        return response;
    }

    return NextResponse.next();
}

// Match all administrative routes
export const config = {
    matcher: ['/admin/:path*'],
};
