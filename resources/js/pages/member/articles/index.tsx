import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import MemberLayout from '@/layouts/member-layout';
import { Newspaper, ArrowRight, Calendar } from 'lucide-react';
import type { Article, ArticleCategory } from '@/types';

interface ArticlesIndexProps {
    articles: {
        data: Article[];
        current_page: number;
        last_page: number;
        total: number;
        links: any[];
    };
    categories: ArticleCategory[];
    selectedCategoryId?: string;
}

export default function MemberArticlesIndex({
    articles,
    categories,
    selectedCategoryId,
}: ArticlesIndexProps) {
    const handleCategoryFilter = (catId?: number) => {
        router.get('/member/articles', catId ? { category_id: catId } : {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <MemberLayout
            title="News & Notices"
            breadcrumbs={[{ title: 'News & Notices' }]}
        >
            <Head title="News & Notices - INTAKE97.COM" />

            <div className="w-full space-y-6">
                {/* Page Header */}
                <div>
                    <h1 className="text-[22px] font-semibold tracking-tight text-[#071437]">
                        Association News &amp; Announcements
                    </h1>
                    <p className="mt-1 text-[13px] text-[#78829D]">
                        Read official association updates, batch stories, notices, and alumni achievements.
                    </p>
                </div>

                {/* Category Filter Pills */}
                <div className="flex flex-wrap gap-2">
                    <button
                        type="button"
                        onClick={() => handleCategoryFilter()}
                        className={`cursor-pointer rounded-lg px-3.5 py-2 text-[12.5px] font-semibold transition-colors ${
                            !selectedCategoryId
                                ? 'bg-[#1B84FF] text-white'
                                : 'border border-[#F1F1F4] bg-[#FCFCFC] text-[#4B5675] hover:bg-[#F1F6FF] hover:text-[#1B84FF]'
                        }`}
                    >
                        All Categories
                    </button>
                    {categories.map((c) => {
                        const active = String(c.id) === String(selectedCategoryId);
                        return (
                            <button
                                key={c.id}
                                type="button"
                                onClick={() => handleCategoryFilter(c.id)}
                                className={`cursor-pointer rounded-lg px-3.5 py-2 text-[12.5px] font-semibold transition-colors ${
                                    active
                                        ? 'bg-[#1B84FF] text-white'
                                        : 'border border-[#F1F1F4] bg-[#FCFCFC] text-[#4B5675] hover:bg-[#F1F6FF] hover:text-[#1B84FF]'
                                }`}
                            >
                                {c.name}
                            </button>
                        );
                    })}
                </div>

                {/* Articles Grid */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {articles.data.length === 0 ? (
                        <div className="col-span-full flex flex-col items-center justify-center rounded-xl border border-[#F1F1F4] bg-[#FCFCFC] px-6 py-12 text-center">
                            <div className="mb-3 flex size-11 items-center justify-center rounded-full bg-[#F1F6FF] text-[#1B84FF]">
                                <Newspaper className="size-5" />
                            </div>
                            <p className="text-[13.5px] font-semibold text-[#071437]">No articles found</p>
                            <p className="mt-1 max-w-md text-[12.5px] text-[#78829D]">
                                No articles or notices were found in this category.
                            </p>
                        </div>
                    ) : (
                        articles.data.map((art) => (
                            <div
                                key={art.id}
                                className="flex flex-col justify-between rounded-xl border border-[#F1F1F4] bg-white p-5 shadow-[0_3px_4px_0_rgba(0,0,0,0.03)] transition-colors hover:border-[#DBDFE9]"
                            >
                                <div className="space-y-2.5">
                                    <div className="flex items-center justify-between gap-2 text-[11.5px] text-[#99A1B7]">
                                        <span className="inline-flex rounded-md bg-[#F1F6FF] px-2.5 py-0.5 text-[11px] font-semibold text-[#1B84FF]">
                                            {art.category?.name || 'Notice'}
                                        </span>
                                        <span className="inline-flex items-center gap-1">
                                            <Calendar className="size-3" />
                                            {new Date(art.published_at || art.created_at).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric',
                                            })}
                                        </span>
                                    </div>

                                    <Link
                                        href={`/member/articles/${art.slug}`}
                                        className="line-clamp-2 block text-[15px] leading-snug font-semibold text-[#071437] transition-colors hover:text-[#1B84FF]"
                                    >
                                        {art.title}
                                    </Link>

                                    <p className="line-clamp-3 text-[12.5px] leading-relaxed text-[#78829D]">
                                        {art.excerpt || 'Read the full announcement for details.'}
                                    </p>
                                </div>

                                <div className="mt-4 flex justify-end border-t border-[#F1F1F4] pt-3.5">
                                    <Link
                                        href={`/member/articles/${art.slug}`}
                                        className="inline-flex items-center gap-1 text-[12.5px] font-semibold text-[#1B84FF] hover:text-[#006AE6]"
                                    >
                                        Read Article <ArrowRight className="size-3.5" />
                                    </Link>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </MemberLayout>
    );
}
