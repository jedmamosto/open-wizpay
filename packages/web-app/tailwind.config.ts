import type { Config } from 'tailwindcss';
import tailwindcssAnimate from 'tailwindcss-animate';

export default {
    darkMode: ['class'],
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                // Add the Google Fonts
                sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui'],
                serif: ['var(--font-playfair)', 'ui-serif', 'Georgia'],
                nunito: ['var(--font-nunito)', 'sans-serif'],
                work: ['var(--font-work-sans)', 'sans-serif'],
            },
            colors: {
                // Keep your existing wizpay colors
                wizpay: {
                    light: {
                        primary: {
                            '100': '#F8FAFC',
                            '200': '#F1F5F9',
                            '300': '#E2E8F0',
                            '400': '#CBD5E1',
                            '500': '#94A3B8',
                        },
                        secondary: {
                            '100': '#475569',
                            '200': '#334155',
                            '300': '#1E293B',
                            '400': '#0F172A',
                            '500': '#020617',
                        },
                        accent: {
                            '100': '#6366F1',
                            '200': '#4F46E5',
                            '300': '#4338CA',
                            '400': '#3730A3',
                            '500': '#312E81',
                            '600': '#1E1B4B',
                        },
                    },
                },
                // Add new color themes
                azure: {
                    light: {
                        primary: {
                            '100': '#EBF5F9',
                            '200': '#D4E0E4',
                            '300': '#BCC7CC',
                            '400': '#A5AEB3',
                            '500': '#8D959A',
                        },
                        secondary: {
                            '100': '#687074',
                            '200': '#4F5C5D',
                            '300': '#364045',
                            '400': '#1D282E',
                            '500': '#041017',
                        },
                        accent: {
                            '100': '#12C4F0',
                            '200': '#10B0D8',
                            '300': '#0E9CC0',
                            '400': '#0D87A8',
                            '500': '#0B7490',
                            '600': '#096178',
                        },
                    },
                },
                emerald: {
                    surface: '#00180c',
                    'surface-dim': '#00180c',
                    'surface-bright': '#213f30',
                    'surface-container-lowest': '#001208',
                    'surface-container-low': '#022113',
                    'surface-container': '#062517',
                    'surface-container-high': '#112f21',
                    'surface-container-highest': '#1d3a2c',
                    'on-surface': '#c8ebd5',
                    'on-surface-variant': '#c5c9b1',
                    'inverse-surface': '#c8ebd5',
                    'inverse-on-surface': '#183627',
                    outline: '#8f937d',
                    'outline-variant': '#454936',
                    'surface-tint': '#b0d440',
                    primary: '#ffffff',
                    'on-primary': '#283500',
                    'primary-container': '#ccf15a',
                    'on-primary-container': '#566d00',
                    'inverse-primary': '#516600',
                    secondary: '#a6d0b5',
                    'on-secondary': '#0f3724',
                    'secondary-container': '#2a513c',
                    'on-secondary-container': '#98c2a8',
                    tertiary: '#ffffff',
                    'on-tertiary': '#003919',
                    'tertiary-container': '#6dfe9c',
                    'on-tertiary-container': '#007439',
                    error: '#ffb4ab',
                    'on-error': '#690005',
                    'error-container': '#93000a',
                    'on-error-container': '#ffdad6',
                    'primary-fixed': '#ccf15a',
                    'primary-fixed-dim': '#b0d440',
                    'on-primary-fixed': '#161e00',
                    'on-primary-fixed-variant': '#3c4d00',
                    'secondary-fixed': '#c1edd0',
                    'secondary-fixed-dim': '#a6d0b5',
                    'on-secondary-fixed': '#002112',
                    'on-secondary-fixed-variant': '#284e3a',
                    'tertiary-fixed': '#6dfe9c',
                    'tertiary-fixed-dim': '#4de082',
                    'on-tertiary-fixed': '#00210c',
                    'on-tertiary-fixed-variant': '#005227',
                    background: '#00180c',
                    'on-background': '#c8ebd5',
                    'surface-variant': '#1d3a2c',
                    light: {
                        primary: {
                            '100': '#00180c',
                            '200': '#022113',
                            '300': '#1d3a2c',
                            '400': '#213f30',
                            '500': '#c8ebd5',
                        },
                        secondary: {
                            '100': '#c8ebd5',
                            '200': '#c8ebd5',
                            '300': '#a6d0b5',
                            '400': '#a6d0b5',
                            '500': '#c8ebd5',
                        },
                        accent: {
                            '100': '#ccf15a',
                            '200': '#b0d440',
                            '300': '#ccf15a',
                            '400': '#b0d440',
                            '500': '#ccf15a',
                            '600': '#b0d440',
                        },
                    },
                },
                ruby: {
                    light: {
                        primary: {
                            '100': '#F9EBEB',
                            '200': '#E4D4D4',
                            '300': '#CCBCBC',
                            '400': '#B3A5A5',
                            '500': '#9A8D8D',
                        },
                        secondary: {
                            '100': '#746868',
                            '200': '#5D4F4F',
                            '300': '#453636',
                            '400': '#2E1D1D',
                            '500': '#170404',
                        },
                        accent: {
                            '100': '#F01212',
                            '200': '#D81010',
                            '300': '#C00E0E',
                            '400': '#A80D0D',
                            '500': '#900B0B',
                            '600': '#780909',
                        },
                    },
                },
                amethyst: {
                    light: {
                        primary: {
                            '100': '#F0EBF9',
                            '200': '#D9D4E4',
                            '300': '#C1BCCC',
                            '400': '#AAA5B3',
                            '500': '#928D9A',
                        },
                        secondary: {
                            '100': '#6C6874',
                            '200': '#544F5D',
                            '300': '#3B3645',
                            '400': '#231D2E',
                            '500': '#0A0417',
                        },
                        accent: {
                            '100': '#9812F0',
                            '200': '#8A10D8',
                            '300': '#7B0EC0',
                            '400': '#6C0DA8',
                            '500': '#5D0B90',
                            '600': '#4E0978',
                        },
                    },
                },
                amber: {
                    light: {
                        primary: {
                            '100': '#F9F1EB',
                            '200': '#E4DCD4',
                            '300': '#CCC7BC',
                            '400': '#B3B1A5',
                            '500': '#9A9A8D',
                        },
                        secondary: {
                            '100': '#747068',
                            '200': '#5D544F',
                            '300': '#453B36',
                            '400': '#2E231D',
                            '500': '#170A04',
                        },
                        accent: {
                            '100': '#F08A12',
                            '200': '#D87C10',
                            '300': '#C06E0E',
                            '400': '#A8600D',
                            '500': '#90520B',
                            '600': '#784409',
                        },
                    },
                },
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
                card: {
                    DEFAULT: 'hsl(var(--card))',
                    foreground: 'hsl(var(--card-foreground))',
                },
                popover: {
                    DEFAULT: 'hsl(var(--popover))',
                    foreground: 'hsl(var(--popover-foreground))',
                },
                primary: {
                    DEFAULT: 'hsl(var(--primary))',
                    foreground: 'hsl(var(--primary-foreground))',
                },
                secondary: {
                    DEFAULT: 'hsl(var(--secondary))',
                    foreground: 'hsl(var(--secondary-foreground))',
                },
                muted: {
                    DEFAULT: 'hsl(var(--muted))',
                    foreground: 'hsl(var(--muted-foreground))',
                },
                accent: {
                    DEFAULT: 'hsl(var(--accent))',
                    foreground: 'hsl(var(--accent-foreground))',
                },
                destructive: {
                    DEFAULT: 'hsl(var(--destructive))',
                    foreground: 'hsl(var(--destructive-foreground))',
                },
                border: 'hsl(var(--border))',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
                chart: {
                    '1': 'hsl(var(--chart-1))',
                    '2': 'hsl(var(--chart-2))',
                    '3': 'hsl(var(--chart-3))',
                    '4': 'hsl(var(--chart-4))',
                    '5': 'hsl(var(--chart-5))',
                },
                sidebar: {
                    DEFAULT: 'hsl(var(--sidebar-background))',
                    foreground: 'hsl(var(--sidebar-foreground))',
                    primary: 'hsl(var(--sidebar-primary))',
                    'primary-foreground':
                        'hsl(var(--sidebar-primary-foreground))',
                    accent: 'hsl(var(--sidebar-accent))',
                    'accent-foreground':
                        'hsl(var(--sidebar-accent-foreground))',
                    border: 'hsl(var(--sidebar-border))',
                    ring: 'hsl(var(--sidebar-ring))',
                },
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)',
            },
            keyframes: {
                'accordion-down': {
                    from: {
                        height: '0',
                    },
                    to: {
                        height: 'var(--radix-accordion-content-height)',
                    },
                },
                'accordion-up': {
                    from: {
                        height: 'var(--radix-accordion-content-height)',
                    },
                    to: {
                        height: '0',
                    },
                },
            },
            animation: {
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out',
            },
        },
    },
    plugins: [tailwindcssAnimate],
} satisfies Config;
