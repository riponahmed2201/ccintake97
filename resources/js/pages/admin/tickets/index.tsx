import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { ArrowRight, LifeBuoy, Search } from 'lucide-react';
import type { SupportTicket } from '@/types';

interface TicketsIndexProps {
    tickets: {
        data: SupportTicket[];
        current_page: number;
        last_page: number;
        per_page?: number;
        from?: number;
        to?: number;
        total: number;
        links: any[];
    };
    filters: {
        search?: string;
        status?: string;
        priority?: string;
        per_page?: string;
    };
}

const ALL = '__all__';

const fieldClass =
    'h-10 w-full rounded-md border !border-[#DBDFE9] !bg-[#FCFCFC] px-3 text-[13px] font-normal !text-[#071437] !shadow-none outline-none transition-all duration-200 placeholder:!text-[#99A1B7] hover:!border-[#C4CADA] focus:!border-[#1B84FF] focus:!bg-white focus:!ring-[3px] focus:!ring-[#1B84FF]/10 dark:!bg-[#FCFCFC] dark:!text-[#071437]';

const selectTriggerClass =
    '!h-10 w-full cursor-pointer rounded-md !border-[#DBDFE9] !bg-[#FCFCFC] px-3 text-[13px] font-normal !text-[#071437] !shadow-none transition-all duration-200 hover:!border-[#C4CADA] hover:!bg-[#FCFCFC] focus-visible:!border-[#1B84FF] focus-visible:!bg-white focus-visible:!ring-[3px] focus-visible:!ring-[#1B84FF]/10 dark:!bg-[#FCFCFC] dark:hover:!bg-[#FCFCFC]';

const selectMenuClass =
    'z-[60] rounded-xl !border-[#F1F1F4] !bg-white p-1 !text-[#071437] shadow-[0_12px_32px_-8px_rgba(7,20,55,0.16)] dark:!bg-white dark:!text-[#071437]';

const selectItemClass =
    'cursor-pointer rounded-lg py-2 pr-8 pl-2.5 text-[13px] text-[#071437] focus:!bg-[#F1F6FF] focus:!text-[#1B84FF] dark:text-[#071437]';

const statusPill = (status: string) => {
    if (status === 'open') return 'border border-amber-200 bg-amber-50 text-amber-700';
    if (status === 'resolved') return 'border border-emerald-200 bg-emerald-50 text-emerald-700';
    if (status === 'closed') return 'border border-[#E5E7EB] bg-[#F9FAFB] text-[#78829D]';
    return 'border border-blue-200 bg-[#F1F6FF] text-[#1B84FF]';
};

const priorityPill = (priority: string) => {
    if (priority === 'urgent' || priority === 'high') return 'border border-rose-200 bg-rose-50 text-rose-700';
    if (priority === 'medium') return 'border border-amber-200 bg-amber-50 text-amber-700';
    return 'border border-[#E5E7EB] bg-[#FCFCFC] text-[#4B5675]';
};

export default function TicketsIndex({ tickets, filters }: TicketsIndexProps) {
    const [search, setSearch] = useState(filters?.search || '');
    const [selectedStatus, setSelectedStatus] = useState(filters?.status || '');
    const [selectedPriority, setSelectedPriority] = useState(filters?.priority || '');
    const [perPage, setPerPage] = useState(filters?.per_page || String(tickets.per_page || 10));

    const applyFilter = (key: string, val: string) => {
        const query = {
            search,
            status: selectedStatus,
            priority: selectedPriority,
            per_page: perPage,
            [key]: val,
        };
        router.get('/admin/tickets', query, { preserveState: true, replace: true });
    };
    return (
        <AdminLayout
            title="Support Tickets & Inquiries"
            breadcrumbs={[{ title: 'Support Tickets' }]}
        >
            <Head title="Support Tickets - CCINTAKE 97 Admin" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-[20px] font-bold tracking-tight text-[#071437]">
                        Support Tickets & Inquiries
                    </h1>
                    <p className="mt-1 text-[13px] text-[#78829D]">
                        Respond to member questions, technical reports, and membership assistance requests.
                    </p>
                </div>

                {/* Filter Toolbar */}
                <div className="rounded-xl border border-[#F1F1F4] bg-white p-4 shadow-[0_3px_4px_0_rgba(0,0,0,0.03)]">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                applyFilter('search', search);
                            }}
                            className="relative sm:col-span-2"
                        >
                            <Search className="absolute top-3 left-3 size-4 text-[#99A1B7]" />
                            <Input
                                placeholder="Search by ticket #, subject, or member..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className={`${fieldClass} pl-9`}
                            />
                        </form>
                        <Select
                            value={selectedStatus || ALL}
                            onValueChange={(val) => {
                                const next = val === ALL ? '' : val;
                                setSelectedStatus(next);
                                applyFilter('status', next);
                            }}
                        >
                            <SelectTrigger className={selectTriggerClass}>
                                <SelectValue placeholder="All Statuses" />
                            </SelectTrigger>
                            <SelectContent className={selectMenuClass}>
                                <SelectItem value={ALL} className={selectItemClass}>All Statuses</SelectItem>
                                <SelectItem value="open" className={selectItemClass}>Open</SelectItem>
                                <SelectItem value="in_progress" className={selectItemClass}>In Progress</SelectItem>
                                <SelectItem value="resolved" className={selectItemClass}>Resolved</SelectItem>
                                <SelectItem value="closed" className={selectItemClass}>Closed</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select
                            value={selectedPriority || ALL}
                            onValueChange={(val) => {
                                const next = val === ALL ? '' : val;
                                setSelectedPriority(next);
                                applyFilter('priority', next);
                            }}
                        >
                            <SelectTrigger className={selectTriggerClass}>
                                <SelectValue placeholder="All Priorities" />
                            </SelectTrigger>
                            <SelectContent className={selectMenuClass}>
                                <SelectItem value={ALL} className={selectItemClass}>All Priorities</SelectItem>
                                <SelectItem value="urgent" className={selectItemClass}>Urgent</SelectItem>
                                <SelectItem value="high" className={selectItemClass}>High</SelectItem>
                                <SelectItem value="medium" className={selectItemClass}>Medium</SelectItem>
                                <SelectItem value="low" className={selectItemClass}>Low</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="overflow-hidden rounded-xl border border-[#F1F1F4] bg-white shadow-[0_3px_4px_0_rgba(0,0,0,0.03)]">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-[#FCFCFC]">
                                <TableRow className="border-[#F1F1F4] hover:bg-transparent">
                                    <TableHead className="w-14 px-5 py-3.5 text-[11.5px] font-semibold tracking-wide text-[#78829D] uppercase">
                                        SL
                                    </TableHead>
                                    <TableHead className="px-5 py-3.5 text-[11.5px] font-semibold tracking-wide text-[#78829D] uppercase">
                                        Ticket #
                                    </TableHead>
                                    <TableHead className="px-4 py-3.5 text-[11.5px] font-semibold tracking-wide text-[#78829D] uppercase">
                                        Subject
                                    </TableHead>
                                    <TableHead className="px-4 py-3.5 text-[11.5px] font-semibold tracking-wide text-[#78829D] uppercase">
                                        Member
                                    </TableHead>
                                    <TableHead className="px-4 py-3.5 text-[11.5px] font-semibold tracking-wide text-[#78829D] uppercase">
                                        Category
                                    </TableHead>
                                    <TableHead className="px-4 py-3.5 text-[11.5px] font-semibold tracking-wide text-[#78829D] uppercase">
                                        Priority
                                    </TableHead>
                                    <TableHead className="px-4 py-3.5 text-[11.5px] font-semibold tracking-wide text-[#78829D] uppercase">
                                        Status
                                    </TableHead>
                                    <TableHead className="px-5 py-3.5 text-right text-[11.5px] font-semibold tracking-wide text-[#78829D] uppercase">
                                        Action
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {tickets.data.length === 0 ? (
                                    <TableRow className="border-[#F1F1F4] hover:bg-transparent">
                                        <TableCell colSpan={8} className="h-32 text-center text-[13px] text-[#78829D]">
                                            No support tickets in queue.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    tickets.data.map((t, idx) => (
                                        <TableRow
                                            key={t.id}
                                            className="border-[#F1F1F4] transition-colors hover:bg-[#FCFCFC]"
                                        >
                                            <TableCell className="px-5 py-3.5 text-[12.5px] font-medium text-[#78829D] tabular-nums">
                                                {(tickets.from || 1) + idx}
                                            </TableCell>
                                            <TableCell className="px-5 py-3.5 font-mono text-[12.5px] font-bold text-[#071437]">
                                                <div className="flex items-center gap-2">
                                                    <LifeBuoy className="size-4 text-[#1B84FF]" />
                                                    {t.ticket_no}
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-4 py-3.5">
                                                <div className="text-[13px] font-semibold text-[#071437]">
                                                    {t.subject}
                                                </div>
                                                <div className="text-[11px] text-[#78829D]">
                                                    Created {new Date(t.created_at).toLocaleDateString()}
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-4 py-3.5">
                                                <div className="text-[13px] font-medium text-[#071437]">
                                                    {t.user?.name}
                                                </div>
                                                <div className="text-[11px] text-[#78829D]">
                                                    {t.user?.email}
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-4 py-3.5 text-[13px] text-[#4B5675] capitalize">
                                                {t.category}
                                            </TableCell>
                                            <TableCell className="px-4 py-3.5">
                                                <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold uppercase ${priorityPill(t.priority)}`}>
                                                    {t.priority}
                                                </span>
                                            </TableCell>
                                            <TableCell className="px-4 py-3.5">
                                                <span
                                                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize ${statusPill(t.status)}`}
                                                >
                                                    {t.status.replace('_', ' ')}
                                                </span>
                                            </TableCell>
                                            <TableCell className="px-5 py-3.5 text-right">
                                                <Link
                                                    href={`/admin/tickets/${t.id}`}
                                                    className="inline-flex items-center gap-1.5 rounded-lg border border-[#DBDFE9] bg-white px-3 py-1.5 text-[12px] font-semibold text-[#071437] transition-colors hover:border-[#1B84FF] hover:bg-[#F1F6FF] hover:text-[#1B84FF]"
                                                >
                                                    Open Thread <ArrowRight className="size-3.5" />
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    <div className="flex flex-col items-center justify-between gap-3 border-t border-[#F1F1F4] px-5 py-3.5 text-[12.5px] text-[#78829D] sm:flex-row">
                        <div className="flex flex-wrap items-center gap-3">
                            <span>
                                Showing <strong className="font-semibold text-[#071437]">{tickets.from || 0}</strong>–
                                <strong className="font-semibold text-[#071437]">{tickets.to || 0}</strong> of{' '}
                                <strong className="font-semibold text-[#071437]">{tickets.total}</strong> · Page {tickets.current_page} of {tickets.last_page}
                            </span>
                            <div className="flex items-center gap-1.5">
                                <span className="text-[12px] text-[#78829D]">Rows:</span>
                                <Select
                                    value={perPage}
                                    onValueChange={(val) => {
                                        setPerPage(val);
                                        applyFilter('per_page', val);
                                    }}
                                >
                                    <SelectTrigger className="!h-8 w-[72px] cursor-pointer rounded-md !border-[#DBDFE9] !bg-[#FCFCFC] px-2.5 text-[12px] font-medium !text-[#071437] !shadow-none">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className={selectMenuClass}>
                                        {['10', '25', '50', '100'].map((size) => (
                                            <SelectItem key={size} value={size} className={selectItemClass}>
                                                {size}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5">
                            {tickets.links.map((link, idx) => (
                                <Link
                                    key={idx}
                                    href={link.url || '#'}
                                    preserveScroll
                                    disabled={!link.url}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`rounded-lg px-2.5 py-1 text-[12px] font-medium transition-colors ${
                                        link.active
                                            ? 'bg-[#1B84FF] font-semibold text-white'
                                            : link.url
                                              ? 'text-[#4B5675] hover:bg-[#F1F6FF] hover:text-[#1B84FF]'
                                              : 'pointer-events-none text-[#DBDFE9]'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
