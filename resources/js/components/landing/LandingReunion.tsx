import { useEffect, useState } from 'react';
import { Calendar, Check, MapPin, QrCode } from 'lucide-react';
import { PrimaryCta } from '@/components/landing/cta';
import { LANDING_CONTAINER, LANDING_GRID_GAP, LANDING_SECTION } from '@/components/landing/layout';
import { Reveal, SectionHeading } from '@/components/landing/primitives';
import { useSignupDialog } from '@/contexts/signup-dialog-context';

const REUNION_TARGET = new Date('2027-11-01T00:00:00+06:00');

function useReunionCountdown() {
    const [parts, setParts] = useState({ days: 0, label: '' });

    useEffect(() => {
        const tick = () => {
            const diff = REUNION_TARGET.getTime() - Date.now();
            if (diff <= 0) {
                setParts({ days: 0, label: 'Reunion season' });
                return;
            }
            setParts({ days: Math.ceil(diff / (1000 * 60 * 60 * 24)), label: 'days until Winter 2027' });
        };
        tick();
        const id = window.setInterval(tick, 60_000);
        return () => window.clearInterval(id);
    }, []);

    return parts;
}

export function LandingReunion() {
    const { openSignup } = useSignupDialog();
    const countdown = useReunionCountdown();

    return (
        <section id="reunion" className={`relative isolate overflow-hidden bg-brand-ink-deep text-brand-cream-text ${LANDING_SECTION}`}>
            <div className="pointer-events-none absolute inset-0 -z-10">
                <img
                    src="/images/campus/reunion-parade-rcc.jpg"
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover object-[center_30%] sm:object-[center_35%]"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#070B14]/95 via-[#070B14]/75 to-[#070B14]/40" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070B14]/70 to-transparent" />
            </div>
            <div className={LANDING_CONTAINER}>
                <div className={`grid grid-cols-1 items-center lg:grid-cols-12 ${LANDING_GRID_GAP}`}>
                    <div className="lg:col-span-7">
                        <SectionHeading
                            eyebrow="30th jubilee"
                            light
                            title={
                                <>
                                    Grand Reunion <em className="font-normal text-brand-gold-bright">2027.</em>
                                </>
                            }
                            intro="Three decades of unbroken brotherhood. All 500 batchmates, our families and our revered faculty — together in Dhaka for a historic national assembly."
                        />
                        <Reveal delay={200}>
                            <div className="mt-8 inline-flex flex-col rounded-2xl border border-[#F7F3EA]/15 bg-[#0B1220]/50 px-6 py-4 backdrop-blur-sm sm:flex-row sm:items-baseline sm:gap-4">
                                <span className="font-serif text-4xl font-medium tabular-nums text-[#E8D5A3]">{countdown.days}</span>
                                <span className="text-[13px] tracking-[0.16em] text-[#F7F3EA]/55 uppercase">{countdown.label}</span>
                            </div>
                        </Reveal>
                        <Reveal delay={300}>
                            <dl className="mt-10 grid grid-cols-1 gap-8 border-t border-[#F7F3EA]/10 pt-10 sm:grid-cols-3">
                                {[
                                    { icon: MapPin, k: 'Venue', v: 'Sena Malancha · Dhaka Club · Kurmitola' },
                                    { icon: Calendar, k: 'When', v: 'Winter 2027 · Three days · INTAKE 97' },
                                    { icon: QrCode, k: 'Access', v: 'Encrypted digital pass' },
                                ].map((d) => (
                                    <div key={d.k}>
                                        <dt className="flex items-center gap-2 text-[11px] tracking-[0.2em] text-[#D9BF85] uppercase">
                                            <d.icon className="h-3.5 w-3.5" aria-hidden />
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
                                <div className="rounded-[calc(2rem-1px)] bg-[#0B1220]/95 p-8 backdrop-blur-xl sm:p-10">
                                    <div className="flex items-center justify-between gap-3">
                                        <span className="text-[11px] tracking-[0.24em] text-[#D9BF85] uppercase">Class of 1997 Pass</span>
                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/10 px-3 py-1 text-[11px] text-emerald-300">
                                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" /> Pre-registration open
                                        </span>
                                    </div>
                                    <div className="mt-8 font-serif text-3xl leading-tight sm:text-4xl">
                                        The Jubilee
                                        <br />
                                        All-Access Pass
                                    </div>
                                    <p className="mt-4 text-[14px] leading-relaxed text-[#F7F3EA]/55">
                                        Conclave access, the Grand Mess Dinner, the 30th Anniversary Yearbook and the Family Banquet.
                                    </p>
                                    <ul className="mt-8 space-y-3.5 border-t border-[#F7F3EA]/10 pt-8">
                                        {['Exclusive to verified 1997 alumni', 'Official commemorative medallion', 'Spouse and children included'].map((f) => (
                                            <li key={f} className="flex items-center gap-3 text-[14px] text-[#F7F3EA]/80">
                                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#C9A55C]/15">
                                                    <Check className="h-3 w-3 text-[#E8D5A3]" aria-hidden />
                                                </span>
                                                {f}
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="mt-10">
                                        <PrimaryCta as="button" variant="navy" className="w-full" onClick={openSignup}>
                                            Reserve your seat
                                        </PrimaryCta>
                                    </div>
                                </div>
                            </div>
                        </Reveal>
                    </div>
                </div>
            </div>
        </section>
    );
}