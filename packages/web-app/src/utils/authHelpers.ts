import { NextRequest } from 'next/server';
import { UserRole, UserStatus } from '@/schemas/users';
import { validateApiKey } from '@/utils/apiKeyAuth';
import { decryptSession } from './session';

export interface AuthenticatedUser {
    uid: string;
    role: UserRole;
    status: UserStatus;
    email: string;
    name: string;
}

/**
 * Resolves the authenticated user ID from either the Authorization header (API Key)
 * or the session cookie.
 */
export async function getUserId(request: NextRequest): Promise<string | null> {
    const authHeader = request.headers.get('Authorization');
    if (authHeader) {
        return await validateApiKey(authHeader);
    }

    const sessionCookie = request.cookies.get('session')?.value;
    if (!sessionCookie) {
        return null;
    }

    // Handle developer sandbox fallback bypass
    if (sessionCookie === 'test-user-mcp') {
        return 'test-user-mcp';
    }

    try {
        const session = await decryptSession(sessionCookie);
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@wizpay.local';
        
        if (!session || session.email !== adminEmail) {
            return null;
        }

        // Verify session expiration
        if (!session.expiresAt || Date.now() > session.expiresAt) {
            return null;
        }

        // Return a static admin ID so the database scopes all forms to this user
        return 'admin-user-id';
    } catch (error) {
        console.error('Session decryption failed:', error);
        return null;
    }
}

/**
 * Resolves the fully authenticated user profile from the session.
 */
export async function getAuthenticatedUser(request: NextRequest): Promise<AuthenticatedUser | null> {
    const uid = await getUserId(request);
    if (!uid) return null;

    // Handle developer fallback user bypass
    if (uid === 'test-user-mcp') {
        return {
            uid,
            role: UserRole.superAdmin,
            status: UserStatus.active,
            email: 'mcp-dev@wizpay.local',
            name: 'MCP Developer Fallback',
        };
    }

    return {
        uid,
        role: UserRole.superAdmin,
        status: UserStatus.active,
        email: process.env.ADMIN_EMAIL || 'admin@wizpay.local',
        name: 'Administrator',
    };
}
