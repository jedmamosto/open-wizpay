import { getDatabaseAdapter } from '@/lib/db';
import { validateApiKey } from '@/utils/apiKeyAuth';
import { NextRequest, NextResponse } from 'next/server';

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
        const db = getDatabaseAdapter();
        const paymentForm = await db.getPaymentForm(paymentFormId);

        if (paymentForm) {
            // If authenticated via API Key, verify ownership
            if (apiKeyUserId && paymentForm.userId !== apiKeyUserId) {
                return NextResponse.json(
                    { error: 'Forbidden: You do not own this payment form' },
                    { status: 403 }
                );
            }
            const {
                paymentFormPaymongoSecKey,
                paymentFormPaymongoPubKey,
                ...sanitized
            } = paymentForm;
            return NextResponse.json(sanitized);
        }
        return NextResponse.json(null);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'GET from database failed' }, { status: 500 });
    }
};
