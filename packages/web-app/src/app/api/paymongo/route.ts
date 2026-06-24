// route.ts
import { CheckoutInfo } from '@/schemas/checkout-info';
import { Product } from '@/schemas/payment-form';
import queryDocument from '@/utils/queryDocument';
import uploadDocument from '@/utils/uploadDocument';
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export const POST = async (request: NextRequest) => {
    const url = new URL(request.url);
    const paymentFormId = url.searchParams.get('paymentFormId');

    if (!paymentFormId)
        return NextResponse.json({ error: 'No payment form ID' });
    // console.log('Payment Form ID: ', paymentFormId);

    try {
        const requestedData = await request.json();
        const {
            checkoutName,
            checkoutEmail,
            checkoutPhone,
            selectedProducts,
        }: CheckoutInfo & { selectedProducts: Product[] } = requestedData;
        // console.log('Requested Data: ', requestedData);

        const paymentFormData = await queryDocument(
            'payment-forms',
            'id',
            paymentFormId
        );
        // console.log(paymentFormData);

        if (!paymentFormData)
            return NextResponse.json({ error: 'No payment form data' });

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
                return NextResponse.json({ 
                    error: `Invalid product selection: "${clientProduct.productName}" is not on this form.` 
                }, { status: 400 });
            }
            lineItems.push({
                currency: 'PHP',
                amount: dbProduct.productPrice * 100,
                description: dbProduct.productDescription || 'No description provided',
                name: dbProduct.productName,
                quantity: 1,
            });
        }
        // console.log('Line Items: ', lineItems);

        const secretKey = paymentFormData.paymentFormPaymongoSecKey;
        if (!secretKey) return NextResponse.json({ error: 'No secret key' });

        const createCheckoutSession = await fetch(
            'https://api.paymongo.com/v1/checkout_sessions',
            {
                method: 'POST',
                headers: {
                    accept: 'application/json',
                    'Content-Type': 'application/json',
                    authorization: `Basic ${Buffer.from(secretKey).toString('base64')}`,
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
                            ],
                            cancel_url: paymentFormData.paymentFormCancelURL,
                            success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/payment-verify?form=${paymentFormId}&token=${paymentToken}`,
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
        // console.log('Checkout Session Response: ', checkoutResponse);

        const checkoutURL = checkoutResponse.data.attributes.checkout_url;
        const checkoutSessionId = checkoutResponse.data.id;
        // console.log('Checkout URL: ', checkoutURL);

        if (createCheckoutSession.ok) {
            // Store checkout session data for later verification
            try {
                await uploadDocument('checkout-sessions', {
                    checkoutSessionId,
                    paymentFormId,
                    customerName: checkoutName,
                    customerEmail: checkoutEmail,
                    customerPhone: checkoutPhone,
                    selectedProducts,
                    createdAt: new Date().toISOString(),
                    status: 'pending',
                    paymentToken
                });
                console.log('Checkout session stored:', checkoutSessionId);
            } catch (error) {
                console.error('Failed to store checkout session:', error);
                // Continue even if storage fails
            }

            return NextResponse.json({ checkoutURL });
        } else {
            return NextResponse.json({
                error: 'Failed to create a checkout session',
                details: checkoutResponse,
            });
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal server error' });
    }
};

