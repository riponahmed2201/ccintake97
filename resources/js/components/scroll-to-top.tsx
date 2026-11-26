import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

export function ScrollToTop() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const onScroll = () => setVisible(window.scrollY > 360);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    if (!visible) return null;

    return (
        <button
            type="button"
            aria-label="Scroll to top"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed right-6 bottom-6 z-40 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-[#C9A55C]/45 bg-[#091324] text-[#E8D5A3] shadow-[0_12px_28px_-8px_rgba(9,19,36,0.55)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#152238] hover:text-white"
        >
            <ArrowUp className="h-4.5 w-4.5" />
        </button>
    );
}
