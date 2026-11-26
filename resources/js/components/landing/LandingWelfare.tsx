import { ShieldCheck } from 'lucide-react';
import { LANDING_CONTAINER, LANDING_SECTION, LANDING_SECTION_BODY } from '@/components/landing/layout';
import { ExploreLink, Reveal } from '@/components/landing/primitives';
import { WELFARE_PILLARS } from '@/components/landing/constants';

export function LandingWelfare({ omitHeading = false, className = '' }: { omitHeading?: boolean; className?: string }) {
    if (omitHeading) {
        return (
            <section className={`bg-white py-12 sm:py-16 ${className}`.trim()}>
                <div className={LANDING_CONTAINER}>
                    <Reveal>
                        <div className="flex flex-col justify-between gap-6 border-b border-[#091324]/10 pb-8 md:flex-row md:items-end">
                            <div className="max-w-2xl">
                                <p className="text-[11px] font-medium tracking-[0.26em] text-[#8E6B28] uppercase">
                                    Endowment &amp; Mutual Aid
                                </p>
                                <h2 className="mt-2 font-serif text-3xl font-medium text-[#091324] sm:text-4xl">
                                    Four pillars of <em className="font-normal italic text-[#8E6B28]">brotherhood.</em>
                                </h2>
                                <p className="mt-3 text-[15.5px] leading-relaxed text-[#4A4F5C]">
                                    Every contribution is ring-fenced, independently audited, and deployed with zero administrative overhead.
                                </p>
                            </div>
                            <div className="flex shrink-0 items-center gap-2.5 rounded-full bg-[#FAF8F3] px-4 py-2 text-[13px] font-semibold text-[#091324] ring-1 ring-[#C8A252]/35">
                                <ShieldCheck className="h-4 w-4 text-[#8E6B28]" />
                                <span>100% Audited Fiduciary Parity</span>
                            </div>
                        </div>
                    </Reveal>

                    <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {WELFARE_PILLARS.map((w, i) => {
                            const Icon = w.icon;
                            return (
                                <Reveal key={w.title} delay={i * 70} className="h-full">
                                    <article className="group flex h-full flex-col justify-between rounded-2xl bg-[#FAF8F3] p-6 ring-1 ring-[#091324]/[0.07] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:ring-[#C8A252]/45 hover:shadow-md">
                                        <div>
                                            <div className="flex items-center justify-between">
                                                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#091324] text-[#E8D5A3] transition-colors group-hover:bg-[#8E6B28] group-hover:text-white">
                                                    <Icon className="h-5 w-5" strokeWidth={1.6} />
                                                </span>
                                                <span className="text-[10.5px] font-semibold tracking-[0.18em] text-[#8E6B28] uppercase">{w.label}</span>
                                            </div>
                                            <div className="mt-6 font-serif text-4xl font-semibold text-[#091324]">{w.figure}</div>
                                            <h3 className="mt-2 text-[17px] font-semibold text-[#091324]">{w.title}</h3>
                                            <p className="mt-2.5 text-[14px] leading-relaxed text-[#4A4F5C]">{w.description}</p>
                                        </div>
                                    </article>
                                </Reveal>
                            );
                        })}
                    </div>
                </div>
            </section>
        );
    }

    return (
                        <section id="welfare" className={`relative isolate overflow-hidden bg-white text-brand-navy ${LANDING_SECTION}`}>
                            <span id="offers" className="sr-only absolute -top-24" />
        
                            <div className={`flex flex-col justify-between ${LANDING_CONTAINER}`}>
                                <Reveal>
                                    <h2 className="max-w-3xl font-serif text-5xl leading-[1.02] font-medium tracking-[-0.01em] lg:text-[4.25rem]">
                                        We leave <em className="font-normal text-brand-gold-muted">no comrade</em> behind.
                                    </h2>
                                    <p className="mt-6 max-w-lg text-[16px] leading-relaxed text-brand-navy/65">
                                        Medical lifelines, protected futures for the children of fallen batchmates, and privileges shared among our own.
                                    </p>
                                    <div className="mt-8">
                                        <ExploreLink href="/contact" internal={false}>Support the Trust</ExploreLink>
                                    </div>
                                </Reveal>
        
                                <div className={`grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4 ${LANDING_SECTION_BODY}`}>
                                    {WELFARE_PILLARS.map((w, i) => {
                                        const Icon = w.icon;
                                        return (
                                            <Reveal key={w.title} delay={i * 80} className="h-full">
                                                <div className="flex h-full min-h-[11.5rem] flex-col justify-between rounded-xl border border-brand-navy/10 bg-slate-50 p-5 sm:min-h-[13rem] sm:p-6">
                                                    <Icon className="h-5 w-5 text-brand-gold" strokeWidth={1.5} />
                                                    <div className="mt-5 font-serif text-4xl font-semibold text-brand-navy sm:text-[2.75rem]">{w.figure}</div>
                                                    <div className="mt-2 text-[14.5px] font-medium text-brand-navy">{w.title}</div>
                                                    <div className="mt-0.5 text-[11.5px] tracking-[0.14em] text-brand-gold-muted uppercase">{w.label}</div>
                                                </div>
                                            </Reveal>
                                        );
                                    })}
                                </div>
                            </div>
                        </section>
    );
}
