import type { ReactNode } from 'react';
import { LANDING_CONTAINER } from '@/components/landing/layout';
import { SectionHeading } from '@/components/landing/primitives';

type Stat = { value: string; label: string };

export function MarketingPageHero({
    image,
    eyebrow,
    title,
    intro,
    stats,
}: {
    image: string;
    eyebrow: string;
    title: ReactNode;
    intro: string;
    stats?: Stat[];
}) {
    return (
        <section className="relative isolate overflow-hidden bg-[#091324] text-[#F8F5EE]">
            <div className="pointer-events-none absolute inset-0 -z-10">
                <img src={image} alt="" className="h-full w-full object-cover opacity-35" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#060B15] via-[#091324]/90 to-[#091324]/70" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#091324] via-[#091324]/25 to-[#091324]/55" />
            </div>
            <div className={`${LANDING_CONTAINER} pt-28 pb-20 sm:pt-32 sm:pb-24 lg:pt-36 lg:pb-28`}>
                <div className="max-w-3xl">
                    <SectionHeading reveal={false} titleTag="h1" light eyebrow={eyebrow} title={title} intro={intro} />
                </div>
            </div>
        </section>
    );
}