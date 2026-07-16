import { getDatabaseAdapter } from '@/lib/db';
import { verifyPaymongoSignature } from '@/utils/crypto';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (request: NextRequest) => {
    try {
        const signatureHeader = request.headers.get('X-Paymongo-Signature');
        if (!signatureHeader) {
            return NextResponse.json({ error: 'Missing signature header' }, { status: 400 });
        }

        const webhookSecret = process.env.PAYMONGO_WEBHOOK_SECRET;
        if (!webhookSecret) {
            console.error('PAYMONGO_WEBHOOK_SECRET is not configured in environment');
            return NextResponse.json(
                { error: 'Server webhook secret configuration error' },
                { status: 500 }
            );
        }

        const rawBody = await request.text();
        const isValid = verifyPaymongoSignature(signatureHeader, rawBody, webhookSecret);

        if (!isValid) {
            console.warn('Invalid signature for PayMongo webhook request');
            return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
        }

        const payload = JSON.parse(rawBody);
        const eventType = payload.data?.attributes?.type;
        const resource = payload.data?.attributes?.resource;

        console.log(`Received PayMongo webhook event: ${eventType}`);

        if (eventType === 'checkout_session.payment.paid') {
            const checkoutSessionId = resource?.id;
            if (!checkoutSessionId) {
                return NextResponse.json({ error: 'Missing checkout session ID in resource' }, { status: 400 });
            }

            const db = getDatabaseAdapter();
            const storedSession = await db.getCheckoutSession(checkoutSessionId);

            if (!storedSession) {
                console.warn(`Webhook received for unknown checkout session: ${checkoutSessionId}`);
                return NextResponse.json({ error: 'Checkout session not found' }, { status: 404 });
            }

            // Check if already paid to prevent double-firing
            if (storedSession.status === 'paid') {
                console.log(`Checkout session ${checkoutSessionId} already marked as paid`);
                return NextResponse.json({ received: true });
            }

            // Get the parent payment form to fetch merchant's webhook URL
            const paymentForm = await db.getPaymentForm(storedSession.paymentFormId);
            if (paymentForm) {
                const webhookUrl = paymentForm.paymentFormWebhookURL;
                if (webhookUrl) {
                    try {
                        const webhookPayload = {
                            paymentStatus: 'successful',
                            checkoutSessionId: storedSession.checkoutSessionId,
                            customerName: storedSession.customerName,
                            customerEmail: storedSession.customerEmail,
                            customerPhone: storedSession.customerPhone,
                            paymentFormId: storedSession.paymentFormId,
                            products: storedSession.selectedProducts,
                            totalAmount: storedSession.selectedProducts?.reduce(
                                (total: number, product) => total + (product.productPrice || 0),
                                0
                            ) || 0,
                            currency: 'PHP',
                            paidAt: new Date().toISOString(),
                        };

                        await fetch(webhookUrl, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(webhookPayload),
                        });
                        console.log(`Merchant webhook triggered successfully for ${checkoutSessionId}`);
                    } catch (webhookError) {
                        console.error('Failed to send custom merchant webhook notification:', webhookError);
                    }
                }
            }

            // Update session status in database
            await db.updateCheckoutSession(checkoutSessionId, {
                status: 'paid',
                paidAt: new Date().toISOString(),
            });

            console.log(`Checkout session ${checkoutSessionId} successfully marked as paid via webhook`);
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error('PayMongo Webhook Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
};
