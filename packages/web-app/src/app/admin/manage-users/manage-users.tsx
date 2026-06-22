'use client';

import { User, UserStatus } from '@/schemas/users';
import { useEffect, useState } from 'react';
import { userColumns } from './user-columns';
import { UserTable } from './user-table';

function ManageUsers() {
    const [userData, setUserData] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async (url: string) => {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch data from ${url}`);
        }
        return response.json();
    };

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const users = await fetchData('/api/users');
                setUserData(users.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchAllData();
    }, []);

    const handleStatusChange = async (
        userId: string,
        newStatus: UserStatus
    ) => {
        if (!userId) return console.error('User ID not found');

        try {
            const response = await fetch(
                `/api/users/updateStatus?uid=${userId}`,
                {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userStatus: newStatus }),
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    errorData.error || 'Failed to update user status'
                );
            }

            setUserData((prevUsers) =>
                prevUsers.map((user) =>
                    user.userId === userId
                        ? { ...user, userStatus: newStatus }
                        : user
                )
            );
        } catch (error) {
            console.error('Error updating user status:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-[#ccf15a]"></div>
            </div>
        );
    }

    return (
        <div className="container py-10 w-full">
            <div className="flex-1">
                <h2 className="text-2xl font-bold uppercase tracking-wider font-mono mb-6 text-white">
                    Users
                </h2>
                <UserTable
                    columns={userColumns}
                    data={userData}
                    onStatusChange={handleStatusChange}
                />
            </div>
        </div>
    );
}

export default ManageUsers;
