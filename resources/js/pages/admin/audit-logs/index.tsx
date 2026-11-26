import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Search } from 'lucide-react';
import type { AuditLogItem } from '@/types';

interface AuditLogsIndexProps {
    logs: {
        data: AuditLogItem[];
        current_page: number;
        last_page: number;
        per_page?: number;
        from?: number;
        to?: number;
        total: number;
        links: any[];
    };
    modules?: string[];
    filters: {
        module?: string;
        action?: string;
        per_page?: string;
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

export default function AuditLogsIndex({ logs, modules = [], filters }: AuditLogsIndexProps) {
    const [actionQuery, setActionQuery] = useState(filters?.action || '');
    const [selectedModule, setSelectedModule] = useState(filters?.module || '');
    const [perPage, setPerPage] = useState(filters?.per_page || String(logs.per_page || 20));

    const applyFilter = (key: string, val: string) => {
        const query = {
            action: actionQuery,
            module: selectedModule,
            per_page: perPage,
            [key]: val,
        };
        router.get('/admin/audit-logs', query, { preserveState: true, replace: true });
    };
    return (
        <AdminLayout
            title="System Audit Logs & Security Activity"
            breadcrumbs={[{ title: 'Audit Logs' }]}
        >
            <Head title="Audit Logs - CCINTAKE 97 Admin" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-[20px] font-bold tracking-tight text-[#071437]">
                        System Audit Logs & Administrative History
                    </h1>
                    <p className="mt-1 text-[13px] text-[#78829D]">
                        Tamper-resistant audit record of membership approvals, suspensions, verifications, and permission modifications.
                    </p>
                </div>

                {/* Filter Toolbar */}
                <div className="rounded-xl border border-[#F1F1F4] bg-white p-4 shadow-[0_3px_4px_0_rgba(0,0,0,0.03)]">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                applyFilter('action', actionQuery);
                            }}
                            className="relative sm:col-span-2"
                        >
                            <Search className="absolute top-3 left-3 size-4 text-[#99A1B7]" />
                            <Input
                                placeholder="Search by action or admin name..."
                                value={actionQuery}
                                onChange={(e) => setActionQuery(e.target.value)}
                                className={`${fieldClass} pl-9`}
                            />
                        </form>
                        <Select
                            value={selectedModule || ALL}
                            onValueChange={(val) => {
                                const next = val === ALL ? '' : val;
                                setSelectedModule(next);
                                applyFilter('module', next);
                            }}
                        >
                            <SelectTrigger className={selectTriggerClass}>
                                <SelectValue placeholder="All Modules" />
                            </SelectTrigger>
                            <SelectContent className={selectMenuClass}>
                                <SelectItem value={ALL} className={selectItemClass}>All Modules</SelectItem>
                                {modules.map((mod) => (
                                    <SelectItem key={mod} value={mod} className={`${selectItemClass} capitalize`}>
                                        {mod}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="overflow-hidden rounded-xl border border-[#F1F1F4] bg-white shadow-[0_3px_4px_0_rgba(0,0,0,0.03)]">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-[#FCFCFC]">
                                <TableRow className="border-[#F1F1F4] hover:bg-transparent">
                                    <TableHead className="w-14 px-5 py-3.5 text-[11.5px] font-semibold tracking-wide text-[#78829D] uppercase">
                                        SL
                                    </TableHead>
                                    <TableHead className="px-5 py-3.5 text-[11.5px] font-semibold tracking-wide text-[#78829D] uppercase">
                                        Timestamp
                                    </TableHead>
                                    <TableHead className="px-4 py-3.5 text-[11.5px] font-semibold tracking-wide text-[#78829D] uppercase">
                                        Action
                                    </TableHead>
                                    <TableHead className="px-4 py-3.5 text-[11.5px] font-semibold tracking-wide text-[#78829D] uppercase">
                                        Module
                                    </TableHead>
                                    <TableHead className="px-4 py-3.5 text-[11.5px] font-semibold tracking-wide text-[#78829D] uppercase">
                                        Actor / Admin
                                    </TableHead>
                                    <TableHead className="px-4 py-3.5 text-[11.5px] font-semibold tracking-wide text-[#78829D] uppercase">
                                        Record ID
                                    </TableHead>
                                    <TableHead className="px-5 py-3.5 text-[11.5px] font-semibold tracking-wide text-[#78829D] uppercase">
                                        IP Address
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {logs.data.length === 0 ? (
                                    <TableRow className="border-[#F1F1F4] hover:bg-transparent">
                                        <TableCell colSpan={7} className="h-32 text-center text-[13px] text-[#78829D]">
                                            No audit entries recorded.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    logs.data.map((log, idx) => (
                                        <TableRow
                                            key={log.id}
                                            className="border-[#F1F1F4] transition-colors hover:bg-[#FCFCFC]"
                                        >
                                            <TableCell className="px-5 py-3.5 text-[12.5px] font-medium text-[#78829D] tabular-nums">
                                                {(logs.from || 1) + idx}
                                            </TableCell>
                                            <TableCell className="px-5 py-3.5 font-mono text-[12px] text-[#78829D]">
                                                {new Date(log.created_at).toLocaleString()}
                                            </TableCell>
                                            <TableCell className="px-4 py-3.5">
                                                <span className="inline-flex items-center rounded-md border border-[#DCEBFF] bg-[#F1F6FF] px-2 py-0.5 font-mono text-[11px] font-semibold text-[#1B84FF]">
                                                    {log.action}
                                                </span>
                                            </TableCell>
                                            <TableCell className="px-4 py-3.5 text-[13px] font-medium text-[#4B5675] capitalize">
                                                {log.module}
                                            </TableCell>
                                            <TableCell className="px-4 py-3.5 text-[13px] font-semibold text-[#071437]">
                                                {log.user?.name || 'System Auto'}
                                            </TableCell>
                                            <TableCell className="px-4 py-3.5 font-mono text-[12.5px] text-[#78829D]">
                                                {log.record_id ? `#${log.record_id}` : '—'}
                                            </TableCell>
                                            <TableCell className="px-5 py-3.5 font-mono text-[12px] text-[#99A1B7]">
                                                {log.ip_address || '127.0.0.1'}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    <div className="flex flex-col items-center justify-between gap-3 border-t border-[#F1F1F4] px-5 py-3.5 text-[12.5px] text-[#78829D] sm:flex-row">
                        <div className="flex flex-wrap items-center gap-3">
                            <span>
                                Showing <strong className="font-semibold text-[#071437]">{logs.from || 0}</strong>–
                                <strong className="font-semibold text-[#071437]">{logs.to || 0}</strong> of{' '}
                                <strong className="font-semibold text-[#071437]">{logs.total}</strong> · Page {logs.current_page} of {logs.last_page}
                            </span>
                            <div className="flex items-center gap-1.5">
                                <span className="text-[12px] text-[#78829D]">Rows:</span>
                                <Select
                                    value={perPage}
                                    onValueChange={(val) => {
                                        setPerPage(val);
                                        applyFilter('per_page', val);
                                    }}
                                >
                                    <SelectTrigger className="!h-8 w-[72px] cursor-pointer rounded-md !border-[#DBDFE9] !bg-[#FCFCFC] px-2.5 text-[12px] font-medium !text-[#071437] !shadow-none">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className={selectMenuClass}>
                                        {['10', '20', '50', '100'].map((size) => (
                                            <SelectItem key={size} value={size} className={selectItemClass}>
                                                {size}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5">
                            {logs.links.map((link, idx) => (
                                <Link
                                    key={idx}
                                    href={link.url || '#'}
                                    preserveScroll
                                    disabled={!link.url}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`rounded-lg px-2.5 py-1 text-[12px] font-medium transition-colors ${
                                        link.active
                                            ? 'bg-[#1B84FF] font-semibold text-white'
                                            : link.url
                                              ? 'text-[#4B5675] hover:bg-[#F1F6FF] hover:text-[#1B84FF]'
                                              : 'pointer-events-none text-[#DBDFE9]'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
