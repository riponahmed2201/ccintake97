import { ArrowRight, Check, Mail, MapPin, Phone } from 'lucide-react';
import { LANDING_CONTAINER, LANDING_GRID_GAP, LANDING_SECTION } from '@/components/landing/layout';
import { Reveal } from '@/components/landing/primitives';
import { CONTACT_LABEL_CLASS } from '@/hooks/use-landing-page';
import type { Dispatch, FormEvent, SetStateAction } from 'react';

export function LandingContact({
    contactSubmitted,
    contactForm,
    setContactForm,
    handleContactSubmit,
    omitHeading = false,
    className = '',
}: {
    contactSubmitted: boolean;
    contactForm: { name: string; email: string; subject: string; message: string };
    setContactForm: Dispatch<SetStateAction<{ name: string; email: string; subject: string; message: string }>>;
    handleContactSubmit: (e: FormEvent) => void;
    omitHeading?: boolean;
    className?: string;
}) {
    const labelCls = `${CONTACT_LABEL_CLASS} mb-2 font-semibold text-[#091324]/70`;
    const fieldBase =
        'w-full rounded-xl border border-[#091324]/12 bg-[#F8FAFC] text-[15px] text-[#091324] transition-all placeholder:text-[#091324]/35 hover:border-[#450D15]/25 focus:border-[#450D15] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#450D15]/12';
    const inputCls = `${fieldBase} h-12 px-4`;
    const textareaCls = `${fieldBase} min-h-[136px] resize-y px-4 py-3.5 leading-relaxed`;

    const channels = [
        {
            icon: MapPin,
            k: 'Address',
            v: (
                <>
                    Central Alumni Secretariat
                    <br />
                    <span className="text-[#4A4F5C]">Gulshan-2 / Mohakhali DOHS, Dhaka</span>
                </>
            ),
        },
        {
            icon: Mail,
            k: 'Email',
            v: (
                <a
                    href="mailto:secretariat@intake97.com"
                    className="font-medium text-[#450D15] underline decoration-[#450D15]/35 underline-offset-4 transition-colors hover:text-[#6E1622] hover:decoration-[#6E1622]"
                >
                    secretariat@intake97.com
                </a>
            ),
        },
        {
            icon: Phone,
            k: 'Helpline',
            v: (
                <>
                    +880 1711 000097
                    <br />
                    <span className="text-[13.5px] text-[#4A4F5C]">Sun – Thu · 10:00 – 18:00 BST</span>
                </>
            ),
        },
    ];

    return (
        <section id={omitHeading ? undefined : 'contact'} className={`border-t border-[#450D15]/[0.06] bg-[#FAF5F6] ${LANDING_SECTION} ${className}`.trim()}>
            <div className={LANDING_CONTAINER}>
                <div className={`grid grid-cols-1 items-start lg:grid-cols-12 ${LANDING_GRID_GAP}`}>
                    <div className="lg:col-span-5">
                        {omitHeading ? (
                            <Reveal>
                                <div className="inline-flex items-center gap-3">
                                    <span className="h-px w-7 bg-[#450D15]" />
                                    <p className="text-[11px] font-semibold tracking-[0.26em] text-[#5E121D] uppercase">
                                        Secretariat Coordinates
                                    </p>
                                </div>
                                <h2 className="mt-4 font-serif text-3xl font-medium text-[#091324] sm:text-4xl">
                                    Direct <em className="font-normal italic text-[#5E121D]">channels.</em>
                                </h2>
                                <p className="mt-3 max-w-md text-[15px] leading-relaxed text-[#4A4F5C]">
                                    Reach the Dhaka Secretariat or our regional liaison desks worldwide.
                                </p>
                            </Reveal>
                        ) : (
                            <Reveal>
                                <div className="inline-flex items-center gap-3">
                                    <span className="h-px w-7 bg-[#450D15]" />
                                    <p className="text-[11px] font-semibold tracking-[0.26em] text-[#5E121D] uppercase">
                                        Central Secretariat
                                    </p>
                                </div>
                                <h2 className="mt-4 font-serif text-4xl leading-[1.04] font-medium text-[#091324] sm:text-5xl lg:text-[3.35rem]">
                                    Write to the <em className="font-normal italic text-[#5E121D]">Council.</em>
                                </h2>
                                <p className="mt-5 max-w-md text-[15.5px] leading-relaxed text-[#4A4F5C]">
                                    For membership verification, reunion reservations, endowments or chapter affiliations.
                                </p>
                            </Reveal>
                        )}

                        <Reveal delay={100}>
                            <dl className="mt-8 space-y-3.5">
                                {channels.map((d) => (
                                    <div
                                        key={d.k}
                                        className="flex items-start gap-4 rounded-2xl border border-[#450D15]/[0.08] bg-white p-4 shadow-[0_8px_24px_-18px_rgba(69,13,21,0.18)] transition-colors hover:border-[#450D15]/25"
                                    >
                                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#450D15] text-[#F4C2C7] shadow-sm">
                                            <d.icon className="h-4.5 w-4.5" strokeWidth={1.7} />
                                        </span>
                                        <div className="min-w-0 pt-0.5">
                                            <dt className="text-[11px] font-semibold tracking-[0.2em] text-[#5E121D] uppercase">{d.k}</dt>
                                            <dd className="mt-1 text-[15px] leading-relaxed text-[#091324]">{d.v}</dd>
                                        </div>
                                    </div>
                                ))}
                            </dl>
                        </Reveal>
                    </div>

                    <div className="lg:col-span-7">
                        <Reveal delay={100}>
                            <div className="overflow-hidden rounded-3xl border border-[#450D15]/12 bg-white shadow-[0_24px_60px_-24px_rgba(69,13,21,0.18)]">
                                <div className="h-1.5 bg-gradient-to-r from-[#6E1622] via-[#450D15] to-[#5E121D]" />
                                <div className="p-7 sm:p-10">
                                    {contactSubmitted ? (
                                        <div className="flex min-h-[380px] flex-col items-center justify-center text-center">
                                            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#450D15]/10 ring-1 ring-[#450D15]/25">
                                                <Check className="h-7 w-7 text-[#450D15]" />
                                            </span>
                                            <h3 className="mt-6 font-serif text-3xl font-medium text-[#091324]">Message received.</h3>
                                            <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-[#4A4F5C]">
                                                Your note has reached the Central Secretariat. Expect a response within 24 hours.
                                            </p>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleContactSubmit} className="space-y-5">
                                            <div className="border-b border-[#091324]/10 pb-5">
                                                <h3 className="font-serif text-3xl font-medium text-[#091324]">Send a message</h3>
                                                <p className="mt-1.5 text-[14px] text-[#4A4F5C]">
                                                    Official communications receive priority from the General Secretary’s desk.
                                                </p>
                                            </div>
                                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                                <label className="block">
                                                    <span className={labelCls}>Full name <span className="text-[#5E121D]">*</span></span>
                                                    <input required type="text" value={contactForm.name} onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })} placeholder="Brig. Gen. / Dr. / Cadet Name" className={inputCls} />
                                                </label>
                                                <label className="block">
                                                    <span className={labelCls}>Email address <span className="text-[#5E121D]">*</span></span>
                                                    <input required type="email" value={contactForm.email} onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })} placeholder="you@domain.com" className={inputCls} />
                                                </label>
                                            </div>
                                            <label className="block">
                                                <span className={labelCls}>Subject <span className="text-[#5E121D]">*</span></span>
                                                <input required type="text" value={contactForm.subject} onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })} placeholder="Membership verification, Reunion 2027, or general inquiry" className={inputCls} />
                                            </label>
                                            <label className="block">
                                                <span className={labelCls}>Message <span className="text-[#5E121D]">*</span></span>
                                                <textarea required rows={4} value={contactForm.message} onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })} placeholder="How can the Central Council assist you?" className={textareaCls} />
                                            </label>
                                            <div className="pt-2">
                                                <button type="submit" className="group inline-flex cursor-pointer items-center justify-center gap-3 rounded-full bg-gradient-to-r from-[#6E1622] via-[#450D15] to-[#5E121D] px-8 py-3.5 text-sm font-semibold text-white shadow-[0_12px_28px_-10px_rgba(69,13,21,0.5)] transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110">
                                                    <span>Send message</span>
                                                    <ArrowRight className="h-4 w-4 text-white transition-transform duration-300 group-hover:translate-x-1" />
                                                </button>
                                            </div>
                                        </form>
                                    )}
                                </div>
                            </div>
                        </Reveal>
                    </div>
                </div>
            </div>
        </section>
    );
}
