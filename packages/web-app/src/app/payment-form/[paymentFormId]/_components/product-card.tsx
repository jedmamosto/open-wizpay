// components/ProductCard.tsx
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { ColorScheme, FontFamily, FormAppearance, Product } from '@/schemas/payment-form';

// Map color schemes to CSS classes
const colorSchemeClasses: Record<
    ColorScheme,
    {
        card: string;
        text: string;
        accent: string;
        border: string;
        checkbox: string;
    }
> = {
    slate: {
        card: 'bg-white hover:bg-gray-50',
        text: 'text-wizpay-light-secondary-500',
        accent: 'text-wizpay-light-accent-100',
        border: 'border-wizpay-light-primary-300',
        checkbox:
            'border-wizpay-light-primary-300 data-[state=checked]:bg-wizpay-light-accent-100',
    },
    azure: {
        card: 'bg-white hover:bg-gray-50',
        text: 'text-azure-light-secondary-500',
        accent: 'text-azure-light-accent-100',
        border: 'border-azure-light-primary-300',
        checkbox:
            'border-azure-light-primary-300 data-[state=checked]:bg-azure-light-accent-100',
    },
    emerald: {
        card: 'bg-[#062517] hover:bg-[#112f21] text-[#c8ebd5]',
        text: 'text-[#c8ebd5]',
        accent: 'text-[#ccf15a]',
        border: 'border-[#1d3a2c]',
        checkbox:
            'border-[#1d3a2c] data-[state=checked]:bg-[#ccf15a] data-[state=checked]:border-[#ccf15a] data-[state=checked]:text-[#161e00]',
    },
    ruby: {
        card: 'bg-white hover:bg-gray-50',
        text: 'text-ruby-light-secondary-500',
        accent: 'text-ruby-light-accent-100',
        border: 'border-ruby-light-primary-300',
        checkbox:
            'border-ruby-light-primary-300 data-[state=checked]:bg-ruby-light-accent-100',
    },
    amethyst: {
        card: 'bg-white hover:bg-gray-50',
        text: 'text-amethyst-light-secondary-500',
        accent: 'text-amethyst-light-accent-100',
        border: 'border-amethyst-light-primary-300',
        checkbox:
            'border-amethyst-light-primary-300 data-[state=checked]:bg-amethyst-light-accent-100',
    },
    amber: {
        card: 'bg-white hover:bg-gray-50',
        text: 'text-amber-light-secondary-500',
        accent: 'text-amber-light-accent-100',
        border: 'border-amber-light-primary-300',
        checkbox:
            'border-amber-light-primary-300 data-[state=checked]:bg-amber-light-accent-100',
    },
    custom: {
        card: 'bg-[var(--wp-card)] hover:opacity-90 text-[var(--wp-text)]',
        text: 'text-[var(--wp-text)]',
        accent: 'text-[var(--wp-accent)]',
        border: 'border-[var(--wp-border)]',
        checkbox:
            'border-[var(--wp-border)] data-[state=checked]:bg-[var(--wp-accent)] data-[state=checked]:border-[var(--wp-accent)] data-[state=checked]:text-[var(--wp-btn-text)]',
    },
};

// Map font families to CSS classes
const fontFamilyClasses: Record<FontFamily, string> = {
    inter: 'font-sans',
    playfair: 'font-serif',
    nunito: 'font-nunito',
    work: 'font-work',
};

interface ProductCardProps {
    product: Product;
    isSelected: boolean;
    onSelect: (product: Product, selected: boolean) => void;
    appearance: FormAppearance;
}

export function ProductCard({
    product,
    isSelected,
    onSelect,
    appearance,
}: ProductCardProps) {
    // Apply the selected color scheme and typography
    const colorScheme = appearance.colorScheme || 'slate';
    const fontFamily = appearance.fontFamily || 'inter';

    const colorClasses = colorSchemeClasses[colorScheme];
    
    const isPresetFont = ['inter', 'playfair', 'nunito', 'work'].includes(fontFamily);
    const fontClass = isPresetFont 
        ? fontFamilyClasses[fontFamily as FontFamily] 
        : '';
    const fontStyle = !isPresetFont && fontFamily 
        ? { fontFamily } 
        : {};

    const isCustom = colorScheme === 'custom';

    return (
        <Card
            onClick={() => onSelect(product, !isSelected)}
            className={cn(
                'w-full hover:shadow-md transition-all duration-200 cursor-pointer border-2',
                colorClasses.card,
                colorClasses.border,
                isSelected && (
                    colorScheme === 'emerald' 
                        ? 'border-[#ccf15a] bg-[#022113] shadow-[0_0_15px_rgba(204,241,90,0.1)]' 
                        : isCustom 
                            ? 'border-[var(--wp-accent)] bg-[var(--wp-card)] shadow-[0_0_15px_var(--wp-accent)]/10'
                            : 'border-indigo-600 bg-slate-50/50'
                ),
                fontClass
            )}
            style={fontStyle}
        >
            <div className="p-4 flex items-start space-x-3">
                <Checkbox
                    checked={isSelected}
                    onCheckedChange={(checked) =>
                        onSelect(product, checked as boolean)
                    }
                    onClick={(e) => e.stopPropagation()}
                    className={cn('mt-1', colorClasses.checkbox)}
                />
                <div className="flex-1">
                    <h3
                        className={cn(
                            'font-semibold text-base',
                            colorClasses.text
                        )}
                    >
                        {product.productName}
                    </h3>
                    {appearance.showProductDescription !== false && product.productDescription && (
                        <p
                            className={cn(
                                'text-sm mt-0.5',
                                colorClasses.text,
                                'opacity-80'
                            )}
                        >
                            {product.productDescription}
                        </p>
                    )}
                    <p
                        className={cn(
                            'text-base font-semibold mt-1',
                            colorClasses.accent
                        )}
                    >
                        ₱{product.productPrice.toFixed(2)}
                    </p>
                </div>
            </div>
        </Card>
    );
}
