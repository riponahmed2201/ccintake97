export const NAV_LINKS = [
    { href: '/', label: 'Home', spyId: 'home' },
    { href: '/about', label: 'About', spyId: 'about' },
    { href: '/colleges', label: 'Colleges', spyId: 'colleges' },
    { href: '/directory', label: 'Directory', spyId: 'directory' },
    { href: '/gallery', label: 'Gallery', spyId: 'gallery' },
    // { href: '/committee', label: 'Committee', spyId: 'committee' },
    // { href: '/welfare', label: 'Welfare', spyId: 'welfare' },
    { href: '/contact', label: 'Contact', spyId: 'contact' },
] as const;

export const SCROLL_SPY_SECTIONS = ['about', 'colleges', 'directory', 'news', 'contact', 'reunion'] as const;