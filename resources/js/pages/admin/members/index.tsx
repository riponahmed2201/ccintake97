import React, { useState, useMemo } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Download,
    Search,
    ShieldCheck,
    CheckCircle2,
    Ban,
    RotateCcw,
    Eye,
    MoreHorizontal,
    Pencil,
    PlusCircle,
    UserPlus,
} from 'lucide-react';
import type { Member, College, Industry } from '@/types';

interface MembersPageProps {
    members: {
        data: Member[];
        current_page: number;
        last_page: number;
        per_page?: number;
        total: number;
        from: number;
        to: number;
        links: any[];
    };
    colleges: College[];
    industries: Industry[];
    houses: Record<string, string[]>;
    filters: {
        search?: string;
        college_id?: string;
        membership_status?: string;
        verification_status?: string;
        industry_id?: string;
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

export default function MembersIndex({
    members,
    colleges,
    houses,
    filters,
}: MembersPageProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [selectedCollege, setSelectedCollege] = useState(filters.college_id || '');
    const [selectedStatus, setSelectedStatus] = useState(filters.membership_status || '');
    const [selectedVerification, setSelectedVerification] = useState(filters.verification_status || '');
    const [perPage, setPerPage] = useState(filters.per_page || String(members.per_page || 10));

    const [registerOpen, setRegisterOpen] = useState(false);
    const registerForm = useForm({
        name: '',
        email: '',
        phone: '',
        password: '',
        college_id: '',
        college_roll_no: '',
        intake_year: '1997',
        house_name: '',
        membership_status: 'approved',
        verification_status: 'verified',
    });

    const selectedRegCollege = colleges.find((c) => String(c.id) === registerForm.data.college_id);
    const regHouseOptions = selectedRegCollege?.short_name ? houses?.[selectedRegCollege.short_name] ?? [] : [];

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
            per_page: perPage,
            [key]: val,
        };
        router.get('/admin/members', query, { preserveState: true, replace: true });
    };

    const handleRegisterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        registerForm.post('/admin/members', {
            preserveScroll: true,
            onSuccess: () => {
                setRegisterOpen(false);
                registerForm.reset();
            },
        });
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilter('search', search);
    };

    const handleApprove = (id: number) => {
        router.post(`/admin/members/${id}/approve`, {}, { preserveScroll: true });
    };

    const handleVerifySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!verifyMember) return;
        router.post(
            `/admin/members/${verifyMember.id}/verify`,
            {
                method: verifyMethod,
                evidence_note: evidenceNote,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setVerifyMember(null);
                    setEvidenceNote('');
                },
            }
        );
    };

    const handleSuspendSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!suspendMember) return;
        router.post(
            `/admin/members/${suspendMember.id}/suspend`,
            { reason: suspendReason },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setSuspendMember(null);
                    setSuspendReason('');
                },
            }
        );
    };

    const handleReactivate = (id: number) => {
        router.post(`/admin/members/${id}/reactivate`, {}, { preserveScroll: true });
    };

    const handleAssignCode = (id: number) => {
        router.post(`/admin/members/${id}/assign-code`, {}, { preserveScroll: true });
    };

    const columnHelper = createColumnHelper<Member>();
    const columns = useMemo(
        () => [
            columnHelper.display({
                id: 'sl_no',
                header: 'SL',
                cell: (info) => (
                    <span className="text-[12.5px] font-medium text-[#78829D] tabular-nums">
                        {(members.from || 1) + info.row.index}
                    </span>
                ),
            }),
            columnHelper.accessor('member_code', {
                header: 'Member ID',
                cell: (info) => (
                    <div className="font-mono text-[12.5px] font-semibold text-[#071437]">
                        {info.getValue() || (
                            <button
                                type="button"
                                onClick={() => handleAssignCode(info.row.original.id)}
                                className="inline-flex cursor-pointer items-center gap-1 text-[12px] font-semibold text-[#1B84FF] hover:text-[#006AE6]"
                            >
                                <PlusCircle className="size-3.5" /> Assign ID
                            </button>
                        )}
                    </div>
                ),
            }),
            columnHelper.accessor('user.name', {
                header: 'Alumnus',
                cell: (info) => (
                    <div>
                        <div className="text-[13px] font-semibold text-[#071437]">
                            {info.getValue()}
                        </div>
                        <div className="text-[11.5px] text-[#78829D]">
                            {info.row.original.user?.email}
                        </div>
                    </div>
                ),
            }),
            columnHelper.accessor('college.short_name', {
                header: 'Cadet College',
                cell: (info) => (
                    <div>
                        <div className="text-[12.5px] font-medium text-[#071437]">
                            {info.getValue() || info.row.original.college?.name || 'Not set'}
                        </div>
                        <div className="text-[11px] text-[#99A1B7]">
                            Roll: {info.row.original.college_roll_no || 'N/A'} ({info.row.original.intake_year || '1997'})
                        </div>
                    </div>
                ),
            }),
            columnHelper.accessor('profile.designation', {
                header: 'Profession & Org',
                cell: (info) => (
                    <div>
                        <div className="text-[12.5px] font-medium text-[#071437]">
                            {info.getValue() || '—'}
                        </div>
                        <div className="text-[11.5px] text-[#78829D]">
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
                        <span
                            className={`inline-flex rounded-md px-2 py-0.5 text-[11px] font-semibold capitalize ${
                                s === 'approved'
                                    ? 'bg-[#EAFFF1] text-[#17C653]'
                                    : s === 'pending'
                                      ? 'bg-[#FFF8DD] text-[#B45309]'
                                      : s === 'suspended'
                                        ? 'bg-[#FFEEF3] text-[#F8285A]'
                                        : 'bg-[#F1F1F4] text-[#4B5675]'
                            }`}
                        >
                            {s}
                        </span>
                    );
                },
            }),
            columnHelper.accessor('verification_status', {
                header: 'Verification',
                cell: (info) => {
                    const v = info.getValue();
                    return (
                        <span
                            className={`inline-flex rounded-md px-2 py-0.5 text-[11px] font-semibold capitalize ${
                                v === 'verified'
                                    ? 'bg-[#EAFFF1] text-[#17C653]'
                                    : v === 'pending'
                                      ? 'bg-[#FFF8DD] text-[#B45309]'
                                      : 'bg-[#F1F1F4] text-[#78829D]'
                            }`}
                        >
                            {v}
                        </span>
                    );
                },
            }),
            columnHelper.display({
                id: 'actions',
                header: () => <div className="text-right">Actions</div>,
                cell: (info) => {
                    const m = info.row.original;
                    return (
                        <div className="flex justify-end">
                            <DropdownMenu modal={false}>
                                <DropdownMenuTrigger asChild>
                                    <button
                                        type="button"
                                        className="inline-flex size-8 cursor-pointer items-center justify-center rounded-lg border border-transparent text-[#78829D] transition-colors hover:border-[#DBDFE9] hover:bg-[#F9F9F9] hover:text-[#071437]"
                                        aria-label="Member actions"
                                    >
                                        <MoreHorizontal className="size-4" />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-52 rounded-xl border-[#F1F1F4] !bg-white p-1.5 !text-[#071437] shadow-[0_12px_32px_-8px_rgba(7,20,55,0.16)]">
                                    <DropdownMenuItem asChild className="cursor-pointer rounded-lg px-2.5 py-2 text-[13px] font-medium text-[#071437] focus:!bg-[#F1F6FF] focus:!text-[#1B84FF]">
                                        <Link href={`/admin/members/${m.id}`}>
                                            <Eye className="size-4 text-[#78829D]" />
                                            View Profile
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild className="cursor-pointer rounded-lg px-2.5 py-2 text-[13px] font-medium text-[#071437] focus:!bg-[#F1F6FF] focus:!text-[#1B84FF]">
                                        <Link href={`/admin/members/${m.id}/edit`}>
                                            <Pencil className="size-4 text-[#78829D]" />
                                            Edit Member
                                        </Link>
                                    </DropdownMenuItem>
                                    {m.membership_status === 'pending' && (
                                        <DropdownMenuItem
                                            onSelect={() => handleApprove(m.id)}
                                            className="cursor-pointer rounded-lg px-2.5 py-2 text-[13px] font-medium text-[#17C653] focus:!bg-[#EAFFF1] focus:!text-[#17C653]"
                                        >
                                            <CheckCircle2 className="size-4 text-[#17C653]" />
                                            Approve Membership
                                        </DropdownMenuItem>
                                    )}
                                    {m.verification_status !== 'verified' && (
                                        <DropdownMenuItem
                                            onSelect={() => setVerifyMember(m)}
                                            className="cursor-pointer rounded-lg px-2.5 py-2 text-[13px] font-medium text-[#1B84FF] focus:!bg-[#F1F6FF] focus:!text-[#1B84FF]"
                                        >
                                            <ShieldCheck className="size-4 text-[#1B84FF]" />
                                            Verify Affiliation
                                        </DropdownMenuItem>
                                    )}
                                    <DropdownMenuSeparator className="my-1 bg-[#F1F1F4]" />
                                    {m.membership_status !== 'suspended' ? (
                                        <DropdownMenuItem
                                            onSelect={() => setSuspendMember(m)}
                                            className="cursor-pointer rounded-lg px-2.5 py-2 text-[13px] font-medium text-[#F8285A] focus:!bg-[#FFEEF3] focus:!text-[#F8285A]"
                                        >
                                            <Ban className="size-4 text-[#F8285A]" />
                                            Suspend Member
                                        </DropdownMenuItem>
                                    ) : (
                                        <DropdownMenuItem
                                            onSelect={() => handleReactivate(m.id)}
                                            className="cursor-pointer rounded-lg px-2.5 py-2 text-[13px] font-medium text-[#B45309] focus:!bg-[#FFF8DD] focus:!text-[#B45309]"
                                        >
                                            <RotateCcw className="size-4 text-[#B45309]" />
                                            Reactivate Member
                                        </DropdownMenuItem>
                                    )}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    );
                },
            }),
        ],
        [members.from]
    );

    const table = useReactTable({
        data: members.data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <AdminLayout title="Member Management" breadcrumbs={[{ title: 'Members' }]}>
            <Head title="Member Management - CCINTAKE 97 Admin" />

            <div className="w-full space-y-6">
                {/* Topbar */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="text-[22px] font-semibold tracking-tight text-[#071437]">
                            Alumni Member Registry
                        </h1>
                        <p className="mt-1 text-[13px] text-[#78829D]">
                            Showing {members.from || 0} to {members.to || 0} of {members.total} registered alumni across participating Cadet Colleges.
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
                        <a
                            href="/admin/members/export"
                            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#DBDFE9] bg-white px-3.5 text-[12.5px] font-semibold text-[#4B5675] transition-colors hover:bg-[#F9F9F9] hover:text-[#071437]"
                        >
                            <Download className="size-3.5 text-[#78829D]" />
                            Export CSV
                        </a>
                        <Button
                            type="button"
                            onClick={() => setRegisterOpen(true)}
                            className="h-9 rounded-lg bg-[#1B84FF] px-3.5 text-[12.5px] font-semibold text-white hover:bg-[#006AE6]"
                        >
                            <UserPlus className="mr-1.5 size-3.5" />
                            Register Member
                        </Button>
                    </div>
                </div>

                {/* Filter Toolbar */}
                <div className="rounded-xl border border-[#F1F1F4] bg-white p-4 shadow-[0_3px_4px_0_rgba(0,0,0,0.03)]">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
                        <form onSubmit={handleSearchSubmit} className="relative sm:col-span-2">
                            <Search className="absolute top-3 left-3 size-4 text-[#99A1B7]" />
                            <Input
                                placeholder="Search by name, email, roll or ID..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className={`${fieldClass} pl-9`}
                            />
                        </form>

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
                                <SelectItem value={ALL} className={selectItemClass}>
                                    All Cadet Colleges
                                </SelectItem>
                                {colleges.map((c) => (
                                    <SelectItem key={c.id} value={String(c.id)} className={selectItemClass}>
                                        {c.short_name || c.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select
                            value={selectedStatus || ALL}
                            onValueChange={(val) => {
                                const next = val === ALL ? '' : val;
                                setSelectedStatus(next);
                                applyFilter('membership_status', next);
                            }}
                        >
                            <SelectTrigger className={selectTriggerClass}>
                                <SelectValue placeholder="All Membership Status" />
                            </SelectTrigger>
                            <SelectContent className={selectMenuClass}>
                                <SelectItem value={ALL} className={selectItemClass}>All Membership Status</SelectItem>
                                <SelectItem value="pending" className={selectItemClass}>Pending</SelectItem>
                                <SelectItem value="under_review" className={selectItemClass}>Under Review</SelectItem>
                                <SelectItem value="approved" className={selectItemClass}>Approved</SelectItem>
                                <SelectItem value="rejected" className={selectItemClass}>Rejected</SelectItem>
                                <SelectItem value="suspended" className={selectItemClass}>Suspended</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select
                            value={selectedVerification || ALL}
                            onValueChange={(val) => {
                                const next = val === ALL ? '' : val;
                                setSelectedVerification(next);
                                applyFilter('verification_status', next);
                            }}
                        >
                            <SelectTrigger className={selectTriggerClass}>
                                <SelectValue placeholder="All Verification Status" />
                            </SelectTrigger>
                            <SelectContent className={selectMenuClass}>
                                <SelectItem value={ALL} className={selectItemClass}>All Verification Status</SelectItem>
                                <SelectItem value="unverified" className={selectItemClass}>Unverified</SelectItem>
                                <SelectItem value="pending" className={selectItemClass}>Pending</SelectItem>
                                <SelectItem value="verified" className={selectItemClass}>Verified</SelectItem>
                                <SelectItem value="rejected" className={selectItemClass}>Rejected</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Data Table */}
                <div className="overflow-hidden rounded-xl border border-[#F1F1F4] bg-white shadow-[0_3px_4px_0_rgba(0,0,0,0.03)]">
                    <Table>
                        <TableHeader className="bg-[#FCFCFC]">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id} className="border-[#F1F1F4] hover:bg-transparent">
                                    {headerGroup.headers.map((header) => (
                                        <TableHead
                                            key={header.id}
                                            className="px-4 py-3.5 text-[11.5px] font-semibold tracking-wide text-[#78829D] uppercase"
                                        >
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows.length === 0 ? (
                                <TableRow className="hover:bg-transparent">
                                    <TableCell colSpan={columns.length} className="h-28 text-center text-[13px] text-[#99A1B7]">
                                        No alumni records found matching the active filters.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow key={row.id} className="border-[#F1F1F4] hover:bg-[#FCFCFC]">
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id} className="px-4 py-3.5">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>

                    {/* Pagination */}
                    <div className="flex flex-col items-center justify-between gap-3 border-t border-[#F1F1F4] px-5 py-3.5 text-[12.5px] text-[#78829D] sm:flex-row">
                        <div className="flex flex-wrap items-center gap-3">
                            <span>
                                Showing <strong className="font-semibold text-[#071437]">{members.from || 0}</strong>–
                                <strong className="font-semibold text-[#071437]">{members.to || 0}</strong> of{' '}
                                <strong className="font-semibold text-[#071437]">{members.total}</strong> · Page {members.current_page} of {members.last_page}
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
                                        {['10', '25', '50', '100'].map((size) => (
                                            <SelectItem key={size} value={size} className={selectItemClass}>
                                                {size}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5">
                            {members.links.map((link, idx) => (
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

            {/* Register Member Dialog */}
            <Dialog open={registerOpen} onOpenChange={(open) => { setRegisterOpen(open); if (!open) registerForm.clearErrors(); }}>
                <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl border-[#F1F1F4] !bg-white p-0 !text-[#071437] shadow-[0_20px_50px_-12px_rgba(7,20,55,0.18)] sm:max-w-xl">
                    <DialogHeader className="border-b border-[#F1F1F4] px-6 py-5">
                        <DialogTitle className="flex items-center gap-2 text-[16px] font-semibold text-[#071437]">
                            <UserPlus className="size-5 text-[#1B84FF]" />
                            Register New Alumni Member
                        </DialogTitle>
                        <DialogDescription className="mt-1 text-[12.5px] text-[#78829D]">
                            Create a new alumni member account directly from the admin registry.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleRegisterSubmit} className="space-y-4 px-6 py-5">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="sm:col-span-2">
                                <label className="mb-1.5 block text-[12.5px] font-semibold text-[#071437]">
                                    Full Name <span className="text-[#F8285A]">*</span>
                                </label>
                                <Input
                                    required
                                    value={registerForm.data.name}
                                    onChange={(e) => registerForm.setData('name', e.target.value)}
                                    placeholder="e.g. Tariqul Islam"
                                    className={fieldClass}
                                />
                                {registerForm.errors.name && <p className="mt-1 text-[11.5px] text-[#F8285A]">{registerForm.errors.name}</p>}
                            </div>
                            <div>
                                <label className="mb-1.5 block text-[12.5px] font-semibold text-[#071437]">
                                    Email Address <span className="text-[#F8285A]">*</span>
                                </label>
                                <Input
                                    required
                                    type="email"
                                    value={registerForm.data.email}
                                    onChange={(e) => registerForm.setData('email', e.target.value)}
                                    placeholder="member@example.com"
                                    className={fieldClass}
                                />
                                {registerForm.errors.email && <p className="mt-1 text-[11.5px] text-[#F8285A]">{registerForm.errors.email}</p>}
                            </div>
                            <div>
                                <label className="mb-1.5 block text-[12.5px] font-semibold text-[#071437]">
                                    Phone Number
                                </label>
                                <Input
                                    type="tel"
                                    value={registerForm.data.phone}
                                    onChange={(e) => registerForm.setData('phone', e.target.value)}
                                    placeholder="+88017..."
                                    className={fieldClass}
                                />
                                {registerForm.errors.phone && <p className="mt-1 text-[11.5px] text-[#F8285A]">{registerForm.errors.phone}</p>}
                            </div>
                            <div className="sm:col-span-2">
                                <label className="mb-1.5 block text-[12.5px] font-semibold text-[#071437]">
                                    Initial Password <span className="text-[#F8285A]">*</span>
                                </label>
                                <Input
                                    required
                                    type="password"
                                    minLength={8}
                                    value={registerForm.data.password}
                                    onChange={(e) => registerForm.setData('password', e.target.value)}
                                    placeholder="Minimum 8 characters"
                                    className={fieldClass}
                                />
                                {registerForm.errors.password && <p className="mt-1 text-[11.5px] text-[#F8285A]">{registerForm.errors.password}</p>}
                            </div>
                            <div>
                                <label className="mb-1.5 block text-[12.5px] font-semibold text-[#071437]">
                                    Cadet College
                                </label>
                                <Select
                                    value={registerForm.data.college_id || ALL}
                                    onValueChange={(val) => registerForm.setData((prev) => ({ ...prev, college_id: val === ALL ? '' : val, house_name: '' }))}
                                >
                                    <SelectTrigger className={selectTriggerClass}>
                                        <SelectValue placeholder="Select college" />
                                    </SelectTrigger>
                                    <SelectContent className={selectMenuClass}>
                                        <SelectItem value={ALL} className={selectItemClass}>Not assigned yet</SelectItem>
                                        {colleges.map((c) => (
                                            <SelectItem key={c.id} value={String(c.id)} className={selectItemClass}>
                                                {c.short_name ? `${c.short_name} — ${c.name}` : c.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {registerForm.errors.college_id && <p className="mt-1 text-[11.5px] text-[#F8285A]">{registerForm.errors.college_id}</p>}
                            </div>
                            <div>
                                <label className="mb-1.5 block text-[12.5px] font-semibold text-[#071437]">
                                    Cadet Roll No
                                </label>
                                <Input
                                    value={registerForm.data.college_roll_no}
                                    onChange={(e) => registerForm.setData('college_roll_no', e.target.value)}
                                    placeholder="e.g. 1997-042"
                                    className={fieldClass}
                                />
                                {registerForm.errors.college_roll_no && <p className="mt-1 text-[11.5px] text-[#F8285A]">{registerForm.errors.college_roll_no}</p>}
                            </div>
                            <div>
                                <label className="mb-1.5 block text-[12.5px] font-semibold text-[#071437]">
                                    Intake Year
                                </label>
                                <Input
                                    type="number"
                                    min={1950}
                                    max={2035}
                                    value={registerForm.data.intake_year}
                                    onChange={(e) => registerForm.setData('intake_year', e.target.value)}
                                    className={fieldClass}
                                />
                                {registerForm.errors.intake_year && <p className="mt-1 text-[11.5px] text-[#F8285A]">{registerForm.errors.intake_year}</p>}
                            </div>
                            <div>
                                <label className="mb-1.5 block text-[12.5px] font-semibold text-[#071437]">
                                    House
                                </label>
                                {regHouseOptions.length > 0 ? (
                                    <Select
                                        value={registerForm.data.house_name || ALL}
                                        onValueChange={(val) => registerForm.setData('house_name', val === ALL ? '' : val)}
                                    >
                                        <SelectTrigger className={selectTriggerClass}>
                                            <SelectValue placeholder="Select house" />
                                        </SelectTrigger>
                                        <SelectContent className={selectMenuClass}>
                                            <SelectItem value={ALL} className={selectItemClass}>None</SelectItem>
                                            {regHouseOptions.map((h) => (
                                                <SelectItem key={h} value={h} className={selectItemClass}>{h}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                ) : (
                                    <Input
                                        value={registerForm.data.house_name}
                                        onChange={(e) => registerForm.setData('house_name', e.target.value)}
                                        placeholder="House name"
                                        className={fieldClass}
                                    />
                                )}
                                {registerForm.errors.house_name && <p className="mt-1 text-[11.5px] text-[#F8285A]">{registerForm.errors.house_name}</p>}
                            </div>
                            <div>
                                <label className="mb-1.5 block text-[12.5px] font-semibold text-[#071437]">
                                    Membership Status
                                </label>
                                <Select
                                    value={registerForm.data.membership_status}
                                    onValueChange={(val) => registerForm.setData('membership_status', val)}
                                >
                                    <SelectTrigger className={selectTriggerClass}>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className={selectMenuClass}>
                                        <SelectItem value="approved" className={selectItemClass}>Approved</SelectItem>
                                        <SelectItem value="pending" className={selectItemClass}>Pending</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className="mb-1.5 block text-[12.5px] font-semibold text-[#071437]">
                                    Verification Status
                                </label>
                                <Select
                                    value={registerForm.data.verification_status}
                                    onValueChange={(val) => registerForm.setData('verification_status', val)}
                                >
                                    <SelectTrigger className={selectTriggerClass}>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className={selectMenuClass}>
                                        <SelectItem value="verified" className={selectItemClass}>Verified</SelectItem>
                                        <SelectItem value="unverified" className={selectItemClass}>Unverified</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter className="border-t border-[#F1F1F4] pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setRegisterOpen(false)}
                                className="h-9.5 rounded-lg border-[#DBDFE9] !bg-white px-4 text-[12.5px] font-semibold text-[#4B5675] hover:!bg-[#F9F9F9]"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={registerForm.processing}
                                className="h-9.5 rounded-lg bg-[#1B84FF] px-4 text-[12.5px] font-semibold text-white hover:bg-[#006AE6]"
                            >
                                {registerForm.processing ? 'Registering...' : 'Register Member'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Verification Dialog */}
            <Dialog open={!!verifyMember} onOpenChange={(open) => !open && setVerifyMember(null)}>
                <DialogContent className="rounded-2xl border-[#F1F1F4] !bg-white p-0 !text-[#071437] shadow-[0_20px_50px_-12px_rgba(7,20,55,0.18)] sm:max-w-lg">
                    <DialogHeader className="border-b border-[#F1F1F4] px-6 py-5">
                        <DialogTitle className="flex items-center gap-2 text-[16px] font-semibold text-[#071437]">
                            <ShieldCheck className="size-5 text-[#1B84FF]" />
                            Verify 1997 Cadet Affiliation
                        </DialogTitle>
                        <DialogDescription className="mt-1 text-[12.5px] text-[#78829D]">
                            Verify authentic membership for <strong className="text-[#071437]">{verifyMember?.user?.name}</strong> ({verifyMember?.college?.name}, Roll #{verifyMember?.college_roll_no}).
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleVerifySubmit} className="space-y-4 px-6 py-5">
                        <div>
                            <label className="mb-1.5 block text-[12.5px] font-semibold text-[#071437]">
                                Verification Method <span className="text-[#F8285A]">*</span>
                            </label>
                            <Select value={verifyMethod} onValueChange={setVerifyMethod}>
                                <SelectTrigger className={selectTriggerClass}>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className={selectMenuClass}>
                                    <SelectItem value="committee_manual" className={selectItemClass}>Manual Verification by Committee Member</SelectItem>
                                    <SelectItem value="college_record" className={selectItemClass}>Cadet College Roll / Official Archive Record</SelectItem>
                                    <SelectItem value="alumni_reference" className={selectItemClass}>Batchmate Alumnus Reference</SelectItem>
                                    <SelectItem value="document_proof" className={selectItemClass}>Supporting Documentary Proof</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label className="mb-1.5 block text-[12.5px] font-semibold text-[#071437]">
                                Verification Evidence Note <span className="text-[#F8285A]">*</span>
                            </label>
                            <textarea
                                required
                                rows={3}
                                placeholder="State clearly the verified record, committee member reference, or documentary basis..."
                                value={evidenceNote}
                                onChange={(e) => setEvidenceNote(e.target.value)}
                                className={`${fieldClass} h-auto py-2.5`}
                            />
                        </div>
                        <DialogFooter className="border-t border-[#F1F1F4] pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setVerifyMember(null)}
                                className="h-9.5 rounded-lg border-[#DBDFE9] !bg-white px-4 text-[12.5px] font-semibold text-[#4B5675] hover:!bg-[#F9F9F9]"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="h-9.5 rounded-lg bg-[#1B84FF] px-4 text-[12.5px] font-semibold text-white hover:bg-[#006AE6]"
                            >
                                Confirm Verification
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Suspension Dialog */}
            <Dialog open={!!suspendMember} onOpenChange={(open) => !open && setSuspendMember(null)}>
                <DialogContent className="rounded-2xl border-[#F1F1F4] !bg-white p-0 !text-[#071437] shadow-[0_20px_50px_-12px_rgba(7,20,55,0.18)] sm:max-w-lg">
                    <DialogHeader className="border-b border-[#F1F1F4] px-6 py-5">
                        <DialogTitle className="flex items-center gap-2 text-[16px] font-semibold text-[#F8285A]">
                            <Ban className="size-5" />
                            Suspend Alumni Account
                        </DialogTitle>
                        <DialogDescription className="mt-1 text-[12.5px] text-[#78829D]">
                            Suspend account for <strong className="text-[#071437]">{suspendMember?.user?.name}</strong>. The user will lose access to member-only directories and events.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSuspendSubmit} className="space-y-4 px-6 py-5">
                        <div>
                            <label className="mb-1.5 block text-[12.5px] font-semibold text-[#071437]">
                                Suspension Reason <span className="text-[#F8285A]">*</span>
                            </label>
                            <textarea
                                required
                                rows={3}
                                placeholder="Document reason for suspension (e.g. policy violation, identity mismatch)..."
                                value={suspendReason}
                                onChange={(e) => setSuspendReason(e.target.value)}
                                className={`${fieldClass} h-auto py-2.5`}
                            />
                        </div>
                        <DialogFooter className="border-t border-[#F1F1F4] pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setSuspendMember(null)}
                                className="h-9.5 rounded-lg border-[#DBDFE9] !bg-white px-4 text-[12.5px] font-semibold text-[#4B5675] hover:!bg-[#F9F9F9]"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="h-9.5 rounded-lg bg-[#F8285A] px-4 text-[12.5px] font-semibold text-white hover:bg-[#e11d48]"
                            >
                                Confirm Suspension
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}
