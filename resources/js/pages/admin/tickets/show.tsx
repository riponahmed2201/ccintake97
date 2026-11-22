import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Send, CheckCircle2, User, Shield } from 'lucide-react';
import type { SupportTicket } from '@/types';

interface TicketShowProps {
    ticket: SupportTicket;
}

export default function TicketShow({ ticket }: TicketShowProps) {
    const [replyText, setReplyText] = useState('');
    const [isInternal, setIsInternal] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState(ticket.status);

    const handleReply = (e: React.FormEvent) => {
        e.preventDefault();
        if (!replyText.trim()) return;

        router.post(`/admin/tickets/${ticket.id}/reply`, {
            message: replyText,
            is_internal_note: isInternal,
        }, {
            onSuccess: () => setReplyText(''),
        });
    };

    const handleStatusChange = (status: string) => {
        setSelectedStatus(status as any);
        router.put(`/admin/tickets/${ticket.id}/status`, { status });
    };

    return (
        <AdminLayout
            title={`Ticket #${ticket.ticket_no}`}
            breadcrumbs={[
                { title: 'Support Tickets', href: '/admin/tickets' },
                { title: ticket.ticket_no },
            ]}
        >
            <Head title={`Ticket ${ticket.ticket_no} - INTAKE 97 Admin`} />

            <div className="max-w-4xl mx-auto space-y-6">
                <Link
                    href="/admin/tickets"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900"
                >
                    <ArrowLeft className="size-4" />
                    Back to Tickets
                </Link>

                {/* Ticket Details Bar */}
                <Card className="p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="space-y-1">
                            <div className="flex items-center gap-3">
                                <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">
                                    {ticket.ticket_no}
                                </span>
                                <Badge variant="outline" className="text-xs uppercase font-semibold">
                                    Priority: {ticket.priority}
                                </Badge>
                                <Badge className="text-xs capitalize">
                                    {ticket.status.replace('_', ' ')}
                                </Badge>
                            </div>
                            <h2 className="text-base font-bold text-slate-900 dark:text-white pt-1">
                                {ticket.subject}
                            </h2>
                            <div className="text-xs text-slate-500">
                                From: {ticket.user?.name} ({ticket.user?.email}) · Category: {ticket.category}
                            </div>
                        </div>

                        {/* Status Switcher */}
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-slate-600">Update Status:</span>
                            <select
                                value={selectedStatus}
                                onChange={(e) => handleStatusChange(e.target.value)}
                                className="text-xs rounded-md border p-1.5 bg-white dark:bg-slate-900"
                            >
                                <option value="open">Open</option>
                                <option value="in_progress">In Progress</option>
                                <option value="waiting_member">Waiting for Member</option>
                                <option value="resolved">Resolved</option>
                                <option value="closed">Closed</option>
                            </select>
                        </div>
                    </div>
                </Card>

                {/* Messages Thread */}
                <div className="space-y-3">
                    {ticket.messages?.map((msg) => (
                        <div
                            key={msg.id}
                            className={`p-4 rounded-2xl border text-xs leading-relaxed ${
                                msg.is_internal_note
                                    ? 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-200/70 text-amber-900 dark:text-amber-200'
                                    : msg.sender?.id === ticket.user_id
                                    ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                                    : 'bg-indigo-50/50 dark:bg-slate-800/60 border-indigo-100 dark:border-slate-700'
                            }`}
                        >
                            <div className="flex items-center justify-between pb-2 mb-2 border-b border-inherit/40 text-[11px]">
                                <span className="font-bold flex items-center gap-1.5">
                                    {msg.is_internal_note ? (
                                        <Shield className="size-3.5 text-amber-600" />
                                    ) : (
                                        <User className="size-3.5 text-indigo-600" />
                                    )}
                                    {msg.sender?.name} {msg.is_internal_note ? '(Internal Administrative Note)' : ''}
                                </span>
                                <span className="text-slate-400">
                                    {new Date(msg.created_at).toLocaleString()}
                                </span>
                            </div>
                            <div className="whitespace-pre-wrap">{msg.message}</div>
                        </div>
                    ))}
                </div>

                {/* Reply Form */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-bold text-slate-700 dark:text-slate-300">
                            Post Response / Internal Note
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleReply} className="space-y-3 text-xs">
                            <textarea
                                rows={4}
                                required
                                placeholder="Type your response to the member or add an internal staff note..."
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                className="w-full text-xs rounded-md border p-3 bg-white dark:bg-slate-900"
                            />

                            <div className="flex items-center justify-between pt-2">
                                <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-600 dark:text-slate-400">
                                    <input
                                        type="checkbox"
                                        checked={isInternal}
                                        onChange={(e) => setIsInternal(e.target.checked)}
                                        className="rounded text-amber-600"
                                    />
                                    Internal note only (not visible to member)
                                </label>

                                <Button
                                    type="submit"
                                    size="sm"
                                    className={`text-xs font-semibold ${
                                        isInternal ? 'bg-amber-600 hover:bg-amber-700' : 'bg-indigo-600 hover:bg-indigo-700'
                                    }`}
                                >
                                    <Send className="size-3.5 mr-1" />
                                    {isInternal ? 'Save Internal Note' : 'Send Reply to Member'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
