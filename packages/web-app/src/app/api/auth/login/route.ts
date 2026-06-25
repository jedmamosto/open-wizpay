import { NextRequest, NextResponse } from 'next/server';
import { encryptSession } from '@/utils/session';

/**
 * Constant-time string comparison to prevent side-channel timing attacks
 */
function timingSafeCompare(a: string, b: string): boolean {
    let diff = a.length ^ b.length;
    const maxLen = Math.max(a.length, b.length);
    for (let i = 0; i < maxLen; i++) {
        const charA = i < a.length ? a.charCodeAt(i) : 0;
        const charB = i < b.length ? b.charCodeAt(i) : 0;
        diff |= charA ^ charB;
    }
    return diff === 0;
}

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();
        
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@wizpay.local';
        const adminPassword = process.env.ADMIN_PASSWORD || 'admin-secure-password';

        // Fail-safe security check for production deployments
        if (process.env.NODE_ENV === 'production') {
            if (!process.env.SESSION_SECRET || process.env.SESSION_SECRET === 'a_very_long_secure_random_string_for_signing_sessions') {
                console.error('CRITICAL: Default or missing SESSION_SECRET in production. Access blocked.');
                return NextResponse.json({ error: 'Internal configuration error.' }, { status: 500 });
            }
            if (adminPassword === 'admin-secure-password') {
                console.error('CRITICAL: Default ADMIN_PASSWORD in production. Access blocked.');
                return NextResponse.json({ error: 'Internal configuration error.' }, { status: 500 });
            }
        }

        const cleanEmail = email?.trim().toLowerCase() || '';
        const isEmailMatch = timingSafeCompare(cleanEmail, adminEmail.trim().toLowerCase());
        const isPasswordMatch = password ? timingSafeCompare(password, adminPassword) : false;

        if (!isEmailMatch || !isPasswordMatch) {
            return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
        }

        // Generate stateless session token valid for 7 days
        const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;
        const sessionPayload = {
            email: adminEmail,
            expiresAt,
        };

        const sessionToken = await encryptSession(sessionPayload);

        const response = NextResponse.json({ success: true, message: 'Logged in successfully' });

        // Set HTTP-only secure cookie for authentication
        response.cookies.set('session', sessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
            path: '/',
        });

        return response;
    } catch (error) {
        console.error('Authentication login API error:', error);
        return NextResponse.json({ error: 'Login process encountered an error.' }, { status: 500 });
    }
}
