import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Newspaper, Plus, CheckCircle2, Trash2 } from 'lucide-react';
import type { Article } from '@/types';

interface ArticlesIndexProps {
    articles: {
        data: Article[];
        current_page: number;
        last_page: number;
        total: number;
    };
}

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
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                            Association News & Announcements
                        </h1>
                        <p className="text-xs text-slate-500 mt-1">
                            Publish official notices, alumni achievements, and association news.
                        </p>
                    </div>
                    <Link
                        href="/admin/articles/create"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors"
                    >
                        <Plus className="size-3.5" /> Compose Article
                    </Link>
                </div>

                <Card className="overflow-hidden">
                    <Table>
                        <TableHeader className="bg-slate-50 dark:bg-slate-900/60">
                            <TableRow>
                                <TableHead className="text-xs font-semibold">Title</TableHead>
                                <TableHead className="text-xs font-semibold">Category</TableHead>
                                <TableHead className="text-xs font-semibold">Author</TableHead>
                                <TableHead className="text-xs font-semibold">Status</TableHead>
                                <TableHead className="text-xs font-semibold">Published At</TableHead>
                                <TableHead className="text-xs font-semibold text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {articles.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-28 text-center text-xs text-slate-500">
                                        No articles found. Click "Compose Article" to draft one.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                articles.data.map((art) => (
                                    <TableRow key={art.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                                        <TableCell>
                                            <div className="font-semibold text-xs text-slate-900 dark:text-white">
                                                {art.title}
                                            </div>
                                            <div className="text-[11px] text-slate-400 line-clamp-1">
                                                {art.excerpt || '—'}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-xs text-slate-700 dark:text-slate-300">
                                            {art.category?.name}
                                        </TableCell>
                                        <TableCell className="text-xs text-slate-700 dark:text-slate-300">
                                            {art.author?.name || 'Editorial Staff'}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                className={`text-[10px] capitalize ${
                                                    art.status === 'published'
                                                        ? 'bg-emerald-100 text-emerald-800'
                                                        : art.status === 'pending_review'
                                                        ? 'bg-amber-100 text-amber-800'
                                                        : 'bg-slate-100 text-slate-700'
                                                }`}
                                            >
                                                {art.status.replace('_', ' ')}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-xs text-slate-500">
                                            {art.published_at ? new Date(art.published_at).toLocaleDateString() : 'Unpublished'}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                {art.status !== 'published' && (
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => handlePublish(art.id)}
                                                        className="text-xs text-emerald-600"
                                                        title="Approve & Publish"
                                                    >
                                                        <CheckCircle2 className="size-4" />
                                                    </Button>
                                                )}
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => handleDelete(art.id)}
                                                    className="text-xs text-rose-500"
                                                    title="Delete Article"
                                                >
                                                    <Trash2 className="size-4" />
                                                </Button>
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
