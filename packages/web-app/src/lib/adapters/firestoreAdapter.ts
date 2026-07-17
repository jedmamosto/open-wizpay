import admin from '@/firebase/adminConfig';
import { PaymentForm } from '@/schemas/payment-form';
import { DBCheckoutSession, IDatabaseRepository } from '../db';

export class FirestoreAdapter implements IDatabaseRepository {
    private get db() {
        return admin.firestore();
    }

    async getPaymentForm(paymentFormId: string): Promise<PaymentForm | null> {
        try {
            // First try direct document ID lookup
            const doc = await this.db.collection('payment-forms').doc(paymentFormId).get();
            if (doc.exists) {
                const data = doc.data();
                if (data) {
                    return {
                        ...data,
                        paymentFormId: doc.id,
                    } as PaymentForm;
                }
            }

            // Fallback: search where 'id' field matches paymentFormId
            const snapshot = await this.db
                .collection('payment-forms')
                .where('id', '==', paymentFormId)
                .limit(1)
                .get();

            if (!snapshot.empty) {
                const docData = snapshot.docs[0].data();
                return {
                    ...docData,
                    paymentFormId: snapshot.docs[0].id,
                } as PaymentForm;
            }

            return null;
        } catch (error) {
            console.error('FirestoreAdapter: Error getting payment form:', error);
            return null;
        }
    }

    async listPaymentForms(userId: string): Promise<PaymentForm[]> {
        try {
            const snapshot = await this.db
                .collection('payment-forms')
                .where('userId', '==', userId)
                .get();

            return snapshot.docs.map((doc) => {
                const data = doc.data();
                return {
                    ...data,
                    paymentFormId: doc.id,
                    id: doc.id,
                } as unknown as PaymentForm;
            });
        } catch (error) {
            console.error('FirestoreAdapter: Error listing payment forms:', error);
            return [];
        }
    }

    async savePaymentForm(
        data: Omit<PaymentForm, 'paymentFormId'> & { paymentFormId?: string }
    ): Promise<string> {
        try {
            const docRef = data.paymentFormId
                ? this.db.collection('payment-forms').doc(data.paymentFormId)
                : this.db.collection('payment-forms').doc();

            const paymentFormId = docRef.id;
            const payload = {
                ...data,
                paymentFormId,
                // Include id field for backwards compatibility with legacy queries
                id: paymentFormId,
            };

            await docRef.set(payload, { merge: true });
            return paymentFormId;
        } catch (error) {
            console.error('FirestoreAdapter: Error saving payment form:', error);
            throw error;
        }
    }

    async deletePaymentForm(paymentFormId: string): Promise<void> {
        try {
            await this.db.collection('payment-forms').doc(paymentFormId).delete();
        } catch (error) {
            console.error('FirestoreAdapter: Error deleting payment form:', error);
            throw error;
        }
    }

    async createCheckoutSession(data: DBCheckoutSession): Promise<void> {
        try {
            // Store checkout session with PayMongo checkoutSessionId as document ID
            await this.db
                .collection('checkout-sessions')
                .doc(data.checkoutSessionId)
                .set(data);
        } catch (error) {
            console.error('FirestoreAdapter: Error creating checkout session:', error);
            throw error;
        }
    }

    async updateCheckoutSession(id: string, updates: Partial<DBCheckoutSession>): Promise<void> {
        try {
            await this.db.collection('checkout-sessions').doc(id).update(updates);
        } catch (error) {
            console.error('FirestoreAdapter: Error updating checkout session:', error);
            throw error;
        }
    }

    async getCheckoutSession(id: string): Promise<DBCheckoutSession | null> {
        try {
            const doc = await this.db.collection('checkout-sessions').doc(id).get();
            if (doc.exists) {
                return doc.data() as DBCheckoutSession;
            }
            return null;
        } catch (error) {
            console.error('FirestoreAdapter: Error getting checkout session:', error);
            return null;
        }
    }

    async getCheckoutSessionByToken(token: string): Promise<(DBCheckoutSession & { docId?: string }) | null> {
        try {
            const snapshot = await this.db
                .collection('checkout-sessions')
                .where('paymentToken', '==', token)
                .limit(1)
                .get();

            if (snapshot.empty) {
                return null;
            }

            const doc = snapshot.docs[0];
            return {
                ...(doc.data() as DBCheckoutSession),
                docId: doc.id,
            };
        } catch (error) {
            console.error('FirestoreAdapter: Error getting checkout session by token:', error);
            return null;
        }
    }
}
