import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import MemberLayout from '@/layouts/member-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Send, User, Shield } from 'lucide-react';
import type { SupportTicket } from '@/types';

interface TicketShowProps {
    ticket: SupportTicket;
}

export default function MemberTicketShow({ ticket }: TicketShowProps) {
    const [replyText, setReplyText] = useState('');

    const handleReply = (e: React.FormEvent) => {
        e.preventDefault();
        if (!replyText.trim()) return;

        router.post(`/member/tickets/${ticket.id}/reply`, {
            message: replyText,
        }, {
            onSuccess: () => setReplyText(''),
        });
    };

    return (
        <MemberLayout
            title={`Ticket #${ticket.ticket_no}`}
            breadcrumbs={[
                { title: 'Help & Support', href: '/member/tickets' },
                { title: ticket.ticket_no },
            ]}
        >
            <Head title={`Ticket ${ticket.ticket_no} - INTAKE97.COM`} />

            <div className="max-w-3xl mx-auto space-y-6">
                <Link
                    href="/member/tickets"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900"
                >
                    <ArrowLeft className="size-4" />
                    Back to Tickets
                </Link>

                {/* Details Card */}
                <Card className="p-5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">
                                {ticket.ticket_no}
                            </span>
                            <Badge className="text-xs capitalize">
                                {ticket.status.replace('_', ' ')}
                            </Badge>
                        </div>
                        <span className="text-xs text-slate-400">
                            {new Date(ticket.created_at).toLocaleDateString()}
                        </span>
                    </div>
                    <h2 className="text-base font-bold text-slate-900 dark:text-white pt-2">
                        {ticket.subject}
                    </h2>
                </Card>

                {/* Thread Messages */}
                <div className="space-y-3">
                    {ticket.messages?.filter(m => !m.is_internal_note).map((msg) => {
                        const isMe = msg.sender_id === (window as any)?.__auth_id;
                        return (
                            <div
                                key={msg.id}
                                className={`p-4 rounded-2xl border text-xs leading-relaxed ${
                                    isMe
                                        ? 'bg-indigo-50/50 dark:bg-slate-900 border-indigo-100 dark:border-slate-800'
                                        : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700'
                                }`}
                            >
                                <div className="flex items-center justify-between pb-2 mb-2 border-b border-inherit/40 text-[11px]">
                                    <span className="font-bold flex items-center gap-1.5">
                                        <User className="size-3.5 text-indigo-600" />
                                        {msg.sender?.name}
                                    </span>
                                    <span className="text-slate-400">
                                        {new Date(msg.created_at).toLocaleString()}
                                    </span>
                                </div>
                                <div className="whitespace-pre-wrap">{msg.message}</div>
                            </div>
                        );
                    })}
                </div>

                {/* Reply Form */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-bold text-slate-700 dark:text-slate-300">
                            Reply to Thread
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleReply} className="space-y-3 text-xs">
                            <textarea
                                rows={3}
                                required
                                placeholder="Write your follow-up message..."
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                className="w-full text-xs rounded-md border p-3 bg-white dark:bg-slate-900"
                            />
                            <div className="flex justify-end">
                                <Button type="submit" size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-xs font-semibold">
                                    <Send className="size-3 mr-1" /> Send Message
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </MemberLayout>
    );
}
