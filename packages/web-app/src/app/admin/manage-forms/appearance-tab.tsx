// src/components/form-editor/appearance-tab.tsx

'use client';

import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import {
    ColorScheme,
    FontFamily,
    FormAppearance,
} from '@/schemas/payment-form';

// Color scheme preview boxes with their respective colors
const colorSchemes: Record<
    ColorScheme,
    { label: string; primary: string; secondary: string; accent: string }
> = {
    slate: {
        label: 'Slate',
        primary: 'bg-wizpay-light-primary-100',
        secondary: 'bg-wizpay-light-secondary-200',
        accent: 'bg-wizpay-light-accent-100',
    },
    azure: {
        label: 'Azure',
        primary: 'bg-azure-light-primary-100',
        secondary: 'bg-azure-light-secondary-200',
        accent: 'bg-azure-light-accent-100',
    },
    emerald: {
        label: 'Emerald Kinetic',
        primary: 'bg-emerald-light-primary-100',
        secondary: 'bg-emerald-light-secondary-200',
        accent: 'bg-emerald-light-accent-100',
    },
    ruby: {
        label: 'Ruby',
        primary: 'bg-ruby-light-primary-100',
        secondary: 'bg-ruby-light-secondary-200',
        accent: 'bg-ruby-light-accent-100',
    },
    amethyst: {
        label: 'Amethyst',
        primary: 'bg-amethyst-light-primary-100',
        secondary: 'bg-amethyst-light-secondary-200',
        accent: 'bg-amethyst-light-accent-100',
    },
    amber: {
        label: 'Amber',
        primary: 'bg-amber-light-primary-100',
        secondary: 'bg-amber-light-secondary-200',
        accent: 'bg-amber-light-accent-100',
    },
    custom: {
        label: 'Custom Theme',
        primary: 'bg-slate-300',
        secondary: 'bg-slate-100',
        accent: 'bg-indigo-500',
    },
};

// Font options with preview text
const fontOptions: Record<FontFamily, { label: string; className: string }> = {
    inter: { label: 'Inter', className: 'font-sans' },
    playfair: { label: 'Playfair Display', className: 'font-serif' },
    nunito: { label: 'Nunito', className: 'font-sans font-nunito' },
    work: { label: 'Work Sans', className: 'font-sans font-work' },
};

interface AppearanceTabProps {
    appearance: FormAppearance;
    onChange: (appearance: FormAppearance) => void;
}

export function AppearanceTab({ appearance, onChange }: AppearanceTabProps) {
    const selectedColorScheme = appearance.colorScheme || 'emerald';
    const selectedFont = appearance.fontFamily || 'inter';

    const handleColorSchemeChange = (value: string) => {
        onChange({
            ...appearance,
            colorScheme: value as ColorScheme,
        });
    };

    const handleFontChange = (value: string) => {
        onChange({
            ...appearance,
            fontFamily: value as FontFamily,
        });
    };

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <h3 className="text-xs font-mono uppercase tracking-wider text-[#c5c9b1]/80">Appearance Settings</h3>
                <p className="text-sm text-[#c5c9b1]/60">
                    Customize how your payment form looks to your customers.
                </p>
            </div>

            <Tabs defaultValue="colors">
                <TabsList className="grid w-full grid-cols-2 bg-[#001208] border border-[#1d3a2c]">
                    <TabsTrigger value="colors" className="text-[#c8ebd5]/70 data-[state=active]:bg-[#ccf15a] data-[state=active]:text-[#161e00] font-bold">Color Scheme</TabsTrigger>
                    <TabsTrigger value="typography" className="text-[#c8ebd5]/70 data-[state=active]:bg-[#ccf15a] data-[state=active]:text-[#161e00] font-bold">Typography</TabsTrigger>
                </TabsList>

                {/* Color Scheme Options */}
                <TabsContent value="colors" className="pt-4">
                    <RadioGroup
                        value={selectedColorScheme}
                        onValueChange={handleColorSchemeChange}
                        className="grid grid-cols-2 md:grid-cols-3 gap-4"
                    >
                        {Object.entries(colorSchemes).map(([key, scheme]) => (
                            <div key={key} className="space-y-2">
                                <RadioGroupItem
                                    value={key}
                                    id={`color-${key}`}
                                    className="peer sr-only"
                                />
                                <Label
                                    htmlFor={`color-${key}`}
                                    className="flex flex-col space-y-2 rounded-md border border-[#1d3a2c] bg-[#001208]/90 text-[#c8ebd5] p-4 hover:border-[#ccf15a]/30 peer-data-[state=checked]:border-[#ccf15a] peer-data-[state=checked]:bg-[#022113] peer-data-[state=checked]:text-white cursor-pointer transition-all"
                                >
                                    <span className="font-medium text-xs font-mono uppercase tracking-wider">
                                        {scheme.label}
                                    </span>
                                    <div className="flex space-x-2 h-8">
                                        <div
                                            className={cn(
                                                'w-1/3 rounded',
                                                scheme.primary
                                            )}
                                        ></div>
                                        <div
                                            className={cn(
                                                'w-1/3 rounded',
                                                scheme.secondary
                                            )}
                                        ></div>
                                        <div
                                            className={cn(
                                                'w-1/3 rounded',
                                                scheme.accent
                                            )}
                                        ></div>
                                    </div>
                                </Label>
                            </div>
                        ))}
                    </RadioGroup>
                </TabsContent>

                {/* Typography Options */}
                <TabsContent value="typography" className="pt-4">
                    <RadioGroup
                        value={selectedFont}
                        onValueChange={handleFontChange}
                        className="flex flex-col space-y-4"
                    >
                        {Object.entries(fontOptions).map(([key, font]) => (
                            <div key={key} className="space-y-2">
                                <RadioGroupItem
                                    value={key}
                                    id={`font-${key}`}
                                    className="peer sr-only"
                                />
                                <Label
                                    htmlFor={`font-${key}`}
                                    className="flex flex-col rounded-md border border-[#1d3a2c] bg-[#001208]/90 text-[#c8ebd5] p-4 hover:border-[#ccf15a]/30 peer-data-[state=checked]:border-[#ccf15a] peer-data-[state=checked]:bg-[#022113] peer-data-[state=checked]:text-white cursor-pointer transition-all"
                                >
                                    <span className="font-medium text-xs font-mono uppercase tracking-wider">
                                        {font.label}
                                    </span>
                                    <p
                                        className={cn(
                                            'text-sm mt-2 font-normal',
                                            font.className
                                        )}
                                    >
                                        The quick brown fox jumps over the lazy
                                        dog.
                                    </p>
                                </Label>
                            </div>
                        ))}
                    </RadioGroup>
                </TabsContent>
            </Tabs>
        </div>
    );
}
