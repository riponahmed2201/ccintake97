import { useEffect, useState } from 'react';

export function useScrollSpy(sectionIds: readonly string[], offset = 120) {
    const [active, setActive] = useState<string | null>(null);

    useEffect(() => {
        const elements = sectionIds
            .map((id) => document.getElementById(id))
            .filter((el): el is HTMLElement => !!el);
        if (elements.length === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((e) => e.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
                if (visible[0]?.target.id) {
                    setActive(visible[0].target.id);
                }
            },
            { rootMargin: `-${offset}px 0px -55% 0px`, threshold: [0.08, 0.15, 0.35] },
        );

        elements.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, [sectionIds, offset]);

    return active;
}