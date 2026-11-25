import { LANDING_CONTAINER, LANDING_SECTION, LANDING_SECTION_BODY } from '@/components/landing/layout';
import { ExploreLink, Reveal } from '@/components/landing/primitives';
import { WELFARE_PILLARS } from '@/components/landing/constants';

export function LandingWelfare() {
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
                                                <div className="flex h-full min-h-[11.5rem] flex-col justify-between rounded-xl border border-brand-navy/10 bg-brand-cream p-5 sm:min-h-[13rem] sm:p-6">
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
