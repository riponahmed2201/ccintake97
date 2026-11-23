import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { router } from '@inertiajs/react';
import { CADET_COLLEGES_DATA, HERO_INTERVAL, HERO_SLIDES } from '@/components/landing/constants';
import type { MergedCollege, WelcomeProps } from '@/components/landing/types';

export const CONTACT_INPUT_CLASS =
    'w-full border-0 border-b border-[#0B1220]/15 bg-transparent px-0 py-3 text-[15px] text-[#0B1220] placeholder:text-[#0B1220]/35 focus:border-[#9A7B3F] focus:outline-none focus:ring-0 transition-colors';
export const CONTACT_LABEL_CLASS = 'block text-[11px] font-medium uppercase tracking-[0.2em] text-[#0B1220]/50';

export function useLandingPage(colleges: WelcomeProps['colleges'] = []) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [selectedRegion, setSelectedRegion] = useState('All');
    const [activeCollegeCode, setActiveCollegeCode] = useState(CADET_COLLEGES_DATA[0].short_name);
    const featureRef = useRef<HTMLDivElement>(null);
    const [heroSlide, setHeroSlide] = useState(0);
    const [heroPaused, setHeroPaused] = useState(false);

    const spotlightRef = useRef<HTMLDivElement>(null);
    const [spotlightPaused, setSpotlightPaused] = useState(false);
    const [directorySearch, setDirectorySearch] = useState('');
    const [contactSubmitted, setContactSubmitted] = useState(false);
    const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });

    useEffect(() => {
        if (heroPaused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const t = window.setTimeout(() => setHeroSlide((i) => (i + 1) % HERO_SLIDES.length), HERO_INTERVAL);
        return () => window.clearTimeout(t);
    }, [heroSlide, heroPaused]);

    useEffect(() => {
        const onVis = () => setHeroPaused(document.hidden);
        document.addEventListener('visibilitychange', onVis);
        return () => document.removeEventListener('visibilitychange', onVis);
    }, []);

    const scrollSpotlight = useCallback((dir: 1 | -1) => {
        const el = spotlightRef.current;
        if (!el) return;
        const card = el.querySelector<HTMLElement>('[data-card]');
        const step = (card?.offsetWidth ?? 300) + 16;
        const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 8;
        if (dir === 1 && atEnd) el.scrollTo({ left: 0, behavior: 'smooth' });
        else el.scrollBy({ left: dir * step, behavior: 'smooth' });
    }, []);

    useEffect(() => {
        if (spotlightPaused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const t = window.setInterval(() => scrollSpotlight(1), 4500);
        return () => window.clearInterval(t);
    }, [spotlightPaused, scrollSpotlight]);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 24);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const mergedColleges = useMemo((): MergedCollege[] => {
        return CADET_COLLEGES_DATA.map((canonical) => {
            const dbMatch = colleges.find(
                (c) =>
                    (c.short_name && c.short_name.toLowerCase() === canonical.short_name.toLowerCase()) ||
                    (c.name && c.name.toLowerCase().includes(canonical.short_name.toLowerCase())),
            );
            return {
                ...canonical,
                id: dbMatch?.id ?? canonical.short_name,
                members_count: dbMatch?.members_count ?? (parseInt(canonical.cohort, 10) || 52),
                website: dbMatch?.website || '',
                logo_url: dbMatch?.logo_url ?? null,
            };
        });
    }, [colleges]);

    const filteredColleges = useMemo(() => {
        if (selectedRegion === 'All') return mergedColleges;
        return mergedColleges.filter((c) => c.region === selectedRegion);
    }, [mergedColleges, selectedRegion]);

    const activeCollege = filteredColleges.find((c) => c.short_name === activeCollegeCode) ?? filteredColleges[0];
    const activeIndex = activeCollege ? filteredColleges.indexOf(activeCollege) : 0;

    useEffect(() => {
        if (!filteredColleges.some((c) => c.short_name === activeCollegeCode) && filteredColleges[0]) {
            setActiveCollegeCode(filteredColleges[0].short_name);
        }
    }, [filteredColleges, activeCollegeCode]);

    const selectCollege = useCallback((code: string, scroll = false) => {
        setActiveCollegeCode(code);
        if (scroll && window.innerWidth < 1024) {
            featureRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, []);

    const stepCollege = useCallback(
        (dir: 1 | -1) => {
            const next = filteredColleges[(activeIndex + dir + filteredColleges.length) % filteredColleges.length];
            if (next) setActiveCollegeCode(next.short_name);
        },
        [activeIndex, filteredColleges],
    );

    const handleContactSubmit = useCallback(
        (e: FormEvent) => {
            e.preventDefault();
            router.post('/contact', contactForm, {
                preserveScroll: true,
                onSuccess: () => {
                    setContactSubmitted(true);
                    setContactForm({ name: '', email: '', subject: '', message: '' });
                    window.setTimeout(() => setContactSubmitted(false), 6000);
                },
            });
        },
        [contactForm],
    );

    const submitDirectorySearch = useCallback(
        (e?: FormEvent) => {
            e?.preventDefault();
            const q = directorySearch.trim();
            router.get(q ? `/directory?search=${encodeURIComponent(q)}` : '/directory');
        },
        [directorySearch],
    );

    return {
        mobileMenuOpen,
        setMobileMenuOpen,
        scrolled,
        selectedRegion,
        setSelectedRegion,
        activeCollegeCode,
        activeCollege,
        featureRef,
        heroSlide,
        setHeroSlide,
        heroPaused,
        setHeroPaused,
        spotlightRef,
        spotlightPaused,
        setSpotlightPaused,
        scrollSpotlight,
        directorySearch,
        setDirectorySearch,
        submitDirectorySearch,
        contactSubmitted,
        contactForm,
        setContactForm,
        handleContactSubmit,
        mergedColleges,
        filteredColleges,
        selectCollege,
        stepCollege,
    };
}