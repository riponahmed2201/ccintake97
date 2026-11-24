import { LANDING_CONTAINER, LANDING_GRID_GAP, LANDING_SECTION } from '@/components/landing/layout';
import { Reveal } from '@/components/landing/primitives';

export function LandingAbout() {
    return (
                        <section id="about" className={`${LANDING_SECTION} bg-white`}>
                            <div className={LANDING_CONTAINER}>
                                <div className={`grid grid-cols-1 items-center lg:grid-cols-12 ${LANDING_GRID_GAP}`}>
                                    <div className="lg:col-span-5">
                                        <Reveal>
                                            <h2 className="font-serif text-5xl leading-[1.02] font-medium tracking-[-0.01em] text-[#0B1220] lg:text-[3.75rem]">
                                                Bound by a <em className="font-normal text-[#9A7B3F]">shared</em> beginning.
                                            </h2>
                                            <p className="mt-7 text-[17px] leading-[1.75] text-[#4A4F5C]">
                                                In January 1997, 500 adolescents walked through the gates of ten cadet colleges. Reveille at 0530, ten-mile runs and drill-square inspections turned strangers into brothers and sisters.
                                            </p>
                                            <p className="mt-4 text-[17px] leading-[1.75] text-[#4A4F5C]">
                                                Today we lead across continents — and remain exactly who we were.
                                            </p>
                                            <blockquote className="mt-9 border-l-2 border-[#C9A55C] pl-5 font-serif text-xl leading-snug text-[#0B1220] italic">
                                                “No rank outside this room supersedes that of a brother who stood the same cold morning muster beside you.”
                                            </blockquote>
                                            <dl className="mt-10 grid grid-cols-4 gap-4 border-t border-[#0B1220]/10 pt-6">
                                                {[
                                                    { v: '1997', l: 'Induction' },
                                                    { v: '2003', l: 'Passing out' },
                                                    { v: '27+', l: 'Years' },
                                                    { v: '100%', l: 'Audited' },
                                                ].map((st) => (
                                                    <div key={st.l}>
                                                        <dd className="font-serif text-2xl font-medium text-[#0B1220]">{st.v}</dd>
                                                        <dt className="mt-0.5 text-[10.5px] tracking-[0.18em] text-[#0B1220]/45 uppercase">{st.l}</dt>
                                                    </div>
                                                ))}
                                            </dl>
                                        </Reveal>
                                    </div>
        
                                    <div className="-mx-5 sm:-mx-8 lg:col-span-7 lg:mx-0 lg:-mr-[max(2.5rem,calc((100vw_-_1440px)/2_+_2.5rem))]">
                                        <Reveal delay={100}>
                                            <div className="grid h-[520px] grid-cols-5 grid-rows-2 gap-1.5 sm:h-[600px] lg:h-[680px]">
                                                {[
                                                    { src: '/images/campus/cadets-in-class.jpg', alt: 'Cadets in a classroom', caption: 'Prep hour', cls: 'col-span-3 row-span-2' },
                                                    { src: '/images/campus/flag-raising.jpg', alt: 'Flag raising ceremony', caption: 'Morning colours', cls: 'col-span-2' },
                                                    { src: '/images/campus/athletes-contingent.jpg', alt: 'Athletes contingent on parade', caption: 'Inter-house athletics', cls: 'col-span-2' },
                                                ].map((ph) => (
                                                    <figure key={ph.src} className={`group relative overflow-hidden bg-[#0B1220] ${ph.cls}`}>
                                                        <img src={ph.src} alt={ph.alt} loading="lazy" className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105" />
                                                        <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-5 pt-10 pb-4 text-[13px] font-medium text-white">
                                                            {ph.caption}
                                                        </figcaption>
                                                    </figure>
                                                ))}
                                            </div>
                                        </Reveal>
                                    </div>
                                </div>
                            </div>
                        </section>
    );
}
