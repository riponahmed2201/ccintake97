import { Reveal, SectionHeading } from '@/components/landing/primitives';
import { TIMELINE_MILESTONES } from '@/components/landing/constants';

export function LandingTimeline() {
    return (
                        <section className="py-28 lg:py-36">
                            <div className="mx-auto max-w-[1440px] space-y-20 px-5 sm:px-8 lg:px-10">
                                <SectionHeading index="03" eyebrow="Since 1997" title={<>The crucible <em className="font-normal text-[#9A7B3F]">&amp; beyond.</em></>} align="center" intro="From adolescents on the obstacle course to leaders shaping industries on six continents." />
        
                                <div className="relative">
                                    <div className="absolute top-[30px] right-0 left-0 hidden h-px bg-gradient-to-r from-transparent via-[#9A7B3F]/40 to-transparent md:block" />
                                    <ol className="grid grid-cols-1 gap-12 md:grid-cols-5 md:gap-8">
                                        {TIMELINE_MILESTONES.map((m, i) => (
                                            <Reveal key={m.year} delay={i * 90}>
                                                <li className="relative">
                                                    <div className="flex items-center gap-4 md:flex-col md:items-start">
                                                        <span className={`relative z-10 flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-full border ${i === TIMELINE_MILESTONES.length - 1 ? 'border-[#C9A55C] bg-[#0B1220]' : 'border-[#0B1220]/15 bg-[#FAF7F0]'}`}>
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
