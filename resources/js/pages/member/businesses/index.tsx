import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import MemberLayout from '@/layouts/member-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Briefcase, Plus, ExternalLink, MapPin } from 'lucide-react';
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

const fieldClass =
    'h-10 w-full rounded-md border !border-[#DBDFE9] !bg-[#FCFCFC] px-3 text-[13px] font-normal !text-[#071437] !shadow-none outline-none transition-all duration-200 placeholder:!text-[#99A1B7] hover:!border-[#C4CADA] focus:!border-[#1B84FF] focus:!bg-white focus:!ring-[3px] focus:!ring-[#1B84FF]/10 dark:!bg-[#FCFCFC] dark:!text-[#071437]';

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
    const [city, setCity] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(
            '/member/businesses',
            {
                name,
                category_id: parseInt(categoryId),
                industry_id: parseInt(industryId),
                website,
                city,
                description,
            },
            {
                preserveScroll: true,
                onSuccess: () => setCreateOpen(false),
            }
        );
    };

    return (
        <MemberLayout
            title="Business Network"
            breadcrumbs={[{ title: 'Business Network' }]}
        >
            <Head title="Business Network - CCINTAKE97.COM" />

            <div className="w-full space-y-6">
                {/* Page Header */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="text-[22px] font-semibold tracking-tight text-[#071437]">
                            Alumni Business Network
                        </h1>
                        <p className="mt-1 text-[13px] text-[#78829D]">
                            Discover alumni-owned enterprises, patronize batchmate businesses, and promote your own services.
                        </p>
                    </div>

                    {!myBusiness && (
                        <Button
                            type="button"
                            onClick={() => setCreateOpen(true)}
                            className="h-9 self-start rounded-lg bg-[#1B84FF] px-4 text-[12.5px] font-semibold text-white hover:bg-[#006AE6] sm:self-auto"
                        >
                            <Plus className="mr-1.5 size-3.5" /> Submit My Business
                        </Button>
                    )}
                </div>

                {/* My Business Status Card */}
                {myBusiness && (
                    <div className="flex flex-col justify-between gap-3 rounded-xl border border-[#1B84FF]/20 bg-[#F8FBFF] p-5 shadow-[0_3px_4px_0_rgba(0,0,0,0.02)] sm:flex-row sm:items-center">
                        <div className="min-w-0 space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                                <Briefcase className="size-4 text-[#1B84FF]" />
                                <span className="text-[14.5px] font-semibold text-[#071437]">
                                    {myBusiness.name}
                                </span>
                                <span
                                    className={`inline-flex rounded-md px-2 py-0.5 text-[11px] font-semibold capitalize ${
                                        myBusiness.status === 'approved'
                                            ? 'bg-[#EAFFF1] text-[#17C653]'
                                            : 'bg-[#FFF8DD] text-[#B45309]'
                                    }`}
                                >
                                    {myBusiness.status}
                                </span>
                            </div>
                            <p className="line-clamp-1 text-[12.5px] text-[#78829D]">
                                {myBusiness.description}
                            </p>
                        </div>
                        <div className="shrink-0 text-[12px] font-medium text-[#78829D]">
                            {myBusiness.status === 'pending'
                                ? 'Awaiting administrative verification'
                                : 'Active in alumni directory'}
                        </div>
                    </div>
                )}

                {/* Business Directory Grid */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {businesses.data.length === 0 ? (
                        <div className="col-span-full flex flex-col items-center justify-center rounded-xl border border-[#F1F1F4] bg-[#FCFCFC] px-6 py-12 text-center">
                            <div className="mb-3 flex size-11 items-center justify-center rounded-full bg-[#F1F6FF] text-[#1B84FF]">
                                <Briefcase className="size-5" />
                            </div>
                            <p className="text-[13.5px] font-semibold text-[#071437]">No businesses listed yet</p>
                            <p className="mt-1 max-w-md text-[12.5px] text-[#78829D]">
                                No verified alumni businesses are in the directory yet. Be the first to list your enterprise.
                            </p>
                        </div>
                    ) : (
                        businesses.data.map((biz) => (
                            <div
                                key={biz.id}
                                className="flex flex-col justify-between rounded-xl border border-[#F1F1F4] bg-white p-5 shadow-[0_3px_4px_0_rgba(0,0,0,0.03)] transition-colors hover:border-[#DBDFE9]"
                            >
                                <div className="space-y-3">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="min-w-0 space-y-0.5">
                                            <div className="truncate text-[15px] font-semibold text-[#071437]">
                                                {biz.name}
                                            </div>
                                            <div className="truncate text-[12px] font-medium text-[#1B84FF]">
                                                {biz.industry?.name || 'Enterprise'}
                                            </div>
                                        </div>
                                        <span className="shrink-0 rounded-md bg-[#F1F6FF] px-2 py-0.5 text-[11px] font-semibold text-[#1B84FF]">
                                            {biz.category?.name || 'Business'}
                                        </span>
                                    </div>

                                    <p className="line-clamp-3 text-[12.5px] leading-relaxed text-[#78829D]">
                                        {biz.description}
                                    </p>

                                    <div className="space-y-1 border-t border-[#F1F1F4] pt-2.5 text-[12px] text-[#4B5675]">
                                        <div>
                                            Owner:{' '}
                                            <strong className="font-semibold text-[#071437]">
                                                {biz.owner?.user?.name}
                                            </strong>{' '}
                                            <span className="text-[#78829D]">
                                                ({biz.owner?.college?.short_name || biz.owner?.college?.name})
                                            </span>
                                        </div>
                                        {biz.city && (
                                            <div className="flex items-center gap-1.5 text-[#78829D]">
                                                <MapPin className="size-3.5 text-[#99A1B7]" />
                                                <span>
                                                    {biz.city}
                                                    {biz.country_code ? `, ${biz.country_code}` : ''}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-4 flex justify-end border-t border-[#F1F1F4] pt-3.5">
                                    {biz.website ? (
                                        <a
                                            href={biz.website}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-[#1B84FF] hover:text-[#006AE6]"
                                        >
                                            Visit Website <ExternalLink className="size-3.5" />
                                        </a>
                                    ) : (
                                        <span className="text-[12px] text-[#99A1B7]">Direct inquiries via profile</span>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Submit Business Dialog */}
            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                <DialogContent className="border-[#F1F1F4] !bg-white !text-[#071437] sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="text-[16px] font-semibold text-[#071437]">
                            List Your Business in Directory
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                        <div>
                            <label className="mb-1.5 block text-[12.5px] font-semibold text-[#071437]">
                                Company / Business Name <span className="text-[#F8285A]">*</span>
                            </label>
                            <Input required value={name} onChange={(e) => setName(e.target.value)} className={fieldClass} />
                        </div>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <div>
                                <label className="mb-1.5 block text-[12.5px] font-semibold text-[#071437]">
                                    Business Category <span className="text-[#F8285A]">*</span>
                                </label>
                                <select
                                    value={categoryId}
                                    onChange={(e) => setCategoryId(e.target.value)}
                                    className={fieldClass}
                                >
                                    {categories.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="mb-1.5 block text-[12.5px] font-semibold text-[#071437]">
                                    Industry Sector <span className="text-[#F8285A]">*</span>
                                </label>
                                <select
                                    value={industryId}
                                    onChange={(e) => setIndustryId(e.target.value)}
                                    className={fieldClass}
                                >
                                    {industries.map((i) => (
                                        <option key={i.id} value={i.id}>
                                            {i.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <div>
                                <label className="mb-1.5 block text-[12.5px] font-semibold text-[#071437]">
                                    Official Website
                                    <span className="ml-1.5 font-normal text-[#99A1B7]">(Optional)</span>
                                </label>
                                <Input placeholder="https://..." value={website} onChange={(e) => setWebsite(e.target.value)} className={fieldClass} />
                            </div>
                            <div>
                                <label className="mb-1.5 block text-[12.5px] font-semibold text-[#071437]">
                                    City of Operation
                                    <span className="ml-1.5 font-normal text-[#99A1B7]">(Optional)</span>
                                </label>
                                <Input placeholder="Dhaka, London..." value={city} onChange={(e) => setCity(e.target.value)} className={fieldClass} />
                            </div>
                        </div>
                        <div>
                            <label className="mb-1.5 block text-[12.5px] font-semibold text-[#071437]">
                                Business Description &amp; Services <span className="text-[#F8285A]">*</span>
                            </label>
                            <textarea
                                required
                                rows={3}
                                className={`${fieldClass} h-auto py-2.5`}
                                placeholder="Describe your products, consulting services, or enterprise solutions..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                        <DialogFooter className="pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setCreateOpen(false)}
                                className="h-9 rounded-lg border-[#DBDFE9] !bg-white px-4 text-[12.5px] font-semibold text-[#4B5675] hover:!bg-[#F9F9F9]"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="h-9 rounded-lg bg-[#1B84FF] px-4 text-[12.5px] font-semibold text-white hover:bg-[#006AE6]"
                            >
                                Submit for Approval
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </MemberLayout>
    );
}
