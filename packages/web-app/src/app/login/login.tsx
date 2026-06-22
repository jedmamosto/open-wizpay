'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { auth } from '@/firebase/config';
import { LoginData } from '@/schemas/login-data';
import { SignUps } from '@/schemas/signups';
import { AuthError, signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

// Custom types for form validation errors
type ValidationErrors = {
    email?: string;
    password?: string;
    signUpName?: string;
    signUpEmail?: string;
    signUpPassword?: string;
    general?: string;
};

function AuthTabsContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const defaultTab = searchParams.get('tab') === 'signup' ? 'signup' : 'login';
    const [activeTab, setActiveTab] = useState<string>(defaultTab);

    const { user, signOut } = useAuth();

    // State management for login & signup forms
    const [loginData, setLoginData] = useState<LoginData>({ email: '', password: '' });
    const [signUpData, setSignUpData] = useState<SignUps>({
        signUpName: '',
        signUpEmail: '',
        signUpPassword: '',
    });

    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<ValidationErrors>({});

    // Email validation using regex
    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Username validation using regex
    const validateUsername = (username: string): boolean => {
        const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
        return usernameRegex.test(username);
    };

    // Form validations
    const validateLoginForm = (): boolean => {
        const newErrors: ValidationErrors = {};
        if (!loginData.email) {
            newErrors.email = 'Email is required';
        } else if (!validateEmail(loginData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }
        if (!loginData.password) {
            newErrors.password = 'Password is required';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateSignUpForm = async (): Promise<boolean> => {
        const newErrors: ValidationErrors = {};

        if (!signUpData.signUpName) {
            newErrors.signUpName = 'Username is required';
        } else if (!validateUsername(signUpData.signUpName)) {
            newErrors.signUpName = 'Username must be 3-20 characters (letters, numbers, underscores, hyphens)';
        }

        if (!signUpData.signUpEmail) {
            newErrors.signUpEmail = 'Email is required';
        } else if (!validateEmail(signUpData.signUpEmail)) {
            newErrors.signUpEmail = 'Please enter a valid email address';
        }

        if (!signUpData.signUpPassword) {
            newErrors.signUpPassword = 'Password is required';
        } else {
            const passwordErrors: string[] = [];
            if (signUpData.signUpPassword.length < 8) passwordErrors.push('at least 8 characters');
            if (!/[A-Z]/.test(signUpData.signUpPassword)) passwordErrors.push('one uppercase letter');
            if (!/[a-z]/.test(signUpData.signUpPassword)) passwordErrors.push('one lowercase letter');
            if (!/[0-9]/.test(signUpData.signUpPassword)) passwordErrors.push('one number');

            if (passwordErrors.length > 0) {
                newErrors.signUpPassword = `Password must contain ${passwordErrors.join(', ')}`;
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Form submission handlers
    const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrors({});

        if (!validateLoginForm()) return;
        setIsLoading(true);
        try {
            await signInWithEmailAndPassword(auth, loginData.email, loginData.password);
            router.replace('/admin');
        } catch (error: any) {
            console.error(error);
            const err = error as AuthError;
            if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
                setErrors({ general: 'Invalid email or password' });
            } else {
                setErrors({ general: err.message || 'Login failed' });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrors({});

        setIsLoading(true);
        try {
            const isValid = await validateSignUpForm();
            if (!isValid) {
                setIsLoading(false);
                return;
            }

            // Call internal POST endpoint to register user (bypasses approval)
            const response = await fetch('/api/signups', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(signUpData),
            });

            const result = await response.json();

            if (response.ok) {
                // If register successfully, check if account is active
                if (result.status === 'active') {
                    // Auto login on successful active registration
                    const userCredentials = await signInWithEmailAndPassword(
                        auth,
                        signUpData.signUpEmail,
                        signUpData.signUpPassword
                    );
                    if (userCredentials) {
                        router.replace('/admin');
                    }
                } else {
                    // Account is pending approval (inactive)
                    setErrors({ general: result.message || 'Registration successful. Waiting for admin approval.' });
                }
            } else {
                if (result.error && result.error.includes('already registered')) {
                    setErrors({ signUpEmail: result.error });
                } else {
                    setErrors({ general: result.error || 'Registration failed' });
                }
            }
        } catch (error) {
            console.error('Registration flow error:', error);
            setErrors({ general: 'Failed to complete registration. Please try again.' });
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

            <div className="space-y-4">
                {errors.general && (
                    <Alert variant="destructive" className="mb-4 bg-red-950/50 border-red-900 text-red-200">
                        <AlertDescription>{errors.general}</AlertDescription>
                    </Alert>
                )}

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-[#001208] border border-[#1d3a2c] p-1 h-10 rounded-lg">
                        <TabsTrigger
                            value="login"
                            className="data-[state=active]:bg-[#ccf15a] data-[state=active]:text-[#161e00] text-[#c5c9b1] font-bold text-xs rounded-md transition-all uppercase"
                        >
                            Sign In
                        </TabsTrigger>
                        <TabsTrigger
                            value="signup"
                            className="data-[state=active]:bg-[#ccf15a] data-[state=active]:text-[#161e00] text-[#c5c9b1] font-bold text-xs rounded-md transition-all uppercase"
                        >
                            Register
                        </TabsTrigger>
                    </TabsList>

                    {/* SIGN IN TAB */}
                    <TabsContent value="login" className="space-y-3 pt-3">
                        <form onSubmit={handleSignIn} className="space-y-3">
                            <div className="space-y-1">
                                <Input
                                    id="email"
                                    placeholder="Email Address"
                                    value={loginData.email}
                                    onChange={(e) => {
                                        setLoginData({ ...loginData, email: e.target.value });
                                        if (errors.email) setErrors({ ...errors, email: undefined });
                                    }}
                                    className={cn(
                                        "bg-[#001208] border-[#1d3a2c] text-white placeholder:text-[#c5c9b1]/40 focus:ring-[#ccf15a] focus:border-[#ccf15a] min-h-[44px] rounded-lg text-sm",
                                        errors.email ? 'border-red-500 focus:ring-red-500' : ''
                                    )}
                                />
                                {errors.email && (
                                    <p className="text-xs text-red-400 font-medium">{errors.email}</p>
                                )}
                            </div>

                            <div className="space-y-1">
                                <Input
                                    id="password"
                                    placeholder="Password"
                                    type="password"
                                    value={loginData.password}
                                    onChange={(e) => {
                                        setLoginData({ ...loginData, password: e.target.value });
                                        if (errors.password) setErrors({ ...errors, password: undefined });
                                    }}
                                    className={cn(
                                        "bg-[#001208] border-[#1d3a2c] text-white placeholder:text-[#c5c9b1]/40 focus:ring-[#ccf15a] focus:border-[#ccf15a] min-h-[44px] rounded-lg text-sm",
                                        errors.password ? 'border-red-500 focus:ring-red-500' : ''
                                    )}
                                />
                                {errors.password && (
                                    <p className="text-xs text-red-400 font-medium">{errors.password}</p>
                                )}
                            </div>

                            <Button
                                className="h-11 w-full bg-[#ccf15a] hover:bg-[#b0d440] text-[#161e00] font-bold text-sm transition-all duration-300 transform hover:scale-[1.01] uppercase tracking-wider mt-1"
                                type="submit"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Signing In...' : 'Sign In'}
                            </Button>
                        </form>
                    </TabsContent>

                    {/* REGISTER/SIGNUP TAB */}
                    <TabsContent value="signup" className="space-y-3 pt-3">
                        <form onSubmit={handleSignUp} className="space-y-3">
                            <div className="space-y-1">
                                <Input
                                    id="signUpName"
                                    placeholder="Username"
                                    value={signUpData.signUpName}
                                    onChange={(e) => {
                                        setSignUpData({ ...signUpData, signUpName: e.target.value });
                                        if (errors.signUpName) setErrors({ ...errors, signUpName: undefined });
                                    }}
                                    className={cn(
                                        "bg-[#001208] border-[#1d3a2c] text-white placeholder:text-[#c5c9b1]/40 focus:ring-[#ccf15a] focus:border-[#ccf15a] min-h-[44px] rounded-lg text-sm",
                                        errors.signUpName ? 'border-red-500 focus:ring-red-500' : ''
                                    )}
                                />
                                {errors.signUpName && (
                                    <p className="text-xs text-red-400 font-medium">{errors.signUpName}</p>
                                )}
                            </div>

                            <div className="space-y-1">
                                <Input
                                    id="signUpEmail"
                                    placeholder="Email Address"
                                    type="email"
                                    value={signUpData.signUpEmail}
                                    onChange={(e) => {
                                        setSignUpData({ ...signUpData, signUpEmail: e.target.value });
                                        if (errors.signUpEmail) setErrors({ ...errors, signUpEmail: undefined });
                                    }}
                                    className={cn(
                                        "bg-[#001208] border-[#1d3a2c] text-white placeholder:text-[#c5c9b1]/40 focus:ring-[#ccf15a] focus:border-[#ccf15a] min-h-[44px] rounded-lg text-sm",
                                        errors.signUpEmail ? 'border-red-500 focus:ring-red-500' : ''
                                    )}
                                />
                                {errors.signUpEmail && (
                                    <p className="text-xs text-red-400 font-medium">{errors.signUpEmail}</p>
                                )}
                            </div>

                            <div className="space-y-1">
                                <Input
                                    id="signUpPassword"
                                    placeholder="Password"
                                    type="password"
                                    value={signUpData.signUpPassword}
                                    onChange={(e) => {
                                        setSignUpData({ ...signUpData, signUpPassword: e.target.value });
                                        if (errors.signUpPassword) setErrors({ ...errors, signUpPassword: undefined });
                                    }}
                                    className={cn(
                                        "bg-[#001208] border-[#1d3a2c] text-white placeholder:text-[#c5c9b1]/40 focus:ring-[#ccf15a] focus:border-[#ccf15a] min-h-[44px] rounded-lg text-sm",
                                        errors.signUpPassword ? 'border-red-500 focus:ring-red-500' : ''
                                    )}
                                />
                                {errors.signUpPassword && (
                                    <p className="text-xs text-red-400 font-medium">{errors.signUpPassword}</p>
                                )}
                            </div>

                            <Button
                                className="h-11 w-full bg-[#ccf15a] hover:bg-[#b0d440] text-[#161e00] font-bold text-sm transition-all duration-300 transform hover:scale-[1.01] uppercase tracking-wider mt-1"
                                type="submit"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Registering...' : 'Register'}
                            </Button>
                        </form>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}

function Login() {
    return (
        <Suspense fallback={
            <div className="flex h-screen w-screen items-center justify-center bg-[#00180c]">
                <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-[#ccf15a]"></div>
            </div>
        }>
            <AuthTabsContent />
        </Suspense>
    );
}

export default Login;
