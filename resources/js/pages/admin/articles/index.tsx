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
import { CheckCircle2, Newspaper, Plus, Trash2 } from 'lucide-react';
import type { Article } from '@/types';

interface ArticlesIndexProps {
    articles: {
        data: Article[];
        current_page: number;
        last_page: number;
        total: number;
    };
}

const statusPill = (status: string) => {
    if (status === 'published') return 'border border-emerald-200 bg-emerald-50 text-emerald-700';
    if (status === 'pending_review') return 'border border-amber-200 bg-amber-50 text-amber-700';
    return 'border border-[#E5E7EB] bg-[#F9FAFB] text-[#78829D]';
};

export default function ArticlesIndex({ articles }: ArticlesIndexProps) {
    const handlePublish = (id: number) => {
        router.post(`/admin/articles/${id}/publish`);
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this article?')) {
            router.delete(`/admin/articles/${id}`);
        }
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

                <div className="overflow-hidden rounded-xl border border-[#F1F1F4] bg-white shadow-[0_3px_4px_0_rgba(0,0,0,0.03)]">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-[#FCFCFC]">
                                <TableRow className="border-[#F1F1F4] hover:bg-transparent">
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
                                        <TableCell colSpan={6} className="h-32 text-center text-[13px] text-[#78829D]">
                                            No articles found. Click "Compose Article" to draft one.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    articles.data.map((art) => (
                                        <TableRow
                                            key={art.id}
                                            className="border-[#F1F1F4] transition-colors hover:bg-[#FCFCFC]"
                                        >
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
                                                <div className="flex items-center justify-end gap-1">
                                                    {art.status !== 'published' && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handlePublish(art.id)}
                                                            className="inline-flex size-8 items-center justify-center rounded-lg text-emerald-600 transition-colors hover:bg-emerald-50"
                                                            title="Approve & Publish"
                                                        >
                                                            <CheckCircle2 className="size-4" />
                                                        </button>
                                                    )}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(art.id)}
                                                        className="inline-flex size-8 items-center justify-center rounded-lg text-rose-500 transition-colors hover:bg-rose-50"
                                                        title="Delete Article"
                                                    >
                                                        <Trash2 className="size-4" />
                                                    </button>
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
