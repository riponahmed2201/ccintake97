import { ExploreLink, Reveal } from '@/components/landing/primitives';
import { WELFARE_PILLARS } from '@/components/landing/constants';

export function LandingWelfare() {
    return (
                        <section id="welfare" className="relative isolate scroll-mt-20 overflow-hidden bg-[#070B14] text-[#F7F3EA]">
                            <span id="offers" className="sr-only absolute -top-24" />
                            <img src="/images/campus/aerial-mcc.jpg" alt="Aerial view of Mirzapur Cadet College" loading="lazy" className="absolute inset-0 -z-20 h-full w-full object-cover" />
                            <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#070B14] via-[#070B14]/60 to-[#070B14]/30" />
                            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#070B14]/80 to-transparent" />
        
                            <div className="mx-auto flex min-h-[720px] max-w-[1440px] flex-col justify-between px-5 py-24 sm:px-8 lg:px-10 lg:py-28">
                                <Reveal>
                                    <h2 className="max-w-3xl font-serif text-5xl leading-[1.02] font-medium tracking-[-0.01em] lg:text-[4.25rem]">
                                        We leave <em className="font-normal text-[#E8D5A3]">no comrade</em> behind.
                                    </h2>
                                    <p className="mt-6 max-w-lg text-[16px] leading-relaxed text-[#F7F3EA]/70">
                                        Medical lifelines, protected futures for the children of fallen batchmates, and privileges shared among our own.
                                    </p>
                                    <div className="mt-8">
                                        <ExploreLink href="#contact" light>Support the Trust</ExploreLink>
                                    </div>
                                </Reveal>
        
                                <div className="mt-16 grid grid-cols-2 gap-1.5 lg:grid-cols-4">
                                    {WELFARE_PILLARS.map((w, i) => {
                                        const Icon = w.icon;
                                        return (
                                            <Reveal key={w.title} delay={i * 80} className="h-full">
                                                <div className="h-full bg-white/[0.08] p-5 backdrop-blur-md sm:p-6">
                                                    <Icon className="h-5 w-5 text-[#E8D5A3]" strokeWidth={1.5} />
                                                    <div className="mt-5 font-serif text-4xl font-medium sm:text-[2.75rem]">{w.figure}</div>
                                                    <div className="mt-2 text-[14px] font-medium">{w.title}</div>
                                                    <div className="mt-0.5 text-[12px] tracking-[0.14em] text-[#F7F3EA]/50 uppercase">{w.label}</div>
                                                </div>
                                            </Reveal>
                                        );
                                    })}
                                </div>
                            </div>
                        </section>
    );
}
