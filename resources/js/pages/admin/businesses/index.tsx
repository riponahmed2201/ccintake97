import React, { useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import AdminLayout from '@/layouts/admin-layout';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
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
import { Briefcase, CheckCircle2, ExternalLink, ImagePlus, MoreHorizontal, Plus, Search, Star, XCircle } from 'lucide-react';
import type { Business } from '@/types';

interface BusinessesIndexProps {
    businesses: {
        data: Business[];
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
    categories?: { id: number; name: string }[];
    industries?: { id: number; name: string }[];
    owners?: { id: number; name: string; college?: string | null }[];
}

function FormField({ label, error, required, children, className = '' }: { label: string; error?: string; required?: boolean; children: React.ReactNode; className?: string }) {
    return (
        <label className={`block ${className}`}>
            <span className="mb-1.5 block text-[12.5px] font-semibold text-[#071437]">
                {label}
                {required && <span className="ml-0.5 text-[#F8285A]">*</span>}
            </span>
            {children}
            {error && <span className="mt-1 block text-[12px] text-[#F8285A]">{error}</span>}
        </label>
    );
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
    if (status === 'approved') return 'border border-emerald-200 bg-emerald-50 text-emerald-700';
    if (status === 'pending') return 'border border-amber-200 bg-amber-50 text-amber-700';
    return 'border border-rose-200 bg-rose-50 text-rose-700';
};

export default function BusinessesIndex({ businesses, filters, categories = [], industries = [], owners = [] }: BusinessesIndexProps) {
    const [addOpen, setAddOpen] = useState(false);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const form = useForm({
        owner_member_id: '',
        name: '',
        category_id: '',
        industry_id: '',
        description: '',
        website: '',
        email: '',
        phone: '',
        city: '',
        country_code: 'BD',
        status: 'approved',
        logo: null as File | null,
    });
    const closeAdd = () => {
        setAddOpen(false);
        form.reset();
        form.clearErrors();
        setLogoPreview(null);
    };
    const submitAdd = (e: React.FormEvent) => {
        e.preventDefault();
        form.post('/admin/businesses', { forceFormData: true, preserveScroll: true, onSuccess: closeAdd });
    };
    const ferr = form.errors as Record<string, string | undefined>;

    const [search, setSearch] = useState(filters?.search || '');
    const [selectedStatus, setSelectedStatus] = useState(filters?.status || '');
    const [perPage, setPerPage] = useState(filters?.per_page || String(businesses.per_page || 10));

    const applyFilter = (key: string, val: string) => {
        const query = {
            search,
            status: selectedStatus,
            per_page: perPage,
            [key]: val,
        };
        router.get('/admin/businesses', query, { preserveState: true, replace: true });
    };

    const handleVerify = (id: number) => {
        router.post(`/admin/businesses/${id}/verify`, {}, { preserveScroll: true });
    };

    const handleReject = (id: number) => {
        router.post(`/admin/businesses/${id}/reject`, {}, { preserveScroll: true });
    };

    const handleToggleFeatured = (id: number) => {
        router.post(`/admin/businesses/${id}/feature`, {}, { preserveScroll: true });
    };

    return (
        <AdminLayout
            title="Business Directory Management"
            breadcrumbs={[{ title: 'Business Directory' }]}
        >
            <Head title="Business Directory - CCINTAKE 97 Admin" />

            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="text-[20px] font-bold tracking-tight text-[#071437]">
                            Alumni Commercial Business Directory
                        </h1>
                        <p className="mt-1 text-[13px] text-[#78829D]">
                            Review and verify member business listings to foster mutual commercial engagement.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setAddOpen(true)}
                        className="inline-flex h-10 shrink-0 cursor-pointer items-center gap-1.5 self-start rounded-lg bg-[#1B84FF] px-4 text-[13px] font-semibold text-white shadow-[0_6px_16px_-6px_rgba(27,132,255,0.6)] transition-colors hover:bg-[#006AE6] sm:self-auto"
                    >
                        <Plus className="size-4" /> Add Business
                    </button>
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
                                placeholder="Search by business name, owner, or city..."
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
                                <SelectItem value="approved" className={selectItemClass}>Approved</SelectItem>
                                <SelectItem value="pending" className={selectItemClass}>Pending</SelectItem>
                                <SelectItem value="rejected" className={selectItemClass}>Rejected</SelectItem>
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
                                        Business Name
                                    </TableHead>
                                    <TableHead className="px-4 py-3.5 text-[11.5px] font-semibold tracking-wide text-[#78829D] uppercase">
                                        Alumni Owner
                                    </TableHead>
                                    <TableHead className="px-4 py-3.5 text-[11.5px] font-semibold tracking-wide text-[#78829D] uppercase">
                                        Industry & Category
                                    </TableHead>
                                    <TableHead className="px-4 py-3.5 text-[11.5px] font-semibold tracking-wide text-[#78829D] uppercase">
                                        Location
                                    </TableHead>
                                    <TableHead className="px-4 py-3.5 text-[11.5px] font-semibold tracking-wide text-[#78829D] uppercase">
                                        Status
                                    </TableHead>
                                    <TableHead className="px-4 py-3.5 text-[11.5px] font-semibold tracking-wide text-[#78829D] uppercase">
                                        Featured
                                    </TableHead>
                                    <TableHead className="px-5 py-3.5 text-right text-[11.5px] font-semibold tracking-wide text-[#78829D] uppercase">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {businesses.data.length === 0 ? (
                                    <TableRow className="border-[#F1F1F4] hover:bg-transparent">
                                        <TableCell colSpan={8} className="h-32 text-center text-[13px] text-[#78829D]">
                                            No businesses found in directory.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    businesses.data.map((b, idx) => (
                                        <TableRow
                                            key={b.id}
                                            className="border-[#F1F1F4] transition-colors hover:bg-[#FCFCFC]"
                                        >
                                            <TableCell className="px-5 py-3.5 text-[12.5px] font-medium text-[#78829D] tabular-nums">
                                                {(businesses.from || 1) + idx}
                                            </TableCell>
                                            <TableCell className="px-5 py-3.5">
                                                <div className="flex items-start gap-2.5">
                                                    <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#F1F6FF] text-[#1B84FF]">
                                                        <Briefcase className="size-4" />
                                                    </div>
                                                    <div>
                                                        <div className="text-[13px] font-semibold text-[#071437]">
                                                            {b.name}
                                                        </div>
                                                        {b.website && (
                                                            <a
                                                                href={b.website}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="mt-0.5 inline-flex items-center gap-1 text-[11.5px] text-[#1B84FF] hover:underline"
                                                            >
                                                                {b.website.replace('https://', '')}{' '}
                                                                <ExternalLink className="size-3" />
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-4 py-3.5">
                                                <div className="text-[13px] font-medium text-[#071437]">
                                                    {b.owner?.user?.name}
                                                </div>
                                                <div className="text-[11px] text-[#78829D]">
                                                    {b.owner?.college?.short_name || b.owner?.college?.name}
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-4 py-3.5 text-[13px] text-[#4B5675]">
                                                <div>{b.industry?.name}</div>
                                                <div className="text-[11px] text-[#99A1B7]">{b.category?.name}</div>
                                            </TableCell>
                                            <TableCell className="px-4 py-3.5 text-[13px] text-[#4B5675]">
                                                {b.city ? `${b.city}, ${b.country_code}` : b.country_code}
                                            </TableCell>
                                            <TableCell className="px-4 py-3.5">
                                                <span
                                                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize ${statusPill(b.status)}`}
                                                >
                                                    {b.status}
                                                </span>
                                            </TableCell>
                                            <TableCell className="px-4 py-3.5">
                                                <button
                                                    type="button"
                                                    onClick={() => handleToggleFeatured(b.id)}
                                                    className={`inline-flex cursor-pointer items-center gap-1 rounded-lg px-2.5 py-1 text-[12px] font-semibold transition-colors ${
                                                        b.is_featured
                                                            ? 'bg-amber-50 text-amber-600'
                                                            : 'text-[#99A1B7] hover:bg-[#FCFCFC] hover:text-amber-500'
                                                    }`}
                                                >
                                                    <Star className="size-3.5 fill-current" />
                                                    {b.is_featured ? 'Featured' : 'Standard'}
                                                </button>
                                            </TableCell>
                                            <TableCell className="px-5 py-3.5 text-right">
                                                <div className="flex justify-end">
                                                    <DropdownMenu modal={false}>
                                                        <DropdownMenuTrigger asChild>
                                                            <button
                                                                type="button"
                                                                className="inline-flex size-8 cursor-pointer items-center justify-center rounded-lg border border-transparent text-[#78829D] transition-colors hover:border-[#DBDFE9] hover:bg-[#F9F9F9] hover:text-[#071437]"
                                                                aria-label="Business actions"
                                                            >
                                                                <MoreHorizontal className="size-4" />
                                                            </button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-48 rounded-xl border-[#F1F1F4] !bg-white p-1.5 !text-[#071437] shadow-[0_12px_32px_-8px_rgba(7,20,55,0.16)]">
                                                            <DropdownMenuItem
                                                                onSelect={() => handleToggleFeatured(b.id)}
                                                                className="cursor-pointer rounded-lg px-2.5 py-2 text-[13px] font-medium text-[#071437] focus:!bg-[#F1F6FF] focus:!text-[#1B84FF]"
                                                            >
                                                                <Star className="size-4 text-amber-500" />
                                                                {b.is_featured ? 'Unfeature' : 'Mark Featured'}
                                                            </DropdownMenuItem>
                                                            {b.status !== 'approved' && (
                                                                <DropdownMenuItem
                                                                    onSelect={() => handleVerify(b.id)}
                                                                    className="cursor-pointer rounded-lg px-2.5 py-2 text-[13px] font-medium text-[#17C653] focus:!bg-[#EAFFF1] focus:!text-[#17C653]"
                                                                >
                                                                    <CheckCircle2 className="size-4 text-[#17C653]" />
                                                                    Approve Business
                                                                </DropdownMenuItem>
                                                            )}
                                                            {b.status !== 'rejected' && (
                                                                <>
                                                                    <DropdownMenuSeparator className="my-1 bg-[#F1F1F4]" />
                                                                    <DropdownMenuItem
                                                                        onSelect={() => handleReject(b.id)}
                                                                        className="cursor-pointer rounded-lg px-2.5 py-2 text-[13px] font-medium text-[#F8285A] focus:!bg-[#FFEEF3] focus:!text-[#F8285A]"
                                                                    >
                                                                        <XCircle className="size-4 text-[#F8285A]" />
                                                                        Reject Business
                                                                    </DropdownMenuItem>
                                                                </>
                                                            )}
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
                                Showing <strong className="font-semibold text-[#071437]">{businesses.from || 0}</strong>–
                                <strong className="font-semibold text-[#071437]">{businesses.to || 0}</strong> of{' '}
                                <strong className="font-semibold text-[#071437]">{businesses.total}</strong> · Page {businesses.current_page} of {businesses.last_page}
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
                            {businesses.links.map((link, idx) => (
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
            <Dialog open={addOpen} onOpenChange={(open) => (open ? setAddOpen(true) : closeAdd())}>
                <DialogContent className="max-h-[90vh] overflow-y-auto !bg-white !text-[#071437] sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-[17px] font-bold text-[#071437]">Add Business</DialogTitle>
                        <DialogDescription className="text-[13px] text-[#78829D]">
                            List a business on behalf of an alumni member.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submitAdd} className="space-y-4">
                        <div className="flex items-center gap-4 rounded-xl border border-dashed border-[#DBDFE9] p-3">
                            <span className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#F1F6FF]">
                                {logoPreview ? <img src={logoPreview} alt="" className="size-full object-contain p-1" /> : <Briefcase className="size-6 text-[#1B84FF]" />}
                            </span>
                            <div className="text-[12.5px]">
                                <div className="font-semibold text-[#071437]">Business logo</div>
                                <div className="text-[#78829D]">PNG, JPG or WebP · max 2 MB · optional</div>
                                <label className="mt-1.5 inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-[#DBDFE9] px-3 py-1.5 text-[12px] font-semibold text-[#071437] hover:bg-[#F9F9F9]">
                                    <ImagePlus className="size-3.5" /> {logoPreview ? 'Change' : 'Upload'}
                                    <input
                                        type="file"
                                        accept="image/png,image/jpeg,image/webp"
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0] ?? null;
                                            form.setData('logo', file);
                                            setLogoPreview(file ? URL.createObjectURL(file) : null);
                                        }}
                                    />
                                </label>
                                {ferr.logo && <div className="mt-1 text-[#F8285A]">{ferr.logo}</div>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <FormField label="Business name" required error={ferr.name} className="sm:col-span-2">
                                <Input value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} placeholder="Enter business name" className={fieldClass} />
                            </FormField>
                            <FormField label="Alumni owner" required error={ferr.owner_member_id} className="sm:col-span-2">
                                <Select value={form.data.owner_member_id} onValueChange={(v) => form.setData('owner_member_id', v)}>
                                    <SelectTrigger className={selectTriggerClass}>
                                        <SelectValue placeholder="Select member" />
                                    </SelectTrigger>
                                    <SelectContent className={selectMenuClass}>
                                        {owners.map((o) => (
                                            <SelectItem key={o.id} value={String(o.id)} className={selectItemClass}>
                                                {o.name}{o.college ? ` · ${o.college}` : ''}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormField>
                            <FormField label="Category" required error={ferr.category_id}>
                                <Select value={form.data.category_id} onValueChange={(v) => form.setData('category_id', v)}>
                                    <SelectTrigger className={selectTriggerClass}>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent className={selectMenuClass}>
                                        {categories.map((c) => (
                                            <SelectItem key={c.id} value={String(c.id)} className={selectItemClass}>{c.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormField>
                            <FormField label="Industry" required error={ferr.industry_id}>
                                <Select value={form.data.industry_id} onValueChange={(v) => form.setData('industry_id', v)}>
                                    <SelectTrigger className={selectTriggerClass}>
                                        <SelectValue placeholder="Select industry" />
                                    </SelectTrigger>
                                    <SelectContent className={selectMenuClass}>
                                        {industries.map((c) => (
                                            <SelectItem key={c.id} value={String(c.id)} className={selectItemClass}>{c.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormField>
                            <FormField label="Description" error={ferr.description} className="sm:col-span-2">
                                <textarea
                                    rows={3}
                                    value={form.data.description}
                                    onChange={(e) => form.setData('description', e.target.value)}
                                    placeholder="What the business does"
                                    className={`${fieldClass} h-auto resize-none py-2.5`}
                                />
                            </FormField>
                            <FormField label="Website" error={ferr.website}>
                                <Input value={form.data.website} onChange={(e) => form.setData('website', e.target.value)} placeholder="https://example.com" className={fieldClass} />
                            </FormField>
                            <FormField label="Email" error={ferr.email}>
                                <Input type="email" value={form.data.email} onChange={(e) => form.setData('email', e.target.value)} placeholder="Enter email" className={fieldClass} />
                            </FormField>
                            <FormField label="Phone" error={ferr.phone}>
                                <Input value={form.data.phone} onChange={(e) => form.setData('phone', e.target.value)} placeholder="Enter phone number" className={fieldClass} />
                            </FormField>
                            <FormField label="City" error={ferr.city}>
                                <Input value={form.data.city} onChange={(e) => form.setData('city', e.target.value)} placeholder="Enter city" className={fieldClass} />
                            </FormField>
                            <FormField label="Status" required error={ferr.status} className="sm:col-span-2">
                                <Select value={form.data.status} onValueChange={(v) => form.setData('status', v)}>
                                    <SelectTrigger className={selectTriggerClass}>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className={selectMenuClass}>
                                        <SelectItem value="approved" className={selectItemClass}>Approved (publish now)</SelectItem>
                                        <SelectItem value="pending" className={selectItemClass}>Pending review</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormField>
                        </div>

                        <div className="flex justify-end gap-2 border-t border-[#F1F1F4] pt-4">
                            <button type="button" onClick={closeAdd} className="h-10 cursor-pointer rounded-lg border border-[#DBDFE9] px-4 text-[13px] font-semibold text-[#4B5675] hover:bg-[#F9F9F9]">
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={form.processing}
                                className="inline-flex h-10 cursor-pointer items-center gap-1.5 rounded-lg bg-[#1B84FF] px-5 text-[13px] font-semibold text-white hover:bg-[#006AE6] disabled:opacity-60"
                            >
                                <Plus className="size-4" /> {form.processing ? 'Saving…' : 'Add Business'}
                            </button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}
