import admin from '@/firebase/adminConfig';
import { NextRequest } from 'next/server';
import { UserRole, UserStatus } from '@/schemas/users';
import { validateApiKey } from '@/utils/apiKeyAuth';

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
    try {
        const decodedToken = await admin.auth().verifyIdToken(sessionCookie);
        return decodedToken.uid;
    } catch (error) {
        console.error('Session token verification failed:', error);
        return null;
    }
}

export interface AuthenticatedUser {
    uid: string;
    role: UserRole;
    status: UserStatus;
    email: string;
    name: string;
}

/**
 * Resolves the fully authenticated user profile from Firestore, checking roles and status.
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

    try {
        const db = admin.firestore();
        const querySnap = await db
            .collection('users')
            .where('userId', '==', uid)
            .limit(1)
            .get();

        if (querySnap.empty) {
            return null;
        }

        const userData = querySnap.docs[0].data();
        return {
            uid,
            role: userData.userRole as UserRole,
            status: userData.userStatus as UserStatus,
            email: userData.userEmail || '',
            name: userData.userName || '',
        };
    } catch (error) {
        console.error('Error fetching authenticated user data:', error);
        return null;
    }
}
