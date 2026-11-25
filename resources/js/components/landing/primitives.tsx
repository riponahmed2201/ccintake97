import React, { useEffect, useRef, useState } from 'react';
import { Link } from '@inertiajs/react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

export function Reveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const node = ref.current;
        if (!node) return;
        if (typeof IntersectionObserver === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            setVisible(true);
            return;
        }
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
        );
        observer.observe(node);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            style={{ transitionDelay: `${delay}ms` }}
            className={`transition-all duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'} ${className}`}
        >
            {children}
        </div>
    );
}

export function SectionHeading({
    index,
    eyebrow,
    title,
    intro,
    light = false,
    align = 'left',
    action,
    titleTag: TitleTag = 'h2',
    reveal = true,
}: {
    index?: string;
    eyebrow?: string;
    title: React.ReactNode;
    intro?: string;
    light?: boolean;
    align?: 'left' | 'center';
    action?: React.ReactNode;
    titleTag?: 'h1' | 'h2';
    reveal?: boolean;
}) {
    const centered = align === 'center';
    const shell = `flex flex-col gap-8 ${centered ? 'items-center text-center' : 'md:flex-row md:items-end md:justify-between'}`;
    const content = (
        <>
            <div className={`max-w-3xl space-y-5 ${centered ? 'flex flex-col items-center' : 'min-w-0'}`}>
                {(index || eyebrow) && (
                    <p
                        className={`text-[11px] font-medium uppercase ${light ? 'text-brand-gold-bright/80' : 'text-brand-gold-muted'} ${
                            centered ? 'tracking-[0.28em]' : 'tracking-[0.22em] sm:tracking-[0.28em]'
                        }`}
                    >
                        {[index, eyebrow].filter(Boolean).join(' · ')}
                    </p>
                )}
                <TitleTag
                    className={`font-serif text-4xl leading-[1.05] font-medium tracking-[-0.01em] sm:text-5xl lg:text-[3.5rem] ${
                        light ? 'text-[#F7F3EA]' : 'text-[#0B1220]'
                    }`}
                >
                    {title}
                </TitleTag>
                {intro && (
                    <p className={`max-w-2xl text-[15px] leading-relaxed sm:text-base ${light ? 'text-[#F7F3EA]/60' : 'text-[#4A4F5C]'}`}>
                        {intro}
                    </p>
                )}
            </div>
            {action && <div className="shrink-0">{action}</div>}
        </>
    );

    if (!reveal) {
        return <div className={shell}>{content}</div>;
    }

    return <Reveal className={shell}>{content}</Reveal>;
}

export function GhostLink({ href, children, light = false, internal = false }: { href: string; children: React.ReactNode; light?: boolean; internal?: boolean }) {
    const cls = `group inline-flex items-center gap-2 border-b pb-1 text-[13px] font-medium tracking-wide transition-colors ${
        light ? 'border-[#D9BF85]/40 text-[#F7F3EA] hover:border-[#D9BF85]' : 'border-[#0B1220]/20 text-[#0B1220] hover:border-[#9A7B3F]'
    }`;
    const inner = (
        <>
            {children}
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </>
    );
    return internal ? <a href={href} className={cls}>{inner}</a> : <Link href={href} className={cls}>{inner}</Link>;
}

export function ExploreLink({ href, children, light = false, internal = true }: { href: string; children: React.ReactNode; light?: boolean; internal?: boolean }) {
    const cls = `group inline-flex items-center gap-2 text-[14px] font-medium ${light ? 'text-[#F7F3EA]' : 'text-[#0B1220]'}`;
    const inner = (
        <>
            <span className={`relative pb-1 after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-left after:transition-transform after:duration-500 group-hover:after:scale-x-50 ${light ? 'after:bg-[#F7F3EA]' : 'after:bg-[#0B1220]'}`}>
                {children}
            </span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
        </>
    );
    return internal ? <a href={href} className={cls}>{inner}</a> : <Link href={href} className={cls}>{inner}</Link>;
}

export function CollegeEmblem({ logo, code, name, size = 88 }: { logo?: string | null; code: string; name: string; size?: number }) {
    const [failed, setFailed] = useState(false);
    const showLogo = !!logo && !failed;
    const inset = Math.round(size * 0.1);
    const fontSize = Math.round(size * (code.length > 3 ? 0.2 : 0.26));
    return (
        <div className="relative shrink-0" style={{ width: size, height: size }}>
            <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full transition-transform duration-[1200ms] ease-out group-hover:rotate-[30deg]" aria-hidden="true">
                <circle cx="50" cy="50" r="48.5" fill="none" stroke="#C9A55C" strokeWidth="0.6" opacity="0.55" />
                {Array.from({ length: 48 }).map((_, i) => {
                    const a = (i * 7.5 * Math.PI) / 180;
                    const r2 = i % 4 === 0 ? 44 : 45.5;
                    return <line key={i} x1={50 + 47 * Math.cos(a)} y1={50 + 47 * Math.sin(a)} x2={50 + r2 * Math.cos(a)} y2={50 + r2 * Math.sin(a)} stroke="#C9A55C" strokeWidth="0.6" opacity="0.6" />;
                })}
            </svg>
            <div
                style={{ inset }}
                className={`absolute flex items-center justify-center overflow-hidden rounded-full ring-1 ring-[#C9A55C]/50 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.6)] ${
                    showLogo ? 'bg-white' : 'bg-gradient-to-br from-[#1E2A42] via-[#0E1628] to-[#070B14]'
                }`}
            >
                {showLogo ? (
                    <img src={logo!} alt={`${name} crest`} loading="lazy" onError={() => setFailed(true)} className="h-full w-full object-contain p-[8%]" />
                ) : (
                    <span style={{ fontSize }} className="bg-gradient-to-b from-[#F1DFB0] to-[#B8924A] bg-clip-text font-serif leading-none font-medium text-transparent">
                        {code}
                    </span>
                )}
            </div>
        </div>
    );
}

export const initialsOf = (name?: string) =>
    (name || '')
        .replace(/^(Brig\.|Gen\.|Dr\.|Barrister|\(Retd\.\))\s*/g, '')
        .split(' ')
        .filter((n) => /^[A-Za-z]/.test(n) && !n.includes('.'))
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase() || 'CC';