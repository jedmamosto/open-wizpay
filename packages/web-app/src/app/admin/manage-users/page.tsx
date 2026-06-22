'use client';

import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/schemas/users';
import { useRouter } from 'next/navigation';
import ManageUsers from './manage-users';

const ManageUsersPage = () => {
    const { userRole } = useAuth();
    const router = useRouter();

    if (userRole !== UserRole.superAdmin) {
        router.push('/unauthorized');
    }
    return (
        <section className="bg-transparent">
            <ManageUsers />;
        </section>
    );
};

export default ManageUsersPage;
