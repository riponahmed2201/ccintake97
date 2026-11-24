import { ArrowRight } from 'lucide-react';
import { Reveal } from '@/components/landing/primitives';
import { LANDING_BLEED, LANDING_CONTAINER, LANDING_SECTION, LANDING_SECTION_BODY } from '@/components/landing/layout';
import { CAMPUS_LIFE } from '@/components/landing/constants';

export function LandingCampusLife() {
    return (
                        <section className={`${LANDING_SECTION} bg-[#FAF7F0]`}>
                            <div className={LANDING_CONTAINER}>
                                <Reveal>
                                    <div className="flex items-end justify-between gap-6">
                                        <h3 className="flex items-center gap-4 font-serif text-3xl font-medium text-[#0B1220] sm:text-4xl">
                                            Life on campus <ArrowRight className="h-6 w-6 text-[#9A7B3F]" strokeWidth={1.25} />
                                        </h3>
                                        <span className="hidden text-[13px] text-[#0B1220]/45 sm:block">Scroll to explore</span>
                                    </div>
                                </Reveal>
                            </div>
                            <div className={`flex snap-x snap-mandatory gap-1.5 overflow-x-auto pb-2 [scrollbar-width:none] ${LANDING_SECTION_BODY} ${LANDING_BLEED}`}>
                                {CAMPUS_LIFE.map((ph) => (
                                    <figure key={ph.src} className="group relative w-[78vw] shrink-0 snap-start overflow-hidden bg-[#0B1220] sm:w-[420px]">
                                        <img src={ph.src} alt={ph.title} loading="lazy" className="aspect-[4/5] h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105" />
                                        <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-6 pt-16 pb-5 text-white">
                                            <span className="block text-[11px] tracking-[0.2em] text-white/60 uppercase">{ph.place}</span>
                                            <span className="mt-1 block font-serif text-2xl">{ph.title}</span>
                                        </figcaption>
                                    </figure>
                                ))}
                            </div>
                        </section>
    );
}
