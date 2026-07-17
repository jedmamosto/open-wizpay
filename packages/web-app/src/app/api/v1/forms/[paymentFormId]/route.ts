import { getDatabaseAdapter } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

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

        const db = getDatabaseAdapter();
        const paymentForm = await db.getPaymentForm(paymentFormId);

        if (!paymentForm) {
            return corsResponse({ error: 'Payment form not found' }, 404);
        }

        // Sanitize sensitive credentials and administrative metadata
        const {
            paymentFormPaymongoSecKey,
            paymentFormPaymongoPubKey,
            userId,
            ...sanitized
        } = paymentForm;

        return corsResponse(sanitized);
    } catch (error) {
        console.error('Error fetching public form data:', error);
        return corsResponse({ error: 'Failed to fetch form data' }, 500);
    }
};
