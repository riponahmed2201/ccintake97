import { Link } from '@inertiajs/react';
import { ArrowUpRight } from 'lucide-react';
import BrandMark from '@/components/brand-mark';
import { LANDING_CONTAINER } from '@/components/landing/layout';

export function LandingFooter() {
    return (
        <footer className="relative overflow-hidden bg-brand-ink-deep text-[#F7F3EA]">
            <div className={`${LANDING_CONTAINER} pt-20 pb-10 sm:pt-24 lg:pt-28`}>
                <div className="grid grid-cols-1 gap-12 border-b border-[#F7F3EA]/[0.08] pb-12 md:grid-cols-12 lg:pb-16">
                    <div className="md:col-span-5">
                        <div className="flex items-center gap-3">
                            <BrandMark className="h-16 w-auto shrink-0" />
                            <div>
                                <div className="font-brand text-2xl font-semibold">
                                    ccIntake<span className="text-[#C9A55C] [font-variant-numeric:lining-nums]">97</span>
                                </div>
                                <div className="text-[10px] tracking-[0.3em] text-[#F7F3EA]/40 uppercase">Cadet College Alumni Association</div>
                            </div>
                        </div>
                        <p className="mt-8 max-w-sm text-[14px] leading-relaxed text-[#F7F3EA]/50">
                            The central association uniting the officers, physicians, engineers, diplomats and leaders who entered the cadet colleges of Bangladesh in 1997.
                        </p>
                        <Link href="/?signup=1" className="mt-8 inline-flex min-h-11 items-center gap-2 py-2 text-[14px] text-[#E8D5A3] hover:text-[#F1DFB0]">
                            Apply for membership <ArrowUpRight className="h-4 w-4" />
                        </Link>
                    </div>
                    {[
                        { h: 'Association', links: [['/about', 'About'], ['/colleges', 'Colleges'], ['/directory', 'Directory'], ['/committee', 'Committee']] },
                        { h: 'Activities', links: [['/welfare', 'Welfare & Trust'], ['/#news', 'News & ventures'], ['/#constitution', 'Charter'], ['/#reunion', 'Reunion 2027']] },
                    ].map((col) => (
                        <div key={col.h} className="md:col-span-2">
                            <h4 className="text-[11px] tracking-[0.24em] text-[#D9BF85]/80 uppercase">{col.h}</h4>
                            <ul className="mt-6 space-y-3 text-[14px]">
                                {col.links.map(([href, label]) => (
                                    <li key={href}>
                                        <a href={href} className="text-[#F7F3EA]/60 transition-colors hover:text-[#F7F3EA]">{label}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                    <div className="md:col-span-3">
                        <h4 className="text-[11px] tracking-[0.24em] text-[#D9BF85]/80 uppercase">Portal</h4>
                        <ul className="mt-6 space-y-3 text-[14px]">
                            <li><Link href="/login" className="text-[#F7F3EA]/60 transition-colors hover:text-[#F7F3EA]">Member sign in</Link></li>
                            <li><Link href="/?signup=1" className="inline-flex min-h-10 items-center text-[#F7F3EA]/60 transition-colors hover:text-[#F7F3EA]">Apply for membership</Link></li>
                            <li><Link href="/contact" className="text-[#F7F3EA]/60 transition-colors hover:text-[#F7F3EA]">Contact secretariat</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 text-[12px] text-[#F7F3EA]/35">
                    © {new Date().getFullYear()} INTAKE97.COM · All rights reserved
                </div>
            </div>
        </footer>
    );
}
