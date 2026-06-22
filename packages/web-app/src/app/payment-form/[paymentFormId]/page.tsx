// pages/payment-form/page.tsx
'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { CheckoutInfo } from '@/schemas/checkout-info';
import { ColorScheme, FontFamily, FormAppearance, PaymentForm, Product } from '@/schemas/payment-form';
import { AlertCircle, Loader2 } from 'lucide-react';
import { use, useEffect, useState } from 'react';
import { ProductCard } from './_components/product-card';

// Map color schemes to CSS classes - same as in form-preview.tsx
const colorSchemeClasses: Record<
    ColorScheme,
    {
        background: string;
        card: string;
        text: string;
        accent: string;
        button: string;
        input: string;
    }
> = {
    slate: {
        background: 'bg-wizpay-light-primary-100',
        card: 'bg-white border-wizpay-light-primary-300',
        text: 'text-wizpay-light-secondary-500',
        accent: 'text-wizpay-light-accent-100',
        button: 'bg-wizpay-light-accent-100 hover:bg-wizpay-light-accent-200 text-white',
        input: 'border-wizpay-light-primary-300 focus:ring-wizpay-light-accent-100',
    },
    azure: {
        background: 'bg-azure-light-primary-100',
        card: 'bg-white border-azure-light-primary-300',
        text: 'text-azure-light-secondary-500',
        accent: 'text-azure-light-accent-100',
        button: 'bg-azure-light-accent-100 hover:bg-azure-light-accent-200 text-white',
        input: 'border-azure-light-primary-300 focus:ring-azure-light-accent-100',
    },
    emerald: {
        background: 'bg-[#00180c]',
        card: 'bg-[#062517] border border-[#1d3a2c] text-[#c8ebd5]',
        text: 'text-[#c8ebd5]',
        accent: 'text-[#ccf15a]',
        button: 'bg-[#ccf15a] hover:bg-[#b0d440] text-[#161e00] font-bold rounded-lg transition-transform hover:scale-[1.02]',
        input: 'bg-[#001208] border-[#1d3a2c] text-[#ffffff] placeholder:text-[#c8ebd5]/40 focus:ring-[#ccf15a] focus:border-[#ccf15a]',
    },
    ruby: {
        background: 'bg-ruby-light-primary-100',
        card: 'bg-white border-ruby-light-primary-300',
        text: 'text-ruby-light-secondary-500',
        accent: 'text-ruby-light-accent-100',
        button: 'bg-ruby-light-accent-100 hover:bg-ruby-light-accent-200 text-white',
        input: 'border-ruby-light-primary-300 focus:ring-ruby-light-accent-100',
    },
    amethyst: {
        background: 'bg-amethyst-light-primary-100',
        card: 'bg-white border-amethyst-light-primary-300',
        text: 'text-amethyst-light-secondary-500',
        accent: 'text-amethyst-light-accent-100',
        button: 'bg-amethyst-light-accent-100 hover:bg-amethyst-light-accent-200 text-white',
        input: 'border-amethyst-light-primary-300 focus:ring-amethyst-light-accent-100',
    },
    amber: {
        background: 'bg-amber-light-primary-100',
        card: 'bg-white border-amber-light-primary-300',
        text: 'text-amber-light-secondary-500',
        accent: 'text-amber-light-accent-100',
        button: 'bg-amber-light-accent-100 hover:bg-amber-light-accent-200 text-white',
        input: 'border-amber-light-primary-300 focus:ring-amber-light-accent-100',
    },
    custom: {
        background: 'bg-[var(--wp-bg)]',
        card: 'bg-[var(--wp-card)] border-[var(--wp-border-width)] border-[var(--wp-border)] text-[var(--wp-text)] shadow-[var(--wp-shadow)]',
        text: 'text-[var(--wp-text)]',
        accent: 'text-[var(--wp-accent)]',
        button: 'bg-[var(--wp-btn-bg)] hover:bg-[var(--wp-btn-hover-bg)] text-[var(--wp-btn-text)] rounded-[var(--wp-border-radius)] transition-transform hover:scale-[1.02]',
        input: 'bg-[var(--wp-input-bg)] border-[var(--wp-input-border)] text-[var(--wp-text)] placeholder:text-[var(--wp-text)]/40 focus:ring-[var(--wp-input-focus)] focus:border-[var(--wp-input-focus)]',
    },
};

// Map font families to CSS classes - same as in form-preview.tsx
const fontFamilyClasses: Record<FontFamily, string> = {
    inter: 'font-sans',
    playfair: 'font-serif',
    nunito: 'font-nunito',
    work: 'font-work',
};

function PaymentFormPage({
    params,
}: {
    params: Promise<{ paymentFormId: string }>;
}) {
    const unwrappedParams = use(params);
    const paymentFormId = unwrappedParams.paymentFormId;

    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);

    const [paymentForm, setPaymentForm] = useState<PaymentForm>({
        paymentFormTitle: '',
        paymentFormDescription: '',
        paymentFormSuccessURL: '',
        paymentFormCancelURL: '',
        paymentFormWebhookURL: '',
        paymentFormPaymongoPubKey: '',
        paymentFormPaymongoSecKey: '',
        paymentFormProducts: [] as Product[],
        userId: '',
        appearance: {
            colorScheme: 'slate' as ColorScheme,
            fontFamily: 'inter' as FontFamily,
        },
    });

    const [checkoutInfo, setCheckoutInfo] = useState({
        checkoutName: '',
        checkoutEmail: '',
        checkoutPhone: '',
    });

    const [errors, setErrors] = useState({
        checkoutName: '',
        checkoutEmail: '',
        checkoutPhone: '',
        products: '',
    });

    // Show a friendly message on the current page when checkout opens in a new tab
    const [checkoutStarted, setCheckoutStarted] = useState(false);
    const [lastCheckoutUrl, setLastCheckoutUrl] = useState<string | null>(null);

    // Compute totalAmount dynamically during render to avoid synchronous state updates in useEffect
    const totalAmount = selectedProducts.reduce(
        (sum, product) => sum + product.productPrice,
        0
    );

    // Define fetchData first so it is declared before usage
    const fetchData = async (id: string) => {
        try {
            const response = await fetch(
                `/api/payment-forms/query?paymentFormId=${id}`
            );
            if (response.ok) {
                const data = await response.json();
                setPaymentForm(data);

                // Parse pre-selected products from query parameters upon successful load
                if (typeof window !== 'undefined' && data.paymentFormProducts && data.paymentFormProducts.length > 0) {
                    const params = new URLSearchParams(window.location.search);
                    const productsParam = params.get('products');
                    if (productsParam) {
                        const productNames = productsParam.split(',').map(name => decodeURIComponent(name).trim());
                        const matchingProducts = data.paymentFormProducts.filter((p: any) => 
                            productNames.includes(p.productName.trim())
                        );
                        setSelectedProducts(matchingProducts);
                    }
                }
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(paymentFormId);
    }, [paymentFormId]);

    // Load custom Google Font dynamically if not one of the presets
    useEffect(() => {
        const fontFamily = paymentForm.appearance?.fontFamily;
        if (fontFamily && !['inter', 'playfair', 'nunito', 'work'].includes(fontFamily)) {
            const fontId = `wizpay-custom-font-${fontFamily.replace(/\s+/g, '-').toLowerCase()}`;
            if (!document.getElementById(fontId)) {
                const link = document.createElement('link');
                link.id = fontId;
                link.rel = 'stylesheet';
                link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontFamily)}:wght@400;500;600;700&display=swap`;
                document.head.appendChild(link);
            }
        }
    }, [paymentForm.appearance?.fontFamily]);

    const handleProductSelect = (product: Product, selected: boolean) => {
        setSelectedProducts((prev) => {
            if (selected) {
                return [...prev, product];
            } else {
                return prev.filter(
                    (p) => p.productName !== product.productName
                );
            }
        });
        // Clear product error when a product is selected
        if (selected && errors.products) {
            setErrors((prev) => ({ ...prev, products: '' }));
        }
    };

    const validateFields = () => {
        const newErrors = {
            checkoutName: '',
            checkoutEmail: '',
            checkoutPhone: '',
            products: '',
        };

        // Product selection validation
        if (selectedProducts.length === 0) {
            newErrors.products = 'Please select at least one product.';
        }

        // Name validation: required
        if (!checkoutInfo.checkoutName.trim()) {
            newErrors.checkoutName = 'Name is required.';
        }

        // Email validation: required and valid format
        if (!checkoutInfo.checkoutEmail.trim()) {
            newErrors.checkoutEmail = 'Email is required.';
        } else if (
            !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(
                checkoutInfo.checkoutEmail
            )
        ) {
            newErrors.checkoutEmail = 'Invalid email address.';
        }

        // Phone validation: required and valid format
        if (!checkoutInfo.checkoutPhone.trim()) {
            newErrors.checkoutPhone = 'Phone number is required.';
        } else if (!/^\d{10,15}$/.test(checkoutInfo.checkoutPhone)) {
            newErrors.checkoutPhone = 'Phone number must contain 10-15 digits.';
        }

        setErrors(newErrors);

        // Return true if there are no errors
        return Object.values(newErrors).every((error) => error === '');
    };

    const handleSubmit = async (
        event: React.FormEvent,
        formData: CheckoutInfo
    ) => {
        event.preventDefault();
        if (!validateFields()) return;

        // Show waiting message immediately and reset last URL
        setCheckoutStarted(true);
        setLastCheckoutUrl(null);

        setIsSubmitting(true);
        try {
            const response = await fetch(
                `/api/paymongo?paymentFormId=${paymentFormId}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        ...formData,
                        selectedProducts, // Add selected products to the request
                    }),
                }
            );
            if (response.ok) {
                const checkoutSession = await response.json();

                if (checkoutSession.checkoutURL) {
                    // Redirect current window to the payment gateway
                    window.location.href = checkoutSession.checkoutURL;
                    setLastCheckoutUrl(checkoutSession.checkoutURL as string);
                } else {
                    console.error(
                        'Failed to create checkout session:',
                        checkoutSession
                    );
                }
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    // Get appearance settings from paymentForm
    const appearance = paymentForm.appearance || {
        colorScheme: 'slate' as ColorScheme,
        fontFamily: 'inter' as FontFamily,
    };

    // Apply the selected color scheme and typography
    const colorScheme = appearance.colorScheme || 'slate';
    const colorClasses = colorSchemeClasses[colorScheme];

    // Check if custom font family is used
    const isPresetFont = ['inter', 'playfair', 'nunito', 'work'].includes(appearance.fontFamily || 'inter');
    const fontClass = isPresetFont 
        ? fontFamilyClasses[(appearance.fontFamily || 'inter') as FontFamily] 
        : '';
    const fontStyle = !isPresetFont && appearance.fontFamily 
        ? { fontFamily: appearance.fontFamily } 
        : {};

    const isEmerald = colorScheme === 'emerald';
    const isCustom = colorScheme === 'custom' || !!appearance.customColors;

    // Define custom style properties
    const customStyleVariables = isCustom && appearance.customColors ? {
        '--wp-bg': appearance.customColors.background || '#F9F4EB',
        '--wp-card': appearance.customColors.card || '#FFFFFF',
        '--wp-text': appearance.customColors.text || '#171004',
        '--wp-text-muted': appearance.customColors.textMuted || '#6b7280',
        '--wp-accent': appearance.customColors.accent || '#6366F1',
        '--wp-btn-bg': appearance.customColors.buttonBg || '#6366F1',
        '--wp-btn-text': appearance.customColors.buttonText || '#FFFFFF',
        '--wp-btn-hover-bg': appearance.customColors.buttonHoverBg || '#4F46E5',
        '--wp-input-bg': appearance.customColors.inputBg || '#FFFFFF',
        '--wp-input-border': appearance.customColors.inputBorder || '#E0DCD4',
        '--wp-input-focus': appearance.customColors.inputFocusRing || '#6366F1',
        '--wp-border': appearance.customColors.borderColor || '#E0DCD4',
        '--wp-border-radius': appearance.borderRadius || (appearance.buttonShape === 'pill' ? '9999px' : appearance.buttonShape === 'sharp' ? '0px' : '12px'),
        '--wp-border-width': appearance.cardBorderWidth || '1px',
        '--wp-shadow': appearance.shadowSize === 'none' ? '0 0 #0000' 
                       : appearance.shadowSize === 'sm' ? '0 1px 2px 0 rgb(0 0 0 / 0.05)'
                       : appearance.shadowSize === 'md' ? '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
                       : appearance.shadowSize === 'lg' ? '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)'
                       : appearance.shadowSize === 'xl' ? '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
                       : appearance.shadowSize === '2xl' ? '0 25px 50px -12px rgb(0 0 0 / 0.25)'
                       : '0 4px 6px -1px rgb(0 0 0 / 0.05)',
    } as React.CSSProperties : {};

    const combinedStyles = { ...customStyleVariables, ...fontStyle };
    const isSplit = appearance.layout === 'split';

    // If checkout has started, show a dedicated post-click view
    if (checkoutStarted) {
        return (
            <div
                className={cn(
                    'min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center',
                    colorClasses.background,
                    fontClass
                )}
                style={combinedStyles}
            >
                <Card
                    className={cn(
                        'w-full max-w-lg mx-auto shadow-lg border-2 p-4 transition-all duration-300',
                        colorClasses.card
                    )}
                >
                    <CardHeader className="text-center">
                        <div className={cn("mx-auto flex items-center justify-center h-12 w-12 rounded-full mb-4 animate-bounce", isEmerald ? "bg-[#1d3a2c] text-[#ccf15a]" : isCustom ? "bg-[var(--wp-accent)]/10 text-[var(--wp-accent)]" : "bg-green-100 text-green-600")}>
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <CardTitle
                            className={cn(
                                'text-2xl font-bold tracking-tight',
                                colorClasses.text
                            )}
                        >
                            Redirecting to Secure Checkout
                        </CardTitle>
                        <CardDescription
                            className={cn(colorClasses.text, 'opacity-80 mt-2')}
                        >
                            Connecting you to PayMongo&apos;s secure gateway. Please do not close this window.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 text-center">
                        <div className={cn("p-4 rounded-xl border border-dashed", isEmerald ? "bg-[#001208] border-[#1d3a2c]" : isCustom ? "bg-[var(--wp-bg)]/50 border-[var(--wp-border)]" : "bg-slate-50 border-slate-200")}>
                            {lastCheckoutUrl ? (
                                <p className={cn('text-sm font-medium', colorClasses.text)}>
                                    Taking too long?{' '}
                                    <a
                                        href={lastCheckoutUrl}
                                        className={cn("underline font-semibold transition-colors", isEmerald ? "text-[#ccf15a] hover:text-[#b0d440]" : "text-indigo-600 hover:text-indigo-800")}
                                    >
                                        Click here to redirect manually
                                    </a>
                                    .
                                </p>
                            ) : (
                                <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
                                    <Loader2 className={cn("h-4 w-4 animate-spin", isEmerald ? "text-[#ccf15a]" : "text-indigo-600")} />
                                    <span className={cn(isEmerald && "text-[#c8ebd5]/70")}>Generating checkout session...</span>
                                </div>
                            )}
                        </div>
                        <div className={cn("text-xs space-y-1", isEmerald ? "text-[#c8ebd5]/50" : "text-slate-400")}>
                            <p>Funds are securely processed via BSP-regulated PayMongo integration.</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div
            className={cn(
                'min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center transition-colors duration-300',
                colorClasses.background,
                fontClass
            )}
            style={combinedStyles}
        >
            {appearance.customCSS && (
                <style dangerouslySetInnerHTML={{ __html: appearance.customCSS }} />
            )}
            <Card
                className={cn(
                    'w-full mx-auto shadow-xl border-2 overflow-hidden transition-all duration-300 transform hover:shadow-2xl',
                    isSplit ? 'max-w-5xl' : 'max-w-2xl',
                    colorClasses.card
                )}
            >
                <div className="h-2 bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-500" />
                <CardHeader className={cn("space-y-2 border-b p-6 sm:p-8", isEmerald ? "border-[#1d3a2c] bg-[#062517]" : isCustom ? "border-[var(--wp-border)] bg-[var(--wp-card)]" : "border-slate-100 bg-white")}>
                    <div className="flex justify-between items-start gap-4">
                        <div>
                            <CardTitle
                                className={cn(
                                    'text-2xl sm:text-3xl font-extrabold tracking-tight',
                                    colorClasses.text
                                )}
                            >
                                {paymentForm.paymentFormTitle || 'WizPay Checkout'}
                            </CardTitle>
                            <CardDescription
                                className={cn(colorClasses.text, 'opacity-70 mt-1.5 text-sm sm:text-base leading-relaxed')}
                            >
                                {paymentForm.paymentFormDescription}
                            </CardDescription>
                        </div>
                        {appearance.showMerchantBadge !== false && (
                            <span className={cn("inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold", isEmerald ? "bg-[#1d3a2c] text-[#a6d0b5]" : isCustom ? "bg-[var(--wp-bg)] text-[var(--wp-accent)] border border-[var(--wp-border)]" : "bg-slate-100 text-slate-600")}>
                                Verified Merchant
                            </span>
                        )}
                    </div>
                </CardHeader>
                <CardContent className={cn("p-6 sm:p-8 space-y-8", isEmerald ? "bg-[#022113]/30" : isCustom ? "bg-[var(--wp-bg)]/20" : "bg-slate-50/50")}>
                    <div className={cn(
                        "grid grid-cols-1 gap-8",
                        isSplit ? "md:grid-cols-2 md:space-y-0" : "space-y-8"
                    )}>
                        {/* STEP 1: Products */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <span className={cn("flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold", isEmerald ? "bg-[#1d3a2c] text-[#ccf15a]" : isCustom ? "bg-[var(--wp-accent)]/20 text-[var(--wp-accent)]" : "bg-slate-200 text-slate-700")}>1</span>
                                <h3
                                    className={cn(
                                        'text-base font-bold uppercase tracking-wider',
                                        colorClasses.text
                                    )}
                                >
                                    Select Items to Purchase
                                </h3>
                            </div>
                            {errors.products && (
                                <Alert variant="destructive" className="mb-2">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>
                                        {errors.products}
                                    </AlertDescription>
                                </Alert>
                            )}
                            <div className="grid grid-cols-1 gap-3">
                                {paymentForm.paymentFormProducts.map(
                                    (product, index) => (
                                        <ProductCard
                                            key={index}
                                            product={product}
                                            isSelected={selectedProducts.some(
                                                (p) =>
                                                    p.productName ===
                                                    product.productName
                                            )}
                                            onSelect={handleProductSelect}
                                            appearance={appearance}
                                        />
                                    )
                                )}
                            </div>
                            {selectedProducts.length > 0 && (
                                <div className={cn("mt-4 p-5 rounded-2xl border shadow-sm flex justify-between items-center transition-all duration-300", isEmerald ? "bg-[#022113] border-[#1d3a2c]" : isCustom ? "bg-[var(--wp-card)] border-[var(--wp-border)]" : "bg-white border-slate-200")}>
                                    <span className={cn('text-sm font-medium', isEmerald ? 'text-[#c8ebd5]/70' : isCustom ? 'text-[var(--wp-text)]/70' : 'text-slate-500')}>Total Purchase Value:</span>
                                    <p
                                        className={cn(
                                            'text-xl sm:text-2xl font-extrabold',
                                            colorClasses.text
                                        )}
                                    >
                                        Total Amount:{' '}
                                        <span className={cn(isEmerald ? 'text-[#ccf15a]' : isCustom ? 'text-[var(--wp-accent)]' : 'text-indigo-600', 'font-extrabold')}>
                                            ₱{totalAmount.toFixed(2)}
                                        </span>
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* STEP 2: Checkout Info */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <span className={cn("flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold", isEmerald ? "bg-[#1d3a2c] text-[#ccf15a]" : isCustom ? "bg-[var(--wp-accent)]/20 text-[var(--wp-accent)]" : "bg-slate-200 text-slate-700")}>2</span>
                                <h3
                                    className={cn(
                                        'text-base font-bold uppercase tracking-wider',
                                        colorClasses.text
                                    )}
                                >
                                    Customer Information
                                </h3>
                            </div>
                            <form className={cn("grid grid-cols-1 gap-4 sm:grid-cols-2 p-5 sm:p-6 rounded-2xl border shadow-sm", isEmerald ? "bg-[#022113] border-[#1d3a2c]" : isCustom ? "bg-[var(--wp-card)] border-[var(--wp-border)]" : "bg-white border-slate-200")}>
                                <div className="space-y-1.5 sm:col-span-2">
                                    <Label
                                        htmlFor="name"
                                        className={cn("text-sm font-semibold", isEmerald ? "text-[#c8ebd5]" : isCustom ? "text-[var(--wp-text)]" : "text-slate-700")}
                                    >
                                        Full Name
                                    </Label>
                                    <Input
                                        id="name"
                                        placeholder="e.g. Juan dela Cruz"
                                        value={checkoutInfo.checkoutName}
                                        onChange={(e) =>
                                            setCheckoutInfo({
                                                ...checkoutInfo,
                                                checkoutName: e.target.value,
                                            })
                                        }
                                        className={cn(
                                            'min-h-[48px] rounded-xl',
                                            colorClasses.input,
                                            errors.checkoutName &&
                                                'border-red-500 focus:ring-red-500'
                                        )}
                                    />
                                    {errors.checkoutName && (
                                        <p className="text-red-500 text-xs font-medium">
                                            {errors.checkoutName}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-1.5">
                                    <Label
                                        htmlFor="email"
                                        className={cn("text-sm font-semibold", isEmerald ? "text-[#c8ebd5]" : isCustom ? "text-[var(--wp-text)]" : "text-slate-700")}
                                    >
                                        Email Address
                                    </Label>
                                    <Input
                                        id="email"
                                        placeholder="name@example.com"
                                        type="email"
                                        value={checkoutInfo.checkoutEmail}
                                        onChange={(e) =>
                                            setCheckoutInfo({
                                                ...checkoutInfo,
                                                checkoutEmail: e.target.value,
                                            })
                                        }
                                        className={cn(
                                            'min-h-[48px] rounded-xl',
                                            colorClasses.input,
                                            errors.checkoutEmail &&
                                                'border-red-500 focus:ring-red-500'
                                        )}
                                    />
                                    {errors.checkoutEmail && (
                                        <p className="text-red-500 text-xs font-medium">
                                            {errors.checkoutEmail}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-1.5">
                                    <Label
                                        htmlFor="phone"
                                        className={cn("text-sm font-semibold", isEmerald ? "text-[#c8ebd5]" : "text-slate-700")}
                                    >
                                        Mobile Phone Number
                                    </Label>
                                    <Input
                                        id="phone"
                                        placeholder="e.g. 09171234567"
                                        type="tel"
                                        value={checkoutInfo.checkoutPhone}
                                        onChange={(e) =>
                                            setCheckoutInfo({
                                                ...checkoutInfo,
                                                checkoutPhone: e.target.value,
                                            })
                                        }
                                        className={cn(
                                            'min-h-[48px] rounded-xl',
                                            colorClasses.input,
                                            errors.checkoutPhone &&
                                                'border-red-500 focus:ring-red-500'
                                        )}
                                    />
                                    {errors.checkoutPhone && (
                                        <p className="text-red-500 text-xs font-medium">
                                            {errors.checkoutPhone}
                                        </p>
                                    )}
                                </div>
                                
                                <div className={cn("sm:col-span-2 pt-4 border-t", isEmerald ? "border-[#1d3a2c]" : isCustom ? "border-[var(--wp-border)]" : "border-slate-100")}>
                                    <div className="flex flex-col gap-3">
                                        <div className={cn("flex items-center justify-between text-xs", isEmerald ? "text-[#a6d0b5]/70" : isCustom ? "text-[var(--wp-text)]/50" : "text-slate-400")}>
                                            <span>Supported Local Payment Options:</span>
                                        </div>
                                        <div className="flex flex-wrap gap-2 items-center">
                                            <span className="px-2.5 py-1 rounded bg-[#007DFE] text-white text-[10px] font-bold tracking-wider">GCASH</span>
                                            <span className="px-2.5 py-1 rounded bg-[#1C1C1C] text-[#12F06E] text-[10px] font-extrabold tracking-wider border border-slate-800">MAYA</span>
                                            <span className="px-2.5 py-1 rounded bg-[#00B159] text-white text-[10px] font-bold tracking-wider">GRABPAY</span>
                                            <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-700 text-[10px] font-bold border border-slate-200">CARDS (VISA/MC)</span>
                                            <span className="px-2.5 py-1 rounded bg-orange-100 text-orange-600 text-[10px] font-bold border border-orange-200">BILLEASE</span>
                                            <span className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">QR PH</span>
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    type="button"
                                    onClick={(e) =>
                                        handleSubmit(
                                            e,
                                            checkoutInfo as CheckoutInfo
                                        )
                                    }
                                    disabled={isSubmitting || selectedProducts.length === 0}
                                    className={cn(
                                        'sm:col-span-2 min-h-[48px] rounded-xl text-base font-bold shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.01] mt-2 active:scale-100',
                                        colorClasses.button
                                    )}
                                >
                                    {isSubmitting ? (
                                        <span className="inline-flex items-center gap-2">
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                            Redirecting to Gateway…
                                        </span>
                                    ) : (
                                        appearance.checkoutButtonText || `Pay ₱${totalAmount.toFixed(2)} Securely`
                                    )}
                                </Button>
                            </form>
                        </div>
                    </div>
                </CardContent>
                <div className={cn("border-t p-4 text-center", isEmerald ? "border-[#1d3a2c] bg-[#022113]" : isCustom ? "border-[var(--wp-border)] bg-[var(--wp-card)]" : "border-slate-100 bg-slate-50")}>
                    <p className={cn("text-xs font-medium flex items-center justify-center gap-1.5", isEmerald ? "text-[#a6d0b5]/50" : isCustom ? "text-[var(--wp-text)]/50" : "text-slate-400")}>
                        <svg className={cn("h-3.5 w-3.5", isEmerald ? "text-[#a6d0b5]/50" : isCustom ? "text-[var(--wp-text)]/50" : "text-slate-400")} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        SSL Encrypted & Powered by WizPay Core Engine
                    </p>
                </div>
            </Card>
        </div>
    );
}

export default PaymentFormPage;
