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
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Edit2, Plus, Search, ShieldCheck, Trash2, UserCheck } from 'lucide-react';

interface PermissionItem {
    id: number;
    name: string;
}

interface RoleItem {
    id: number;
    name: string;
    permissions: PermissionItem[];
}

interface StaffUserItem {
    id: number;
    name: string;
    email: string;
    roles: { id: number; name: string }[];
}

interface RolesIndexProps {
    roles: RoleItem[];
    permissions: PermissionItem[];
    staffUsers: {
        data: StaffUserItem[];
        current_page: number;
        last_page: number;
        per_page?: number;
        from?: number;
        to?: number;
        total: number;
        links: any[];
    };
    filters: {
        search?: string;
        role?: string;
        per_page?: string;
    };
}

const PROTECTED_ROLES = ['super_admin', 'regular_member', 'verified_member'];

const ALL = '__all__';

const fieldClass =
    'h-10 w-full rounded-md border !border-[#DBDFE9] !bg-[#FCFCFC] px-3 text-[13px] font-normal !text-[#071437] !shadow-none outline-none transition-all duration-200 placeholder:!text-[#99A1B7] hover:!border-[#C4CADA] focus:!border-[#1B84FF] focus:!bg-white focus:!ring-[3px] focus:!ring-[#1B84FF]/10 dark:!bg-[#FCFCFC] dark:!text-[#071437]';

const selectTriggerClass =
    '!h-10 w-full cursor-pointer rounded-md !border-[#DBDFE9] !bg-[#FCFCFC] px-3 text-[13px] font-normal !text-[#071437] !shadow-none transition-all duration-200 hover:!border-[#C4CADA] hover:!bg-[#FCFCFC] focus-visible:!border-[#1B84FF] focus-visible:!bg-white focus-visible:!ring-[3px] focus-visible:!ring-[#1B84FF]/10 dark:!bg-[#FCFCFC] dark:hover:!bg-[#FCFCFC]';

const selectMenuClass =
    'z-[60] rounded-xl !border-[#F1F1F4] !bg-white p-1 !text-[#071437] shadow-[0_12px_32px_-8px_rgba(7,20,55,0.16)] dark:!bg-white dark:!text-[#071437]';

const selectItemClass =
    'cursor-pointer rounded-lg py-2 pr-8 pl-2.5 text-[13px] text-[#071437] focus:!bg-[#F1F6FF] focus:!text-[#1B84FF] dark:text-[#071437]';

export default function RolesIndex({ roles, permissions = [], staffUsers, filters }: RolesIndexProps) {
    const [searchQuery, setSearchQuery] = useState(filters?.search || '');
    const [selectedRole, setSelectedRole] = useState(filters?.role || '');
    const [perPage, setPerPage] = useState(filters?.per_page || String(staffUsers.per_page || 20));
    const [selectedUser, setSelectedUser] = useState<StaffUserItem | null>(null);
    const [userRoles, setUserRoles] = useState<string[]>([]);
    const [submitting, setSubmitting] = useState(false);

    const [roleModalOpen, setRoleModalOpen] = useState(false);
    const [editingRole, setEditingRole] = useState<RoleItem | null>(null);
    const [roleName, setRoleName] = useState('');
    const [rolePermissions, setRolePermissions] = useState<string[]>([]);
    const [permSearch, setPermSearch] = useState('');
    const [roleSaving, setRoleSaving] = useState(false);
    const [roleNameError, setRoleNameError] = useState('');

    const staffRoles = roles.filter((r) => !['regular_member', 'verified_member'].includes(r.name));

    const openCreateRole = () => {
        setEditingRole(null);
        setRoleName('');
        setRolePermissions([]);
        setPermSearch('');
        setRoleNameError('');
        setRoleModalOpen(true);
    };

    const openEditRole = (role: RoleItem) => {
        setEditingRole(role);
        setRoleName(role.name.replace(/_/g, ' '));
        setRolePermissions(role.permissions.map((p) => p.name));
        setPermSearch('');
        setRoleNameError('');
        setRoleModalOpen(true);
    };

    const toggleRolePermission = (permName: string) => {
        setRolePermissions((prev) =>
            prev.includes(permName) ? prev.filter((p) => p !== permName) : [...prev, permName],
        );
    };

    const handleRoleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!roleName.trim() || roleSaving) return;

        const payload = {
            name: roleName.trim(),
            permissions: rolePermissions,
        };

        const options = {
            preserveScroll: true,
            onStart: () => {
                setRoleSaving(true);
                setRoleNameError('');
            },
            onFinish: () => setRoleSaving(false),
            onSuccess: () => setRoleModalOpen(false),
            onError: (errors: Record<string, string>) => {
                if (errors.name) setRoleNameError(errors.name);
            },
        };

        if (editingRole) {
            router.put(`/admin/roles/${editingRole.id}`, payload, options);
        } else {
            router.post('/admin/roles', payload, options);
        }
    };

    const handleDeleteRole = (role: RoleItem) => {
        if (!confirm(`Delete role "${role.name.replace(/_/g, ' ')}"?`)) return;
        router.delete(`/admin/roles/${role.id}`, { preserveScroll: true });
    };

    const filteredPermissions = permissions.filter((p) =>
        p.name.toLowerCase().includes(permSearch.trim().toLowerCase()),
    );

    const applyFilter = (key: string, val: string) => {
        const query = {
            search: searchQuery,
            role: selectedRole,
            per_page: perPage,
            [key]: val,
        };
        router.get('/admin/roles', query, { preserveState: true, replace: true });
    };

    const openAssign = (u: StaffUserItem) => {
        setSelectedUser(u);
        setUserRoles(u.roles.map((r) => r.name));
    };

    const handleAssignSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUser || userRoles.length === 0 || submitting) return;

        router.post(
            `/admin/roles/assign/${selectedUser.id}`,
            {
                roles: userRoles,
            },
            {
                preserveScroll: true,
                onStart: () => setSubmitting(true),
                onFinish: () => setSubmitting(false),
                onSuccess: () => setSelectedUser(null),
            },
        );
    };

    const toggleRole = (roleName: string) => {
        if (userRoles.includes(roleName)) {
            setUserRoles(userRoles.filter((r) => r !== roleName));
        } else {
            setUserRoles([...userRoles, roleName]);
        }
    };

    return (
        <AdminLayout
            title="User Roles & Access Control"
            breadcrumbs={[{ title: 'Roles & Permissions' }]}
        >
            <Head title="Roles & Access Control - INTAKE 97 Admin" />

            <div className="space-y-6">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-[20px] font-bold tracking-tight text-[#071437]">
                            Roles & Action-Level Permission Management
                        </h1>
                        <p className="mt-1 text-[13px] text-[#78829D]">
                            Spatie Role-Based Access Control (RBAC) assigning operational privileges across admin modules.
                        </p>
                    </div>
                    <Button
                        type="button"
                        onClick={openCreateRole}
                        className="h-9 cursor-pointer rounded-lg bg-[#1B84FF] px-4 text-[13px] font-semibold text-white hover:bg-[#1B84FF]/90"
                    >
                        <Plus className="mr-1.5 size-4" /> Create Role
                    </Button>
                </div>

                {/* Filter Toolbar */}
                <div className="rounded-xl border border-[#F1F1F4] bg-white p-4 shadow-[0_3px_4px_0_rgba(0,0,0,0.03)]">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                applyFilter('search', searchQuery);
                            }}
                            className="relative sm:col-span-2"
                        >
                            <Search className="absolute top-3 left-3 size-4 text-[#99A1B7]" />
                            <Input
                                placeholder="Search by staff name or email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={`${fieldClass} pl-9`}
                            />
                        </form>
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
                                {staffRoles.map((r) => (
                                    <SelectItem key={r.id} value={r.name} className={`${selectItemClass} uppercase`}>
                                        {r.name.replace(/_/g, ' ')}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="overflow-hidden rounded-xl border border-[#F1F1F4] bg-white shadow-[0_3px_4px_0_rgba(0,0,0,0.03)]">
                    <div className="flex items-center gap-2.5 border-b border-[#F1F1F4] px-6 py-4">
                        <span className="flex size-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                            <UserCheck className="size-4" />
                        </span>
                        <h2 className="text-[15px] font-bold text-[#071437]">
                            Administrative Staff & Role Assignments
                        </h2>
                    </div>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-[#FCFCFC]">
                                <TableRow className="border-[#F1F1F4] hover:bg-transparent">
                                    <TableHead className="w-14 px-5 py-3.5 text-[11.5px] font-semibold tracking-wide text-[#78829D] uppercase">
                                        SL
                                    </TableHead>
                                    <TableHead className="px-5 py-3.5 text-[11.5px] font-semibold tracking-wide text-[#78829D] uppercase">
                                        User Name & Email
                                    </TableHead>
                                    <TableHead className="px-4 py-3.5 text-[11.5px] font-semibold tracking-wide text-[#78829D] uppercase">
                                        Assigned Roles
                                    </TableHead>
                                    <TableHead className="px-5 py-3.5 text-right text-[11.5px] font-semibold tracking-wide text-[#78829D] uppercase">
                                        Action
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {staffUsers.data.length === 0 ? (
                                    <TableRow className="border-[#F1F1F4] hover:bg-transparent">
                                        <TableCell colSpan={4} className="h-32 text-center text-[13px] text-[#78829D]">
                                            No administrative staff found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    staffUsers.data.map((u, idx) => (
                                        <TableRow
                                            key={u.id}
                                            className="border-[#F1F1F4] transition-colors hover:bg-[#FCFCFC]"
                                        >
                                            <TableCell className="px-5 py-3.5 text-[12.5px] font-medium text-[#78829D] tabular-nums">
                                                {(staffUsers.from || 1) + idx}
                                            </TableCell>
                                            <TableCell className="px-5 py-3.5">
                                                <div className="text-[13px] font-semibold text-[#071437]">
                                                    {u.name}
                                                </div>
                                                <div className="text-[11.5px] text-[#78829D]">
                                                    {u.email}
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-4 py-3.5">
                                                <div className="flex flex-wrap gap-1.5">
                                                    {u.roles.map((r) => (
                                                        <span
                                                            key={r.id}
                                                            className="inline-flex items-center rounded-md border border-[#DCEBFF] bg-[#F1F6FF] px-2 py-0.5 font-mono text-[11px] font-semibold text-[#1B84FF] uppercase"
                                                        >
                                                            {r.name.replace(/_/g, ' ')}
                                                        </span>
                                                    ))}
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-5 py-3.5 text-right">
                                                <Button
                                                    variant="outline"
                                                    onClick={() => openAssign(u)}
                                                    className="h-8 rounded-lg border-[#DBDFE9] bg-white px-3 text-[12px] font-semibold text-[#071437] hover:border-[#1B84FF] hover:bg-[#F1F6FF] hover:text-[#1B84FF]"
                                                >
                                                    <Edit2 className="mr-1.5 size-3.5" /> Edit Roles
                                                </Button>
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
                                Showing <strong className="font-semibold text-[#071437]">{staffUsers.from || 0}</strong>–
                                <strong className="font-semibold text-[#071437]">{staffUsers.to || 0}</strong> of{' '}
                                <strong className="font-semibold text-[#071437]">{staffUsers.total}</strong> · Page {staffUsers.current_page} of {staffUsers.last_page}
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
                            {staffUsers.links.map((link, idx) => (
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

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {roles.map((r) => {
                        const isProtected = PROTECTED_ROLES.includes(r.name);
                        return (
                            <div
                                key={r.id}
                                className="space-y-3 rounded-xl border border-[#F1F1F4] bg-white p-5 shadow-[0_3px_4px_0_rgba(0,0,0,0.03)]"
                            >
                                <div className="flex items-center justify-between gap-2">
                                    <span className="flex items-center gap-2 text-[13px] font-bold text-[#071437] uppercase">
                                        <ShieldCheck className="size-4 shrink-0 text-[#1B84FF]" />
                                        {r.name.replace(/_/g, ' ')}
                                    </span>
                                    <div className="flex items-center gap-1.5">
                                        <span className="inline-flex items-center rounded-full border border-[#E5E7EB] bg-[#FCFCFC] px-2.5 py-0.5 text-[11px] font-semibold text-[#4B5675]">
                                            {r.permissions.length} perms
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => openEditRole(r)}
                                            title="Edit role & permissions"
                                            className="flex size-7 cursor-pointer items-center justify-center rounded-lg border border-[#E5E7EB] bg-white text-[#4B5675] transition-colors hover:border-[#1B84FF] hover:bg-[#F1F6FF] hover:text-[#1B84FF]"
                                        >
                                            <Edit2 className="size-3.5" />
                                        </button>
                                        {!isProtected && (
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteRole(r)}
                                                title="Delete role"
                                                className="flex size-7 cursor-pointer items-center justify-center rounded-lg border border-[#E5E7EB] bg-white text-[#4B5675] transition-colors hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600"
                                            >
                                                <Trash2 className="size-3.5" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div className="flex max-h-24 flex-wrap gap-1.5 overflow-y-auto pt-1">
                                    {r.permissions.length === 0 ? (
                                        <span className="text-[11.5px] text-[#99A1B7]">
                                            No permissions assigned
                                        </span>
                                    ) : (
                                        <>
                                            {r.permissions.slice(0, 8).map((p) => (
                                                <span
                                                    key={p.id}
                                                    className="rounded-md border border-[#F1F1F4] bg-[#FCFCFC] px-2 py-0.5 font-mono text-[10.5px] text-[#4B5675]"
                                                >
                                                    {p.name}
                                                </span>
                                            ))}
                                            {r.permissions.length > 8 && (
                                                <span className="self-center pl-1 text-[11px] text-[#99A1B7]">
                                                    +{r.permissions.length - 8} more
                                                </span>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <Dialog open={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
                <DialogContent className="flex max-h-[85vh] flex-col gap-0 overflow-hidden rounded-2xl border-[#F1F1F4] !bg-white p-0 !text-[#071437] shadow-[0_20px_50px_-12px_rgba(7,20,55,0.18)] sm:max-w-lg">
                    <DialogHeader className="shrink-0 border-b border-[#F1F1F4] bg-[#FCFCFC] px-6 py-5">
                        <div className="flex items-start gap-3 pr-6">
                            <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#F1F6FF] text-[#1B84FF]">
                                <ShieldCheck className="size-4.5" />
                            </span>
                            <div className="min-w-0">
                                <DialogTitle className="text-[16px] font-bold text-[#071437]">
                                    Assign Roles
                                </DialogTitle>
                                {selectedUser && (
                                    <p className="mt-0.5 truncate text-[12.5px] text-[#78829D]">
                                        <span className="font-semibold text-[#4B5675]">{selectedUser.name}</span>
                                        {' · '}
                                        {selectedUser.email}
                                    </p>
                                )}
                            </div>
                        </div>
                    </DialogHeader>
                    <form onSubmit={handleAssignSubmit} className="flex min-h-0 flex-1 flex-col">
                        <div className="flex shrink-0 items-center justify-between px-6 pt-4 pb-3 text-[12px] text-[#78829D]">
                            <span>Select one or more roles for this staff member</span>
                            <span className="font-semibold text-[#1B84FF]">
                                {userRoles.length} selected
                            </span>
                        </div>

                        <div className="min-h-0 flex-1 space-y-2 overflow-y-auto overscroll-contain px-6 pb-4">
                            {roles.map((r) => {
                                const checked = userRoles.includes(r.name);
                                return (
                                    <label
                                        key={r.id}
                                        className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl border p-3.5 transition-all ${
                                            checked
                                                ? 'border-[#1B84FF] bg-[#F1F6FF]/60 shadow-[0_1px_3px_0_rgba(27,132,255,0.08)]'
                                                : 'border-[#F1F1F4] bg-[#FCFCFC] hover:border-[#DBDFE9] hover:bg-white'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Checkbox
                                                checked={checked}
                                                onCheckedChange={() => toggleRole(r.name)}
                                                className="size-4.5 cursor-pointer rounded-[5px] !border-[#DBDFE9] !bg-white data-[state=checked]:!border-[#1B84FF] data-[state=checked]:!bg-[#1B84FF] data-[state=checked]:!text-white focus-visible:!ring-[#1B84FF]/20"
                                            />
                                            <span className="text-[13px] font-semibold text-[#071437] uppercase">
                                                {r.name.replace(/_/g, ' ')}
                                            </span>
                                        </div>
                                        <span
                                            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${
                                                checked
                                                    ? 'border-[#DCEBFF] bg-white text-[#1B84FF]'
                                                    : 'border-[#E5E7EB] bg-white text-[#78829D]'
                                            }`}
                                        >
                                            {r.permissions.length} perms
                                        </span>
                                    </label>
                                );
                            })}
                        </div>

                        {userRoles.length === 0 && (
                            <p className="shrink-0 px-6 pb-3 text-[12px] font-medium text-rose-600">
                                Please select at least one role before saving.
                            </p>
                        )}

                        <DialogFooter className="shrink-0 gap-2 border-t border-[#F1F1F4] bg-[#FCFCFC] px-6 py-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setSelectedUser(null)}
                                disabled={submitting}
                                className="h-9 cursor-pointer rounded-lg !border-[#DBDFE9] !bg-white px-4 text-[13px] font-semibold !text-[#4B5675] hover:!border-[#C4CADA] hover:!bg-[#F9FAFB] hover:!text-[#071437]"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={submitting || userRoles.length === 0}
                                className="h-9 cursor-pointer rounded-lg bg-[#1B84FF] px-4 text-[13px] font-semibold text-white hover:bg-[#1B84FF]/90 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {submitting ? 'Saving...' : 'Save Role Assignments'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Create / Edit Role Modal */}
            <Dialog open={roleModalOpen} onOpenChange={(open) => !open && setRoleModalOpen(false)}>
                <DialogContent className="flex max-h-[85vh] flex-col gap-0 overflow-hidden rounded-2xl border-[#F1F1F4] !bg-white p-0 !text-[#071437] shadow-[0_20px_50px_-12px_rgba(7,20,55,0.18)] sm:max-w-lg">
                    <DialogHeader className="shrink-0 border-b border-[#F1F1F4] bg-[#FCFCFC] px-6 py-5">
                        <div className="flex items-start gap-3 pr-6">
                            <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#F1F6FF] text-[#1B84FF]">
                                <ShieldCheck className="size-4.5" />
                            </span>
                            <div className="min-w-0">
                                <DialogTitle className="text-[16px] font-bold text-[#071437]">
                                    {editingRole ? 'Edit Role & Permissions' : 'Create New Role'}
                                </DialogTitle>
                                <p className="mt-0.5 text-[12.5px] text-[#78829D]">
                                    {editingRole
                                        ? `Update permissions for ${editingRole.name.replace(/_/g, ' ')}.`
                                        : 'Define a new role name and select the permissions it grants.'}
                                </p>
                            </div>
                        </div>
                    </DialogHeader>
                    <form onSubmit={handleRoleSubmit} className="flex min-h-0 flex-1 flex-col">
                        <div className="shrink-0 space-y-3 px-6 pt-5 pb-3">
                            <div>
                                <label className="mb-1.5 block text-[12.5px] font-semibold text-[#071437]">
                                    Role Name
                                </label>
                                <Input
                                    value={roleName}
                                    onChange={(e) => {
                                        setRoleName(e.target.value);
                                        setRoleNameError('');
                                    }}
                                    disabled={!!editingRole && PROTECTED_ROLES.includes(editingRole.name)}
                                    placeholder="e.g. Editorial Lead"
                                    className={fieldClass}
                                />
                                {roleNameError && (
                                    <p className="mt-1 text-[12px] font-medium text-rose-600">{roleNameError}</p>
                                )}
                                {!!editingRole && PROTECTED_ROLES.includes(editingRole.name) && (
                                    <p className="mt-1 text-[11.5px] text-[#78829D]">
                                        System default role names cannot be renamed.
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center justify-between gap-2 pt-1">
                                <span className="text-[12.5px] font-semibold text-[#071437]">
                                    Permissions ({rolePermissions.length}/{permissions.length})
                                </span>
                                <div className="flex items-center gap-2 text-[12px]">
                                    <button
                                        type="button"
                                        onClick={() => setRolePermissions(permissions.map((p) => p.name))}
                                        className="cursor-pointer font-semibold text-[#1B84FF] hover:underline"
                                    >
                                        Select All
                                    </button>
                                    <span className="text-[#DBDFE9]">|</span>
                                    <button
                                        type="button"
                                        onClick={() => setRolePermissions([])}
                                        className="cursor-pointer font-semibold text-[#78829D] hover:text-[#071437]"
                                    >
                                        Clear
                                    </button>
                                </div>
                            </div>

                            <div className="relative">
                                <Search className="absolute top-3 left-3 size-4 text-[#99A1B7]" />
                                <Input
                                    value={permSearch}
                                    onChange={(e) => setPermSearch(e.target.value)}
                                    placeholder="Filter permissions..."
                                    className={`${fieldClass} pl-9`}
                                />
                            </div>
                        </div>

                        <div className="min-h-0 flex-1 space-y-2 overflow-y-auto overscroll-contain px-6 pb-4">
                            {filteredPermissions.length === 0 ? (
                                <p className="py-6 text-center text-[12.5px] text-[#78829D]">
                                    No matching permissions found.
                                </p>
                            ) : (
                                filteredPermissions.map((p) => {
                                    const checked = rolePermissions.includes(p.name);
                                    return (
                                        <label
                                            key={p.id}
                                            className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-all ${
                                                checked
                                                    ? 'border-[#1B84FF] bg-[#F1F6FF]/60'
                                                    : 'border-[#F1F1F4] bg-[#FCFCFC] hover:border-[#DBDFE9] hover:bg-white'
                                            }`}
                                        >
                                            <Checkbox
                                                checked={checked}
                                                onCheckedChange={() => toggleRolePermission(p.name)}
                                                className="size-4.5 cursor-pointer rounded-[5px] !border-[#DBDFE9] !bg-white data-[state=checked]:!border-[#1B84FF] data-[state=checked]:!bg-[#1B84FF] data-[state=checked]:!text-white focus-visible:!ring-[#1B84FF]/20"
                                            />
                                            <span className="font-mono text-[12.5px] font-medium text-[#071437]">
                                                {p.name}
                                            </span>
                                        </label>
                                    );
                                })
                            )}
                        </div>

                        <DialogFooter className="shrink-0 gap-2 border-t border-[#F1F1F4] bg-[#FCFCFC] px-6 py-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setRoleModalOpen(false)}
                                disabled={roleSaving}
                                className="h-9 cursor-pointer rounded-lg !border-[#DBDFE9] !bg-white px-4 text-[13px] font-semibold !text-[#4B5675] hover:!border-[#C4CADA] hover:!bg-[#F9FAFB] hover:!text-[#071437]"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={roleSaving || !roleName.trim()}
                                className="h-9 cursor-pointer rounded-lg bg-[#1B84FF] px-4 text-[13px] font-semibold text-white hover:bg-[#1B84FF]/90 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {roleSaving
                                    ? 'Saving...'
                                    : editingRole
                                      ? 'Save Changes'
                                      : 'Create Role'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}
