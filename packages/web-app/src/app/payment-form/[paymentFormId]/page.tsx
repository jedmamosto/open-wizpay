import { getDatabaseAdapter } from '@/lib/db';
import { PaymentFormView } from './_components/payment-form-view';

interface PageProps {
    params: Promise<{ paymentFormId: string }>;
}

export default async function PaymentFormPage({ params }: PageProps) {
    const { paymentFormId } = await params;
    const db = getDatabaseAdapter();
    const paymentForm = await db.getPaymentForm(paymentFormId);

    if (!paymentForm) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50 p-8 text-center text-lg font-semibold text-red-500">
                Form not found.
            </div>
        );
    }

    return <PaymentFormView paymentForm={paymentForm} />;
}
