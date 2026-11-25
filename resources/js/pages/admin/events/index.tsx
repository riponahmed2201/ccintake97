import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Calendar, CheckCircle2, Edit2, Plus, QrCode, Users } from 'lucide-react';
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

const statusPill = (status: string) => {
    if (status === 'published') return 'border border-emerald-200 bg-emerald-50 text-emerald-700';
    if (status === 'draft') return 'border border-[#E5E7EB] bg-[#F9FAFB] text-[#78829D]';
    return 'border border-rose-200 bg-rose-50 text-rose-700';
};

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
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-[20px] font-bold tracking-tight text-[#071437]">
                            Alumni Events & Reunions
                        </h1>
                        <p className="mt-1 text-[13px] text-[#78829D]">
                            Organize national reunions, cadet college chapters, sports tournaments, and professional seminars.
                        </p>
                    </div>
                    <Link
                        href="/admin/events/create"
                        className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#1B84FF] px-4 text-[13px] font-semibold text-white shadow-xs transition-colors hover:bg-[#1B84FF]/90"
                    >
                        <Plus className="size-4" />
                        Create New Event
                    </Link>
                </div>

                <div className="overflow-hidden rounded-xl border border-[#F1F1F4] bg-white shadow-[0_3px_4px_0_rgba(0,0,0,0.03)]">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-[#FCFCFC]">
                                <TableRow className="border-[#F1F1F4] hover:bg-transparent">
                                    <TableHead className="px-5 py-3.5 text-[11.5px] font-semibold tracking-wide text-[#78829D] uppercase">
                                        Event Title & Venue
                                    </TableHead>
                                    <TableHead className="px-4 py-3.5 text-[11.5px] font-semibold tracking-wide text-[#78829D] uppercase">
                                        Category
                                    </TableHead>
                                    <TableHead className="px-4 py-3.5 text-[11.5px] font-semibold tracking-wide text-[#78829D] uppercase">
                                        Event Dates
                                    </TableHead>
                                    <TableHead className="px-4 py-3.5 text-[11.5px] font-semibold tracking-wide text-[#78829D] uppercase">
                                        Registrations
                                    </TableHead>
                                    <TableHead className="px-4 py-3.5 text-[11.5px] font-semibold tracking-wide text-[#78829D] uppercase">
                                        Visibility
                                    </TableHead>
                                    <TableHead className="px-4 py-3.5 text-[11.5px] font-semibold tracking-wide text-[#78829D] uppercase">
                                        Status
                                    </TableHead>
                                    <TableHead className="px-5 py-3.5 text-right text-[11.5px] font-semibold tracking-wide text-[#78829D] uppercase">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {events.data.length === 0 ? (
                                    <TableRow className="border-[#F1F1F4] hover:bg-transparent">
                                        <TableCell colSpan={7} className="h-32 text-center text-[13px] text-[#78829D]">
                                            No events found. Click "Create New Event" to get started.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    events.data.map((ev) => (
                                        <TableRow
                                            key={ev.id}
                                            className="border-[#F1F1F4] transition-colors hover:bg-[#FCFCFC]"
                                        >
                                            <TableCell className="px-5 py-3.5">
                                                <div className="flex items-start gap-2.5">
                                                    <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#F1F6FF] text-[#1B84FF]">
                                                        <Calendar className="size-4" />
                                                    </div>
                                                    <div>
                                                        <div className="text-[13px] font-semibold text-[#071437]">
                                                            {ev.title}
                                                        </div>
                                                        <div className="text-[11.5px] text-[#78829D]">
                                                            {ev.venue}
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-4 py-3.5 text-[13px] text-[#4B5675]">
                                                {ev.category?.name || 'General'}
                                            </TableCell>
                                            <TableCell className="px-4 py-3.5 text-[13px] text-[#4B5675]">
                                                <div className="font-medium text-[#071437]">
                                                    {new Date(ev.starts_on).toLocaleDateString(undefined, {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric',
                                                    })}
                                                </div>
                                                {ev.start_time && (
                                                    <div className="text-[11px] text-[#99A1B7]">
                                                        {ev.start_time}
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell className="px-4 py-3.5">
                                                <Link
                                                    href={`/admin/events/${ev.id}/registrations`}
                                                    className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#1B84FF] hover:underline"
                                                >
                                                    <Users className="size-3.5" />
                                                    {ev.registrations_count} {ev.capacity ? `/ ${ev.capacity}` : ''}
                                                </Link>
                                            </TableCell>
                                            <TableCell className="px-4 py-3.5">
                                                <span className="inline-flex items-center rounded-md border border-[#E5E7EB] bg-[#FCFCFC] px-2 py-0.5 text-[11px] font-medium text-[#4B5675] uppercase">
                                                    {ev.visibility.replace('_', ' ')}
                                                </span>
                                            </TableCell>
                                            <TableCell className="px-4 py-3.5">
                                                <span
                                                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize ${statusPill(ev.status)}`}
                                                >
                                                    {ev.status}
                                                </span>
                                            </TableCell>
                                            <TableCell className="px-5 py-3.5 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    {ev.status === 'draft' && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handlePublish(ev.id)}
                                                            className="inline-flex size-8 items-center justify-center rounded-lg text-emerald-600 transition-colors hover:bg-emerald-50"
                                                            title="Publish Event"
                                                        >
                                                            <CheckCircle2 className="size-4" />
                                                        </button>
                                                    )}
                                                    <Link
                                                        href={`/admin/events/${ev.id}/registrations`}
                                                        className="inline-flex size-8 items-center justify-center rounded-lg text-[#4B5675] transition-colors hover:bg-[#F1F6FF] hover:text-[#1B84FF]"
                                                        title="Check-in & Attendee Terminal"
                                                    >
                                                        <QrCode className="size-4" />
                                                    </Link>
                                                    <Link
                                                        href={`/admin/events/${ev.id}/edit`}
                                                        className="inline-flex size-8 items-center justify-center rounded-lg text-[#4B5675] transition-colors hover:bg-[#F1F6FF] hover:text-[#1B84FF]"
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
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
