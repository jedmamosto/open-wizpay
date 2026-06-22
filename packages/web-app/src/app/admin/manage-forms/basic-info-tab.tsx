// src/components/form-editor/basic-info-tab.tsx

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { PaymentForm, Product } from '@/schemas/payment-form';
import { PlusCircle, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface BasicInfoTabProps {
    formData: PaymentForm;
    onFieldChange: (field: string, value: string | number) => void;
    onProductsChange: (products: Product[]) => void;
}

export function BasicInfoTab({
    formData,
    onFieldChange,
    onProductsChange,
}: BasicInfoTabProps) {
    // Local state for products manipulation
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        if (formData.paymentFormProducts) {
            setProducts(formData.paymentFormProducts);
        }
    }, [JSON.stringify(formData.paymentFormProducts)]); // Use JSON.stringify to compare values, not references

    // Product management functions
    const addProduct = () => {
        const newProducts = [
            ...products,
            { productName: '', productDescription: '', productPrice: 0 },
        ];
        setProducts(newProducts);
        onProductsChange(newProducts);
    };

    const updateProduct = (index: number, updatedProduct: Product) => {
        const newProducts = products.map((product, i) =>
            i === index ? updatedProduct : product
        );
        setProducts(newProducts);
        onProductsChange(newProducts);
    };

    const removeProduct = (index: number) => {
        const newProducts = products.filter((_, i) => i !== index);
        setProducts(newProducts);
        onProductsChange(newProducts);
    };

    return (
        <div className="space-y-6 pr-6">
            {/* Basic Information */}
            <div className="space-y-4">
                <h3 className="text-xs font-mono uppercase tracking-wider text-[#c5c9b1]/80">Basic Information</h3>
                <div className="space-y-2">
                    <Label htmlFor="paymentFormTitle" className="text-xs text-[#c8ebd5]/70">Title</Label>
                    <Input
                        id="paymentFormTitle"
                        value={formData.paymentFormTitle}
                        onChange={(e) =>
                            onFieldChange('paymentFormTitle', e.target.value)
                        }
                        className="bg-[#00180c] border border-[#1d3a2c] text-white focus-visible:ring-1 focus-visible:ring-[#ccf15a] focus-visible:ring-offset-0 focus:border-[#ccf15a]"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="paymentFormDescription" className="text-xs text-[#c8ebd5]/70">Description</Label>
                    <Textarea
                        id="paymentFormDescription"
                        className="min-h-[100px] bg-[#00180c] border border-[#1d3a2c] text-white focus-visible:ring-1 focus-visible:ring-[#ccf15a] focus-visible:ring-offset-0 focus:border-[#ccf15a]"
                        value={formData.paymentFormDescription}
                        onChange={(e) =>
                            onFieldChange(
                                'paymentFormDescription',
                                e.target.value
                            )
                        }
                    />
                </div>
            </div>

            <Separator className="bg-[#1d3a2c]" />

            {/* URLs */}
            <div className="space-y-4">
                <h3 className="text-xs font-mono uppercase tracking-wider text-[#c5c9b1]/80">URLs</h3>
                <div className="space-y-2">
                    <Label htmlFor="paymentFormSuccessURL" className="text-xs text-[#c8ebd5]/70">Success URL</Label>
                    <Input
                        id="paymentFormSuccessURL"
                        value={formData.paymentFormSuccessURL}
                        onChange={(e) =>
                            onFieldChange(
                                'paymentFormSuccessURL',
                                e.target.value
                            )
                        }
                        className="bg-[#00180c] border border-[#1d3a2c] text-white focus-visible:ring-1 focus-visible:ring-[#ccf15a] focus-visible:ring-offset-0 focus:border-[#ccf15a]"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="paymentFormCancelURL" className="text-xs text-[#c8ebd5]/70">Cancel URL</Label>
                    <Input
                        id="paymentFormCancelURL"
                        value={formData.paymentFormCancelURL}
                        onChange={(e) =>
                            onFieldChange(
                                'paymentFormCancelURL',
                                e.target.value
                            )
                        }
                        className="bg-[#00180c] border border-[#1d3a2c] text-white focus-visible:ring-1 focus-visible:ring-[#ccf15a] focus-visible:ring-offset-0 focus:border-[#ccf15a]"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="paymentFormWebhookURL" className="text-xs text-[#c8ebd5]/70">Webhook URL</Label>
                    <Input
                        id="paymentFormWebhookURL"
                        value={formData.paymentFormWebhookURL}
                        onChange={(e) =>
                            onFieldChange(
                                'paymentFormWebhookURL',
                                e.target.value
                            )
                        }
                        className="bg-[#00180c] border border-[#1d3a2c] text-white focus-visible:ring-1 focus-visible:ring-[#ccf15a] focus-visible:ring-offset-0 focus:border-[#ccf15a]"
                    />
                </div>
            </div>

            <Separator className="bg-[#1d3a2c]" />

            {/* Paymongo Keys */}
            <div className="space-y-4">
                <h3 className="text-xs font-mono uppercase tracking-wider text-[#c5c9b1]/80">Paymongo Keys</h3>
                <div className="space-y-2">
                    <Label htmlFor="paymentFormPaymongoPubKey" className="text-xs text-[#c8ebd5]/70">
                        Paymongo Public Key
                    </Label>
                    <Input
                        id="paymentFormPaymongoPubKey"
                        value={formData.paymentFormPaymongoPubKey}
                        onChange={(e) =>
                            onFieldChange(
                                'paymentFormPaymongoPubKey',
                                e.target.value
                            )
                        }
                        className="bg-[#00180c] border border-[#1d3a2c] text-white focus-visible:ring-1 focus-visible:ring-[#ccf15a] focus-visible:ring-offset-0 focus:border-[#ccf15a]"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="paymentFormPaymongoSecKey" className="text-xs text-[#c8ebd5]/70">
                        Paymongo Secret Key
                    </Label>
                    <Input
                        id="paymentFormPaymongoSecKey"
                        type="password"
                        value={formData.paymentFormPaymongoSecKey}
                        onChange={(e) =>
                            onFieldChange(
                                'paymentFormPaymongoSecKey',
                                e.target.value
                            )
                        }
                        className="bg-[#00180c] border border-[#1d3a2c] text-white focus-visible:ring-1 focus-visible:ring-[#ccf15a] focus-visible:ring-offset-0 focus:border-[#ccf15a]"
                    />
                </div>
            </div>

            <Separator className="bg-[#1d3a2c]" />

            {/* Products */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-xs font-mono uppercase tracking-wider text-[#c5c9b1]/80">Products</h3>
                    <Button
                        type="button"
                        onClick={addProduct}
                        variant="ghost"
                        className="space-x-2 text-[#ccf15a] hover:bg-[#112f21] hover:text-white border border-[#1d3a2c] hover:border-[#ccf15a]/30 transition-all font-mono text-xs uppercase tracking-wider px-3.5 py-1.5 h-8 rounded-lg"
                    >
                        <PlusCircle className="h-4 w-4" />
                        <span>Add Product</span>
                    </Button>
                </div>
                <Accordion type="single" collapsible className="w-full">
                    {products.map((product, index) => (
                        <AccordionItem value={`item-${index}`} key={index} className="border-b border-[#1d3a2c]">
                            <AccordionTrigger className="text-sm font-semibold text-[#c8ebd5] hover:text-white hover:no-underline py-3">
                                {product.productName || `Product ${index + 1}`}
                            </AccordionTrigger>
                            <AccordionContent className="space-y-4 pt-2 pb-4">
                                <div className="space-y-2">
                                    <Label htmlFor={`productName-${index}`} className="text-xs text-[#c8ebd5]/70">
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
                                        className="bg-[#00180c] border border-[#1d3a2c] text-white focus-visible:ring-1 focus-visible:ring-[#ccf15a] focus-visible:ring-offset-0 focus:border-[#ccf15a]"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label
                                        htmlFor={`productDescription-${index}`}
                                        className="text-xs text-[#c8ebd5]/70"
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
                                        className="bg-[#00180c] border border-[#1d3a2c] text-white focus-visible:ring-1 focus-visible:ring-[#ccf15a] focus-visible:ring-offset-0 focus:border-[#ccf15a]"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor={`productPrice-${index}`} className="text-xs text-[#c8ebd5]/70">
                                        Product Price
                                    </Label>
                                    <Input
                                        id={`productPrice-${index}`}
                                        type="number"
                                        placeholder="Enter the product price"
                                        value={product.productPrice}
                                        onChange={(e) =>
                                            updateProduct(index, {
                                                ...product,
                                                productPrice:
                                                    parseFloat(
                                                        e.target.value
                                                    ) || 0,
                                            })
                                        }
                                        className="bg-[#00180c] border border-[#1d3a2c] text-white focus-visible:ring-1 focus-visible:ring-[#ccf15a] focus-visible:ring-offset-0 focus:border-[#ccf15a]"
                                    />
                                </div>
                                <Button
                                    type="button"
                                    variant="destructive"
                                    onClick={() => removeProduct(index)}
                                    className="mt-4 bg-red-950/20 border border-red-900/40 text-[#ffb4ab] hover:bg-red-900 hover:text-white font-bold uppercase tracking-wider text-xs px-3.5 py-1.5"
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Remove Product
                                </Button>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </div>
    );
}
