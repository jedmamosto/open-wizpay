import queryDocument from '@/utils/queryDocument';
import { NextRequest, NextResponse } from 'next/server';
import admin from '@/firebase/adminConfig';
import { Product } from '@/schemas/payment-form';

interface StoredCheckoutSession {
    checkoutSessionId: string;
    paymentFormId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    selectedProducts: Product[];
    createdAt: string;
}

export const GET = async (request: NextRequest) => {
    try {
        const url = new URL(request.url);
        const paymentFormId = url.searchParams.get('form');

        if (!paymentFormId) {
            return NextResponse.json(
                {
                    error: 'Missing form parameter',
                },
                { status: 400 }
            );
        }

        // Get payment form data to retrieve user's Paymongo credentials
        const paymentFormData = await queryDocument(
            'payment-forms',
            'id',
            paymentFormId
        );

        if (!paymentFormData) {
            return NextResponse.json(
                {
                    error: 'Payment form not found',
                },
                { status: 404 }
            );
        }

        const secretKey = paymentFormData.paymentFormPaymongoSecKey;
        if (!secretKey) {
            return NextResponse.json(
                {
                    error: 'Payment form secret key not configured',
                },
                { status: 400 }
            );
        }

        // Query our database for recent checkout sessions for this payment form
        console.log('Querying our database for checkout sessions for form:', paymentFormId);
        console.log(
            'Using secret key prefix:',
            secretKey.substring(0, 10) + '...'
        );

        // Query database for checkout sessions matching this paymentFormId
        const db = admin.firestore();
        const snapshot = await db.collection('checkout-sessions')
            .where('paymentFormId', '==', paymentFormId)
            .get();

        const storedSessions = snapshot.docs.map(doc => ({
            checkoutSessionId: doc.id,
            ...doc.data()
        })) as StoredCheckoutSession[];
        console.log('Found', storedSessions.length, 'stored checkout sessions for form:', paymentFormId);

        // Find the most recent session for this form (within last 10 minutes)
        const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
        const recentStoredSession = storedSessions
            .filter((session) => session.createdAt > tenMinutesAgo)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

        if (!recentStoredSession) {
            console.log('No recent checkout session found for form:', paymentFormId);
            return NextResponse.redirect(paymentFormData.paymentFormCancelURL);
        }

        console.log('Found stored session:', recentStoredSession.checkoutSessionId);

        // Now fetch the specific checkout session from Paymongo to check payment status
        const checkoutSessionResponse = await fetch(
            `https://api.paymongo.com/v1/checkout_sessions/${recentStoredSession.checkoutSessionId}`,
            {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    authorization: `Basic ${Buffer.from(secretKey).toString('base64')}`,
                },
            }
        );

        if (!checkoutSessionResponse.ok) {
            const errorText = await checkoutSessionResponse.text();
            console.error('Failed to fetch specific checkout session:', {
                status: checkoutSessionResponse.status,
                error: errorText,
            });
            return NextResponse.redirect(paymentFormData.paymentFormCancelURL);
        }

        const checkoutSession = await checkoutSessionResponse.json();
        const sessionData = checkoutSession.data;
        const paymentStatus = sessionData.attributes.payment_intent?.attributes?.status;

        console.log('Payment status for session:', recentStoredSession.checkoutSessionId, 'is:', paymentStatus);

        // Check if payment was successful
        if (paymentStatus === 'succeeded') {
            // Payment successful - trigger external webhook
            const webhookUrl = paymentFormData.paymentFormWebhookURL;
            const originalSuccessUrl = paymentFormData.paymentFormSuccessURL;

            if (webhookUrl) {
                try {
                    // Prepare webhook payload using stored session data
                    const webhookPayload = {
                        paymentStatus: 'successful',
                        checkoutSessionId: recentStoredSession.checkoutSessionId,
                        customerName: recentStoredSession.customerName,
                        customerEmail: recentStoredSession.customerEmail,
                        customerPhone: recentStoredSession.customerPhone,
                        paymentFormId: paymentFormId,
                        products: recentStoredSession.selectedProducts,
                        totalAmount: recentStoredSession.selectedProducts?.reduce(
                            (total: number, product: Product) => total + (product.productPrice || 0),
                            0
                        ) || 0,
                        currency: 'PHP',
                        paidAt: new Date().toISOString(),
                    };

                    // Send to external webhook (Pabbly, Zapier, etc.)
                    await fetch(webhookUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(webhookPayload),
                    });

                    console.log(
                        'Webhook sent successfully for session:',
                        recentStoredSession.checkoutSessionId
                    );
                } catch (error) {
                    console.error('Failed to send webhook:', error);
                    // Continue with redirect even if webhook fails
                }
            }

            // Redirect to original success URL
            return NextResponse.redirect(originalSuccessUrl);
        } else {
            // Payment not successful - redirect to cancel URL
            console.log('Payment not successful, status:', paymentStatus);
            return NextResponse.redirect(paymentFormData.paymentFormCancelURL);
        }
    } catch (error) {
        console.error('Payment verification error:', error);

        // Try to get payment form for fallback redirect
        try {
            const paymentFormId = new URL(request.url).searchParams.get('form');
            if (paymentFormId) {
                const paymentFormData = await queryDocument(
                    'payment-forms',
                    'id',
                    paymentFormId
                );
                if (paymentFormData) {
                    return NextResponse.redirect(
                        paymentFormData.paymentFormCancelURL
                    );
                }
            }
        } catch (fallbackError) {
            console.error('Fallback redirect error:', fallbackError);
        }

        return NextResponse.json(
            {
                error: 'Payment verification failed',
            },
            { status: 500 }
        );
    }
};
