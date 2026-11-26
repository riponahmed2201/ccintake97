import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
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
import { Calendar, Edit2, Mail, MoreHorizontal, Plus, Save, Trash2 } from 'lucide-react';

interface Milestone {
    id: number;
    year: string;
    title: string;
    tagline: string;
    description: string;
    is_highlighted: boolean;
    display_order: number;
    is_active: boolean;
}

interface Inquiry {
    id: number;
    name: string;
    email: string;
    subject: string;
    message: string;
    status: 'new' | 'in_progress' | 'resolved';
    created_at: string;
}

interface CmsSectionsProps {
    milestones: Milestone[];
    inquiries: Inquiry[];
    aboutConfig: {
        eyebrow: string;
        title: string;
        body: string;
        mosaic_1_caption: string;
        mosaic_2_caption: string;
        mosaic_3_caption: string;
        mosaic_1_image: string;
        mosaic_2_image: string;
        mosaic_3_image: string;
    };
    reunionConfig: {
        eyebrow: string;
        title: string;
        subtitle: string;
        target_date: string;
        venue: string;
        cta_label: string;
        bg_image: string;
    };
    footerConfig: {
        description: string;
        facebook_url: string;
        linkedin_url: string;
        youtube_url: string;
    };
}

const fieldClass =
    'h-10 w-full rounded-md border !border-[#DBDFE9] !bg-[#FCFCFC] px-3 text-[13px] font-normal !text-[#071437] !shadow-none outline-none transition-all duration-200 placeholder:!text-[#99A1B7] hover:!border-[#C4CADA] focus:!border-[#1B84FF] focus:!bg-white focus:!ring-[3px] focus:!ring-[#1B84FF]/10 dark:!bg-[#FCFCFC] dark:!text-[#071437]';

const textareaClass =
    'w-full rounded-md border !border-[#DBDFE9] !bg-[#FCFCFC] p-3 text-[13px] font-normal !text-[#071437] outline-none transition-all duration-200 focus:!border-[#1B84FF] focus:!bg-white focus:!ring-[3px] focus:!ring-[#1B84FF]/10';

const labelClass = 'mb-1.5 block text-[12.5px] font-semibold text-[#071437]';

export default function CmsSections({
    milestones,
    inquiries,
    aboutConfig,
    reunionConfig,
    footerConfig,
}: CmsSectionsProps) {
    const [tab, setTab] = useState<'about' | 'timeline' | 'reunion' | 'footer' | 'inquiries'>('about');

    // About State
    const [aboutEyebrow, setAboutEyebrow] = useState(aboutConfig.eyebrow);
    const [aboutTitle, setAboutTitle] = useState(aboutConfig.title);
    const [aboutBody, setAboutBody] = useState(aboutConfig.body);
    const [m1Caption, setM1Caption] = useState(aboutConfig.mosaic_1_caption);
    const [m2Caption, setM2Caption] = useState(aboutConfig.mosaic_2_caption);
    const [m3Caption, setM3Caption] = useState(aboutConfig.mosaic_3_caption);
    const [m1File, setM1File] = useState<File | null>(null);
    const [m2File, setM2File] = useState<File | null>(null);
    const [m3File, setM3File] = useState<File | null>(null);
    const [savingAbout, setSavingAbout] = useState(false);

    // Reunion State
    const [rEyebrow, setREyebrow] = useState(reunionConfig.eyebrow);
    const [rTitle, setRTitle] = useState(reunionConfig.title);
    const [rSubtitle, setRSubtitle] = useState(reunionConfig.subtitle);
    const [rDate, setRDate] = useState(reunionConfig.target_date);
    const [rVenue, setRVenue] = useState(reunionConfig.venue);
    const [rCta, setRCta] = useState(reunionConfig.cta_label);
    const [rImage, setRImage] = useState<File | null>(null);
    const [savingReunion, setSavingReunion] = useState(false);

    // Footer State
    const [fDesc, setFDesc] = useState(footerConfig.description);
    const [fFb, setFFb] = useState(footerConfig.facebook_url);
    const [fLi, setFLi] = useState(footerConfig.linkedin_url);
    const [fYt, setFYt] = useState(footerConfig.youtube_url);
    const [savingFooter, setSavingFooter] = useState(false);

    // Milestone Modal State
    const [mModalOpen, setMModalOpen] = useState(false);
    const [editingM, setEditingM] = useState<Milestone | null>(null);
    const [mYear, setMYear] = useState('');
    const [mTitle, setMTitle] = useState('');
    const [mTagline, setMTagline] = useState('');
    const [mDesc, setMDesc] = useState('');
    const [mOrder, setMOrder] = useState('0');
    const [mHighlight, setMHighlight] = useState(false);
    const [mActive, setMActive] = useState(true);
    const [mSaving, setMSaving] = useState(false);

    const saveAbout = (e: React.FormEvent) => {
        e.preventDefault();
        const fd = new FormData();
        fd.append('section', 'about');
        fd.append('eyebrow', aboutEyebrow);
        fd.append('title', aboutTitle);
        fd.append('body', aboutBody);
        fd.append('mosaic_1_caption', m1Caption);
        fd.append('mosaic_2_caption', m2Caption);
        fd.append('mosaic_3_caption', m3Caption);
        if (m1File) fd.append('mosaic_1_image', m1File);
        if (m2File) fd.append('mosaic_2_image', m2File);
        if (m3File) fd.append('mosaic_3_image', m3File);

        router.post('/admin/cms/sections/config', fd, {
            preserveScroll: true,
            onStart: () => setSavingAbout(true),
            onFinish: () => setSavingAbout(false),
        });
    };

    const saveReunion = (e: React.FormEvent) => {
        e.preventDefault();
        const fd = new FormData();
        fd.append('section', 'reunion');
        fd.append('eyebrow', rEyebrow);
        fd.append('title', rTitle);
        fd.append('subtitle', rSubtitle);
        fd.append('target_date', rDate);
        fd.append('venue', rVenue);
        fd.append('cta_label', rCta);
        if (rImage) fd.append('bg_image', rImage);

        router.post('/admin/cms/sections/config', fd, {
            preserveScroll: true,
            onStart: () => setSavingReunion(true),
            onFinish: () => setSavingReunion(false),
        });
    };

    const saveFooter = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(
            '/admin/cms/sections/config',
            {
                section: 'footer',
                description: fDesc,
                facebook_url: fFb,
                linkedin_url: fLi,
                youtube_url: fYt,
            },
            {
                preserveScroll: true,
                onStart: () => setSavingFooter(true),
                onFinish: () => setSavingFooter(false),
            },
        );
    };

    const openCreateMilestone = () => {
        setEditingM(null);
        setMYear('');
        setMTitle('');
        setMTagline('');
        setMDesc('');
        setMOrder(String(milestones.length + 1));
        setMHighlight(false);
        setMActive(true);
        setMModalOpen(true);
    };

    const openEditMilestone = (m: Milestone) => {
        setEditingM(m);
        setMYear(m.year);
        setMTitle(m.title);
        setMTagline(m.tagline);
        setMDesc(m.description);
        setMOrder(String(m.display_order));
        setMHighlight(m.is_highlighted);
        setMActive(m.is_active);
        setMModalOpen(true);
    };

    const handleMilestoneSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            year: mYear,
            title: mTitle,
            tagline: mTagline,
            description: mDesc,
            display_order: Number(mOrder),
            is_highlighted: mHighlight,
            is_active: mActive,
        };
        const opts = {
            preserveScroll: true,
            onStart: () => setMSaving(true),
            onFinish: () => setMSaving(false),
            onSuccess: () => setMModalOpen(false),
        };
        if (editingM) {
            router.put(`/admin/cms/sections/milestones/${editingM.id}`, payload, opts);
        } else {
            router.post('/admin/cms/sections/milestones', payload, opts);
        }
    };

    const handleDeleteMilestone = (m: Milestone) => {
        if (!confirm(`Delete milestone "${m.year} — ${m.title}"?`)) return;
        router.delete(`/admin/cms/sections/milestones/${m.id}`, { preserveScroll: true });
    };

    const updateInquiryStatus = (id: number, status: 'new' | 'in_progress' | 'resolved') => {
        router.put(`/admin/cms/sections/inquiries/${id}`, { status }, { preserveScroll: true });
    };

    return (
        <AdminLayout title="Landing Sections & Timeline" breadcrumbs={[{ title: 'Website & CMS' }, { title: 'Landing Sections' }]}>
            <Head title="Landing Sections - CCINTAKE 97 Admin" />

            <div className="w-full space-y-6">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-[20px] font-bold tracking-tight text-[#071437]">
                            Landing Sections, Timeline &amp; Inquiries
                        </h1>
                        <p className="mt-1 text-[13px] text-[#78829D]">
                            Configure About &amp; Mosaic photos, Timeline milestones, Reunion countdown, Footer links, and Contact inquiries.
                        </p>
                    </div>
                    {tab === 'timeline' && (
                        <Button type="button" onClick={openCreateMilestone} className="h-9 cursor-pointer rounded-lg bg-[#1B84FF] px-4 text-[13px] font-semibold text-white hover:bg-[#1B84FF]/90">
                            <Plus className="mr-1.5 size-4" /> Add Milestone
                        </Button>
                    )}
                </div>

                {/* Tabs */}
                <div className="flex flex-wrap gap-2 border-b border-[#F1F1F4] pb-3">
                    {[
                        { key: 'about', label: 'About & Mosaic' },
                        { key: 'timeline', label: `Timeline (${milestones.length})` },
                        { key: 'reunion', label: 'Reunion Banner' },
                        { key: 'footer', label: 'Footer & Social' },
                        { key: 'inquiries', label: `Contact Inquiries (${inquiries.length})` },
                    ].map((t) => (
                        <button
                            key={t.key}
                            type="button"
                            onClick={() => setTab(t.key as typeof tab)}
                            className={`cursor-pointer rounded-lg px-3.5 py-2 text-[13px] font-semibold transition-colors ${
                                tab === t.key ? 'bg-[#1B84FF] text-white' : 'bg-[#FCFCFC] text-[#4B5675] hover:bg-[#F1F6FF] hover:text-[#1B84FF]'
                            }`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>

                {tab === 'about' && (
                    <form onSubmit={saveAbout} className="space-y-6 rounded-xl border border-[#F1F1F4] bg-white p-6 shadow-[0_3px_4px_0_rgba(0,0,0,0.03)]">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label className={labelClass}>Eyebrow</label>
                                <Input className={fieldClass} value={aboutEyebrow} onChange={(e) => setAboutEyebrow(e.target.value)} required />
                            </div>
                            <div>
                                <label className={labelClass}>Section Title</label>
                                <Input className={fieldClass} value={aboutTitle} onChange={(e) => setAboutTitle(e.target.value)} required />
                            </div>
                            <div className="sm:col-span-2">
                                <label className={labelClass}>Story / Description</label>
                                <textarea rows={3} className={textareaClass} value={aboutBody} onChange={(e) => setAboutBody(e.target.value)} required />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 border-t border-[#F1F1F4] pt-5 md:grid-cols-3">
                            {[
                                { idx: 1, preview: aboutConfig.mosaic_1_image, cap: m1Caption, setCap: setM1Caption, setFile: setM1File },
                                { idx: 2, preview: aboutConfig.mosaic_2_image, cap: m2Caption, setCap: setM2Caption, setFile: setM2File },
                                { idx: 3, preview: aboutConfig.mosaic_3_image, cap: m3Caption, setCap: setM3Caption, setFile: setM3File },
                            ].map((item) => (
                                <div key={item.idx} className="space-y-2.5 rounded-xl border border-[#F1F1F4] bg-[#FCFCFC] p-4">
                                    <img src={item.preview} alt={item.cap} className="h-32 w-full rounded-lg object-cover" />
                                    <div>
                                        <label className={labelClass}>Mosaic Photo {item.idx} Caption</label>
                                        <Input className={fieldClass} value={item.cap} onChange={(e) => item.setCap(e.target.value)} required />
                                    </div>
                                    <input type="file" accept="image/*" onChange={(e) => item.setFile(e.target.files?.[0] || null)} className="block w-full text-[11.5px] text-[#4B5675] file:mr-2 file:cursor-pointer file:rounded-md file:border-0 file:bg-[#F1F6FF] file:px-2.5 file:py-1.5 file:font-semibold file:text-[#1B84FF]" />
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-end border-t border-[#F1F1F4] pt-4">
                            <Button type="submit" disabled={savingAbout} className="h-9 cursor-pointer rounded-lg bg-[#1B84FF] px-4 text-[13px] font-semibold text-white hover:bg-[#1B84FF]/90">
                                <Save className="mr-1.5 size-4" /> {savingAbout ? 'Saving...' : 'Save About Section'}
                            </Button>
                        </div>
                    </form>
                )}

                {tab === 'timeline' && (
                    <div className="overflow-hidden rounded-xl border border-[#F1F1F4] bg-white shadow-[0_3px_4px_0_rgba(0,0,0,0.03)]">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-[#FCFCFC]">
                                    <TableRow className="border-[#F1F1F4] hover:bg-transparent">
                                        <TableHead className="w-14 px-5 py-3.5 text-[11.5px] font-semibold text-[#78829D] uppercase">SL</TableHead>
                                        <TableHead className="px-4 py-3.5 text-[11.5px] font-semibold text-[#78829D] uppercase">Year</TableHead>
                                        <TableHead className="px-4 py-3.5 text-[11.5px] font-semibold text-[#78829D] uppercase">Title &amp; Tagline</TableHead>
                                        <TableHead className="px-4 py-3.5 text-[11.5px] font-semibold text-[#78829D] uppercase">Order</TableHead>
                                        <TableHead className="px-4 py-3.5 text-[11.5px] font-semibold text-[#78829D] uppercase">Status</TableHead>
                                        <TableHead className="px-5 py-3.5 text-right text-[11.5px] font-semibold text-[#78829D] uppercase">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {milestones.length === 0 ? (
                                        <TableRow className="border-[#F1F1F4] hover:bg-transparent">
                                            <TableCell colSpan={6} className="h-32 text-center text-[13px] text-[#78829D]">
                                                No custom milestones yet — homepage uses default 1997–2027 milestones until added.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        milestones.map((m, idx) => (
                                            <TableRow key={m.id} className="border-[#F1F1F4] hover:bg-[#FCFCFC]">
                                                <TableCell className="px-5 py-3.5 text-[12.5px] text-[#78829D] tabular-nums">{idx + 1}</TableCell>
                                                <TableCell className="px-4 py-3.5 font-serif text-[16px] font-bold text-[#071437]">{m.year}</TableCell>
                                                <TableCell className="px-4 py-3.5">
                                                    <div className="text-[13px] font-semibold text-[#071437]">{m.title}</div>
                                                    <div className="text-[11.5px] text-[#78829D]">{m.tagline}</div>
                                                </TableCell>
                                                <TableCell className="px-4 py-3.5 text-[13px] font-semibold text-[#071437] tabular-nums">{m.display_order}</TableCell>
                                                <TableCell className="px-4 py-3.5">
                                                    <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${m.is_active ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-slate-50 text-slate-600'}`}>
                                                        {m.is_active ? 'Active' : 'Hidden'}
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
                                                                <DropdownMenuItem onSelect={() => openEditMilestone(m)} className="cursor-pointer rounded-lg px-2.5 py-2 text-[13px] font-medium focus:!bg-[#F1F6FF] focus:!text-[#1B84FF]">
                                                                    <Edit2 className="size-4 text-[#78829D]" /> Edit Milestone
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator className="my-1 bg-[#F1F1F4]" />
                                                                <DropdownMenuItem onSelect={() => handleDeleteMilestone(m)} className="cursor-pointer rounded-lg px-2.5 py-2 text-[13px] font-medium text-[#F8285A] focus:!bg-[#FFEEF3] focus:!text-[#F8285A]">
                                                                    <Trash2 className="size-4 text-[#F8285A]" /> Delete
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

                {tab === 'reunion' && (
                    <form onSubmit={saveReunion} className="space-y-4 rounded-xl border border-[#F1F1F4] bg-white p-6 shadow-[0_3px_4px_0_rgba(0,0,0,0.03)]">
                        <div className="flex items-center gap-2.5 border-b border-[#F1F1F4] pb-3.5">
                            <span className="flex size-8 items-center justify-center rounded-lg bg-[#F1F6FF] text-[#1B84FF]">
                                <Calendar className="size-4" />
                            </span>
                            <h2 className="text-[15px] font-bold text-[#071437]">Reunion Banner &amp; Countdown</h2>
                        </div>
                        <img src={reunionConfig.bg_image} alt="Reunion" className="h-44 w-full rounded-xl border border-[#F1F1F4] object-cover" />
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label className={labelClass}>Eyebrow</label>
                                <Input className={fieldClass} value={rEyebrow} onChange={(e) => setREyebrow(e.target.value)} required />
                            </div>
                            <div>
                                <label className={labelClass}>Title</label>
                                <Input className={fieldClass} value={rTitle} onChange={(e) => setRTitle(e.target.value)} required />
                            </div>
                            <div className="sm:col-span-2">
                                <label className={labelClass}>Subtitle</label>
                                <textarea rows={2} className={textareaClass} value={rSubtitle} onChange={(e) => setRSubtitle(e.target.value)} required />
                            </div>
                            <div>
                                <label className={labelClass}>Countdown Target ISO Date</label>
                                <Input className={fieldClass} value={rDate} onChange={(e) => setRDate(e.target.value)} placeholder="2027-11-01T00:00:00+06:00" required />
                            </div>
                            <div>
                                <label className={labelClass}>Venue</label>
                                <Input className={fieldClass} value={rVenue} onChange={(e) => setRVenue(e.target.value)} required />
                            </div>
                            <div>
                                <label className={labelClass}>CTA Button Label</label>
                                <Input className={fieldClass} value={rCta} onChange={(e) => setRCta(e.target.value)} required />
                            </div>
                            <div>
                                <label className={labelClass}>Replace Background Photo (Optional)</label>
                                <input type="file" accept="image/*" onChange={(e) => setRImage(e.target.files?.[0] || null)} className="block w-full pt-1 text-[12.5px] text-[#4B5675] file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-[#F1F6FF] file:px-3 file:py-2 file:font-semibold file:text-[#1B84FF]" />
                            </div>
                        </div>
                        <div className="flex justify-end border-t border-[#F1F1F4] pt-4">
                            <Button type="submit" disabled={savingReunion} className="h-9 cursor-pointer rounded-lg bg-[#1B84FF] px-4 text-[13px] font-semibold text-white hover:bg-[#1B84FF]/90">
                                <Save className="mr-1.5 size-4" /> {savingReunion ? 'Saving...' : 'Save Reunion Settings'}
                            </Button>
                        </div>
                    </form>
                )}

                {tab === 'footer' && (
                    <form onSubmit={saveFooter} className="space-y-4 rounded-xl border border-[#F1F1F4] bg-white p-6 shadow-[0_3px_4px_0_rgba(0,0,0,0.03)]">
                        <div>
                            <label className={labelClass}>Footer Description</label>
                            <textarea rows={2} className={textareaClass} value={fDesc} onChange={(e) => setFDesc(e.target.value)} required />
                        </div>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                            <div>
                                <label className={labelClass}>Facebook URL</label>
                                <Input className={fieldClass} value={fFb} onChange={(e) => setFFb(e.target.value)} placeholder="https://facebook.com/..." />
                            </div>
                            <div>
                                <label className={labelClass}>LinkedIn URL</label>
                                <Input className={fieldClass} value={fLi} onChange={(e) => setFLi(e.target.value)} placeholder="https://linkedin.com/..." />
                            </div>
                            <div>
                                <label className={labelClass}>YouTube URL</label>
                                <Input className={fieldClass} value={fYt} onChange={(e) => setFYt(e.target.value)} placeholder="https://youtube.com/..." />
                            </div>
                        </div>
                        <div className="flex justify-end border-t border-[#F1F1F4] pt-4">
                            <Button type="submit" disabled={savingFooter} className="h-9 cursor-pointer rounded-lg bg-[#1B84FF] px-4 text-[13px] font-semibold text-white hover:bg-[#1B84FF]/90">
                                <Save className="mr-1.5 size-4" /> {savingFooter ? 'Saving...' : 'Save Footer Settings'}
                            </Button>
                        </div>
                    </form>
                )}

                {tab === 'inquiries' && (
                    <div className="overflow-hidden rounded-xl border border-[#F1F1F4] bg-white shadow-[0_3px_4px_0_rgba(0,0,0,0.03)]">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-[#FCFCFC]">
                                    <TableRow className="border-[#F1F1F4] hover:bg-transparent">
                                        <TableHead className="w-14 px-5 py-3.5 text-[11.5px] font-semibold text-[#78829D] uppercase">SL</TableHead>
                                        <TableHead className="px-4 py-3.5 text-[11.5px] font-semibold text-[#78829D] uppercase">Sender</TableHead>
                                        <TableHead className="px-4 py-3.5 text-[11.5px] font-semibold text-[#78829D] uppercase">Subject &amp; Message</TableHead>
                                        <TableHead className="px-4 py-3.5 text-[11.5px] font-semibold text-[#78829D] uppercase">Status</TableHead>
                                        <TableHead className="px-5 py-3.5 text-right text-[11.5px] font-semibold text-[#78829D] uppercase">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {inquiries.length === 0 ? (
                                        <TableRow className="border-[#F1F1F4] hover:bg-transparent">
                                            <TableCell colSpan={5} className="h-32 text-center text-[13px] text-[#78829D]">
                                                <Mail className="mx-auto mb-2 size-5 opacity-40" /> No public contact inquiries yet.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        inquiries.map((inq, idx) => (
                                            <TableRow key={inq.id} className="border-[#F1F1F4] hover:bg-[#FCFCFC]">
                                                <TableCell className="px-5 py-3.5 text-[12.5px] text-[#78829D] tabular-nums">{idx + 1}</TableCell>
                                                <TableCell className="px-4 py-3.5">
                                                    <div className="text-[13px] font-semibold text-[#071437]">{inq.name}</div>
                                                    <div className="text-[11.5px] text-[#78829D]">{inq.email}</div>
                                                </TableCell>
                                                <TableCell className="max-w-md px-4 py-3.5">
                                                    <div className="text-[13px] font-semibold text-[#071437]">{inq.subject}</div>
                                                    <p className="mt-0.5 line-clamp-2 text-[12px] text-[#78829D]">{inq.message}</p>
                                                </TableCell>
                                                <TableCell className="px-4 py-3.5">
                                                    <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-semibold capitalize ${inq.status === 'resolved' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : inq.status === 'in_progress' ? 'border-amber-200 bg-amber-50 text-amber-700' : 'border-[#DCEBFF] bg-[#F1F6FF] text-[#1B84FF]'}`}>
                                                        {inq.status.replace('_', ' ')}
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
                                                                <DropdownMenuItem onSelect={() => updateInquiryStatus(inq.id, 'in_progress')} className="cursor-pointer rounded-lg px-2.5 py-2 text-[13px] font-medium">Mark In Progress</DropdownMenuItem>
                                                                <DropdownMenuItem onSelect={() => updateInquiryStatus(inq.id, 'resolved')} className="cursor-pointer rounded-lg px-2.5 py-2 text-[13px] font-medium text-[#17C653]">Mark Resolved</DropdownMenuItem>
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
            </div>

            {/* Milestone Modal */}
            <Dialog open={mModalOpen} onOpenChange={(open) => !open && setMModalOpen(false)}>
                <DialogContent className="flex max-h-[88vh] flex-col gap-0 overflow-hidden rounded-2xl border-[#F1F1F4] !bg-white p-0 !text-[#071437] shadow-[0_20px_50px_-12px_rgba(7,20,55,0.18)] sm:max-w-lg">
                    <DialogHeader className="shrink-0 border-b border-[#F1F1F4] bg-[#FCFCFC] px-6 py-5">
                        <DialogTitle className="text-[16px] font-bold text-[#071437]">
                            {editingM ? 'Edit Milestone' : 'Add Timeline Milestone'}
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleMilestoneSubmit} className="flex min-h-0 flex-1 flex-col">
                        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain px-6 py-5">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className={labelClass}>Year</label>
                                    <Input className={fieldClass} value={mYear} onChange={(e) => setMYear(e.target.value)} placeholder="e.g. 1997" required />
                                </div>
                                <div>
                                    <label className={labelClass}>Display Order</label>
                                    <Input type="number" className={fieldClass} value={mOrder} onChange={(e) => setMOrder(e.target.value)} min={0} required />
                                </div>
                            </div>
                            <div>
                                <label className={labelClass}>Title</label>
                                <Input className={fieldClass} value={mTitle} onChange={(e) => setMTitle(e.target.value)} placeholder="e.g. Induction" required />
                            </div>
                            <div>
                                <label className={labelClass}>Tagline</label>
                                <Input className={fieldClass} value={mTagline} onChange={(e) => setMTagline(e.target.value)} placeholder="e.g. Class 7 · Ten Colleges" required />
                            </div>
                            <div>
                                <label className={labelClass}>Description</label>
                                <textarea rows={3} className={textareaClass} value={mDesc} onChange={(e) => setMDesc(e.target.value)} required />
                            </div>
                            <div className="flex flex-wrap gap-5">
                                <label className="flex cursor-pointer items-center gap-2 text-[13px] font-semibold text-[#071437]">
                                    <Checkbox checked={mHighlight} onCheckedChange={(c) => setMHighlight(c === true)} className="size-4.5 rounded-[5px] !border-[#DBDFE9] !bg-white data-[state=checked]:!border-[#1B84FF] data-[state=checked]:!bg-[#1B84FF] data-[state=checked]:!text-white" />
                                    Highlight node (gold accent)
                                </label>
                                <label className="flex cursor-pointer items-center gap-2 text-[13px] font-semibold text-[#071437]">
                                    <Checkbox checked={mActive} onCheckedChange={(c) => setMActive(c === true)} className="size-4.5 rounded-[5px] !border-[#DBDFE9] !bg-white data-[state=checked]:!border-[#1B84FF] data-[state=checked]:!bg-[#1B84FF] data-[state=checked]:!text-white" />
                                    Active
                                </label>
                            </div>
                        </div>
                        <DialogFooter className="shrink-0 gap-2 border-t border-[#F1F1F4] bg-[#FCFCFC] px-6 py-4">
                            <Button type="button" variant="outline" onClick={() => setMModalOpen(false)} className="h-9 cursor-pointer rounded-lg !border-[#DBDFE9] !bg-white px-4 text-[13px] font-semibold !text-[#4B5675]">
                                Cancel
                            </Button>
                            <Button type="submit" disabled={mSaving} className="h-9 cursor-pointer rounded-lg bg-[#1B84FF] px-4 text-[13px] font-semibold text-white hover:bg-[#1B84FF]/90">
                                {mSaving ? 'Saving...' : editingM ? 'Save Milestone' : 'Add Milestone'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}
