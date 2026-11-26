import { useMemo, useState } from 'react';
import { Head } from '@inertiajs/react';
import { CAMPUS_LIFE } from '@/components/landing/constants';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { LANDING_CONTAINER, LANDING_SECTION } from '@/components/landing/layout';
import { MarketingPageHero } from '@/components/marketing/marketing-page-hero';
import PublicSiteHeader from '@/components/public-site-header';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { SignupDialogProvider } from '@/contexts/signup-dialog-context';
import { useLandingPage } from '@/hooks/use-landing-page';
import { assetUrl } from '@/lib/utils';

interface GalleryItem {
    id: number;
    title: string;
    place_label: string | null;
    category: 'campus_life' | 'reunion' | 'events';
    image_url: string;
}

export default function PublicGallery({ items = [] }: { items?: GalleryItem[] }) {
    const landing = useLandingPage();
    const [category, setCategory] = useState<'all' | 'campus_life' | 'reunion' | 'events'>('all');
    const [activePhoto, setActivePhoto] = useState<GalleryItem | null>(null);

    const galleryItems: GalleryItem[] = useMemo(() => {
        if (items.length > 0) return items;
        return CAMPUS_LIFE.map((c, idx) => ({
            id: idx + 1,
            title: c.title,
            place_label: c.place,
            category: 'campus_life' as const,
            image_url: c.src,
        }));
    }, [items]);

    const filtered = useMemo(
        () => (category === 'all' ? galleryItems : galleryItems.filter((g) => g.category === category)),
        [galleryItems, category],
    );

    return (
        <SignupDialogProvider>
            <Head title="Gallery — CCINTAKE 97" />
            <div className="min-h-screen bg-[#FAF8F3] font-sans text-[#091324] antialiased selection:bg-[#10B981] selection:text-[#091324]">
                <PublicSiteHeader active="Gallery" />

                <MarketingPageHero
                    eyebrow="Archive & Memories"
                    title="Campus & Reunion Gallery"
                    intro="Moments from parade grounds, inter-house championships, and batch gatherings across ten cadet colleges."
                    image={assetUrl('/images/campus/hero-mcc.jpg')}
                    cta="Apply for Membership"
                    onCtaClick={() => landing.openSignup()}
                />

                <section className={`${LANDING_SECTION} bg-[#FAF8F3]`}>
                    <div className={LANDING_CONTAINER}>
                        <div className="mb-8 flex flex-wrap items-center gap-2">
                            {[
                                { key: 'all', label: 'All Photos' },
                                { key: 'campus_life', label: 'Campus Life' },
                                { key: 'reunion', label: 'Reunions' },
                                { key: 'events', label: 'Events' },
                            ].map((t) => (
                                <button
                                    key={t.key}
                                    type="button"
                                    onClick={() => setCategory(t.key as typeof category)}
                                    className={`cursor-pointer rounded-full px-4 py-2 text-[13px] font-semibold transition-all ${
                                        category === t.key
                                            ? 'bg-[#091324] text-[#F7F3EA]'
                                            : 'border border-[#091324]/12 bg-white text-[#091324]/75 hover:border-[#10B981]/60 hover:text-[#091324]'
                                    }`}
                                >
                                    {t.label}
                                </button>
                            ))}
                        </div>

                        {filtered.length === 0 ? (
                            <div className="rounded-2xl border border-[#091324]/10 bg-white p-14 text-center text-[14px] text-[#4A4F5C]">
                                No photos in this category yet.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {filtered.map((item) => (
                                    <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => setActivePhoto(item)}
                                        className="group relative cursor-pointer overflow-hidden rounded-2xl bg-[#091324] text-left shadow-[0_18px_45px_-22px_rgba(9,19,36,0.3)] ring-1 ring-[#091324]/10 transition-all duration-300 hover:-translate-y-1 hover:ring-[#10B981]/60"
                                    >
                                        <img
                                            src={item.image_url}
                                            alt={item.title}
                                            loading="lazy"
                                            className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent px-5 pt-14 pb-4 text-white">
                                            {item.place_label && (
                                                <span className="block text-[10.5px] font-semibold tracking-[0.2em] text-[#34D399] uppercase">
                                                    {item.place_label}
                                                </span>
                                            )}
                                            <span className="mt-0.5 block font-serif text-xl font-medium">
                                                {item.title}
                                            </span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                <LandingFooter />
            </div>

            <Dialog open={!!activePhoto} onOpenChange={(open) => !open && setActivePhoto(null)}>
                <DialogContent className="max-w-3xl overflow-hidden rounded-2xl border-[#F1F1F4] !bg-white p-0 !text-[#071437]">
                    <DialogTitle className="sr-only">{activePhoto?.title}</DialogTitle>
                    {activePhoto && (
                        <div>
                            <img src={activePhoto.image_url} alt={activePhoto.title} className="max-h-[72vh] w-full bg-[#091324] object-contain" />
                            <div className="flex items-center justify-between px-6 py-4">
                                <div>
                                    <h3 className="font-serif text-xl font-semibold text-[#071437]">{activePhoto.title}</h3>
                                    {activePhoto.place_label && (
                                        <p className="text-[12px] font-semibold tracking-wide text-[#047857] uppercase">
                                            {activePhoto.place_label}
                                        </p>
                                    )}
                                </div>
                                <span className="rounded-full bg-[#F1F6FF] px-3 py-1 text-[11px] font-semibold text-[#1B84FF] capitalize">
                                    {activePhoto.category.replace('_', ' ')}
                                </span>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </SignupDialogProvider>
    );
}
