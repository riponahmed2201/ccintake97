import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Send, Shield, User } from 'lucide-react';
import type { SupportTicket } from '@/types';

interface TicketShowProps {
    ticket: SupportTicket;
}

const textareaClass =
    'w-full rounded-md border !border-[#DBDFE9] !bg-[#FCFCFC] p-3 text-[13px] font-normal !text-[#071437] !shadow-none outline-none transition-all duration-200 placeholder:!text-[#99A1B7] hover:!border-[#C4CADA] focus:!border-[#1B84FF] focus:!bg-white focus:!ring-[3px] focus:!ring-[#1B84FF]/10 dark:!bg-[#FCFCFC] dark:!text-[#071437]';

const selectTriggerClass =
    '!h-9 w-48 cursor-pointer rounded-md !border-[#DBDFE9] !bg-[#FCFCFC] px-3 text-[12.5px] font-semibold !text-[#071437] !shadow-none transition-all duration-200 hover:!border-[#C4CADA] hover:!bg-[#FCFCFC] focus-visible:!border-[#1B84FF] focus-visible:!bg-white focus-visible:!ring-[3px] focus-visible:!ring-[#1B84FF]/10 dark:!bg-[#FCFCFC] dark:hover:!bg-[#FCFCFC]';

const selectMenuClass =
    'z-[60] rounded-xl !border-[#F1F1F4] !bg-white p-1 !text-[#071437] shadow-[0_12px_32px_-8px_rgba(7,20,55,0.16)] dark:!bg-white dark:!text-[#071437]';

const selectItemClass =
    'cursor-pointer rounded-lg py-2 pr-8 pl-2.5 text-[13px] text-[#071437] focus:!bg-[#F1F6FF] focus:!text-[#1B84FF] dark:text-[#071437]';

export default function TicketShow({ ticket }: TicketShowProps) {
    const [replyText, setReplyText] = useState('');
    const [isInternal, setIsInternal] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState<string>(ticket.status);

    const handleReply = (e: React.FormEvent) => {
        e.preventDefault();
        if (!replyText.trim()) return;

        router.post(
            `/admin/tickets/${ticket.id}/reply`,
            {
                message: replyText,
                is_internal_note: isInternal,
            },
            {
                onSuccess: () => setReplyText(''),
            },
        );
    };

    const handleStatusChange = (status: string) => {
        setSelectedStatus(status);
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

            <div className="mx-auto max-w-4xl space-y-6">
                <Link
                    href="/admin/tickets"
                    className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#78829D] transition-colors hover:text-[#071437]"
                >
                    <ArrowLeft className="size-4" />
                    Back to Tickets
                </Link>

                <div className="rounded-xl border border-[#F1F1F4] bg-white p-6 shadow-[0_3px_4px_0_rgba(0,0,0,0.03)]">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="space-y-1.5">
                            <div className="flex flex-wrap items-center gap-2.5">
                                <span className="font-mono text-[14px] font-bold text-[#071437]">
                                    {ticket.ticket_no}
                                </span>
                                <span className="inline-flex items-center rounded-md border border-[#E5E7EB] bg-[#FCFCFC] px-2 py-0.5 text-[11px] font-semibold text-[#4B5675] uppercase">
                                    Priority: {ticket.priority}
                                </span>
                                <span className="inline-flex items-center rounded-full border border-blue-200 bg-[#F1F6FF] px-2.5 py-0.5 text-[11px] font-semibold text-[#1B84FF] capitalize">
                                    {ticket.status.replace('_', ' ')}
                                </span>
                            </div>
                            <h1 className="pt-1 text-[17px] font-bold text-[#071437]">
                                {ticket.subject}
                            </h1>
                            <div className="text-[12.5px] text-[#78829D]">
                                From: <span className="font-medium text-[#071437]">{ticket.user?.name}</span> (
                                {ticket.user?.email}) · Category:{' '}
                                <span className="capitalize">{ticket.category}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2.5">
                            <span className="text-[12.5px] font-semibold text-[#4B5675]">Status:</span>
                            <Select value={selectedStatus} onValueChange={handleStatusChange}>
                                <SelectTrigger className={selectTriggerClass}>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className={selectMenuClass}>
                                    <SelectItem value="open" className={selectItemClass}>
                                        Open
                                    </SelectItem>
                                    <SelectItem value="in_progress" className={selectItemClass}>
                                        In Progress
                                    </SelectItem>
                                    <SelectItem value="waiting_member" className={selectItemClass}>
                                        Waiting for Member
                                    </SelectItem>
                                    <SelectItem value="resolved" className={selectItemClass}>
                                        Resolved
                                    </SelectItem>
                                    <SelectItem value="closed" className={selectItemClass}>
                                        Closed
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                <div className="space-y-3.5">
                    {ticket.messages?.map((msg) => (
                        <div
                            key={msg.id}
                            className={`rounded-xl border p-5 text-[13px] leading-relaxed ${
                                msg.is_internal_note
                                    ? 'border-amber-200 bg-[#FFFBEB] text-amber-950'
                                    : msg.sender?.id === ticket.user_id
                                      ? 'border-[#F1F1F4] bg-white text-[#071437] shadow-[0_3px_4px_0_rgba(0,0,0,0.03)]'
                                      : 'border-[#DCEBFF] bg-[#F6FAFF] text-[#071437]'
                            }`}
                        >
                            <div className="mb-2.5 flex items-center justify-between border-b border-black/5 pb-2 text-[12px]">
                                <span className="flex items-center gap-1.5 font-bold">
                                    {msg.is_internal_note ? (
                                        <Shield className="size-3.5 text-amber-600" />
                                    ) : (
                                        <User className="size-3.5 text-[#1B84FF]" />
                                    )}
                                    {msg.sender?.name}{' '}
                                    {msg.is_internal_note ? '(Internal Administrative Note)' : ''}
                                </span>
                                <span className="text-[11.5px] text-[#78829D]">
                                    {new Date(msg.created_at).toLocaleString()}
                                </span>
                            </div>
                            <div className="whitespace-pre-wrap">{msg.message}</div>
                        </div>
                    ))}
                </div>

                <div className="overflow-hidden rounded-xl border border-[#F1F1F4] bg-white shadow-[0_3px_4px_0_rgba(0,0,0,0.03)]">
                    <div className="border-b border-[#F1F1F4] px-6 py-4">
                        <h2 className="text-[14px] font-bold text-[#071437]">
                            Post Response / Internal Note
                        </h2>
                    </div>
                    <form onSubmit={handleReply} className="space-y-4 p-6">
                        <textarea
                            rows={4}
                            required
                            placeholder="Type your response to the member or add an internal staff note..."
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            className={textareaClass}
                        />

                        <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
                            <label className="flex cursor-pointer items-center gap-2 text-[12.5px] font-medium text-[#4B5675]">
                                <input
                                    type="checkbox"
                                    checked={isInternal}
                                    onChange={(e) => setIsInternal(e.target.checked)}
                                    className="size-4 rounded border-[#DBDFE9] text-amber-600 focus:ring-amber-500"
                                />
                                Internal note only (not visible to member)
                            </label>

                            <Button
                                type="submit"
                                className={`h-10 rounded-lg px-5 text-[13px] font-semibold text-white ${
                                    isInternal
                                        ? 'bg-amber-600 hover:bg-amber-700'
                                        : 'bg-[#1B84FF] hover:bg-[#1B84FF]/90'
                                }`}
                            >
                                <Send className="mr-1.5 size-3.5" />
                                {isInternal ? 'Save Internal Note' : 'Send Reply to Member'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
