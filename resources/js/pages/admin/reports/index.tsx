import React from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Download, GraduationCap, Users } from 'lucide-react';
import type { College, Event } from '@/types';

interface ReportsIndexProps {
    collegeBreakdown: (College & { members_count: number })[];
    statusBreakdown: Record<string, number>;
    verificationBreakdown: Record<string, number>;
    eventsBreakdown: (Event & { registrations_count: number })[];
}

export default function ReportsIndex({
    collegeBreakdown,
    statusBreakdown,
    verificationBreakdown,
}: ReportsIndexProps) {
    return (
        <AdminLayout
            title="Reports & Analytics"
            breadcrumbs={[{ title: 'Reports' }]}
        >
            <Head title="Reports & Analytics - INTAKE 97 Admin" />

            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-[20px] font-bold tracking-tight text-[#071437]">
                            Association Reports & Analytic Summaries
                        </h1>
                        <p className="mt-1 text-[13px] text-[#78829D]">
                            Exportable breakdowns based on actual database records.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                        <a
                            href="/admin/reports/download/colleges"
                            className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#DBDFE9] bg-white px-4 text-[13px] font-semibold text-[#071437] transition-colors hover:border-[#1B84FF] hover:bg-[#F1F6FF] hover:text-[#1B84FF]"
                        >
                            <Download className="size-4" /> Export College Report (CSV)
                        </a>
                        <a
                            href="/admin/members/export"
                            className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#1B84FF] px-4 text-[13px] font-semibold text-white shadow-xs transition-colors hover:bg-[#1B84FF]/90"
                        >
                            <Download className="size-4" /> Full Member Roll (CSV)
                        </a>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="overflow-hidden rounded-xl border border-[#F1F1F4] bg-white shadow-[0_3px_4px_0_rgba(0,0,0,0.03)]">
                        <div className="flex items-center gap-2.5 border-b border-[#F1F1F4] px-6 py-4">
                            <span className="flex size-8 items-center justify-center rounded-lg bg-[#F1F6FF] text-[#1B84FF]">
                                <Users className="size-4" />
                            </span>
                            <h2 className="text-[15px] font-bold text-[#071437]">
                                Membership Lifecycle Breakdown
                            </h2>
                        </div>
                        <div className="divide-y divide-[#F1F1F4] px-6 py-2">
                            {Object.entries(statusBreakdown).map(([status, count]) => (
                                <div key={status} className="flex items-center justify-between py-3 text-[13px]">
                                    <span className="font-medium text-[#4B5675] capitalize">
                                        {status.replace('_', ' ')}
                                    </span>
                                    <span className="font-bold text-[#071437]">{count} alumni</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-xl border border-[#F1F1F4] bg-white shadow-[0_3px_4px_0_rgba(0,0,0,0.03)]">
                        <div className="flex items-center gap-2.5 border-b border-[#F1F1F4] px-6 py-4">
                            <span className="flex size-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                                <GraduationCap className="size-4" />
                            </span>
                            <h2 className="text-[15px] font-bold text-[#071437]">
                                Verification Audit Breakdown
                            </h2>
                        </div>
                        <div className="divide-y divide-[#F1F1F4] px-6 py-2">
                            {Object.entries(verificationBreakdown).map(([vStatus, count]) => (
                                <div key={vStatus} className="flex items-center justify-between py-3 text-[13px]">
                                    <span className="font-medium text-[#4B5675] capitalize">{vStatus}</span>
                                    <span className="font-bold text-[#071437]">{count} alumni</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="overflow-hidden rounded-xl border border-[#F1F1F4] bg-white shadow-[0_3px_4px_0_rgba(0,0,0,0.03)]">
                    <div className="border-b border-[#F1F1F4] px-6 py-4">
                        <h2 className="text-[15px] font-bold text-[#071437]">
                            Cadet College Representation Roster
                        </h2>
                    </div>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-[#FCFCFC]">
                                <TableRow className="border-[#F1F1F4] hover:bg-transparent">
                                    <TableHead className="px-5 py-3.5 text-[11.5px] font-semibold tracking-wide text-[#78829D] uppercase">
                                        Cadet College
                                    </TableHead>
                                    <TableHead className="px-4 py-3.5 text-[11.5px] font-semibold tracking-wide text-[#78829D] uppercase">
                                        Short Code
                                    </TableHead>
                                    <TableHead className="px-4 py-3.5 text-[11.5px] font-semibold tracking-wide text-[#78829D] uppercase">
                                        Established
                                    </TableHead>
                                    <TableHead className="px-4 py-3.5 text-[11.5px] font-semibold tracking-wide text-[#78829D] uppercase">
                                        Location
                                    </TableHead>
                                    <TableHead className="px-5 py-3.5 text-right text-[11.5px] font-semibold tracking-wide text-[#78829D] uppercase">
                                        Registered 1997 Alumni
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {collegeBreakdown.map((c) => (
                                    <TableRow
                                        key={c.id}
                                        className="border-[#F1F1F4] transition-colors hover:bg-[#FCFCFC]"
                                    >
                                        <TableCell className="px-5 py-3.5 text-[13px] font-semibold text-[#071437]">
                                            {c.name}
                                        </TableCell>
                                        <TableCell className="px-4 py-3.5 font-mono text-[12.5px] text-[#78829D]">
                                            {c.short_name || '—'}
                                        </TableCell>
                                        <TableCell className="px-4 py-3.5 text-[13px] text-[#4B5675]">
                                            {c.established_year || '—'}
                                        </TableCell>
                                        <TableCell className="px-4 py-3.5 text-[13px] text-[#4B5675]">
                                            {c.location || '—'}
                                        </TableCell>
                                        <TableCell className="px-5 py-3.5 text-right text-[13px] font-bold text-emerald-600">
                                            {c.members_count}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
