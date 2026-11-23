import { Link } from '@inertiajs/react';
import { ArrowUpRight } from 'lucide-react';
import { FALLBACK_ARTICLES, FALLBACK_BUSINESSES, NEWS_FALLBACK_PHOTOS } from '@/components/landing/constants';
import { ExploreLink, SectionHeading, Reveal } from '@/components/landing/primitives';
import type { Article, Business } from '@/types/intake97';

export function LandingNews({
    articles,
    businesses = [],
}: {
    articles: Article[];
    businesses?: Business[];
}) {
    return (
                        <section id="news" className="scroll-mt-20 bg-[#F4F2EE] py-24 lg:py-32">
                            <span id="businesses" className="sr-only" />
                            <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-10">
                                <SectionHeading
                                    index="07"
                                    eyebrow="Community"
                                    title={<>News &amp; <em className="font-normal text-[#9A7B3F]">ventures.</em></>}
                                    action={<ExploreLink href="#news" internal>All dispatches</ExploreLink>}
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
                                        : FALLBACK_ARTICLES.map((a) => ({ key: a.title, ...a, image: null as string | null, slug: '', href: '#news' }))
                                    ).map((a, i) => ({ ...a, image: a.image || NEWS_FALLBACK_PHOTOS[i % NEWS_FALLBACK_PHOTOS.length] }));
                                    const [lead, ...rest] = news;
                                    const ventures = businesses.length > 0
                                        ? businesses.map((b) => ({ key: String(b.id), tag: b.industry?.name || 'Enterprise', lead: b.name, sector: b.description || 'Alumni-owned venture', city: b.city || 'Dhaka' }))
                                        : FALLBACK_BUSINESSES.map((b) => ({ key: b.lead, ...b }));
        
                                    return (
                                        <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-14">
                                            <div className="lg:col-span-7">
                                                {lead && (
                                                    <Reveal>
                                                        <Link href={lead.href} className="group block">
                                                            <div className="aspect-[16/10] overflow-hidden bg-[#0B1220]">
                                                                <img src={lead.image} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105" />
                                                            </div>
                                                            <div className="mt-6 flex items-center gap-3 text-[11px] tracking-[0.18em] uppercase">
                                                                <span className="text-[#9A7B3F]">{lead.cat}</span>
                                                                <span className="text-[#0B1220]/35">{lead.date}</span>
                                                            </div>
                                                            <h3 className="mt-3 font-serif text-3xl leading-[1.15] text-[#0B1220] sm:text-[2.25rem]">{lead.title}</h3>
                                                            <p className="mt-3 line-clamp-2 max-w-2xl text-[15px] leading-relaxed text-[#4A4F5C]">{lead.excerpt}</p>
                                                        </Link>
                                                    </Reveal>
                                                )}
                                                {rest.length > 0 && (
                                                    <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2">
                                                        {rest.slice(0, 2).map((a, i) => (
                                                            <Reveal key={a.key} delay={i * 80}>
                                                                <Link href={a.href} className="group flex gap-4">
                                                                    <div className="h-24 w-28 shrink-0 overflow-hidden bg-[#0B1220]">
                                                                        <img src={a.image} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                                                    </div>
                                                                    <div className="min-w-0">
                                                                        <div className="text-[10.5px] tracking-[0.18em] text-[#9A7B3F] uppercase">{a.cat}</div>
                                                                        <h4 className="mt-1.5 line-clamp-3 font-serif text-lg leading-snug text-[#0B1220] group-hover:underline group-hover:decoration-[#9A7B3F]/50 group-hover:underline-offset-4">{a.title}</h4>
                                                                    </div>
                                                                </Link>
                                                            </Reveal>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
        
                                            <div className="lg:col-span-5">
                                                <Reveal>
                                                    <div className="flex items-end justify-between border-b border-[#0B1220]/15 pb-4">
                                                        <h3 className="font-serif text-2xl text-[#0B1220]">Built by batchmates</h3>
                                                        <ExploreLink href="/directory" internal={false}>Directory</ExploreLink>
                                                    </div>
                                                </Reveal>
                                                <ul className="divide-y divide-[#0B1220]/10">
                                                    {ventures.slice(0, 5).map((b, i) => (
                                                        <Reveal key={b.key} delay={i * 60}>
                                                            <li>
                                                                <Link href={`/directory?search=${encodeURIComponent(b.lead)}`} className="group flex items-center gap-4 py-5">
                                                                    <span className="w-6 font-serif text-sm text-[#9A7B3F] italic">{String(i + 1).padStart(2, '0')}</span>
                                                                    <div className="min-w-0 flex-1">
                                                                        <div className="truncate font-serif text-xl text-[#0B1220] transition-transform duration-500 group-hover:translate-x-1">{b.lead}</div>
                                                                        <div className="mt-0.5 truncate text-[13px] text-[#4A4F5C]">{b.sector} · {b.city}</div>
                                                                    </div>
                                                                    <ArrowUpRight className="h-4 w-4 shrink-0 text-[#0B1220]/30 transition-colors group-hover:text-[#9A7B3F]" />
                                                                </Link>
                                                            </li>
                                                        </Reveal>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>
                        </section>
    );
}
