import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, FileCheck2, ArrowRight } from 'lucide-react';
import type { MembershipApplication, College } from '@/types';

interface ApplicationsIndexProps {
    applications: {
        data: MembershipApplication[];
        current_page: number;
        last_page: number;
        total: number;
        links: any[];
    };
    colleges: College[];
    filters: {
        search?: string;
        status?: string;
        college_id?: string;
    };
}

export default function ApplicationsIndex({
    applications,
    colleges,
    filters,
}: ApplicationsIndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || '');
    const [selectedCollege, setSelectedCollege] = useState(filters.college_id || '');

    const applyFilter = (key: string, val: string) => {
        const query = {
            search,
            status: selectedStatus,
            college_id: selectedCollege,
            [key]: val,
        };
        router.get('/admin/applications', query, { preserveState: true, replace: true });
    };

    return (
        <AdminLayout
            title="Membership Applications Queue"
            breadcrumbs={[{ title: 'Applications' }]}
        >
            <Head title="Membership Applications Queue - INTAKE 97 Admin" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                        Membership Application Review Queue
                    </h1>
                    <p className="text-xs text-slate-500 mt-1">
                        Review declared Cadet College intake credentials and manage verification decision workflows.
                    </p>
                </div>

                {/* Filters */}
                <Card className="p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 size-4 text-slate-400" />
                            <Input
                                placeholder="Search by name, email or application #..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && applyFilter('search', search)}
                                className="pl-9 text-xs"
                            />
                        </div>

                        <select
                            value={selectedStatus}
                            onChange={(e) => {
                                setSelectedStatus(e.target.value);
                                applyFilter('status', e.target.value);
                            }}
                            className="text-xs rounded-md border p-2 bg-white dark:bg-slate-900"
                        >
                            <option value="">All Application Statuses</option>
                            <option value="submitted">Submitted (New)</option>
                            <option value="under_review">Under Review</option>
                            <option value="info_required">Info Required</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                        </select>

                        <select
                            value={selectedCollege}
                            onChange={(e) => {
                                setSelectedCollege(e.target.value);
                                applyFilter('college_id', e.target.value);
                            }}
                            className="text-xs rounded-md border p-2 bg-white dark:bg-slate-900"
                        >
                            <option value="">All Cadet Colleges</option>
                            {colleges.map((c) => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                </Card>

                {/* Queue Table */}
                <Card className="overflow-hidden">
                    <Table>
                        <TableHeader className="bg-slate-50 dark:bg-slate-900/60">
                            <TableRow>
                                <TableHead className="text-xs font-semibold">Application #</TableHead>
                                <TableHead className="text-xs font-semibold">Applicant</TableHead>
                                <TableHead className="text-xs font-semibold">Declared College & Roll</TableHead>
                                <TableHead className="text-xs font-semibold">Status</TableHead>
                                <TableHead className="text-xs font-semibold">Submission Date</TableHead>
                                <TableHead className="text-xs font-semibold text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {applications.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-28 text-center text-xs text-slate-500">
                                        No applications match your query.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                applications.data.map((app) => (
                                    <TableRow key={app.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                                        <TableCell className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                                            {app.application_no}
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-semibold text-xs text-slate-900 dark:text-white">
                                                {app.member?.user?.name}
                                            </div>
                                            <div className="text-[11px] text-slate-500">
                                                {app.member?.user?.email}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium text-xs text-slate-800 dark:text-slate-200">
                                                {app.declared_college?.name}
                                            </div>
                                            <div className="text-[10px] text-slate-400">
                                                Roll #{app.declared_roll_no} (Intake 1997)
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                className={`text-[10px] capitalize ${
                                                    app.status === 'approved'
                                                        ? 'bg-emerald-100 text-emerald-800'
                                                        : app.status === 'submitted'
                                                        ? 'bg-amber-100 text-amber-800'
                                                        : app.status === 'under_review'
                                                        ? 'bg-blue-100 text-blue-800'
                                                        : 'bg-rose-100 text-rose-800'
                                                }`}
                                            >
                                                {app.status.replace('_', ' ')}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-xs text-slate-500">
                                            {new Date(app.submitted_at).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Link
                                                href={`/admin/applications/${app.id}`}
                                                className="inline-flex items-center gap-1 px-3 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-semibold text-slate-800 dark:text-slate-200"
                                            >
                                                Inspect <ArrowRight className="size-3" />
                                            </Link>
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
