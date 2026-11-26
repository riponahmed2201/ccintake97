import { useMemo, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { ArrowUpRight, Search, X } from 'lucide-react';
import { FALLBACK_ARTICLES, NEWS_FALLBACK_PHOTOS } from '@/components/landing/constants';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { LANDING_CONTAINER, LANDING_SECTION } from '@/components/landing/layout';
import { MarketingPageHero } from '@/components/marketing/marketing-page-hero';
import PublicSiteHeader from '@/components/public-site-header';
import { SignupDialogProvider } from '@/contexts/signup-dialog-context';
import { useLandingPage } from '@/hooks/use-landing-page';
import { assetUrl } from '@/lib/utils';
import type { Article } from '@/types/intake97';

export default function NewsIndex({ articles = [] }: { articles?: Article[] }) {
    const landing = useLandingPage();
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [query, setQuery] = useState('');

    const items = useMemo(() => {
        const list =
            articles.length > 0
                ? articles.map((a) => ({
                      key: String(a.id),
                      title: a.title,
                      cat: a.category?.name || 'Gazette',
                      date: a.published_at
                          ? new Date(a.published_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })
                          : 'Recent',
                      excerpt: a.excerpt || a.body?.slice(0, 160) || '',
                      author: a.author?.name || 'Central Secretariat',
                      image: a.cover_image_path ? `/storage/${a.cover_image_path.replace(/^\/+/, '')}` : null,
                      href: `/news/${a.slug}`,
                  }))
                : FALLBACK_ARTICLES.map((a) => ({
                      key: a.title,
                      title: a.title,
                      cat: a.cat,
                      date: a.date,
                      excerpt: a.excerpt,
                      author: 'Central Secretariat',
                      image: null as string | null,
                      href: '/contact',
                  }));

        return list.map((item, i) => ({
            ...item,
            image: item.image || NEWS_FALLBACK_PHOTOS[i % NEWS_FALLBACK_PHOTOS.length],
        }));
    }, [articles]);

    const categories = useMemo(() => ['All', ...Array.from(new Set(items.map((i) => i.cat)))], [items]);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return items.filter((item) => {
            const matchesCat = selectedCategory === 'All' || item.cat === selectedCategory;
            const matchesQuery = !q || item.title.toLowerCase().includes(q) || item.excerpt.toLowerCase().includes(q) || item.cat.toLowerCase().includes(q);
            return matchesCat && matchesQuery;
        });
    }, [items, selectedCategory, query]);

    return (
        <SignupDialogProvider>
            <Head title="News & Dispatches — CCINTAKE 97" />
            <div className="min-h-screen bg-[#FAF5F6] font-sans text-[#091324] antialiased selection:bg-[#450D15] selection:text-white">
                <PublicSiteHeader active="News" />

                <MarketingPageHero
                    eyebrow="Community & Gazette"
                    title="News & Dispatches"
                    intro="Official announcements from the Central Secretariat, batch milestones, and stories from across the 1997 cadet community."
                    image={assetUrl('/images/campus/hero-mcc.jpg')}
                    cta="Apply for Membership"
                    onCtaClick={() => landing.openSignup()}
                />

                <section className={`${LANDING_SECTION} bg-[#FAF5F6]`}>
                    <div className={LANDING_CONTAINER}>
                        <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-[#450D15]/10 bg-white p-4 shadow-[0_10px_30px_-20px_rgba(69,13,21,0.16)] sm:p-5 lg:flex-row lg:items-center lg:justify-between">
                            <div className="flex flex-wrap items-center gap-2">
                                {categories.map((cat) => (
                                    <button
                                        key={cat}
                                        type="button"
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`cursor-pointer rounded-full px-4 py-2 text-[13px] font-semibold transition-all ${
                                            selectedCategory === cat
                                                ? 'bg-gradient-to-r from-[#6E1622] via-[#450D15] to-[#5E121D] text-white shadow-sm'
                                                : 'border border-[#091324]/12 bg-[#FAF5F6] text-[#091324]/75 hover:border-[#450D15]/45 hover:text-[#450D15]'
                                        }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="relative w-full sm:w-64">
                                    <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#091324]/40" />
                                    <input
                                        type="text"
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        placeholder="Search dispatches..."
                                        aria-label="Search dispatches"
                                        className="h-10 w-full rounded-full border border-[#091324]/12 bg-[#F8FAFC] pr-9 pl-10 text-[13.5px] text-[#091324] placeholder:text-[#091324]/40 focus:border-[#450D15] focus:bg-white focus:outline-none"
                                    />
                                    {query && (
                                        <button
                                            type="button"
                                            aria-label="Clear search"
                                            onClick={() => setQuery('')}
                                            className="absolute top-1/2 right-2.5 -translate-y-1/2 rounded-full p-1 text-[#091324]/45 hover:text-[#450D15]"
                                        >
                                            <X className="h-3.5 w-3.5" />
                                        </button>
                                    )}
                                </div>
                                <span className="hidden shrink-0 text-[13px] font-medium text-[#4A4F5C] sm:inline">
                                    {filtered.length} {filtered.length === 1 ? 'dispatch' : 'dispatches'}
                                </span>
                            </div>
                        </div>

                        {filtered.length === 0 ? (
                            <div className="rounded-3xl border border-[#450D15]/10 bg-white p-14 text-center">
                                <p className="font-serif text-xl font-medium text-[#091324]">No matching dispatches found</p>
                                <p className="mt-2 text-[14px] text-[#4A4F5C]">Try clearing your search or selecting another category.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {filtered.map((item) => (
                                    <Link
                                        key={item.key}
                                        href={item.href}
                                        className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#450D15]/10 bg-white shadow-[0_12px_32px_-20px_rgba(69,13,21,0.18)] transition-all duration-300 hover:-translate-y-1 hover:border-[#450D15]/35 hover:shadow-[0_22px_48px_-20px_rgba(69,13,21,0.24)]"
                                    >
                                        <div className="relative aspect-[16/10] overflow-hidden bg-brand-navy">
                                            <img
                                                src={item.image}
                                                alt={item.title}
                                                loading="lazy"
                                                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                            />
                                            <span className="absolute top-3.5 left-3.5 rounded-full bg-[#450D15] px-3 py-1 text-[10.5px] font-semibold tracking-[0.16em] text-white uppercase shadow-xs">
                                                {item.cat}
                                            </span>
                                        </div>
                                        <div className="flex flex-1 flex-col p-6">
                                            <div className="flex items-center justify-between gap-2 text-[11px] font-medium tracking-[0.14em] text-[#5E121D] uppercase">
                                                <span>{item.date}</span>
                                                <span className="text-[#4A4F5C] normal-case tracking-normal">{item.author}</span>
                                            </div>
                                            <h2 className="mt-2.5 line-clamp-2 font-serif text-xl leading-snug font-medium text-[#091324] transition-colors group-hover:text-[#450D15]">
                                                {item.title}
                                            </h2>
                                            <p className="mt-2.5 line-clamp-3 flex-1 text-[14px] leading-relaxed text-[#4A4F5C]">
                                                {item.excerpt}
                                            </p>
                                            <div className="mt-5 inline-flex items-center gap-1.5 border-t border-[#450D15]/[0.08] pt-3.5 text-[13px] font-semibold text-[#450D15]">
                                                <span>Read dispatch</span>
                                                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                <LandingFooter />
            </div>
        </SignupDialogProvider>
    );
}
