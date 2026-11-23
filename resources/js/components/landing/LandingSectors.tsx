import { Reveal, SectionHeading } from '@/components/landing/primitives';
import { SECTORS } from '@/components/landing/constants';

export function LandingSectors() {
    return (
        <section id="sectors" className="scroll-mt-20 bg-white py-24 lg:py-32">
            <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-10">
                <SectionHeading
                    index="06"
                    eyebrow="Where we lead"
                    title={
                        <>
                            Across <em className="font-normal text-brand-gold-muted">every sector.</em>
                        </>
                    }
                    intro="Illustrative counts drawn from verified profiles — the batch spans defense, medicine, technology, diplomacy, finance, and law on six continents."
                />
                <p className="mt-4 text-[13px] text-[#4A4F5C]/80">Counts shown are representative samples for storytelling, not live database totals.</p>
                <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {SECTORS.map((s, i) => {
                        const Icon = s.icon;
                        return (
                            <Reveal key={s.title} delay={i * 60} className="h-full">
                                <article className="flex h-full flex-col rounded-3xl bg-[#F4F2EE] p-7 ring-1 ring-brand-navy/[0.05]">
                                    <div className="flex items-start justify-between gap-4">
                                        <Icon className="h-6 w-6 text-brand-gold-muted" strokeWidth={1.5} />
                                        <div className="text-right">
                                            <div className="font-serif text-3xl font-medium text-brand-navy">{s.count}</div>
                                            <div className="text-[10px] tracking-[0.16em] text-brand-navy/45 uppercase">{s.unit}</div>
                                        </div>
                                    </div>
                                    <h3 className="mt-6 text-lg font-semibold text-brand-navy">{s.title}</h3>
                                    <p className="mt-2 flex-1 text-[14px] leading-relaxed text-[#4A4F5C]">{s.description}</p>
                                    <p className="mt-4 text-[12px] font-medium tracking-wide text-brand-gold-muted">{s.highlight}</p>
                                </article>
                            </Reveal>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}