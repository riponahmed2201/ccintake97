import { useEffect, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { ArrowRight, Menu, UserRound, X } from 'lucide-react';
import BrandMark from '@/components/brand-mark';
import { LANDING_CONTAINER } from '@/components/landing/layout';
import { NAV_LINKS } from '@/components/landing/nav-links';
import { useSignupDialog } from '@/contexts/signup-dialog-context';

export function SiteHeader({
    variant = 'hero',
    surface = 'cream',
    scrolled: scrolledProp,
    mobileMenuOpen: menuOpenProp,
    onMobileMenuOpenChange,
}: {
    variant?: 'hero' | 'solid';
    surface?: 'cream' | 'white';
    activeNav?: string | null;
    scrolled?: boolean;
    mobileMenuOpen?: boolean;
    onMobileMenuOpenChange?: (open: boolean) => void;
}) {
    const page = usePage();
    const { auth } = page.props as { auth?: { user?: unknown } };
    const path = page.url.split('?')[0].replace(/\/$/, '') || '/';
    const linkActive = (href: string) => {
        const target = href.split('?')[0].replace(/\/$/, '') || '/';
        if (target === '/') return path === '/';
        return path === target || path.startsWith(`${target}/`);
    };
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
                      ? 'border-b border-brand-navy/[0.06] bg-white shadow-[0_1px_30px_-12px_rgba(11,18,32,0.18)] backdrop-blur-xl'
                      : 'border-b border-transparent bg-transparent'
              }`
            : 'sticky top-0 z-50 border-b border-brand-navy/[0.06] bg-white/95 backdrop-blur-xl';

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
                        className={`shrink-0 transition-all duration-500 group-hover:scale-[1.03] ${
                            variant === 'hero' && !solidHeader
                                ? 'h-[88px] w-[88px] translate-y-3 drop-shadow-[0_10px_22px_rgba(11,18,32,0.45)] sm:h-[112px] sm:w-[112px] sm:translate-y-4'
                                : 'h-[58px] w-[58px] drop-shadow-[0_2px_6px_rgba(11,18,32,0.12)] sm:h-[64px] sm:w-[64px]'
                        }`}
                    />
                    <span
                        className={`overflow-hidden leading-tight whitespace-nowrap transition-all duration-500 ${
                            variant === 'hero' && !solidHeader
                                ? 'pointer-events-none max-w-0 opacity-0'
                                : 'max-w-[200px] opacity-100'
                        }`}
                    >
                        <span className="block font-brand text-[22px] font-semibold tracking-[0.02em] text-brand-navy">
                            ccIntake<span className="text-brand-gold [font-variant-numeric:lining-nums]">97</span>
                        </span>
                    </span>
                </Link>

                <nav className="hidden items-center gap-9 xl:flex" aria-label="Primary">
                    {NAV_LINKS.map((l) => {
                        const isActive = linkActive(l.href);
                        const linkClass = `relative font-nav text-[16px] font-medium transition-colors duration-300 after:absolute after:-bottom-1.5 after:left-0 after:h-px after:bg-brand-gold after:transition-all after:duration-300 hover:after:w-full ${
                            isActive ? 'after:w-full' : 'after:w-0'
                        } ${
                            solidHeader
                                ? isActive
                                  ? 'text-brand-gold-muted hover:text-brand-gold-muted'
                                  : 'text-brand-navy hover:text-brand-gold-muted'
                                : isActive
                                  ? 'text-[#F4C2C7]'
                                  : 'text-white hover:text-[#F4C2C7]'
                        }`;
                        return (
                            <Link key={l.href} href={l.href} aria-current={isActive ? 'page' : undefined} className={linkClass}>
                                {l.label}
                            </Link>
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
                                    : 'border-[#F4C2C7]/40 text-[#F4C2C7] hover:bg-white/5'
                            }`}
                        >
                            <span className="h-1.5 w-1.5 rounded-full bg-brand-gold" />
                            Reunion 2027
                        </a>
                    )}
                    {auth?.user ? (
                        <Link
                            href="/dashboard"
                            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#6E1622] via-[#450D15] to-[#5E121D] px-5 py-2.5 font-nav text-[15px] font-medium text-white shadow-[0_10px_24px_-8px_rgba(94,18,29,0.5)] transition-all duration-300 hover:brightness-110"
                        >
                            Member Portal <ArrowRight className="h-3.5 w-3.5 text-white" />
                        </Link>
                    ) : (
                        <Link
                            href="/login"
                            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#6E1622] via-[#450D15] to-[#5E121D] px-5 py-2.5 font-nav text-[15px] font-medium text-white shadow-[0_10px_24px_-8px_rgba(94,18,29,0.5)] transition-all duration-300 hover:brightness-110"
                        >
                            <UserRound className="h-4 w-4 text-white" />
                            <span>Sign in</span>
                        </Link>
                    )}
                    <button
                        type="button"
                        aria-label="Toggle menu"
                        aria-expanded={mobileMenuOpen}
                        aria-controls="site-mobile-menu"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className={`rounded-full p-2 transition-colors xl:hidden ${
                            solidHeader
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
                    className="border-t border-brand-navy/[0.06] bg-white px-5 pt-2 pb-6 xl:hidden"
                >
                    {NAV_LINKS.map((l) => (
                        <Link
                            key={l.href}
                            href={l.href}
                            aria-current={linkActive(l.href) ? 'page' : undefined}
                            onClick={closeMobile}
                            className={`flex items-center justify-between border-b border-brand-navy/[0.06] py-3.5 font-nav text-[18px] font-medium ${
                                linkActive(l.href) ? 'text-brand-gold-muted' : 'text-brand-navy'
                            }`}
                        >
                            {l.label}
                            <ArrowRight className="h-4 w-4 text-brand-gold-muted" />
                        </Link>
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
                        <Link href="/login" onClick={closeMobile} className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#6E1622] via-[#450D15] to-[#5E121D] py-3 text-center text-sm font-medium text-white shadow-[0_10px_24px_-8px_rgba(94,18,29,0.5)] transition-all hover:brightness-110">
                            <UserRound className="h-4 w-4 text-white" />
                            Sign in
                        </Link>
                        <button type="button" onClick={openApply} className="rounded-full border border-brand-navy/15 py-3 text-center text-sm font-medium text-brand-navy">
                            Apply
                        </button>
                    </div>
                </div>
            )}
        </header>
    );
}

export default SiteHeader;