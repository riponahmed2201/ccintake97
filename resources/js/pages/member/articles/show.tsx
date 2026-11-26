import React from 'react';
import { Head, Link } from '@inertiajs/react';
import MemberLayout from '@/layouts/member-layout';
import { ArrowLeft, Calendar, User } from 'lucide-react';
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
            <Head title={`${article.title} - CCINTAKE97.COM`} />

            <div className="w-full space-y-5">
                <div>
                    <Link
                        href="/member/articles"
                        className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-[#78829D] transition-colors hover:text-[#1B84FF]"
                    >
                        <ArrowLeft className="size-4" />
                        Back to News &amp; Notices
                    </Link>
                </div>

                <article className="rounded-xl border border-[#F1F1F4] bg-white p-6 shadow-[0_3px_4px_0_rgba(0,0,0,0.03)] sm:p-8">
                    <div className="space-y-3 border-b border-[#F1F1F4] pb-6">
                        <span className="inline-flex rounded-md bg-[#F1F6FF] px-2.5 py-0.5 text-[11px] font-semibold text-[#1B84FF]">
                            {article.category?.name || 'Notice'}
                        </span>

                        <h1 className="text-[24px] leading-tight font-bold tracking-tight text-[#071437] sm:text-[28px]">
                            {article.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-4 pt-1 text-[12.5px] text-[#78829D]">
                            <span className="inline-flex items-center gap-1.5">
                                <Calendar className="size-3.5 text-[#99A1B7]" />
                                {new Date(article.published_at || article.created_at).toLocaleDateString('en-US', {
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric',
                                })}
                            </span>
                            <span className="text-[#DBDFE9]">·</span>
                            <span className="inline-flex items-center gap-1.5">
                                <User className="size-3.5 text-[#99A1B7]" />
                                {article.author?.name || 'Association Secretariat'}
                            </span>
                        </div>
                    </div>

                    <div
                        className="prose mt-6 max-w-4xl text-[14px] leading-relaxed text-[#4B5675] prose-headings:text-[#071437] prose-a:text-[#1B84FF]"
                        dangerouslySetInnerHTML={{ __html: article.body }}
                    />
                </article>
            </div>
        </MemberLayout>
    );
}
