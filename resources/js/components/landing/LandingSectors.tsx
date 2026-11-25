import { LANDING_CONTAINER, LANDING_SECTION, LANDING_SECTION_BODY } from '@/components/landing/layout';
import { Reveal, SectionHeading } from '@/components/landing/primitives';
import { SECTORS } from '@/components/landing/constants';

export function LandingSectors() {
    return (
        <section id="sectors" className={`bg-brand-cream ${LANDING_SECTION}`}>
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
                                <article className="group flex h-full flex-col rounded-xl border border-brand-navy/10 bg-white p-7">
                                    <div className="flex items-start justify-between gap-4">
                                        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#091324] text-[#E8D5A3] transition-colors group-hover:bg-[#8E6B28] group-hover:text-white">
                                            <Icon className="h-5 w-5" strokeWidth={1.6} />
                                        </span>
                                        <div className="text-right">
                                            <div className="font-serif text-3xl font-semibold text-brand-navy">{s.count}</div>
                                            <div className="text-[10px] tracking-[0.16em] text-brand-navy/50 uppercase">{s.unit}</div>
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