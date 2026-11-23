import React, { useRef, useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Plus, ExternalLink, Edit2, ImagePlus, Trash2 } from 'lucide-react';
import type { College } from '@/types';

interface CollegesIndexProps {
    colleges: (College & { members_count: number })[];
}

export default function CollegesIndex({ colleges }: CollegesIndexProps) {
    const [editCollege, setEditCollege] = useState<College | null>(null);
    const [createOpen, setCreateOpen] = useState(false);

    const [formName, setFormName] = useState('');
    const [formShortName, setFormShortName] = useState('');
    const [formWebsite, setFormWebsite] = useState('');
    const [formYear, setFormYear] = useState('');
    const [formLocation, setFormLocation] = useState('');
    const [formDescription, setFormDescription] = useState('');
    const [logoUploading, setLogoUploading] = useState(false);
    const [logoError, setLogoError] = useState<string | null>(null);
    const logoInput = useRef<HTMLInputElement>(null);

    // Keep the dialog in sync with fresh props after a logo upload/removal.
    const editing = editCollege ? colleges.find((c) => c.id === editCollege.id) ?? editCollege : null;

    const handleLogoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        e.target.value = '';
        if (!file || !editing) return;
        setLogoError(null);
        setLogoUploading(true);
        router.post(`/admin/colleges/${editing.id}/logo`, { logo: file }, {
            forceFormData: true,
            preserveScroll: true,
            onError: (errs) => setLogoError(errs.logo || 'Upload failed.'),
            onFinish: () => setLogoUploading(false),
        });
    };

    const handleLogoRemove = () => {
        if (!editing) return;
        router.delete(`/admin/colleges/${editing.id}/logo`, { preserveScroll: true });
    };

    const openEdit = (c: College) => {
        setEditCollege(c);
        setLogoError(null);
        setFormName(c.name);
        setFormShortName(c.short_name || '');
        setFormWebsite(c.website || '');
        setFormYear(c.established_year ? String(c.established_year) : '');
        setFormLocation(c.location || '');
        setFormDescription(c.description || '');
    };

    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/admin/colleges', {
            name: formName,
            short_name: formShortName,
            website: formWebsite,
            established_year: formYear ? parseInt(formYear) : null,
            location: formLocation,
            description: formDescription,
        }, {
            onSuccess: () => {
                setCreateOpen(false);
                resetForm();
            },
        });
    };

    const handleUpdateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editCollege) return;
        router.put(`/admin/colleges/${editCollege.id}`, {
            name: formName,
            short_name: formShortName,
            website: formWebsite,
            established_year: formYear ? parseInt(formYear) : null,
            location: formLocation,
            description: formDescription,
        }, {
            onSuccess: () => {
                setEditCollege(null);
                resetForm();
            },
        });
    };

    const handleToggle = (id: number) => {
        router.post(`/admin/colleges/${id}/toggle`);
    };

    const resetForm = () => {
        setFormName('');
        setFormShortName('');
        setFormWebsite('');
        setFormYear('');
        setFormLocation('');
        setFormDescription('');
    };

    return (
        <AdminLayout
            title="Cadet College Network Management"
            breadcrumbs={[{ title: 'Cadet Colleges' }]}
        >
            <Head title="Cadet College Network - INTAKE 97 Admin" />

            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                            Participating Cadet Colleges Network
                        </h1>
                        <p className="text-xs text-slate-500 mt-1">
                            Manage the Cadet Colleges represented in the 1997 intake association.
                        </p>
                    </div>
                    <Button
                        size="sm"
                        onClick={() => {
                            resetForm();
                            setCreateOpen(true);
                        }}
                        className="bg-emerald-600 hover:bg-emerald-700 text-xs font-semibold"
                    >
                        <Plus className="size-3.5 mr-1" /> Add Cadet College
                    </Button>
                </div>

                <Card className="overflow-hidden">
                    <Table>
                        <TableHeader className="bg-slate-50 dark:bg-slate-900/60">
                            <TableRow>
                                <TableHead className="text-xs font-semibold">College Name</TableHead>
                                <TableHead className="text-xs font-semibold">Short Code</TableHead>
                                <TableHead className="text-xs font-semibold">Location</TableHead>
                                <TableHead className="text-xs font-semibold">Established</TableHead>
                                <TableHead className="text-xs font-semibold">1997 Alumni</TableHead>
                                <TableHead className="text-xs font-semibold">Participation Status</TableHead>
                                <TableHead className="text-xs font-semibold text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {colleges.map((c) => (
                                <TableRow key={c.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                                    <TableCell>
                                        <div className="font-semibold text-xs text-slate-900 dark:text-white flex items-center gap-2.5">
                                            <span className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-amber-300/60 bg-white">
                                                {c.logo_url ? (
                                                    <img src={c.logo_url} alt="" className="size-full object-contain p-0.5" />
                                                ) : (
                                                    <span className="text-[9px] font-bold text-slate-400">{c.short_name || '—'}</span>
                                                )}
                                            </span>
                                            {c.name}
                                        </div>
                                        {c.website && (
                                            <a
                                                href={c.website}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-[11px] text-slate-400 hover:text-indigo-600 flex items-center gap-1 mt-0.5"
                                            >
                                                {c.website.replace('https://', '')} <ExternalLink className="size-2.5" />
                                            </a>
                                        )}
                                    </TableCell>
                                    <TableCell className="font-mono text-xs font-semibold">
                                        {c.short_name || '—'}
                                    </TableCell>
                                    <TableCell className="text-xs text-slate-600 dark:text-slate-300">
                                        {c.location || '—'}
                                    </TableCell>
                                    <TableCell className="text-xs text-slate-600 dark:text-slate-300">
                                        {c.established_year || '—'}
                                    </TableCell>
                                    <TableCell className="text-xs font-bold text-slate-900 dark:text-white">
                                        {c.members_count} members
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            className={`text-[10px] cursor-pointer ${
                                                c.is_participating
                                                    ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                            }`}
                                            onClick={() => handleToggle(c.id)}
                                            title="Click to toggle participating status"
                                        >
                                            {c.is_participating ? 'Participating' : 'Inactive'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => openEdit(c)}
                                            className="text-xs"
                                        >
                                            <Edit2 className="size-3.5" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            </div>

            {/* Create Dialog */}
            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-sm font-semibold">Add Cadet College</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCreateSubmit} className="space-y-3 py-2 text-xs">
                        <div>
                            <label className="font-semibold block mb-1">College Name</label>
                            <Input required value={formName} onChange={(e) => setFormName(e.target.value)} />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="font-semibold block mb-1">Short Name / Code</label>
                                <Input placeholder="e.g. FCC, MCC" value={formShortName} onChange={(e) => setFormShortName(e.target.value)} />
                            </div>
                            <div>
                                <label className="font-semibold block mb-1">Established Year</label>
                                <Input type="number" placeholder="1958" value={formYear} onChange={(e) => setFormYear(e.target.value)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="font-semibold block mb-1">Campus Location</label>
                                <Input placeholder="City, Division" value={formLocation} onChange={(e) => setFormLocation(e.target.value)} />
                            </div>
                            <div>
                                <label className="font-semibold block mb-1">Official Website</label>
                                <Input placeholder="https://..." value={formWebsite} onChange={(e) => setFormWebsite(e.target.value)} />
                            </div>
                        </div>
                        <div>
                            <label className="font-semibold block mb-1">Description</label>
                            <textarea rows={2} className="w-full text-xs rounded-md border p-2" value={formDescription} onChange={(e) => setFormDescription(e.target.value)} />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" size="sm" onClick={() => setCreateOpen(false)}>Cancel</Button>
                            <Button type="submit" size="sm" className="bg-emerald-600 hover:bg-emerald-700">Save College</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={!!editCollege} onOpenChange={(open) => !open && setEditCollege(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-sm font-semibold">Edit College Details</DialogTitle>
                    </DialogHeader>
                    <div className="flex items-center gap-4 rounded-lg border border-dashed border-slate-200 p-3 dark:border-slate-700">
                        <span className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-amber-300/70 bg-white">
                            {editing?.logo_url ? (
                                <img src={editing.logo_url} alt="" className="size-full object-contain p-1" />
                            ) : (
                                <span className="text-xs font-bold text-slate-400">{editing?.short_name || 'Logo'}</span>
                            )}
                        </span>
                        <div className="flex-1 space-y-1.5 text-xs">
                            <div className="font-semibold">College logo / crest</div>
                            <div className="text-[11px] text-slate-500">PNG, JPG or WebP · max 2 MB · square, transparent background works best</div>
                            <div className="flex gap-2 pt-0.5">
                                <input ref={logoInput} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={handleLogoSelect} />
                                <Button type="button" size="sm" variant="outline" className="h-7 text-[11px]" disabled={logoUploading} onClick={() => logoInput.current?.click()}>
                                    <ImagePlus className="size-3.5 mr-1" /> {logoUploading ? 'Uploading…' : editing?.logo_url ? 'Replace' : 'Upload'}
                                </Button>
                                {editing?.logo_url && (
                                    <Button type="button" size="sm" variant="ghost" className="h-7 text-[11px] text-red-600 hover:text-red-700" onClick={handleLogoRemove}>
                                        <Trash2 className="size-3.5 mr-1" /> Remove
                                    </Button>
                                )}
                            </div>
                            {logoError && <div className="text-[11px] text-red-600">{logoError}</div>}
                        </div>
                    </div>
                    <form onSubmit={handleUpdateSubmit} className="space-y-3 py-2 text-xs">
                        <div>
                            <label className="font-semibold block mb-1">College Name</label>
                            <Input required value={formName} onChange={(e) => setFormName(e.target.value)} />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="font-semibold block mb-1">Short Name / Code</label>
                                <Input value={formShortName} onChange={(e) => setFormShortName(e.target.value)} />
                            </div>
                            <div>
                                <label className="font-semibold block mb-1">Established Year</label>
                                <Input type="number" value={formYear} onChange={(e) => setFormYear(e.target.value)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="font-semibold block mb-1">Campus Location</label>
                                <Input value={formLocation} onChange={(e) => setFormLocation(e.target.value)} />
                            </div>
                            <div>
                                <label className="font-semibold block mb-1">Official Website</label>
                                <Input value={formWebsite} onChange={(e) => setFormWebsite(e.target.value)} />
                            </div>
                        </div>
                        <div>
                            <label className="font-semibold block mb-1">Description</label>
                            <textarea rows={2} className="w-full text-xs rounded-md border p-2" value={formDescription} onChange={(e) => setFormDescription(e.target.value)} />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" size="sm" onClick={() => setEditCollege(null)}>Cancel</Button>
                            <Button type="submit" size="sm" className="bg-indigo-600 hover:bg-indigo-700">Update College</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}
