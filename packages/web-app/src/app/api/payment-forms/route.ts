import { FormAppearance, PaymentForm } from '@/schemas/payment-form';
import { NextRequest, NextResponse } from 'next/server';
import { getDatabaseAdapter } from '@/lib/db';
import { getUserId } from '@/utils/authHelpers';

const idFieldName = 'paymentFormId';

const defaultAppearance: FormAppearance = {
    colorScheme: 'slate',
    fontFamily: 'inter',
};

export const POST = async (request: NextRequest) => {
    const userId = await getUserId(request);
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const signUpFormData: PaymentForm = await request.json();
        const {
            paymentFormTitle,
            paymentFormDescription,
            paymentFormSuccessURL,
            paymentFormCancelURL,
            paymentFormWebhookURL,
            paymentFormPaymongoPubKey,
            paymentFormPaymongoSecKey,
            paymentFormProducts,
            appearance = defaultAppearance,
        } = signUpFormData;

        const paymentFormData: PaymentForm = {
            paymentFormTitle,
            paymentFormDescription,
            paymentFormSuccessURL,
            paymentFormCancelURL,
            paymentFormWebhookURL: paymentFormWebhookURL || '',
            paymentFormPaymongoPubKey,
            paymentFormPaymongoSecKey,
            paymentFormProducts,
            userId,
            ...(appearance && { appearance }),
        };

        const db = getDatabaseAdapter();
        await db.savePaymentForm(paymentFormData);
        return NextResponse.json({ message: 'POST to database successful' });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'POST to database failed' }, { status: 500 });
    }
};

export const GET = async (request: NextRequest) => {
    const userId = await getUserId(request);
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const db = getDatabaseAdapter();
        const paymentForms = await db.listPaymentForms(userId);

        // Mask sensitive merchant credentials and ensure appearance data
        const processedForms = paymentForms.map((form) => {
            const sanitized = { ...form };
            
            // Mask the Paymongo Secret Key
            if (sanitized.paymentFormPaymongoSecKey) {
                const len = sanitized.paymentFormPaymongoSecKey.length;
                if (len > 8) {
                    sanitized.paymentFormPaymongoSecKey = sanitized.paymentFormPaymongoSecKey.substring(0, 8) + '••••••••';
                } else {
                    sanitized.paymentFormPaymongoSecKey = '••••••••';
                }
            }
            
            if (!sanitized.appearance) {
                sanitized.appearance = defaultAppearance;
            }
            return sanitized;
        });

        return NextResponse.json(processedForms);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'GET from database failed' }, { status: 500 });
    }
};

export const PATCH = async (request: NextRequest) => {
    const url = new URL(request.url);
    const paymentFormId = url.searchParams.get('paymentFormId');
    if (!paymentFormId) {
        return NextResponse.json({ error: 'No paymentFormId provided' }, { status: 400 });
    }

    const userId = await getUserId(request);
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const db = getDatabaseAdapter();
        const existingForm = await db.getPaymentForm(paymentFormId);
        if (!existingForm) {
            return NextResponse.json({ error: 'Payment form not found' }, { status: 404 });
        }

        // Enforce ownership: only allow updates if the user owns the form
        const isOwner = existingForm.userId === userId;

        if (!isOwner) {
            return NextResponse.json({ error: 'Forbidden: You do not own this payment form' }, { status: 403 });
        }

        const paymentFormData: PaymentForm = await request.json();

        // If the submitted secret key is masked (i.e. contains bullet points), do not overwrite the existing key
        const submittedSecKey = paymentFormData.paymentFormPaymongoSecKey;
        if (submittedSecKey && (submittedSecKey.includes('••••') || submittedSecKey.includes('●') || submittedSecKey.includes('***'))) {
            paymentFormData.paymentFormPaymongoSecKey = existingForm.paymentFormPaymongoSecKey;
        }

        // Enforce resolved userId
        paymentFormData.userId = userId;

        // Ensure appearance data exists
        if (!paymentFormData.appearance) {
            paymentFormData.appearance = defaultAppearance;
        }

        // Include paymentFormId to perform update/upsert
        paymentFormData.paymentFormId = paymentFormId;

        await db.savePaymentForm(paymentFormData);
        return NextResponse.json({ message: 'PATCH to database successful' });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'PATCH to database failed' }, { status: 500 });
    }
};

export const DELETE = async (request: NextRequest) => {
    const url = new URL(request.url);
    const paymentFormId = url.searchParams.get('paymentFormId');
    if (!paymentFormId) {
        return NextResponse.json({ error: 'No paymentFormId provided' }, { status: 400 });
    }

    const userId = await getUserId(request);
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const db = getDatabaseAdapter();
        const existingForm = await db.getPaymentForm(paymentFormId);
        if (!existingForm) {
            return NextResponse.json({ error: 'Payment form not found' }, { status: 404 });
        }
        
        const isOwner = existingForm.userId === userId;

        if (!isOwner) {
            return NextResponse.json({ error: 'Forbidden: You do not own this payment form' }, { status: 403 });
        }

        await db.deletePaymentForm(paymentFormId);
        return NextResponse.json({
            message: 'DELETE from database successful',
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'DELETE from database failed' }, { status: 500 });
    }
};

