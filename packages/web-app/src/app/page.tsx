import { prisma } from '@/lib/prisma';
import admin from '@/firebase/adminConfig';
import DeveloperWelcomeClient from './DeveloperWelcomeClient';

export const dynamic = 'force-dynamic';

export default async function Home() {
    const databaseProvider = process.env.DATABASE_PROVIDER || 'firestore';
    let isDatabaseConnected = false;

    if (databaseProvider === 'sqlite') {
        try {
            // Run a quick query to test the SQLite database connection
            await prisma.paymentForm.count();
            isDatabaseConnected = true;
        } catch (e) {
            console.error('SQLite connection status check failed:', e);
            isDatabaseConnected = false;
        }
    } else {
        // firestore provider
        try {
            const hasCreds = !!(
                process.env.NEXT_PRIVATE_FIREBASE_CLIENT_EMAIL && 
                process.env.NEXT_PRIVATE_FIREBASE_PRIVATE_KEY
            );
            if (hasCreds) {
                const db = admin.firestore();
                await db.collection('payment-forms').limit(1).get();
                isDatabaseConnected = true;
            }
        } catch (e) {
            console.error('Firestore connection status check failed:', e);
            isDatabaseConnected = false;
        }
    }

    const diagnostics = {
        databaseProvider,
        isDatabaseConnected,
        hasPaymongoPubKey: !!process.env.PAYMONGO_PUBLIC_KEY,
        hasPaymongoSecKey: !!process.env.PAYMONGO_SECRET_KEY,
        hasAdminEmail: !!process.env.WIZPAY_ADMIN_EMAIL,
        hasAdminPassword: !!process.env.WIZPAY_ADMIN_PASSWORD,
        hasFirebaseApiKey: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        hasFirebaseProjectId: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        hasFirebaseServiceAccount: !!(
            process.env.NEXT_PRIVATE_FIREBASE_CLIENT_EMAIL && 
            process.env.NEXT_PRIVATE_FIREBASE_PRIVATE_KEY
        ),
    };

    return <DeveloperWelcomeClient diagnostics={diagnostics} />;
}
