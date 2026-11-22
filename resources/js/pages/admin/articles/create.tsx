import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft } from 'lucide-react';
import type { ArticleCategory } from '@/types';

interface ArticleCreateProps {
    categories: ArticleCategory[];
}

export default function ArticleCreate({ categories }: ArticleCreateProps) {
    const [title, setTitle] = useState('');
    const [categoryId, setCategoryId] = useState(categories[0]?.id ? String(categories[0].id) : '');
    const [status, setStatus] = useState('published');
    const [excerpt, setExcerpt] = useState('');
    const [body, setBody] = useState('');
    const [seoTitle, setSeoTitle] = useState('');
    const [seoDescription, setSeoDescription] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/admin/articles', {
            title,
            category_id: parseInt(categoryId),
            status,
            excerpt,
            body,
            seo_title: seoTitle,
            seo_description: seoDescription,
        });
    };

    return (
        <AdminLayout
            title="Compose Article"
            breadcrumbs={[
                { title: 'News & Notices', href: '/admin/articles' },
                { title: 'Compose Article' },
            ]}
        >
            <Head title="Compose Article - INTAKE 97 Admin" />

            <div className="max-w-4xl mx-auto space-y-6">
                <Link
                    href="/admin/articles"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900"
                >
                    <ArrowLeft className="size-4" />
                    Back to Articles
                </Link>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base font-bold">Compose News / Announcement</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="sm:col-span-2">
                                    <label className="font-semibold block mb-1">Article Headline *</label>
                                    <Input
                                        required
                                        placeholder="e.g. Annual Executive Committee Election Results 2026"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="font-semibold block mb-1">Category *</label>
                                    <select
                                        value={categoryId}
                                        onChange={(e) => setCategoryId(e.target.value)}
                                        className="w-full text-xs rounded-md border p-2 bg-white dark:bg-slate-900"
                                    >
                                        {categories.map((c) => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="font-semibold block mb-1">Publishing Status *</label>
                                    <select
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                        className="w-full text-xs rounded-md border p-2 bg-white dark:bg-slate-900"
                                    >
                                        <option value="published">Publish Immediately</option>
                                        <option value="pending_review">Submit for Editorial Review</option>
                                        <option value="draft">Save as Draft</option>
                                    </select>
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="font-semibold block mb-1">Short Summary / Excerpt</label>
                                    <Input
                                        placeholder="Brief summary for notification cards and social previews..."
                                        value={excerpt}
                                        onChange={(e) => setExcerpt(e.target.value)}
                                    />
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="font-semibold block mb-1">Full Article Body *</label>
                                    <textarea
                                        required
                                        rows={8}
                                        className="w-full text-xs rounded-md border p-3 bg-white dark:bg-slate-900 font-mono"
                                        placeholder="Write article content in HTML or plain text..."
                                        value={body}
                                        onChange={(e) => setBody(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-4 border-t">
                                <Link
                                    href="/admin/articles"
                                    className="px-4 py-2 rounded-lg border text-xs font-semibold hover:bg-slate-50"
                                >
                                    Cancel
                                </Link>
                                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-xs font-semibold">
                                    Save & Proceed
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
