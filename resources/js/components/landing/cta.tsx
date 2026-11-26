import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '@/lib/utils';

const primaryBase =
    'group inline-flex items-center justify-center gap-2.5 rounded-full text-sm font-semibold transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-70';

const variants = {
    cream: 'bg-brand-cream-text px-7 py-4 text-brand-navy shadow-[0_10px_28px_-10px_rgba(11,18,32,0.28)] hover:bg-white hover:-translate-y-0.5',
    gold: 'bg-gradient-to-r from-[#6E1622] via-[#450D15] to-[#5E121D] px-7 py-4 text-white shadow-[0_14px_34px_-10px_rgba(94,18,29,0.55)] hover:brightness-110 hover:-translate-y-0.5',
    navy: 'border border-brand-gold-bright/50 bg-brand-navy px-7 py-4 text-brand-cream-text shadow-[0_12px_30px_-12px_rgba(7,16,24,0.65)] hover:bg-brand-ink-deep hover:-translate-y-0.5',
} as const;

type PrimaryCtaProps = {
    children: ReactNode;
    variant?: keyof typeof variants;
    icon?: boolean;
    className?: string;
} & (
    | ({ as?: 'button' } & ComponentPropsWithoutRef<'button'>)
    | ({ as: 'link'; href: string } & Omit<ComponentPropsWithoutRef<typeof Link>, 'href'>)
);

export function PrimaryCta({ children, variant = 'navy', icon = true, className = '', as = 'link', ...rest }: PrimaryCtaProps) {
    const cls = `${primaryBase} ${variants[variant]} ${className}`;
    const inner = (
        <>
            {children}
            {icon && (
                <ArrowRight
                    className={cn(
                        'h-4 w-4 transition-transform duration-300 group-hover:translate-x-1',
                        variant === 'cream' && 'text-brand-navy',
                        variant === 'gold' && 'text-brand-cream-text',
                        variant === 'navy' && 'text-brand-cream-text',
                    )}
                />
            )}
        </>
    );

    if (as === 'button') {
        const { type, ...buttonRest } = rest as ComponentPropsWithoutRef<'button'>;
        return (
            <button type={type ?? 'button'} className={cls} {...buttonRest}>
                {inner}
            </button>
        );
    }

    const { href, ...linkRest } = rest as { href: string } & Omit<ComponentPropsWithoutRef<typeof Link>, 'href'>;
    return (
        <Link href={href} className={cls} {...linkRest}>
            {inner}
        </Link>
    );
}

export function SecondaryCta({ onClick, children }: { onClick?: () => void; children: ReactNode }) {
    if (onClick) {
        return (
            <button type="button" onClick={onClick} className="group inline-flex items-center gap-2 text-[14px] font-medium text-brand-cream-text">
                <span className="relative pb-1 after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-left after:bg-brand-cream-text after:transition-transform after:duration-500 group-hover:after:scale-x-50">
                    {children}
                </span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
        );
    }
    return null;
}