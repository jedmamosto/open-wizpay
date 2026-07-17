'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import React, { Suspense, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';

function AuthContent({ isDefaultCredentials }: { isDefaultCredentials: boolean }) {
    const { user, signOut, checkSession } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                await checkSession();
                router.replace('/admin');
            } else {
                setError(data.error || 'Invalid email or password');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (user) {
        return (
            <div className="w-full max-w-md mx-auto text-[#c8ebd5] flex flex-col gap-4">
                <div className="text-center">
                    <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white">
                        Already Logged In
                    </h1>
                    <p className="text-[#c5c9b1] mt-1 text-xs sm:text-sm">
                        You&apos;re currently logged in as {user.email}
                    </p>
                </div>
                <div className="flex flex-col gap-3">
                    <Button
                        onClick={() => router.replace('/admin')}
                        className="h-11 w-full bg-[#ccf15a] hover:bg-[#b0d440] text-[#161e00] font-bold text-sm transition-transform hover:scale-[1.01]"
                    >
                        Continue to Dashboard
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => signOut()}
                        className="h-11 w-full border-[#1d3a2c] text-[#c8ebd5] hover:bg-[#112f21] hover:text-[#c8ebd5]"
                    >
                        Sign Out
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md mx-auto text-[#c8ebd5] flex flex-col gap-6">
            <div className="space-y-4 text-center">
                <div className="h-16 w-16 mx-auto rounded-xl bg-gradient-to-tr from-[#ccf15a] to-[#6dfe9c] p-[2px] shadow-[0_0_20px_rgba(204,241,90,0.12)] flex items-center justify-center mb-1">
                    <div className="h-full w-full bg-[#00180c] rounded-[10px] flex items-center justify-center">
                        <span className="text-white font-black text-2xl tracking-tighter">Oz</span>
                    </div>
                </div>
                <div>
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white uppercase tracking-tight leading-none">
                        Payment Form Builder
                    </h1>
                    <p className="text-center text-[#c5c9b1] mt-2 text-xs sm:text-sm">
                        Welcome to WizPay! Securely manage direct payment checkouts.
                    </p>
                </div>
            </div>

            {/* Help Callout for Self-Hosted Single-Tenant Mode */}
            <div className="p-3.5 bg-[#062517]/85 border border-[#1d3a2c]/80 rounded-lg text-left text-xs space-y-2">
                <div className="flex items-center gap-2 text-[#ccf15a] font-bold uppercase tracking-wider text-[10px]">
                    <span className="h-1.5 w-1.5 bg-[#ccf15a] rounded-full animate-pulse" />
                    Self-Hosted Setup Info
                </div>
                <p className="text-[#a6d0b5] leading-normal font-sans">
                    This is a single-tenant instance. Access is secured using environment variables.
                </p>
                {isDefaultCredentials ? (
                    <>
                        <div className="bg-[#001208]/60 p-2.5 rounded border border-[#112f21]/80 font-mono text-[11px] text-[#c8ebd5] space-y-1">
                            <p>
                                <span className="text-[#c5c9b1]/60">Email:</span> <code className="text-white select-all">admin@wizpay.local</code>
                            </p>
                            <p>
                                <span className="text-[#c5c9b1]/60">Password:</span> <code className="text-white select-all">admin-secure-password</code>
                            </p>
                        </div>
                        <p className="text-[10px] text-[#c5c9b1]/50 leading-normal font-sans">
                            Set custom credentials via <code className="bg-[#001208] px-1 rounded text-[#c8ebd5]">ADMIN_EMAIL</code> and <code className="bg-[#001208] px-1 rounded text-[#c8ebd5]">ADMIN_PASSWORD</code> in your <code className="text-white">.env.local</code>.
                        </p>
                    </>
                ) : (
                    <p className="text-[10px] text-[#6dfe9c] leading-normal font-sans font-medium">
                        ✓ Using custom credentials configured in your environment.
                    </p>
                )}
            </div>

            <div className="space-y-4">
                {error && (
                    <Alert variant="destructive" className="bg-red-950/50 border-red-900 text-red-200">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-1">
                        <Input
                            id="email"
                            placeholder="Email Address"
                            type="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                if (error) setError(null);
                            }}
                            className="bg-[#001208] border-[#1d3a2c] text-white placeholder:text-[#c5c9b1]/40 focus:ring-[#ccf15a] focus:border-[#ccf15a] min-h-[44px] rounded-lg text-sm"
                        />
                    </div>

                    <div className="space-y-1">
                        <Input
                            id="password"
                            placeholder="Password"
                            type="password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                if (error) setError(null);
                            }}
                            className="bg-[#001208] border-[#1d3a2c] text-white placeholder:text-[#c5c9b1]/40 focus:ring-[#ccf15a] focus:border-[#ccf15a] min-h-[44px] rounded-lg text-sm"
                        />
                    </div>

                    <Button
                        className="h-11 w-full bg-[#ccf15a] hover:bg-[#b0d440] text-[#161e00] font-bold text-sm transition-all duration-300 transform hover:scale-[1.01] uppercase tracking-wider mt-2"
                        type="submit"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Signing In...' : 'Sign In'}
                    </Button>
                </form>
            </div>
        </div>
    );
}

function Login({ isDefaultCredentials = true }: { isDefaultCredentials?: boolean }) {
    return (
        <Suspense fallback={
            <div className="flex h-screen w-screen items-center justify-center bg-[#00180c]">
                <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-[#ccf15a]"></div>
            </div>
        }>
            <AuthContent isDefaultCredentials={isDefaultCredentials} />
        </Suspense>
    );
}

export default Login;
