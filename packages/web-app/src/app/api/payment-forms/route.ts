import { FormAppearance, PaymentForm } from '@/schemas/payment-form';
import deleteDocument from '@/utils/deleteDocument';
import getCollection from '@/utils/getCollection';
import updateDocument from '@/utils/updateDocument';
import uploadDocument from '@/utils/uploadDocument';
import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey } from '@/utils/apiKeyAuth';
import admin from '@/firebase/adminConfig';

const collectionName = 'payment-forms';
const idFieldName = 'paymentFormId';

// Default appearance settings
const defaultAppearance: FormAppearance = {
    colorScheme: 'slate',
    fontFamily: 'inter',
};

export const POST = async (request: NextRequest) => {
    const authHeader = request.headers.get('Authorization');
    const apiKeyUserId = await validateApiKey(authHeader);

    if (authHeader && !apiKeyUserId) {
        return NextResponse.json({ error: 'Unauthorized: Invalid API Key' }, { status: 401 });
    }

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
        userId: rawUserId,
        appearance = defaultAppearance, // Include appearance with default if not provided
    } = signUpFormData;

    const userId = apiKeyUserId || rawUserId;
    if (!userId) {
        return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

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

    try {
        await uploadDocument(collectionName, paymentFormData);
        return NextResponse.json({ message: 'POST to Firestore successful' });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'POST to Firestore failed' });
    }
};

export const GET = async (request: NextRequest) => {
    const authHeader = request.headers.get('Authorization');
    const apiKeyUserId = await validateApiKey(authHeader);

    if (authHeader && !apiKeyUserId) {
        return NextResponse.json({ error: 'Unauthorized: Invalid API Key' }, { status: 401 });
    }

    try {
        let paymentForms: any[] = [];
        if (apiKeyUserId) {
            // Filter by authenticated user's ID
            const db = admin.firestore();
            const snapshot = await db.collection(collectionName).where('userId', '==', apiKeyUserId).get();
            paymentForms = snapshot.docs.map(doc => ({ [idFieldName]: doc.id, ...doc.data() }));
        } else {
            // Fallback for dashboard/unauthenticated admin (legacy behavior)
            paymentForms = await getCollection(collectionName, idFieldName);
        }

        // Ensure each form has appearance data
        const formsWithAppearance = paymentForms.map((form) => {
            if (!form.appearance) {
                return {
                    ...form,
                    appearance: defaultAppearance,
                };
            }
            return form;
        });

        return NextResponse.json(formsWithAppearance);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'GET from Firestore failed' });
    }
};

export const PATCH = async (request: NextRequest) => {
    const url = new URL(request.url);
    const paymentFormId = url.searchParams.get('paymentFormId');
    if (!paymentFormId) {
        return NextResponse.json({ error: 'No paymentFormId provided' }, { status: 400 });
    }

    const authHeader = request.headers.get('Authorization');
    const apiKeyUserId = await validateApiKey(authHeader);

    if (authHeader && !apiKeyUserId) {
        return NextResponse.json({ error: 'Unauthorized: Invalid API Key' }, { status: 401 });
    }

    try {
        const paymentFormData: PaymentForm = await request.json();

        // If authenticated via API Key, verify ownership of the form
        if (apiKeyUserId) {
            const db = admin.firestore();
            const docSnap = await db.collection(collectionName).doc(paymentFormId).get();
            if (!docSnap.exists) {
                return NextResponse.json({ error: 'Payment form not found' }, { status: 404 });
            }
            const existingForm = docSnap.data();
            
            const isUnassigned = !existingForm?.userId;
            const isFallbackUser = existingForm?.userId === 'test-user-mcp';
            const isOwner = existingForm?.userId === apiKeyUserId;

            if (!isOwner && !isUnassigned && !isFallbackUser) {
                return NextResponse.json({ error: 'Forbidden: You do not own this payment form' }, { status: 403 });
            }
            // Enforce resolved userId
            paymentFormData.userId = apiKeyUserId;
        }

        // Ensure appearance data exists
        if (!paymentFormData.appearance) {
            paymentFormData.appearance = defaultAppearance;
        }

        await updateDocument(collectionName, paymentFormId, paymentFormData);
        return NextResponse.json({ message: 'PATCH to Firestore successful' });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'PATCH to Firestore failed' });
    }
};

export const DELETE = async (request: NextRequest) => {
    const url = new URL(request.url);
    const paymentFormId = url.searchParams.get('paymentFormId');
    if (!paymentFormId) {
        return NextResponse.json({ error: 'No paymentFormId provided' }, { status: 400 });
    }

    const authHeader = request.headers.get('Authorization');
    const apiKeyUserId = await validateApiKey(authHeader);

    if (authHeader && !apiKeyUserId) {
        return NextResponse.json({ error: 'Unauthorized: Invalid API Key' }, { status: 401 });
    }

    try {
        if (apiKeyUserId) {
            const db = admin.firestore();
            const docSnap = await db.collection(collectionName).doc(paymentFormId).get();
            if (!docSnap.exists) {
                return NextResponse.json({ error: 'Payment form not found' }, { status: 404 });
            }
            const existingForm = docSnap.data();
            
            const isUnassigned = !existingForm?.userId;
            const isFallbackUser = existingForm?.userId === 'test-user-mcp';
            const isOwner = existingForm?.userId === apiKeyUserId;

            if (!isOwner && !isUnassigned && !isFallbackUser) {
                return NextResponse.json({ error: 'Forbidden: You do not own this payment form' }, { status: 403 });
            }
        }

        await deleteDocument(collectionName, paymentFormId);
        return NextResponse.json({
            message: 'DELETE from Firestore successful',
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'DELETE from Firestore failed' });
    }
};

