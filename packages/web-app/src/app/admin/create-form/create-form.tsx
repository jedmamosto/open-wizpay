'use client';

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { PaymentForm, Product } from '@/schemas/payment-form';
import { PlusCircle, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const validateFormData = (formData: PaymentForm): string[] => {
    const errors: string[] = [];

    // Existing validation logic
    if (!formData.paymentFormTitle.trim()) {
        errors.push('Title is required.');
    }

    if (!formData.paymentFormDescription.trim()) {
        errors.push('Description is required.');
    }

    const urlPattern = /^(https?:\/\/[^\s/$.?#].[^\s]*)$/;

    if (!urlPattern.test(formData.paymentFormSuccessURL)) {
        errors.push('Success URL must be a valid URL.');
    }

    if (!urlPattern.test(formData.paymentFormCancelURL)) {
        errors.push('Cancel URL must be a valid URL.');
    }

    if (
        formData.paymentFormWebhookURL &&
        !urlPattern.test(formData.paymentFormWebhookURL)
    ) {
        errors.push('Webhook URL must be a valid URL if provided.');
    }

    if (!formData.paymentFormPaymongoPubKey.trim()) {
        errors.push('Paymongo Public Key is required.');
    }

    if (!formData.paymentFormPaymongoSecKey.trim()) {
        errors.push('Paymongo Secret Key is required.');
    }

    if (formData.paymentFormProducts.length === 0) {
        errors.push('At least one product is required.');
    } else {
        formData.paymentFormProducts.forEach((product, index) => {
            if (!product.productName.trim()) {
                errors.push(`Product ${index + 1} Name is required.`);
            }

            if (product.productPrice < 20) {
                errors.push(
                    `Product ${index + 1} Price must be at least PHP 20.00.`
                );
            }
        });
    }

    return errors;
};

interface CreatePaymentFormProps {
    onSuccess?: () => void;
    isWrapped?: boolean;
    formData?: PaymentForm;
    onChange?: (formData: PaymentForm) => void;
}

export function CreatePaymentForm({
    onSuccess,
    isWrapped = false,
    formData: externalFormData,
    onChange,
}: CreatePaymentFormProps) {
    const router = useRouter();
    const { toast } = useToast();
    const [products, setProducts] = useState<Product[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Initialize form data - either from props or with defaults
    const [formData, setFormData] = useState<PaymentForm>(
        externalFormData || {
            paymentFormTitle: '',
            paymentFormDescription: '',
            paymentFormSuccessURL: '',
            paymentFormCancelURL: '',
            paymentFormWebhookURL: '',
            paymentFormPaymongoPubKey: '',
            paymentFormPaymongoSecKey: '',
            paymentFormProducts: [],
            userId: '',
            appearance: {
                colorScheme: 'slate',
                fontFamily: 'inter',
            },
        }
    );

    const [errors, setErrors] = useState<string[]>([]);

    // Reset form helper function
    const resetForm = () => {
        setFormData({
            paymentFormTitle: '',
            paymentFormDescription: '',
            paymentFormSuccessURL: '',
            paymentFormCancelURL: '',
            paymentFormWebhookURL: '',
            paymentFormPaymongoPubKey: '',
            paymentFormPaymongoSecKey: '',
            paymentFormProducts: [],
            userId: '',
            appearance: {
                colorScheme: 'slate',
                fontFamily: 'inter',
            },
        });
        setProducts([]);
        setErrors([]);
    };

    // Initialize products state from external form data if provided
    // In create-form.tsx, ensure this useEffect has proper dependencies:
    useEffect(() => {
        if (isWrapped && onChange && !externalFormData?.appearance) {
            // Only update parent if we need to (avoid circular updates)
            onChange(formData);
        }
    }, [formData, isWrapped, onChange, externalFormData?.appearance]);

    // If component is wrapped, sync changes back to parent
    useEffect(() => {
        if (isWrapped && onChange) {
            onChange(formData);
        }
    }, [formData, isWrapped, onChange]);

    const { user } = useAuth();

    // Auth check
    useEffect(() => {
        if (!isWrapped && !user) {
            router.push('/login');
            toast({
                variant: 'destructive',
                title: 'Authentication required',
                description: 'Please login to create a payment form',
            });
        }
    }, [user, router, toast, isWrapped]);

    const handleSubmit = async (submitFormData: PaymentForm) => {
        if (isWrapped && onChange) {
            // If wrapped, just update the parent component
            onChange({
                ...submitFormData,
                paymentFormProducts: products,
            });
            return;
        }

        try {
            setIsSubmitting(true);
            const currentUserId = user?.uid || '';
            const validationErrors = validateFormData({
                ...submitFormData,
                userId: currentUserId,
            });

            if (validationErrors.length > 0) {
                setErrors(validationErrors);
                toast({
                    variant: 'destructive',
                    title: 'Validation Error',
                    description: validationErrors[0],
                });
                return;
            }

            setErrors([]);
            const formDataWithUserId = { ...submitFormData, userId: currentUserId };

            const response = await fetch('/api/payment-forms', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formDataWithUserId),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    errorData.message || 'Failed to create payment form'
                );
            }

            // Show success toast
            toast({
                title: 'Success!',
                description: 'Payment form created successfully',
            });

            // Reset form state
            resetForm();

            // Call onSuccess callback if provided (closes modal)
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
                        : 'Failed to create payment form. Please try again.',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const addProduct = () => {
        const newProducts = [
            ...products,
            { productName: '', productDescription: '', productPrice: 0 },
        ];
        setProducts(newProducts);
        setFormData({ ...formData, paymentFormProducts: newProducts });
    };

    const updateProduct = (index: number, updatedProduct: Product) => {
        const newProducts = products.map((product, i) =>
            i === index ? updatedProduct : product
        );
        setProducts(newProducts);
        setFormData({ ...formData, paymentFormProducts: newProducts });
    };

    const removeProduct = (index: number) => {
        const newProducts = products.filter((_, i) => i !== index);
        setProducts(newProducts);
        setFormData({ ...formData, paymentFormProducts: newProducts });
    };

    // Form field update handler
    const updateFormField = (field: string, value: string) => {
        setFormData({
            ...formData,
            [field]: value,
        });
    };

    // If component is wrapped, don't render submit button
    const formContent = (
        <div className="space-y-6 pr-6">
            {/* Basic Information */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Basic Information</h3>
                <div className="space-y-2">
                    <Label htmlFor="paymentFormTitle">Title</Label>
                    <Input
                        id="paymentFormTitle"
                        name="paymentFormTitle"
                        placeholder="Enter the title of your payment form"
                        value={formData.paymentFormTitle}
                        onChange={(e) =>
                            updateFormField('paymentFormTitle', e.target.value)
                        }
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="paymentFormDescription">Description</Label>
                    <Textarea
                        id="paymentFormDescription"
                        name="paymentFormDescription"
                        placeholder="Describe your payment form"
                        className="min-h-[100px]"
                        value={formData.paymentFormDescription}
                        onChange={(e) =>
                            updateFormField(
                                'paymentFormDescription',
                                e.target.value
                            )
                        }
                    />
                </div>
            </div>

            <Separator />

            {/* URLs */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">URLs</h3>
                <div className="space-y-2">
                    <Label htmlFor="paymentFormSuccessURL">Success URL</Label>
                    <Input
                        id="paymentFormSuccessURL"
                        name="paymentFormSuccessURL"
                        placeholder="https://example.com/success"
                        value={formData.paymentFormSuccessURL}
                        onChange={(e) =>
                            updateFormField(
                                'paymentFormSuccessURL',
                                e.target.value
                            )
                        }
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="paymentFormCancelURL">Cancel URL</Label>
                    <Input
                        id="paymentFormCancelURL"
                        name="paymentFormCancelURL"
                        placeholder="https://example.com/cancel"
                        value={formData.paymentFormCancelURL}
                        onChange={(e) =>
                            updateFormField(
                                'paymentFormCancelURL',
                                e.target.value
                            )
                        }
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="paymentFormWebhookURL">Webhook URL</Label>
                    <Input
                        id="paymentFormWebhookURL"
                        name="paymentFormWebhookURL"
                        placeholder="https://example.com/webhook"
                        value={formData.paymentFormWebhookURL}
                        onChange={(e) =>
                            updateFormField(
                                'paymentFormWebhookURL',
                                e.target.value
                            )
                        }
                    />
                </div>
            </div>

            <Separator />

            {/* Paymongo Keys */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Paymongo Keys</h3>
                <div className="space-y-2">
                    <Label htmlFor="paymentFormPaymongoPubKey">
                        Paymongo Public Key
                    </Label>
                    <Input
                        id="paymentFormPaymongoPubKey"
                        name="paymentFormPaymongoPubKey"
                        placeholder="Enter Paymongo Public Key (pk_test_...)"
                        value={formData.paymentFormPaymongoPubKey}
                        onChange={(e) =>
                            updateFormField(
                                'paymentFormPaymongoPubKey',
                                e.target.value
                            )
                        }
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="paymentFormPaymongoSecKey">
                        Paymongo Secret Key
                    </Label>
                    <Input
                        id="paymentFormPaymongoSecKey"
                        name="paymentFormPaymongoSecKey"
                        type="password"
                        placeholder="Enter Paymongo Secret Key (sk_test_...)"
                        value={formData.paymentFormPaymongoSecKey}
                        onChange={(e) =>
                            updateFormField(
                                'paymentFormPaymongoSecKey',
                                e.target.value
                            )
                        }
                    />
                </div>
            </div>

            <Separator />

            {/* Products */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Products</h3>
                    <Button
                        type="button"
                        onClick={addProduct}
                        variant="ghost"
                        className="space-x-2"
                    >
                        <PlusCircle />
                        <span>Add Product</span>
                    </Button>
                </div>
                <Accordion type="single" collapsible className="w-full">
                    {products.map((product, index) => (
                        <AccordionItem value={`item-${index}`} key={index}>
                            <AccordionTrigger>
                                {product.productName || `Product ${index + 1}`}
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="space-y-2">
                                    <Label htmlFor={`productName-${index}`}>
                                        Product Name
                                    </Label>
                                    <Input
                                        id={`productName-${index}`}
                                        placeholder="Enter the product name"
                                        value={product.productName}
                                        onChange={(e) =>
                                            updateProduct(index, {
                                                ...product,
                                                productName: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label
                                        htmlFor={`productDescription-${index}`}
                                    >
                                        Product Description
                                    </Label>
                                    <Textarea
                                        id={`productDescription-${index}`}
                                        placeholder="Enter the product description"
                                        value={product.productDescription}
                                        onChange={(e) =>
                                            updateProduct(index, {
                                                ...product,
                                                productDescription:
                                                    e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor={`productPrice-${index}`}>
                                        Product Price
                                    </Label>
                                    <Input
                                        id={`productPrice-${index}`}
                                        type="number"
                                        placeholder="Enter the product price"
                                        value={product.productPrice.toString()}
                                        onChange={(e) =>
                                            updateProduct(index, {
                                                ...product,
                                                productPrice: parseFloat(
                                                    e.target.value
                                                ),
                                            })
                                        }
                                    />
                                </div>
                                <Button
                                    type="button"
                                    variant="destructive"
                                    onClick={() => removeProduct(index)}
                                    className="mt-4"
                                >
                                    <Trash2 className="mr-2" />
                                    Remove Product
                                </Button>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </div>
    );

    // Show error messages if any
    if (errors.length > 0 && !isWrapped) {
        return (
            <div className="relative">
                <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-lg">
                    <ul>
                        {errors.map((error, index) => (
                            <li key={index}>{error}</li>
                        ))}
                    </ul>
                </div>
                <ScrollArea className="h-[65vh]">{formContent}</ScrollArea>
                <div className="flex justify-end pt-6 mt-4 border-t">
                    <Button
                        type="button"
                        onClick={() =>
                            handleSubmit({
                                ...formData,
                                paymentFormProducts: products,
                            })
                        }
                        disabled={isSubmitting}
                        className="min-w-[150px]"
                    >
                        {isSubmitting ? (
                            <>Creating...</>
                        ) : (
                            'Create Payment Form'
                        )}
                    </Button>
                </div>
            </div>
        );
    }

    // If wrapped, return just the form content
    if (isWrapped) {
        return formContent;
    }

    // Otherwise, return the complete component with submit button
    return (
        <div className="relative">
            <ScrollArea className="h-[65vh]">{formContent}</ScrollArea>
            <div className="flex justify-end pt-6 mt-4 border-t">
                <Button
                    type="button"
                    onClick={() =>
                        handleSubmit({
                            ...formData,
                            paymentFormProducts: products,
                        })
                    }
                    disabled={isSubmitting}
                    className="min-w-[150px]"
                >
                    {isSubmitting ? <>Creating...</> : 'Create Payment Form'}
                </Button>
            </div>
        </div>
    );
}
