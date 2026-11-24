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
        <section className="relative isolate overflow-hidden bg-[#0B1220] text-[#F7F3EA]">
            <div className="pointer-events-none absolute inset-0 -z-10">
                <img src={image} alt="" className="h-full w-full object-cover opacity-30" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#070B14] via-[#0B1220]/92 to-[#0B1220]/75" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220] via-[#0B1220]/20 to-[#0B1220]/50" />
            </div>
            <div className={`${LANDING_CONTAINER} pb-24 pt-24 sm:pb-28 sm:pt-28 lg:pb-32`}>
                <div className="flex flex-col justify-between gap-10 lg:flex-row lg:items-end">
                    <SectionHeading reveal={false} titleTag="h1" light eyebrow={eyebrow} title={title} intro={intro} />
                    {stats && stats.length > 0 && (
                        <dl className="grid shrink-0 grid-cols-2 gap-x-8 gap-y-5 rounded-2xl border border-white/10 bg-white/[0.06] px-8 py-6 backdrop-blur-md sm:grid-cols-4 lg:gap-x-10">
                            {stats.map((st) => (
                                <div key={st.label}>
                                    <dd className="font-serif text-3xl font-medium tabular-nums sm:text-4xl">{st.value}</dd>
                                    <dt className="mt-1 text-[10px] tracking-[0.2em] text-[#F7F3EA]/50 uppercase sm:text-[10.5px]">{st.label}</dt>
                                </div>
                            ))}
                        </dl>
                    )}
                </div>
            </div>
        </section>
    );
}