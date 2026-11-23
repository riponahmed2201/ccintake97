import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { ArrowRight, Menu, X } from 'lucide-react';
import BrandMark from '@/components/brand-mark';

const LINKS = [
    { href: '/#about', label: 'About' },
    { href: '/#colleges', label: 'Colleges' },
    { href: '/directory', label: 'Directory' },
    { href: '/#committee', label: 'Committee' },
    { href: '/#welfare', label: 'Welfare' },
    { href: '/#contact', label: 'Contact' },
];

/** Solid header for public pages other than the homepage. */
export default function PublicSiteHeader({ active }: { active?: string }) {
    const { auth } = usePage().props as { auth?: { user?: unknown } };
    const [open, setOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 border-b border-[#0B1220]/[0.06] bg-[#FAF7F0]/90 backdrop-blur-xl">
            <div className="mx-auto flex h-[76px] max-w-[1320px] items-center justify-between px-5 sm:px-8 lg:px-10">
                <Link href="/" className="flex shrink-0 items-center gap-3">
                    <BrandMark className="h-12 w-auto shrink-0" />
                    <span className="leading-tight">
                        <span className="block font-brand text-[22px] font-semibold tracking-[0.02em] text-[#0B1220]">
                            ccIntake<span className="text-[#C9A55C] [font-variant-numeric:lining-nums]">97</span>
                        </span>
                        <span className="hidden text-[9.5px] font-medium tracking-[0.3em] text-[#0B1220]/45 uppercase sm:block">Cadet College Alumni</span>
                    </span>
                </Link>

                <nav className="hidden items-center gap-9 xl:flex">
                    {LINKS.map((l) => (
                        <a
                            key={l.href}
                            href={l.href}
                            className={`relative font-nav text-[16px] font-medium transition-colors after:absolute after:-bottom-1.5 after:left-0 after:h-px after:bg-[#C9A55C] after:transition-all after:duration-300 hover:text-[#7A5E28] ${
                                active === l.label ? 'text-[#7A5E28] after:w-full' : 'text-[#0B1220] after:w-0 hover:after:w-full'
                            }`}
                        >
                            {l.label}
                        </a>
                    ))}
                </nav>

                <div className="flex items-center gap-2 sm:gap-3">
                    {auth?.user ? (
                        <Link href="/dashboard" className="inline-flex items-center gap-2 rounded-full bg-[#0B1220] px-5 py-2.5 font-nav text-[15px] font-medium text-[#F7F3EA] hover:bg-[#1A2438]">
                            Member Portal <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                    ) : (
                        <>
                            <Link href="/login" className="hidden px-3 py-2 font-nav text-[15px] font-medium text-[#0B1220] hover:text-[#7A5E28] sm:inline-block">
                                Sign in
                            </Link>
                            <Link href="/register-alumni" className="inline-flex items-center rounded-full bg-[#0B1220] px-5 py-2.5 font-nav text-[15px] font-medium text-[#F7F3EA] hover:bg-[#1A2438]">
                                Join
                            </Link>
                        </>
                    )}
                    <button type="button" aria-label="Toggle menu" onClick={() => setOpen(!open)} className="rounded-full p-2 text-[#0B1220] hover:bg-[#0B1220]/5 xl:hidden">
                        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>
            </div>
            {open && (
                <div className="border-t border-[#0B1220]/[0.06] bg-[#FAF7F0] px-5 pt-2 pb-6 xl:hidden">
                    {LINKS.map((l) => (
                        <a key={l.href} href={l.href} className="flex items-center justify-between border-b border-[#0B1220]/[0.06] py-3.5 font-nav text-[18px] font-medium text-[#0B1220]">
                            {l.label}
                            <ArrowRight className="h-4 w-4 text-[#9A7B3F]" />
                        </a>
                    ))}
                </div>
            )}
        </header>
    );
}
