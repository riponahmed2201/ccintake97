import { LANDING_BLEED, LANDING_CONTAINER, LANDING_SCROLL_TRACK, LANDING_SECTION, LANDING_SECTION_BODY } from '@/components/landing/layout';
import { SectionHeading } from '@/components/landing/primitives';
import { CAMPUS_LIFE } from '@/components/landing/constants';
import type { CmsGalleryItem } from '@/components/landing/types';

export function LandingCampusLife({ className = '', galleryItems }: { className?: string; galleryItems?: CmsGalleryItem[] }) {
    const photos = galleryItems && galleryItems.length > 0 ? galleryItems : CAMPUS_LIFE;
    return (
        <section className={`${LANDING_SECTION} bg-brand-cream ${className}`.trim()}>
            <div className={LANDING_CONTAINER}>
                <SectionHeading
                    eyebrow="On the grounds"
                    title={
                        <>
                            Life on <em className="font-normal text-[#8E6B28]">campus.</em>
                        </>
                    }
                    intro="Parade grounds, classrooms, and inter-house championships across the constituent cadet colleges."
                />
            </div>
            <div className={`${LANDING_SCROLL_TRACK} gap-4 pb-2 ${LANDING_SECTION_BODY} ${LANDING_BLEED}`}>
                {photos.map((ph) => (
                    <figure key={ph.src} className="group relative w-[78vw] shrink-0 snap-start overflow-hidden rounded-2xl bg-brand-navy shadow-[0_20px_50px_-24px_rgba(11,18,32,0.35)] ring-1 ring-brand-navy/10 transition-all duration-300 hover:ring-[#C9A55C]/50 sm:w-[400px]">
                        <img
                            src={ph.src}
                            alt={ph.title}
                            loading="lazy"
                            className="aspect-[4/5] h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105 motion-reduce:transition-none"
                        />
                        <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent px-6 pt-16 pb-5 text-white">
                            <span className="block text-[11px] font-medium tracking-[0.2em] text-[#E8D5A3] uppercase">{ph.place}</span>
                            <span className="mt-1 block font-serif text-2xl font-medium">{ph.title}</span>
                        </figcaption>
                    </figure>
                ))}
            </div>
        </section>
    );
}