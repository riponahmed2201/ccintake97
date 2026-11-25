import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, ArrowRight } from 'lucide-react';
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

const ALL = '__all__';

const fieldClass =
    'h-10 w-full rounded-md border !border-[#DBDFE9] !bg-[#FCFCFC] px-3 text-[13px] font-normal !text-[#071437] !shadow-none outline-none transition-all duration-200 placeholder:!text-[#99A1B7] hover:!border-[#C4CADA] focus:!border-[#1B84FF] focus:!bg-white focus:!ring-[3px] focus:!ring-[#1B84FF]/10 dark:!bg-[#FCFCFC] dark:!text-[#071437]';

const selectTriggerClass =
    '!h-10 w-full cursor-pointer rounded-md !border-[#DBDFE9] !bg-[#FCFCFC] px-3 text-[13px] font-normal !text-[#071437] !shadow-none transition-all duration-200 hover:!border-[#C4CADA] hover:!bg-[#FCFCFC] focus-visible:!border-[#1B84FF] focus-visible:!bg-white focus-visible:!ring-[3px] focus-visible:!ring-[#1B84FF]/10 dark:!bg-[#FCFCFC] dark:hover:!bg-[#FCFCFC]';

const selectMenuClass =
    'z-[60] rounded-xl !border-[#F1F1F4] !bg-white p-1 !text-[#071437] shadow-[0_12px_32px_-8px_rgba(7,20,55,0.16)] dark:!bg-white dark:!text-[#071437]';

const selectItemClass =
    'cursor-pointer rounded-lg py-2 pr-8 pl-2.5 text-[13px] text-[#071437] focus:!bg-[#F1F6FF] focus:!text-[#1B84FF] dark:text-[#071437]';

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
            title="Membership Applications"
            breadcrumbs={[{ title: 'Applications' }]}
        >
            <Head title="Membership Applications Queue - INTAKE 97 Admin" />

            <div className="w-full space-y-6">
                <div>
                    <h1 className="text-[22px] font-semibold tracking-tight text-[#071437]">
                        Membership Application Review Queue
                    </h1>
                    <p className="mt-1 text-[13px] text-[#78829D]">
                        Review declared Cadet College intake credentials and manage verification decision workflows.
                    </p>
                </div>

                {/* Filters */}
                <div className="rounded-xl border border-[#F1F1F4] bg-white p-4 shadow-[0_3px_4px_0_rgba(0,0,0,0.03)]">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <div className="relative">
                            <Search className="absolute top-3 left-3 size-4 text-[#99A1B7]" />
                            <Input
                                placeholder="Search by name, email or application #..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && applyFilter('search', search)}
                                className={`${fieldClass} pl-9`}
                            />
                        </div>

                        <Select
                            value={selectedStatus || ALL}
                            onValueChange={(val) => {
                                const next = val === ALL ? '' : val;
                                setSelectedStatus(next);
                                applyFilter('status', next);
                            }}
                        >
                            <SelectTrigger className={selectTriggerClass}>
                                <SelectValue placeholder="All Application Statuses" />
                            </SelectTrigger>
                            <SelectContent className={selectMenuClass}>
                                <SelectItem value={ALL} className={selectItemClass}>All Application Statuses</SelectItem>
                                <SelectItem value="submitted" className={selectItemClass}>Submitted (New)</SelectItem>
                                <SelectItem value="under_review" className={selectItemClass}>Under Review</SelectItem>
                                <SelectItem value="info_required" className={selectItemClass}>Info Required</SelectItem>
                                <SelectItem value="approved" className={selectItemClass}>Approved</SelectItem>
                                <SelectItem value="rejected" className={selectItemClass}>Rejected</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select
                            value={selectedCollege || ALL}
                            onValueChange={(val) => {
                                const next = val === ALL ? '' : val;
                                setSelectedCollege(next);
                                applyFilter('college_id', next);
                            }}
                        >
                            <SelectTrigger className={selectTriggerClass}>
                                <SelectValue placeholder="All Cadet Colleges" />
                            </SelectTrigger>
                            <SelectContent className={selectMenuClass}>
                                <SelectItem value={ALL} className={selectItemClass}>All Cadet Colleges</SelectItem>
                                {colleges.map((c) => (
                                    <SelectItem key={c.id} value={String(c.id)} className={selectItemClass}>
                                        {c.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Queue Table */}
                <div className="overflow-hidden rounded-xl border border-[#F1F1F4] bg-white shadow-[0_3px_4px_0_rgba(0,0,0,0.03)]">
                    <Table>
                        <TableHeader className="bg-[#FCFCFC]">
                            <TableRow className="border-[#F1F1F4] hover:bg-transparent">
                                <TableHead className="px-5 py-3.5 text-[11.5px] font-semibold tracking-wide text-[#78829D] uppercase">Application #</TableHead>
                                <TableHead className="px-5 py-3.5 text-[11.5px] font-semibold tracking-wide text-[#78829D] uppercase">Applicant</TableHead>
                                <TableHead className="px-5 py-3.5 text-[11.5px] font-semibold tracking-wide text-[#78829D] uppercase">Declared College &amp; Roll</TableHead>
                                <TableHead className="px-5 py-3.5 text-[11.5px] font-semibold tracking-wide text-[#78829D] uppercase">Status</TableHead>
                                <TableHead className="px-5 py-3.5 text-[11.5px] font-semibold tracking-wide text-[#78829D] uppercase">Submitted</TableHead>
                                <TableHead className="px-5 py-3.5 text-right text-[11.5px] font-semibold tracking-wide text-[#78829D] uppercase">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {applications.data.length === 0 ? (
                                <TableRow className="hover:bg-transparent">
                                    <TableCell colSpan={6} className="h-28 text-center text-[13px] text-[#99A1B7]">
                                        No applications match your query.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                applications.data.map((app) => (
                                    <TableRow key={app.id} className="border-[#F1F1F4] hover:bg-[#FCFCFC]">
                                        <TableCell className="px-5 py-3.5 font-mono text-[12.5px] font-semibold text-[#071437]">
                                            {app.application_no}
                                        </TableCell>
                                        <TableCell className="px-5 py-3.5">
                                            <div className="text-[13px] font-semibold text-[#071437]">
                                                {app.member?.user?.name}
                                            </div>
                                            <div className="text-[11.5px] text-[#78829D]">
                                                {app.member?.user?.email}
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-5 py-3.5">
                                            <div className="text-[12.5px] font-medium text-[#071437]">
                                                {app.declared_college?.name}
                                            </div>
                                            <div className="text-[11px] text-[#99A1B7]">
                                                Roll #{app.declared_roll_no} (Intake 1997)
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-5 py-3.5">
                                            <span
                                                className={`inline-flex rounded-md px-2 py-0.5 text-[11px] font-semibold capitalize ${
                                                    app.status === 'approved'
                                                        ? 'bg-[#EAFFF1] text-[#17C653]'
                                                        : app.status === 'submitted'
                                                          ? 'bg-[#FFF8DD] text-[#B45309]'
                                                          : app.status === 'under_review'
                                                            ? 'bg-[#F1F6FF] text-[#1B84FF]'
                                                            : 'bg-[#FFEEF3] text-[#F8285A]'
                                                }`}
                                            >
                                                {app.status.replace('_', ' ')}
                                            </span>
                                        </TableCell>
                                        <TableCell className="px-5 py-3.5 text-[12.5px] text-[#78829D]">
                                            {new Date(app.submitted_at).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric',
                                            })}
                                        </TableCell>
                                        <TableCell className="px-5 py-3.5 text-right">
                                            <Link
                                                href={`/admin/applications/${app.id}`}
                                                className="inline-flex items-center gap-1 rounded-lg border border-[#DBDFE9] bg-white px-3 py-1.5 text-[12px] font-semibold text-[#4B5675] transition-colors hover:bg-[#F1F6FF] hover:text-[#1B84FF]"
                                            >
                                                Inspect <ArrowRight className="size-3.5" />
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </AdminLayout>
    );
}
