'use client';

import { auth } from '@/firebase/config';
import { ArchiveIcon, DashboardIcon, GearIcon, PersonIcon } from '@radix-ui/react-icons';
import { signOut } from 'firebase/auth';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

const menuItems = [
    { icon: DashboardIcon, label: 'Dashboard', href: '/admin' },
    { icon: PersonIcon, label: 'Manage Users', href: '/admin/manage-users' },
    { icon: ArchiveIcon, label: 'Manage Forms', href: '/admin/manage-forms' },
    { icon: GearIcon, label: 'Developer Settings', href: '/admin/developer-settings' },
];

interface AdminSidebarProps {
    userRole: string | null;
}

export default function AdminSidebar({ userRole }: AdminSidebarProps) {
    const pathname = usePathname();
    const router = useRouter();

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            Cookies.remove('session');
            // console.log('Sign out successful');
            router.push('/');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const filteredMenuItems =
        userRole === 'super admin'
            ? menuItems
            : menuItems.filter((item) => item.label !== 'Manage Users');

    return (
        <SidebarProvider>
            <Sidebar className="border-r border-[#1d3a2c] bg-[#001208] text-[#c8ebd5]">
                <SidebarHeader className="border-b border-[#1d3a2c] p-4 bg-[#001208]">
                    <Link href="/admin" className="flex items-center gap-3 py-1.5 px-2">
                        <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-[#ccf15a] to-[#6dfe9c] p-[2px] shrink-0">
                            <div className="h-full w-full bg-[#00180c] rounded-[6px] flex items-center justify-center">
                                <span className="text-white font-black text-lg tracking-tighter">Oz</span>
                            </div>
                        </div>
                        <span className="text-xl font-black uppercase text-white tracking-widest">WizPay</span>
                    </Link>
                </SidebarHeader>
                <SidebarContent className="bg-[#001208] p-2">
                    <SidebarMenu className="space-y-1">
                        {filteredMenuItems.map((item) => (
                            <SidebarMenuItem key={item.href}>
                                <SidebarMenuButton
                                    asChild
                                    isActive={pathname === item.href}
                                    className={cn(
                                        'w-full justify-start gap-4 px-4 py-3 rounded-lg text-[#c8ebd5] hover:bg-[#112f21] hover:text-white transition-all duration-200',
                                        pathname === item.href &&
                                            'bg-[#ccf15a] text-[#161e00] hover:bg-[#ccf15a] hover:text-[#161e00] font-bold shadow-[0_0_15px_rgba(204,241,90,0.1)]'
                                    )}
                                >
                                    <Link href={item.href}>
                                        <item.icon className="h-5 w-5" />
                                        <span>{item.label}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarContent>
                <SidebarFooter className="border-t border-[#1d3a2c] p-4 bg-[#001208]">
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton 
                                onClick={handleSignOut}
                                className="w-full justify-start gap-4 px-4 py-3 rounded-lg text-[#c8ebd5]/70 hover:bg-[#93000a]/10 hover:text-red-400 hover:border-red-950 transition-colors"
                            >
                                Sign Out
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarFooter>
            </Sidebar>
        </SidebarProvider>
    );
}
