import React, { useState, useMemo } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    createColumnHelper,
} from '@tanstack/react-table';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Download,
    Search,
    ShieldCheck,
    CheckCircle2,
    Ban,
    RotateCcw,
    Eye,
    PlusCircle,
    GraduationCap,
} from 'lucide-react';
import type { Member, College, Industry } from '@/types';

interface MembersPageProps {
    members: {
        data: Member[];
        current_page: number;
        last_page: number;
        total: number;
        from: number;
        to: number;
        links: any[];
    };
    colleges: College[];
    industries: Industry[];
    filters: {
        search?: string;
        college_id?: string;
        membership_status?: string;
        verification_status?: string;
        industry_id?: string;
    };
}

export default function MembersIndex({
    members,
    colleges,
    industries,
    filters,
}: MembersPageProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [selectedCollege, setSelectedCollege] = useState(filters.college_id || '');
    const [selectedStatus, setSelectedStatus] = useState(filters.membership_status || '');
    const [selectedVerification, setSelectedVerification] = useState(filters.verification_status || '');

    // Action Dialogs state
    const [verifyMember, setVerifyMember] = useState<Member | null>(null);
    const [verifyMethod, setVerifyMethod] = useState('committee_manual');
    const [evidenceNote, setEvidenceNote] = useState('');

    const [suspendMember, setSuspendMember] = useState<Member | null>(null);
    const [suspendReason, setSuspendReason] = useState('');

    const applyFilter = (key: string, val: string) => {
        const query = {
            search,
            college_id: selectedCollege,
            membership_status: selectedStatus,
            verification_status: selectedVerification,
            [key]: val,
        };
        router.get('/admin/members', query, { preserveState: true, replace: true });
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilter('search', search);
    };

    const handleApprove = (id: number) => {
        router.post(`/admin/members/${id}/approve`);
    };

    const handleVerifySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!verifyMember) return;
        router.post(`/admin/members/${verifyMember.id}/verify`, {
            method: verifyMethod,
            evidence_note: evidenceNote,
        }, {
            onSuccess: () => {
                setVerifyMember(null);
                setEvidenceNote('');
            },
        });
    };

    const handleSuspendSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!suspendMember) return;
        router.post(`/admin/members/${suspendMember.id}/suspend`, {
            reason: suspendReason,
        }, {
            onSuccess: () => {
                setSuspendMember(null);
                setSuspendReason('');
            },
        });
    };

    const handleReactivate = (id: number) => {
        router.post(`/admin/members/${id}/reactivate`);
    };

    const handleAssignCode = (id: number) => {
        router.post(`/admin/members/${id}/assign-code`);
    };

    // TanStack Table Column Definitions
    const columnHelper = createColumnHelper<Member>();
    const columns = useMemo(() => [
        columnHelper.accessor('member_code', {
            header: 'Member ID',
            cell: (info) => (
                <div className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {info.getValue() || (
                        <button
                            onClick={() => handleAssignCode(info.row.original.id)}
                            className="text-xs text-indigo-600 hover:underline flex items-center gap-1"
                        >
                            <PlusCircle className="size-3" /> Assign ID
                        </button>
                    )}
                </div>
            ),
        }),
        columnHelper.accessor('user.name', {
            header: 'Alumnus',
            cell: (info) => (
                <div>
                    <div className="font-semibold text-xs text-slate-900 dark:text-white">
                        {info.getValue()}
                    </div>
                    <div className="text-[11px] text-slate-500">
                        {info.row.original.user?.email}
                    </div>
                </div>
            ),
        }),
        columnHelper.accessor('college.short_name', {
            header: 'Cadet College',
            cell: (info) => (
                <div>
                    <div className="font-medium text-xs text-slate-800 dark:text-slate-200">
                        {info.getValue() || info.row.original.college?.name}
                    </div>
                    <div className="text-[10px] text-slate-400">
                        Roll: {info.row.original.college_roll_no || 'N/A'} (1997)
                    </div>
                </div>
            ),
        }),
        columnHelper.accessor('profile.designation', {
            header: 'Profession & Org',
            cell: (info) => (
                <div>
                    <div className="text-xs font-medium text-slate-800 dark:text-slate-200">
                        {info.getValue() || '—'}
                    </div>
                    <div className="text-[11px] text-slate-500">
                        {info.row.original.profile?.organization || info.row.original.profile?.city || '—'}
                    </div>
                </div>
            ),
        }),
        columnHelper.accessor('membership_status', {
            header: 'Membership',
            cell: (info) => {
                const s = info.getValue();
                return (
                    <Badge
                        className={`text-[10px] capitalize ${
                            s === 'approved'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                : s === 'pending'
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                : s === 'suspended'
                                ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                                : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                    >
                        {s}
                    </Badge>
                );
            },
        }),
        columnHelper.accessor('verification_status', {
            header: 'Verification',
            cell: (info) => {
                const v = info.getValue();
                return (
                    <Badge
                        variant="outline"
                        className={`text-[10px] capitalize font-medium ${
                            v === 'verified'
                                ? 'border-emerald-500 text-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/20'
                                : v === 'pending'
                                ? 'border-amber-500 text-amber-600 bg-amber-50/50 dark:bg-amber-950/20'
                                : 'border-slate-300 text-slate-500'
                        }`}
                    >
                        {v}
                    </Badge>
                );
            },
        }),
        columnHelper.display({
            id: 'actions',
            header: () => <div className="text-right">Actions</div>,
            cell: (info) => {
                const m = info.row.original;
                return (
                    <div className="flex items-center justify-end gap-1.5">
                        <Link
                            href={`/admin/members/${m.id}`}
                            className="p-1 rounded text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                            title="View Full Profile"
                        >
                            <Eye className="size-4" />
                        </Link>
                        {m.membership_status === 'pending' && (
                            <button
                                onClick={() => handleApprove(m.id)}
                                className="p-1 rounded text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                                title="Approve Membership"
                            >
                                <CheckCircle2 className="size-4" />
                            </button>
                        )}
                        {m.verification_status !== 'verified' && (
                            <button
                                onClick={() => setVerifyMember(m)}
                                className="p-1 rounded text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40"
                                title="Verify 1997 Intake Affiliation"
                            >
                                <ShieldCheck className="size-4" />
                            </button>
                        )}
                        {m.membership_status !== 'suspended' ? (
                            <button
                                onClick={() => setSuspendMember(m)}
                                className="p-1 rounded text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                                title="Suspend Member"
                            >
                                <Ban className="size-4" />
                            </button>
                        ) : (
                            <button
                                onClick={() => handleReactivate(m.id)}
                                className="p-1 rounded text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40"
                                title="Reactivate Member"
                            >
                                <RotateCcw className="size-4" />
                            </button>
                        )}
                    </div>
                );
            },
        }),
    ], []);

    const table = useReactTable({
        data: members.data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <AdminLayout
            title="Member Management"
            breadcrumbs={[{ title: 'Members' }]}
        >
            <Head title="Member Management - INTAKE 97 Admin" />

            <div className="space-y-6">
                {/* Topbar */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                            Alumni Member Registry
                        </h1>
                        <p className="text-xs text-slate-500 mt-1">
                            Showing {members.from || 0} to {members.to || 0} of {members.total} registered alumni across participating Cadet Colleges.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <a
                            href="/admin/members/export"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold hover:bg-slate-50 transition-colors"
                        >
                            <Download className="size-3.5" />
                            Export CSV
                        </a>
                    </div>
                </div>

                {/* Filter Toolbar */}
                <Card className="p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                        {/* Search */}
                        <form onSubmit={handleSearchSubmit} className="relative sm:col-span-2">
                            <Search className="absolute left-3 top-2.5 size-4 text-slate-400" />
                            <Input
                                placeholder="Search by name, email, roll or ID..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9 text-xs"
                            />
                        </form>

                        {/* College Filter */}
                        <select
                            value={selectedCollege}
                            onChange={(e) => {
                                setSelectedCollege(e.target.value);
                                applyFilter('college_id', e.target.value);
                            }}
                            className="w-full text-xs rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2"
                        >
                            <option value="">All Cadet Colleges</option>
                            {colleges.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.short_name || c.name}
                                </option>
                            ))}
                        </select>

                        {/* Membership Status */}
                        <select
                            value={selectedStatus}
                            onChange={(e) => {
                                setSelectedStatus(e.target.value);
                                applyFilter('membership_status', e.target.value);
                            }}
                            className="w-full text-xs rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2"
                        >
                            <option value="">All Membership Status</option>
                            <option value="pending">Pending</option>
                            <option value="under_review">Under Review</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                            <option value="suspended">Suspended</option>
                        </select>

                        {/* Verification Status */}
                        <select
                            value={selectedVerification}
                            onChange={(e) => {
                                setSelectedVerification(e.target.value);
                                applyFilter('verification_status', e.target.value);
                            }}
                            className="w-full text-xs rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2"
                        >
                            <option value="">All Verification Status</option>
                            <option value="unverified">Unverified</option>
                            <option value="pending">Pending</option>
                            <option value="verified">Verified</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>
                </Card>

                {/* TanStack Data Table */}
                <Card className="overflow-hidden border-slate-200 dark:border-slate-800">
                    <Table>
                        <TableHeader className="bg-slate-50 dark:bg-slate-900/60">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead key={header.id} className="text-xs font-semibold">
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-28 text-center text-xs text-slate-500">
                                        No alumni records found matching the active filters.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow key={row.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id} className="text-xs py-3">
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>

                    {/* Pagination */}
                    <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                        <div>
                            Page {members.current_page} of {members.last_page}
                        </div>
                        <div className="flex items-center gap-1.5">
                            {members.links.map((link, idx) => (
                                <Link
                                    key={idx}
                                    href={link.url || '#'}
                                    disabled={!link.url}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`px-2.5 py-1 rounded text-xs transition-colors ${
                                        link.active
                                            ? 'bg-emerald-600 text-white font-semibold'
                                            : link.url
                                            ? 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                                            : 'text-slate-300 dark:text-slate-700 pointer-events-none'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                </Card>
            </div>

            {/* Verification Dialog */}
            <Dialog open={!!verifyMember} onOpenChange={(open) => !open && setVerifyMember(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <ShieldCheck className="size-5 text-indigo-600" />
                            Verify 1997 Cadet Affiliation
                        </DialogTitle>
                        <DialogDescription className="text-xs">
                            Verify authentic membership for <strong>{verifyMember?.user?.name}</strong> ({verifyMember?.college?.name}, Roll #{verifyMember?.college_roll_no}).
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleVerifySubmit} className="space-y-4 py-2">
                        <div>
                            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                                Verification Method
                            </label>
                            <select
                                value={verifyMethod}
                                onChange={(e) => setVerifyMethod(e.target.value)}
                                className="w-full text-xs rounded-md border border-slate-300 dark:border-slate-700 p-2 bg-white dark:bg-slate-900"
                            >
                                <option value="committee_manual">Manual Verification by Committee Member</option>
                                <option value="college_record">Cadet College Roll / Official Archive Record</option>
                                <option value="alumni_reference">Batchmate Alumnus Reference</option>
                                <option value="document_proof">Supporting Documentary Proof</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                                Verification Evidence Note (Audited)
                            </label>
                            <textarea
                                required
                                rows={3}
                                placeholder="State clearly the verified record, committee member reference, or documentary basis..."
                                value={evidenceNote}
                                onChange={(e) => setEvidenceNote(e.target.value)}
                                className="w-full text-xs rounded-md border border-slate-300 dark:border-slate-700 p-2 bg-white dark:bg-slate-900"
                            />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" size="sm" onClick={() => setVerifyMember(null)}>
                                Cancel
                            </Button>
                            <Button type="submit" size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                                Confirm Verification
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Suspension Dialog */}
            <Dialog open={!!suspendMember} onOpenChange={(open) => !open && setSuspendMember(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-rose-600">
                            <Ban className="size-5" />
                            Suspend Alumni Account
                        </DialogTitle>
                        <DialogDescription className="text-xs">
                            Suspend account for <strong>{suspendMember?.user?.name}</strong>. The user will lose access to member-only directories and events.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSuspendSubmit} className="space-y-4 py-2">
                        <div>
                            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                                Suspension Reason
                            </label>
                            <textarea
                                required
                                rows={3}
                                placeholder="Document reason for suspension (e.g. policy violation, identity mismatch)..."
                                value={suspendReason}
                                onChange={(e) => setSuspendReason(e.target.value)}
                                className="w-full text-xs rounded-md border border-slate-300 dark:border-slate-700 p-2 bg-white dark:bg-slate-900"
                            />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" size="sm" onClick={() => setSuspendMember(null)}>
                                Cancel
                            </Button>
                            <Button type="submit" size="sm" variant="destructive">
                                Confirm Suspension
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}
