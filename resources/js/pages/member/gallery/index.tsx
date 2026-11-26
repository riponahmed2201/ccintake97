import { useMemo, useState } from 'react';
import { Head } from '@inertiajs/react';
import { CAMPUS_LIFE } from '@/components/landing/constants';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import MemberLayout from '@/layouts/member-layout';
import { Images } from 'lucide-react';

interface GalleryItem {
    id: number;
    title: string;
    place_label: string | null;
    category: 'campus_life' | 'reunion' | 'events';
    image_url: string;
}

export default function MemberGallery({ items = [] }: { items?: GalleryItem[] }) {
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
        <MemberLayout title="Photo Gallery" breadcrumbs={[{ title: 'Gallery' }]}>
            <Head title="Gallery - CCINTAKE97.COM" />

            <div className="w-full space-y-6">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-[20px] font-bold tracking-tight text-[#071437]">
                            Campus &amp; Reunion Gallery
                        </h1>
                        <p className="mt-1 text-[13px] text-[#78829D]">
                            Archive of cadet college campus memories, reunions, and batch events.
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
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
                            className={`cursor-pointer rounded-lg px-3.5 py-2 text-[13px] font-semibold transition-colors ${
                                category === t.key
                                    ? 'bg-[#1B84FF] text-white'
                                    : 'border border-[#F1F1F4] bg-white text-[#4B5675] hover:bg-[#F1F6FF] hover:text-[#1B84FF]'
                            }`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>

                {filtered.length === 0 ? (
                    <div className="rounded-xl border border-[#F1F1F4] bg-white p-14 text-center text-[13px] text-[#78829D]">
                        <Images className="mx-auto mb-2 size-6 opacity-40" />
                        No photos available in this category yet.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {filtered.map((item) => (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => setActivePhoto(item)}
                                className="group overflow-hidden rounded-xl border border-[#F1F1F4] bg-white text-left shadow-[0_3px_4px_0_rgba(0,0,0,0.03)] transition-all hover:-translate-y-0.5 hover:border-[#1B84FF]/40 hover:shadow-[0_10px_25px_-10px_rgba(27,132,255,0.16)]"
                            >
                                <div className="overflow-hidden bg-[#FCFCFC]">
                                    <img
                                        src={item.image_url}
                                        alt={item.title}
                                        loading="lazy"
                                        className="aspect-[4/3] w-full cursor-pointer object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                </div>
                                <div className="flex items-center justify-between gap-2 p-4">
                                    <div className="min-w-0">
                                        <div className="truncate text-[13.5px] font-semibold text-[#071437]">{item.title}</div>
                                        {item.place_label && (
                                            <div className="mt-0.5 text-[11.5px] font-medium text-[#78829D]">{item.place_label}</div>
                                        )}
                                    </div>
                                    <span className="shrink-0 rounded-md bg-[#F1F6FF] px-2 py-0.5 text-[10.5px] font-semibold text-[#1B84FF] capitalize">
                                        {item.category.replace('_', ' ')}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <Dialog open={!!activePhoto} onOpenChange={(open) => !open && setActivePhoto(null)}>
                <DialogContent className="max-w-3xl overflow-hidden rounded-2xl border-[#F1F1F4] !bg-white p-0 !text-[#071437]">
                    <DialogTitle className="sr-only">{activePhoto?.title}</DialogTitle>
                    {activePhoto && (
                        <div>
                            <img src={activePhoto.image_url} alt={activePhoto.title} className="max-h-[72vh] w-full bg-[#071437] object-contain" />
                            <div className="flex items-center justify-between px-6 py-4">
                                <div>
                                    <h3 className="text-[15px] font-bold text-[#071437]">{activePhoto.title}</h3>
                                    {activePhoto.place_label && (
                                        <p className="text-[12px] text-[#78829D]">{activePhoto.place_label}</p>
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
        </MemberLayout>
    );
}
