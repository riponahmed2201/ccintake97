import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Calendar, CheckCircle2, Edit2, MoreHorizontal, Plus, QrCode, Search, Users } from 'lucide-react';
import type { Event, EventCategory } from '@/types';

interface EventsIndexProps {
    events: {
        data: (Event & { registrations_count: number })[];
        current_page: number;
        last_page: number;
        per_page?: number;
        from?: number;
        to?: number;
        total: number;
        links: any[];
    };
    categories?: EventCategory[];
    filters?: {
        search?: string;
        status?: string;
        category_id?: string;
        per_page?: string;
    };
}

const ALL = '__all__';

const fieldClass =
    'h-10 w-full rounded-md border !border-[#DBDFE9] !bg-[#FCFCFC] px-3 text-[13px] font-normal !text-[#071437] !shadow-none outline-none transition-all duration-200 placeholder:!text-[#99A1B7] hover:!border-[#C4CADA] focus:!border-[#1B84FF] focus:!bg-white focus:!ring-[3px] focus:!ring-[#1B84FF]/10 dark:!bg-[#FCFCFC] dark:!text-[#071437]';

const selectTriggerClass =
    '!h-10 w-full cursor-pointer rounded-md !border-[#DBDFE9] !bg-[#FCFCFC] px-3 text-[13px] font-normal !text-[#071437] !shadow-none transition-all duration-200 hover:!border-[#C4CADA] hover:!bg-[#FCFCFC] focus-visible:!border-[#1B84FF] focus-visible:!bg-white focus-visible:!ring-[3px] focus-visible:!ring-[#1B84FF]/10 dark:!bg-[#FCFCFC] dark:hover:!bg-[#FCFCFC]';

const selectMenuClass =
    'z-[60] rounded-xl !border-[#F1F1F4] !bg-white p-1 !text-[#071437] shadow-[0_12px_32px_-8px_rgba(7,20,55,0.16)] dark:!bg-white dark:!text-[#071437]';

const selectItemClass =
    'cursor-pointer rounded-lg py-2 pr-8 pl-2.5 text-[13px] text-[#071437] focus:!bg-[#F1F6FF] focus:!text-[#1B84FF] dark:text-[#071437]';

const statusPill = (status: string) => {
    if (status === 'published') return 'border border-emerald-200 bg-emerald-50 text-emerald-700';
    if (status === 'draft') return 'border border-[#E5E7EB] bg-[#F9FAFB] text-[#78829D]';
    return 'border border-rose-200 bg-rose-50 text-rose-700';
};

export default function EventsIndex({ events, categories = [], filters }: EventsIndexProps) {
    const [search, setSearch] = useState(filters?.search || '');
    const [selectedStatus, setSelectedStatus] = useState(filters?.status || '');
    const [selectedCategory, setSelectedCategory] = useState(filters?.category_id || '');
    const [perPage, setPerPage] = useState(filters?.per_page || String(events.per_page || 10));

    const applyFilter = (key: string, val: string) => {
        const query = {
            search,
            status: selectedStatus,
            category_id: selectedCategory,
            per_page: perPage,
            [key]: val,
        };
        router.get('/admin/events', query, { preserveState: true, replace: true });
    };

    const handlePublish = (id: number) => {
        router.post(`/admin/events/${id}/publish`, {}, { preserveScroll: true });
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

                {/* Filter Toolbar */}
                <div className="rounded-xl border border-[#F1F1F4] bg-white p-4 shadow-[0_3px_4px_0_rgba(0,0,0,0.03)]">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                applyFilter('search', search);
                            }}
                            className="relative sm:col-span-2"
                        >
                            <Search className="absolute top-3 left-3 size-4 text-[#99A1B7]" />
                            <Input
                                placeholder="Search by event title or venue..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className={`${fieldClass} pl-9`}
                            />
                        </form>
                        <Select
                            value={selectedCategory || ALL}
                            onValueChange={(val) => {
                                const next = val === ALL ? '' : val;
                                setSelectedCategory(next);
                                applyFilter('category_id', next);
                            }}
                        >
                            <SelectTrigger className={selectTriggerClass}>
                                <SelectValue placeholder="All Categories" />
                            </SelectTrigger>
                            <SelectContent className={selectMenuClass}>
                                <SelectItem value={ALL} className={selectItemClass}>All Categories</SelectItem>
                                {categories.map((cat) => (
                                    <SelectItem key={cat.id} value={String(cat.id)} className={selectItemClass}>
                                        {cat.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select
                            value={selectedStatus || ALL}
                            onValueChange={(val) => {
                                const next = val === ALL ? '' : val;
                                setSelectedStatus(next);
                                applyFilter('status', next);
                            }}
                        >
                            <SelectTrigger className={selectTriggerClass}>
                                <SelectValue placeholder="All Statuses" />
                            </SelectTrigger>
                            <SelectContent className={selectMenuClass}>
                                <SelectItem value={ALL} className={selectItemClass}>All Statuses</SelectItem>
                                <SelectItem value="published" className={selectItemClass}>Published</SelectItem>
                                <SelectItem value="draft" className={selectItemClass}>Draft</SelectItem>
                                <SelectItem value="cancelled" className={selectItemClass}>Cancelled</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="overflow-hidden rounded-xl border border-[#F1F1F4] bg-white shadow-[0_3px_4px_0_rgba(0,0,0,0.03)]">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-[#FCFCFC]">
                                <TableRow className="border-[#F1F1F4] hover:bg-transparent">
                                    <TableHead className="w-14 px-5 py-3.5 text-[11.5px] font-semibold tracking-wide text-[#78829D] uppercase">
                                        SL
                                    </TableHead>
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
                                        <TableCell colSpan={8} className="h-32 text-center text-[13px] text-[#78829D]">
                                            No events found. Click "Create New Event" to get started.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    events.data.map((ev, idx) => (
                                        <TableRow
                                            key={ev.id}
                                            className="border-[#F1F1F4] transition-colors hover:bg-[#FCFCFC]"
                                        >
                                            <TableCell className="px-5 py-3.5 text-[12.5px] font-medium text-[#78829D] tabular-nums">
                                                {(events.from || 1) + idx}
                                            </TableCell>
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
                                                <div className="flex justify-end">
                                                    <DropdownMenu modal={false}>
                                                        <DropdownMenuTrigger asChild>
                                                            <button
                                                                type="button"
                                                                className="inline-flex size-8 cursor-pointer items-center justify-center rounded-lg border border-transparent text-[#78829D] transition-colors hover:border-[#DBDFE9] hover:bg-[#F9F9F9] hover:text-[#071437]"
                                                                aria-label="Event actions"
                                                            >
                                                                <MoreHorizontal className="size-4" />
                                                            </button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-52 rounded-xl border-[#F1F1F4] !bg-white p-1.5 !text-[#071437] shadow-[0_12px_32px_-8px_rgba(7,20,55,0.16)]">
                                                            {ev.status === 'draft' && (
                                                                <DropdownMenuItem
                                                                    onSelect={() => handlePublish(ev.id)}
                                                                    className="cursor-pointer rounded-lg px-2.5 py-2 text-[13px] font-medium text-[#17C653] focus:!bg-[#EAFFF1] focus:!text-[#17C653]"
                                                                >
                                                                    <CheckCircle2 className="size-4 text-[#17C653]" />
                                                                    Publish Event
                                                                </DropdownMenuItem>
                                                            )}
                                                            <DropdownMenuItem asChild className="cursor-pointer rounded-lg px-2.5 py-2 text-[13px] font-medium text-[#071437] focus:!bg-[#F1F6FF] focus:!text-[#1B84FF]">
                                                                <Link href={`/admin/events/${ev.id}/registrations`}>
                                                                    <QrCode className="size-4 text-[#78829D]" />
                                                                    Check-in &amp; Attendees
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem asChild className="cursor-pointer rounded-lg px-2.5 py-2 text-[13px] font-medium text-[#071437] focus:!bg-[#F1F6FF] focus:!text-[#1B84FF]">
                                                                <Link href={`/admin/events/${ev.id}/edit`}>
                                                                    <Edit2 className="size-4 text-[#78829D]" />
                                                                    Edit Event
                                                                </Link>
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    <div className="flex flex-col items-center justify-between gap-3 border-t border-[#F1F1F4] px-5 py-3.5 text-[12.5px] text-[#78829D] sm:flex-row">
                        <div className="flex flex-wrap items-center gap-3">
                            <span>
                                Showing <strong className="font-semibold text-[#071437]">{events.from || 0}</strong>–
                                <strong className="font-semibold text-[#071437]">{events.to || 0}</strong> of{' '}
                                <strong className="font-semibold text-[#071437]">{events.total}</strong> · Page {events.current_page} of {events.last_page}
                            </span>
                            <div className="flex items-center gap-1.5">
                                <span className="text-[12px] text-[#78829D]">Rows:</span>
                                <Select
                                    value={perPage}
                                    onValueChange={(val) => {
                                        setPerPage(val);
                                        applyFilter('per_page', val);
                                    }}
                                >
                                    <SelectTrigger className="!h-8 w-[72px] cursor-pointer rounded-md !border-[#DBDFE9] !bg-[#FCFCFC] px-2.5 text-[12px] font-medium !text-[#071437] !shadow-none">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className={selectMenuClass}>
                                        {['10', '25', '50', '100'].map((size) => (
                                            <SelectItem key={size} value={size} className={selectItemClass}>
                                                {size}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5">
                            {events.links.map((link, idx) => (
                                <Link
                                    key={idx}
                                    href={link.url || '#'}
                                    preserveScroll
                                    disabled={!link.url}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`rounded-lg px-2.5 py-1 text-[12px] font-medium transition-colors ${
                                        link.active
                                            ? 'bg-[#1B84FF] font-semibold text-white'
                                            : link.url
                                              ? 'text-[#4B5675] hover:bg-[#F1F6FF] hover:text-[#1B84FF]'
                                              : 'pointer-events-none text-[#DBDFE9]'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
