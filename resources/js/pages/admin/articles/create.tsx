import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';
import type { ArticleCategory } from '@/types';

interface ArticleCreateProps {
    categories: ArticleCategory[];
}

const fieldClass =
    'h-10 w-full rounded-md border !border-[#DBDFE9] !bg-[#FCFCFC] px-3 text-[13px] font-normal !text-[#071437] !shadow-none outline-none transition-all duration-200 placeholder:!text-[#99A1B7] hover:!border-[#C4CADA] focus:!border-[#1B84FF] focus:!bg-white focus:!ring-[3px] focus:!ring-[#1B84FF]/10 dark:!bg-[#FCFCFC] dark:!text-[#071437]';

const textareaClass =
    'w-full rounded-md border !border-[#DBDFE9] !bg-[#FCFCFC] p-3 text-[13px] font-normal !text-[#071437] !shadow-none outline-none transition-all duration-200 placeholder:!text-[#99A1B7] hover:!border-[#C4CADA] focus:!border-[#1B84FF] focus:!bg-white focus:!ring-[3px] focus:!ring-[#1B84FF]/10 dark:!bg-[#FCFCFC] dark:!text-[#071437]';

const selectTriggerClass =
    '!h-10 w-full cursor-pointer rounded-md !border-[#DBDFE9] !bg-[#FCFCFC] px-3 text-[13px] font-normal !text-[#071437] !shadow-none transition-all duration-200 hover:!border-[#C4CADA] hover:!bg-[#FCFCFC] focus-visible:!border-[#1B84FF] focus-visible:!bg-white focus-visible:!ring-[3px] focus-visible:!ring-[#1B84FF]/10 dark:!bg-[#FCFCFC] dark:hover:!bg-[#FCFCFC]';

const selectMenuClass =
    'z-[60] rounded-xl !border-[#F1F1F4] !bg-white p-1 !text-[#071437] shadow-[0_12px_32px_-8px_rgba(7,20,55,0.16)] dark:!bg-white dark:!text-[#071437]';

const selectItemClass =
    'cursor-pointer rounded-lg py-2 pr-8 pl-2.5 text-[13px] text-[#071437] focus:!bg-[#F1F6FF] focus:!text-[#1B84FF] dark:text-[#071437]';

const labelClass = 'mb-1.5 block text-[12.5px] font-semibold text-[#071437]';

export default function ArticleCreate({ categories }: ArticleCreateProps) {
    const [title, setTitle] = useState('');
    const [categoryId, setCategoryId] = useState(categories[0]?.id ? String(categories[0].id) : '');
    const [status, setStatus] = useState('published');
    const [excerpt, setExcerpt] = useState('');
    const [body, setBody] = useState('');
    const [seoTitle] = useState('');
    const [seoDescription] = useState('');

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
            <Head title="Compose Article - CCINTAKE 97 Admin" />

            <div className="w-full space-y-5">
                <Link
                    href="/admin/articles"
                    className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#78829D] transition-colors hover:text-[#071437]"
                >
                    <ArrowLeft className="size-4" />
                    Back to Articles
                </Link>

                <div className="overflow-hidden rounded-xl border border-[#F1F1F4] bg-white shadow-[0_3px_4px_0_rgba(0,0,0,0.03)]">
                    <div className="border-b border-[#F1F1F4] px-6 py-4">
                        <h2 className="text-[16px] font-bold text-[#071437]">
                            Compose News / Announcement
                        </h2>
                        <p className="mt-0.5 text-[12.5px] text-[#78829D]">
                            Draft an association announcement or editorial story for members.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5 p-6">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="sm:col-span-2">
                                <label className={labelClass}>Article Headline *</label>
                                <input
                                    required
                                    className={fieldClass}
                                    placeholder="e.g. Annual Executive Committee Election Results 2026"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className={labelClass}>Category *</label>
                                <Select value={categoryId} onValueChange={setCategoryId}>
                                    <SelectTrigger className={selectTriggerClass}>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent className={selectMenuClass}>
                                        {categories.map((c) => (
                                            <SelectItem key={c.id} value={String(c.id)} className={selectItemClass}>
                                                {c.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <label className={labelClass}>Publishing Status *</label>
                                <Select value={status} onValueChange={setStatus}>
                                    <SelectTrigger className={selectTriggerClass}>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className={selectMenuClass}>
                                        <SelectItem value="published" className={selectItemClass}>
                                            Publish Immediately
                                        </SelectItem>
                                        <SelectItem value="pending_review" className={selectItemClass}>
                                            Submit for Editorial Review
                                        </SelectItem>
                                        <SelectItem value="draft" className={selectItemClass}>
                                            Save as Draft
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="sm:col-span-2">
                                <label className={labelClass}>Short Summary / Excerpt</label>
                                <input
                                    className={fieldClass}
                                    placeholder="Brief summary for notification cards and social previews..."
                                    value={excerpt}
                                    onChange={(e) => setExcerpt(e.target.value)}
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <label className={labelClass}>Full Article Body *</label>
                                <textarea
                                    required
                                    rows={8}
                                    className={textareaClass}
                                    placeholder="Write article content in HTML or plain text..."
                                    value={body}
                                    onChange={(e) => setBody(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 border-t border-[#F1F1F4] pt-5">
                            <Link
                                href="/admin/articles"
                                className="inline-flex h-10 items-center rounded-lg border border-[#DBDFE9] !bg-white px-4 text-[13px] font-semibold !text-[#4B5675] transition-colors hover:!bg-[#F9F9F9] hover:!text-[#071437]"
                            >
                                Cancel
                            </Link>
                            <Button
                                type="submit"
                                className="h-10 cursor-pointer rounded-lg bg-[#1B84FF] px-5 text-[13px] font-semibold text-white hover:bg-[#1B84FF]/90"
                            >
                                Save & Proceed
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
