import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import MemberLayout from '@/layouts/member-layout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Send, User } from 'lucide-react';
import type { AuthUser, SupportTicket } from '@/types';

interface TicketShowProps {
    ticket: SupportTicket;
}

const fieldClass =
    'w-full rounded-md border !border-[#DBDFE9] !bg-[#FCFCFC] p-3 text-[13px] font-normal !text-[#071437] !shadow-none outline-none transition-all duration-200 placeholder:!text-[#99A1B7] hover:!border-[#C4CADA] focus:!border-[#1B84FF] focus:!bg-white focus:!ring-[3px] focus:!ring-[#1B84FF]/10 dark:!bg-[#FCFCFC] dark:!text-[#071437]';

export default function MemberTicketShow({ ticket }: TicketShowProps) {
    const page = usePage();
    const authUserId = (page.props as { auth?: { user?: AuthUser } }).auth?.user?.id;
    const [replyText, setReplyText] = useState('');

    const handleReply = (e: React.FormEvent) => {
        e.preventDefault();
        if (!replyText.trim()) return;

        router.post(
            `/member/tickets/${ticket.id}/reply`,
            { message: replyText },
            {
                preserveScroll: true,
                onSuccess: () => setReplyText(''),
            }
        );
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

            <div className="w-full space-y-6">
                <div>
                    <Link
                        href="/member/tickets"
                        className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-[#78829D] transition-colors hover:text-[#1B84FF]"
                    >
                        <ArrowLeft className="size-4" />
                        Back to Tickets
                    </Link>
                </div>

                {/* Details Card */}
                <div className="rounded-xl border border-[#F1F1F4] bg-white p-5 shadow-[0_3px_4px_0_rgba(0,0,0,0.03)] sm:p-6">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                            <span className="font-mono text-[14px] font-bold text-[#071437]">
                                {ticket.ticket_no}
                            </span>
                            <span
                                className={`inline-flex rounded-md px-2.5 py-0.5 text-[11px] font-semibold capitalize ${
                                    ticket.status === 'open'
                                        ? 'bg-[#FFF8DD] text-[#B45309]'
                                        : ticket.status === 'resolved'
                                          ? 'bg-[#EAFFF1] text-[#17C653]'
                                          : 'bg-[#F1F6FF] text-[#1B84FF]'
                                }`}
                            >
                                {ticket.status.replace('_', ' ')}
                            </span>
                        </div>
                        <span className="text-[12px] text-[#99A1B7]">
                            {new Date(ticket.created_at).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                            })}
                        </span>
                    </div>
                    <h1 className="mt-2.5 text-[18px] font-semibold text-[#071437]">
                        {ticket.subject}
                    </h1>
                </div>

                {/* Thread Messages */}
                <div className="space-y-3">
                    {ticket.messages
                        ?.filter((m) => !m.is_internal_note)
                        .map((msg) => {
                            const isMe = msg.sender_id === authUserId;
                            return (
                                <div
                                    key={msg.id}
                                    className={`rounded-xl border p-5 text-[13px] leading-relaxed ${
                                        isMe
                                            ? 'border-[#1B84FF]/20 bg-[#F8FBFF]'
                                            : 'border-[#F1F1F4] bg-white shadow-[0_3px_4px_0_rgba(0,0,0,0.02)]'
                                    }`}
                                >
                                    <div className="mb-2.5 flex items-center justify-between border-b border-[#F1F1F4] pb-2 text-[12px]">
                                        <span className="inline-flex items-center gap-1.5 font-semibold text-[#071437]">
                                            <User className="size-3.5 text-[#1B84FF]" />
                                            {msg.sender?.name}
                                        </span>
                                        <span className="text-[#99A1B7]">
                                            {new Date(msg.created_at).toLocaleString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric',
                                                hour: 'numeric',
                                                minute: '2-digit',
                                            })}
                                        </span>
                                    </div>
                                    <div className="whitespace-pre-wrap text-[#4B5675]">{msg.message}</div>
                                </div>
                            );
                        })}
                </div>

                {/* Reply Form */}
                <div className="rounded-xl border border-[#F1F1F4] bg-white p-5 shadow-[0_3px_4px_0_rgba(0,0,0,0.03)] sm:p-6">
                    <div className="mb-3 text-[14px] font-semibold text-[#071437]">
                        Reply to Thread
                    </div>
                    <form onSubmit={handleReply} className="space-y-3.5">
                        <textarea
                            rows={3}
                            required
                            placeholder="Write your follow-up message..."
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            className={fieldClass}
                        />
                        <div className="flex justify-end">
                            <Button
                                type="submit"
                                className="h-9.5 rounded-lg bg-[#1B84FF] px-4 text-[12.5px] font-semibold text-white hover:bg-[#006AE6]"
                            >
                                <Send className="mr-1.5 size-3.5" /> Send Message
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </MemberLayout>
    );
}
