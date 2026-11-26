import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import MemberLayout from '@/layouts/member-layout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { LifeBuoy, Plus, ArrowRight } from 'lucide-react';
import type { SupportTicket } from '@/types';

interface TicketsIndexProps {
    tickets: {
        data: SupportTicket[];
        current_page: number;
        last_page: number;
        total: number;
    };
}

const fieldClass =
    'h-10 w-full rounded-md border !border-[#DBDFE9] !bg-[#FCFCFC] px-3 text-[13px] font-normal !text-[#071437] !shadow-none outline-none transition-all duration-200 placeholder:!text-[#99A1B7] hover:!border-[#C4CADA] focus:!border-[#1B84FF] focus:!bg-white focus:!ring-[3px] focus:!ring-[#1B84FF]/10 dark:!bg-[#FCFCFC] dark:!text-[#071437]';

const selectTriggerClass =
    '!h-10 w-full cursor-pointer rounded-md !border-[#DBDFE9] !bg-[#FCFCFC] px-3 text-[13px] font-normal !text-[#071437] !shadow-none transition-all duration-200 hover:!border-[#C4CADA] hover:!bg-[#FCFCFC] focus-visible:!border-[#1B84FF] focus-visible:!bg-white focus-visible:!ring-[3px] focus-visible:!ring-[#1B84FF]/10 dark:!bg-[#FCFCFC] dark:hover:!bg-[#FCFCFC]';

const TICKET_CATEGORIES = [
    { value: 'membership', label: 'Membership & Verification Assistance' },
    { value: 'event', label: 'Event Registration & Passes' },
    { value: 'business', label: 'Business Directory Listing' },
    { value: 'technical', label: 'Technical Issue / Bug' },
    { value: 'general', label: 'General Association Inquiry' },
];

export default function MemberTicketsIndex({ tickets }: TicketsIndexProps) {
    const [createOpen, setCreateOpen] = useState(false);
    const [category, setCategory] = useState('membership');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(
            '/member/tickets',
            {
                category,
                subject,
                priority: 'medium',
                message,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setCreateOpen(false);
                    setSubject('');
                    setMessage('');
                },
            }
        );
    };

    return (
        <MemberLayout
            title="Help & Support"
            breadcrumbs={[{ title: 'Help & Support' }]}
        >
            <Head title="Help & Support - CCINTAKE97.COM" />

            <div className="w-full space-y-6">
                {/* Page Header */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="text-[22px] font-semibold tracking-tight text-[#071437]">
                            Member Support &amp; Inquiries
                        </h1>
                        <p className="mt-1 text-[13px] text-[#78829D]">
                            Contact association administrators for membership assistance, profile verification questions, and technical support.
                        </p>
                    </div>

                    <Button
                        type="button"
                        onClick={() => setCreateOpen(true)}
                        className="h-9 self-start rounded-lg bg-[#1B84FF] px-4 text-[12.5px] font-semibold text-white hover:bg-[#006AE6] sm:self-auto"
                    >
                        <Plus className="mr-1.5 size-3.5" /> Create Support Ticket
                    </Button>
                </div>

                {/* Tickets Table Card */}
                <div className="overflow-hidden rounded-xl border border-[#F1F1F4] bg-white shadow-[0_3px_4px_0_rgba(0,0,0,0.03)]">
                    <Table>
                        <TableHeader className="bg-[#FCFCFC]">
                            <TableRow className="border-[#F1F1F4] hover:bg-transparent">
                                <TableHead className="px-5 py-3.5 text-[11.5px] font-semibold tracking-wide text-[#78829D] uppercase">
                                    Ticket #
                                </TableHead>
                                <TableHead className="px-5 py-3.5 text-[11.5px] font-semibold tracking-wide text-[#78829D] uppercase">
                                    Subject
                                </TableHead>
                                <TableHead className="px-5 py-3.5 text-[11.5px] font-semibold tracking-wide text-[#78829D] uppercase">
                                    Category
                                </TableHead>
                                <TableHead className="px-5 py-3.5 text-[11.5px] font-semibold tracking-wide text-[#78829D] uppercase">
                                    Status
                                </TableHead>
                                <TableHead className="px-5 py-3.5 text-[11.5px] font-semibold tracking-wide text-[#78829D] uppercase">
                                    Created
                                </TableHead>
                                <TableHead className="px-5 py-3.5 text-right text-[11.5px] font-semibold tracking-wide text-[#78829D] uppercase">
                                    Action
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tickets.data.length === 0 ? (
                                <TableRow className="hover:bg-transparent">
                                    <TableCell colSpan={6} className="px-6 py-12 text-center">
                                        <div className="mx-auto flex max-w-md flex-col items-center">
                                            <div className="mb-3 flex size-11 items-center justify-center rounded-full bg-[#F1F6FF] text-[#1B84FF]">
                                                <LifeBuoy className="size-5" />
                                            </div>
                                            <p className="text-[13.5px] font-semibold text-[#071437]">No support tickets yet</p>
                                            <p className="mt-1 text-[12.5px] text-[#78829D]">
                                                Click &ldquo;Create Support Ticket&rdquo; if you need help from the association team.
                                            </p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                tickets.data.map((t) => (
                                    <TableRow key={t.id} className="border-[#F1F1F4] hover:bg-[#FCFCFC]">
                                        <TableCell className="px-5 py-3.5 font-mono text-[12.5px] font-semibold text-[#071437]">
                                            {t.ticket_no}
                                        </TableCell>
                                        <TableCell className="px-5 py-3.5 text-[13px] font-semibold text-[#071437]">
                                            {t.subject}
                                        </TableCell>
                                        <TableCell className="px-5 py-3.5 text-[12.5px] text-[#4B5675] capitalize">
                                            {t.category}
                                        </TableCell>
                                        <TableCell className="px-5 py-3.5">
                                            <span
                                                className={`inline-flex rounded-md px-2.5 py-0.5 text-[11px] font-semibold capitalize ${
                                                    t.status === 'open'
                                                        ? 'bg-[#FFF8DD] text-[#B45309]'
                                                        : t.status === 'resolved'
                                                          ? 'bg-[#EAFFF1] text-[#17C653]'
                                                          : 'bg-[#F1F6FF] text-[#1B84FF]'
                                                }`}
                                            >
                                                {t.status.replace('_', ' ')}
                                            </span>
                                        </TableCell>
                                        <TableCell className="px-5 py-3.5 text-[12.5px] text-[#78829D]">
                                            {new Date(t.created_at).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric',
                                            })}
                                        </TableCell>
                                        <TableCell className="px-5 py-3.5 text-right">
                                            <Link
                                                href={`/member/tickets/${t.id}`}
                                                className="inline-flex items-center gap-1 text-[12.5px] font-semibold text-[#1B84FF] hover:text-[#006AE6]"
                                            >
                                                View Thread <ArrowRight className="size-3.5" />
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Create Ticket Dialog */}
            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                <DialogContent className="rounded-2xl border-[#F1F1F4] !bg-white p-0 !text-[#071437] shadow-[0_20px_50px_-12px_rgba(7,20,55,0.18)] sm:max-w-lg">
                    <DialogHeader className="border-b border-[#F1F1F4] px-6 py-5">
                        <DialogTitle className="text-[16px] font-semibold text-[#071437]">
                            Submit Support Ticket
                        </DialogTitle>
                        <DialogDescription className="mt-1 text-[12.5px] text-[#78829D]">
                            Tell us what you need help with and our committee team will respond shortly.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
                        <div>
                            <label className="mb-1.5 block text-[12.5px] font-semibold text-[#071437]">
                                Inquiry Category <span className="text-[#F8285A]">*</span>
                            </label>
                            <Select value={category} onValueChange={setCategory}>
                                <SelectTrigger className={selectTriggerClass}>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent className="z-[60] rounded-xl !border-[#F1F1F4] !bg-white p-1 !text-[#071437] shadow-[0_12px_32px_-8px_rgba(7,20,55,0.16)] dark:!bg-white dark:!text-[#071437]">
                                    {TICKET_CATEGORIES.map((item) => (
                                        <SelectItem
                                            key={item.value}
                                            value={item.value}
                                            className="cursor-pointer rounded-lg py-2 pr-8 pl-2.5 text-[13px] text-[#071437] focus:!bg-[#F1F6FF] focus:!text-[#1B84FF] dark:text-[#071437]"
                                        >
                                            {item.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label className="mb-1.5 block text-[12.5px] font-semibold text-[#071437]">
                                Subject <span className="text-[#F8285A]">*</span>
                            </label>
                            <Input
                                required
                                placeholder="Summary of your question or issue..."
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                className={fieldClass}
                            />
                        </div>
                        <div>
                            <label className="mb-1.5 block text-[12.5px] font-semibold text-[#071437]">
                                Message Description <span className="text-[#F8285A]">*</span>
                            </label>
                            <textarea
                                required
                                rows={4}
                                className={`${fieldClass} h-auto py-2.5`}
                                placeholder="Provide full context so the committee can assist you effectively..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                        </div>
                        <DialogFooter className="border-t border-[#F1F1F4] pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setCreateOpen(false)}
                                className="h-9.5 rounded-lg border-[#DBDFE9] !bg-white px-4 text-[12.5px] font-semibold text-[#4B5675] hover:!bg-[#F9F9F9] hover:text-[#071437]"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="h-9.5 rounded-lg bg-[#1B84FF] px-5 text-[12.5px] font-semibold text-white hover:bg-[#006AE6]"
                            >
                                Submit Ticket
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </MemberLayout>
    );
}
