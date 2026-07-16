import { DBProduct, getDatabaseAdapter } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

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

        const db = getDatabaseAdapter();

        // Get payment form data to retrieve user's Paymongo credentials
        const paymentFormData = await db.getPaymentForm(paymentFormId);

        if (!paymentFormData) {
            return NextResponse.json(
                {
                    error: 'Payment form not found',
                },
                { status: 404 }
            );
        }

        // In single-tenant self-hosted mode, read secrets from environment variables.
        // Fall back to database values if env keys are not present.
        const secretKey =
            process.env.PAYMONGO_SECRET_KEY || paymentFormData.paymentFormPaymongoSecKey;
        if (!secretKey) {
            return NextResponse.json(
                {
                    error: 'Payment form secret key not configured',
                },
                { status: 400 }
            );
        }

        const token = url.searchParams.get('token');

        if (!token) {
            console.log('Missing verification token for form:', paymentFormId);
            return NextResponse.redirect(paymentFormData.paymentFormCancelURL);
        }

        console.log('Querying database for checkout session with token:', token);
        const recentStoredSession = await db.getCheckoutSessionByToken(token);

        if (!recentStoredSession) {
            console.log('No checkout session found for token:', token);
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

        console.log(
            'Payment status for session:',
            recentStoredSession.checkoutSessionId,
            'is:',
            paymentStatus
        );

        // Check if payment was successful
        if (paymentStatus === 'succeeded') {
            const originalSuccessUrl = paymentFormData.paymentFormSuccessURL;

            // Enforce idempotency: check if already processed
            if (recentStoredSession.status === 'paid') {
                console.log(
                    'Session already paid and processed:',
                    recentStoredSession.checkoutSessionId
                );
                return NextResponse.redirect(originalSuccessUrl);
            }

            // Payment successful - trigger external webhook
            const webhookUrl = paymentFormData.paymentFormWebhookURL;

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
                        totalAmount:
                            recentStoredSession.selectedProducts?.reduce(
                                (total: number, product: DBProduct) =>
                                    total + (product.productPrice || 0),
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
                    // Continue even if webhook fails
                }
            }

            // Mark session as paid in database to guarantee idempotency
            try {
                await db.updateCheckoutSession(recentStoredSession.checkoutSessionId, {
                    status: 'paid',
                    paidAt: new Date().toISOString(),
                });
                console.log(
                    'Checkout session marked as paid in database:',
                    recentStoredSession.checkoutSessionId
                );
            } catch (dbError) {
                console.error('Failed to update checkout session status:', dbError);
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
                const db = getDatabaseAdapter();
                const paymentFormData = await db.getPaymentForm(paymentFormId);
                if (paymentFormData) {
                    return NextResponse.redirect(paymentFormData.paymentFormCancelURL);
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
