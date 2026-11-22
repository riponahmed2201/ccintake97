import React from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ShieldAlert } from 'lucide-react';
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

export default function AuditLogsIndex({ logs, filters }: AuditLogsIndexProps) {
    return (
        <AdminLayout
            title="System Audit Logs & Security Activity"
            breadcrumbs={[{ title: 'Audit Logs' }]}
        >
            <Head title="Audit Logs - INTAKE 97 Admin" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                        System Audit Logs & Administrative History
                    </h1>
                    <p className="text-xs text-slate-500 mt-1">
                        Tamper-resistant audit record of membership approvals, suspensions, verifications, and permission modifications.
                    </p>
                </div>

                <Card className="overflow-hidden">
                    <Table>
                        <TableHeader className="bg-slate-50 dark:bg-slate-900/60">
                            <TableRow>
                                <TableHead className="text-xs font-semibold">Timestamp</TableHead>
                                <TableHead className="text-xs font-semibold">Action</TableHead>
                                <TableHead className="text-xs font-semibold">Module</TableHead>
                                <TableHead className="text-xs font-semibold">Actor / Admin</TableHead>
                                <TableHead className="text-xs font-semibold">Record ID</TableHead>
                                <TableHead className="text-xs font-semibold">IP Address</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {logs.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-28 text-center text-xs text-slate-500">
                                        No audit entries recorded.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                logs.data.map((log) => (
                                    <TableRow key={log.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                                        <TableCell className="text-xs font-mono text-slate-500">
                                            {new Date(log.created_at).toLocaleString()}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="text-[10px] font-mono text-indigo-600 border-indigo-200">
                                                {log.action}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-xs font-medium text-slate-700 dark:text-slate-300 capitalize">
                                            {log.module}
                                        </TableCell>
                                        <TableCell className="text-xs font-semibold text-slate-900 dark:text-white">
                                            {log.user?.name || 'System Auto'}
                                        </TableCell>
                                        <TableCell className="text-xs font-mono text-slate-500">
                                            {log.record_id ? `#${log.record_id}` : '—'}
                                        </TableCell>
                                        <TableCell className="text-xs font-mono text-slate-400">
                                            {log.ip_address || '127.0.0.1'}
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
