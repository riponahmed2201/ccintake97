import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import MemberLayout from '@/layouts/member-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
        router.get('/member/articles', catId ? { category_id: catId } : {}, { preserveState: true });
    };

    return (
        <MemberLayout
            title="News & Announcements"
            breadcrumbs={[{ title: 'News & Notices' }]}
        >
            <Head title="News & Notices - INTAKE97.COM" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                        Association News & Announcements
                    </h1>
                    <p className="text-xs text-slate-500 mt-1">
                        Read official association updates, batch stories, notices, and alumni achievements.
                    </p>
                </div>

                {/* Category Pills */}
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => handleCategoryFilter()}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                            !selectedCategoryId
                                ? 'bg-indigo-600 text-white'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                        }`}
                    >
                        All Categories
                    </button>
                    {categories.map((c) => (
                        <button
                            key={c.id}
                            onClick={() => handleCategoryFilter(c.id)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                                String(c.id) === selectedCategoryId
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                            }`}
                        >
                            {c.name}
                        </button>
                    ))}
                </div>

                {/* Articles Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {articles.data.length === 0 ? (
                        <Card className="col-span-full p-12 text-center text-xs text-slate-400">
                            No articles found in this category.
                        </Card>
                    ) : (
                        articles.data.map((art) => (
                            <Card key={art.id} className="p-5 flex flex-col justify-between hover:border-indigo-300 transition-all">
                                <div className="space-y-2.5">
                                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                                        <Badge variant="outline" className="text-[10px]">
                                            {art.category?.name}
                                        </Badge>
                                        <span>{new Date(art.published_at || art.created_at).toLocaleDateString()}</span>
                                    </div>

                                    <Link
                                        href={`/member/articles/${art.slug}`}
                                        className="font-bold text-sm text-slate-900 dark:text-white hover:text-indigo-600 block line-clamp-2"
                                    >
                                        {art.title}
                                    </Link>

                                    <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                                        {art.excerpt || 'Read the full announcement for details.'}
                                    </p>
                                </div>

                                <div className="pt-4 mt-4 border-t flex justify-end">
                                    <Link
                                        href={`/member/articles/${art.slug}`}
                                        className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:underline"
                                    >
                                        Read Article <ArrowRight className="size-3" />
                                    </Link>
                                </div>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </MemberLayout>
    );
}
