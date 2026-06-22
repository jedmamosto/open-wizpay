'use client';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge'; // Add this import from shadcn/ui
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { PaymentForm } from '@/schemas/payment-form';
import {
    AlertCircle,
    Check,
    ChevronDown,
    ChevronUp,
    Copy,
    ExternalLink,
    Pencil,
    Trash2,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import EditPaymentFormCard from './edit-payment-form-card';

// Secure field component with copy functionality
interface SecureFieldProps {
    label: string;
    value: string;
    fieldId: string;
    isSecret?: boolean;
    copiedField: string | null;
    onCopy: (value: string, fieldId: string) => void;
}

function SecureField({
    label,
    value,
    fieldId,
    isSecret = false,
    copiedField,
    onCopy,
}: SecureFieldProps) {
    return (
        <div className="space-y-1.5 w-full">
            <Label className="text-xs font-mono uppercase tracking-wider text-[#c5c9b1]/70 flex items-center gap-2">
                {label}
            </Label>
            <div className="flex items-center justify-between p-3 bg-[#00180c] border border-[#112f21] rounded-lg group relative hover:border-[#ccf15a]/30 transition-all">
                <span className="text-xs font-mono truncate max-w-[calc(100%-2rem)] text-white">
                    {isSecret ? '•'.repeat(16) : value}
                </span>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-[#ccf15a] opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#112f21] hover:text-white"
                                onClick={() => onCopy(value, fieldId)}
                            >
                                {copiedField === fieldId ? (
                                    <Check className="h-4 w-4" />
                                ) : (
                                    <Copy className="h-4 w-4" />
                                ) }
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent className="bg-[#022113] border border-[#1d3a2c] text-white">
                            {copiedField === fieldId
                                ? 'Copied!'
                                : 'Copy to clipboard'}
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        </div>
    );
}

// Product card component
function ProductCard({
    product,
}: {
    product: PaymentForm['paymentFormProducts'][0];
}) {
    return (
        <div className="bg-[#00180c] border border-[#112f21] rounded-lg p-4 space-y-2 hover:border-[#1d3a2c] transition-colors">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm text-white">
                    {product.productName}
                </h3>
                <Badge className="bg-[#022113] text-[#ccf15a] border border-[#ccf15a]/20 font-mono text-xs">
                    PHP {product.productPrice.toFixed(2)}
                </Badge>
            </div>
            {product.productDescription && (
                <p className="text-xs text-[#a6d0b5]/70">
                    {product.productDescription}
                </p>
            )}
        </div>
    );
}

interface PaymentFormCardProps {
    paymentFormData: PaymentForm;
    onEdit: (updatedPaymentForm: PaymentForm) => void;
    onDelete: (paymentFormId: string) => void;
}

export default function PaymentFormCard({
    paymentFormData,
    onEdit,
    onDelete,
}: PaymentFormCardProps) {
    // State management
    const [isExpanded, setIsExpanded] = useState<string | null>(null);
    const [copiedField, setCopiedField] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [currentFormData, setCurrentFormData] =
        useState<PaymentForm>(paymentFormData);

    // Guard clause for missing data
    if (!currentFormData?.paymentFormId) {
        return (
            <Card className="w-full bg-[#001208]/50 border border-[#1d3a2c]">
                <CardContent className="flex items-center justify-center p-6">
                    <div className="text-center space-y-2">
                        <AlertCircle className="mx-auto h-8 w-8 text-[#a6d0b5]/50 animate-pulse" />
                        <p className="text-sm text-[#a6d0b5]/70">
                            No payment form data available
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Destructure form data for easier access
    const {
        paymentFormId,
        paymentFormTitle,
        paymentFormDescription,
        paymentFormSuccessURL,
        paymentFormCancelURL,
        paymentFormWebhookURL,
        paymentFormPaymongoPubKey,
        paymentFormPaymongoSecKey,
        paymentFormProducts,
    } = currentFormData;

    // Helper function to copy text to clipboard with error handling
    const copyToClipboard = async (text: string, field: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedField(field);
            setTimeout(() => setCopiedField(null), 2000);
        } catch (err) {
            console.error('Failed to copy text:', err);
        }
    };



    // Handle form editing
    const handleEditSubmit = (updatedPaymentForm: PaymentForm) => {
        setCurrentFormData(updatedPaymentForm);
        onEdit(updatedPaymentForm);
        setIsEditing(false);
    };

    return (
        <Card className="w-full min-w-[300px] flex flex-col h-full border-[#1d3a2c] bg-[#001208]/90 text-[#c8ebd5] rounded-xl hover:border-[#ccf15a]/30 transition-all duration-300 shadow-md">
            <CardHeader className="space-y-4">
                <div className="flex flex-col gap-4">
                    <CardTitle className="text-xl text-center font-bold text-white font-mono uppercase tracking-wider">
                        {paymentFormTitle}
                    </CardTitle>
                    <div className="flex items-center justify-center gap-2">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => setIsEditing(true)}
                                        className="bg-[#00180c] border border-[#1d3a2c] text-[#c8ebd5] hover:border-[#ccf15a]/50 hover:text-white"
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent className="bg-[#022113] border border-[#1d3a2c] text-white">Edit form</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() =>
                                            setIsDeleteDialogOpen(true)
                                        }
                                        className="bg-[#00180c] border border-[#1d3a2c] text-[#c8ebd5] hover:border-red-500/50 hover:text-red-400"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent className="bg-[#022113] border border-[#1d3a2c] text-white">Delete form</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>
                <CardDescription className="text-center text-[#c5c9b1]/60 text-xs">
                    {paymentFormDescription}
                </CardDescription>
            </CardHeader>

            {isExpanded === paymentFormId && (
                <CardContent className="space-y-6 flex-grow">
                    <div className="space-y-4 max-w-full">
                        <SecureField
                            label="Success URL"
                            value={paymentFormSuccessURL}
                            fieldId="successURL"
                            copiedField={copiedField}
                            onCopy={copyToClipboard}
                        />
                        <SecureField
                            label="Cancel URL"
                            value={paymentFormCancelURL}
                            fieldId="cancelURL"
                            copiedField={copiedField}
                            onCopy={copyToClipboard}
                        />
                        <SecureField
                            label="Webhook URL"
                            value={paymentFormWebhookURL}
                            fieldId="webhookURL"
                            copiedField={copiedField}
                            onCopy={copyToClipboard}
                        />
                        <div className="pt-4">
                            <h3 className="text-xs font-mono uppercase tracking-wider text-[#c5c9b1]/80 mb-3">
                                API Keys
                            </h3>
                            <div className="space-y-3">
                                <SecureField
                                    label="Paymongo Public Key"
                                    value={paymentFormPaymongoPubKey}
                                    fieldId="publicKey"
                                    copiedField={copiedField}
                                    onCopy={copyToClipboard}
                                />
                                <SecureField
                                    label="Paymongo Secret Key"
                                    value={paymentFormPaymongoSecKey}
                                    fieldId="secretKey"
                                    isSecret
                                    copiedField={copiedField}
                                    onCopy={copyToClipboard}
                                />
                            </div>
                        </div>
                        {paymentFormProducts.length > 0 && (
                            <div className="pt-4">
                                <h3 className="text-xs font-mono uppercase tracking-wider text-[#c5c9b1]/80 mb-3">
                                    Products
                                </h3>
                                <div className="grid gap-4">
                                    {paymentFormProducts.map(
                                        (product, index) => (
                                            <ProductCard
                                                key={index}
                                                product={product}
                                            />
                                        )
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            )}

            <div className="mt-auto">
                <CardFooter className="flex justify-center gap-3 pt-6">
                    <Button
                        variant="outline"
                        className="flex-1 min-w-[120px] border-[#1d3a2c] bg-[#001208] text-[#c8ebd5] hover:bg-[#112f21] hover:text-white"
                        onClick={() =>
                            setIsExpanded(
                                isExpanded === paymentFormId
                                    ? null
                                    : paymentFormId
                            )
                        }
                    >
                        {isExpanded === paymentFormId ? (
                            <>
                                <ChevronUp className="mr-2 h-4 w-4" /> Show Less
                            </>
                        ) : (
                            <>
                                <ChevronDown className="mr-2 h-4 w-4" /> Show Details
                            </>
                        )}
                    </Button>
                    <Button className="flex-1 bg-[#022113] text-[#6dfe9c] border border-[#6dfe9c]/20 hover:bg-[#003919]/30 hover:text-white" asChild>
                        <Link href={`/payment-form/${paymentFormId}`}>
                            View Form <ExternalLink className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </CardFooter>
            </div>

            {/* Edit Dialog */}
            <Dialog open={isEditing} onOpenChange={setIsEditing}>
                <DialogContent className="max-w-6xl max-h-[90vh] border-[#1d3a2c] bg-[#001208] text-[#c8ebd5] p-6 shadow-2xl overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-white font-bold font-mono uppercase tracking-wider text-xl">Edit Payment Form</DialogTitle>
                    </DialogHeader>
                    <EditPaymentFormCard
                        paymentFormData={currentFormData}
                        onEdit={(updatedForm) => {
                            handleEditSubmit(updatedForm);
                            setIsEditing(false);
                        }}
                        onCancel={() => setIsEditing(false)}
                    />
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
            >
                <AlertDialogContent className="border-[#1d3a2c] bg-[#001208] text-[#c8ebd5] shadow-2xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-white font-bold">Delete Payment Form</AlertDialogTitle>
                        <AlertDialogDescription className="text-[#c5c9b1]/70 mt-1">
                            Are you sure you want to delete this payment form?
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="border-[#1d3a2c] bg-transparent text-[#c8ebd5] hover:bg-[#112f21] hover:text-white">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                onDelete(paymentFormId);
                                setIsDeleteDialogOpen(false);
                            }}
                            className="bg-red-800 hover:bg-red-900 text-white font-bold"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Card>
    );
}
