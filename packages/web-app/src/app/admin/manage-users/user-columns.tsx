import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

import { User, UserStatus } from '@/schemas/users';
import { ColumnDef } from '@tanstack/react-table';

type UserTableMeta = {
    onStatusChange: (userId: string, userStatus: UserStatus) => Promise<void>;
};

export const userColumns: ColumnDef<User>[] = [
    {
        accessorKey: 'userName',
        header: 'Name',
    },
    {
        accessorKey: 'userEmail',
        header: 'Email',
    },
    {
        accessorKey: 'userStatus',
        header: 'Status',
        cell: ({ row, table }) => {
            const user = row.original;
            const { onStatusChange } = table.options.meta as UserTableMeta;

            const handleStatusChange = async (newStatus: string) => {
                try {
                    if (!user.userId) {
                        return console.error('Missing user ID:', user);
                    }
                    await onStatusChange(user.userId, newStatus as UserStatus);
                } catch (error) {
                    console.error('Failed to change status, error:', error);
                }
            };

            return (
                <Select
                    onValueChange={handleStatusChange}
                    value={user.userStatus}
                    defaultValue={user.userStatus}
                >
                    <SelectTrigger
                        className={cn(
                            'px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider h-8 font-semibold w-[140px] border transition-all',
                            user.userStatus === UserStatus.active
                                ? 'bg-[#022113] border-[#6dfe9c]/30 text-[#6dfe9c] hover:border-[#6dfe9c]/60'
                                : 'bg-[#1a0c0e] border-[#93000a]/20 text-[#ffb4ab] hover:border-[#93000a]/50'
                        )}
                    >
                        <SelectValue placeholder={user.userStatus} />
                    </SelectTrigger>
                    <SelectContent className="bg-[#062517] border border-[#1d3a2c] text-[#c8ebd5]">
                        {Object.values(UserStatus).map((status) => (
                            <SelectItem 
                                key={status} 
                                value={status}
                                className="focus:bg-[#112f21] focus:text-white text-xs font-mono uppercase tracking-wider cursor-pointer py-2"
                            >
                                {status}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            );
        },
    },
];
