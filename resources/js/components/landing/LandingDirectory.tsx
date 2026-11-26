import { Link, router, usePage } from '@inertiajs/react';
import { ArrowRight, Lock, MapPin, Search, ShieldCheck, Users } from 'lucide-react';
import { CAMPUS_PHOTOS, SAMPLE_VERIFIED_MEMBERS } from '@/components/landing/constants';
import { LANDING_BLEED, LANDING_CONTAINER, LANDING_SCROLL_TRACK, LANDING_SECTION, LANDING_SECTION_BODY } from '@/components/landing/layout';
import { ExploreLink, Reveal, SectionHeading } from '@/components/landing/primitives';
import type { DirectoryPreviewMember, MergedCollege, WelcomeMetrics } from '@/components/landing/types';
import type { FormEvent, RefObject } from 'react';

export function LandingDirectory({
    directoryPreview,
    mergedColleges,
    metrics,
    spotlightRef,
    spotlightPaused,
    setSpotlightPaused,
    scrollSpotlight,
    directorySearch,
    setDirectorySearch,
    submitDirectorySearch,
}: {
    directoryPreview: DirectoryPreviewMember[];
    mergedColleges: MergedCollege[];
    metrics: WelcomeMetrics;
    spotlightRef: RefObject<HTMLDivElement | null>;
    spotlightPaused: boolean;
    setSpotlightPaused: (v: boolean) => void;
    scrollSpotlight: (dir: 1 | -1) => void;
    directorySearch: string;
    setDirectorySearch: (v: string) => void;
    submitDirectorySearch: (e?: FormEvent) => void;
}) {
    const { auth } = usePage().props as { auth?: { user?: unknown } };
    const usingSamples = directoryPreview.length < 4;

    return (
                        <section id="directory" className={`relative isolate overflow-hidden bg-white text-brand-navy ${LANDING_SECTION}`}>
                            <div className={LANDING_CONTAINER}>
                                <SectionHeading
                                    eyebrow="Batch directory"
                                    title={
                                        <>
                                            Meet the <em className="font-normal text-brand-gold-muted">batch.</em>
                                        </>
                                    }
                                    intro="Generals, surgeons, diplomats and founders — still the same cadets who stood the 0530 muster together."
                                    action={
                                        <div className="flex flex-wrap items-center gap-4">
                                            <ExploreLink href="/directory" internal={false}>
                                                Open directory
                                            </ExploreLink>
                                            <div className="flex gap-2" role="group" aria-label="Scroll spotlight">
                                                <button
                                                    type="button"
                                                    aria-label="Previous profile"
                                                    onClick={() => scrollSpotlight(-1)}
                                                    className="flex h-12 w-12 items-center justify-center rounded-full border border-brand-navy/15 text-brand-navy transition-colors hover:bg-brand-navy hover:text-brand-cream-text"
                                                >
                                                    <ArrowRight className="h-4 w-4 rotate-180" />
                                                </button>
                                                <button
                                                    type="button"
                                                    aria-label="Next profile"
                                                    onClick={() => scrollSpotlight(1)}
                                                    className="flex h-12 w-12 items-center justify-center rounded-full border border-brand-navy/15 text-brand-navy transition-colors hover:bg-brand-navy hover:text-brand-cream-text"
                                                >
                                                    <ArrowRight className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    }
                                />
                            </div>
        
                            {/* Carousel track */}
                            <div
                                ref={spotlightRef}
                                onMouseEnter={() => setSpotlightPaused(true)}
                                onMouseLeave={() => setSpotlightPaused(false)}
                                onFocus={() => setSpotlightPaused(true)}
                                onBlur={() => setSpotlightPaused(false)}
                                onTouchStart={() => setSpotlightPaused(true)}
                                className={`${LANDING_SCROLL_TRACK} pb-4 ${LANDING_SECTION_BODY} ${LANDING_BLEED}`}
                            >
                                {(directoryPreview.length >= 4
                                    ? directoryPreview.map((d) => ({
                                          key: `m${d.id}`,
                                          href: auth?.user ? `/member/directory/${d.id}` : `/directory/${d.id}`,
                                          name: d.name,
                                          post: '',
                                          initials: d.initials,
                                          role: [d.designation, d.organization].filter(Boolean).join(' · ') || 'Verified batchmate',
                                          college: d.college?.short_name ?? '',
                                          location: d.city || '',
                                          photo: d.photo_url,
                                      }))
                                    : SAMPLE_VERIFIED_MEMBERS.map((m) => ({
                                          key: m.name,
                                          href: '/directory',
                                          name: m.name,
                                          post: m.post,
                                          initials: m.initials,
                                          role: m.role,
                                          college: m.code.split(' ')[0],
                                          location: m.location,
                                          photo: null as string | null,
                                      }))
                                ).map((m) => {
                                    const col = mergedColleges.find((c) => c.short_name === m.college);
                                    return (
                                        <Link
                                            key={m.key}
                                            href={m.href}
                                            data-card
                                            className="group flex w-[78vw] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-[#091324]/[0.08] bg-white text-[#091324] shadow-[0_8px_28px_-14px_rgba(9,19,36,0.12)] transition-all duration-300 hover:-translate-y-1 hover:border-[#C9A55C]/60 hover:shadow-[0_22px_45px_-20px_rgba(9,19,36,0.2)] sm:w-[290px]"
                                        >
                                            <div className="relative h-56 w-full overflow-hidden bg-[#FAF8F3]">
                                                {m.photo ? (
                                                    <img
                                                        src={m.photo}
                                                        alt={m.name}
                                                        loading="lazy"
                                                        className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#FAF8F3] to-[#EFEAE0]">
                                                        <span className="flex h-24 w-24 items-center justify-center rounded-full bg-[#091324] font-serif text-3xl font-semibold text-[#E8D5A3] shadow-sm ring-2 ring-[#C9A55C]/30">
                                                            {m.initials}
                                                        </span>
                                                    </div>
                                                )}

                                                <div className="absolute top-3 right-3 left-3 flex items-center justify-between">
                                                    <span className="flex items-center gap-1.5 rounded-full bg-white/95 py-1 pr-2.5 pl-1 text-[11px] font-semibold text-[#0B1220] shadow-xs ring-1 ring-[#0B1220]/10 backdrop-blur-sm">
                                                        <span className="flex h-5 w-5 items-center justify-center overflow-hidden rounded-full bg-white">
                                                            {col?.logo_url ? (
                                                                <img src={col.logo_url} alt="" className="h-full w-full object-contain p-0.5" />
                                                            ) : (
                                                                <span className="text-[8px] font-bold text-[#0B1220]">{m.college}</span>
                                                            )}
                                                        </span>
                                                        {m.college} ’97
                                                    </span>
                                                    {usingSamples ? (
                                                        <span className="rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-[#4A4F5C] uppercase ring-1 ring-[#0B1220]/10">
                                                            Sample
                                                        </span>
                                                    ) : (
                                                        <span
                                                            className="flex h-7 w-7 items-center justify-center rounded-full bg-white/95 text-emerald-600 shadow-xs ring-1 ring-[#0B1220]/10"
                                                            aria-label="Verified"
                                                        >
                                                            <ShieldCheck className="h-4 w-4" />
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex flex-1 flex-col p-5">
                                                <h3 className="line-clamp-1 text-[17px] leading-snug font-bold text-[#0B1220] transition-colors group-hover:text-[#1B84FF]">
                                                    {m.name}
                                                </h3>
                                                <p className="mt-1 line-clamp-1 text-[13px] text-[#4A4F5C]">
                                                    {m.role}
                                                </p>
                                                {m.location && (
                                                    <div className="mt-2.5 inline-flex items-center gap-1 text-[12px] text-[#78829D]">
                                                        <MapPin className="h-3.5 w-3.5 shrink-0" />
                                                        <span className="truncate">{m.location}</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex items-center justify-between border-t border-[#F1F1F4] px-5 py-3 text-[13px] font-semibold text-[#1B84FF]">
                                                <span>View Profile</span>
                                                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                                            </div>
                                        </Link>
                                    );
                                })}
        
                                {/* Final card — invitation */}
                                <Link
                                    href="/directory"
                                    data-card
                                    className="group flex h-[420px] w-[78vw] shrink-0 snap-start flex-col justify-between rounded-xl border border-brand-navy/10 bg-slate-50 p-7 text-brand-navy sm:w-[300px]"
                                >
                                    <Users className="h-8 w-8" strokeWidth={1.5} />
                                    <div>
                                        <div className="text-[56px] leading-none font-semibold tabular-nums">{metrics.verified_members}</div>
                                        <div className="mt-2 text-[22px] leading-tight font-semibold">batchmates across 34 nations</div>
                                        <span className="mt-6 inline-flex items-center gap-2 text-[15px] font-medium">
                                            Browse everyone <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                        </span>
                                    </div>
                                </Link>
                            </div>
        
                            {/* Search strip */}
                            <div className={`${LANDING_CONTAINER} ${LANDING_SECTION_BODY}`}>
                                <Reveal>
                                    <div className="flex flex-col gap-6 border-t border-brand-navy/10 pt-10 lg:flex-row lg:items-center lg:justify-between">
                                        <form
                                            onSubmit={submitDirectorySearch}
                                            className="flex w-full items-center gap-2 rounded-full border border-brand-navy/10 bg-slate-50 p-1.5 pl-5 lg:max-w-xl"
                                        >
                                            <Search className="h-5 w-5 shrink-0 text-[#0B1220]/40" />
                                            <input
                                                type="text"
                                                value={directorySearch}
                                                onChange={(e) => setDirectorySearch(e.target.value)}
                                                placeholder={`Search ${metrics.total_members} batchmates by name`}
                                                aria-label="Search the directory"
                                                className="h-12 min-w-0 flex-1 border-0 bg-transparent text-[16px] text-[#0B1220] placeholder:text-[#0B1220]/40 focus:ring-0 focus:outline-none"
                                            />
                                            <button type="submit" className="flex h-12 shrink-0 items-center gap-2 rounded-full bg-[#0B1220] px-7 text-[15px] font-medium text-white hover:bg-[#1A2438]">
                                                Search
                                            </button>
                                        </form>
                                        <div className="flex items-center gap-4">
                                            <span className="hidden text-[13px] text-brand-navy/50 sm:block">Browse by college</span>
                                            <div className="flex -space-x-2">
                                                {mergedColleges.map((c) => (
                                                    <button
                                                        key={c.short_name}
                                                        type="button"
                                                        title={c.name}
                                                        aria-label={`Browse ${c.name}`}
                                                        onClick={() => router.get(typeof c.id === 'number' ? `/directory?college_id=${c.id}` : '/directory')}
                                                        className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-white ring-2 ring-[#0B1220] transition-transform duration-300 hover:z-10 hover:-translate-y-1 hover:scale-110"
                                                    >
                                                        {c.logo_url ? <img src={c.logo_url} alt="" className="h-full w-full object-contain p-0.5" /> : <span className="text-[9px] font-semibold text-[#0B1220]">{c.short_name}</span>}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <p className="mt-6 flex items-center gap-2 text-[13px] text-brand-navy/50">
                                        <Lock className="h-3.5 w-3.5" /> Phone, email and WhatsApp are visible only to verified batchmates.
                                    </p>
                                </Reveal>
                            </div>
                        </section>
    );
}
