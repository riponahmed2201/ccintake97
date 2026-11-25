import React from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Briefcase, CheckCircle2, ExternalLink, Star, XCircle } from 'lucide-react';
import type { Business } from '@/types';

interface BusinessesIndexProps {
    businesses: {
        data: Business[];
        current_page: number;
        last_page: number;
        total: number;
    };
    filters: {
        status?: string;
    };
}

const statusPill = (status: string) => {
    if (status === 'approved') return 'border border-emerald-200 bg-emerald-50 text-emerald-700';
    if (status === 'pending') return 'border border-amber-200 bg-amber-50 text-amber-700';
    return 'border border-rose-200 bg-rose-50 text-rose-700';
};

export default function BusinessesIndex({ businesses }: BusinessesIndexProps) {
    const handleVerify = (id: number) => {
        router.post(`/admin/businesses/${id}/verify`);
    };

    const handleReject = (id: number) => {
        router.post(`/admin/businesses/${id}/reject`);
    };

    const handleToggleFeatured = (id: number) => {
        router.post(`/admin/businesses/${id}/feature`);
    };

    return (
        <AdminLayout
            title="Business Directory Management"
            breadcrumbs={[{ title: 'Business Directory' }]}
        >
            <Head title="Business Directory - INTAKE 97 Admin" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-[20px] font-bold tracking-tight text-[#071437]">
                        Alumni Commercial Business Directory
                    </h1>
                    <p className="mt-1 text-[13px] text-[#78829D]">
                        Review and verify member business listings to foster mutual commercial engagement.
                    </p>
                </div>

                <div className="overflow-hidden rounded-xl border border-[#F1F1F4] bg-white shadow-[0_3px_4px_0_rgba(0,0,0,0.03)]">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-[#FCFCFC]">
                                <TableRow className="border-[#F1F1F4] hover:bg-transparent">
                                    <TableHead className="px-5 py-3.5 text-[11.5px] font-semibold tracking-wide text-[#78829D] uppercase">
                                        Business Name
                                    </TableHead>
                                    <TableHead className="px-4 py-3.5 text-[11.5px] font-semibold tracking-wide text-[#78829D] uppercase">
                                        Alumni Owner
                                    </TableHead>
                                    <TableHead className="px-4 py-3.5 text-[11.5px] font-semibold tracking-wide text-[#78829D] uppercase">
                                        Industry & Category
                                    </TableHead>
                                    <TableHead className="px-4 py-3.5 text-[11.5px] font-semibold tracking-wide text-[#78829D] uppercase">
                                        Location
                                    </TableHead>
                                    <TableHead className="px-4 py-3.5 text-[11.5px] font-semibold tracking-wide text-[#78829D] uppercase">
                                        Status
                                    </TableHead>
                                    <TableHead className="px-4 py-3.5 text-[11.5px] font-semibold tracking-wide text-[#78829D] uppercase">
                                        Featured
                                    </TableHead>
                                    <TableHead className="px-5 py-3.5 text-right text-[11.5px] font-semibold tracking-wide text-[#78829D] uppercase">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {businesses.data.length === 0 ? (
                                    <TableRow className="border-[#F1F1F4] hover:bg-transparent">
                                        <TableCell colSpan={7} className="h-32 text-center text-[13px] text-[#78829D]">
                                            No businesses found in directory.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    businesses.data.map((b) => (
                                        <TableRow
                                            key={b.id}
                                            className="border-[#F1F1F4] transition-colors hover:bg-[#FCFCFC]"
                                        >
                                            <TableCell className="px-5 py-3.5">
                                                <div className="flex items-start gap-2.5">
                                                    <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#F1F6FF] text-[#1B84FF]">
                                                        <Briefcase className="size-4" />
                                                    </div>
                                                    <div>
                                                        <div className="text-[13px] font-semibold text-[#071437]">
                                                            {b.name}
                                                        </div>
                                                        {b.website && (
                                                            <a
                                                                href={b.website}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="mt-0.5 inline-flex items-center gap-1 text-[11.5px] text-[#1B84FF] hover:underline"
                                                            >
                                                                {b.website.replace('https://', '')}{' '}
                                                                <ExternalLink className="size-3" />
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-4 py-3.5">
                                                <div className="text-[13px] font-medium text-[#071437]">
                                                    {b.owner?.user?.name}
                                                </div>
                                                <div className="text-[11px] text-[#78829D]">
                                                    {b.owner?.college?.short_name || b.owner?.college?.name}
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-4 py-3.5 text-[13px] text-[#4B5675]">
                                                <div>{b.industry?.name}</div>
                                                <div className="text-[11px] text-[#99A1B7]">{b.category?.name}</div>
                                            </TableCell>
                                            <TableCell className="px-4 py-3.5 text-[13px] text-[#4B5675]">
                                                {b.city ? `${b.city}, ${b.country_code}` : b.country_code}
                                            </TableCell>
                                            <TableCell className="px-4 py-3.5">
                                                <span
                                                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize ${statusPill(b.status)}`}
                                                >
                                                    {b.status}
                                                </span>
                                            </TableCell>
                                            <TableCell className="px-4 py-3.5">
                                                <button
                                                    type="button"
                                                    onClick={() => handleToggleFeatured(b.id)}
                                                    className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[12px] font-semibold transition-colors ${
                                                        b.is_featured
                                                            ? 'bg-amber-50 text-amber-600'
                                                            : 'text-[#99A1B7] hover:bg-[#FCFCFC] hover:text-amber-500'
                                                    }`}
                                                >
                                                    <Star className="size-3.5 fill-current" />
                                                    {b.is_featured ? 'Featured' : 'Standard'}
                                                </button>
                                            </TableCell>
                                            <TableCell className="px-5 py-3.5 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    {b.status !== 'approved' && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleVerify(b.id)}
                                                            className="inline-flex size-8 items-center justify-center rounded-lg text-emerald-600 transition-colors hover:bg-emerald-50"
                                                            title="Approve Business"
                                                        >
                                                            <CheckCircle2 className="size-4" />
                                                        </button>
                                                    )}
                                                    {b.status !== 'rejected' && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleReject(b.id)}
                                                            className="inline-flex size-8 items-center justify-center rounded-lg text-rose-500 transition-colors hover:bg-rose-50"
                                                            title="Reject Business"
                                                        >
                                                            <XCircle className="size-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
