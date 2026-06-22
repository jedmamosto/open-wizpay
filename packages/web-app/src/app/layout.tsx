import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/context/AuthContext';
import type { Metadata } from 'next';
import { Inter, Nunito, Playfair_Display, Work_Sans } from 'next/font/google';
import localFont from 'next/font/local';
import './globals.css';

// Define the fonts
const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
});

const playfair = Playfair_Display({
    subsets: ['latin'],
    variable: '--font-playfair',
    display: 'swap',
});

const nunito = Nunito({
    subsets: ['latin'],
    variable: '--font-nunito',
    display: 'swap',
});

const workSans = Work_Sans({
    subsets: ['latin'],
    variable: '--font-work-sans',
    display: 'swap',
});

const geistSans = localFont({
    src: './fonts/GeistVF.woff',
    variable: '--font-geist-sans',
    weight: '100 900',
});
const geistMono = localFont({
    src: './fonts/GeistMonoVF.woff',
    variable: '--font-geist-mono',
    weight: '100 900',
});

export const metadata: Metadata = {
    title: 'WizPay Form Builder',
    description: 'Create your payment forms',
    icons: {
        icon: '/icon.svg',
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${inter.variable} ${playfair.variable} ${nunito.variable} ${workSans.variable} font-sans ${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <AuthProvider>{children}</AuthProvider>
                <Toaster />
            </body>
        </html>
    );
}
