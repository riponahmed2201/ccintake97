import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Plus, Users, Edit2, CheckCircle2, QrCode } from 'lucide-react';
import type { Event } from '@/types';

interface EventsIndexProps {
    events: {
        data: (Event & { registrations_count: number })[];
        current_page: number;
        last_page: number;
        total: number;
        links: any[];
    };
}

export default function EventsIndex({ events }: EventsIndexProps) {
    const handlePublish = (id: number) => {
        router.post(`/admin/events/${id}/publish`);
    };

    return (
        <AdminLayout
            title="Events & Reunion Management"
            breadcrumbs={[{ title: 'Events' }]}
        >
            <Head title="Events Management - INTAKE 97 Admin" />

            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                            Alumni Events & Reunions
                        </h1>
                        <p className="text-xs text-slate-500 mt-1">
                            Organize national reunions, cadet college chapters, sports tournaments, and professional seminars.
                        </p>
                    </div>
                    <Link
                        href="/admin/events/create"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors"
                    >
                        <Plus className="size-3.5" /> Create New Event
                    </Link>
                </div>

                <Card className="overflow-hidden">
                    <Table>
                        <TableHeader className="bg-slate-50 dark:bg-slate-900/60">
                            <TableRow>
                                <TableHead className="text-xs font-semibold">Event Title & Venue</TableHead>
                                <TableHead className="text-xs font-semibold">Category</TableHead>
                                <TableHead className="text-xs font-semibold">Event Dates</TableHead>
                                <TableHead className="text-xs font-semibold">Registrations</TableHead>
                                <TableHead className="text-xs font-semibold">Visibility</TableHead>
                                <TableHead className="text-xs font-semibold">Status</TableHead>
                                <TableHead className="text-xs font-semibold text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {events.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-28 text-center text-xs text-slate-500">
                                        No events found. Click "Create New Event" to get started.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                events.data.map((ev) => (
                                    <TableRow key={ev.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                                        <TableCell>
                                            <div className="font-semibold text-xs text-slate-900 dark:text-white">
                                                {ev.title}
                                            </div>
                                            <div className="text-[11px] text-slate-500">
                                                {ev.venue}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-xs text-slate-700 dark:text-slate-300">
                                            {ev.category?.name || 'General'}
                                        </TableCell>
                                        <TableCell className="text-xs text-slate-700 dark:text-slate-300">
                                            <div>{new Date(ev.starts_on).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                                            {ev.start_time && <div className="text-[10px] text-slate-400">{ev.start_time}</div>}
                                        </TableCell>
                                        <TableCell>
                                            <Link
                                                href={`/admin/events/${ev.id}/registrations`}
                                                className="inline-flex items-center gap-1.5 font-bold text-xs text-indigo-600 hover:underline"
                                            >
                                                <Users className="size-3.5" />
                                                {ev.registrations_count} {ev.capacity ? `/ ${ev.capacity}` : ''}
                                            </Link>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="text-[10px] uppercase">
                                                {ev.visibility.replace('_', ' ')}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                className={`text-[10px] capitalize ${
                                                    ev.status === 'published'
                                                        ? 'bg-emerald-100 text-emerald-800'
                                                        : ev.status === 'draft'
                                                        ? 'bg-slate-100 text-slate-700'
                                                        : 'bg-rose-100 text-rose-800'
                                                }`}
                                            >
                                                {ev.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                {ev.status === 'draft' && (
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => handlePublish(ev.id)}
                                                        className="text-xs text-emerald-600"
                                                        title="Publish Event"
                                                    >
                                                        <CheckCircle2 className="size-4" />
                                                    </Button>
                                                )}
                                                <Link
                                                    href={`/admin/events/${ev.id}/registrations`}
                                                    className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                                                    title="Check-in & Attendee Terminal"
                                                >
                                                    <QrCode className="size-4" />
                                                </Link>
                                                <Link
                                                    href={`/admin/events/${ev.id}/edit`}
                                                    className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                                                    title="Edit Event"
                                                >
                                                    <Edit2 className="size-4" />
                                                </Link>
                                            </div>
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
