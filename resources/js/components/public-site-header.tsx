import SiteHeader from '@/components/site-header';

/** Solid header for public pages other than the homepage. */
export default function PublicSiteHeader({ active }: { active?: string }) {
    const spyMap: Record<string, string> = {
        About: 'about',
        Colleges: 'colleges',
        Directory: 'directory',
        Committee: 'committee',
        Welfare: 'welfare',
        Contact: 'contact',
    };
    return <SiteHeader variant="solid" activeNav={active ? spyMap[active] ?? null : null} />;
}