import type { InertiaLinkProps } from '@inertiajs/react';
import { clsx } from 'clsx';
import type { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function toUrl(url: NonNullable<InertiaLinkProps['href']>): string {
    return typeof url === 'string' ? url : url.url;
}

export function assetUrl(path: string): string {
    if (!path || /^(https?:)?\/\//i.test(path) || path.startsWith('data:') || path.startsWith('blob:')) {
        return path;
    }

    const base =
        typeof document !== 'undefined'
            ? document.querySelector('meta[name="asset-url"]')?.getAttribute('content') || ''
            : '';

    return `${base.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
}
