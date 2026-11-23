import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import { ExploreLink, Reveal } from '@/components/landing/primitives';
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
            <div className="absolute inset-0 -z-10 bg-gradient-to-t from-brand-ink-deep via-brand-ink-deep/40 to-brand-ink-deep/5" />
            <div className="absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-brand-ink-deep/60 to-transparent" />
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-brand-ink-deep/75 via-brand-ink-deep/20 to-transparent" />

            <div className="mx-auto w-full max-w-[1440px] px-5 pt-40 pb-14 sm:px-8 lg:px-10 lg:pb-16">
                <Reveal>
                    <h2 className="max-w-4xl font-serif text-[3.25rem] leading-[0.98] font-medium tracking-[-0.02em] sm:text-7xl lg:text-[6rem]">
                        Different colleges.
                        <br />
                        <span className="font-normal text-[#E8D5A3]">One intake.</span>
                    </h2>
                </Reveal>
                <Reveal delay={200}>
                    <p className="mt-7 max-w-lg text-base leading-relaxed text-brand-cream-text/75 sm:text-lg">
                        500 cadets. Ten colleges. A lifetime of brotherhood that began on the parade grounds of {metrics.intake_year}.
                    </p>
                </Reveal>
                <Reveal delay={300}>
                    <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5">
                        <Link
                            href="/register-alumni"
                            className="group inline-flex items-center gap-3 rounded-full bg-brand-cream-text px-7 py-4 text-sm font-semibold text-brand-navy transition-all duration-300 hover:bg-white"
                        >
                            Apply for membership
                            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </Link>
                        <ExploreLink href="#about" light>
                            Explore our story
                        </ExploreLink>
                    </div>
                </Reveal>

                <Reveal delay={400}>
                    <div className="mt-20 flex flex-col gap-6 border-t border-brand-cream-text/15 pt-6 sm:flex-row sm:items-end sm:justify-between">
                        <dl className="flex gap-10 sm:gap-14">
                            {[
                                { v: String(metrics.total_colleges), l: 'Colleges' },
                                { v: String(metrics.verified_members), l: 'Verified' },
                                { v: String(metrics.intake_year), l: 'Intake' },
                            ].map((st) => (
                                <div key={st.l}>
                                    <dd className="font-serif text-4xl font-medium sm:text-5xl">{st.v}</dd>
                                    <dt className="mt-1 text-[11px] font-medium tracking-[0.24em] text-brand-cream-text/55 uppercase">{st.l}</dt>
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