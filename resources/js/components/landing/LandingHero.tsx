import { PrimaryCta } from '@/components/landing/cta';
import { LANDING_CONTAINER, LANDING_HERO_INNER } from '@/components/landing/layout';
import { ExploreLink, Reveal } from '@/components/landing/primitives';
import { useSignupDialog } from '@/contexts/signup-dialog-context';
import { HERO_INTERVAL, HERO_SLIDES } from '@/components/landing/constants';
import type { MergedCollege, WelcomeMetrics } from '@/components/landing/types';

const HERO_DOT_RING_R = 6;
const HERO_DOT_RING_C = 2 * Math.PI * HERO_DOT_RING_R;

function HeroSlideDot({
    active,
    passed,
    paused,
    slideKey,
    label,
    onSelect,
}: {
    active: boolean;
    passed: boolean;
    paused: boolean;
    slideKey: number;
    label: string;
    onSelect: () => void;
}) {
    return (
        <button
            type="button"
            role="tab"
            aria-selected={active}
            aria-label={label}
            onClick={onSelect}
            className="group relative flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
        >
            {active && (
                <svg className="absolute inset-0 -rotate-90" viewBox="0 0 20 20" aria-hidden>
                    <circle cx="10" cy="10" r={HERO_DOT_RING_R} fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="1.75" />
                    <circle
                        key={`${slideKey}-${paused ? 'p' : 'r'}`}
                        cx="10"
                        cy="10"
                        r={HERO_DOT_RING_R}
                        fill="none"
                        stroke="#E8D5A3"
                        strokeWidth="1.75"
                        strokeLinecap="round"
                        strokeDasharray={HERO_DOT_RING_C}
                        className="motion-reduce:!stroke-dashoffset-0 motion-reduce:![animation:none]"
                        style={{
                            strokeDashoffset: paused ? 0 : HERO_DOT_RING_C,
                            animation: paused ? 'none' : `heroProgressRing ${HERO_INTERVAL}ms linear forwards`,
                        }}
                    />
                </svg>
            )}
            <span
                className={`rounded-full transition-all duration-300 ${
                    active
                        ? 'h-1.5 w-1.5 bg-[#E8D5A3]'
                        : passed
                          ? 'h-1.5 w-1.5 bg-white/55 group-hover:bg-white/75'
                          : 'h-1.5 w-1.5 bg-white/25 group-hover:bg-white/50'
                }`}
            />
        </button>
    );
}

export function LandingHero({
    metrics,
    mergedColleges,
    heroSlide,
    setHeroSlide,
    heroPaused,
    setHeroPaused,
}: {
    metrics: WelcomeMetrics;
    mergedColleges: MergedCollege[];
    heroSlide: number;
    setHeroSlide: (n: number) => void;
    heroPaused: boolean;
    setHeroPaused: (v: boolean) => void;
}) {
    const { openSignup } = useSignupDialog();
    const verifiedLabel = metrics.verified_members > 0 ? String(metrics.verified_members) : '—';

    return (
        <section className="relative isolate flex min-h-[100svh] items-end overflow-hidden bg-brand-ink-deep text-brand-cream-text">
            {HERO_SLIDES.map((sl, i) => {
                const active = i === heroSlide;
                return (
                    <div key={sl.src} aria-hidden={!active} className={`absolute inset-0 -z-20 transition-opacity duration-[1600ms] ease-in-out ${active ? 'opacity-100' : 'opacity-0'}`}>
                        <img
                            key={active ? `${sl.src}-on` : sl.src}
                            src={sl.src}
                            alt={active ? sl.caption : ''}
                            fetchPriority={i === 0 ? 'high' : 'low'}
                            decoding="async"
                            style={{ objectPosition: sl.position }}
                            className={`h-full w-full object-cover ${active ? 'animate-[heroZoom_9s_ease-out_forwards] motion-reduce:animate-none' : 'scale-105'}`}
                        />
                        {sl.dim > 0 && <div className="absolute inset-0 bg-brand-ink-deep" style={{ opacity: sl.dim }} />}
                    </div>
                );
            })}
            <div className="absolute inset-0 -z-10 bg-gradient-to-t from-brand-ink-deep via-brand-ink-deep/50 to-brand-ink-deep/15" />
            <div className="absolute inset-x-0 top-0 -z-10 h-44 bg-gradient-to-b from-brand-ink-deep/70 to-transparent" />
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-brand-ink-deep/85 via-brand-ink-deep/35 to-transparent" />

            <div className={`${LANDING_CONTAINER} ${LANDING_HERO_INNER}`}>
                <Reveal>
                    <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-[#E8D5A3]/30 bg-white/[0.06] px-4 py-1.5 backdrop-blur-md">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#E8D5A3]" />
                        <span className="text-[11px] font-medium tracking-[0.26em] text-[#E8D5A3] uppercase">
                            Est. 1997 · Bangladesh Cadet Colleges
                        </span>
                    </div>
                    <h1 className="max-w-4xl font-serif text-[3rem] leading-[0.98] font-semibold tracking-[-0.02em] sm:text-6xl lg:text-[6.25rem]">
                        Different colleges.
                        <br />
                        <em className="font-normal italic text-[#E8D5A3]">One intake.</em>
                    </h1>
                </Reveal>
                <Reveal delay={200}>
                    <p className="mt-7 max-w-xl text-base leading-relaxed text-brand-cream-text/80 sm:text-lg">
                        500 cadets across ten colleges — united since {metrics.intake_year} in service, leadership, and a lifetime of brotherhood.
                    </p>
                </Reveal>
                <Reveal delay={300}>
                    <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5">
                        <PrimaryCta as="button" variant="cream" onClick={openSignup}>
                            Apply for membership
                        </PrimaryCta>
                        <ExploreLink href="/about" light internal={false}>
                            Explore our story
                        </ExploreLink>
                    </div>
                </Reveal>

                <Reveal delay={400}>
                    <div className="mt-16 flex flex-col gap-6 border-t border-[#E8D5A3]/20 pt-8 sm:mt-20 sm:flex-row sm:items-end sm:justify-between lg:pt-10">
                        <dl className="flex gap-10 sm:gap-16">
                            {[
                                { v: String(metrics.total_colleges), l: 'Colleges' },
                                { v: verifiedLabel, l: 'Verified', title: metrics.verified_members > 0 ? undefined : 'Updates as members verify' },
                                { v: String(metrics.intake_year), l: 'Intake' },
                            ].map((st) => (
                                <div key={st.l} title={st.title}>
                                    <dd className="font-serif text-4xl font-semibold text-white sm:text-5xl">{st.v}</dd>
                                    <dt className="mt-1.5 text-[11px] font-medium tracking-[0.24em] text-[#E8D5A3]/75 uppercase">{st.l}</dt>
                                </div>
                            ))}
                        </dl>
                        <div className="flex flex-col items-start gap-3 sm:items-end" onMouseEnter={() => setHeroPaused(true)} onMouseLeave={() => setHeroPaused(false)}>
                            <div key={heroSlide} className="flex animate-in items-center gap-3 duration-700 fade-in slide-in-from-bottom-1">
                                {(() => {
                                    const col = mergedColleges.find((c) => c.short_name === HERO_SLIDES[heroSlide].college);
                                    return col?.logo_url ? <img src={col.logo_url} alt="" className="h-9 w-9 rounded-full bg-white object-contain p-0.5" /> : null;
                                })()}
                                <div className="sm:text-right">
                                    <div className="text-[14px] font-medium text-white">{HERO_SLIDES[heroSlide].caption}</div>
                                    <div className="text-[11px] tracking-[0.18em] text-white/45 uppercase">
                                        {String(heroSlide + 1).padStart(2, '0')} / {String(HERO_SLIDES.length).padStart(2, '0')}
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-nowrap items-center justify-start gap-0.5 sm:justify-end" role="tablist" aria-label="Hero slides">
                                {HERO_SLIDES.map((sl, i) => (
                                    <HeroSlideDot
                                        key={sl.src}
                                        active={i === heroSlide}
                                        passed={i < heroSlide}
                                        paused={heroPaused}
                                        slideKey={heroSlide}
                                        label={sl.caption}
                                        onSelect={() => setHeroSlide(i)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </Reveal>
            </div>
        </section>
    );
}