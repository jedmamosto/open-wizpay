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

    const isAuthorized =
        !loading &&
        user &&
        userStatus !== UserStatus.inactive &&
        (userRole === UserRole.admin || userRole === UserRole.superAdmin);

    useEffect(() => {
        if (!loading) {
            // Only proceed if initial loading is complete
            if (!user) {
                router.replace('/login');
                return;
            }

            if (userStatus === UserStatus.inactive) {
                router.replace('/unauthorized');
                return;
            }

            if (
                !userRole ||
                (userRole !== UserRole.admin &&
                    userRole !== UserRole.superAdmin)
            ) {
                router.replace('/unauthorized');
                return;
            }
        }
    }, [user, userRole, userStatus, loading, router]);

    if (loading || !isAuthorized) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#00180c]">
                <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-[#ccf15a]"></div>
            </div>
        );
    }

    return (
        <main className="flex bg-[#00180c] w-full min-h-screen text-[#c8ebd5]">
            <aside className="h-screen place-self-start sticky top-0 z-20">
                <AdminSideBar userRole={userRole} />
            </aside>
            <section className="flex-1 p-4 md:p-8 overflow-y-auto min-h-screen">{children}</section>
        </main>
    );
}
