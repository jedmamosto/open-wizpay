import { PaymentForm } from '@/schemas/payment-form';
import crypto from 'crypto';
import { DBCheckoutSession, IDatabaseRepository } from '../db';
import { prisma } from '../prisma';

export class PrismaAdapter implements IDatabaseRepository {
    async getPaymentForm(paymentFormId: string): Promise<PaymentForm | null> {
        try {
            const form = await prisma.paymentForm.findUnique({
                where: { id: paymentFormId },
            });

            if (!form) {
                return null;
            }

            return {
                paymentFormId: form.id,
                // Include id field for backwards compatibility with legacy queries
                id: form.id,
                paymentFormTitle: form.paymentFormTitle,
                paymentFormDescription: form.paymentFormDescription,
                paymentFormSuccessURL: form.paymentFormSuccessURL,
                paymentFormCancelURL: form.paymentFormCancelURL,
                paymentFormWebhookURL: form.paymentFormWebhookURL,
                // In single-tenant self-hosted mode, read secrets from environment variables.
                // Fall back to empty string for types.
                paymentFormPaymongoPubKey: process.env.PAYMONGO_PUBLIC_KEY || '',
                paymentFormPaymongoSecKey: process.env.PAYMONGO_SECRET_KEY || '',
                paymentFormProducts: JSON.parse(form.paymentFormProducts),
                userId: form.userId,
                appearance: JSON.parse(form.appearance),
            } as PaymentForm;
        } catch (error) {
            console.error('PrismaAdapter: Error getting payment form:', error);
            return null;
        }
    }

    async listPaymentForms(userId: string): Promise<PaymentForm[]> {
        try {
            const forms = await prisma.paymentForm.findMany({
                where: { userId },
            });

            return forms.map((form) => ({
                paymentFormId: form.id,
                id: form.id,
                paymentFormTitle: form.paymentFormTitle,
                paymentFormDescription: form.paymentFormDescription,
                paymentFormSuccessURL: form.paymentFormSuccessURL,
                paymentFormCancelURL: form.paymentFormCancelURL,
                paymentFormWebhookURL: form.paymentFormWebhookURL,
                paymentFormPaymongoPubKey: process.env.PAYMONGO_PUBLIC_KEY || '',
                paymentFormPaymongoSecKey: process.env.PAYMONGO_SECRET_KEY || '',
                paymentFormProducts: JSON.parse(form.paymentFormProducts),
                userId: form.userId,
                appearance: JSON.parse(form.appearance),
            })) as PaymentForm[];
        } catch (error) {
            console.error('PrismaAdapter: Error listing payment forms:', error);
            return [];
        }
    }

    async savePaymentForm(
        data: Omit<PaymentForm, 'paymentFormId'> & { paymentFormId?: string }
    ): Promise<string> {
        try {
            const id = data.paymentFormId || crypto.randomUUID();
            const serializedProducts = JSON.stringify(data.paymentFormProducts || []);
            const serializedAppearance = JSON.stringify(data.appearance || {});

            const payload = {
                paymentFormTitle: data.paymentFormTitle,
                paymentFormDescription: data.paymentFormDescription,
                paymentFormSuccessURL: data.paymentFormSuccessURL,
                paymentFormCancelURL: data.paymentFormCancelURL,
                paymentFormWebhookURL: data.paymentFormWebhookURL || '',
                paymentFormProducts: serializedProducts,
                appearance: serializedAppearance,
                userId: data.userId || 'self-hosted-admin',
            };

            await prisma.paymentForm.upsert({
                where: { id },
                update: payload,
                create: {
                    ...payload,
                    id,
                },
            });

            return id;
        } catch (error) {
            console.error('PrismaAdapter: Error saving payment form:', error);
            throw error;
        }
    }

    async deletePaymentForm(paymentFormId: string): Promise<void> {
        try {
            await prisma.paymentForm.delete({
                where: { id: paymentFormId },
            });
        } catch (error) {
            console.error('PrismaAdapter: Error deleting payment form:', error);
            throw error;
        }
    }

    async createCheckoutSession(data: DBCheckoutSession): Promise<void> {
        try {
            await prisma.checkoutSession.create({
                data: {
                    id: data.checkoutSessionId,
                    paymentFormId: data.paymentFormId,
                    customerName: data.customerName,
                    customerEmail: data.customerEmail,
                    customerPhone: data.customerPhone,
                    selectedProducts: JSON.stringify(data.selectedProducts || []),
                    status: data.status,
                    paymentToken: data.paymentToken,
                    shippingAddress: data.shippingAddress || null,
                    createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
                    paidAt: data.paidAt ? new Date(data.paidAt) : null,
                },
            });
        } catch (error) {
            console.error('PrismaAdapter: Error creating checkout session:', error);
            throw error;
        }
    }

    async updateCheckoutSession(id: string, updates: Partial<DBCheckoutSession>): Promise<void> {
        try {
            const data: Record<string, unknown> = {};

            if (updates.status !== undefined) {
                data.status = updates.status;
            }
            if (updates.paidAt !== undefined) {
                data.paidAt = updates.paidAt ? new Date(updates.paidAt) : null;
            }
            if (updates.shippingAddress !== undefined) {
                data.shippingAddress = updates.shippingAddress;
            }

            await prisma.checkoutSession.update({
                where: { id },
                data,
            });
        } catch (error) {
            console.error('PrismaAdapter: Error updating checkout session:', error);
            throw error;
        }
    }

    async getCheckoutSession(id: string): Promise<DBCheckoutSession | null> {
        try {
            const session = await prisma.checkoutSession.findUnique({
                where: { id },
            });

            if (!session) {
                return null;
            }

            return {
                checkoutSessionId: session.id,
                paymentFormId: session.paymentFormId,
                customerName: session.customerName,
                customerEmail: session.customerEmail,
                customerPhone: session.customerPhone,
                selectedProducts: JSON.parse(session.selectedProducts),
                status: session.status,
                paymentToken: session.paymentToken,
                shippingAddress: session.shippingAddress,
                createdAt: session.createdAt.toISOString(),
                paidAt: session.paidAt?.toISOString() || null,
            };
        } catch (error) {
            console.error('PrismaAdapter: Error getting checkout session:', error);
            return null;
        }
    }

    async getCheckoutSessionByToken(token: string): Promise<(DBCheckoutSession & { docId?: string }) | null> {
        try {
            const session = await prisma.checkoutSession.findUnique({
                where: { paymentToken: token },
            });

            if (!session) {
                return null;
            }

            return {
                checkoutSessionId: session.id,
                paymentFormId: session.paymentFormId,
                customerName: session.customerName,
                customerEmail: session.customerEmail,
                customerPhone: session.customerPhone,
                selectedProducts: JSON.parse(session.selectedProducts),
                status: session.status,
                paymentToken: session.paymentToken,
                shippingAddress: session.shippingAddress,
                createdAt: session.createdAt.toISOString(),
                paidAt: session.paidAt?.toISOString() || null,
                docId: session.id, // For backwards compatibility
            };
        } catch (error) {
            console.error('PrismaAdapter: Error getting checkout session by token:', error);
            return null;
        }
    }
}
