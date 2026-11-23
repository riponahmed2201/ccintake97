import { Head, Link } from '@inertiajs/react';
import SiteHeader from '@/components/site-header';
import type { Article } from '@/types/intake97';

export default function NewsShow({ article }: { article: Article }) {
    const cover = article.cover_image_path ? `/storage/${article.cover_image_path.replace(/^\/+/, '')}` : null;
    const published = article.published_at
        ? new Date(article.published_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })
        : null;

    return (
        <>
            <Head title={article.title} />
            <div className="min-h-screen bg-brand-cream font-sans text-brand-navy antialiased">
                <SiteHeader variant="solid" />
                <main className="mx-auto max-w-3xl px-5 py-16 sm:px-8 lg:py-24">
                    <Link href="/" className="text-[14px] font-medium text-brand-gold-muted hover:text-brand-navy">
                        ← Back to home
                    </Link>
                    <div className="mt-8 flex flex-wrap items-center gap-3 text-[11px] tracking-[0.18em] text-brand-gold-muted uppercase">
                        <span>{article.category?.name ?? 'Gazette'}</span>
                        {published && <span className="text-brand-navy/45 normal-case tracking-normal">{published}</span>}
                        {article.author?.name && <span className="text-brand-navy/45 normal-case tracking-normal">By {article.author.name}</span>}
                    </div>
                    <h1 className="mt-6 font-serif text-4xl leading-tight font-medium tracking-[-0.02em] sm:text-5xl">{article.title}</h1>
                    {article.excerpt && <p className="mt-5 text-lg leading-relaxed text-[#4A4F5C]">{article.excerpt}</p>}
                    {cover && (
                        <figure className="mt-10 overflow-hidden rounded-2xl bg-brand-navy">
                            <img src={cover} alt="" className="aspect-[16/10] w-full object-cover" />
                        </figure>
                    )}
                    <article
                        className="prose prose-neutral mt-12 max-w-none prose-headings:font-serif prose-a:text-brand-gold-muted"
                        dangerouslySetInnerHTML={{ __html: article.body || article.content || '' }}
                    />
                </main>
            </div>
        </>
    );
}