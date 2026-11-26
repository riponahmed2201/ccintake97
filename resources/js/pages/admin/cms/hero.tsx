import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Edit2, Image as ImageIcon, MoreHorizontal, Plus, Save, Sparkles, Trash2, Upload } from 'lucide-react';

interface HeroSlide {
    id: number;
    title: string;
    college_code: string | null;
    image_path: string;
    image_url: string;
    object_position: string;
    overlay_dim: number;
    display_order: number;
    is_active: boolean;
}

interface BannerItem {
    title: string;
    subtitle: string;
    image: string;
}

interface CmsHeroProps {
    slides: HeroSlide[];
    heroConfig: {
        headline: string;
        highlight: string;
        subtitle: string;
        primary_cta: string;
        secondary_cta: string;
    };
    banners: Record<'about' | 'colleges' | 'committee' | 'welfare' | 'contact', BannerItem>;
}

const fieldClass =
    'h-10 w-full rounded-md border !border-[#DBDFE9] !bg-[#FCFCFC] px-3 text-[13px] font-normal !text-[#071437] !shadow-none outline-none transition-all duration-200 placeholder:!text-[#99A1B7] hover:!border-[#C4CADA] focus:!border-[#1B84FF] focus:!bg-white focus:!ring-[3px] focus:!ring-[#1B84FF]/10 dark:!bg-[#FCFCFC] dark:!text-[#071437]';

const selectTriggerClass =
    '!h-10 w-full cursor-pointer rounded-md !border-[#DBDFE9] !bg-[#FCFCFC] px-3 text-[13px] font-normal !text-[#071437] !shadow-none';

const selectMenuClass =
    'z-[60] rounded-xl !border-[#F1F1F4] !bg-white p-1 !text-[#071437] shadow-[0_12px_32px_-8px_rgba(7,20,55,0.16)]';

const selectItemClass =
    'cursor-pointer rounded-lg py-2 pr-8 pl-2.5 text-[13px] text-[#071437] focus:!bg-[#F1F6FF] focus:!text-[#1B84FF]';

const labelClass = 'mb-1.5 block text-[12.5px] font-semibold text-[#071437]';

const POSITIONS = ['center top', 'center 35%', 'center 45%', 'center 50%', 'center 60%', 'center bottom'];

export default function CmsHero({ slides, heroConfig, banners }: CmsHeroProps) {
    const [tab, setTab] = useState<'slides' | 'copy' | 'banners'>('slides');

    // Hero Copy State
    const [headline, setHeadline] = useState(heroConfig.headline);
    const [highlight, setHighlight] = useState(heroConfig.highlight);
    const [subtitle, setSubtitle] = useState(heroConfig.subtitle);
    const [primaryCta, setPrimaryCta] = useState(heroConfig.primary_cta);
    const [secondaryCta, setSecondaryCta] = useState(heroConfig.secondary_cta);
    const [savingCopy, setSavingCopy] = useState(false);

    // Slide Modal State
    const [slideModalOpen, setSlideModalOpen] = useState(false);
    const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
    const [slideTitle, setSlideTitle] = useState('');
    const [slideCollege, setSlideCollege] = useState('');
    const [slidePosition, setSlidePosition] = useState('center 50%');
    const [slideDim, setSlideDim] = useState('0.35');
    const [slideOrder, setSlideOrder] = useState('0');
    const [slideActive, setSlideActive] = useState(true);
    const [slideImage, setSlideImage] = useState<File | null>(null);
    const [slideSaving, setSlideSaving] = useState(false);

    // Banner Editor State
    const [bannerKey, setBannerKey] = useState<'about' | 'colleges' | 'committee' | 'welfare' | 'contact'>('about');
    const [bannerTitle, setBannerTitle] = useState(banners.about.title);
    const [bannerSubtitle, setBannerSubtitle] = useState(banners.about.subtitle);
    const [bannerImage, setBannerImage] = useState<File | null>(null);
    const [savingBanner, setSavingBanner] = useState(false);

    const handleSaveCopy = (e: React.FormEvent) => {
        e.preventDefault();
        router.put(
            '/admin/cms/hero/config',
            {
                headline,
                highlight,
                subtitle,
                primary_cta: primaryCta,
                secondary_cta: secondaryCta,
            },
            {
                preserveScroll: true,
                onStart: () => setSavingCopy(true),
                onFinish: () => setSavingCopy(false),
            },
        );
    };

    const openCreateSlide = () => {
        setEditingSlide(null);
        setSlideTitle('');
        setSlideCollege('');
        setSlidePosition('center 50%');
        setSlideDim('0.35');
        setSlideOrder(String(slides.length + 1));
        setSlideActive(true);
        setSlideImage(null);
        setSlideModalOpen(true);
    };

    const openEditSlide = (slide: HeroSlide) => {
        setEditingSlide(slide);
        setSlideTitle(slide.title);
        setSlideCollege(slide.college_code || '');
        setSlidePosition(slide.object_position || 'center 50%');
        setSlideDim(String(slide.overlay_dim ?? 0.35));
        setSlideOrder(String(slide.display_order));
        setSlideActive(slide.is_active);
        setSlideImage(null);
        setSlideModalOpen(true);
    };

    const handleSlideSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (slideSaving) return;

        const formData = new FormData();
        formData.append('title', slideTitle);
        formData.append('college_code', slideCollege);
        formData.append('object_position', slidePosition);
        formData.append('overlay_dim', slideDim);
        formData.append('display_order', slideOrder);
        formData.append('is_active', slideActive ? '1' : '0');
        if (slideImage) formData.append('image', slideImage);

        const url = editingSlide ? `/admin/cms/hero/slides/${editingSlide.id}` : '/admin/cms/hero/slides';
        router.post(url, formData, {
            preserveScroll: true,
            onStart: () => setSlideSaving(true),
            onFinish: () => setSlideSaving(false),
            onSuccess: () => setSlideModalOpen(false),
        });
    };

    const handleDeleteSlide = (slide: HeroSlide) => {
        if (!confirm(`Delete hero slide "${slide.title}"?`)) return;
        router.delete(`/admin/cms/hero/slides/${slide.id}`, { preserveScroll: true });
    };

    const handleBannerSelect = (key: 'about' | 'colleges' | 'committee' | 'welfare' | 'contact') => {
        setBannerKey(key);
        setBannerTitle(banners[key].title);
        setBannerSubtitle(banners[key].subtitle);
        setBannerImage(null);
    };

    const handleBannerSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('page_key', bannerKey);
        formData.append('title', bannerTitle);
        formData.append('subtitle', bannerSubtitle);
        if (bannerImage) formData.append('image', bannerImage);

        router.post('/admin/cms/hero/banners', formData, {
            preserveScroll: true,
            onStart: () => setSavingBanner(true),
            onFinish: () => setSavingBanner(false),
        });
    };

    return (
        <AdminLayout title="Hero & Page Banners" breadcrumbs={[{ title: 'Website & CMS' }, { title: 'Hero & Banners' }]}>
            <Head title="Hero & Page Banners - CCINTAKE 97 Admin" />

            <div className="w-full space-y-6">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-[20px] font-bold tracking-tight text-[#071437]">
                            Hero Section &amp; Page Banners
                        </h1>
                        <p className="mt-1 text-[13px] text-[#78829D]">
                            Manage homepage hero slideshow images, headline copy, and inner marketing page hero banners.
                        </p>
                    </div>
                    {tab === 'slides' && (
                        <Button
                            type="button"
                            onClick={openCreateSlide}
                            className="h-9 cursor-pointer rounded-lg bg-[#1B84FF] px-4 text-[13px] font-semibold text-white hover:bg-[#1B84FF]/90"
                        >
                            <Plus className="mr-1.5 size-4" /> Add Hero Slide
                        </Button>
                    )}
                </div>

                {/* Tabs */}
                <div className="flex flex-wrap gap-2 border-b border-[#F1F1F4] pb-3">
                    {[
                        { key: 'slides', label: `Hero Slideshow (${slides.length})` },
                        { key: 'copy', label: 'Hero Copy & CTAs' },
                        { key: 'banners', label: 'Inner Page Banners' },
                    ].map((t) => (
                        <button
                            key={t.key}
                            type="button"
                            onClick={() => setTab(t.key as typeof tab)}
                            className={`cursor-pointer rounded-lg px-3.5 py-2 text-[13px] font-semibold transition-colors ${
                                tab === t.key
                                    ? 'bg-[#1B84FF] text-white'
                                    : 'bg-[#FCFCFC] text-[#4B5675] hover:bg-[#F1F6FF] hover:text-[#1B84FF]'
                            }`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>

                {tab === 'slides' && (
                    <div className="overflow-hidden rounded-xl border border-[#F1F1F4] bg-white shadow-[0_3px_4px_0_rgba(0,0,0,0.03)]">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-[#FCFCFC]">
                                    <TableRow className="border-[#F1F1F4] hover:bg-transparent">
                                        <TableHead className="w-14 px-5 py-3.5 text-[11.5px] font-semibold text-[#78829D] uppercase">SL</TableHead>
                                        <TableHead className="px-4 py-3.5 text-[11.5px] font-semibold text-[#78829D] uppercase">Preview</TableHead>
                                        <TableHead className="px-4 py-3.5 text-[11.5px] font-semibold text-[#78829D] uppercase">Caption &amp; College</TableHead>
                                        <TableHead className="px-4 py-3.5 text-[11.5px] font-semibold text-[#78829D] uppercase">Position / Dim</TableHead>
                                        <TableHead className="px-4 py-3.5 text-[11.5px] font-semibold text-[#78829D] uppercase">Order</TableHead>
                                        <TableHead className="px-4 py-3.5 text-[11.5px] font-semibold text-[#78829D] uppercase">Status</TableHead>
                                        <TableHead className="px-5 py-3.5 text-right text-[11.5px] font-semibold text-[#78829D] uppercase">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {slides.length === 0 ? (
                                        <TableRow className="border-[#F1F1F4] hover:bg-transparent">
                                            <TableCell colSpan={7} className="h-32 text-center text-[13px] text-[#78829D]">
                                                No custom hero slides yet — the homepage uses built-in campus slides until you add one.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        slides.map((sl, idx) => (
                                            <TableRow key={sl.id} className="border-[#F1F1F4] hover:bg-[#FCFCFC]">
                                                <TableCell className="px-5 py-3.5 text-[12.5px] font-medium text-[#78829D] tabular-nums">{idx + 1}</TableCell>
                                                <TableCell className="px-4 py-3.5">
                                                    <img src={sl.image_url} alt={sl.title} className="h-12 w-20 rounded-lg border border-[#F1F1F4] object-cover" />
                                                </TableCell>
                                                <TableCell className="px-4 py-3.5">
                                                    <div className="text-[13px] font-semibold text-[#071437]">{sl.title}</div>
                                                    {sl.college_code && (
                                                        <span className="mt-0.5 inline-block rounded bg-[#F1F6FF] px-1.5 py-0.5 font-mono text-[10.5px] font-semibold text-[#1B84FF]">
                                                            {sl.college_code}
                                                        </span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="px-4 py-3.5 font-mono text-[12px] text-[#78829D]">
                                                    {sl.object_position} · dim {sl.overlay_dim}
                                                </TableCell>
                                                <TableCell className="px-4 py-3.5 text-[13px] font-semibold text-[#071437] tabular-nums">{sl.display_order}</TableCell>
                                                <TableCell className="px-4 py-3.5">
                                                    <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${sl.is_active ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-slate-50 text-slate-600'}`}>
                                                        {sl.is_active ? 'Active' : 'Hidden'}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="px-5 py-3.5 text-right">
                                                    <div className="flex justify-end">
                                                        <DropdownMenu modal={false}>
                                                            <DropdownMenuTrigger asChild>
                                                                <button type="button" className="inline-flex size-8 cursor-pointer items-center justify-center rounded-lg text-[#78829D] hover:bg-[#F9F9F9] hover:text-[#071437]">
                                                                    <MoreHorizontal className="size-4" />
                                                                </button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end" className="w-44 rounded-xl border-[#F1F1F4] !bg-white p-1.5 !text-[#071437] shadow-[0_12px_32px_-8px_rgba(7,20,55,0.16)]">
                                                                <DropdownMenuItem onSelect={() => openEditSlide(sl)} className="cursor-pointer rounded-lg px-2.5 py-2 text-[13px] font-medium focus:!bg-[#F1F6FF] focus:!text-[#1B84FF]">
                                                                    <Edit2 className="size-4 text-[#78829D]" /> Edit Slide
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator className="my-1 bg-[#F1F1F4]" />
                                                                <DropdownMenuItem onSelect={() => handleDeleteSlide(sl)} className="cursor-pointer rounded-lg px-2.5 py-2 text-[13px] font-medium text-[#F8285A] focus:!bg-[#FFEEF3] focus:!text-[#F8285A]">
                                                                    <Trash2 className="size-4 text-[#F8285A]" /> Delete Slide
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                )}

                {tab === 'copy' && (
                    <form onSubmit={handleSaveCopy} className="rounded-xl border border-[#F1F1F4] bg-white p-6 shadow-[0_3px_4px_0_rgba(0,0,0,0.03)]">
                        <div className="mb-5 flex items-center gap-2.5 border-b border-[#F1F1F4] pb-4">
                            <span className="flex size-8 items-center justify-center rounded-lg bg-[#F1F6FF] text-[#1B84FF]">
                                <Sparkles className="size-4" />
                            </span>
                            <div>
                                <h2 className="text-[15px] font-bold text-[#071437]">Hero Headline &amp; Call-to-Action</h2>
                                <p className="text-[12px] text-[#78829D]">Displayed over the full-screen homepage hero slideshow.</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label className={labelClass}>Main Headline</label>
                                <Input className={fieldClass} value={headline} onChange={(e) => setHeadline(e.target.value)} required />
                            </div>
                            <div>
                                <label className={labelClass}>Highlighted Line (Italic Gold)</label>
                                <Input className={fieldClass} value={highlight} onChange={(e) => setHighlight(e.target.value)} required />
                            </div>
                            <div className="sm:col-span-2">
                                <label className={labelClass}>Subtitle</label>
                                <Input className={fieldClass} value={subtitle} onChange={(e) => setSubtitle(e.target.value)} required />
                            </div>
                            <div>
                                <label className={labelClass}>Primary CTA Button</label>
                                <Input className={fieldClass} value={primaryCta} onChange={(e) => setPrimaryCta(e.target.value)} required />
                            </div>
                            <div>
                                <label className={labelClass}>Secondary Link Label</label>
                                <Input className={fieldClass} value={secondaryCta} onChange={(e) => setSecondaryCta(e.target.value)} required />
                            </div>
                        </div>
                        <div className="mt-5 flex justify-end border-t border-[#F1F1F4] pt-4">
                            <Button type="submit" disabled={savingCopy} className="h-9 cursor-pointer rounded-lg bg-[#1B84FF] px-4 text-[13px] font-semibold text-white hover:bg-[#1B84FF]/90">
                                <Save className="mr-1.5 size-4" /> {savingCopy ? 'Saving...' : 'Save Hero Copy'}
                            </Button>
                        </div>
                    </form>
                )}

                {tab === 'banners' && (
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        <div className="space-y-2 rounded-xl border border-[#F1F1F4] bg-white p-4 shadow-[0_3px_4px_0_rgba(0,0,0,0.03)]">
                            <div className="px-2 pb-1 text-[11.5px] font-bold tracking-wide text-[#78829D] uppercase">Select Page</div>
                            {(['about', 'colleges', 'committee', 'welfare', 'contact'] as const).map((key) => (
                                <button
                                    key={key}
                                    type="button"
                                    onClick={() => handleBannerSelect(key)}
                                    className={`flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2.5 text-left text-[13px] font-semibold capitalize transition-colors ${
                                        bannerKey === key ? 'bg-[#F1F6FF] text-[#1B84FF]' : 'text-[#4B5675] hover:bg-[#FCFCFC]'
                                    }`}
                                >
                                    <span>/{key}</span>
                                    <ImageIcon className="size-4 opacity-70" />
                                </button>
                            ))}
                        </div>

                        <form onSubmit={handleBannerSubmit} className="space-y-4 rounded-xl border border-[#F1F1F4] bg-white p-6 shadow-[0_3px_4px_0_rgba(0,0,0,0.03)] lg:col-span-2">
                            <div className="flex items-center justify-between border-b border-[#F1F1F4] pb-3">
                                <h2 className="text-[15px] font-bold text-[#071437] capitalize">/{bannerKey} Page Banner</h2>
                            </div>
                            <img src={banners[bannerKey].image} alt={bannerKey} className="h-44 w-full rounded-xl border border-[#F1F1F4] object-cover" />
                            <div>
                                <label className={labelClass}>Banner Title</label>
                                <Input className={fieldClass} value={bannerTitle} onChange={(e) => setBannerTitle(e.target.value)} required />
                            </div>
                            <div>
                                <label className={labelClass}>Banner Subtitle</label>
                                <Input className={fieldClass} value={bannerSubtitle} onChange={(e) => setBannerSubtitle(e.target.value)} />
                            </div>
                            <div>
                                <label className={labelClass}>Replace Banner Image (Optional)</label>
                                <input type="file" accept="image/*" onChange={(e) => setBannerImage(e.target.files?.[0] || null)} className="block w-full text-[12.5px] text-[#4B5675] file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-[#F1F6FF] file:px-3 file:py-2 file:text-[12px] file:font-semibold file:text-[#1B84FF]" />
                            </div>
                            <div className="flex justify-end border-t border-[#F1F1F4] pt-4">
                                <Button type="submit" disabled={savingBanner} className="h-9 cursor-pointer rounded-lg bg-[#1B84FF] px-4 text-[13px] font-semibold text-white hover:bg-[#1B84FF]/90">
                                    <Save className="mr-1.5 size-4" /> {savingBanner ? 'Saving...' : 'Update Banner'}
                                </Button>
                            </div>
                        </form>
                    </div>
                )}
            </div>

            {/* Create / Edit Slide Modal */}
            <Dialog open={slideModalOpen} onOpenChange={(open) => !open && setSlideModalOpen(false)}>
                <DialogContent className="flex max-h-[88vh] flex-col gap-0 overflow-hidden rounded-2xl border-[#F1F1F4] !bg-white p-0 !text-[#071437] shadow-[0_20px_50px_-12px_rgba(7,20,55,0.18)] sm:max-w-lg">
                    <DialogHeader className="shrink-0 border-b border-[#F1F1F4] bg-[#FCFCFC] px-6 py-5">
                        <DialogTitle className="text-[16px] font-bold text-[#071437]">
                            {editingSlide ? 'Edit Hero Slide' : 'Add Hero Slide'}
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSlideSubmit} className="flex min-h-0 flex-1 flex-col">
                        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain px-6 py-5">
                            <div>
                                <label className={labelClass}>Caption / Title</label>
                                <Input className={fieldClass} value={slideTitle} onChange={(e) => setSlideTitle(e.target.value)} placeholder="e.g. Faujdarhat Cadet College" required />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className={labelClass}>College Code (Optional)</label>
                                    <Input className={fieldClass} value={slideCollege} onChange={(e) => setSlideCollege(e.target.value)} placeholder="e.g. FCC" />
                                </div>
                                <div>
                                    <label className={labelClass}>Display Order</label>
                                    <Input type="number" className={fieldClass} value={slideOrder} onChange={(e) => setSlideOrder(e.target.value)} min={0} required />
                                </div>
                                <div>
                                    <label className={labelClass}>Image Position</label>
                                    <Select value={slidePosition} onValueChange={setSlidePosition}>
                                        <SelectTrigger className={selectTriggerClass}><SelectValue /></SelectTrigger>
                                        <SelectContent className={selectMenuClass}>
                                            {POSITIONS.map((pos) => (
                                                <SelectItem key={pos} value={pos} className={selectItemClass}>{pos}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <label className={labelClass}>Overlay Dim (0–0.85)</label>
                                    <Input type="number" step="0.05" min="0" max="0.85" className={fieldClass} value={slideDim} onChange={(e) => setSlideDim(e.target.value)} required />
                                </div>
                            </div>
                            <div>
                                <label className={labelClass}>{editingSlide ? 'Replace Image (Optional)' : 'Slide Image'}</label>
                                <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-[#DBDFE9] bg-[#FCFCFC] p-4 text-[12.5px] font-medium text-[#4B5675] hover:border-[#1B84FF] hover:text-[#1B84FF]">
                                    <Upload className="size-4" />
                                    <span>{slideImage ? slideImage.name : 'Choose high-resolution landscape photo (max 5MB)'}</span>
                                    <input type="file" accept="image/*" className="hidden" onChange={(e) => setSlideImage(e.target.files?.[0] || null)} required={!editingSlide} />
                                </label>
                            </div>
                            <label className="flex cursor-pointer items-center gap-2.5 text-[13px] font-semibold text-[#071437]">
                                <Checkbox checked={slideActive} onCheckedChange={(c) => setSlideActive(c === true)} className="size-4.5 rounded-[5px] !border-[#DBDFE9] !bg-white data-[state=checked]:!border-[#1B84FF] data-[state=checked]:!bg-[#1B84FF] data-[state=checked]:!text-white" />
                                Active on homepage slideshow
                            </label>
                        </div>
                        <DialogFooter className="shrink-0 gap-2 border-t border-[#F1F1F4] bg-[#FCFCFC] px-6 py-4">
                            <Button type="button" variant="outline" onClick={() => setSlideModalOpen(false)} className="h-9 cursor-pointer rounded-lg !border-[#DBDFE9] !bg-white px-4 text-[13px] font-semibold !text-[#4B5675] hover:!bg-[#F9FAFB] hover:!text-[#071437]">
                                Cancel
                            </Button>
                            <Button type="submit" disabled={slideSaving} className="h-9 cursor-pointer rounded-lg bg-[#1B84FF] px-4 text-[13px] font-semibold text-white hover:bg-[#1B84FF]/90">
                                {slideSaving ? 'Saving...' : editingSlide ? 'Save Slide' : 'Add Slide'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}
