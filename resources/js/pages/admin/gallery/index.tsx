import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
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
import { Edit2, MoreHorizontal, Plus, Search, Trash2, Upload } from 'lucide-react';

interface GalleryItem {
    id: number;
    title: string;
    place_label: string | null;
    category: 'campus_life' | 'reunion' | 'events';
    image_path: string;
    image_url: string;
    display_order: number;
    is_active: boolean;
}

interface GalleryIndexProps {
    items: {
        data: GalleryItem[];
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
        category?: string;
        per_page?: string;
    };
}

const ALL = '__all__';

const fieldClass =
    'h-10 w-full rounded-md border !border-[#DBDFE9] !bg-[#FCFCFC] px-3 text-[13px] font-normal !text-[#071437] !shadow-none outline-none transition-all duration-200 placeholder:!text-[#99A1B7] hover:!border-[#C4CADA] focus:!border-[#1B84FF] focus:!bg-white focus:!ring-[3px] focus:!ring-[#1B84FF]/10 dark:!bg-[#FCFCFC] dark:!text-[#071437]';

const selectTriggerClass =
    '!h-10 w-full cursor-pointer rounded-md !border-[#DBDFE9] !bg-[#FCFCFC] px-3 text-[13px] font-normal !text-[#071437] !shadow-none';

const selectMenuClass =
    'z-[60] rounded-xl !border-[#F1F1F4] !bg-white p-1 !text-[#071437] shadow-[0_12px_32px_-8px_rgba(7,20,55,0.16)]';

const selectItemClass =
    'cursor-pointer rounded-lg py-2 pr-8 pl-2.5 text-[13px] text-[#071437] focus:!bg-[#F1F6FF] focus:!text-[#1B84FF]';

const labelClass = 'mb-1.5 block text-[12.5px] font-semibold text-[#071437]';

export default function GalleryIndex({ items, filters }: GalleryIndexProps) {
    const [searchQuery, setSearchQuery] = useState(filters?.search || '');
    const [selectedCategory, setSelectedCategory] = useState(filters?.category || '');
    const [perPage, setPerPage] = useState(filters?.per_page || String(items.per_page || 20));

    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<GalleryItem | null>(null);
    const [title, setTitle] = useState('');
    const [placeLabel, setPlaceLabel] = useState('');
    const [category, setCategory] = useState<'campus_life' | 'reunion' | 'events'>('campus_life');
    const [order, setOrder] = useState('0');
    const [active, setActive] = useState(true);
    const [image, setImage] = useState<File | null>(null);
    const [saving, setSaving] = useState(false);

    const applyFilter = (key: string, val: string) => {
        router.get(
            '/admin/gallery',
            {
                search: searchQuery,
                category: selectedCategory,
                per_page: perPage,
                [key]: val,
            },
            { preserveState: true, replace: true },
        );
    };

    const openCreate = () => {
        setEditing(null);
        setTitle('');
        setPlaceLabel('');
        setCategory('campus_life');
        setOrder(String(items.total + 1));
        setActive(true);
        setImage(null);
        setModalOpen(true);
    };

    const openEdit = (item: GalleryItem) => {
        setEditing(item);
        setTitle(item.title);
        setPlaceLabel(item.place_label || '');
        setCategory(item.category);
        setOrder(String(item.display_order));
        setActive(item.is_active);
        setImage(null);
        setModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (saving) return;

        const fd = new FormData();
        fd.append('title', title);
        fd.append('place_label', placeLabel);
        fd.append('category', category);
        fd.append('display_order', order);
        fd.append('is_active', active ? '1' : '0');
        if (image) fd.append('image', image);

        const url = editing ? `/admin/gallery/${editing.id}` : '/admin/gallery';
        router.post(url, fd, {
            preserveScroll: true,
            onStart: () => setSaving(true),
            onFinish: () => setSaving(false),
            onSuccess: () => setModalOpen(false),
        });
    };

    const handleDelete = (item: GalleryItem) => {
        if (!confirm(`Delete "${item.title}"?`)) return;
        router.delete(`/admin/gallery/${item.id}`, { preserveScroll: true });
    };

    return (
        <AdminLayout title="Campus Gallery" breadcrumbs={[{ title: 'Website & CMS' }, { title: 'Campus Gallery' }]}>
            <Head title="Campus Gallery - CCINTAKE 97 Admin" />

            <div className="w-full space-y-6">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-[20px] font-bold tracking-tight text-[#071437]">
                            Campus Life &amp; Photo Gallery
                        </h1>
                        <p className="mt-1 text-[13px] text-[#78829D]">
                            Upload and organize campus life, athletics, and reunion photos shown on the public website.
                        </p>
                    </div>
                    <Button type="button" onClick={openCreate} className="h-9 cursor-pointer rounded-lg bg-[#1B84FF] px-4 text-[13px] font-semibold text-white hover:bg-[#1B84FF]/90">
                        <Plus className="mr-1.5 size-4" /> Upload Photo
                    </Button>
                </div>

                {/* Filter Toolbar */}
                <div className="rounded-xl border border-[#F1F1F4] bg-white p-4 shadow-[0_3px_4px_0_rgba(0,0,0,0.03)]">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                applyFilter('search', searchQuery);
                            }}
                            className="relative sm:col-span-2"
                        >
                            <Search className="absolute top-3 left-3 size-4 text-[#99A1B7]" />
                            <Input
                                placeholder="Search by title or college/place..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={`${fieldClass} pl-9`}
                            />
                        </form>
                        <Select
                            value={selectedCategory || ALL}
                            onValueChange={(val) => {
                                const next = val === ALL ? '' : val;
                                setSelectedCategory(next);
                                applyFilter('category', next);
                            }}
                        >
                            <SelectTrigger className={selectTriggerClass}><SelectValue placeholder="All Categories" /></SelectTrigger>
                            <SelectContent className={selectMenuClass}>
                                <SelectItem value={ALL} className={selectItemClass}>All Categories</SelectItem>
                                <SelectItem value="campus_life" className={selectItemClass}>Campus Life</SelectItem>
                                <SelectItem value="reunion" className={selectItemClass}>Reunion</SelectItem>
                                <SelectItem value="events" className={selectItemClass}>Events</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Gallery Table */}
                <div className="overflow-hidden rounded-xl border border-[#F1F1F4] bg-white shadow-[0_3px_4px_0_rgba(0,0,0,0.03)]">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-[#FCFCFC]">
                                <TableRow className="border-[#F1F1F4] hover:bg-transparent">
                                    <TableHead className="w-14 px-5 py-3.5 text-[11.5px] font-semibold text-[#78829D] uppercase">SL</TableHead>
                                    <TableHead className="px-4 py-3.5 text-[11.5px] font-semibold text-[#78829D] uppercase">Photo</TableHead>
                                    <TableHead className="px-4 py-3.5 text-[11.5px] font-semibold text-[#78829D] uppercase">Title &amp; Place</TableHead>
                                    <TableHead className="px-4 py-3.5 text-[11.5px] font-semibold text-[#78829D] uppercase">Category</TableHead>
                                    <TableHead className="px-4 py-3.5 text-[11.5px] font-semibold text-[#78829D] uppercase">Order</TableHead>
                                    <TableHead className="px-4 py-3.5 text-[11.5px] font-semibold text-[#78829D] uppercase">Status</TableHead>
                                    <TableHead className="px-5 py-3.5 text-right text-[11.5px] font-semibold text-[#78829D] uppercase">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {items.data.length === 0 ? (
                                    <TableRow className="border-[#F1F1F4] hover:bg-transparent">
                                        <TableCell colSpan={7} className="h-32 text-center text-[13px] text-[#78829D]">
                                            No custom gallery photos yet — homepage uses default campus photos until uploaded.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    items.data.map((item, idx) => (
                                        <TableRow key={item.id} className="border-[#F1F1F4] hover:bg-[#FCFCFC]">
                                            <TableCell className="px-5 py-3.5 text-[12.5px] text-[#78829D] tabular-nums">{(items.from || 1) + idx}</TableCell>
                                            <TableCell className="px-4 py-3.5">
                                                <img src={item.image_url} alt={item.title} className="h-12 w-20 rounded-lg border border-[#F1F1F4] object-cover" />
                                            </TableCell>
                                            <TableCell className="px-4 py-3.5">
                                                <div className="text-[13px] font-semibold text-[#071437]">{item.title}</div>
                                                {item.place_label && <div className="text-[11.5px] text-[#78829D]">{item.place_label}</div>}
                                            </TableCell>
                                            <TableCell className="px-4 py-3.5 text-[12.5px] font-medium text-[#4B5675] capitalize">
                                                {item.category.replace('_', ' ')}
                                            </TableCell>
                                            <TableCell className="px-4 py-3.5 text-[13px] font-semibold text-[#071437] tabular-nums">{item.display_order}</TableCell>
                                            <TableCell className="px-4 py-3.5">
                                                <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${item.is_active ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-slate-50 text-slate-600'}`}>
                                                    {item.is_active ? 'Active' : 'Hidden'}
                                                </span>
                                            </TableCell>
                                            <TableCell className="px-5 py-3.5 text-right">
                                                <div className="flex justify-end">
                                                    <DropdownMenu modal={false}>
                                                        <DropdownMenuTrigger asChild>
                                                            <button type="button" className="inline-flex size-8 cursor-pointer items-center justify-center rounded-lg text-[#78829D] hover:bg-[#F9F9F9] hover:text-[#071437]">
                                                                <MoreHorizontal className="size-4" />
                                                            </button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-44 rounded-xl border-[#F1F1F4] !bg-white p-1.5 !text-[#071437] shadow-[0_12px_32px_-8px_rgba(7,20,55,0.16)]">
                                                            <DropdownMenuItem onSelect={() => openEdit(item)} className="cursor-pointer rounded-lg px-2.5 py-2 text-[13px] font-medium focus:!bg-[#F1F6FF] focus:!text-[#1B84FF]">
                                                                <Edit2 className="size-4 text-[#78829D]" /> Edit Photo
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator className="my-1 bg-[#F1F1F4]" />
                                                            <DropdownMenuItem onSelect={() => handleDelete(item)} className="cursor-pointer rounded-lg px-2.5 py-2 text-[13px] font-medium text-[#F8285A] focus:!bg-[#FFEEF3] focus:!text-[#F8285A]">
                                                                <Trash2 className="size-4 text-[#F8285A]" /> Delete
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

                    <div className="flex flex-col items-center justify-between gap-3 border-t border-[#F1F1F4] px-5 py-3.5 text-[12.5px] text-[#78829D] sm:flex-row">
                        <div className="flex flex-wrap items-center gap-3">
                            <span>
                                Showing <strong className="font-semibold text-[#071437]">{items.from || 0}</strong>–
                                <strong className="font-semibold text-[#071437]">{items.to || 0}</strong> of{' '}
                                <strong className="font-semibold text-[#071437]">{items.total}</strong> · Page {items.current_page} of {items.last_page}
                            </span>
                            <div className="flex items-center gap-1.5">
                                <span className="text-[12px] text-[#78829D]">Rows:</span>
                                <Select value={perPage} onValueChange={(val) => { setPerPage(val); applyFilter('per_page', val); }}>
                                    <SelectTrigger className="!h-8 w-[72px] cursor-pointer rounded-md !border-[#DBDFE9] !bg-[#FCFCFC] px-2.5 text-[12px] font-medium !text-[#071437] !shadow-none"><SelectValue /></SelectTrigger>
                                    <SelectContent className={selectMenuClass}>
                                        {['10', '20', '50', '100'].map((s) => (
                                            <SelectItem key={s} value={s} className={selectItemClass}>{s}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5">
                            {items.links.map((link, idx) => (
                                <Link
                                    key={idx}
                                    href={link.url || '#'}
                                    preserveScroll
                                    disabled={!link.url}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`rounded-lg px-2.5 py-1 text-[12px] font-medium transition-colors ${
                                        link.active ? 'bg-[#1B84FF] font-semibold text-white' : link.url ? 'text-[#4B5675] hover:bg-[#F1F6FF] hover:text-[#1B84FF]' : 'pointer-events-none text-[#DBDFE9]'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <Dialog open={modalOpen} onOpenChange={(open) => !open && setModalOpen(false)}>
                <DialogContent className="flex max-h-[88vh] flex-col gap-0 overflow-hidden rounded-2xl border-[#F1F1F4] !bg-white p-0 !text-[#071437] shadow-[0_20px_50px_-12px_rgba(7,20,55,0.18)] sm:max-w-lg">
                    <DialogHeader className="shrink-0 border-b border-[#F1F1F4] bg-[#FCFCFC] px-6 py-5">
                        <DialogTitle className="text-[16px] font-bold text-[#071437]">
                            {editing ? 'Edit Gallery Photo' : 'Upload Gallery Photo'}
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
                        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain px-6 py-5">
                            <div>
                                <label className={labelClass}>Photo Title</label>
                                <Input className={fieldClass} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Inter-house athletics" required />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className={labelClass}>Place / College (Optional)</label>
                                    <Input className={fieldClass} value={placeLabel} onChange={(e) => setPlaceLabel(e.target.value)} placeholder="e.g. RCC" />
                                </div>
                                <div>
                                    <label className={labelClass}>Display Order</label>
                                    <Input type="number" className={fieldClass} value={order} onChange={(e) => setOrder(e.target.value)} min={0} required />
                                </div>
                            </div>
                            <div>
                                <label className={labelClass}>Category</label>
                                <Select value={category} onValueChange={(v) => setCategory(v as typeof category)}>
                                    <SelectTrigger className={selectTriggerClass}><SelectValue /></SelectTrigger>
                                    <SelectContent className={selectMenuClass}>
                                        <SelectItem value="campus_life" className={selectItemClass}>Campus Life</SelectItem>
                                        <SelectItem value="reunion" className={selectItemClass}>Reunion</SelectItem>
                                        <SelectItem value="events" className={selectItemClass}>Events</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className={labelClass}>{editing ? 'Replace Photo (Optional)' : 'Photo File'}</label>
                                <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-[#DBDFE9] bg-[#FCFCFC] p-4 text-[12.5px] font-medium text-[#4B5675] hover:border-[#1B84FF] hover:text-[#1B84FF]">
                                    <Upload className="size-4" />
                                    <span>{image ? image.name : 'Choose image file (max 5MB)'}</span>
                                    <input type="file" accept="image/*" className="hidden" onChange={(e) => setImage(e.target.files?.[0] || null)} required={!editing} />
                                </label>
                            </div>
                            <label className="flex cursor-pointer items-center gap-2.5 text-[13px] font-semibold text-[#071437]">
                                <Checkbox checked={active} onCheckedChange={(c) => setActive(c === true)} className="size-4.5 rounded-[5px] !border-[#DBDFE9] !bg-white data-[state=checked]:!border-[#1B84FF] data-[state=checked]:!bg-[#1B84FF] data-[state=checked]:!text-white" />
                                Active on public website
                            </label>
                        </div>
                        <DialogFooter className="shrink-0 gap-2 border-t border-[#F1F1F4] bg-[#FCFCFC] px-6 py-4">
                            <Button type="button" variant="outline" onClick={() => setModalOpen(false)} className="h-9 cursor-pointer rounded-lg !border-[#DBDFE9] !bg-white px-4 text-[13px] font-semibold !text-[#4B5675]">
                                Cancel
                            </Button>
                            <Button type="submit" disabled={saving} className="h-9 cursor-pointer rounded-lg bg-[#1B84FF] px-4 text-[13px] font-semibold text-white hover:bg-[#1B84FF]/90">
                                {saving ? 'Saving...' : editing ? 'Save Photo' : 'Upload Photo'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}
