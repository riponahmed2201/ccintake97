import { useEffect, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { ArrowRight, Menu, X } from 'lucide-react';
import BrandMark from '@/components/brand-mark';
import { LANDING_CONTAINER } from '@/components/landing/layout';
import { NAV_LINKS } from '@/components/landing/nav-links';
import { useSignupDialog } from '@/contexts/signup-dialog-context';

function resolveHref(href: string, variant: 'hero' | 'solid') {
    if (variant === 'solid' && href.startsWith('#')) {
        return `/${href}`;
    }
    return href;
}

export function SiteHeader({
    variant = 'hero',
    activeNav = null,
    scrolled: scrolledProp,
    mobileMenuOpen: menuOpenProp,
    onMobileMenuOpenChange,
}: {
    variant?: 'hero' | 'solid';
    activeNav?: string | null;
    scrolled?: boolean;
    mobileMenuOpen?: boolean;
    onMobileMenuOpenChange?: (open: boolean) => void;
}) {
    const { auth } = usePage().props as { auth?: { user?: unknown } };
    const [internalMenuOpen, setInternalMenuOpen] = useState(false);
    const [internalScrolled, setInternalScrolled] = useState(false);

    const menuControlled = menuOpenProp !== undefined;
    const mobileMenuOpen = menuControlled ? menuOpenProp : internalMenuOpen;
    const setMobileMenuOpen = menuControlled ? (onMobileMenuOpenChange ?? (() => {})) : setInternalMenuOpen;

    const scrolledControlled = scrolledProp !== undefined;
    const scrolled = scrolledControlled ? scrolledProp : internalScrolled;

    useEffect(() => {
        if (variant !== 'hero' || scrolledControlled) return;
        const onScroll = () => setInternalScrolled(window.scrollY > 24);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, [variant, scrolledControlled]);

    const solidHeader = variant === 'solid' || scrolled || mobileMenuOpen;

    useEffect(() => {
        if (!mobileMenuOpen) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = prev;
        };
    }, [mobileMenuOpen]);

    useEffect(() => {
        if (!mobileMenuOpen) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setMobileMenuOpen(false);
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [mobileMenuOpen, setMobileMenuOpen]);

    const headerShell =
        variant === 'hero'
            ? `fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
                  solidHeader
                      ? 'border-b border-brand-navy/[0.06] bg-brand-cream/85 shadow-[0_1px_30px_-12px_rgba(11,18,32,0.18)] backdrop-blur-xl'
                      : 'border-b border-transparent bg-transparent'
              }`
            : 'sticky top-0 z-50 border-b border-brand-navy/[0.06] bg-brand-cream/90 backdrop-blur-xl';

    const closeMobile = () => setMobileMenuOpen(false);
    const { openSignup } = useSignupDialog();

    const openApply = () => {
        closeMobile();
        if (variant === 'hero') {
            openSignup();
        } else {
            window.location.href = '/register-alumni';
        }
    };

    return (
        <header className={headerShell}>
            <div className={`flex h-[76px] items-center justify-between ${LANDING_CONTAINER}`}>
                <Link href="/" className="group flex shrink-0 items-center gap-3">
                    <BrandMark
                        className={`h-12 w-auto shrink-0 transition-transform duration-500 group-hover:-translate-y-0.5 ${
                            variant === 'hero' && !solidHeader ? 'drop-shadow-[0_6px_14px_rgba(0,0,0,0.3)]' : ''
                        }`}
                    />
                    <span className="leading-tight">
                        <span
                            className={`block font-brand text-[22px] font-semibold tracking-[0.02em] transition-colors duration-500 ${
                                solidHeader ? 'text-brand-navy' : variant === 'hero' ? 'text-brand-cream-text' : 'text-brand-navy'
                            }`}
                        >
                            ccIntake<span className="text-brand-gold [font-variant-numeric:lining-nums]">97</span>
                        </span>
                        <span
                            className={`hidden text-[9.5px] font-medium tracking-[0.3em] uppercase transition-colors duration-500 sm:block ${
                                solidHeader ? 'text-brand-navy/45' : variant === 'hero' ? 'text-brand-cream-text/45' : 'text-brand-navy/45'
                            }`}
                        >
                            Cadet College Alumni
                        </span>
                    </span>
                </Link>

                <nav className="hidden items-center gap-9 xl:flex" aria-label="Primary">
                    {NAV_LINKS.map((l) => {
                        const isActive = activeNav != null && l.spyId === activeNav;
                        const href = resolveHref(l.href, variant);
                        return (
                            <a
                                key={l.href}
                                href={href}
                                className={`relative font-nav text-[16px] font-medium transition-colors duration-300 after:absolute after:-bottom-1.5 after:left-0 after:h-px after:bg-brand-gold after:transition-all after:duration-300 hover:after:w-full ${
                                    isActive ? 'after:w-full' : 'after:w-0'
                                } ${
                                    solidHeader
                                        ? isActive
                                          ? 'text-brand-gold-muted hover:text-brand-gold-muted'
                                          : 'text-brand-navy hover:text-brand-gold-muted'
                                        : isActive
                                          ? 'text-[#E8D5A3]'
                                          : 'text-white hover:text-[#E8D5A3]'
                                }`}
                            >
                                {l.label}
                            </a>
                        );
                    })}
                </nav>

                <div className="flex items-center gap-2 sm:gap-3">
                    {variant === 'hero' && (
                        <a
                            href="#reunion"
                            className={`hidden items-center gap-2 rounded-full border px-4 py-2 font-nav text-[15px] font-medium transition-all duration-300 lg:inline-flex ${
                                solidHeader
                                    ? 'border-brand-gold-muted/40 text-brand-gold-muted hover:bg-brand-gold-muted/10'
                                    : 'border-[#D9BF85]/40 text-[#E8D5A3] hover:bg-white/5'
                            }`}
                        >
                            <span className="h-1.5 w-1.5 rounded-full bg-brand-gold" />
                            Reunion 2027
                        </a>
                    )}
                    {auth?.user ? (
                        <Link
                            href="/dashboard"
                            className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-nav text-[15px] font-medium transition-all duration-300 ${
                                solidHeader || variant === 'solid'
                                    ? 'bg-brand-navy text-brand-cream-text hover:bg-[#1A2438]'
                                    : 'bg-brand-cream-text text-brand-navy hover:bg-white'
                            }`}
                        >
                            Member Portal <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className={`hidden px-3 py-2 font-nav text-[15px] font-medium transition-colors sm:inline-block ${
                                    solidHeader || variant === 'solid'
                                        ? 'text-brand-navy hover:text-brand-gold-muted'
                                        : 'text-white hover:text-[#E8D5A3]'
                                }`}
                            >
                                Sign in
                            </Link>
                            <button
                                type="button"
                                onClick={openApply}
                                className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-nav text-[15px] font-medium transition-all duration-300 ${
                                    solidHeader || variant === 'solid'
                                        ? 'bg-brand-navy text-brand-cream-text hover:bg-[#1A2438]'
                                        : 'bg-brand-cream-text text-brand-navy hover:bg-white'
                                }`}
                            >
                                Join
                            </button>
                        </>
                    )}
                    <button
                        type="button"
                        aria-label="Toggle menu"
                        aria-expanded={mobileMenuOpen}
                        aria-controls="site-mobile-menu"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className={`rounded-full p-2 transition-colors xl:hidden ${
                            solidHeader || variant === 'solid'
                                ? 'text-brand-navy hover:bg-brand-navy/5'
                                : 'text-brand-cream-text hover:bg-white/10'
                        }`}
                    >
                        {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>
            </div>

            {mobileMenuOpen && (
                <div
                    id="site-mobile-menu"
                    className="border-t border-brand-navy/[0.06] bg-brand-cream px-5 pt-2 pb-6 xl:hidden"
                >
                    {NAV_LINKS.map((l) => (
                        <a
                            key={l.href}
                            href={resolveHref(l.href, variant)}
                            onClick={closeMobile}
                            className="flex items-center justify-between border-b border-brand-navy/[0.06] py-3.5 font-nav text-[18px] font-medium text-brand-navy"
                        >
                            {l.label}
                            <ArrowRight className="h-4 w-4 text-brand-gold-muted" />
                        </a>
                    ))}
                    {variant === 'hero' && (
                        <a
                            href="#reunion"
                            onClick={closeMobile}
                            className="flex items-center justify-between py-3.5 font-nav text-[18px] font-medium text-brand-gold-muted"
                        >
                            Grand Reunion 2027
                            <ArrowRight className="h-4 w-4" />
                        </a>
                    )}
                    <div className="mt-4 grid grid-cols-2 gap-3">
                        <Link href="/login" onClick={closeMobile} className="rounded-full border border-brand-navy/15 py-3 text-center text-sm font-medium">
                            Sign in
                        </Link>
                        <button type="button" onClick={openApply} className="rounded-full bg-brand-navy py-3 text-center text-sm font-medium text-brand-cream-text">
                            Apply
                        </button>
                    </div>
                </div>
            )}
        </header>
    );
}

export default SiteHeader;