import { LANDING_CONTAINER, LANDING_GRID_GAP, LANDING_SECTION, LANDING_SECTION_BODY } from '@/components/landing/layout';
import { Reveal, SectionHeading } from '@/components/landing/primitives';
import { TIMELINE_MILESTONES } from '@/components/landing/constants';

export function LandingTimeline({ className = '' }: { className?: string }) {
    return (
        <section className={`${LANDING_SECTION} ${className}`.trim()}>
                            <div className={LANDING_CONTAINER}>
                                <SectionHeading eyebrow="Since 1997" title={<>From induction <em className="font-normal text-[#9A7B3F]">to 2027.</em></>} align="center" intro="Class 7 in 1997, passing out around 2003, and a reunion planned for the thirtieth year." />
        
                                <div className={`relative ${LANDING_SECTION_BODY}`}>
                                    <div className="absolute top-[30px] right-0 left-0 hidden h-px bg-gradient-to-r from-transparent via-[#9A7B3F]/40 to-transparent md:block" />
                                    <ol className={`grid grid-cols-1 md:grid-cols-4 ${LANDING_GRID_GAP}`}>
                                        {TIMELINE_MILESTONES.map((m, i) => (
                                            <Reveal key={m.year} delay={i * 90}>
                                                <li className="relative">
                                                    <div className="flex items-center gap-4 md:flex-col md:items-start">
                                                        <span className={`relative z-10 flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-full border ${i === TIMELINE_MILESTONES.length - 1 ? 'border-[#C9A55C] bg-[#0B1220] shadow-[0_0_0_6px_rgba(201,165,92,0.25)]' : 'border-[#0B1220]/15 bg-white'}`}>
                                                            <span className={`h-2 w-2 rounded-full ${i === TIMELINE_MILESTONES.length - 1 ? 'bg-[#E8D5A3]' : 'bg-[#9A7B3F]'}`} />
                                                        </span>
                                                        <span className="font-serif text-4xl font-medium text-[#0B1220] md:mt-8">{m.year}</span>
                                                    </div>
                                                    <h3 className="mt-4 text-[15px] font-semibold text-[#0B1220]">{m.title}</h3>
                                                    <p className="mt-1 text-[11px] tracking-[0.18em] text-[#9A7B3F] uppercase">{m.tagline}</p>
                                                    <p className="mt-4 text-[14px] leading-relaxed text-[#4A4F5C]">{m.description}</p>
                                                </li>
                                            </Reveal>
                                        ))}
                                    </ol>
                                </div>
                            </div>
                        </section>
    );
}
