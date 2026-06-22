// src/app/manage-forms/page.tsx

'use client';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { auth } from '@/firebase/config';
import { PaymentForm } from '@/schemas/payment-form';
import { onAuthStateChanged } from 'firebase/auth';
import { Plus } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { IntegratedFormEditor } from './integrated-form-editor';
import PaymentFormCard from './payment-form-card';

// Custom hook to manage forms data and operations - kept the same as your original implementation
const usePaymentForms = () => {
    const [paymentFormsData, setPaymentFormsData] = useState<PaymentForm[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    // Fetch current user and handle auth state changes
    const fetchCurrentUser = useCallback(() => {
        onAuthStateChanged(auth, (user) => {
            setCurrentUserId(user?.uid ?? null);
        });
    }, []);

    // Fetch payment forms with error handling
    const fetchPaymentForms = useCallback(async () => {
        try {
            const response = await fetch('/api/payment-forms');
            if (!response.ok) throw new Error('Failed to fetch payment forms');
            const data = await response.json();
            setPaymentFormsData(data);
        } catch (error) {
            console.error('Error fetching payment forms:', error);
            setError('Failed to fetch payment forms. Please try again later.');
        } finally {
            setLoading(false);
        }
    }, []);

    // Handle form editing with optimistic updates
    const handleEdit = async (updatedPaymentForm: PaymentForm) => {
        try {
            // Optimistically update the UI
            setPaymentFormsData((prevForms) =>
                prevForms.map((form) =>
                    form.paymentFormId === updatedPaymentForm.paymentFormId
                        ? updatedPaymentForm
                        : form
                )
            );

            const response = await fetch(
                `/api/payment-forms?paymentFormId=${updatedPaymentForm.paymentFormId}`,
                {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updatedPaymentForm),
                }
            );

            if (!response.ok) throw new Error('Failed to update payment form');
        } catch (error) {
            console.error('Error updating payment form:', error);
            // Revert optimistic update on error
            await fetchPaymentForms();
            setError('Failed to update payment form. Please try again.');
        }
    };

    // Handle form deletion with optimistic updates
    const handleDelete = async (paymentFormId: string) => {
        try {
            // Optimistically update the UI
            setPaymentFormsData((prevForms) =>
                prevForms.filter((form) => form.paymentFormId !== paymentFormId)
            );

            const response = await fetch(
                `/api/payment-forms?paymentFormId=${paymentFormId}`,
                { method: 'DELETE' }
            );

            if (!response.ok) throw new Error('Failed to delete payment form');
        } catch (error) {
            console.error('Error deleting payment form:', error);
            // Revert optimistic update on error
            await fetchPaymentForms();
            setError('Failed to delete payment form. Please try again.');
        }
    };

    return {
        paymentFormsData,
        loading,
        error,
        currentUserId,
        fetchCurrentUser,
        fetchPaymentForms,
        handleEdit,
        handleDelete,
    };
};

export default function ManageForms() {
    const {
        paymentFormsData,
        loading,
        error,
        currentUserId,
        fetchCurrentUser,
        fetchPaymentForms,
        handleEdit,
        handleDelete,
    } = usePaymentForms();

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // Initialize data fetching
    useEffect(() => {
        fetchCurrentUser();
        fetchPaymentForms();
    }, [fetchCurrentUser, fetchPaymentForms]);

    // Filter forms for current user
    const userForms = paymentFormsData.filter(
        (form) => form.userId === currentUserId
    );

    const handleCreateSuccess = () => {
        setIsCreateModalOpen(false);
        fetchPaymentForms();
    };

    // Render loading state
    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#00180c]">
                <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-[#ccf15a]"></div>
            </div>
        );
    }

    // Render error state
    if (error) {
        return (
            <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
                <div className="text-center space-y-4">
                    <p className="text-lg font-medium text-destructive">
                        {error}
                    </p>
                    <Button onClick={fetchPaymentForms}>Try Again</Button>
                </div>
            </div>
        );
    }

    // Render empty state
    if (userForms.length === 0) {
        return (
            <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center space-y-4 p-6 bg-transparent text-[#c8ebd5]">
                <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold uppercase tracking-wider font-mono text-white">No Payment Forms Yet</h2>
                    <p className="text-[#c5c9b1]/60">
                        Create your first payment form to get started.
                    </p>
                </div>
                <Button 
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-[#ccf15a] hover:bg-[#b0d440] text-[#161e00] font-bold uppercase tracking-wider text-xs px-4 py-2.5 rounded-lg"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Create Payment Form
                </Button>
                <Dialog
                    open={isCreateModalOpen}
                    onOpenChange={setIsCreateModalOpen}
                >
                    <DialogContent className="max-w-6xl max-h-[90vh] border-[#1d3a2c] bg-[#001208] text-[#c8ebd5] p-6 shadow-2xl overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="text-white font-bold font-mono uppercase tracking-wider text-xl">Create New Payment Form</DialogTitle>
                            <DialogDescription className="text-[#c5c9b1]/70 mt-1">
                                Design and deploy your customized payment form
                                with one click.
                            </DialogDescription>
                        </DialogHeader>
                        <IntegratedFormEditor onSuccess={handleCreateSuccess} />
                    </DialogContent>
                </Dialog>
            </div>
        );
    }

    // Render main content
    return (
        <div className="container max-w-7xl mx-auto px-4 py-6 md:p-6 space-y-4 md:space-y-6">
            {/* Header section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
                <div>
                    <h1 className="text-3xl font-black text-white font-mono uppercase tracking-wider">Payment Forms</h1>
                    <p className="text-[#c5c9b1]/60 mt-1">
                        Manage and track your payment forms
                    </p>
                </div>
                <Button 
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-[#ccf15a] hover:bg-[#b0d440] text-[#161e00] font-bold uppercase tracking-wider text-xs px-4 py-2.5 rounded-lg"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Create Payment Form
                </Button>
            </div>

            {/* Grid of payment form cards */}
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 auto-rows-fr">
                {userForms.map((paymentFormData) => (
                    <PaymentFormCard
                        key={paymentFormData.paymentFormId}
                        paymentFormData={paymentFormData}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                ))}
            </div>

            {/* Create form modal */}
            <Dialog
                open={isCreateModalOpen}
                onOpenChange={setIsCreateModalOpen}
            >
                <DialogContent className="max-w-6xl max-h-[90vh] border-[#1d3a2c] bg-[#001208] text-[#c8ebd5] p-6 shadow-2xl overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-white font-bold font-mono uppercase tracking-wider text-xl">Create New Payment Form</DialogTitle>
                    </DialogHeader>
                    <IntegratedFormEditor onSuccess={handleCreateSuccess} />
                </DialogContent>
            </Dialog>
        </div>
    );
}
