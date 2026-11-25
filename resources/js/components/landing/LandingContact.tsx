import { ArrowRight, Check, Lock, Mail, MapPin, Phone } from 'lucide-react';
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
    const labelCls = `${CONTACT_LABEL_CLASS} mb-2 font-semibold text-[#091324]/60`;
    const fieldBase =
        'w-full rounded-xl border border-[#091324]/12 bg-white text-[15px] text-[#091324] shadow-[0_1px_2px_rgba(9,19,36,0.04)] transition-all placeholder:text-[#091324]/35 hover:border-[#091324]/25 focus:border-[#8E6B28] focus:outline-none focus:ring-4 focus:ring-[#C8A252]/15';
    const inputCls = `${fieldBase} h-12 px-4`;
    const textareaCls = `${fieldBase} min-h-[136px] resize-y px-4 py-3.5 leading-relaxed`;
    return (
                        <section id={omitHeading ? undefined : 'contact'} className={`bg-white ${LANDING_SECTION} ${className}`.trim()}>
                            <div className={LANDING_CONTAINER}>
                                <div className={`grid grid-cols-1 lg:grid-cols-12 ${LANDING_GRID_GAP}`}>
                                    <div className="lg:col-span-5">
                                        {omitHeading ? (
                                            <Reveal>
                                                <p className="text-[11px] font-medium tracking-[0.26em] text-[#8E6B28] uppercase">
                                                    Secretariat Coordinates
                                                </p>
                                                <h2 className="mt-2 font-serif text-3xl font-medium text-[#091324] sm:text-4xl">
                                                    Direct <em className="font-normal italic text-[#8E6B28]">channels.</em>
                                                </h2>
                                                <p className="mt-3 max-w-md text-[15px] leading-relaxed text-[#4A4F5C]">
                                                    Reach the Dhaka Secretariat or our regional liaison desks worldwide.
                                                </p>
                                            </Reveal>
                                        ) : (
                                            <Reveal>
                                                <p className="text-[11px] font-medium tracking-[0.26em] text-[#8E6B28] uppercase">
                                                    Central Secretariat
                                                </p>
                                                <h2 className="mt-3 font-serif text-5xl leading-[1.02] font-medium text-[#091324] lg:text-[3.25rem]">
                                                    Write to the <em className="font-normal italic text-[#8E6B28]">Council.</em>
                                                </h2>
                                                <p className="mt-6 max-w-md text-[15px] leading-relaxed text-[#4A4F5C]">
                                                    For membership verification, reunion reservations, endowments or chapter affiliations.
                                                </p>
                                            </Reveal>
                                        )}
        
                                        <Reveal delay={100}>
                                            <dl className="mt-10 space-y-5">
                                                {[
                                                    { icon: MapPin, k: 'Address', v: <>Central Alumni Secretariat<br />Gulshan-2 / Mohakhali DOHS, Dhaka</> },
                                                    { icon: Mail, k: 'Email', v: <a href="mailto:secretariat@intake97.com" className="underline decoration-[#9A7B3F]/40 underline-offset-4 hover:decoration-[#9A7B3F]">secretariat@intake97.com</a> },
                                                    { icon: Phone, k: 'Helpline', v: <>+880 1711 000097<br /><span className="text-[#0B1220]/45">Sun – Thu · 10:00 – 18:00 BST</span></> },
                                                ].map((d) => (
                                                    <div key={d.k} className="flex gap-5">
                                                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#0B1220]/10"><d.icon className="h-4 w-4 text-[#9A7B3F]" strokeWidth={1.5} /></span>
                                                        <div>
                                                            <dt className="text-[11px] tracking-[0.2em] text-[#0B1220]/45 uppercase">{d.k}</dt>
                                                            <dd className="mt-1 text-[15px] leading-relaxed text-[#0B1220]">{d.v}</dd>
                                                        </div>
                                                    </div>
                                                ))}
                                            </dl>
                                        </Reveal>
        
                                        <Reveal delay={150}>
                                            <div className="mt-12 border-t border-[#0B1220]/10 pt-8">
                                                <div className="text-[11px] tracking-[0.2em] text-[#0B1220]/45 uppercase">Regional liaison desks</div>
                                                <div className="mt-4 grid grid-cols-2 gap-y-3 text-[14px] text-[#0B1220]">
                                                    <span>New York · DC</span>
                                                    <span>London</span>
                                                    <span>Dubai · Riyadh</span>
                                                    <span>Sydney · Melbourne</span>
                                                </div>
                                            </div>
                                        </Reveal>
                                    </div>
        
                                    <div className="lg:col-span-7">
                                        <Reveal delay={100}>
                                            <div className="rounded-2xl border border-[#091324]/10 bg-[#FAF8F3] p-7 shadow-xs sm:p-10">
                                                {contactSubmitted ? (
                                                    <div className="flex min-h-[380px] flex-col items-center justify-center text-center">
                                                        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#C8A252]/15 ring-1 ring-[#C8A252]/30">
                                                            <Check className="h-7 w-7 text-[#8E6B28]" />
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
                                                                <span className={labelCls}>Full name <span className="text-[#8E6B28]">*</span></span>
                                                                <input required type="text" value={contactForm.name} onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })} placeholder="Brig. Gen. / Dr. / Cadet Name" className={inputCls} />
                                                            </label>
                                                            <label className="block">
                                                                <span className={labelCls}>Email address <span className="text-[#8E6B28]">*</span></span>
                                                                <input required type="email" value={contactForm.email} onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })} placeholder="you@domain.com" className={inputCls} />
                                                            </label>
                                                        </div>
                                                        <label className="block">
                                                            <span className={labelCls}>Subject <span className="text-[#8E6B28]">*</span></span>
                                                            <input required type="text" value={contactForm.subject} onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })} placeholder="Membership verification, Reunion 2027, or general inquiry" className={inputCls} />
                                                        </label>
                                                        <label className="block">
                                                            <span className={labelCls}>Message <span className="text-[#8E6B28]">*</span></span>
                                                            <textarea required rows={4} value={contactForm.message} onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })} placeholder="How can the Central Council assist you?" className={textareaCls} />
                                                        </label>
                                                        <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
                                                            <button type="submit" className="group inline-flex items-center justify-center gap-3 rounded-full bg-[#091324] px-8 py-3.5 text-sm font-semibold text-[#F8F5EE] transition-all duration-300 hover:bg-[#152238] hover:shadow-[0_14px_28px_-12px_rgba(9,19,36,0.55)]">
                                                                <span>Send message</span>
                                                                <ArrowRight className="h-4 w-4 text-[#E8D5A3] transition-transform duration-300 group-hover:translate-x-1" />
                                                            </button>
                                                            <span className="inline-flex items-center gap-1.5 text-[12px] text-[#091324]/50">
                                                                <Lock className="h-3.5 w-3.5 text-[#8E6B28]" />
                                                                Secretariat confidentiality
                                                            </span>
                                                        </div>
                                                    </form>
                                                )}
                                            </div>
                                        </Reveal>
                                    </div>
                                </div>
                            </div>
                        </section>
    );
}
