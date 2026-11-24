import { LANDING_BLEED, LANDING_CONTAINER, LANDING_SCROLL_TRACK, LANDING_SECTION, LANDING_SECTION_BODY } from '@/components/landing/layout';
import { SectionHeading } from '@/components/landing/primitives';
import { CAMPUS_LIFE } from '@/components/landing/constants';

export function LandingCampusLife() {
    return (
        <section className={`${LANDING_SECTION} bg-[#FAF7F0]`}>
            <div className={LANDING_CONTAINER}>
                <SectionHeading
                    index="04"
                    eyebrow="On the grounds"
                    title={
                        <>
                            Life on <em className="font-normal text-[#9A7B3F]">campus.</em>
                        </>
                    }
                    intro="Scroll to explore moments from parade grounds, classrooms and inter-house championships."
                />
            </div>
            <div className={`${LANDING_SCROLL_TRACK} gap-1.5 pb-2 ${LANDING_SECTION_BODY} ${LANDING_BLEED}`}>
                {CAMPUS_LIFE.map((ph) => (
                    <figure key={ph.src} className="group relative w-[78vw] shrink-0 snap-start overflow-hidden bg-[#0B1220] sm:w-[420px]">
                        <img
                            src={ph.src}
                            alt={ph.title}
                            loading="lazy"
                            className="aspect-[4/5] h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105 motion-reduce:transition-none"
                        />
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