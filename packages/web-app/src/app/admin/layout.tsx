'use client';

import { useAuth } from '@/context/AuthContext';
import { UserRole, UserStatus } from '@/schemas/users';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AdminSideBar from './admin-sidebar';

export default function ProtectedAdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, userRole, userStatus, loading } = useAuth();
    const router = useRouter();
    const [isLocalLoading, setIsLocalLoading] = useState(false);

    useEffect(() => {
        setIsLocalLoading(true);
        const handleAuthChecks = async () => {
            if (!loading) {
                // Only proceed if initial loading is complete
                if (!user) {
                    // console.log('No user, redirecting to login');
                    router.replace('/login'); // Use replace instead of push
                    return;
                }

                if (userStatus === UserStatus.inactive) {
                    // console.log('Inactive user, redirecting to unauthorized');
                    router.replace('/unauthorized');
                    return;
                }

                if (
                    !userRole ||
                    (userRole !== UserRole.admin &&
                        userRole !== UserRole.superAdmin)
                ) {
                    // console.log('Invalid role, redirecting to unauthorized');
                    router.replace('/unauthorized');
                    return;
                }
                setIsLocalLoading(false);
            }
        };

        handleAuthChecks();
    }, [user, userRole, userStatus, loading, router]);

    // console.log('User:', user);
    // console.log('User Status:', userStatus);
    // console.log('User Role:', userRole);

    if (loading || isLocalLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#00180c]">
                <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-[#ccf15a]"></div>
            </div>
        );
    }

    // console.log('User Display Name:', user.email);

    return (
        <main className="flex bg-[#00180c] w-full min-h-screen text-[#c8ebd5]">
            <aside className="h-screen place-self-start sticky top-0 z-20">
                <AdminSideBar userRole={userRole} />
            </aside>
            <section className="flex-1 p-4 md:p-8 overflow-y-auto min-h-screen">{children}</section>
        </main>
    );
}
