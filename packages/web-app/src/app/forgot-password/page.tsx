'use client';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { auth } from '@/firebase/config';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useState } from 'react';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState<string>('');
    const [error, setError] = useState(false);
    const [buttonLoading, setButtonLoading] = useState(false);
    const [resetSent, setResetSent] = useState(false);

    const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!email) {
            setError(true);
            return;
        }

        setButtonLoading(true);
        try {
            setError(false);
            await sendPasswordResetEmail(auth, email);
            setResetSent(true);
        } catch (error) {
            console.error('Password reset error:', error);
            // Uniform response to prevent user enumeration
            setResetSent(true);
        } finally {
            setButtonLoading(false);
        }
    };

    if (resetSent) {
        return (
            <div className="flex-1 flex items-center justify-center h-screen p-8">
                <Card className="max-w-md">
                    <CardHeader className="text-center">
                        <CardTitle>Password reset link sent!</CardTitle>
                        <CardDescription className="pt-4">
                            Please follow the instructions sent to your email
                            and once complete, feel free to login again.
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex-1 flex items-center justify-center h-screen p-8">
            <Card className="max-w-md">
                <CardHeader className="text-center">
                    <CardTitle>Forgot your password?</CardTitle>
                    <CardDescription>
                        Input your account email here.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form
                        onSubmit={handleResetPassword}
                        className="flex flex-col gap-2"
                    >
                        <Input
                            type="email"
                            placeholder="juandelacruz@email.com"
                            onChange={(e) => {
                                setEmail(e.target.value);
                            }}
                            value={email}
                        />
                        <Button type="submit" className="text-center mb-4">
                            {buttonLoading
                                ? 'Sending...'
                                : 'Send password reset email'}
                        </Button>
                        {error ? (
                            <p className="text-sm text-red-400 text-center">
                                Sorry, your email do not seem to exist in the
                                database. If this is a mistake, please try
                                again.
                            </p>
                        ) : (
                            <p className="text-sm text-wizpay-light-primary-400 text-center">
                                Please follow the instructions sent to your
                                email and once complete, feel free to login
                                again.
                            </p>
                        )}
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default ForgotPasswordPage;
