import { Link } from '@inertiajs/react';
import { ArrowRight, Calendar, Check, MapPin, QrCode } from 'lucide-react';
import { LANDING_CONTAINER, LANDING_GRID_GAP, LANDING_SECTION } from '@/components/landing/layout';
import { Reveal } from '@/components/landing/primitives';

export function LandingReunion() {
    return (
        <section id="reunion" className={`relative isolate overflow-hidden bg-[#070B14] text-[#F7F3EA] ${LANDING_SECTION}`}>
            <div className="pointer-events-none absolute inset-0 -z-10">
                <img src="/images/campus/reunion-parade-rcc.jpg" alt="" loading="lazy" className="h-full w-full object-cover object-[center_35%]" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#070B14]/95 via-[#070B14]/75 to-[#070B14]/40" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070B14]/70 to-transparent" />
            </div>
            <div className={LANDING_CONTAINER}>
                <div className={`grid grid-cols-1 items-center lg:grid-cols-12 ${LANDING_GRID_GAP}`}>
                    <div className="lg:col-span-7">
                        <Reveal delay={100}>
                            <h2 className="font-serif text-6xl leading-[0.95] font-medium tracking-[-0.02em] sm:text-7xl lg:text-[6.5rem]">
                                Grand Reunion
                                <br />
                                <span className="bg-gradient-to-r from-[#F1DFB0] via-[#C9A55C] to-[#E8D5A3] bg-clip-text text-transparent">2027.</span>
                            </h2>
                        </Reveal>
                        <Reveal delay={200}>
                            <p className="mt-8 max-w-xl text-lg leading-relaxed text-[#F7F3EA]/60">
                                Three decades of unbroken brotherhood. All 500 batchmates, our families and our revered faculty — together in Dhaka for a historic national assembly.
                            </p>
                        </Reveal>
                        <Reveal delay={300}>
                            <dl className="mt-12 grid grid-cols-1 gap-8 border-t border-[#F7F3EA]/10 pt-10 sm:grid-cols-3">
                                {[
                                    { icon: MapPin, k: 'Venue', v: 'Sena Malancha · Dhaka Club · Kurmitola' },
                                    { icon: Calendar, k: 'When', v: 'Winter 2027 · Three days' },
                                    { icon: QrCode, k: 'Access', v: 'Encrypted digital pass' },
                                ].map((d) => (
                                    <div key={d.k}>
                                        <dt className="flex items-center gap-2 text-[11px] tracking-[0.2em] text-[#D9BF85] uppercase">
                                            <d.icon className="h-3.5 w-3.5" />
                                            {d.k}
                                        </dt>
                                        <dd className="mt-2 text-[14px] leading-relaxed text-[#F7F3EA]/75">{d.v}</dd>
                                    </div>
                                ))}
                            </dl>
                        </Reveal>
                    </div>

                    <div className="lg:col-span-5">
                        <Reveal delay={200}>
                            <div className="relative rounded-[2rem] bg-gradient-to-b from-[#C9A55C]/50 via-[#C9A55C]/10 to-transparent p-px">
                                <div className="rounded-[calc(2rem-1px)] bg-[#0B1220]/95 p-10 backdrop-blur-xl">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[11px] tracking-[0.24em] text-[#D9BF85] uppercase">Class of 1997 Pass</span>
                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/10 px-3 py-1 text-[11px] text-emerald-300">
                                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" /> Pre-registration open
                                        </span>
                                    </div>
                                    <div className="mt-10 font-serif text-4xl leading-tight">
                                        The Jubilee
                                        <br />
                                        All-Access Pass
                                    </div>
                                    <p className="mt-4 text-[14px] leading-relaxed text-[#F7F3EA]/55">
                                        Conclave access, the Grand Mess Dinner, the 30th Anniversary Yearbook and the Family Banquet.
                                    </p>
                                    <ul className="mt-8 space-y-3.5 border-t border-[#F7F3EA]/10 pt-8">
                                        {['Exclusive to verified 1997 alumni', 'Official commemorative medallion', 'Spouse & children included'].map((f) => (
                                            <li key={f} className="flex items-center gap-3 text-[14px] text-[#F7F3EA]/80">
                                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#C9A55C]/15">
                                                    <Check className="h-3 w-3 text-[#E8D5A3]" />
                                                </span>
                                                {f}
                                            </li>
                                        ))}
                                    </ul>
                                    <Link
                                        href="/register-alumni"
                                        className="group mt-10 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#E8D5A3] to-[#C9A55C] py-4 text-sm font-semibold text-[#0B1220] transition-shadow hover:shadow-[0_10px_40px_-10px_rgba(201,165,92,0.7)]"
                                    >
                                        Reserve your seat <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </Link>
                                </div>
                            </div>
                        </Reveal>
                    </div>
                </div>
            </div>
        </section>
    );
}