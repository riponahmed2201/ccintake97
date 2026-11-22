import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import MemberLayout from '@/layouts/member-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Briefcase, Plus, ExternalLink, Globe, MapPin, CheckCircle2, Clock } from 'lucide-react';
import type { Business, BusinessCategory, Industry } from '@/types';

interface BusinessesIndexProps {
    businesses: {
        data: Business[];
        current_page: number;
        last_page: number;
        total: number;
    };
    myBusiness: Business | null;
    categories: BusinessCategory[];
    industries: Industry[];
}

export default function MemberBusinessesIndex({
    businesses,
    myBusiness,
    categories,
    industries,
}: BusinessesIndexProps) {
    const [createOpen, setCreateOpen] = useState(false);
    const [name, setName] = useState('');
    const [categoryId, setCategoryId] = useState(categories[0]?.id ? String(categories[0].id) : '');
    const [industryId, setIndustryId] = useState(industries[0]?.id ? String(industries[0].id) : '');
    const [website, setWebsite] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [city, setCity] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/member/businesses', {
            name,
            category_id: parseInt(categoryId),
            industry_id: parseInt(industryId),
            website,
            email,
            phone,
            city,
            description,
        }, {
            onSuccess: () => setCreateOpen(false),
        });
    };

    return (
        <MemberLayout
            title="Business Network & Enterprise Directory"
            breadcrumbs={[{ title: 'Business Network' }]}
        >
            <Head title="Business Network - INTAKE97.COM" />

            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                            Alumni Commercial & Business Network
                        </h1>
                        <p className="text-xs text-slate-500 mt-1">
                            Discover alumni-owned enterprises, patronize batchmate businesses, and promote your own services.
                        </p>
                    </div>

                    {!myBusiness ? (
                        <Button
                            size="sm"
                            onClick={() => setCreateOpen(true)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-xs font-semibold"
                        >
                            <Plus className="size-3.5 mr-1" /> Submit My Business
                        </Button>
                    ) : (
                        <Badge variant="outline" className="text-xs p-2 flex items-center gap-2">
                            <Briefcase className="size-3.5 text-indigo-600" />
                            My Business: <strong>{myBusiness.name}</strong> ({myBusiness.status})
                        </Badge>
                    )}
                </div>

                {/* My Business Card (if submitted) */}
                {myBusiness && (
                    <Card className="p-4 border-indigo-200 dark:border-indigo-900 bg-indigo-50/20 dark:bg-slate-900">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-slate-900 dark:text-white text-sm">{myBusiness.name}</span>
                                    <Badge className={`text-[10px] capitalize ${myBusiness.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                                        {myBusiness.status}
                                    </Badge>
                                </div>
                                <p className="text-slate-500 line-clamp-1">{myBusiness.description}</p>
                            </div>
                            <div className="text-[11px] text-slate-400">
                                {myBusiness.status === 'pending' ? 'Awaiting administrative verification' : 'Verified and active in alumni directory'}
                            </div>
                        </div>
                    </Card>
                )}

                {/* Business Directory Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {businesses.data.length === 0 ? (
                        <Card className="col-span-full p-12 text-center text-xs text-slate-400">
                            No verified businesses in directory yet.
                        </Card>
                    ) : (
                        businesses.data.map((biz) => (
                            <Card key={biz.id} className="p-5 flex flex-col justify-between hover:border-indigo-300 transition-all">
                                <div className="space-y-3">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="space-y-0.5">
                                            <div className="font-bold text-sm text-slate-900 dark:text-white">
                                                {biz.name}
                                            </div>
                                            <div className="text-[11px] text-indigo-600 font-medium">
                                                {biz.industry?.name}
                                            </div>
                                        </div>
                                        <Badge variant="outline" className="text-[10px]">
                                            {biz.category?.name}
                                        </Badge>
                                    </div>

                                    <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                                        {biz.description}
                                    </p>

                                    <div className="space-y-1 text-xs text-slate-600 dark:text-slate-400 pt-1 border-t">
                                        <div>Owner: <strong>{biz.owner?.user?.name}</strong> ({biz.owner?.college?.short_name || biz.owner?.college?.name})</div>
                                        {biz.city && <div>Location: {biz.city}, {biz.country_code}</div>}
                                    </div>
                                </div>

                                <div className="pt-3 mt-3 border-t flex justify-end">
                                    {biz.website ? (
                                        <a
                                            href={biz.website}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:underline"
                                        >
                                            Visit Website <ExternalLink className="size-3" />
                                        </a>
                                    ) : (
                                        <span className="text-[11px] text-slate-400">Direct inquiries via profile</span>
                                    )}
                                </div>
                            </Card>
                        ))
                    )}
                </div>
            </div>

            {/* Submit Business Dialog */}
            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-sm font-semibold">List Your Business in Directory</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-3 py-2 text-xs">
                        <div>
                            <label className="font-semibold block mb-1">Company / Business Name *</label>
                            <Input required value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="font-semibold block mb-1">Business Category *</label>
                                <select
                                    value={categoryId}
                                    onChange={(e) => setCategoryId(e.target.value)}
                                    className="w-full text-xs rounded-md border p-2 bg-white dark:bg-slate-900"
                                >
                                    {categories.map((c) => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="font-semibold block mb-1">Industry Sector *</label>
                                <select
                                    value={industryId}
                                    onChange={(e) => setIndustryId(e.target.value)}
                                    className="w-full text-xs rounded-md border p-2 bg-white dark:bg-slate-900"
                                >
                                    {industries.map((i) => (
                                        <option key={i.id} value={i.id}>{i.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="font-semibold block mb-1">Official Website</label>
                                <Input placeholder="https://..." value={website} onChange={(e) => setWebsite(e.target.value)} />
                            </div>
                            <div>
                                <label className="font-semibold block mb-1">City of Operation</label>
                                <Input placeholder="Dhaka, London..." value={city} onChange={(e) => setCity(e.target.value)} />
                            </div>
                        </div>
                        <div>
                            <label className="font-semibold block mb-1">Business Description & Services *</label>
                            <textarea
                                required
                                rows={3}
                                className="w-full text-xs rounded-md border p-2 bg-white dark:bg-slate-900"
                                placeholder="Describe your products, consulting services, or enterprise solutions..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" size="sm" onClick={() => setCreateOpen(false)}>Cancel</Button>
                            <Button type="submit" size="sm" className="bg-indigo-600 hover:bg-indigo-700">Submit for Approval</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </MemberLayout>
    );
}
