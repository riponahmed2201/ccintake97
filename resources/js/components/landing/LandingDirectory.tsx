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
                        <section id="directory" className={`relative isolate overflow-hidden bg-[#0B1220] text-[#F7F3EA] ${LANDING_SECTION}`}>
                            <div className="pointer-events-none absolute inset-0 -z-10">
                                <div className="absolute -top-48 left-1/2 h-[640px] w-[1100px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(201,165,92,0.13),transparent_62%)]" />
                            </div>
        
                            <div className={LANDING_CONTAINER}>
                                <SectionHeading
                                    eyebrow="Batch directory"
                                    light
                                    title={
                                        <>
                                            Meet the <em className="font-normal text-[#E8D5A3]">batch.</em>
                                        </>
                                    }
                                    intro="Generals, surgeons, diplomats and founders — still the same cadets who stood the 0530 muster together."
                                    action={
                                        <div className="flex flex-wrap items-center gap-4">
                                            <ExploreLink href="/directory" light internal={false}>
                                                Open directory
                                            </ExploreLink>
                                            <div className="flex gap-2" role="group" aria-label="Scroll spotlight">
                                                <button
                                                    type="button"
                                                    aria-label="Previous profile"
                                                    onClick={() => scrollSpotlight(-1)}
                                                    className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 transition-colors hover:bg-white hover:text-[#0B1220]"
                                                >
                                                    <ArrowRight className="h-4 w-4 rotate-180" />
                                                </button>
                                                <button
                                                    type="button"
                                                    aria-label="Next profile"
                                                    onClick={() => scrollSpotlight(1)}
                                                    className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 transition-colors hover:bg-white hover:text-[#0B1220]"
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
                                          href: auth?.user ? `/member/directory/${d.id}` : `/directory?search=${encodeURIComponent(d.name)}`,
                                          name: d.name,
                                          post: '',
                                          initials: d.initials,
                                          role: [d.designation, d.organization].filter(Boolean).join(', ') || 'Verified batchmate',
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
                                    const bg = CAMPUS_PHOTOS[m.college];
                                    return (
                                        <Link
                                            key={m.key}
                                            href={m.href}
                                            data-card
                                            className="group relative isolate flex h-[420px] w-[78vw] shrink-0 snap-start flex-col overflow-hidden rounded-3xl bg-[#121B2E] sm:w-[300px]"
                                        >
                                            {bg && (
                                                <img src={bg} alt="" loading="lazy" className="absolute inset-0 -z-20 h-full w-full object-cover opacity-45 transition-transform duration-[1200ms] ease-out group-hover:scale-110" />
                                            )}
                                            <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#0B1220]/40 via-[#0B1220]/70 to-[#0B1220]" />
        
                                            <div className="flex items-center justify-between p-5">
                                                <span className="flex items-center gap-2 rounded-full bg-white/10 py-1 pr-3 pl-1 text-[12px] font-medium backdrop-blur-md">
                                                    <span className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full bg-white">
                                                        {col?.logo_url ? <img src={col.logo_url} alt="" className="h-full w-full object-contain p-0.5" /> : <span className="text-[8px] text-[#0B1220]">{m.college}</span>}
                                                    </span>
                                                    {m.college} ’97
                                                </span>
                                                {usingSamples ? (
                                                    <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium tracking-wide text-white/70 uppercase">Sample</span>
                                                ) : (
                                                    <ShieldCheck className="h-5 w-5 text-[#C9A55C]" aria-label="Verified" />
                                                )}
                                            </div>
        
                                            <div className="flex flex-1 items-center justify-center">
                                                <div className="rounded-full bg-gradient-to-b from-[#F3E3B5] to-[#9A7B3F] p-[3px] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.7)] transition-transform duration-500 group-hover:scale-105">
                                                    {m.photo ? (
                                                        <img src={m.photo} alt={m.name} className="h-28 w-28 rounded-full object-cover" />
                                                    ) : (
                                                        <span className="flex h-28 w-28 items-center justify-center rounded-full bg-[#0B1220] text-3xl font-semibold text-[#E8D5A3]">{m.initials}</span>
                                                    )}
                                                </div>
                                            </div>
        
                                            <div className="p-6 pt-0 text-center">
                                                <h3 className="text-[21px] leading-tight font-semibold">{m.name}</h3>
                                                <div className="mt-0.5 min-h-[1.25rem] text-[13px] text-[#F7F3EA]/45">{m.post}</div>
                                                <p className="mt-2 line-clamp-2 min-h-[2.6rem] text-[14px] leading-snug text-[#F7F3EA]/70">{m.role}</p>
                                                {m.location && (
                                                    <div className="mt-3 inline-flex items-center gap-1 text-[12.5px] text-[#E8D5A3]/80">
                                                        <MapPin className="h-3.5 w-3.5" /> {m.location}
                                                    </div>
                                                )}
                                            </div>
                                        </Link>
                                    );
                                })}
        
                                {/* Final card — invitation */}
                                <Link
                                    href="/directory"
                                    data-card
                                    className="group flex h-[420px] w-[78vw] shrink-0 snap-start flex-col justify-between rounded-3xl bg-gradient-to-br from-[#E8D5A3] to-[#B8924A] p-7 text-[#0B1220] sm:w-[300px]"
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
                                    <div className="flex flex-col gap-6 border-t border-white/10 pt-10 lg:flex-row lg:items-center lg:justify-between">
                                        <form
                                            onSubmit={submitDirectorySearch}
                                            className="flex w-full items-center gap-2 rounded-full bg-white p-1.5 pl-5 lg:max-w-xl"
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
                                            <span className="hidden text-[13px] text-[#F7F3EA]/45 sm:block">Browse by college</span>
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
                                    <p className="mt-6 flex items-center gap-2 text-[13px] text-[#F7F3EA]/40">
                                        <Lock className="h-3.5 w-3.5" /> Phone, email and WhatsApp are visible only to verified batchmates.
                                    </p>
                                </Reveal>
                            </div>
                        </section>
    );
}
