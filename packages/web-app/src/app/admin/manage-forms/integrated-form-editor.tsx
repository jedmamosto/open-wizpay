// In integrated-form-editor.tsx

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { auth } from '@/firebase/config';
import { useToast } from '@/hooks/use-toast';
import { FormAppearance, PaymentForm, Product } from '@/schemas/payment-form';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AppearanceTab } from './appearance-tab';
import { BasicInfoTab } from './basic-info-tab';
import { FormPreview } from './form-preview';

const defaultAppearance: FormAppearance = {
    colorScheme: 'emerald',
    fontFamily: 'inter',
};

interface IntegratedFormEditorProps {
    initialFormData?: PaymentForm;
    onSubmit?: (formData: PaymentForm) => Promise<void>;
    onSuccess?: () => void;
    onCancel?: () => void;
    isEditing?: boolean;
}

export function IntegratedFormEditor({
    initialFormData,
    onSubmit,
    onSuccess,
    onCancel,
    isEditing = false,
}: IntegratedFormEditorProps) {
    const router = useRouter();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState<string>('basic');

    // Single source of truth for form data
    const [formData, setFormData] = useState<PaymentForm>(
        initialFormData || {
            paymentFormTitle: '',
            paymentFormDescription: '',
            paymentFormSuccessURL: '',
            paymentFormCancelURL: '',
            paymentFormWebhookURL: '',
            paymentFormPaymongoPubKey: '',
            paymentFormPaymongoSecKey: '',
            paymentFormProducts: [],
            userId: '',
            appearance: defaultAppearance,
        }
    );

    // Auth check - only updates userId field, nothing else
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setFormData((prev) => ({ ...prev, userId: user.uid }));
            } else {
                router.push('/login');
                toast({
                    variant: 'destructive',
                    title: 'Authentication required',
                    description: 'Please login to create a payment form',
                });
            }
        });

        return () => unsubscribe();
    }, [router, toast]);

    // Field update handlers - each only updates its specific part of the state
    const handleBasicInfoChange = (field: string, value: string | number) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleProductsChange = (products: Product[]) => {
        setFormData((prev) => ({ ...prev, paymentFormProducts: products }));
    };

    const handleAppearanceChange = (newAppearance: FormAppearance) => {
        setFormData((prev) => ({ ...prev, appearance: newAppearance }));
    };

    // Form submission handler
    const handleSubmit = async () => {
        try {
            setIsSubmitting(true);

            if (onSubmit) {
                await onSubmit(formData);
            } else {
                const method = isEditing ? 'PATCH' : 'POST';
                const url = isEditing
                    ? `/api/payment-forms?paymentFormId=${formData.paymentFormId}`
                    : '/api/payment-forms';

                const response = await fetch(url, {
                    method,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(
                        errorData.message ||
                            `Failed to ${isEditing ? 'update' : 'create'} payment form`
                    );
                }
            }

            toast({
                title: 'Success!',
                description: `Payment form ${isEditing ? 'updated' : 'created'} successfully`,
            });

            if (onSuccess) {
                onSuccess();
            }
        } catch (error) {
            console.error('Form submission error:', error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description:
                    error instanceof Error
                        ? error.message
                        : `Failed to ${isEditing ? 'update' : 'create'} payment form.`,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
            {/* Editor Panel */}
            <div className="flex flex-col h-full">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid grid-cols-2 bg-[#001208] border border-[#1d3a2c]">
                        <TabsTrigger value="basic" className="text-[#c8ebd5]/70 data-[state=active]:bg-[#ccf15a] data-[state=active]:text-[#161e00] font-bold">Basic Info</TabsTrigger>
                        <TabsTrigger value="appearance" className="text-[#c8ebd5]/70 data-[state=active]:bg-[#ccf15a] data-[state=active]:text-[#161e00] font-bold">Appearance</TabsTrigger>
                    </TabsList>

                    <TabsContent value="basic" className="flex-1">
                        <div className="h-[65vh] overflow-auto">
                            <BasicInfoTab
                                formData={formData}
                                onFieldChange={handleBasicInfoChange}
                                onProductsChange={handleProductsChange}
                            />
                        </div>
                    </TabsContent>

                    <TabsContent value="appearance" className="flex-1">
                        <div className="h-[65vh] overflow-auto pr-4">
                            <AppearanceTab
                                appearance={
                                    formData.appearance || defaultAppearance
                                }
                                onChange={handleAppearanceChange}
                            />
                        </div>
                    </TabsContent>
                </Tabs>

                <Separator className="my-4 bg-[#1d3a2c]" />

                <div className="flex justify-end space-x-2">
                    {onCancel && (
                        <Button
                            variant="outline"
                            onClick={onCancel}
                            disabled={isSubmitting}
                            className="border-[#1d3a2c] bg-transparent text-[#c8ebd5] hover:bg-[#112f21] hover:text-white"
                        >
                            Cancel
                        </Button>
                    )}
                    <Button 
                        onClick={handleSubmit} 
                        disabled={isSubmitting}
                        className="bg-[#ccf15a] hover:bg-[#b0d440] text-[#161e00] font-bold uppercase tracking-wider text-xs px-4"
                    >
                        {isSubmitting
                            ? isEditing
                                ? 'Saving...'
                                : 'Creating...'
                            : isEditing
                              ? 'Save Changes'
                              : 'Create Payment Form'}
                    </Button>
                </div>
            </div>

            {/* Preview Panel */}
            <div className="hidden md:block h-[calc(65vh+64px)]">
                <FormPreview formData={formData} />
            </div>
        </div>
    );
}
