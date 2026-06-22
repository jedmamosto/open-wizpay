import admin from '@/firebase/adminConfig';
import crypto from 'crypto';

/**
 * Validates a Bearer API key against the 'api-keys' collection in Firestore.
 * Expects the authorization header value, e.g., 'Bearer wzp_live_abc123...'
 * Returns the associated userId if valid, or null if invalid.
 */
export async function validateApiKey(authHeader: string | null): Promise<string | null> {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }
    const token = authHeader.split(' ')[1];
    if (!token) return null;

    // Developer Fallback Check (bypasses DB query)
    const devApiKey = process.env.WIZPAY_DEV_API_KEY;
    if (devApiKey && token === devApiKey) {
        return "test-user-mcp"; // Return mock developer user ID
    }

    // Hash the token using sha256 to match the stored hash in the database
    const hashedKey = crypto.createHash('sha256').update(token).digest('hex');

    try {
        const db = admin.firestore();
        const querySnapshot = await db
            .collection('api-keys')
            .where('hashedKey', '==', hashedKey)
            .limit(1)
            .get();

        if (querySnapshot.empty) {
            return null;
        }

        const doc = querySnapshot.docs[0].data();
        return doc.userId || null;
    } catch (error) {
        console.error('Error validating API key:', error);
        return null;
    }
}
