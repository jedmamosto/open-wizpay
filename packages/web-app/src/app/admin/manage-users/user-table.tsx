'use client';

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
} from '@tanstack/react-table';
import React from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { UserStatus } from '@/schemas/users';

interface TableMeta {
    onStatusChange: (userId: string, userStatus: UserStatus) => void;
}

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    onStatusChange: (userId: string, userStatus: UserStatus) => void;
}

export function UserTable<TData, TValue>({
    columns,
    data,
    onStatusChange,
}: DataTableProps<TData, TValue>) {
    const [globalFilter, setGlobalFilter] = React.useState('');

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        globalFilterFn: 'includesString',
        onGlobalFilterChange: setGlobalFilter,
        state: {
            globalFilter,
        },
        meta: { onStatusChange } as TableMeta,
    });

    return (
        <div className="space-y-4">
            <Input
                placeholder="Search all columns..."
                value={globalFilter ?? ''}
                onChange={(event) => setGlobalFilter(event.target.value)}
                className="max-w-sm bg-[#001208] border border-[#1d3a2c] text-white focus-visible:ring-1 focus-visible:ring-[#ccf15a] focus-visible:ring-offset-0 focus:border-[#ccf15a] placeholder-[#a6d0b5]/40"
            />
            <div className="rounded-md border border-[#1d3a2c] bg-[#001208]/85 overflow-hidden">
                <Table>
                    <TableHeader className="bg-[#022113] border-b border-[#1d3a2c] w-full">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="border-b border-[#1d3a2c]/65 hover:bg-transparent">
                                {headerGroup.headers.map((header) => (
                                    <TableHead
                                        key={header.id}
                                        className="text-[#c5c9b1] font-mono text-xs uppercase tracking-wider py-3.5 border-b border-[#1d3a2c]/65"
                                    >
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                  header.column.columnDef
                                                      .header,
                                                  header.getContext()
                                              )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && 'selected'
                                    }
                                    className="border-b border-[#1d3a2c]/45 hover:bg-[#112f21]/50 bg-transparent transition-colors duration-150"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell
                                            key={cell.id}
                                            className="py-3 text-[#c8ebd5] font-medium"
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow className="hover:bg-transparent">
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center text-[#a6d0b5]/50"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    className="border-[#1d3a2c] bg-[#001208] text-[#c8ebd5] hover:bg-[#112f21] hover:text-white disabled:opacity-50 disabled:hover:bg-[#001208]"
                >
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    className="border-[#1d3a2c] bg-[#001208] text-[#c8ebd5] hover:bg-[#112f21] hover:text-white disabled:opacity-50 disabled:hover:bg-[#001208]"
                >
                    Next
                </Button>
            </div>
        </div>
    );
}
