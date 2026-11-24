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
}: {
    contactSubmitted: boolean;
    contactForm: { name: string; email: string; subject: string; message: string };
    setContactForm: Dispatch<SetStateAction<{ name: string; email: string; subject: string; message: string }>>;
    handleContactSubmit: (e: FormEvent) => void;
}) {
    const labelCls = CONTACT_LABEL_CLASS;
    const inputCls =
        'h-12 w-full rounded-xl border border-[#0B1220]/10 bg-white px-3.5 text-[15px] text-[#0B1220] transition-colors placeholder:text-[#0B1220]/35 focus:border-[#9A7B3F] focus:outline-none focus:ring-4 focus:ring-[#C9A55C]/15';
    return (
                        <section id="contact" className={`bg-white ${LANDING_SECTION}`}>
                            <div className={LANDING_CONTAINER}>
                                <div className={`grid grid-cols-1 lg:grid-cols-12 ${LANDING_GRID_GAP}`}>
                                    <div className="lg:col-span-5">
                                        <Reveal>
                                            <h2 className="font-serif text-5xl leading-[1.02] font-medium text-[#0B1220] lg:text-[3.25rem]">
                                                Write to the <em className="font-normal text-[#9A7B3F]">Council.</em>
                                            </h2>
                                            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-[#4A4F5C]">
                                                For membership verification, reunion reservations, endowments or chapter affiliations.
                                            </p>
                                        </Reveal>
        
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
                                            <div className="bg-[#F4F2EE] p-7 sm:p-10">
                                                {contactSubmitted ? (
                                                    <div className="flex min-h-[360px] flex-col items-center justify-center text-center">
                                                        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#C9A55C]/15"><Check className="h-7 w-7 text-[#9A7B3F]" /></span>
                                                        <h3 className="mt-6 font-serif text-3xl text-[#0B1220]">Message received.</h3>
                                                        <p className="mt-3 max-w-sm text-[15px] text-[#4A4F5C]">Your note has reached the Central Secretariat. Expect a response within 24 hours.</p>
                                                    </div>
                                                ) : (
                                                    <form onSubmit={handleContactSubmit} className="space-y-6">
                                                        <div>
                                                            <h3 className="font-serif text-3xl text-[#0B1220]">Send a message</h3>
                                                            <p className="mt-2 text-[14px] text-[#4A4F5C]">Official communications receive priority from the General Secretary’s desk.</p>
                                                        </div>
                                                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                                            <label className="block">
                                                                <span className={labelCls}>Full name</span>
                                                                <input required type="text" value={contactForm.name} onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })} placeholder="Your name" className={inputCls} />
                                                            </label>
                                                            <label className="block">
                                                                <span className={labelCls}>Email</span>
                                                                <input required type="email" value={contactForm.email} onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })} placeholder="you@domain.com" className={inputCls} />
                                                            </label>
                                                        </div>
                                                        <label className="block">
                                                            <span className={labelCls}>Subject</span>
                                                            <input required type="text" value={contactForm.subject} onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })} placeholder="Membership, reunion, or general inquiry" className={inputCls} />
                                                        </label>
                                                        <label className="block">
                                                            <span className={labelCls}>Message</span>
                                                            <textarea required rows={3} value={contactForm.message} onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })} placeholder="How can the Council help?" className={`${inputCls} resize-none`} />
                                                        </label>
                                                        <button type="submit" className="group inline-flex items-center gap-3 rounded-full bg-[#0B1220] px-8 py-4 text-sm font-medium text-[#F7F3EA] transition-all hover:bg-[#1A2438]">
                                                            Send message <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                                        </button>
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
