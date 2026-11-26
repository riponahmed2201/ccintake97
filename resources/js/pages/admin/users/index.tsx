import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
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
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Ban, CheckCircle2, MoreHorizontal, Plus, Search, ShieldCheck, UserCog, UserPlus } from 'lucide-react';

interface RoleOption {
    id: number;
    name: string;
}

interface UserItem {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    account_status: string;
    created_at: string;
    roles: RoleOption[];
}

interface UsersIndexProps {
    users: {
        data: UserItem[];
        current_page: number;
        last_page: number;
        per_page?: number;
        from?: number;
        to?: number;
        total: number;
        links: any[];
    };
    roles: RoleOption[];
    filters: {
        search?: string;
        scope?: string;
        role?: string;
        status?: string;
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

const statusBadgeClass = (status: string) => {
    if (status === 'active') return 'border-emerald-200 bg-emerald-50 text-emerald-700';
    if (status === 'suspended') return 'border-rose-200 bg-rose-50 text-rose-700';
    return 'border-amber-200 bg-amber-50 text-amber-700';
};

export default function UsersIndex({ users, roles, filters }: UsersIndexProps) {
    const [searchQuery, setSearchQuery] = useState(filters?.search || '');
    const [scope, setScope] = useState(filters?.scope || 'all');
    const [selectedRole, setSelectedRole] = useState(filters?.role || '');
    const [selectedStatus, setSelectedStatus] = useState(filters?.status || '');
    const [perPage, setPerPage] = useState(filters?.per_page || String(users.per_page || 20));

    // Assign Roles modal state
    const [assignUser, setAssignUser] = useState<UserItem | null>(null);
    const [assignRolesList, setAssignRolesList] = useState<string[]>([]);
    const [assignSubmitting, setAssignSubmitting] = useState(false);

    // Create User modal state
    const [createOpen, setCreateOpen] = useState(false);
    const [newName, setNewName] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newPhone, setNewPhone] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newRoles, setNewRoles] = useState<string[]>([]);
    const [createErrors, setCreateErrors] = useState<Record<string, string>>({});
    const [creating, setCreating] = useState(false);

    const applyFilter = (key: string, val: string) => {
        router.get(
            '/admin/users',
            {
                search: searchQuery,
                scope,
                role: selectedRole,
                status: selectedStatus,
                per_page: perPage,
                [key]: val,
            },
            { preserveState: true, replace: true },
        );
    };

    const openAssignModal = (u: UserItem) => {
        setAssignUser(u);
        setAssignRolesList(u.roles.map((r) => r.name));
    };

    const toggleAssignRole = (roleName: string) => {
        setAssignRolesList((prev) =>
            prev.includes(roleName) ? prev.filter((r) => r !== roleName) : [...prev, roleName],
        );
    };

    const handleAssignSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!assignUser || assignRolesList.length === 0 || assignSubmitting) return;

        router.post(
            `/admin/users/${assignUser.id}/roles`,
            { roles: assignRolesList },
            {
                preserveScroll: true,
                onStart: () => setAssignSubmitting(true),
                onFinish: () => setAssignSubmitting(false),
                onSuccess: () => setAssignUser(null),
            },
        );
    };

    const openCreateModal = () => {
        setNewName('');
        setNewEmail('');
        setNewPhone('');
        setNewPassword('');
        setNewRoles([]);
        setCreateErrors({});
        setCreateOpen(true);
    };

    const toggleNewRole = (roleName: string) => {
        setNewRoles((prev) =>
            prev.includes(roleName) ? prev.filter((r) => r !== roleName) : [...prev, roleName],
        );
    };

    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (creating) return;

        router.post(
            '/admin/users',
            {
                name: newName,
                email: newEmail,
                phone: newPhone,
                password: newPassword,
                roles: newRoles,
            },
            {
                preserveScroll: true,
                onStart: () => {
                    setCreating(true);
                    setCreateErrors({});
                },
                onFinish: () => setCreating(false),
                onSuccess: () => setCreateOpen(false),
                onError: (errors) => setCreateErrors(errors),
            },
        );
    };

    const handleToggleStatus = (u: UserItem) => {
        const actionLabel = u.account_status === 'active' ? 'suspend' : 'activate';
        if (!confirm(`Are you sure you want to ${actionLabel} ${u.name}?`)) return;
        router.post(`/admin/users/${u.id}/toggle-status`, {}, { preserveScroll: true });
    };

    return (
        <AdminLayout title="Users & Role Assignments" breadcrumbs={[{ title: 'Users' }]}>
            <Head title="Users - CCINTAKE 97 Admin" />

            <div className="space-y-6">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-[20px] font-bold tracking-tight text-[#071437]">
                            User Management & Role Assignments
                        </h1>
                        <p className="mt-1 text-[13px] text-[#78829D]">
                            Manage user accounts, assign RBAC roles, and control portal access across the platform.
                        </p>
                    </div>
                    <Button
                        type="button"
                        onClick={openCreateModal}
                        className="h-9 cursor-pointer rounded-lg bg-[#1B84FF] px-4 text-[13px] font-semibold text-white hover:bg-[#1B84FF]/90"
                    >
                        <Plus className="mr-1.5 size-4" /> Create User
                    </Button>
                </div>

                {/* Filter Toolbar */}
                <div className="rounded-xl border border-[#F1F1F4] bg-white p-4 shadow-[0_3px_4px_0_rgba(0,0,0,0.03)]">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                applyFilter('search', searchQuery);
                            }}
                            className="relative lg:col-span-2"
                        >
                            <Search className="absolute top-3 left-3 size-4 text-[#99A1B7]" />
                            <Input
                                placeholder="Search by name, email or phone..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={`${fieldClass} pl-9`}
                            />
                        </form>
                        <Select
                            value={scope}
                            onValueChange={(val) => {
                                setScope(val);
                                applyFilter('scope', val);
                            }}
                        >
                            <SelectTrigger className={selectTriggerClass}>
                                <SelectValue placeholder="All Users" />
                            </SelectTrigger>
                            <SelectContent className={selectMenuClass}>
                                <SelectItem value="all" className={selectItemClass}>All Users</SelectItem>
                                <SelectItem value="staff" className={selectItemClass}>Admin & Staff</SelectItem>
                                <SelectItem value="members" className={selectItemClass}>Members Only</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select
                            value={selectedRole || ALL}
                            onValueChange={(val) => {
                                const next = val === ALL ? '' : val;
                                setSelectedRole(next);
                                applyFilter('role', next);
                            }}
                        >
                            <SelectTrigger className={selectTriggerClass}>
                                <SelectValue placeholder="All Roles" />
                            </SelectTrigger>
                            <SelectContent className={selectMenuClass}>
                                <SelectItem value={ALL} className={selectItemClass}>All Roles</SelectItem>
                                {roles.map((r) => (
                                    <SelectItem key={r.id} value={r.name} className={`${selectItemClass} uppercase`}>
                                        {r.name.replace(/_/g, ' ')}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select
                            value={selectedStatus || ALL}
                            onValueChange={(val) => {
                                const next = val === ALL ? '' : val;
                                setSelectedStatus(next);
                                applyFilter('status', next);
                            }}
                        >
                            <SelectTrigger className={selectTriggerClass}>
                                <SelectValue placeholder="All Statuses" />
                            </SelectTrigger>
                            <SelectContent className={selectMenuClass}>
                                <SelectItem value={ALL} className={selectItemClass}>All Statuses</SelectItem>
                                <SelectItem value="active" className={selectItemClass}>Active</SelectItem>
                                <SelectItem value="suspended" className={selectItemClass}>Suspended</SelectItem>
                                <SelectItem value="pending" className={selectItemClass}>Pending</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Users Table */}
                <div className="overflow-hidden rounded-xl border border-[#F1F1F4] bg-white shadow-[0_3px_4px_0_rgba(0,0,0,0.03)]">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-[#FCFCFC]">
                                <TableRow className="border-[#F1F1F4] hover:bg-transparent">
                                    <TableHead className="w-14 px-5 py-3.5 text-[11.5px] font-semibold tracking-wide text-[#78829D] uppercase">
                                        SL
                                    </TableHead>
                                    <TableHead className="px-5 py-3.5 text-[11.5px] font-semibold tracking-wide text-[#78829D] uppercase">
                                        User
                                    </TableHead>
                                    <TableHead className="px-4 py-3.5 text-[11.5px] font-semibold tracking-wide text-[#78829D] uppercase">
                                        Role
                                    </TableHead>
                                    <TableHead className="px-4 py-3.5 text-[11.5px] font-semibold tracking-wide text-[#78829D] uppercase">
                                        Status
                                    </TableHead>
                                    <TableHead className="px-4 py-3.5 text-[11.5px] font-semibold tracking-wide text-[#78829D] uppercase">
                                        Joined
                                    </TableHead>
                                    <TableHead className="px-5 py-3.5 text-right text-[11.5px] font-semibold tracking-wide text-[#78829D] uppercase">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.data.length === 0 ? (
                                    <TableRow className="border-[#F1F1F4] hover:bg-transparent">
                                        <TableCell colSpan={6} className="h-32 text-center text-[13px] text-[#78829D]">
                                            No users found matching your filters.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    users.data.map((u, idx) => (
                                        <TableRow
                                            key={u.id}
                                            className="border-[#F1F1F4] transition-colors hover:bg-[#FCFCFC]"
                                        >
                                            <TableCell className="px-5 py-3.5 text-[12.5px] font-medium text-[#78829D] tabular-nums">
                                                {(users.from || 1) + idx}
                                            </TableCell>
                                            <TableCell className="px-5 py-3.5">
                                                <div className="text-[13px] font-semibold text-[#071437]">
                                                    {u.name}
                                                </div>
                                                <div className="text-[11.5px] text-[#78829D]">
                                                    {u.email}
                                                    {u.phone ? ` · ${u.phone}` : ''}
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-4 py-3.5">
                                                <div className="flex flex-wrap gap-1.5">
                                                    {u.roles.length === 0 ? (
                                                        <span className="text-[12px] text-[#99A1B7]">No Role</span>
                                                    ) : (
                                                        u.roles.map((r) => (
                                                            <span
                                                                key={r.id}
                                                                className="inline-flex items-center rounded-md border border-[#DCEBFF] bg-[#F1F6FF] px-2 py-0.5 font-mono text-[11px] font-semibold text-[#1B84FF] uppercase"
                                                            >
                                                                {r.name.replace(/_/g, ' ')}
                                                            </span>
                                                        ))
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-4 py-3.5">
                                                <span
                                                    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold capitalize ${statusBadgeClass(u.account_status)}`}
                                                >
                                                    {u.account_status}
                                                </span>
                                            </TableCell>
                                            <TableCell className="px-4 py-3.5 text-[12.5px] text-[#78829D]">
                                                {new Date(u.created_at).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="px-5 py-3.5 text-right">
                                                <div className="flex justify-end">
                                                    <DropdownMenu modal={false}>
                                                        <DropdownMenuTrigger asChild>
                                                            <button
                                                                type="button"
                                                                className="inline-flex size-8 cursor-pointer items-center justify-center rounded-lg border border-transparent text-[#78829D] transition-colors hover:border-[#DBDFE9] hover:bg-[#F9F9F9] hover:text-[#071437]"
                                                                aria-label="User actions"
                                                            >
                                                                <MoreHorizontal className="size-4" />
                                                            </button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-48 rounded-xl border-[#F1F1F4] !bg-white p-1.5 !text-[#071437] shadow-[0_12px_32px_-8px_rgba(7,20,55,0.16)]">
                                                            <DropdownMenuItem
                                                                onSelect={() => openAssignModal(u)}
                                                                className="cursor-pointer rounded-lg px-2.5 py-2 text-[13px] font-medium text-[#071437] focus:!bg-[#F1F6FF] focus:!text-[#1B84FF]"
                                                            >
                                                                <UserCog className="size-4 text-[#78829D]" />
                                                                Assign Roles
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator className="my-1 bg-[#F1F1F4]" />
                                                            <DropdownMenuItem
                                                                onSelect={() => handleToggleStatus(u)}
                                                                className={`cursor-pointer rounded-lg px-2.5 py-2 text-[13px] font-medium ${
                                                                    u.account_status === 'active'
                                                                        ? 'text-[#F8285A] focus:!bg-[#FFEEF3] focus:!text-[#F8285A]'
                                                                        : 'text-[#17C653] focus:!bg-[#EAFFF1] focus:!text-[#17C653]'
                                                                }`}
                                                            >
                                                                {u.account_status === 'active' ? (
                                                                    <>
                                                                        <Ban className="size-4 text-[#F8285A]" />
                                                                        Suspend User
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <CheckCircle2 className="size-4 text-[#17C653]" />
                                                                        Activate User
                                                                    </>
                                                                )}
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
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
                                Showing <strong className="font-semibold text-[#071437]">{users.from || 0}</strong>–
                                <strong className="font-semibold text-[#071437]">{users.to || 0}</strong> of{' '}
                                <strong className="font-semibold text-[#071437]">{users.total}</strong> · Page {users.current_page} of {users.last_page}
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
                            {users.links.map((link, idx) => (
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

            {/* Assign Roles Modal */}
            <Dialog open={!!assignUser} onOpenChange={(open) => !open && setAssignUser(null)}>
                <DialogContent className="flex max-h-[85vh] flex-col gap-0 overflow-hidden rounded-2xl border-[#F1F1F4] !bg-white p-0 !text-[#071437] shadow-[0_20px_50px_-12px_rgba(7,20,55,0.18)] sm:max-w-2xl">
                    <DialogHeader className="shrink-0 border-b border-[#F1F1F4] bg-[#FCFCFC] px-6 py-5">
                        <div className="flex items-start gap-3 pr-6">
                            <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#F1F6FF] text-[#1B84FF]">
                                <ShieldCheck className="size-4.5" />
                            </span>
                            <div className="min-w-0">
                                <DialogTitle className="text-[16px] font-bold text-[#071437]">
                                    Assign Roles
                                </DialogTitle>
                                {assignUser && (
                                    <p className="mt-0.5 truncate text-[12.5px] text-[#78829D]">
                                        <span className="font-semibold text-[#4B5675]">{assignUser.name}</span>
                                        {' · '}
                                        {assignUser.email}
                                    </p>
                                )}
                            </div>
                        </div>
                    </DialogHeader>
                    <form onSubmit={handleAssignSubmit} className="flex min-h-0 flex-1 flex-col">
                        <div className="flex shrink-0 items-center justify-between px-6 pt-4 pb-3 text-[12px] text-[#78829D]">
                            <span>Select one or more roles for this user</span>
                            <span className="font-semibold text-[#1B84FF]">{assignRolesList.length} selected</span>
                        </div>
                        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 pb-4">
                            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                                {roles.map((r) => {
                                    const checked = assignRolesList.includes(r.name);
                                    return (
                                        <label
                                            key={r.id}
                                            className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3.5 transition-all ${
                                                checked
                                                    ? 'border-[#1B84FF] bg-[#F1F6FF]/60 shadow-[0_1px_3px_0_rgba(27,132,255,0.08)]'
                                                    : 'border-[#F1F1F4] bg-[#FCFCFC] hover:border-[#DBDFE9] hover:bg-white'
                                            }`}
                                        >
                                            <Checkbox
                                                checked={checked}
                                                onCheckedChange={() => toggleAssignRole(r.name)}
                                                className="size-4.5 shrink-0 cursor-pointer rounded-[5px] !border-[#DBDFE9] !bg-white data-[state=checked]:!border-[#1B84FF] data-[state=checked]:!bg-[#1B84FF] data-[state=checked]:!text-white focus-visible:!ring-[#1B84FF]/20"
                                            />
                                            <span className="text-[12.5px] font-semibold text-[#071437] uppercase">
                                                {r.name.replace(/_/g, ' ')}
                                            </span>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>
                        {assignRolesList.length === 0 && (
                            <p className="shrink-0 px-6 pb-3 text-[12px] font-medium text-rose-600">
                                Please select at least one role before saving.
                            </p>
                        )}
                        <DialogFooter className="shrink-0 gap-2 border-t border-[#F1F1F4] bg-[#FCFCFC] px-6 py-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setAssignUser(null)}
                                disabled={assignSubmitting}
                                className="h-9 cursor-pointer rounded-lg !border-[#DBDFE9] !bg-white px-4 text-[13px] font-semibold !text-[#4B5675] hover:!border-[#C4CADA] hover:!bg-[#F9FAFB] hover:!text-[#071437]"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={assignSubmitting || assignRolesList.length === 0}
                                className="h-9 cursor-pointer rounded-lg bg-[#1B84FF] px-4 text-[13px] font-semibold text-white hover:bg-[#1B84FF]/90 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {assignSubmitting ? 'Saving...' : 'Save Role Assignments'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Create User Modal */}
            <Dialog open={createOpen} onOpenChange={(open) => !open && setCreateOpen(false)}>
                <DialogContent className="flex max-h-[88vh] flex-col gap-0 overflow-hidden rounded-2xl border-[#F1F1F4] !bg-white p-0 !text-[#071437] shadow-[0_20px_50px_-12px_rgba(7,20,55,0.18)] sm:max-w-lg">
                    <DialogHeader className="shrink-0 border-b border-[#F1F1F4] bg-[#FCFCFC] px-6 py-5">
                        <div className="flex items-start gap-3 pr-6">
                            <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#F1F6FF] text-[#1B84FF]">
                                <UserPlus className="size-4.5" />
                            </span>
                            <div className="min-w-0">
                                <DialogTitle className="text-[16px] font-bold text-[#071437]">
                                    Create New User
                                </DialogTitle>
                                <p className="mt-0.5 text-[12.5px] text-[#78829D]">
                                    Add a new user account and assign their initial RBAC roles.
                                </p>
                            </div>
                        </div>
                    </DialogHeader>
                    <form onSubmit={handleCreateSubmit} className="flex min-h-0 flex-1 flex-col">
                        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain px-6 py-5">
                            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                                <div className="sm:col-span-2">
                                    <label className="mb-1.5 block text-[12.5px] font-semibold text-[#071437]">
                                        Full Name
                                    </label>
                                    <Input
                                        value={newName}
                                        onChange={(e) => setNewName(e.target.value)}
                                        placeholder="e.g. Asifur Rahman"
                                        className={fieldClass}
                                        required
                                    />
                                    {createErrors.name && (
                                        <p className="mt-1 text-[12px] text-rose-600">{createErrors.name}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-[12.5px] font-semibold text-[#071437]">
                                        Email Address
                                    </label>
                                    <Input
                                        type="email"
                                        value={newEmail}
                                        onChange={(e) => setNewEmail(e.target.value)}
                                        placeholder="name@intake97.com"
                                        className={fieldClass}
                                        required
                                    />
                                    {createErrors.email && (
                                        <p className="mt-1 text-[12px] text-rose-600">{createErrors.email}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-[12.5px] font-semibold text-[#071437]">
                                        Phone (Optional)
                                    </label>
                                    <Input
                                        value={newPhone}
                                        onChange={(e) => setNewPhone(e.target.value)}
                                        placeholder="+88017..."
                                        className={fieldClass}
                                    />
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="mb-1.5 block text-[12.5px] font-semibold text-[#071437]">
                                        Password
                                    </label>
                                    <Input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="Minimum 8 characters"
                                        className={fieldClass}
                                        required
                                    />
                                    {createErrors.password && (
                                        <p className="mt-1 text-[12px] text-rose-600">{createErrors.password}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <div className="mb-2 flex items-center justify-between text-[12.5px]">
                                    <span className="font-semibold text-[#071437]">Assign Roles</span>
                                    <span className="font-semibold text-[#1B84FF]">{newRoles.length} selected</span>
                                </div>
                                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                    {roles.map((r) => {
                                        const checked = newRoles.includes(r.name);
                                        return (
                                            <label
                                                key={r.id}
                                                className={`flex cursor-pointer items-center gap-2.5 rounded-xl border p-3 transition-all ${
                                                    checked
                                                        ? 'border-[#1B84FF] bg-[#F1F6FF]/60'
                                                        : 'border-[#F1F1F4] bg-[#FCFCFC] hover:border-[#DBDFE9]'
                                                }`}
                                            >
                                                <Checkbox
                                                    checked={checked}
                                                    onCheckedChange={() => toggleNewRole(r.name)}
                                                    className="size-4.5 cursor-pointer rounded-[5px] !border-[#DBDFE9] !bg-white data-[state=checked]:!border-[#1B84FF] data-[state=checked]:!bg-[#1B84FF] data-[state=checked]:!text-white"
                                                />
                                                <span className="text-[12px] font-semibold text-[#071437] uppercase">
                                                    {r.name.replace(/_/g, ' ')}
                                                </span>
                                            </label>
                                        );
                                    })}
                                </div>
                                {createErrors.roles && (
                                    <p className="mt-1.5 text-[12px] text-rose-600">{createErrors.roles}</p>
                                )}
                            </div>
                        </div>

                        <DialogFooter className="shrink-0 gap-2 border-t border-[#F1F1F4] bg-[#FCFCFC] px-6 py-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setCreateOpen(false)}
                                disabled={creating}
                                className="h-9 cursor-pointer rounded-lg !border-[#DBDFE9] !bg-white px-4 text-[13px] font-semibold !text-[#4B5675] hover:!border-[#C4CADA] hover:!bg-[#F9FAFB] hover:!text-[#071437]"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={creating || !newName.trim() || !newEmail.trim() || !newPassword || newRoles.length === 0}
                                className="h-9 cursor-pointer rounded-lg bg-[#1B84FF] px-4 text-[13px] font-semibold text-white hover:bg-[#1B84FF]/90 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {creating ? 'Creating...' : 'Create User'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}
