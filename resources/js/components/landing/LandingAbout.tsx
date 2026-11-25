import { LANDING_CONTAINER, LANDING_GRID_GAP, LANDING_SECTION } from '@/components/landing/layout';
import { Reveal, SectionHeading } from '@/components/landing/primitives';
import { cn } from '@/lib/utils';

const MOSAIC = [
    { src: '/images/campus/cadets-in-class.jpg', alt: 'Cadets in a classroom', caption: 'Prep hour', cls: 'col-span-3 row-span-2' },
    { src: '/images/campus/flag-raising.jpg', alt: 'Flag raising ceremony', caption: 'Morning colours', cls: 'col-span-2' },
    { src: '/images/campus/athletes-contingent.jpg', alt: 'Athletes contingent on parade', caption: 'Inter-house athletics', cls: 'col-span-2' },
];

export function LandingAbout({ omitHeading = false, className }: { omitHeading?: boolean; className?: string }) {
    return (
        <section
            id={omitHeading ? undefined : 'about'}
            className={cn(LANDING_SECTION, 'bg-white', omitHeading && 'scroll-mt-0', className)}
        >
            <div className={LANDING_CONTAINER}>
                <div className={`grid grid-cols-1 items-start lg:grid-cols-12 ${LANDING_GRID_GAP}`}>
                    <div className="lg:col-span-5">
                        {!omitHeading && (
                            <SectionHeading
                                eyebrow="Our story"
                                title={
                                    <>
                                        Bound by a <em className="font-normal text-[#9A7B3F]">shared</em> beginning.
                                    </>
                                }
                            />
                        )}
                        <Reveal delay={100}>
                            <p className={cn('text-[17px] leading-[1.75] text-[#4A4F5C]', omitHeading ? 'mt-0' : 'mt-8')}>
                                They arrived as Class 7 cadets: reveille, drill, prep and house life at Faujdarhat, Jhenaidah, Mirzapur, Rajshahi, Sylhet, Rangpur, Barishal, Pabna, Mymensingh Girls&apos; and Cumilla. Most passed out around 2003.
                            </p>
                            <p className="mt-4 text-[17px] leading-[1.75] text-[#4A4F5C]">
                                ccIntake97 is their association — a verified directory, a way to find batchmates, and a home for welfare and the reunion planned for 2027.
                            </p>
                            <blockquote className="mt-9 border-l border-brand-gold bg-brand-cream py-5 pr-6 pl-6 font-serif text-xl leading-snug text-brand-navy italic">
                                “No rank outside this room supersedes that of a brother who stood the same cold morning muster beside you.”
                                <footer className="mt-2.5 font-sans text-[11px] font-medium tracking-[0.2em] text-[#8E6B28] uppercase not-italic">
                                    — Central Council Founding Charter
                                </footer>
                            </blockquote>
                            {!omitHeading && (
                                <dl className="mt-10 grid grid-cols-4 gap-4 border-t border-[#091324]/10 pt-6">
                                    {[
                                        { v: '1997', l: 'Induction' },
                                        { v: '~2003', l: 'Passing out' },
                                        { v: 'Class 7', l: 'Entry' },
                                        { v: '10', l: 'Colleges' },
                                    ].map((st) => (
                                        <div key={st.l}>
                                            <dd className="font-serif text-2xl font-semibold text-[#091324]">{st.v}</dd>
                                            <dt className="mt-0.5 text-[10.5px] tracking-[0.18em] text-[#091324]/50 uppercase">{st.l}</dt>
                                        </div>
                                    ))}
                                </dl>
                            )}
                        </Reveal>
                    </div>

                    <div className="-mx-5 sm:-mx-8 lg:col-span-7 lg:mx-0">
                        <Reveal delay={100}>
                            <div className="grid h-[520px] grid-cols-5 grid-rows-2 gap-3 sm:h-[600px] lg:h-[660px]">
                                {MOSAIC.map((ph) => (
                                    <figure key={ph.src} className={`group relative overflow-hidden rounded-xl bg-brand-navy ring-1 ring-brand-navy/10 ${ph.cls}`}>
                                        <img
                                            src={ph.src}
                                            alt={ph.alt}
                                            loading="lazy"
                                            className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                                        />
                                        <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent px-5 pt-12 pb-4">
                                            <span className="block text-[11px] font-medium tracking-[0.2em] text-white/80 uppercase">{ph.caption}</span>
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