import { PaymentForm } from '@/schemas/payment-form';
import { FirestoreAdapter } from './adapters/firestoreAdapter';

export interface DBProduct {
    productId?: string;
    productName: string;
    productDescription?: string;
    productPrice: number;
    quantity?: number;
}

export interface DBCheckoutSession {
    checkoutSessionId: string;
    paymentFormId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    selectedProducts: DBProduct[];
    status: string; // pending | paid | failed
    paymentToken: string;
    shippingAddress?: string | null;
    createdAt?: string;
    paidAt?: string | null;
}

export interface IDatabaseRepository {
    getPaymentForm(paymentFormId: string): Promise<PaymentForm | null>;
    listPaymentForms(userId: string): Promise<PaymentForm[]>;
    savePaymentForm(data: Omit<PaymentForm, 'paymentFormId'> & { paymentFormId?: string }): Promise<string>;
    deletePaymentForm(paymentFormId: string): Promise<void>;
    createCheckoutSession(data: DBCheckoutSession): Promise<void>;
    updateCheckoutSession(id: string, updates: Partial<DBCheckoutSession>): Promise<void>;
    getCheckoutSession(id: string): Promise<DBCheckoutSession | null>;
    getCheckoutSessionByToken(token: string): Promise<(DBCheckoutSession & { docId?: string }) | null>;
}

export function getDatabaseAdapter(): IDatabaseRepository {
    return new FirestoreAdapter();
}
