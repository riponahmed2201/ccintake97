import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { LifeBuoy, ArrowRight } from 'lucide-react';
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

export default function TicketsIndex({ tickets, filters }: TicketsIndexProps) {
    return (
        <AdminLayout
            title="Support Tickets & Inquiries"
            breadcrumbs={[{ title: 'Support Tickets' }]}
        >
            <Head title="Support Tickets - INTAKE 97 Admin" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                        Support Tickets & Inquiries
                    </h1>
                    <p className="text-xs text-slate-500 mt-1">
                        Respond to member questions, technical reports, and membership assistance requests.
                    </p>
                </div>

                <Card className="overflow-hidden">
                    <Table>
                        <TableHeader className="bg-slate-50 dark:bg-slate-900/60">
                            <TableRow>
                                <TableHead className="text-xs font-semibold">Ticket #</TableHead>
                                <TableHead className="text-xs font-semibold">Subject</TableHead>
                                <TableHead className="text-xs font-semibold">Member</TableHead>
                                <TableHead className="text-xs font-semibold">Category</TableHead>
                                <TableHead className="text-xs font-semibold">Priority</TableHead>
                                <TableHead className="text-xs font-semibold">Status</TableHead>
                                <TableHead className="text-xs font-semibold text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tickets.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-28 text-center text-xs text-slate-500">
                                        No support tickets in queue.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                tickets.data.map((t) => (
                                    <TableRow key={t.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                                        <TableCell className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                                            {t.ticket_no}
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-semibold text-xs text-slate-900 dark:text-white">
                                                {t.subject}
                                            </div>
                                            <div className="text-[10px] text-slate-400">
                                                Created {new Date(t.created_at).toLocaleDateString()}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium text-xs text-slate-800 dark:text-slate-200">
                                                {t.user?.name}
                                            </div>
                                            <div className="text-[10px] text-slate-400">
                                                {t.user?.email}
                                            </div>
                                        </TableCell>
                                        <TableCell className="capitalize text-xs text-slate-600">
                                            {t.category}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="text-[10px] uppercase font-semibold">
                                                {t.priority}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                className={`text-[10px] capitalize ${
                                                    t.status === 'open'
                                                        ? 'bg-amber-100 text-amber-800'
                                                        : t.status === 'resolved'
                                                        ? 'bg-emerald-100 text-emerald-800'
                                                        : 'bg-blue-100 text-blue-800'
                                                }`}
                                            >
                                                {t.status.replace('_', ' ')}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Link
                                                href={`/admin/tickets/${t.id}`}
                                                className="inline-flex items-center gap-1 px-3 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-semibold text-slate-800 dark:text-slate-200"
                                            >
                                                Open Thread <ArrowRight className="size-3" />
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </Card>
            </div>
        </AdminLayout>
    );
}
