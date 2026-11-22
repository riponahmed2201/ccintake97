import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import MemberLayout from '@/layouts/member-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
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

export default function MemberTicketsIndex({ tickets }: TicketsIndexProps) {
    const [createOpen, setCreateOpen] = useState(false);
    const [category, setCategory] = useState('membership');
    const [subject, setSubject] = useState('');
    const [priority, setPriority] = useState('medium');
    const [message, setMessage] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/member/tickets', {
            category,
            subject,
            priority,
            message,
        }, {
            onSuccess: () => {
                setCreateOpen(false);
                setSubject('');
                setMessage('');
            },
        });
    };

    return (
        <MemberLayout
            title="Help & Member Support"
            breadcrumbs={[{ title: 'Help & Support' }]}
        >
            <Head title="Help & Support - INTAKE97.COM" />

            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                            Member Support & Inquiries
                        </h1>
                        <p className="text-xs text-slate-500 mt-1">
                            Contact association administrators for membership assistance, profile verification questions, and technical support.
                        </p>
                    </div>

                    <Button
                        size="sm"
                        onClick={() => setCreateOpen(true)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-xs font-semibold"
                    >
                        <Plus className="size-3.5 mr-1" /> Create Support Ticket
                    </Button>
                </div>

                <Card className="overflow-hidden">
                    <Table>
                        <TableHeader className="bg-slate-50 dark:bg-slate-900/60">
                            <TableRow>
                                <TableHead className="text-xs font-semibold">Ticket #</TableHead>
                                <TableHead className="text-xs font-semibold">Subject</TableHead>
                                <TableHead className="text-xs font-semibold">Category</TableHead>
                                <TableHead className="text-xs font-semibold">Status</TableHead>
                                <TableHead className="text-xs font-semibold">Created Date</TableHead>
                                <TableHead className="text-xs font-semibold text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tickets.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-28 text-center text-xs text-slate-500">
                                        You have no active support tickets. Click "Create Support Ticket" to ask a question.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                tickets.data.map((t) => (
                                    <TableRow key={t.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                                        <TableCell className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                                            {t.ticket_no}
                                        </TableCell>
                                        <TableCell className="font-semibold text-xs text-slate-900 dark:text-white">
                                            {t.subject}
                                        </TableCell>
                                        <TableCell className="capitalize text-xs text-slate-600">
                                            {t.category}
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
                                        <TableCell className="text-xs text-slate-500">
                                            {new Date(t.created_at).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Link
                                                href={`/member/tickets/${t.id}`}
                                                className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:underline"
                                            >
                                                View Thread <ArrowRight className="size-3" />
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </Card>
            </div>

            {/* Create Ticket Dialog */}
            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-sm font-semibold">Submit Support Ticket</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-3 py-2 text-xs">
                        <div>
                            <label className="font-semibold block mb-1">Inquiry Category *</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full text-xs rounded-md border p-2 bg-white dark:bg-slate-900"
                            >
                                <option value="membership">Membership & Verification Assistance</option>
                                <option value="event">Event Registration & Passes</option>
                                <option value="business">Business Directory Listing</option>
                                <option value="technical">Technical Issue / Bug</option>
                                <option value="general">General Association Inquiry</option>
                            </select>
                        </div>
                        <div>
                            <label className="font-semibold block mb-1">Subject *</label>
                            <Input
                                required
                                placeholder="Summary of your question or issue..."
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="font-semibold block mb-1">Message Description *</label>
                            <textarea
                                required
                                rows={4}
                                className="w-full text-xs rounded-md border p-2.5 bg-white dark:bg-slate-900"
                                placeholder="Provide full context so the committee can assist you effectively..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" size="sm" onClick={() => setCreateOpen(false)}>Cancel</Button>
                            <Button type="submit" size="sm" className="bg-indigo-600 hover:bg-indigo-700">Submit Ticket</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </MemberLayout>
    );
}
