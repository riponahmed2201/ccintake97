import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
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
import { CheckCircle2, Edit2, MoreHorizontal, Newspaper, Plus, Search, Trash2 } from 'lucide-react';
import type { Article, ArticleCategory } from '@/types';

interface ArticlesIndexProps {
    articles: {
        data: Article[];
        current_page: number;
        last_page: number;
        per_page?: number;
        from?: number;
        to?: number;
        total: number;
        links: any[];
    };
    categories?: ArticleCategory[];
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
    if (status === 'pending_review') return 'border border-amber-200 bg-amber-50 text-amber-700';
    if (status === 'approved') return 'border border-blue-200 bg-blue-50 text-blue-700';
    return 'border border-[#E5E7EB] bg-[#F9FAFB] text-[#78829D]';
};

export default function ArticlesIndex({ articles, categories = [], filters }: ArticlesIndexProps) {
    const [search, setSearch] = useState(filters?.search || '');
    const [selectedStatus, setSelectedStatus] = useState(filters?.status || '');
    const [selectedCategory, setSelectedCategory] = useState(filters?.category_id || '');
    const [perPage, setPerPage] = useState(filters?.per_page || String(articles.per_page || 10));
    const [deleteTarget, setDeleteTarget] = useState<Article | null>(null);

    const applyFilter = (key: string, val: string) => {
        const query = {
            search,
            status: selectedStatus,
            category_id: selectedCategory,
            per_page: perPage,
            [key]: val,
        };
        router.get('/admin/articles', query, { preserveState: true, replace: true });
    };

    const handlePublish = (id: number) => {
        router.post(`/admin/articles/${id}/publish`, {}, { preserveScroll: true });
    };

    const confirmDelete = () => {
        if (!deleteTarget) return;
        router.delete(`/admin/articles/${deleteTarget.id}`, {
            preserveScroll: true,
            onSuccess: () => setDeleteTarget(null),
        });
    };

    return (
        <AdminLayout
            title="News & Announcements"
            breadcrumbs={[{ title: 'News & Notices' }]}
        >
            <Head title="News & Notices - INTAKE 97 Admin" />

            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-[20px] font-bold tracking-tight text-[#071437]">
                            Association News & Announcements
                        </h1>
                        <p className="mt-1 text-[13px] text-[#78829D]">
                            Publish official notices, alumni achievements, and association news.
                        </p>
                    </div>
                    <Link
                        href="/admin/articles/create"
                        className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#1B84FF] px-4 text-[13px] font-semibold text-white shadow-xs transition-colors hover:bg-[#1B84FF]/90"
                    >
                        <Plus className="size-4" />
                        Compose Article
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
                                placeholder="Search by article title or excerpt..."
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
                                <SelectItem value="approved" className={selectItemClass}>Approved</SelectItem>
                                <SelectItem value="pending_review" className={selectItemClass}>Pending Review</SelectItem>
                                <SelectItem value="draft" className={selectItemClass}>Draft</SelectItem>
                                <SelectItem value="archived" className={selectItemClass}>Archived</SelectItem>
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
                                        Title
                                    </TableHead>
                                    <TableHead className="px-4 py-3.5 text-[11.5px] font-semibold tracking-wide text-[#78829D] uppercase">
                                        Category
                                    </TableHead>
                                    <TableHead className="px-4 py-3.5 text-[11.5px] font-semibold tracking-wide text-[#78829D] uppercase">
                                        Author
                                    </TableHead>
                                    <TableHead className="px-4 py-3.5 text-[11.5px] font-semibold tracking-wide text-[#78829D] uppercase">
                                        Status
                                    </TableHead>
                                    <TableHead className="px-4 py-3.5 text-[11.5px] font-semibold tracking-wide text-[#78829D] uppercase">
                                        Published At
                                    </TableHead>
                                    <TableHead className="px-5 py-3.5 text-right text-[11.5px] font-semibold tracking-wide text-[#78829D] uppercase">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {articles.data.length === 0 ? (
                                    <TableRow className="border-[#F1F1F4] hover:bg-transparent">
                                        <TableCell colSpan={7} className="h-32 text-center text-[13px] text-[#78829D]">
                                            No articles found. Click "Compose Article" to draft one.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    articles.data.map((art, idx) => (
                                        <TableRow
                                            key={art.id}
                                            className="border-[#F1F1F4] transition-colors hover:bg-[#FCFCFC]"
                                        >
                                            <TableCell className="px-5 py-3.5 text-[12.5px] font-medium text-[#78829D] tabular-nums">
                                                {(articles.from || 1) + idx}
                                            </TableCell>
                                            <TableCell className="px-5 py-3.5">
                                                <div className="flex items-start gap-2.5">
                                                    <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#F1F6FF] text-[#1B84FF]">
                                                        <Newspaper className="size-4" />
                                                    </div>
                                                    <div>
                                                        <div className="text-[13px] font-semibold text-[#071437]">
                                                            {art.title}
                                                        </div>
                                                        <div className="line-clamp-1 text-[11.5px] text-[#78829D]">
                                                            {art.excerpt || '—'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-4 py-3.5 text-[13px] text-[#4B5675]">
                                                {art.category?.name}
                                            </TableCell>
                                            <TableCell className="px-4 py-3.5 text-[13px] text-[#4B5675]">
                                                {art.author?.name || 'Editorial Staff'}
                                            </TableCell>
                                            <TableCell className="px-4 py-3.5">
                                                <span
                                                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize ${statusPill(art.status)}`}
                                                >
                                                    {art.status.replace('_', ' ')}
                                                </span>
                                            </TableCell>
                                            <TableCell className="px-4 py-3.5 text-[13px] text-[#78829D]">
                                                {art.published_at
                                                    ? new Date(art.published_at).toLocaleDateString()
                                                    : 'Unpublished'}
                                            </TableCell>
                                            <TableCell className="px-5 py-3.5 text-right">
                                                <div className="flex justify-end">
                                                    <DropdownMenu modal={false}>
                                                        <DropdownMenuTrigger asChild>
                                                            <button
                                                                type="button"
                                                                className="inline-flex size-8 cursor-pointer items-center justify-center rounded-lg border border-transparent text-[#78829D] transition-colors hover:border-[#DBDFE9] hover:bg-[#F9F9F9] hover:text-[#071437]"
                                                                aria-label="Article actions"
                                                            >
                                                                <MoreHorizontal className="size-4" />
                                                            </button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-48 rounded-xl border-[#F1F1F4] !bg-white p-1.5 !text-[#071437] shadow-[0_12px_32px_-8px_rgba(7,20,55,0.16)]">
                                                            <DropdownMenuItem asChild className="cursor-pointer rounded-lg px-2.5 py-2 text-[13px] font-medium text-[#071437] focus:!bg-[#F1F6FF] focus:!text-[#1B84FF]">
                                                                <Link href={`/admin/articles/${art.id}/edit`}>
                                                                    <Edit2 className="size-4 text-[#78829D]" />
                                                                    Edit Article
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            {art.status !== 'published' && (
                                                                <DropdownMenuItem
                                                                    onSelect={() => handlePublish(art.id)}
                                                                    className="cursor-pointer rounded-lg px-2.5 py-2 text-[13px] font-medium text-[#17C653] focus:!bg-[#EAFFF1] focus:!text-[#17C653]"
                                                                >
                                                                    <CheckCircle2 className="size-4 text-[#17C653]" />
                                                                    Approve &amp; Publish
                                                                </DropdownMenuItem>
                                                            )}
                                                            <DropdownMenuSeparator className="my-1 bg-[#F1F1F4]" />
                                                            <DropdownMenuItem
                                                                onSelect={() => setDeleteTarget(art)}
                                                                className="cursor-pointer rounded-lg px-2.5 py-2 text-[13px] font-medium text-[#F8285A] focus:!bg-[#FFEEF3] focus:!text-[#F8285A]"
                                                            >
                                                                <Trash2 className="size-4 text-[#F8285A]" />
                                                                Delete Article
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
                                Showing <strong className="font-semibold text-[#071437]">{articles.from || 0}</strong>–
                                <strong className="font-semibold text-[#071437]">{articles.to || 0}</strong> of{' '}
                                <strong className="font-semibold text-[#071437]">{articles.total}</strong> · Page {articles.current_page} of {articles.last_page}
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
                            {articles.links.map((link, idx) => (
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

            {/* Delete Confirmation Dialog */}
            <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
                <DialogContent className="rounded-2xl border-[#F1F1F4] !bg-white p-0 !text-[#071437] shadow-[0_20px_50px_-12px_rgba(7,20,55,0.18)] sm:max-w-md">
                    <DialogHeader className="border-b border-[#F1F1F4] px-6 py-5">
                        <DialogTitle className="text-[16px] font-bold text-[#071437]">
                            Delete Article
                        </DialogTitle>
                        <DialogDescription className="mt-1 text-[12.5px] text-[#78829D]">
                            Are you sure you want to delete <strong className="text-[#071437]">{deleteTarget?.title}</strong>? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="px-6 py-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setDeleteTarget(null)}
                            className="h-9 cursor-pointer rounded-lg border-[#DBDFE9] !bg-white px-4 text-[13px] font-semibold !text-[#4B5675] hover:!bg-[#F9F9F9] hover:!text-[#071437]"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            onClick={confirmDelete}
                            className="h-9 cursor-pointer rounded-lg bg-[#F8285A] px-4 text-[13px] font-semibold text-white hover:bg-[#e11d48]"
                        >
                            Delete Article
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}
