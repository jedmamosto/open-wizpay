import admin from '@/firebase/adminConfig';
import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const collectionName = 'api-keys';

const cacheBustingHeaders = {
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
};

// Helper to get userId from session cookie
async function getUserIdFromSession(request: NextRequest): Promise<string | null> {
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

// GET: List all keys for a user (masked)
export const GET = async (request: NextRequest) => {
    const activeProject = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'unknown';
    console.log(`[Developer Keys GET] Query run against Firebase project: ${activeProject}`);

    // Try to get userId from session cookie first
    let userId = await getUserIdFromSession(request);

    if (!userId) {
        // Fallback to query param for development/testing
        const { searchParams } = new URL(request.url);
        userId = searchParams.get('userId');
    }

    if (!userId) {
        return NextResponse.json(
            { error: 'Unauthorized: No valid session or User ID found' },
            { status: 401, headers: cacheBustingHeaders }
        );
    }

    try {
        const db = admin.firestore();
        const snapshot = await db
            .collection(collectionName)
            .where('userId', '==', userId)
            .orderBy('createdAt', 'desc')
            .get();

        const keys = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                keyName: data.keyName || 'Default Key',
                createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
                maskedKey: data.maskedKey || 'wzp_live_••••••••',
            };
        });

        return NextResponse.json(keys, { headers: cacheBustingHeaders });
    } catch (error) {
        console.error('Error listing API keys:', error);
        return NextResponse.json(
            { error: 'Failed to list API keys' },
            { status: 500, headers: cacheBustingHeaders }
        );
    }
};

// POST: Create a new API key and return the plain value once
export const POST = async (request: NextRequest) => {
    const activeProject = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'unknown';
    console.log(`[Developer Keys POST] Generate key against Firebase project: ${activeProject}`);

    try {
        const body = await request.json();
        const { keyName = 'MCP Agent Integration' } = body;

        // Try to get userId from session cookie first
        let userId = await getUserIdFromSession(request);

        if (!userId) {
            // Fallback to request body for backwards compatibility
            userId = body.userId;
        }

        if (!userId) {
            return NextResponse.json(
                { error: 'Unauthorized: User ID is required' },
                { status: 401, headers: cacheBustingHeaders }
            );
        }

        // Generate cryptographically secure plain key
        const randomBytes = crypto.randomBytes(20).toString('hex');
        const plainKey = `wzp_live_${randomBytes}`;
        
        // Hash it using SHA-256 for secure database storage
        const hashedKey = crypto.createHash('sha256').update(plainKey).digest('hex');
        
        // Mask it for UI list display
        const maskedKey = `wzp_live_••••${plainKey.slice(-4)}`;

        const db = admin.firestore();
        await db.collection(collectionName).add({
            userId,
            hashedKey,
            maskedKey,
            keyName,
            createdAt: admin.firestore.Timestamp.now(),
        });

        return NextResponse.json({ apiKey: plainKey }, { headers: cacheBustingHeaders });
    } catch (error) {
        console.error('Error generating API key:', error);
        return NextResponse.json(
            { error: 'Failed to generate API key' },
            { status: 500, headers: cacheBustingHeaders }
        );
    }
};

// DELETE: Revoke/delete an API key
export const DELETE = async (request: NextRequest) => {
    const activeProject = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'unknown';
    console.log(`[Developer Keys DELETE] Revoke key against Firebase project: ${activeProject}`);

    const { searchParams } = new URL(request.url);
    const keyId = searchParams.get('keyId');
    
    // Try to get userId from session cookie first
    let userId = await getUserIdFromSession(request);

    if (!userId) {
        // Fallback to query param
        userId = searchParams.get('userId');
    }

    if (!keyId || !userId) {
        return NextResponse.json(
            { error: 'keyId and userId/session are required' },
            { status: 400, headers: cacheBustingHeaders }
        );
    }

    try {
        const db = admin.firestore();
        const docRef = db.collection(collectionName).doc(keyId);
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            return NextResponse.json(
                { error: 'Key not found' },
                { status: 404, headers: cacheBustingHeaders }
            );
        }

        if (docSnap.data()?.userId !== userId) {
            return NextResponse.json(
                { error: 'Forbidden: You do not own this key' },
                { status: 403, headers: cacheBustingHeaders }
            );
        }

        await docRef.delete();
        return NextResponse.json({ message: 'Key successfully revoked' }, { headers: cacheBustingHeaders });
    } catch (error) {
        console.error('Error revoking API key:', error);
        return NextResponse.json(
            { error: 'Failed to revoke API key' },
            { status: 500, headers: cacheBustingHeaders }
        );
    }
};
