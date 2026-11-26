import { Link } from '@inertiajs/react';
import { ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react';
import BrandMark from '@/components/brand-mark';
import { LANDING_CONTAINER } from '@/components/landing/layout';

export function LandingFooter() {
    return (
        <footer className="relative overflow-hidden border-t border-brand-gold/25 bg-brand-ink-deep text-brand-cream-text">
            <div className={`${LANDING_CONTAINER} pt-20 pb-10 sm:pt-24 lg:pt-28`}>
                <div className="grid grid-cols-1 gap-12 border-b border-[#F7F3EA]/[0.1] pb-12 md:grid-cols-12 lg:pb-16">
                    <div className="md:col-span-5">
                        <div className="flex items-center gap-4">
                            <BrandMark className="h-24 w-24 shrink-0 sm:h-28 sm:w-28" />
                            <div>
                                <div className="font-brand text-2xl font-semibold sm:text-[26px]">
                                    ccIntake<span className="text-brand-gold-bright [font-variant-numeric:lining-nums]">97</span>
                                </div>
                                <div className="mt-0.5 text-[11px] tracking-[0.26em] text-[#F7F3EA]/55 uppercase">
                                    Cadet College Alumni Association
                                </div>
                            </div>
                        </div>
                        <p className="mt-7 max-w-sm text-[14.5px] leading-relaxed text-[#F7F3EA]/70">
                            The central association uniting the officers, physicians, engineers, diplomats and leaders who entered the cadet colleges of Bangladesh in 1997.
                        </p>
                        <Link
                            href="/?signup=1"
                            className="mt-6 inline-flex min-h-11 items-center gap-2 py-2 text-[14.5px] font-medium text-brand-gold-bright transition-colors hover:text-brand-cream-text"
                        >
                            Apply for membership <ArrowUpRight className="h-4 w-4" />
                        </Link>
                    </div>
                    {[
                        { h: 'Association', links: [['/about', 'About'], ['/colleges', 'Colleges'], ['/directory', 'Directory'], ['/committee', 'Committee']] },
                        { h: 'Activities', links: [['/welfare', 'Welfare & Trust'], ['/#news', 'News & ventures'], ['/#constitution', 'Charter'], ['/#reunion', 'Reunion 2027']] },
                    ].map((col) => (
                        <div key={col.h} className="md:col-span-2">
                            <h4 className="text-[12px] font-semibold tracking-[0.22em] text-brand-gold-bright/90 uppercase">{col.h}</h4>
                            <ul className="mt-5 space-y-3 text-[14.5px]">
                                {col.links.map(([href, label]) => (
                                    <li key={href}>
                                        <a href={href} className="text-[#F7F3EA]/75 transition-colors hover:text-[#F7F3EA]">{label}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                    <div className="md:col-span-3">
                        <h4 className="text-[12px] font-semibold tracking-[0.22em] text-brand-gold-bright/90 uppercase">Portal &amp; Secretariat</h4>
                        <ul className="mt-5 space-y-3 text-[14.5px]">
                            <li><Link href="/login" className="text-[#F7F3EA]/75 transition-colors hover:text-[#F7F3EA]">Member sign in</Link></li>
                            <li><Link href="/contact" className="text-[#F7F3EA]/75 transition-colors hover:text-[#F7F3EA]">Contact secretariat</Link></li>
                        </ul>
                        <div className="mt-6 space-y-2.5 border-t border-[#F7F3EA]/[0.08] pt-5 text-[13.5px] text-[#F7F3EA]/70">
                            <a href="mailto:secretariat@intake97.com" className="flex items-center gap-2.5 transition-colors hover:text-[#F7F3EA]">
                                <Mail className="h-4 w-4 shrink-0 text-brand-gold-bright/80" />
                                <span>secretariat@intake97.com</span>
                            </a>
                            <a href="tel:+8801711000097" className="flex items-center gap-2.5 transition-colors hover:text-[#F7F3EA]">
                                <Phone className="h-4 w-4 shrink-0 text-brand-gold-bright/80" />
                                <span>+880 1711 000097</span>
                            </a>
                            <div className="flex items-start gap-2.5 text-[#F7F3EA]/60">
                                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-gold-bright/80" />
                                <span>Gulshan-2 / Mohakhali DOHS, Dhaka</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-start justify-between gap-3 pt-8 text-[12.5px] text-[#F8F5EE]/55 sm:flex-row sm:items-center">
                    <span>© {new Date().getFullYear()} CCINTAKE97.COM · All rights reserved</span>
                    <span className="tracking-[0.22em] text-[#C8A252]/80 uppercase">Fidelitas et Disciplina · Class of 1997</span>
                </div>
            </div>
        </footer>
    );
}
