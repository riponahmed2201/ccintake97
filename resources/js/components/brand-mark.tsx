import type { ImgHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export default function BrandMark({
    title = 'ccIntake97',
    className,
    ...props
}: ImgHTMLAttributes<HTMLImageElement> & { title?: string }) {
    return (
        <img
            src="/images/logos/logo-transparent.webp"
            alt={title}
            className={cn('object-contain', className)}
            {...props}
        />
    );
}
