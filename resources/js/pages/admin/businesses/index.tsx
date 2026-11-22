import React from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Briefcase, CheckCircle2, XCircle, Star, ExternalLink } from 'lucide-react';
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

export default function BusinessesIndex({ businesses, filters }: BusinessesIndexProps) {
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
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                            Alumni Commercial Business Directory
                        </h1>
                        <p className="text-xs text-slate-500 mt-1">
                            Review and verify member business listings to foster mutual commercial engagement.
                        </p>
                    </div>
                </div>

                <Card className="overflow-hidden">
                    <Table>
                        <TableHeader className="bg-slate-50 dark:bg-slate-900/60">
                            <TableRow>
                                <TableHead className="text-xs font-semibold">Business Name</TableHead>
                                <TableHead className="text-xs font-semibold">Alumni Owner</TableHead>
                                <TableHead className="text-xs font-semibold">Industry & Category</TableHead>
                                <TableHead className="text-xs font-semibold">Location</TableHead>
                                <TableHead className="text-xs font-semibold">Status</TableHead>
                                <TableHead className="text-xs font-semibold">Featured</TableHead>
                                <TableHead className="text-xs font-semibold text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {businesses.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-28 text-center text-xs text-slate-500">
                                        No businesses found in directory.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                businesses.data.map((b) => (
                                    <TableRow key={b.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                                        <TableCell>
                                            <div className="font-semibold text-xs text-slate-900 dark:text-white flex items-center gap-2">
                                                <Briefcase className="size-4 text-indigo-600" />
                                                {b.name}
                                            </div>
                                            {b.website && (
                                                <a
                                                    href={b.website}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-[11px] text-slate-400 hover:text-indigo-600 flex items-center gap-1 mt-0.5"
                                                >
                                                    {b.website.replace('https://', '')} <ExternalLink className="size-2.5" />
                                                </a>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium text-xs text-slate-800 dark:text-slate-200">
                                                {b.owner?.user?.name}
                                            </div>
                                            <div className="text-[10px] text-slate-400">
                                                {b.owner?.college?.short_name || b.owner?.college?.name}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-xs text-slate-600 dark:text-slate-300">
                                            <div>{b.industry?.name}</div>
                                            <div className="text-[10px] text-slate-400">{b.category?.name}</div>
                                        </TableCell>
                                        <TableCell className="text-xs text-slate-600 dark:text-slate-300">
                                            {b.city ? `${b.city}, ${b.country_code}` : b.country_code}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                className={`text-[10px] capitalize ${
                                                    b.status === 'approved'
                                                        ? 'bg-emerald-100 text-emerald-800'
                                                        : b.status === 'pending'
                                                        ? 'bg-amber-100 text-amber-800'
                                                        : 'bg-rose-100 text-rose-800'
                                                }`}
                                            >
                                                {b.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <button
                                                onClick={() => handleToggleFeatured(b.id)}
                                                className={`p-1 rounded text-xs flex items-center gap-1 ${
                                                    b.is_featured
                                                        ? 'text-amber-500 font-bold'
                                                        : 'text-slate-400 hover:text-amber-500'
                                                }`}
                                            >
                                                <Star className="size-3.5 fill-current" />
                                                {b.is_featured ? 'Featured' : 'Standard'}
                                            </button>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                {b.status !== 'approved' && (
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => handleVerify(b.id)}
                                                        className="text-xs text-emerald-600"
                                                        title="Approve Business"
                                                    >
                                                        <CheckCircle2 className="size-4" />
                                                    </Button>
                                                )}
                                                {b.status !== 'rejected' && (
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => handleReject(b.id)}
                                                        className="text-xs text-rose-500"
                                                        title="Reject Business"
                                                    >
                                                        <XCircle className="size-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </Card>
            </div>
        </AdminLayout>
    );
}
