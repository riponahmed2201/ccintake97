import { Link } from '@inertiajs/react';
import { ArrowUpRight } from 'lucide-react';
import { FALLBACK_ARTICLES, NEWS_FALLBACK_PHOTOS } from '@/components/landing/constants';
import { LANDING_CONTAINER, LANDING_SECTION, LANDING_SECTION_BODY } from '@/components/landing/layout';
import { ExploreLink, SectionHeading, Reveal } from '@/components/landing/primitives';
import type { Article, Business } from '@/types/intake97';

export function LandingNews({
    articles,
}: {
    articles: Article[];
    businesses?: Business[];
}) {
    return (
                        <section id="news" className={`${LANDING_SECTION} bg-white`}>
                            <div className={LANDING_CONTAINER}>
                                <SectionHeading
                                    eyebrow="Community"
                                    title={<>News &amp; <em className="font-normal text-[#5E121D]">dispatches.</em></>}
                                    intro="Official dispatches, announcements, and stories from the Central Secretariat and 1997 batchmates."
                                    action={
                                        <ExploreLink href="/news" internal={false}>
                                            View All
                                        </ExploreLink>
                                    }
                                />
        
                                {(() => {
                                    const news = (articles.length > 0
                                        ? articles.map((a) => ({
                                              key: String(a.id),
                                              slug: a.slug,
                                              title: a.title,
                                              cat: a.category?.name || 'Gazette',
                                              date: a.published_at ? new Date(a.published_at).toLocaleDateString(undefined, { month: 'long', year: 'numeric' }) : 'Recent',
                                              excerpt: a.excerpt || a.body?.slice(0, 160) || '',
                                              image: a.cover_image_path ? `/storage/${a.cover_image_path.replace(/^\/+/, '')}` : null,
                                              href: `/news/${a.slug}`,
                                          }))
                                        : FALLBACK_ARTICLES.map((a) => ({ key: a.title, ...a, image: null as string | null, slug: '', href: '/news' }))
                                    ).map((a, i) => ({ ...a, image: a.image || NEWS_FALLBACK_PHOTOS[i % NEWS_FALLBACK_PHOTOS.length] }));
        
                                    return (
                                        <div className={LANDING_SECTION_BODY}>
                                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                                                {news.slice(0, 4).map((a, i) => (
                                                    <Reveal key={a.key} delay={i * 70} className="h-full">
                                                        <Link
                                                            href={a.href}
                                                            className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#450D15]/10 bg-[#FAF5F6]/65 shadow-[0_12px_32px_-20px_rgba(69,13,21,0.18)] transition-all duration-300 hover:-translate-y-1 hover:border-[#450D15]/35 hover:bg-white hover:shadow-[0_20px_44px_-20px_rgba(69,13,21,0.24)]"
                                                        >
                                                            <div className="relative aspect-[16/10] overflow-hidden bg-brand-navy">
                                                                <img
                                                                    src={a.image}
                                                                    alt=""
                                                                    loading="lazy"
                                                                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                                                />
                                                                <span className="absolute top-3 left-3 rounded-full bg-[#450D15] px-3 py-0.5 text-[10px] font-semibold tracking-[0.16em] text-white uppercase shadow-xs">
                                                                    {a.cat}
                                                                </span>
                                                            </div>
                                                            <div className="flex flex-1 flex-col p-5">
                                                                <div className="text-[11px] font-medium tracking-[0.14em] text-[#5E121D] uppercase">
                                                                    {a.date}
                                                                </div>
                                                                <h3 className="mt-2 line-clamp-2 font-serif text-lg leading-snug font-medium text-[#091324] transition-colors group-hover:text-[#450D15]">
                                                                    {a.title}
                                                                </h3>
                                                                <p className="mt-2 line-clamp-2 flex-1 text-[13.5px] leading-relaxed text-[#4A4F5C]">
                                                                    {a.excerpt}
                                                                </p>
                                                                <div className="mt-4 inline-flex items-center gap-1.5 border-t border-[#450D15]/[0.08] pt-3 text-[12.5px] font-semibold text-[#450D15]">
                                                                    <span>Read dispatch</span>
                                                                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    </Reveal>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>
                        </section>
    );
}
