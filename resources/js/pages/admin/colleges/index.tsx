import React, { useRef, useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Edit2, ExternalLink, ImagePlus, Plus, Search, Trash2 } from 'lucide-react';
import type { College } from '@/types';

type CollegeRow = College & { members_count: number };

interface CollegesIndexProps {
    colleges: {
        data: CollegeRow[];
        current_page: number;
        last_page: number;
        per_page?: number;
        from?: number;
        to?: number;
        total: number;
        links: any[];
    };
    filters: {
        search?: string;
        status?: string;
        per_page?: string;
    };
}

const ALL = '__all__';

const selectTriggerClass =
    '!h-10 w-full cursor-pointer rounded-md !border-[#DBDFE9] !bg-[#FCFCFC] px-3 text-[13px] font-normal !text-[#071437] !shadow-none transition-all duration-200 hover:!border-[#C4CADA] hover:!bg-[#FCFCFC] focus-visible:!border-[#1B84FF] focus-visible:!bg-white focus-visible:!ring-[3px] focus-visible:!ring-[#1B84FF]/10 dark:!bg-[#FCFCFC] dark:hover:!bg-[#FCFCFC]';

const selectMenuClass =
    'z-[60] rounded-xl !border-[#F1F1F4] !bg-white p-1 !text-[#071437] shadow-[0_12px_32px_-8px_rgba(7,20,55,0.16)] dark:!bg-white dark:!text-[#071437]';

const selectItemClass =
    'cursor-pointer rounded-lg py-2 pr-8 pl-2.5 text-[13px] text-[#071437] focus:!bg-[#F1F6FF] focus:!text-[#1B84FF] dark:text-[#071437]';

const fieldClass =
    'h-10 w-full rounded-md border !border-[#DBDFE9] !bg-[#FCFCFC] px-3 text-[13px] font-normal !text-[#071437] !shadow-none outline-none transition-all duration-200 placeholder:!text-[#99A1B7] hover:!border-[#C4CADA] focus:!border-[#1B84FF] focus:!bg-white focus:!ring-[3px] focus:!ring-[#1B84FF]/10 dark:!bg-[#FCFCFC] dark:!text-[#071437]';

const textareaClass =
    'w-full rounded-md border !border-[#DBDFE9] !bg-[#FCFCFC] p-3 text-[13px] font-normal !text-[#071437] !shadow-none outline-none transition-all duration-200 placeholder:!text-[#99A1B7] hover:!border-[#C4CADA] focus:!border-[#1B84FF] focus:!bg-white focus:!ring-[3px] focus:!ring-[#1B84FF]/10 dark:!bg-[#FCFCFC] dark:!text-[#071437]';

const labelClass = 'mb-1.5 block text-[12.5px] font-semibold text-[#071437]';

export default function CollegesIndex({ colleges, filters }: CollegesIndexProps) {
    const [search, setSearch] = useState(filters?.search || '');
    const [selectedStatus, setSelectedStatus] = useState(filters?.status || '');
    const [perPage, setPerPage] = useState(filters?.per_page || String(colleges.per_page || 10));

    const [editCollege, setEditCollege] = useState<College | null>(null);
    const [createOpen, setCreateOpen] = useState(false);

    const [formName, setFormName] = useState('');
    const [formShortName, setFormShortName] = useState('');
    const [formWebsite, setFormWebsite] = useState('');
    const [formYear, setFormYear] = useState('');
    const [formLocation, setFormLocation] = useState('');
    const [formDescription, setFormDescription] = useState('');
    const [logoUploading, setLogoUploading] = useState(false);
    const [logoError, setLogoError] = useState<string | null>(null);
    const logoInput = useRef<HTMLInputElement>(null);

    const editing = editCollege ? colleges.data.find((c) => c.id === editCollege.id) ?? editCollege : null;

    const applyFilter = (key: string, val: string) => {
        const query = {
            search,
            status: selectedStatus,
            per_page: perPage,
            [key]: val,
        };
        router.get('/admin/colleges', query, { preserveState: true, replace: true });
    };

    const handleLogoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        e.target.value = '';
        if (!file || !editing) return;
        setLogoError(null);
        setLogoUploading(true);
        router.post(
            `/admin/colleges/${editing.id}/logo`,
            { logo: file },
            {
                forceFormData: true,
                preserveScroll: true,
                onError: (errs) => setLogoError(errs.logo || 'Upload failed.'),
                onFinish: () => setLogoUploading(false),
            },
        );
    };

    const handleLogoRemove = () => {
        if (!editing) return;
        router.delete(`/admin/colleges/${editing.id}/logo`, { preserveScroll: true });
    };

    const openEdit = (c: College) => {
        setEditCollege(c);
        setLogoError(null);
        setFormName(c.name);
        setFormShortName(c.short_name || '');
        setFormWebsite(c.website || '');
        setFormYear(c.established_year ? String(c.established_year) : '');
        setFormLocation(c.location || '');
        setFormDescription(c.description || '');
    };

    const resetForm = () => {
        setFormName('');
        setFormShortName('');
        setFormWebsite('');
        setFormYear('');
        setFormLocation('');
        setFormDescription('');
    };

    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(
            '/admin/colleges',
            {
                name: formName,
                short_name: formShortName,
                website: formWebsite,
                established_year: formYear ? parseInt(formYear) : null,
                location: formLocation,
                description: formDescription,
            },
            {
                onSuccess: () => {
                    setCreateOpen(false);
                    resetForm();
                },
            },
        );
    };

    const handleUpdateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editCollege) return;
        router.put(
            `/admin/colleges/${editCollege.id}`,
            {
                name: formName,
                short_name: formShortName,
                website: formWebsite,
                established_year: formYear ? parseInt(formYear) : null,
                location: formLocation,
                description: formDescription,
            },
            {
                onSuccess: () => {
                    setEditCollege(null);
                    resetForm();
                },
            },
        );
    };

    const handleToggle = (id: number) => {
        router.post(`/admin/colleges/${id}/toggle`);
    };

    return (
        <AdminLayout
            title="Cadet College Network Management"
            breadcrumbs={[{ title: 'Cadet Colleges' }]}
        >
            <Head title="Cadet College Network - INTAKE 97 Admin" />

            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-[20px] font-bold tracking-tight text-[#071437]">
                            Participating Cadet Colleges Network
                        </h1>
                        <p className="mt-1 text-[13px] text-[#78829D]">
                            Showing {colleges.from || 0} to {colleges.to || 0} of {colleges.total} Cadet Colleges represented in the 1997 intake association.
                        </p>
                    </div>
                    <Button
                        onClick={() => {
                            resetForm();
                            setCreateOpen(true);
                        }}
                        className="h-10 cursor-pointer rounded-lg bg-[#1B84FF] px-4 text-[13px] font-semibold text-white hover:bg-[#1B84FF]/90"
                    >
                        <Plus className="mr-1.5 size-4" />
                        Add Cadet College
                    </Button>
                </div>

                {/* Filter Toolbar */}
                <div className="rounded-xl border border-[#F1F1F4] bg-white p-4 shadow-[0_3px_4px_0_rgba(0,0,0,0.03)]">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                applyFilter('search', search);
                            }}
                            className="relative sm:col-span-2"
                        >
                            <Search className="absolute top-3 left-3 size-4 text-[#99A1B7]" />
                            <Input
                                placeholder="Search by college name, short code, or location..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className={`${fieldClass} pl-9`}
                            />
                        </form>
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
                                <SelectItem value="participating" className={selectItemClass}>Participating</SelectItem>
                                <SelectItem value="inactive" className={selectItemClass}>Inactive</SelectItem>
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
                                        College Name
                                    </TableHead>
                                    <TableHead className="px-4 py-3.5 text-[11.5px] font-semibold tracking-wide text-[#78829D] uppercase">
                                        Short Code
                                    </TableHead>
                                    <TableHead className="px-4 py-3.5 text-[11.5px] font-semibold tracking-wide text-[#78829D] uppercase">
                                        Location
                                    </TableHead>
                                    <TableHead className="px-4 py-3.5 text-[11.5px] font-semibold tracking-wide text-[#78829D] uppercase">
                                        Established
                                    </TableHead>
                                    <TableHead className="px-4 py-3.5 text-[11.5px] font-semibold tracking-wide text-[#78829D] uppercase">
                                        1997 Alumni
                                    </TableHead>
                                    <TableHead className="px-4 py-3.5 text-[11.5px] font-semibold tracking-wide text-[#78829D] uppercase">
                                        Participation Status
                                    </TableHead>
                                    <TableHead className="px-5 py-3.5 text-right text-[11.5px] font-semibold tracking-wide text-[#78829D] uppercase">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {colleges.data.length === 0 ? (
                                    <TableRow className="hover:bg-transparent">
                                        <TableCell colSpan={8} className="h-28 text-center text-[13px] text-[#99A1B7]">
                                            No cadet colleges match your query.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    colleges.data.map((c, idx) => (
                                        <TableRow
                                            key={c.id}
                                            className="border-[#F1F1F4] transition-colors hover:bg-[#FCFCFC]"
                                        >
                                            <TableCell className="px-5 py-3.5 text-[12.5px] font-medium text-[#78829D] tabular-nums">
                                                {(colleges.from || 1) + idx}
                                            </TableCell>
                                            <TableCell className="px-5 py-3.5">
                                            <div className="flex items-center gap-3">
                                                <span className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-amber-300/70 bg-white">
                                                    {c.logo_url ? (
                                                        <img
                                                            src={c.logo_url}
                                                            alt=""
                                                            className="size-full object-contain p-0.5"
                                                        />
                                                    ) : (
                                                        <span className="text-[10px] font-bold text-[#99A1B7]">
                                                            {c.short_name || '—'}
                                                        </span>
                                                    )}
                                                </span>
                                                <div>
                                                    <div className="text-[13px] font-semibold text-[#071437]">
                                                        {c.name}
                                                    </div>
                                                    {c.website && (
                                                        <a
                                                            href={c.website}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="mt-0.5 inline-flex items-center gap-1 text-[11.5px] text-[#1B84FF] hover:underline"
                                                        >
                                                            {c.website.replace('https://', '')}{' '}
                                                            <ExternalLink className="size-3" />
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-4 py-3.5 font-mono text-[12.5px] font-semibold text-[#071437]">
                                            {c.short_name || '—'}
                                        </TableCell>
                                        <TableCell className="px-4 py-3.5 text-[13px] text-[#4B5675]">
                                            {c.location || '—'}
                                        </TableCell>
                                        <TableCell className="px-4 py-3.5 text-[13px] text-[#4B5675]">
                                            {c.established_year || '—'}
                                        </TableCell>
                                        <TableCell className="px-4 py-3.5 text-[13px] font-bold text-[#071437]">
                                            {c.members_count} members
                                        </TableCell>
                                        <TableCell className="px-4 py-3.5">
                                            <button
                                                type="button"
                                                onClick={() => handleToggle(c.id)}
                                                title="Click to toggle participating status"
                                                className={`inline-flex cursor-pointer items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold transition-colors ${
                                                    c.is_participating
                                                        ? 'border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                                        : 'border border-[#E5E7EB] bg-[#F9FAFB] text-[#78829D] hover:bg-[#F1F1F4]'
                                                }`}
                                            >
                                                {c.is_participating ? 'Participating' : 'Inactive'}
                                            </button>
                                        </TableCell>
                                        <TableCell className="px-5 py-3.5 text-right">
                                            <button
                                                type="button"
                                                onClick={() => openEdit(c)}
                                                className="inline-flex size-8 cursor-pointer items-center justify-center rounded-lg text-[#4B5675] transition-colors hover:bg-[#F1F6FF] hover:text-[#1B84FF]"
                                                title="Edit College"
                                            >
                                                <Edit2 className="size-4" />
                                            </button>
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
                                Showing <strong className="font-semibold text-[#071437]">{colleges.from || 0}</strong>–
                                <strong className="font-semibold text-[#071437]">{colleges.to || 0}</strong> of{' '}
                                <strong className="font-semibold text-[#071437]">{colleges.total}</strong> · Page {colleges.current_page} of {colleges.last_page}
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
                            {colleges.links.map((link, idx) => (
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

            {/* Create Dialog */}
            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                <DialogContent className="rounded-2xl border-[#F1F1F4] !bg-white p-0 !text-[#071437] shadow-[0_20px_50px_-12px_rgba(7,20,55,0.18)] sm:max-w-lg">
                    <DialogHeader className="border-b border-[#F1F1F4] px-6 py-5">
                        <DialogTitle className="text-[16px] font-bold text-[#071437]">
                            Add Cadet College
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCreateSubmit} className="space-y-4 px-6 py-5">
                        <div>
                            <label className={labelClass}>College Name *</label>
                            <input
                                required
                                className={fieldClass}
                                value={formName}
                                onChange={(e) => setFormName(e.target.value)}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className={labelClass}>Short Name / Code</label>
                                <input
                                    className={fieldClass}
                                    placeholder="e.g. FCC, MCC"
                                    value={formShortName}
                                    onChange={(e) => setFormShortName(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Established Year</label>
                                <input
                                    type="number"
                                    className={fieldClass}
                                    placeholder="1958"
                                    value={formYear}
                                    onChange={(e) => setFormYear(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className={labelClass}>Campus Location</label>
                                <input
                                    className={fieldClass}
                                    placeholder="City, Division"
                                    value={formLocation}
                                    onChange={(e) => setFormLocation(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Official Website</label>
                                <input
                                    className={fieldClass}
                                    placeholder="https://..."
                                    value={formWebsite}
                                    onChange={(e) => setFormWebsite(e.target.value)}
                                />
                            </div>
                        </div>
                        <div>
                            <label className={labelClass}>Description</label>
                            <textarea
                                rows={2}
                                className={textareaClass}
                                value={formDescription}
                                onChange={(e) => setFormDescription(e.target.value)}
                            />
                        </div>
                        <DialogFooter className="border-t border-[#F1F1F4] pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setCreateOpen(false)}
                                className="h-9 rounded-lg border-[#DBDFE9] bg-white px-4 text-[13px] font-semibold text-[#4B5675] hover:bg-[#FCFCFC]"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="h-9 rounded-lg bg-[#1B84FF] px-4 text-[13px] font-semibold text-white hover:bg-[#1B84FF]/90"
                            >
                                Save College
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={!!editCollege} onOpenChange={(open) => !open && setEditCollege(null)}>
                <DialogContent className="rounded-2xl border-[#F1F1F4] !bg-white p-0 !text-[#071437] shadow-[0_20px_50px_-12px_rgba(7,20,55,0.18)] sm:max-w-lg">
                    <DialogHeader className="border-b border-[#F1F1F4] px-6 py-5">
                        <DialogTitle className="text-[16px] font-bold text-[#071437]">
                            Edit College Details
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 px-6 py-5">
                        <div className="flex items-center gap-4 rounded-xl border border-dashed border-[#DBDFE9] bg-[#FCFCFC] p-3.5">
                            <span className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-amber-300/70 bg-white">
                                {editing?.logo_url ? (
                                    <img
                                        src={editing.logo_url}
                                        alt=""
                                        className="size-full object-contain p-1"
                                    />
                                ) : (
                                    <span className="text-[12px] font-bold text-[#99A1B7]">
                                        {editing?.short_name || 'Logo'}
                                    </span>
                                )}
                            </span>
                            <div className="flex-1 space-y-1.5">
                                <div className="text-[13px] font-semibold text-[#071437]">
                                    College logo / crest
                                </div>
                                <div className="text-[11.5px] text-[#78829D]">
                                    PNG, JPG or WebP · max 2 MB · square, transparent background works best
                                </div>
                                <div className="flex gap-2 pt-0.5">
                                    <input
                                        ref={logoInput}
                                        type="file"
                                        accept="image/png,image/jpeg,image/webp"
                                        className="hidden"
                                        onChange={handleLogoSelect}
                                    />
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="outline"
                                        className="h-8 rounded-lg border-[#DBDFE9] bg-white px-3 text-[12px] font-semibold text-[#4B5675] hover:bg-[#FCFCFC]"
                                        disabled={logoUploading}
                                        onClick={() => logoInput.current?.click()}
                                    >
                                        <ImagePlus className="mr-1.5 size-3.5" />
                                        {logoUploading ? 'Uploading…' : editing?.logo_url ? 'Replace' : 'Upload'}
                                    </Button>
                                    {editing?.logo_url && (
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="ghost"
                                            className="h-8 rounded-lg px-3 text-[12px] font-semibold text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                                            onClick={handleLogoRemove}
                                        >
                                            <Trash2 className="mr-1.5 size-3.5" /> Remove
                                        </Button>
                                    )}
                                </div>
                                {logoError && <div className="text-[11.5px] text-rose-600">{logoError}</div>}
                            </div>
                        </div>

                        <form onSubmit={handleUpdateSubmit} className="space-y-4">
                            <div>
                                <label className={labelClass}>College Name *</label>
                                <input
                                    required
                                    className={fieldClass}
                                    value={formName}
                                    onChange={(e) => setFormName(e.target.value)}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className={labelClass}>Short Name / Code</label>
                                    <input
                                        className={fieldClass}
                                        value={formShortName}
                                        onChange={(e) => setFormShortName(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className={labelClass}>Established Year</label>
                                    <input
                                        type="number"
                                        className={fieldClass}
                                        value={formYear}
                                        onChange={(e) => setFormYear(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className={labelClass}>Campus Location</label>
                                    <input
                                        className={fieldClass}
                                        value={formLocation}
                                        onChange={(e) => setFormLocation(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className={labelClass}>Official Website</label>
                                    <input
                                        className={fieldClass}
                                        value={formWebsite}
                                        onChange={(e) => setFormWebsite(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className={labelClass}>Description</label>
                                <textarea
                                    rows={2}
                                    className={textareaClass}
                                    value={formDescription}
                                    onChange={(e) => setFormDescription(e.target.value)}
                                />
                            </div>
                            <DialogFooter className="border-t border-[#F1F1F4] pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setEditCollege(null)}
                                    className="h-9 rounded-lg border-[#DBDFE9] bg-white px-4 text-[13px] font-semibold text-[#4B5675] hover:bg-[#FCFCFC]"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="h-9 rounded-lg bg-[#1B84FF] px-4 text-[13px] font-semibold text-white hover:bg-[#1B84FF]/90"
                                >
                                    Update College
                                </Button>
                            </DialogFooter>
                        </form>
                    </div>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}
