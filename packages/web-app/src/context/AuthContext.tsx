'use client';

import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';

export interface CustomUser {
    uid: string;
    email: string;
    name: string;
    role: string;
    status: string;
}

interface AuthContextType {
    user: CustomUser | null;
    userRole: string | null;
    userStatus: string | null;
    loading: boolean;
    signOut: () => Promise<void>;
    checkSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<CustomUser | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const checkSession = useCallback(async () => {
        try {
            const response = await fetch('/api/auth/me');
            if (response.ok) {
                const data = await response.json();
                if (data.user) {
                    setUser({
                        uid: data.user.uid || 'admin-user-id',
                        email: data.user.email,
                        name: data.user.name,
                        role: data.user.role,
                        status: data.user.status,
                    });
                } else {
                    setUser(null);
                    Cookies.remove('session');
                }
            } else {
                setUser(null);
                Cookies.remove('session');
            }
        } catch (error) {
            console.error('Check session error:', error);
            setUser(null);
            Cookies.remove('session');
        } finally {
            setLoading(false);
        }
    }, []);

    // Check auth session status on mount
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        checkSession();
    }, [checkSession]);

    const handleSignOut = useCallback(async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            Cookies.remove('session');
            setUser(null);
            router.push('/login');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    }, [router]);

    const contextValue = useMemo(
        () => ({
            user,
            userRole: user ? user.role : null,
            userStatus: user ? user.status : null,
            loading,
            signOut: handleSignOut,
            checkSession,
        }),
        [user, loading, handleSignOut, checkSession]
    );

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
