import admin from '@/firebase/adminConfig';
import { NextRequest, NextResponse } from 'next/server';

const collectionName = 'payment-forms';

// CORS response helper function
const corsResponse = (data: unknown, status = 200) => {
    const response = NextResponse.json(data, { status });
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return response;
};

// Handle OPTIONS preflight requests
export const OPTIONS = async () => {
    const response = new NextResponse(null, { status: 204 });
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return response;
};

export const GET = async (
    request: NextRequest,
    { params }: { params: Promise<{ paymentFormId: string }> }
) => {
    try {
        const { paymentFormId } = await params;

        if (!paymentFormId) {
            return corsResponse({ error: 'Payment form ID is required' }, 400);
        }

        const db = admin.firestore();
        const docSnap = await db.collection(collectionName).doc(paymentFormId).get();

        if (!docSnap.exists) {
            return corsResponse({ error: 'Payment form not found' }, 404);
        }

        const paymentForm = docSnap.data();
        if (!paymentForm) {
            return corsResponse({ error: 'Failed to read form data' }, 500);
        }

        // Sanitize sensitive credentials and administrative metadata
        const sanitized = { ...paymentForm };
        delete sanitized.paymentFormPaymongoSecKey;
        delete sanitized.paymentFormPaymongoPubKey;
        delete sanitized.userId;

        return corsResponse(sanitized);
    } catch (error) {
        console.error('Error fetching public form data:', error);
        return corsResponse({ error: 'Failed to fetch form data' }, 500);
    }
};
