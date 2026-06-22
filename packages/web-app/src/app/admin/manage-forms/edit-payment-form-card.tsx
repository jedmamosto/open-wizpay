'use client';

import { useToast } from '@/hooks/use-toast';
import { PaymentForm } from '@/schemas/payment-form';
import { IntegratedFormEditor } from './integrated-form-editor';

interface EditPaymentFormCardProps {
    paymentFormData: PaymentForm;
    onEdit: (updatedPaymentForm: PaymentForm) => void;
    onCancel: () => void;
}

export default function EditPaymentFormCard({
    paymentFormData,
    onEdit,
    onCancel,
}: EditPaymentFormCardProps) {
    const { toast } = useToast();

    const handleSubmit = async (formData: PaymentForm) => {
        try {
            const response = await fetch(
                `/api/payment-forms?paymentFormId=${formData.paymentFormId}`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    errorData.message || 'Failed to update payment form'
                );
            }

            toast({
                title: 'Success',
                description: 'Payment form updated successfully',
            });

            onEdit(formData);
        } catch (error) {
            console.error('Error updating payment form:', error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description:
                    error instanceof Error
                        ? error.message
                        : 'Failed to update payment form',
            });
        }
    };

    // No longer wrapping with Card component - directly render the IntegratedFormEditor
    return (
        <IntegratedFormEditor
            initialFormData={paymentFormData}
            onSubmit={handleSubmit}
            onCancel={onCancel}
            isEditing={true}
        />
    );
}
