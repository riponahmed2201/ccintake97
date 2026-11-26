import { PrimaryCta } from '@/components/landing/cta';
import { LANDING_CONTAINER, LANDING_HERO_INNER } from '@/components/landing/layout';
import { ExploreLink, Reveal } from '@/components/landing/primitives';
import { useSignupDialog } from '@/contexts/signup-dialog-context';
import { HERO_INTERVAL, HERO_SLIDES } from '@/components/landing/constants';
import type { CmsData, CmsSlideItem, MergedCollege, WelcomeMetrics } from '@/components/landing/types';

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
                        stroke="#F4C2C7"
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
                        ? 'h-1.5 w-1.5 bg-brand-gold-bright'
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
    cmsSlides,
    heroConfig,
}: {
    metrics: WelcomeMetrics;
    mergedColleges: MergedCollege[];
    heroSlide: number;
    setHeroSlide: (n: number) => void;
    heroPaused: boolean;
    setHeroPaused: (v: boolean) => void;
    cmsSlides?: CmsSlideItem[];
    heroConfig?: CmsData['heroConfig'];
}) {
    const { openSignup } = useSignupDialog();
    const verifiedLabel = metrics.verified_members > 0 ? String(metrics.verified_members) : '—';
    const slides = cmsSlides && cmsSlides.length > 0 ? cmsSlides : HERO_SLIDES;
    const activeIndex = heroSlide % slides.length;

    return (
        <section className="relative isolate flex min-h-[calc(100svh-76px)] items-end overflow-hidden bg-brand-ink-deep text-brand-cream-text">
            {slides.map((sl, i) => {
                const active = i === activeIndex;
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
                        {sl.dim > 0 && <div className="absolute inset-0 bg-brand-ink-deep" style={{ opacity: Math.min(sl.dim * 0.45, 0.25) }} />}
                    </div>
                );
            })}
            <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#071018]/80 via-[#071018]/20 to-transparent" />
            <div className="absolute inset-x-0 top-0 -z-10 h-36 bg-gradient-to-b from-[#071018]/35 to-transparent" />
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#071018]/55 via-[#071018]/15 to-transparent" />

            <div className={`${LANDING_CONTAINER} ${LANDING_HERO_INNER}`}>
                <Reveal>
                    <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-[#F4C2C7]/30 bg-[#450D15]/85 px-4 py-1.5 text-[11px] font-medium tracking-[0.22em] text-white uppercase shadow-sm backdrop-blur-md">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#F4C2C7]" />
                        CCINTAKE 97 · Ten Cadet Colleges · Est. {metrics.intake_year}
                    </div>
                    <h1 className="max-w-4xl font-serif text-[3rem] leading-[0.98] font-semibold tracking-[-0.02em] sm:text-6xl lg:text-[6.25rem]">
                        {heroConfig?.headline || 'Different colleges.'}
                        <br />
                        <em className="font-normal italic text-brand-gold-bright">{heroConfig?.highlight || 'One intake.'}</em>
                    </h1>
                </Reveal>
                <Reveal delay={200}>
                    <p className="mt-7 max-w-xl text-base leading-relaxed text-brand-cream-text/80 sm:text-lg">
                        {heroConfig?.subtitle || `Ten cadet colleges. The intake of ${metrics.intake_year}.`}
                    </p>
                </Reveal>
                <Reveal delay={300}>
                    <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5">
                        <PrimaryCta as="button" variant="gold" onClick={openSignup}>
                            {heroConfig?.primary_cta || 'Apply for membership'}
                        </PrimaryCta>
                        <ExploreLink href="/about" light internal={false}>
                            {heroConfig?.secondary_cta || 'Explore our story'}
                        </ExploreLink>
                    </div>
                </Reveal>

                <Reveal delay={400}>
                    <div className="mt-14 flex flex-col gap-6 rounded-2xl border border-white/10 bg-[#071018]/55 px-6 py-5 backdrop-blur-md sm:mt-18 sm:flex-row sm:items-center sm:justify-between lg:px-8 lg:py-6">
                        <dl className="flex gap-10 sm:gap-16">
                            {[
                                { v: String(metrics.total_colleges), l: 'Colleges' },
                                { v: verifiedLabel, l: 'Verified', title: metrics.verified_members > 0 ? undefined : 'Updates as members verify' },
                                { v: String(metrics.intake_year), l: 'Intake' },
                            ].map((st) => (
                                <div key={st.l} title={st.title}>
                                    <dd className="font-sans text-3xl font-bold tracking-tight text-white tabular-nums sm:text-4xl">{st.v}</dd>
                                    <dt className="mt-1 text-[11px] font-medium tracking-[0.24em] text-brand-gold-bright/80 uppercase">{st.l}</dt>
                                </div>
                            ))}
                        </dl>
                        <div className="flex flex-col items-start gap-3 sm:items-end" onMouseEnter={() => setHeroPaused(true)} onMouseLeave={() => setHeroPaused(false)}>
                            <div key={activeIndex} className="flex animate-in items-center gap-3 duration-700 fade-in slide-in-from-bottom-1">
                                {(() => {
                                    const col = mergedColleges.find((c) => c.short_name === slides[activeIndex].college);
                                    return col?.logo_url ? <img src={col.logo_url} alt="" className="h-9 w-9 rounded-full bg-white object-contain p-0.5" /> : null;
                                })()}
                                <div className="sm:text-right">
                                    <div className="text-[14px] font-medium text-white">{slides[activeIndex].caption}</div>
                                    <div className="text-[11px] tracking-[0.18em] text-white/45 uppercase">
                                        {String(activeIndex + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-nowrap items-center justify-start gap-0.5 sm:justify-end" role="tablist" aria-label="Hero slides">
                                {slides.map((sl, i) => (
                                    <HeroSlideDot
                                        key={sl.src}
                                        active={i === activeIndex}
                                        passed={i < activeIndex}
                                        paused={heroPaused}
                                        slideKey={activeIndex}
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