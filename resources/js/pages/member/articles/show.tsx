import React from 'react';
import { Head, Link } from '@inertiajs/react';
import MemberLayout from '@/layouts/member-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, User, Newspaper } from 'lucide-react';
import type { Article } from '@/types';

interface ArticleShowProps {
    article: Article;
}

export default function MemberArticleShow({ article }: ArticleShowProps) {
    return (
        <MemberLayout
            title={article.title}
            breadcrumbs={[
                { title: 'News & Notices', href: '/member/articles' },
                { title: article.title },
            ]}
        >
            <Head title={`${article.title} - INTAKE97.COM`} />

            <div className="max-w-3xl mx-auto space-y-6">
                <Link
                    href="/member/articles"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900"
                >
                    <ArrowLeft className="size-4" />
                    Back to Articles
                </Link>

                <Card className="p-6 sm:p-8 space-y-6">
                    <div className="space-y-3 border-b pb-6">
                        <Badge variant="outline" className="text-xs font-semibold text-indigo-600">
                            {article.category?.name}
                        </Badge>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
                            {article.title}
                        </h1>
                        <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
                            <span className="flex items-center gap-1.5">
                                <Calendar className="size-3.5" />
                                {new Date(article.published_at || article.created_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                            </span>
                            <span>·</span>
                            <span className="flex items-center gap-1.5">
                                <User className="size-3.5" />
                                {article.author?.name || 'Association Secretariat'}
                            </span>
                        </div>
                    </div>

                    {/* Article Body */}
                    <div
                        className="prose dark:prose-invert max-w-none text-sm text-slate-800 dark:text-slate-200 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: article.body }}
                    />
                </Card>
            </div>
        </MemberLayout>
    );
}
