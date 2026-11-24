import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '@/lib/utils';

const primaryBase =
    'group inline-flex items-center justify-center gap-2.5 rounded-full text-sm font-semibold transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-70';

const variants = {
    cream: 'bg-brand-cream-text px-7 py-4 text-brand-navy hover:bg-white',
    gold: 'bg-gradient-to-r from-[#E8D5A3] to-[#C9A55C] px-7 py-4 text-[#0B1220] hover:shadow-[0_10px_40px_-10px_rgba(201,165,92,0.6)]',
    navy: 'bg-[#0B1220] px-7 py-4 text-[#F7F3EA] hover:bg-[#1A2438] hover:shadow-[0_16px_32px_-16px_rgba(11,18,32,0.6)]',
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
                        variant === 'gold' && 'text-[#0B1220]',
                        variant === 'navy' && 'text-[#E8D5A3]',
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