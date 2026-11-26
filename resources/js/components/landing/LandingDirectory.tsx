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
                                                    className="flex h-12 w-12 items-center justify-center rounded-full border border-brand-navy/15 text-brand-navy transition-colors hover:border-[#450D15] hover:bg-[#450D15] hover:text-white"
                                                >
                                                    <ArrowRight className="h-4 w-4 rotate-180" />
                                                </button>
                                                <button
                                                    type="button"
                                                    aria-label="Next profile"
                                                    onClick={() => scrollSpotlight(1)}
                                                    className="flex h-12 w-12 items-center justify-center rounded-full border border-brand-navy/15 text-brand-navy transition-colors hover:border-[#450D15] hover:bg-[#450D15] hover:text-white"
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
                                            className="group flex w-[78vw] shrink-0 snap-start flex-col overflow-hidden rounded-3xl border border-[#450D15]/12 bg-white text-[#091324] shadow-[0_14px_34px_-18px_rgba(69,13,21,0.18)] transition-all duration-300 hover:-translate-y-1.5 hover:border-[#450D15]/40 hover:shadow-[0_24px_50px_-20px_rgba(69,13,21,0.26)] sm:w-[290px]"
                                        >
                                            <div className="relative h-56 w-full overflow-hidden bg-[#FAF5F6]">
                                                {m.photo ? (
                                                    <img
                                                        src={m.photo}
                                                        alt={m.name}
                                                        loading="lazy"
                                                        className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#FAF5F6] to-[#F2E6E8]">
                                                        <span className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[#6E1622] to-[#450D15] font-serif text-3xl font-semibold text-[#F4C2C7] shadow-md ring-4 ring-white">
                                                            {m.initials}
                                                        </span>
                                                    </div>
                                                )}

                                                <div className="absolute top-3.5 right-3.5 left-3.5 flex items-center justify-between">
                                                    <span className="flex items-center gap-1.5 rounded-full bg-white/95 py-1 pr-2.5 pl-1 text-[11px] font-semibold text-[#091324] shadow-xs ring-1 ring-[#450D15]/10 backdrop-blur-sm">
                                                        <span className="flex h-5 w-5 items-center justify-center overflow-hidden rounded-full bg-white">
                                                            {col?.logo_url ? (
                                                                <img src={col.logo_url} alt="" className="h-full w-full object-contain p-0.5" />
                                                            ) : (
                                                                <span className="text-[8px] font-bold text-[#450D15]">{m.college}</span>
                                                            )}
                                                        </span>
                                                        {m.college} ’97
                                                    </span>
                                                    {usingSamples ? (
                                                        <span className="rounded-full bg-white/95 px-2.5 py-0.5 text-[10px] font-semibold tracking-wide text-[#5E121D] uppercase ring-1 ring-[#450D15]/15">
                                                            Sample
                                                        </span>
                                                    ) : (
                                                        <span
                                                            className="flex h-7 w-7 items-center justify-center rounded-full bg-[#450D15] text-[#F4C2C7] shadow-xs ring-1 ring-[#F4C2C7]/40"
                                                            aria-label="Verified"
                                                        >
                                                            <ShieldCheck className="h-4 w-4" />
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex flex-1 flex-col p-5">
                                                <h3 className="line-clamp-1 font-serif text-[20px] leading-snug font-medium text-[#091324] transition-colors group-hover:text-[#450D15]">
                                                    {m.name}
                                                </h3>
                                                <p className="mt-1 line-clamp-1 text-[13.5px] text-[#4A4F5C]">
                                                    {m.role}
                                                </p>
                                                {m.location && (
                                                    <div className="mt-2.5 inline-flex items-center gap-1.5 text-[12px] text-[#4A4F5C]">
                                                        <MapPin className="h-3.5 w-3.5 shrink-0 text-[#5E121D]" />
                                                        <span className="truncate">{m.location}</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex items-center justify-between border-t border-[#450D15]/[0.08] bg-[#FAF5F6]/70 px-5 py-3 text-[13px] font-semibold text-[#450D15] transition-colors duration-300 group-hover:bg-[#450D15] group-hover:text-white">
                                                <span>View Dossier</span>
                                                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                                            </div>
                                        </Link>
                                    );
                                })}
        
                                {/* Final card — invitation */}
                                <Link
                                    href="/directory"
                                    data-card
                                    className="group flex h-[402px] w-[78vw] shrink-0 snap-start flex-col justify-between rounded-3xl border border-[#F4C2C7]/20 bg-gradient-to-br from-[#6E1622] via-[#450D15] to-[#2E080E] p-7 text-white shadow-[0_20px_50px_-20px_rgba(69,13,21,0.5)] transition-all duration-300 hover:-translate-y-1.5 sm:w-[290px]"
                                >
                                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-[#F4C2C7]">
                                        <Users className="h-6 w-6" strokeWidth={1.6} />
                                    </span>
                                    <div>
                                        <div className="font-sans text-[52px] leading-none font-bold tabular-nums text-white">{metrics.verified_members}</div>
                                        <div className="mt-3 font-serif text-[22px] leading-snug font-medium text-white/95">batchmates across 34 nations</div>
                                        <span className="mt-6 inline-flex items-center gap-2 text-[14px] font-semibold text-[#F4C2C7]">
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
                                            className="flex w-full items-center gap-2 rounded-full border border-[#450D15]/15 bg-[#FAF5F6]/70 p-1.5 pl-5 focus-within:border-[#450D15]/40 focus-within:bg-white lg:max-w-xl"
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
                                            <button type="submit" className="flex h-12 shrink-0 items-center gap-2 rounded-full bg-gradient-to-r from-[#6E1622] via-[#450D15] to-[#5E121D] px-7 text-[15px] font-semibold text-white shadow-[0_10px_24px_-8px_rgba(94,18,29,0.5)] transition-all duration-300 hover:brightness-110">
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
                                                        className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-white ring-2 ring-[#450D15]/25 transition-transform duration-300 hover:z-10 hover:-translate-y-1 hover:scale-110"
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
