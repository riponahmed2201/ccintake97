import React from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { BarChart3, Download, GraduationCap, Users } from 'lucide-react';
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
    eventsBreakdown,
}: ReportsIndexProps) {
    return (
        <AdminLayout
            title="Reports & Analytics"
            breadcrumbs={[{ title: 'Reports' }]}
        >
            <Head title="Reports & Analytics - INTAKE 97 Admin" />

            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                            Association Reports & Analytic Summaries
                        </h1>
                        <p className="text-xs text-slate-500 mt-1">
                            Exportable breakdowns based on actual MySQL records. Never fabricated.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <a
                            href="/admin/reports/download/colleges"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold hover:bg-slate-50 transition-colors"
                        >
                            <Download className="size-3.5" /> Export College Report (CSV)
                        </a>
                        <a
                            href="/admin/members/export"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors"
                        >
                            <Download className="size-3.5" /> Full Member Roll (CSV)
                        </a>
                    </div>
                </div>

                {/* Status & Verification Breakdown Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                <Users className="size-4 text-blue-600" />
                                Membership Lifecycle Breakdown
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-xs">
                            {Object.entries(statusBreakdown).map(([status, count]) => (
                                <div key={status} className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                                    <span className="capitalize text-slate-600 dark:text-slate-400">{status.replace('_', ' ')}</span>
                                    <span className="font-bold text-slate-900 dark:text-white">{count} alumni</span>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                <GraduationCap className="size-4 text-emerald-600" />
                                Verification Audit Breakdown
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-xs">
                            {Object.entries(verificationBreakdown).map(([vStatus, count]) => (
                                <div key={vStatus} className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                                    <span className="capitalize text-slate-600 dark:text-slate-400">{vStatus}</span>
                                    <span className="font-bold text-slate-900 dark:text-white">{count} alumni</span>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* College-wise Roster Breakdown Table */}
                <Card className="overflow-hidden">
                    <CardHeader className="p-4 border-b">
                        <CardTitle className="text-sm font-bold text-slate-900 dark:text-white">
                            Cadet College Representation Roster
                        </CardTitle>
                    </CardHeader>
                    <Table>
                        <TableHeader className="bg-slate-50 dark:bg-slate-900/60">
                            <TableRow>
                                <TableHead className="text-xs font-semibold">Cadet College</TableHead>
                                <TableHead className="text-xs font-semibold">Short Code</TableHead>
                                <TableHead className="text-xs font-semibold">Established</TableHead>
                                <TableHead className="text-xs font-semibold">Location</TableHead>
                                <TableHead className="text-xs font-semibold text-right">Registered 1997 Alumni</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {collegeBreakdown.map((c) => (
                                <TableRow key={c.id}>
                                    <TableCell className="font-semibold text-xs text-slate-900 dark:text-white">
                                        {c.name}
                                    </TableCell>
                                    <TableCell className="font-mono text-xs text-slate-500">
                                        {c.short_name || '—'}
                                    </TableCell>
                                    <TableCell className="text-xs text-slate-500">
                                        {c.established_year || '—'}
                                    </TableCell>
                                    <TableCell className="text-xs text-slate-500">
                                        {c.location || '—'}
                                    </TableCell>
                                    <TableCell className="text-right font-bold text-xs text-emerald-600">
                                        {c.members_count}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            </div>
        </AdminLayout>
    );
}
