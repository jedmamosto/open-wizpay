/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { PaymentForm } from '@/schemas/payment-form';
import {
    Clock,
    Construction,
    Copy,
    ExternalLink,
    FileText,
    Package,
    Plus,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { DataTable } from './data-table';

// Reusable stat card component
interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ComponentType<{ className?: string }>;
    description?: string;
    isLoading: boolean;
}

const StatCard = ({
    title,
    value,
    icon,
    description,
    isLoading,
}: StatCardProps) => {
    const Icon = icon;

    return (
        <Card className="bg-[#062517] border-[#1d3a2c] text-[#c8ebd5] rounded-xl transition-all duration-300 hover:border-[#ccf15a]/30">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-mono uppercase tracking-wider text-[#c5c9b1]/80">
                    {title}
                </CardTitle>
                <Icon className="h-5 w-5 text-[#ccf15a]" />
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="h-8 w-28 bg-[#112f21] animate-pulse rounded-md" />
                ) : (
                    <>
                        <div className="text-3xl font-extrabold text-white tracking-tight">
                            {value}
                        </div>
                        {description && (
                            <p className="text-xs text-[#a6d0b5]/70 mt-1">
                                {description}
                            </p>
                        )}
                    </>
                )}
            </CardContent>
        </Card>
    );
};

// Empty state component
const EmptyStateCard = ({
    className = '',
    compact = false,
    message = 'No data available',
}) => {
    return (
        <CardContent
            className={`flex flex-col items-center gap-2 p-6 bg-[#001208]/50 border border-[#1d3a2c] rounded-xl ${className}`}
        >
            <Construction
                size={compact ? 24 : 48}
                className="text-[#a6d0b5]/50 animate-pulse"
            />
            <p
                className={`${compact ? 'text-sm' : 'text-base'} text-center text-[#a6d0b5]/70 font-medium max-w-sm`}
            >
                {message}
            </p>
        </CardContent>
    );
};

interface TableData {
    id: string | undefined;
    formTitle: string;
    formDescription: string;
    productCount: number;
}

export default function Dashboard() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [paymentForms, setPaymentForms] = useState<PaymentForm[]>([]);

    const tableData = React.useMemo<TableData[]>(() => {
        return paymentForms.map((form) => ({
            id: form.paymentFormId,
            formTitle: form.paymentFormTitle,
            formDescription: form.paymentFormDescription,
            productCount: form.paymentFormProducts?.length || 0,
        }));
    }, [paymentForms]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 5;

    // Search input debouncer
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Fetch payment forms data
    useEffect(() => {
        const fetchPaymentForms = async () => {
            if (!user) return;

            try {
                setIsLoading(true);
                const response = await fetch('/api/payment-forms');

                if (!response.ok) {
                    throw new Error('Failed to fetch payment forms');
                }

                const data = await response.json();

                // Filter for current user's forms
                const userForms = data.filter(
                    (form: PaymentForm) => form.userId === user.uid
                );
                setPaymentForms(userForms);
            } catch (error) {
                console.error('Error fetching payment forms:', error);
                setError((error as Error).message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPaymentForms();
    }, [user]);



    // Calculate statistics
    const calculateStats = () => {
        // Total forms count
        const totalForms = paymentForms.length;

        // Count unique products
        const allProducts = paymentForms.flatMap(
            (form) => form.paymentFormProducts || []
        );
        const uniqueProductNames = new Set(
            allProducts.map((product) => product.productName)
        );
        const totalProducts = uniqueProductNames.size;

        // Count recent forms (last 30 days)
        const recentForms = totalForms;

        return {
            totalForms,
            totalProducts,
            recentForms,
        };
    };

    const stats = calculateStats();

    // Filter data based on debounced search term
    const filteredData = tableData.filter(
        (item) =>
            item.formTitle?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
            item.formDescription
                ?.toLowerCase()
                .includes(debouncedSearchTerm.toLowerCase())
    );

    // Pagination logic
    const totalPages = Math.ceil(filteredData.length / rowsPerPage);
    const paginatedData = filteredData.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    // Define columns with direct actions and touch targets
    const columns = [
        {
            accessorKey: 'formTitle',
            header: 'Form Name',
            cell: ({ row }: { row: any }) => {
                return (
                    <div className="font-semibold text-white">
                        {row.getValue('formTitle')}
                    </div>
                );
            },
        },
        {
            accessorKey: 'formDescription',
            header: 'Description',
            cell: ({ row }: { row: any }) => {
                const description = row.getValue('formDescription') as string;
                if (!description) return <div className="text-[#a6d0b5]/50">-</div>;
                // Truncate long descriptions
                const truncated =
                    description.length > 60
                        ? `${description.substring(0, 60)}...`
                        : description;

                return (
                    <div className="text-[#a6d0b5]/80">
                        {truncated}
                    </div>
                );
            },
        },
        {
            accessorKey: 'productCount',
            header: 'Products',
            cell: ({ row }: { row: any }) => {
                const count = row.getValue('productCount') as number;

                return (
                    <div className="px-2.5 py-1 rounded-md bg-[#112f21] border border-[#1d3a2c] text-[#ccf15a] text-xs font-mono inline-block">
                        {count} {count === 1 ? 'product' : 'products'}
                    </div>
                );
            },
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }: { row: any }) => {
                const formId = row.original.id;
                const formUrl = `${window.location.origin}/payment-form/${formId}`;

                return (
                    <div className="flex items-center gap-2">
                        <Button
                            size="icon"
                            variant="outline"
                            onClick={() => {
                                navigator.clipboard.writeText(formUrl);
                                toast({
                                    title: 'Link Copied',
                                    description: 'The payment form link has been copied to your clipboard.',
                                });
                            }}
                            className="h-11 w-11 rounded-lg border-[#1d3a2c] bg-[#001208] text-[#c8ebd5] hover:bg-[#112f21] hover:text-white hover:border-[#ccf15a]/40 transition-all duration-200"
                            title="Copy Link"
                        >
                            <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                            size="icon"
                            variant="outline"
                            onClick={() => {
                                const newTab = window.open();
                                if (newTab) {
                                    newTab.opener = null;
                                    newTab.location.href = formUrl;
                                }
                            }}
                            className="h-11 w-11 rounded-lg border-[#1d3a2c] bg-[#001208] text-[#c8ebd5] hover:bg-[#112f21] hover:text-white hover:border-[#ccf15a]/40 transition-all duration-200"
                            title="Open Form"
                        >
                            <ExternalLink className="h-4 w-4" />
                        </Button>
                    </div>
                );
            },
        },
    ];

    return (
        <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto text-[#c8ebd5]">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-wider text-white">
                        Dashboard
                    </h1>
                    <p className="text-sm text-[#a6d0b5] mt-1">
                        Overview of your payment forms and setup.
                    </p>
                </div>
                <Link href="/admin/manage-forms" className="w-full sm:w-auto">
                    <Button className="w-full bg-[#ccf15a] hover:bg-[#b0d440] text-[#161e00] font-bold uppercase tracking-wider h-11 px-6 rounded-lg transition-all duration-300 shadow-[0_4px_12px_rgba(204,241,90,0.15)] flex items-center justify-center gap-2">
                        <Plus className="h-4 w-4" />
                        Create Form
                    </Button>
                </Link>
            </div>

            {/* Statistics Cards Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard
                    title="Total Forms"
                    value={stats.totalForms.toString()}
                    icon={FileText}
                    description="All your payment forms"
                    isLoading={isLoading}
                />
                <StatCard
                    title="Total Products"
                    value={stats.totalProducts.toString()}
                    icon={Package}
                    description="Unique products across all forms"
                    isLoading={isLoading}
                />
                <StatCard
                    title="Recent Forms"
                    value={stats.recentForms.toString()}
                    icon={Clock}
                    description="Forms created recently"
                    isLoading={isLoading}
                />
            </div>

            {/* Search Input */}
            <div className="w-full">
                <Input
                    type="text"
                    placeholder="Search forms..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full sm:max-w-sm bg-[#001208] border-[#1d3a2c] text-white focus:border-[#ccf15a] focus:ring-1 focus:ring-[#ccf15a] placeholder-[#c5c9b1]/40 h-11 px-4"
                />
            </div>

            {/* Forms Table or Empty State */}
            <div className="bg-[#062517] border border-[#1d3a2c] rounded-xl overflow-hidden shadow-2xl">
                {isLoading ? (
                    <Card className="border-0 bg-[#062517]">
                        <CardContent className="h-96 flex items-center justify-center">
                            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-[#ccf15a]"></div>
                        </CardContent>
                    </Card>
                ) : error ? (
                    <Card className="border-0 bg-[#062517]">
                        <EmptyStateCard
                            className="h-96 justify-center"
                            message={`Error loading forms: ${error}`}
                        />
                    </Card>
                ) : paymentForms.length === 0 ? (
                    <Card className="border-0 bg-[#062517]">
                        <EmptyStateCard
                            className="h-96 justify-center"
                            message="No payment forms created yet. Create your first form to get started!"
                        />
                    </Card>
                ) : (
                    <>
                        {/* Desktop View */}
                        <div className="hidden md:block">
                            <DataTable columns={columns} data={paginatedData} />
                        </div>

                        {/* Mobile View */}
                        <div className="block md:hidden divide-y divide-[#1d3a2c]/40">
                            {paginatedData.map((item) => {
                                const formUrl = `${window.location.origin}/payment-form/${item.id}`;
                                return (
                                    <div key={item.id} className="p-5 flex flex-col gap-3 bg-transparent">
                                        <div>
                                            <div className="font-semibold text-white text-base">
                                                {item.formTitle}
                                            </div>
                                            {item.formDescription ? (
                                                <p className="text-sm text-[#a6d0b5]/80 mt-1">
                                                    {item.formDescription}
                                                </p>
                                            ) : (
                                                <p className="text-sm text-[#a6d0b5]/40 mt-1 italic">
                                                    No description provided.
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex justify-between items-center mt-1">
                                            <div className="px-2.5 py-1 rounded-md bg-[#112f21] border border-[#1d3a2c] text-[#ccf15a] text-xs font-mono">
                                                {item.productCount} {item.productCount === 1 ? 'product' : 'products'}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    size="icon"
                                                    variant="outline"
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(formUrl);
                                                        toast({
                                                            title: 'Link Copied',
                                                            description: 'The payment form link has been copied to your clipboard.',
                                                        });
                                                    }}
                                                    className="h-11 w-11 rounded-lg border-[#1d3a2c] bg-[#001208] text-[#c8ebd5] hover:bg-[#112f21] hover:text-white hover:border-[#ccf15a]/40 transition-all duration-200"
                                                    title="Copy Link"
                                                >
                                                    <Copy className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    size="icon"
                                                    variant="outline"
                                                    onClick={() => {
                                                        const newTab = window.open();
                                                        if (newTab) {
                                                            newTab.opener = null;
                                                            newTab.location.href = formUrl;
                                                        }
                                                    }}
                                                    className="h-11 w-11 rounded-lg border-[#1d3a2c] bg-[#001208] text-[#c8ebd5] hover:bg-[#112f21] hover:text-white hover:border-[#ccf15a]/40 transition-all duration-200"
                                                    title="Open Form"
                                                >
                                                    <ExternalLink className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between px-4 py-4 border-t border-[#1d3a2c] bg-[#001208]/30">
                                <div className="text-sm text-[#a6d0b5]">
                                    Page {currentPage} of {totalPages}
                                </div>
                                <div className="flex space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            setCurrentPage((prev) =>
                                                Math.max(prev - 1, 1)
                                            )
                                        }
                                        disabled={currentPage === 1}
                                        className="h-10 border-[#1d3a2c] bg-[#001208] text-[#c8ebd5] hover:bg-[#112f21] hover:text-white"
                                    >
                                        <span className="sr-only">
                                            Previous Page
                                        </span>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="h-4 w-4"
                                        >
                                            <polyline points="15 18 9 12 15 6"></polyline>
                                        </svg>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            setCurrentPage((prev) =>
                                                Math.min(prev + 1, totalPages)
                                            )
                                        }
                                        disabled={currentPage === totalPages}
                                        className="h-10 border-[#1d3a2c] bg-[#001208] text-[#c8ebd5] hover:bg-[#112f21] hover:text-white"
                                    >
                                        <span className="sr-only">
                                            Next Page
                                        </span>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="h-4 w-4"
                                        >
                                            <polyline points="9 18 15 12 9 6"></polyline>
                                        </svg>
                                    </Button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
