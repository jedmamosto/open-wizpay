'use client';

import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { ColorScheme, FontFamily, PaymentForm } from '@/schemas/payment-form';
import { Monitor, Smartphone } from 'lucide-react';
import { useEffect, useState } from 'react';

// Map color schemes to CSS classes
const colorSchemeClasses: Record<
    ColorScheme,
    {
        background: string;
        card: string;
        text: string;
        accent: string;
        button: string;
    }
> = {
    slate: {
        background: 'bg-wizpay-light-primary-100',
        card: 'bg-white',
        text: 'text-wizpay-light-secondary-200',
        accent: 'text-wizpay-light-accent-100',
        button: 'bg-wizpay-light-accent-100 hover:bg-wizpay-light-accent-200 text-white',
    },
    azure: {
        background: 'bg-azure-light-primary-100',
        card: 'bg-white',
        text: 'text-azure-light-secondary-200',
        accent: 'text-azure-light-accent-100',
        button: 'bg-azure-light-accent-100 hover:bg-azure-light-accent-200 text-white',
    },
    emerald: {
        background: 'bg-[#00180c]',
        card: 'bg-[#062517] border border-[#1d3a2c] text-[#c8ebd5]',
        text: 'text-[#c8ebd5]',
        accent: 'text-[#ccf15a]',
        button: 'bg-[#ccf15a] hover:bg-[#b0d440] text-[#161e00] font-bold rounded-lg transition-transform hover:scale-[1.02]',
    },
    ruby: {
        background: 'bg-ruby-light-primary-100',
        card: 'bg-white',
        text: 'text-ruby-light-secondary-200',
        accent: 'text-ruby-light-accent-100',
        button: 'bg-ruby-light-accent-100 hover:bg-ruby-light-accent-200 text-white',
    },
    amethyst: {
        background: 'bg-amethyst-light-primary-100',
        card: 'bg-white',
        text: 'text-amethyst-light-secondary-200',
        accent: 'text-amethyst-light-accent-100',
        button: 'bg-amethyst-light-accent-100 hover:bg-amethyst-light-accent-200 text-white',
    },
    amber: {
        background: 'bg-amber-light-primary-100',
        card: 'bg-white',
        text: 'text-amber-light-secondary-200',
        accent: 'text-amber-light-accent-100',
        button: 'bg-amber-light-accent-100 hover:bg-amber-light-accent-200 text-white',
    },
    custom: {
        background: 'bg-[var(--wp-bg)]',
        card: 'bg-[var(--wp-card)] border-[var(--wp-border-width)] border-[var(--wp-border)] text-[var(--wp-text)] shadow-[var(--wp-shadow)]',
        text: 'text-[var(--wp-text)]',
        accent: 'text-[var(--wp-accent)]',
        button: 'bg-[var(--wp-btn-bg)] hover:bg-[var(--wp-btn-hover-bg)] text-[var(--wp-btn-text)] rounded-[var(--wp-border-radius)] transition-transform hover:scale-[1.02]',
    },
};

// Map font families to CSS classes
const fontFamilyClasses: Record<FontFamily, string> = {
    inter: 'font-sans',
    playfair: 'font-serif',
    nunito: 'font-nunito',
    work: 'font-work',
};

interface FormPreviewProps {
    formData: PaymentForm;
}

export function FormPreview({ formData }: FormPreviewProps) {
    const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');

    // Get appearance settings from formData
    const appearance = formData.appearance || {
        colorScheme: 'slate' as ColorScheme,
        fontFamily: 'inter' as FontFamily,
    };

    // Load custom Google Font dynamically if not a standard preset
    useEffect(() => {
        const fontFamily = appearance.fontFamily;
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
    }, [appearance.fontFamily]);

    // Apply the selected color scheme and typography
    const colorScheme = appearance.colorScheme || 'slate';
    const colorClasses = colorSchemeClasses[colorScheme];
    
    const isPresetFont = ['inter', 'playfair', 'nunito', 'work'].includes(appearance.fontFamily || 'inter');
    const fontClass = isPresetFont 
        ? fontFamilyClasses[(appearance.fontFamily || 'inter') as FontFamily] 
        : '';
    const fontStyle = !isPresetFont && appearance.fontFamily 
        ? { fontFamily: appearance.fontFamily } 
        : {};

    const isEmerald = colorScheme === 'emerald';
    const isCustom = colorScheme === 'custom' || !!appearance.customColors;
    const isSplit = appearance.layout === 'split';

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

    return (
        <div className="flex flex-col h-full">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xs font-mono uppercase tracking-wider text-[#c5c9b1]/80">Live Preview</h3>
                <Tabs
                    value={viewMode}
                    onValueChange={(value) =>
                        setViewMode(value as 'desktop' | 'mobile')
                    }
                >
                    <TabsList className="bg-[#001208] border border-[#1d3a2c] h-9">
                        <TabsTrigger value="desktop" className="text-xs text-[#c8ebd5]/70 data-[state=active]:bg-[#ccf15a] data-[state=active]:text-[#161e00] font-bold h-8">
                            <Monitor className="h-4 w-4 mr-2" /> Desktop
                        </TabsTrigger>
                        <TabsTrigger value="mobile" className="text-xs text-[#c8ebd5]/70 data-[state=active]:bg-[#ccf15a] data-[state=active]:text-[#161e00] font-bold h-8">
                            <Smartphone className="h-4 w-4 mr-2" /> Mobile
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            <div
                className={cn(
                    'flex-1 overflow-hidden rounded-lg border border-[#1d3a2c]',
                    colorClasses.background
                )}
                style={combinedStyles}
            >
                {appearance.customCSS && (
                    <style dangerouslySetInnerHTML={{ __html: appearance.customCSS }} />
                )}
                <div
                    className={cn(
                        'h-full overflow-auto p-4',
                        viewMode === 'mobile' ? 'max-w-sm mx-auto' : ''
                    )}
                >
                    {/* Preview Payment Form */}
                    <div
                        className={cn(
                            'rounded-lg shadow-md p-6 border-2 transition-all duration-300',
                            isSplit && viewMode === 'desktop' ? 'max-w-4xl mx-auto' : '',
                            colorClasses.card,
                            fontClass
                        )}
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2
                                    className={cn(
                                        'text-2xl font-bold mb-2',
                                        colorClasses.text
                                    )}
                                >
                                    {formData.paymentFormTitle || 'Payment Form Title'}
                                </h2>
                                <p className={cn('text-sm opacity-80', colorClasses.text)}>
                                    {formData.paymentFormDescription ||
                                        'Payment form description goes here.'}
                                </p>
                            </div>
                            {appearance.showMerchantBadge !== false && (
                                <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap", isEmerald ? "bg-[#1d3a2c] text-[#a6d0b5]" : isCustom ? "bg-[var(--wp-bg)] text-[var(--wp-accent)] border border-[var(--wp-border)]" : "bg-slate-100 text-slate-600")}>
                                    Verified Merchant
                                </span>
                            )}
                        </div>

                        <div className={cn(
                            "grid grid-cols-1 gap-6",
                            isSplit && viewMode === 'desktop' ? "grid-cols-2" : "space-y-6"
                        )}>
                            {/* Product Selection */}
                            <div className="space-y-4">
                                <h3
                                    className={cn('font-medium border-b pb-2', colorClasses.text, isEmerald ? "border-[#1d3a2c]" : isCustom ? "border-[var(--wp-border)]" : "border-slate-100")}
                                >
                                    Select Product
                                </h3>
                                {formData.paymentFormProducts &&
                                formData.paymentFormProducts.length > 0 ? (
                                    formData.paymentFormProducts.map(
                                        (product, index) => (
                                            <div
                                                key={index}
                                                className={cn(
                                                    'p-4 border rounded-md flex justify-between items-center bg-white/5',
                                                    isCustom ? 'border-[var(--wp-border)]' : isEmerald ? 'border-[#1d3a2c]' : 'border-slate-200',
                                                    colorClasses.text
                                                )}
                                            >
                                                <div>
                                                    <p className="font-semibold text-sm">
                                                        {product.productName}
                                                    </p>
                                                    {appearance.showProductDescription !== false && product.productDescription && (
                                                        <p className="text-xs opacity-75 mt-0.5">
                                                            {product.productDescription}
                                                        </p>
                                                    )}
                                                </div>
                                                <p
                                                    className={cn(
                                                        'font-bold text-sm ml-4',
                                                        colorClasses.accent
                                                    )}
                                                >
                                                    ₱
                                                    {product.productPrice.toFixed(
                                                        2
                                                    )}
                                                </p>
                                            </div>
                                        )
                                    )
                                ) : (
                                    <div
                                        className={cn(
                                            'p-4 border rounded-md bg-white/5',
                                            isCustom ? 'border-[var(--wp-border)]' : isEmerald ? 'border-[#1d3a2c]' : 'border-slate-200',
                                            colorClasses.text
                                        )}
                                    >
                                        <p className="font-medium text-sm">Sample Product</p>
                                        <p
                                            className={cn(
                                                'font-bold text-sm',
                                                colorClasses.accent
                                            )}
                                        >
                                            ₱100.00
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Customer Information Fields */}
                            <div className="space-y-4">
                                <h3
                                    className={cn('font-medium border-b pb-2', colorClasses.text, isEmerald ? "border-[#1d3a2c]" : isCustom ? "border-[var(--wp-border)]" : "border-slate-100")}
                                >
                                    Customer Information
                                </h3>
                                <div className="space-y-2">
                                    <label
                                        className={cn(
                                            'block text-xs font-semibold',
                                            colorClasses.text
                                        )}
                                    >
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        className={cn("w-full p-2 border text-sm rounded-md", isCustom ? "bg-[var(--wp-input-bg)] border-[var(--wp-input-border)]" : "bg-white border-slate-200")}
                                        placeholder="John Doe"
                                        disabled
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label
                                        className={cn(
                                            'block text-xs font-semibold',
                                            colorClasses.text
                                        )}
                                    >
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        className={cn("w-full p-2 border text-sm rounded-md", isCustom ? "bg-[var(--wp-input-bg)] border-[var(--wp-input-border)]" : "bg-white border-slate-200")}
                                        placeholder="john.doe@example.com"
                                        disabled
                                    />
                                </div>

                                {/* Submit Button */}
                                <Button className={cn('w-full mt-4 min-h-[44px]', colorClasses.button)}>
                                    {appearance.checkoutButtonText || 'Proceed to Payment'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
