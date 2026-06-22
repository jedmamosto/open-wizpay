import admin from '@/firebase/adminConfig';
import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey } from '@/utils/apiKeyAuth';

const collectionName = 'payment-forms';

export const GET = async (request: NextRequest) => {
    const { searchParams } = new URL(request.url);
    const paymentFormId = searchParams.get('paymentFormId');

    if (!paymentFormId) {
        return NextResponse.json(
            { error: 'Payment form ID is required' },
            { status: 400 }
        );
    }

    const authHeader = request.headers.get('Authorization');
    const apiKeyUserId = await validateApiKey(authHeader);

    if (authHeader && !apiKeyUserId) {
        return NextResponse.json({ error: 'Unauthorized: Invalid API Key' }, { status: 401 });
    }

    try {
        const db = admin.firestore();
        const docSnap = await db.collection(collectionName).doc(paymentFormId).get();

        if (docSnap.exists) {
            const data = docSnap.data();
            if (data) {
                // If authenticated via API Key, verify ownership
                if (apiKeyUserId && data.userId !== apiKeyUserId) {
                    return NextResponse.json({ error: 'Forbidden: You do not own this payment form' }, { status: 403 });
                }
                const sanitized = { ...data };
                delete sanitized.paymentFormPaymongoSecKey;
                delete sanitized.paymentFormPaymongoPubKey;
                return NextResponse.json(sanitized);
            }
        }
        return NextResponse.json(null);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'GET from Firestore failed' }, { status: 500 });
    }
};
