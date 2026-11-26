import type { RefObject } from 'react';
import { ArrowRight } from 'lucide-react';
import { LANDING_CONTAINER, LANDING_SECTION, LANDING_SECTION_BODY } from '@/components/landing/layout';
import { CADET_COLLEGES_DATA, CAMPUS_PHOTOS, REGIONS } from '@/components/landing/constants';
import { PrimaryCta } from '@/components/landing/cta';
import { CollegeEmblem, ExploreLink, Reveal } from '@/components/landing/primitives';
import { useSignupDialog } from '@/contexts/signup-dialog-context';
import type { MergedCollege } from '@/components/landing/types';

export function LandingColleges({
    selectedRegion,
    setSelectedRegion,
    activeCollege,
    filteredColleges,
    featureRef,
    selectCollege,
    stepCollege,
    omitHeading = false,
    className = '',
}: {
    selectedRegion: string;
    setSelectedRegion: (r: string) => void;
    activeCollege: MergedCollege | undefined;
    filteredColleges: MergedCollege[];
    featureRef: RefObject<HTMLDivElement | null>;
    selectCollege: (code: string, scroll?: boolean) => void;
    stepCollege: (dir: 1 | -1) => void;
    omitHeading?: boolean;
    className?: string;
}) {
    const { openSignup } = useSignupDialog();

    const regionTabs = (
        <div className="-mx-5 snap-x snap-mandatory overflow-x-auto px-5 [scrollbar-width:none] sm:mx-0 sm:px-0">
            <div className="flex w-max min-w-full items-center gap-6 border-b border-[#091324]/10">
                {REGIONS.map((tab) => {
                    const active = selectedRegion === tab;
                    return (
                        <button
                            key={tab}
                            type="button"
                            onClick={() => setSelectedRegion(tab)}
                            className={`relative -mb-px border-b-2 pb-3 text-[14px] whitespace-nowrap transition-colors duration-300 ${
                                active
                                    ? 'border-[#450D15] font-semibold text-[#450D15]'
                                    : 'border-transparent font-medium text-[#091324]/75 hover:border-[#450D15]/35 hover:text-[#450D15]'
                            }`}
                        >
                            {tab === 'All' ? 'All (10)' : tab === 'Girls Colleges' ? 'Girls’' : tab}
                        </button>
                    );
                })}
            </div>
        </div>
    );

    return (
                        <section id={omitHeading ? undefined : 'colleges'} className={`${LANDING_SECTION} border-y border-[#450D15]/[0.06] bg-[#FAF5F6] ${className}`.trim()}>
                            <div className={LANDING_CONTAINER}>
                                {omitHeading ? (
                                    <Reveal>
                                        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                                            <div>
                                                <p className="text-[11px] font-medium tracking-[0.26em] text-[#5E121D] uppercase">
                                                    Select a Campus
                                                </p>
                                                <h2 className="mt-2 font-serif text-2xl font-medium text-[#091324] sm:text-3xl">
                                                    Browse by <em className="font-normal italic text-[#5E121D]">region.</em>
                                                </h2>
                                            </div>
                                            {regionTabs}
                                        </div>
                                    </Reveal>
                                ) : (
                                    <Reveal>
                                        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                                            <div className="max-w-2xl">
                                                <p className="text-[11px] font-medium tracking-[0.26em] text-[#5E121D] uppercase">
                                                    Constituent Network
                                                </p>
                                                <h2 className="mt-4 font-serif text-5xl leading-[1.02] font-medium tracking-[-0.01em] text-[#091324] lg:text-[3.75rem]">
                                                    Ten colleges. <em className="font-normal italic text-[#5E121D]">Equal voice.</em>
                                                </h2>
                                                <p className="mt-5 max-w-xl text-[16px] leading-relaxed text-[#4A4F5C]">
                                                    Every constituent college holds an equal seat in the Central Secretariat.
                                                </p>
                                            </div>
                                            {regionTabs}
                                        </div>
                                    </Reveal>
                                )}
        
                                {activeCollege && (
                                    <div className={`${LANDING_SECTION_BODY} space-y-4`}>
                                        {/* Featured banner */}
                                        <div ref={featureRef} className="relative isolate scroll-mt-24 overflow-hidden rounded-xl bg-brand-navy text-brand-cream-text ring-1 ring-brand-gold/30">
                                            <div key={activeCollege.short_name} className="animate-in duration-700 fade-in">
                                                {CAMPUS_PHOTOS[activeCollege.short_name] ? (
                                                    <img
                                                        src={CAMPUS_PHOTOS[activeCollege.short_name]}
                                                        alt={`${activeCollege.name} campus`}
                                                        className="absolute inset-0 -z-10 h-full w-full animate-[heroZoom_9s_ease-out_forwards] object-cover motion-reduce:animate-none transition-opacity duration-700"
                                                    />
                                                ) : (
                                                    <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_75%_30%,rgba(200,162,82,0.25),transparent_55%)]" />
                                                )}
                                            </div>
                                            <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
        
                                            <div className="flex min-h-[500px] flex-col justify-between p-6 sm:p-10 lg:min-h-[600px] lg:p-12">
                                                <div className="flex items-start justify-between text-[11px] tracking-[0.2em] uppercase">
                                                    <span className="text-[#F4C2C7]">
                                                        <span className="font-serif text-lg tracking-normal normal-case italic">{String(CADET_COLLEGES_DATA.findIndex((c) => c.short_name === activeCollege.short_name) + 1).padStart(2, '0')}</span>
                                                        <span className="text-[#F7F3EA]/45"> / {CADET_COLLEGES_DATA.length}</span>
                                                    </span>
                                                    <span className="text-[#F7F3EA]/70">Est. {activeCollege.established}</span>
                                                </div>
        
                                                <div key={activeCollege.short_name + '-info'} className="grid animate-in grid-cols-1 items-end gap-8 duration-500 fade-in slide-in-from-bottom-3 lg:grid-cols-12">
                                                    <div className="lg:col-span-7">
                                                        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-5">
                                                            <CollegeEmblem logo={activeCollege.logo_url} code={activeCollege.short_name} name={activeCollege.name} size={84} />
                                                            <div>
                                                                <h3 className="font-serif text-[2.1rem] leading-[1.05] font-medium sm:text-5xl">{activeCollege.name}</h3>
                                                                <p className="mt-2 font-serif text-lg text-[#F4C2C7] italic">{activeCollege.tagline}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="lg:col-span-5">
                                                        <dl className="grid grid-cols-3 gap-4 border-t border-[#F7F3EA]/20 pt-5">
                                                            {[
                                                                { k: 'Location', v: activeCollege.location },
                                                                { k: 'Region', v: activeCollege.region },
                                                                { k: 'Intake ’97', v: activeCollege.cohort },
                                                            ].map((d) => (
                                                                <div key={d.k}>
                                                                    <dt className="text-[10.5px] tracking-[0.2em] text-[#F7F3EA]/50 uppercase">{d.k}</dt>
                                                                    <dd className="mt-1 text-[14px] font-medium">{d.v}</dd>
                                                                </div>
                                                            ))}
                                                        </dl>
                                                        <div className="mt-6 flex items-center justify-between">
                                                            <div className="flex gap-2">
                                                                <button type="button" aria-label="Previous college" onClick={() => stepCollege(-1)} className="flex h-11 w-11 items-center justify-center rounded-full border border-[#F7F3EA]/30 backdrop-blur-sm transition-colors hover:bg-white hover:text-[#0B1220]">
                                                                    <ArrowRight className="h-4 w-4 rotate-180" />
                                                                </button>
                                                                <button type="button" aria-label="Next college" onClick={() => stepCollege(1)} className="flex h-11 w-11 items-center justify-center rounded-full border border-[#F7F3EA]/30 backdrop-blur-sm transition-colors hover:bg-white hover:text-[#0B1220]">
                                                                    <ArrowRight className="h-4 w-4" />
                                                                </button>
                                                            </div>
                                                            {activeCollege.website && (
                                                                <ExploreLink href={activeCollege.website} light>Official website</ExploreLink>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
        
                                        {/* Photo tiles */}
                                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                                            {filteredColleges.map((col) => {
                                                const active = col.short_name === activeCollege.short_name;
                                                const photo = CAMPUS_PHOTOS[col.short_name];
                                                return (
                                                    <button
                                                        key={col.short_name}
                                                        type="button"
                                                        onClick={() => selectCollege(col.short_name, true)}
                                                        aria-pressed={active}
                                                        className="group relative isolate aspect-[4/3] overflow-hidden rounded-xl bg-brand-navy text-left text-white ring-1 ring-brand-navy/10"
                                                    >
                                                        {photo ? (
                                                            <img src={photo} alt="" loading="lazy" className="absolute inset-0 -z-10 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" />
                                                        ) : (
                                                            <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_70%_25%,rgba(201,165,92,0.3),transparent_60%)]" />
                                                        )}
                                                        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                                        <div className={`absolute inset-0 transition-all duration-300 ${active ? 'ring-[3px] ring-[#450D15] ring-inset' : ''}`} />
                                                        <div className="absolute inset-x-0 bottom-0 flex items-center gap-2.5 p-3 sm:p-4">
                                                            <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white ring-1 ring-white/50">
                                                                {col.logo_url ? (
                                                                    <img src={col.logo_url} alt="" className="h-full w-full object-contain p-0.5" />
                                                                ) : (
                                                                    <span className="font-serif text-[10px] text-[#0B1220]">{col.short_name}</span>
                                                                )}
                                                            </span>
                                                            <span className="min-w-0">
                                                                <span className="block truncate text-[13.5px] leading-tight font-semibold">{col.name.replace(/ Cadet College$/, '')}</span>
                                                                <span className="block text-[11px] text-white/65">Est. {col.established}</span>
                                                            </span>
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                <Reveal delay={200}>
                                    <div className="mt-14 flex justify-center">
                                        <PrimaryCta as="button" variant="gold" onClick={openSignup}>
                                            Apply for membership
                                        </PrimaryCta>
                                    </div>
                                </Reveal>
                            </div>
                        </section>
    );
}
