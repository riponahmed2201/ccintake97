import SiteHeader from '@/components/site-header';

/** Solid header for public pages other than the homepage. */
export default function PublicSiteHeader({ active, surface = 'cream' }: { active?: string; surface?: 'cream' | 'white' }) {
    const spyMap: Record<string, string> = {
        Home: 'home',
        About: 'about',
        Colleges: 'colleges',
        Directory: 'directory',
        Gallery: 'gallery',
        // Committee: 'committee',
        // Welfare: 'welfare',
        Contact: 'contact',
    };
    return <SiteHeader variant="solid" surface={surface} activeNav={active ? spyMap[active] ?? null : null} />;
}