import { LANDING_CONTAINER, LANDING_GRID_GAP, LANDING_SECTION, LANDING_SECTION_BODY } from '@/components/landing/layout';
import { Reveal, SectionHeading } from '@/components/landing/primitives';
import { TIMELINE_MILESTONES } from '@/components/landing/constants';

export function LandingTimeline({ className = '' }: { className?: string }) {
    return (
        <section className={`${LANDING_SECTION} bg-white ${className}`.trim()}>
                            <div className={LANDING_CONTAINER}>
                                <SectionHeading eyebrow="Since 1997" title={<>From induction <em className="font-normal text-[#8E6B28]">to 2027.</em></>} align="center" intro="Class 7 in 1997, passing out around 2003, and a reunion planned for the thirtieth year." />
        
                                <div className={`relative ${LANDING_SECTION_BODY}`}>
                                    <div className="absolute top-[30px] right-0 left-0 hidden h-px bg-gradient-to-r from-transparent via-[#C8A252]/45 to-transparent md:block" />
                                    <ol className={`grid grid-cols-1 gap-6 md:grid-cols-4 lg:gap-8`}>
                                        {TIMELINE_MILESTONES.map((m, i) => (
                                            <Reveal key={m.year} delay={i * 90}>
                                                <li className="relative h-full rounded-xl border border-transparent p-4">
                                                    <div className="flex items-center gap-4 md:flex-col md:items-start">
                                                        <span className={`relative z-10 flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-full border ${i === TIMELINE_MILESTONES.length - 1 ? 'border-[#C8A252] bg-[#091324] shadow-[0_0_0_6px_rgba(200,162,82,0.22)]' : 'border-[#091324]/15 bg-white shadow-xs'}`}>
                                                            <span className={`h-2.5 w-2.5 rounded-full ${i === TIMELINE_MILESTONES.length - 1 ? 'bg-[#E8D5A3]' : 'bg-[#8E6B28]'}`} />
                                                        </span>
                                                        <span className="font-serif text-4xl font-semibold text-[#091324] md:mt-6">{m.year}</span>
                                                    </div>
                                                    <h3 className="mt-4 text-[16px] font-semibold text-[#091324]">{m.title}</h3>
                                                    <p className="mt-1 text-[11px] font-medium tracking-[0.18em] text-[#8E6B28] uppercase">{m.tagline}</p>
                                                    <p className="mt-3 text-[14px] leading-relaxed text-[#4A4F5C]">{m.description}</p>
                                                </li>
                                            </Reveal>
                                        ))}
                                    </ol>
                                </div>
                            </div>
                        </section>
    );
}
