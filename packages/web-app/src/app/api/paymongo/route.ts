// route.ts
import { getDatabaseAdapter } from '@/lib/db';
import { CheckoutInfo } from '@/schemas/checkout-info';
import { Product } from '@/schemas/payment-form';
import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (request: NextRequest) => {
    const url = new URL(request.url);
    const paymentFormId = url.searchParams.get('paymentFormId');

    if (!paymentFormId) {
        return NextResponse.json({ error: 'No payment form ID' });
    }

    try {
        const requestedData = await request.json();
        const {
            checkoutName,
            checkoutEmail,
            checkoutPhone,
            selectedProducts,
        }: CheckoutInfo & { selectedProducts: Product[] } = requestedData;

        const db = getDatabaseAdapter();
        const paymentFormData = await db.getPaymentForm(paymentFormId);

        if (!paymentFormData) {
            return NextResponse.json({ error: 'No payment form data' });
        }

        const paymentToken = crypto.randomUUID();

        // Securely look up prices from database
        const lineItems = [];
        for (const clientProduct of selectedProducts) {
            const dbProduct = paymentFormData.paymentFormProducts?.find(
                (p: Product) =>
                    (p.productId && p.productId === clientProduct.productId) ||
                    p.productName === clientProduct.productName
            );
            if (!dbProduct) {
                return NextResponse.json(
                    {
                        error: `Invalid product selection: "${clientProduct.productName}" is not on this form.`,
                    },
                    { status: 400 }
                );
            }
            lineItems.push({
                currency: 'PHP',
                amount: dbProduct.productPrice * 100,
                description: dbProduct.productDescription || 'No description provided',
                name: dbProduct.productName,
                quantity: 1,
            });
        }

        // In single-tenant self-hosted mode, read secrets from environment variables.
        // Fall back to database values if env keys are not present.
        const secretKey =
            process.env.PAYMONGO_SECRET_KEY || paymentFormData.paymentFormPaymongoSecKey;
        if (!secretKey) {
            return NextResponse.json({ error: 'No secret key configured' }, { status: 400 });
        }

        // Generate a deterministic idempotency key based on checkout details to avoid double-charging on duplicate requests
        const idempotencyPayload = JSON.stringify({
            paymentFormId,
            checkoutName,
            checkoutEmail,
            checkoutPhone,
            selectedProducts: selectedProducts.map(p => p.productId || p.productName),
        });
        const idempotencyKey = crypto
            .createHash('sha256')
            .update(idempotencyPayload)
            .digest('hex');

        const createCheckoutSession = await fetch(
            'https://api.paymongo.com/v2/checkout_sessions',
            {
                method: 'POST',
                headers: {
                    accept: 'application/json',
                    'Content-Type': 'application/json',
                    authorization: `Basic ${Buffer.from(secretKey).toString('base64')}`,
                    'Idempotency-Key': idempotencyKey,
                },
                body: JSON.stringify({
                    data: {
                        attributes: {
                            billing: {
                                email: checkoutEmail,
                                name: checkoutName,
                                phone: checkoutPhone,
                            },
                            send_email_receipt: false,
                            show_description: true,
                            show_line_items: true,
                            description: paymentFormData.paymentFormDescription,
                            line_items: lineItems,
                            payment_method_types: [
                                'qrph',
                                'billease',
                                'card',
                                'gcash',
                                'grab_pay',
                                'paymaya',
                                'shopee_pay',
                                'google_pay',
                            ],
                            cancel_url: paymentFormData.paymentFormCancelURL,
                            success_url: `${
                                process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
                            }/api/payment-verify?form=${paymentFormId}&token=${paymentToken}`,
                            metadata: {
                                payment_form_id: paymentFormId,
                                webhook_url: paymentFormData.paymentFormWebhookURL,
                                original_success_url: paymentFormData.paymentFormSuccessURL,
                                customer_name: checkoutName,
                                customer_email: checkoutEmail,
                                customer_phone: checkoutPhone,
                            },
                        },
                    },
                }),
            }
        );

        const checkoutResponse = await createCheckoutSession.json();

        if (createCheckoutSession.ok) {
            const checkoutURL = checkoutResponse.data.attributes.checkout_url;
            const checkoutSessionId = checkoutResponse.data.id;

            // Store checkout session data for later verification
            try {
                await db.createCheckoutSession({
                    checkoutSessionId,
                    paymentFormId,
                    customerName: checkoutName,
                    customerEmail: checkoutEmail,
                    customerPhone: checkoutPhone,
                    selectedProducts: selectedProducts.map((p) => ({
                        productId: p.productId || '',
                        productName: p.productName,
                        productPrice: p.productPrice,
                        quantity: 1, // Store as Product-like structured item matching DBProduct
                    })),
                    createdAt: new Date().toISOString(),
                    status: 'pending',
                    paymentToken,
                });
                console.log('Checkout session stored:', checkoutSessionId);
            } catch (error) {
                console.error('Failed to store checkout session:', error);
                // Continue even if storage fails
            }

            return NextResponse.json({ checkoutURL });
        } else {
            const status = createCheckoutSession.status || 400;
            const paymongoErrors = checkoutResponse.errors;
            let errorMessage = 'Failed to create a checkout session';
            if (Array.isArray(paymongoErrors) && paymongoErrors.length > 0) {
                errorMessage = paymongoErrors.map(e => `${e.detail || e.code}`).join(', ');
            }
            return NextResponse.json(
                {
                    error: errorMessage,
                    details: checkoutResponse,
                },
                { status }
            );
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal server error' });
    }
};
