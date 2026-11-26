import { Link } from '@inertiajs/react';
import { ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react';
import BrandMark from '@/components/brand-mark';
import { LANDING_CONTAINER } from '@/components/landing/layout';
import { ScrollToTop } from '@/components/scroll-to-top';

export function LandingFooter() {
    return (
        <footer className="relative overflow-hidden bg-gradient-to-b from-[#2B080D] via-[#160407] to-[#0A0305] text-brand-cream-text">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#F4C2C7]/45 to-transparent" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(244,194,199,0.08),transparent_55%)]" />
            <div className={`relative ${LANDING_CONTAINER} pt-20 pb-10 sm:pt-24 lg:pt-28`}>
                <div className="grid grid-cols-1 gap-12 border-b border-white/[0.1] pb-12 md:grid-cols-12 lg:pb-16">
                    <div className="md:col-span-5">
                        <div className="flex items-center gap-4">
                            <BrandMark className="h-24 w-24 shrink-0 sm:h-28 sm:w-28" />
                            <div>
                                <div className="font-brand text-2xl font-semibold text-white sm:text-[26px]">
                                    ccIntake<span className="text-[#F4C2C7] [font-variant-numeric:lining-nums]">97</span>
                                </div>
                                <div className="mt-0.5 text-[11px] tracking-[0.26em] text-white/60 uppercase">
                                    Cadet College Alumni Association
                                </div>
                            </div>
                        </div>
                        <p className="mt-7 max-w-sm text-[14.5px] leading-relaxed text-white/75">
                            The central association uniting the officers, physicians, engineers, diplomats and leaders who entered the cadet colleges of Bangladesh in 1997.
                        </p>
                        <Link
                            href="/?signup=1"
                            className="group mt-6 inline-flex items-center gap-2 rounded-full border border-[#F4C2C7]/25 bg-white/[0.06] px-5 py-2.5 text-[14px] font-medium text-[#F4C2C7] transition-all duration-300 hover:border-[#F4C2C7] hover:bg-[#F4C2C7] hover:text-[#2B080D]"
                        >
                            Apply for membership <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </Link>
                    </div>
                    {[
                        { h: 'Association', links: [['/about', 'About'], ['/colleges', 'Colleges'], ['/directory', 'Directory'], ['/gallery', 'Gallery']] },
                        { h: 'Activities', links: [['/#news', 'News & ventures'], ['/#constitution', 'Charter'], ['/#reunion', 'Reunion 2027']] },
                    ].map((col) => (
                        <div key={col.h} className="md:col-span-2">
                            <h4 className="text-[11.5px] font-semibold tracking-[0.22em] text-[#F4C2C7] uppercase">{col.h}</h4>
                            <ul className="mt-5 space-y-3 text-[14.5px]">
                                {col.links.map(([href, label]) => (
                                    <li key={href}>
                                        <a href={href} className="text-white/75 transition-colors hover:text-white">{label}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                    <div className="md:col-span-3">
                        <h4 className="text-[11.5px] font-semibold tracking-[0.22em] text-[#F4C2C7] uppercase">Portal &amp; Secretariat</h4>
                        <ul className="mt-5 space-y-3 text-[14.5px]">
                            <li><Link href="/login" className="text-white/75 transition-colors hover:text-white">Member sign in</Link></li>
                            <li><Link href="/contact" className="text-white/75 transition-colors hover:text-white">Contact secretariat</Link></li>
                        </ul>
                        <div className="mt-6 space-y-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4.5 text-[13.5px] text-white/80 backdrop-blur-sm">
                            <a href="mailto:secretariat@intake97.com" className="flex items-center gap-2.5 transition-colors hover:text-white">
                                <Mail className="h-4 w-4 shrink-0 text-[#F4C2C7]" />
                                <span>secretariat@intake97.com</span>
                            </a>
                            <a href="tel:+8801711000097" className="flex items-center gap-2.5 transition-colors hover:text-white">
                                <Phone className="h-4 w-4 shrink-0 text-[#F4C2C7]" />
                                <span>+880 1711 000097</span>
                            </a>
                            <div className="flex items-start gap-2.5 text-white/65">
                                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#F4C2C7]" />
                                <span>Gulshan-2 / Mohakhali DOHS, Dhaka</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-start justify-between gap-3 pt-8 text-[12.5px] text-white/60 sm:flex-row sm:items-center">
                    <span>© {new Date().getFullYear()} CCINTAKE97.COM · All rights reserved</span>
                    <span className="tracking-[0.22em] text-[#F4C2C7]/85 uppercase">Fidelitas et Disciplina · Class of 1997</span>
                </div>
            </div>
            <ScrollToTop />
        </footer>
    );
}
