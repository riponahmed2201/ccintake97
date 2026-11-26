import React, { useMemo, useState } from 'react';
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
import { Edit2, Eye, MoreHorizontal, Plus, Search, ShieldCheck, Trash2 } from 'lucide-react';

interface PermissionItem {
    id: number;
    name: string;
}

interface RoleItem {
    id: number;
    name: string;
    users_count: number;
    permissions_count: number;
    permissions: PermissionItem[];
}

interface RolesIndexProps {
    roles: {
        data: RoleItem[];
        current_page: number;
        last_page: number;
        per_page?: number;
        from?: number;
        to?: number;
        total: number;
        links: any[];
    };
    permissions: PermissionItem[];
    filters: {
        search?: string;
        per_page?: string;
    };
}

const PROTECTED_ROLES = ['super_admin', 'regular_member', 'verified_member'];

const fieldClass =
    'h-10 w-full rounded-md border !border-[#DBDFE9] !bg-[#FCFCFC] px-3 text-[13px] font-normal !text-[#071437] !shadow-none outline-none transition-all duration-200 placeholder:!text-[#99A1B7] hover:!border-[#C4CADA] focus:!border-[#1B84FF] focus:!bg-white focus:!ring-[3px] focus:!ring-[#1B84FF]/10 dark:!bg-[#FCFCFC] dark:!text-[#071437]';

const selectMenuClass =
    'z-[60] rounded-xl !border-[#F1F1F4] !bg-white p-1 !text-[#071437] shadow-[0_12px_32px_-8px_rgba(7,20,55,0.16)] dark:!bg-white dark:!text-[#071437]';

const selectItemClass =
    'cursor-pointer rounded-lg py-2 pr-8 pl-2.5 text-[13px] text-[#071437] focus:!bg-[#F1F6FF] focus:!text-[#1B84FF] dark:text-[#071437]';

function groupPermissionsByModule(items: PermissionItem[]): [string, PermissionItem[]][] {
    const map = new Map<string, PermissionItem[]>();
    for (const perm of items) {
        const prefix = perm.name.includes('.') ? perm.name.split('.')[0] : 'general';
        if (!map.has(prefix)) map.set(prefix, []);
        map.get(prefix)!.push(perm);
    }
    return Array.from(map.entries());
}

export default function RolesIndex({ roles, permissions = [], filters }: RolesIndexProps) {
    const [searchQuery, setSearchQuery] = useState(filters?.search || '');
    const [perPage, setPerPage] = useState(filters?.per_page || String(roles.per_page || 20));

    // View Role Modal
    const [viewingRole, setViewingRole] = useState<RoleItem | null>(null);

    // Create / Edit Role Modal
    const [roleModalOpen, setRoleModalOpen] = useState(false);
    const [editingRole, setEditingRole] = useState<RoleItem | null>(null);
    const [roleName, setRoleName] = useState('');
    const [rolePermissions, setRolePermissions] = useState<string[]>([]);
    const [permSearch, setPermSearch] = useState('');
    const [roleSaving, setRoleSaving] = useState(false);
    const [roleNameError, setRoleNameError] = useState('');

    const applyFilter = (key: string, val: string) => {
        router.get(
            '/admin/roles',
            {
                search: searchQuery,
                per_page: perPage,
                [key]: val,
            },
            { preserveState: true, replace: true },
        );
    };

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

    const toggleModulePermissions = (modulePerms: PermissionItem[]) => {
        const names = modulePerms.map((p) => p.name);
        const allSelected = names.every((n) => rolePermissions.includes(n));
        if (allSelected) {
            setRolePermissions((prev) => prev.filter((p) => !names.includes(p)));
        } else {
            setRolePermissions((prev) => Array.from(new Set([...prev, ...names])));
        }
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

    const groupedEditPermissions = useMemo(() => {
        const q = permSearch.trim().toLowerCase();
        const filtered = q
            ? permissions.filter((p) => p.name.toLowerCase().includes(q))
            : permissions;
        return groupPermissionsByModule(filtered);
    }, [permissions, permSearch]);

    const groupedViewPermissions = useMemo(() => {
        return viewingRole ? groupPermissionsByModule(viewingRole.permissions) : [];
    }, [viewingRole]);

    return (
        <AdminLayout
            title="Roles & Permissions"
            breadcrumbs={[{ title: 'Roles & Permissions' }]}
        >
            <Head title="Roles & Permissions - CCINTAKE 97 Admin" />

            <div className="space-y-6">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-[20px] font-bold tracking-tight text-[#071437]">
                            Roles & Action-Level Permissions
                        </h1>
                        <p className="mt-1 text-[13px] text-[#78829D]">
                            Create roles, inspect permission matrices by module, and configure granular access controls.
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
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            applyFilter('search', searchQuery);
                        }}
                        className="relative max-w-md"
                    >
                        <Search className="absolute top-3 left-3 size-4 text-[#99A1B7]" />
                        <Input
                            placeholder="Search role by name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={`${fieldClass} pl-9`}
                        />
                    </form>
                </div>

                {/* Roles Table */}
                <div className="overflow-hidden rounded-xl border border-[#F1F1F4] bg-white shadow-[0_3px_4px_0_rgba(0,0,0,0.03)]">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-[#FCFCFC]">
                                <TableRow className="border-[#F1F1F4] hover:bg-transparent">
                                    <TableHead className="w-14 px-5 py-3.5 text-[11.5px] font-semibold tracking-wide text-[#78829D] uppercase">
                                        SL
                                    </TableHead>
                                    <TableHead className="px-5 py-3.5 text-[11.5px] font-semibold tracking-wide text-[#78829D] uppercase">
                                        Role Name
                                    </TableHead>
                                    <TableHead className="px-4 py-3.5 text-[11.5px] font-semibold tracking-wide text-[#78829D] uppercase">
                                        Type
                                    </TableHead>
                                    <TableHead className="px-4 py-3.5 text-[11.5px] font-semibold tracking-wide text-[#78829D] uppercase">
                                        Assigned Users
                                    </TableHead>
                                    <TableHead className="px-4 py-3.5 text-[11.5px] font-semibold tracking-wide text-[#78829D] uppercase">
                                        Permissions
                                    </TableHead>
                                    <TableHead className="px-5 py-3.5 text-right text-[11.5px] font-semibold tracking-wide text-[#78829D] uppercase">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {roles.data.length === 0 ? (
                                    <TableRow className="border-[#F1F1F4] hover:bg-transparent">
                                        <TableCell colSpan={6} className="h-32 text-center text-[13px] text-[#78829D]">
                                            No roles found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    roles.data.map((r, idx) => {
                                        const isProtected = PROTECTED_ROLES.includes(r.name);
                                        return (
                                            <TableRow
                                                key={r.id}
                                                className="border-[#F1F1F4] transition-colors hover:bg-[#FCFCFC]"
                                            >
                                                <TableCell className="px-5 py-3.5 text-[12.5px] font-medium text-[#78829D] tabular-nums">
                                                    {(roles.from || 1) + idx}
                                                </TableCell>
                                                <TableCell className="px-5 py-3.5">
                                                    <div className="flex items-center gap-2 text-[13px] font-bold text-[#071437] uppercase">
                                                        <ShieldCheck className="size-4 text-[#1B84FF]" />
                                                        {r.name.replace(/_/g, ' ')}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="px-4 py-3.5">
                                                    <span
                                                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${
                                                            isProtected
                                                                ? 'border-slate-200 bg-slate-50 text-slate-600'
                                                                : 'border-[#DCEBFF] bg-[#F1F6FF] text-[#1B84FF]'
                                                        }`}
                                                    >
                                                        {isProtected ? 'System' : 'Custom'}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="px-4 py-3.5 text-[13px] font-medium text-[#4B5675]">
                                                    {r.users_count} {r.users_count === 1 ? 'user' : 'users'}
                                                </TableCell>
                                                <TableCell className="px-4 py-3.5">
                                                    <span className="inline-flex items-center rounded-full border border-[#E5E7EB] bg-[#FCFCFC] px-2.5 py-0.5 text-[11px] font-semibold text-[#4B5675]">
                                                        {r.permissions_count} permissions
                                                    </span>
                                                </TableCell>
                                                <TableCell className="px-5 py-3.5 text-right">
                                                    <div className="flex justify-end">
                                                        <DropdownMenu modal={false}>
                                                            <DropdownMenuTrigger asChild>
                                                                <button
                                                                    type="button"
                                                                    className="inline-flex size-8 cursor-pointer items-center justify-center rounded-lg border border-transparent text-[#78829D] transition-colors hover:border-[#DBDFE9] hover:bg-[#F9F9F9] hover:text-[#071437]"
                                                                    aria-label="Role actions"
                                                                >
                                                                    <MoreHorizontal className="size-4" />
                                                                </button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end" className="w-48 rounded-xl border-[#F1F1F4] !bg-white p-1.5 !text-[#071437] shadow-[0_12px_32px_-8px_rgba(7,20,55,0.16)]">
                                                                <DropdownMenuItem
                                                                    onSelect={() => setViewingRole(r)}
                                                                    className="cursor-pointer rounded-lg px-2.5 py-2 text-[13px] font-medium text-[#071437] focus:!bg-[#F1F6FF] focus:!text-[#1B84FF]"
                                                                >
                                                                    <Eye className="size-4 text-[#78829D]" />
                                                                    View Permissions
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    onSelect={() => openEditRole(r)}
                                                                    className="cursor-pointer rounded-lg px-2.5 py-2 text-[13px] font-medium text-[#071437] focus:!bg-[#F1F6FF] focus:!text-[#1B84FF]"
                                                                >
                                                                    <Edit2 className="size-4 text-[#78829D]" />
                                                                    Edit Role
                                                                </DropdownMenuItem>
                                                                {!isProtected && (
                                                                    <>
                                                                        <DropdownMenuSeparator className="my-1 bg-[#F1F1F4]" />
                                                                        <DropdownMenuItem
                                                                            onSelect={() => handleDeleteRole(r)}
                                                                            className="cursor-pointer rounded-lg px-2.5 py-2 text-[13px] font-medium text-[#F8285A] focus:!bg-[#FFEEF3] focus:!text-[#F8285A]"
                                                                        >
                                                                            <Trash2 className="size-4 text-[#F8285A]" />
                                                                            Delete Role
                                                                        </DropdownMenuItem>
                                                                    </>
                                                                )}
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    <div className="flex flex-col items-center justify-between gap-3 border-t border-[#F1F1F4] px-5 py-3.5 text-[12.5px] text-[#78829D] sm:flex-row">
                        <div className="flex flex-wrap items-center gap-3">
                            <span>
                                Showing <strong className="font-semibold text-[#071437]">{roles.from || 0}</strong>–
                                <strong className="font-semibold text-[#071437]">{roles.to || 0}</strong> of{' '}
                                <strong className="font-semibold text-[#071437]">{roles.total}</strong> · Page {roles.current_page} of {roles.last_page}
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
                            {roles.links.map((link, idx) => (
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

            {/* View Role Modal */}
            <Dialog open={!!viewingRole} onOpenChange={(open) => !open && setViewingRole(null)}>
                <DialogContent className="flex max-h-[85vh] flex-col gap-0 overflow-hidden rounded-2xl border-[#F1F1F4] !bg-white p-0 !text-[#071437] shadow-[0_20px_50px_-12px_rgba(7,20,55,0.18)] sm:max-w-2xl">
                    <DialogHeader className="shrink-0 border-b border-[#F1F1F4] bg-[#FCFCFC] px-6 py-5">
                        <div className="flex items-start gap-3 pr-6">
                            <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#F1F6FF] text-[#1B84FF]">
                                <ShieldCheck className="size-4.5" />
                            </span>
                            <div className="min-w-0">
                                <DialogTitle className="text-[16px] font-bold text-[#071437] uppercase">
                                    {viewingRole?.name.replace(/_/g, ' ')}
                                </DialogTitle>
                                {viewingRole && (
                                    <p className="mt-0.5 text-[12.5px] text-[#78829D]">
                                        {viewingRole.users_count} assigned {viewingRole.users_count === 1 ? 'user' : 'users'} · {viewingRole.permissions_count} permissions
                                    </p>
                                )}
                            </div>
                        </div>
                    </DialogHeader>
                    <div className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain px-6 py-5">
                        {groupedViewPermissions.length === 0 ? (
                            <p className="py-8 text-center text-[13px] text-[#78829D]">
                                No permissions assigned to this role.
                            </p>
                        ) : (
                            groupedViewPermissions.map(([module, perms]) => (
                                <div key={module} className="rounded-xl border border-[#F1F1F4] bg-[#FCFCFC] p-4">
                                    <div className="mb-2.5 flex items-center justify-between">
                                        <span className="text-[12px] font-bold tracking-wide text-[#071437] uppercase">
                                            {module}
                                        </span>
                                        <span className="text-[11px] font-semibold text-[#78829D]">
                                            {perms.length}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5">
                                        {perms.map((p) => (
                                            <span
                                                key={p.id}
                                                className="rounded-md border border-[#DCEBFF] bg-white px-2.5 py-1 font-mono text-[11px] font-medium text-[#1B84FF]"
                                            >
                                                {p.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    <DialogFooter className="shrink-0 gap-2 border-t border-[#F1F1F4] bg-[#FCFCFC] px-6 py-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setViewingRole(null)}
                            className="h-9 cursor-pointer rounded-lg !border-[#DBDFE9] !bg-white px-4 text-[13px] font-semibold !text-[#4B5675] hover:!border-[#C4CADA] hover:!bg-[#F9FAFB] hover:!text-[#071437]"
                        >
                            Close
                        </Button>
                        {viewingRole && (
                            <Button
                                type="button"
                                onClick={() => {
                                    const target = viewingRole;
                                    setViewingRole(null);
                                    openEditRole(target);
                                }}
                                className="h-9 cursor-pointer rounded-lg bg-[#1B84FF] px-4 text-[13px] font-semibold text-white hover:bg-[#1B84FF]/90"
                            >
                                <Edit2 className="mr-1.5 size-3.5" /> Edit Permissions
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Create / Edit Role & Set Permissions Modal */}
            <Dialog open={roleModalOpen} onOpenChange={(open) => !open && setRoleModalOpen(false)}>
                <DialogContent className="flex max-h-[88vh] flex-col gap-0 overflow-hidden rounded-2xl border-[#F1F1F4] !bg-white p-0 !text-[#071437] shadow-[0_20px_50px_-12px_rgba(7,20,55,0.18)] sm:max-w-2xl">
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
                                        ? `Configure module permissions for ${editingRole.name.replace(/_/g, ' ')}.`
                                        : 'Define a new role name and select permissions by module.'}
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
                                    Permissions Matrix ({rolePermissions.length}/{permissions.length})
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
                                    placeholder="Filter permissions by module or action..."
                                    className={`${fieldClass} pl-9`}
                                />
                            </div>
                        </div>

                        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain px-6 pb-5">
                            {groupedEditPermissions.length === 0 ? (
                                <p className="py-6 text-center text-[12.5px] text-[#78829D]">
                                    No matching permissions found.
                                </p>
                            ) : (
                                groupedEditPermissions.map(([module, modulePerms]) => {
                                    const selectedCount = modulePerms.filter((p) =>
                                        rolePermissions.includes(p.name),
                                    ).length;
                                    const allSelected = selectedCount === modulePerms.length;
                                    return (
                                        <div
                                            key={module}
                                            className="rounded-xl border border-[#F1F1F4] bg-[#FCFCFC] p-3.5"
                                        >
                                            <div className="mb-2.5 flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[12px] font-bold tracking-wide text-[#071437] uppercase">
                                                        {module}
                                                    </span>
                                                    <span className="text-[11px] font-semibold text-[#78829D]">
                                                        ({selectedCount}/{modulePerms.length})
                                                    </span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => toggleModulePermissions(modulePerms)}
                                                    className="cursor-pointer text-[11.5px] font-semibold text-[#1B84FF] hover:underline"
                                                >
                                                    {allSelected ? 'Unselect module' : 'Select module'}
                                                </button>
                                            </div>
                                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                                {modulePerms.map((p) => {
                                                    const checked = rolePermissions.includes(p.name);
                                                    return (
                                                        <label
                                                            key={p.id}
                                                            className={`flex cursor-pointer items-center gap-2.5 rounded-lg border p-2.5 transition-all ${
                                                                checked
                                                                    ? 'border-[#1B84FF] bg-white shadow-[0_1px_2px_0_rgba(27,132,255,0.08)]'
                                                                    : 'border-[#F1F1F4] bg-white hover:border-[#DBDFE9]'
                                                            }`}
                                                        >
                                                            <Checkbox
                                                                checked={checked}
                                                                onCheckedChange={() => toggleRolePermission(p.name)}
                                                                className="size-4 cursor-pointer rounded-[4px] !border-[#DBDFE9] !bg-white data-[state=checked]:!border-[#1B84FF] data-[state=checked]:!bg-[#1B84FF] data-[state=checked]:!text-white focus-visible:!ring-[#1B84FF]/20"
                                                            />
                                                            <span className="truncate font-mono text-[12px] font-medium text-[#071437]">
                                                                {p.name}
                                                            </span>
                                                        </label>
                                                    );
                                                })}
                                            </div>
                                        </div>
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
