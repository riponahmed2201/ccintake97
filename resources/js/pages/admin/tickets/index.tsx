import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { ArrowRight, LifeBuoy } from 'lucide-react';
import type { SupportTicket } from '@/types';

interface TicketsIndexProps {
    tickets: {
        data: SupportTicket[];
        current_page: number;
        last_page: number;
        total: number;
    };
    filters: {
        status?: string;
    };
}

const statusPill = (status: string) => {
    if (status === 'open') return 'border border-amber-200 bg-amber-50 text-amber-700';
    if (status === 'resolved') return 'border border-emerald-200 bg-emerald-50 text-emerald-700';
    return 'border border-blue-200 bg-[#F1F6FF] text-[#1B84FF]';
};

export default function TicketsIndex({ tickets }: TicketsIndexProps) {
    return (
        <AdminLayout
            title="Support Tickets & Inquiries"
            breadcrumbs={[{ title: 'Support Tickets' }]}
        >
            <Head title="Support Tickets - INTAKE 97 Admin" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-[20px] font-bold tracking-tight text-[#071437]">
                        Support Tickets & Inquiries
                    </h1>
                    <p className="mt-1 text-[13px] text-[#78829D]">
                        Respond to member questions, technical reports, and membership assistance requests.
                    </p>
                </div>

                <div className="overflow-hidden rounded-xl border border-[#F1F1F4] bg-white shadow-[0_3px_4px_0_rgba(0,0,0,0.03)]">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-[#FCFCFC]">
                                <TableRow className="border-[#F1F1F4] hover:bg-transparent">
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
                                        <TableCell colSpan={7} className="h-32 text-center text-[13px] text-[#78829D]">
                                            No support tickets in queue.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    tickets.data.map((t) => (
                                        <TableRow
                                            key={t.id}
                                            className="border-[#F1F1F4] transition-colors hover:bg-[#FCFCFC]"
                                        >
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
                                                <span className="inline-flex items-center rounded-md border border-[#E5E7EB] bg-[#FCFCFC] px-2 py-0.5 text-[11px] font-semibold text-[#4B5675] uppercase">
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
                </div>
            </div>
        </AdminLayout>
    );
}
