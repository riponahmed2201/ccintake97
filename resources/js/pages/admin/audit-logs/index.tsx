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
import type { AuditLogItem } from '@/types';

interface AuditLogsIndexProps {
    logs: {
        data: AuditLogItem[];
        current_page: number;
        last_page: number;
        total: number;
    };
    filters: {
        module?: string;
        action?: string;
    };
}

export default function AuditLogsIndex({ logs }: AuditLogsIndexProps) {
    return (
        <AdminLayout
            title="System Audit Logs & Security Activity"
            breadcrumbs={[{ title: 'Audit Logs' }]}
        >
            <Head title="Audit Logs - INTAKE 97 Admin" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-[20px] font-bold tracking-tight text-[#071437]">
                        System Audit Logs & Administrative History
                    </h1>
                    <p className="mt-1 text-[13px] text-[#78829D]">
                        Tamper-resistant audit record of membership approvals, suspensions, verifications, and permission modifications.
                    </p>
                </div>

                <div className="overflow-hidden rounded-xl border border-[#F1F1F4] bg-white shadow-[0_3px_4px_0_rgba(0,0,0,0.03)]">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-[#FCFCFC]">
                                <TableRow className="border-[#F1F1F4] hover:bg-transparent">
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
                                        <TableCell colSpan={6} className="h-32 text-center text-[13px] text-[#78829D]">
                                            No audit entries recorded.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    logs.data.map((log) => (
                                        <TableRow
                                            key={log.id}
                                            className="border-[#F1F1F4] transition-colors hover:bg-[#FCFCFC]"
                                        >
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
                </div>
            </div>
        </AdminLayout>
    );
}
