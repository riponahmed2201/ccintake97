import type { ImgHTMLAttributes } from 'react';

import BrandMark from '@/components/brand-mark';

export default function AppLogoIcon(props: ImgHTMLAttributes<HTMLImageElement>) {
    return <BrandMark {...props} />;
}
