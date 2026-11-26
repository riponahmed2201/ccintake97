import { LANDING_CONTAINER, LANDING_SECTION, LANDING_SECTION_BODY } from '@/components/landing/layout';
import { Reveal, SectionHeading } from '@/components/landing/primitives';
import { SECTORS } from '@/components/landing/constants';

export function LandingSectors() {
    return (
        <section id="sectors" className={`bg-white ${LANDING_SECTION}`}>
            <div className={LANDING_CONTAINER}>
                <SectionHeading
                    eyebrow="Where we lead"
                    title={
                        <>
                            Across <em className="font-normal text-brand-gold-muted">every sector.</em>
                        </>
                    }
                    intro="From military commands and surgical theaters to boardrooms and diplomatic missions across six continents."
                />
                <div className={`grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 ${LANDING_SECTION_BODY}`}>
                    {SECTORS.map((s, i) => {
                        const Icon = s.icon;
                        return (
                            <Reveal key={s.title} delay={i * 60} className="h-full">
                                <article className="group flex h-full flex-col rounded-2xl border border-brand-navy/[0.08] bg-white p-7 shadow-[0_6px_24px_-14px_rgba(11,18,32,0.12)] transition-all duration-300 hover:-translate-y-1 hover:border-[#450D15]/45 hover:shadow-[0_22px_48px_-22px_rgba(11,18,32,0.2)]">
                                    <div className="flex items-start justify-between gap-4">
                                        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#091324] text-[#F4C2C7] transition-colors duration-300 group-hover:bg-[#5E121D] group-hover:text-white">
                                            <Icon className="h-5 w-5" strokeWidth={1.6} />
                                        </span>
                                        <div className="text-right">
                                            <div className="font-sans text-2xl font-bold tracking-tight text-brand-navy tabular-nums">{s.count}</div>
                                            <div className="text-[10px] font-semibold tracking-[0.16em] text-brand-navy/50 uppercase">{s.unit}</div>
                                        </div>
                                    </div>
                                    <h3 className="mt-6 text-lg font-semibold text-brand-navy">{s.title}</h3>
                                    <p className="mt-2 flex-1 text-[14.5px] leading-relaxed text-[#4A4F5C]">{s.description}</p>
                                    <p className="mt-5 border-t border-brand-navy/[0.06] pt-3.5 text-[12px] font-medium tracking-wide text-brand-gold-muted">{s.highlight}</p>
                                </article>
                            </Reveal>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}