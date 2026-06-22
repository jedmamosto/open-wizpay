'use client';

import { auth } from '@/firebase/config';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
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

interface AuthContextType {
    user: User | null;
    userRole: string | null;
    userStatus: string | null;
    loading: boolean;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [userStatus, setUserStatus] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // Auth state listener
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            try {
                setLoading(true); // Ensure loading is true while we fetch everything

                if (user) {
                    const token = await user.getIdToken();
                    Cookies.set('session', token, {
                        secure: true,
                        sameSite: 'strict',
                        expires: 7,
                    });

                    // Fetch user credentials
                    const fetchUserCreds = await fetch(
                        `/api/user-creds?uid=${user.uid}`
                    );
                    if (!fetchUserCreds.ok) {
                        throw new Error('Failed to fetch user credentials');
                    }

                    const userCreds = await fetchUserCreds.json();

                    // Update all states at once
                    setUser(user);
                    setUserStatus(userCreds.userStatus || null);
                    setUserRole(userCreds.userRole || null);
                } else {
                    // Clear all states at once
                    setUser(null);
                    setUserRole(null);
                    setUserStatus(null);
                    Cookies.remove('session');
                }
            } catch (error) {
                console.error('Auth state handling error:', error);
                // Clear states on error
                setUser(null);
                setUserRole(null);
                setUserStatus(null);
            } finally {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    // Token refresh logic
    useEffect(() => {
        const handleTokenRefresh = setInterval(
            async () => {
                const user = auth.currentUser;
                if (user) {
                    try {
                        const token = await user.getIdToken(true); // Force token refresh
                        if (Cookies.get('session') !== token) {
                            Cookies.set('session', token, {
                                secure: true,
                                sameSite: 'strict',
                                expires: 7,
                            });
                        }
                    } catch (error) {
                        console.error('Error refreshing token:', error);
                    }
                }
            },
            10 * 60 * 1000
        ); // 10 minutes

        // Cleanup interval on unmount
        return () => clearInterval(handleTokenRefresh);
    }, []);

    const handleSignOut = useCallback(async () => {
        try {
            await signOut(auth);
            Cookies.remove('session');
            // console.log('Sign out successful');
            router.push('/login');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    }, [router]);

    const contextValue = useMemo(
        () => ({
            user,
            userRole,
            userStatus,
            loading,
            signOut: handleSignOut,
        }),
        [user, userRole, userStatus, loading, handleSignOut]
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
