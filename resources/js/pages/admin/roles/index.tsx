import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
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
import { Edit2, ShieldCheck, UserCheck } from 'lucide-react';

interface StaffUserItem {
    id: number;
    name: string;
    email: string;
    roles: { id: number; name: string }[];
}

interface RolesIndexProps {
    roles: { id: number; name: string; permissions: { id: number; name: string }[] }[];
    staffUsers: StaffUserItem[];
}

export default function RolesIndex({ roles, staffUsers }: RolesIndexProps) {
    const [selectedUser, setSelectedUser] = useState<StaffUserItem | null>(null);
    const [userRoles, setUserRoles] = useState<string[]>([]);

    const openAssign = (u: StaffUserItem) => {
        setSelectedUser(u);
        setUserRoles(u.roles.map((r) => r.name));
    };

    const handleAssignSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUser) return;

        router.post(
            `/admin/roles/assign/${selectedUser.id}`,
            {
                roles: userRoles,
            },
            {
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
                <div>
                    <h1 className="text-[20px] font-bold tracking-tight text-[#071437]">
                        Roles & Action-Level Permission Management
                    </h1>
                    <p className="mt-1 text-[13px] text-[#78829D]">
                        Spatie Role-Based Access Control (RBAC) assigning operational privileges across admin modules.
                    </p>
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
                                {staffUsers.map((u) => (
                                    <TableRow
                                        key={u.id}
                                        className="border-[#F1F1F4] transition-colors hover:bg-[#FCFCFC]"
                                    >
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
                                                        {r.name.replace('_', ' ')}
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
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {roles.map((r) => (
                        <div
                            key={r.id}
                            className="space-y-3 rounded-xl border border-[#F1F1F4] bg-white p-5 shadow-[0_3px_4px_0_rgba(0,0,0,0.03)]"
                        >
                            <div className="flex items-center justify-between">
                                <span className="flex items-center gap-2 text-[13px] font-bold text-[#071437] uppercase">
                                    <ShieldCheck className="size-4 text-[#1B84FF]" />
                                    {r.name.replace('_', ' ')}
                                </span>
                                <span className="inline-flex items-center rounded-full border border-[#E5E7EB] bg-[#FCFCFC] px-2.5 py-0.5 text-[11px] font-semibold text-[#4B5675]">
                                    {r.permissions.length} perms
                                </span>
                            </div>
                            <div className="flex max-h-24 flex-wrap gap-1.5 overflow-y-auto pt-1">
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
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Dialog open={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
                <DialogContent className="rounded-2xl border-[#F1F1F4] !bg-white p-0 !text-[#071437] shadow-[0_20px_50px_-12px_rgba(7,20,55,0.18)] sm:max-w-md">
                    <DialogHeader className="border-b border-[#F1F1F4] px-6 py-5">
                        <DialogTitle className="text-[16px] font-bold text-[#071437]">
                            Assign Roles for {selectedUser?.name}
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAssignSubmit} className="space-y-4 px-6 py-5">
                        <div className="max-h-64 space-y-2 overflow-y-auto">
                            {roles.map((r) => (
                                <label
                                    key={r.id}
                                    className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-[#F1F1F4] bg-[#FCFCFC] p-3 text-[13px] transition-colors hover:border-[#DBDFE9]"
                                >
                                    <input
                                        type="checkbox"
                                        checked={userRoles.includes(r.name)}
                                        onChange={() => toggleRole(r.name)}
                                        className="size-4 rounded border-[#DBDFE9] text-[#1B84FF] focus:ring-[#1B84FF]"
                                    />
                                    <span className="font-semibold text-[#071437] uppercase">
                                        {r.name.replace('_', ' ')}
                                    </span>
                                </label>
                            ))}
                        </div>
                        <DialogFooter className="border-t border-[#F1F1F4] pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setSelectedUser(null)}
                                className="h-9 rounded-lg border-[#DBDFE9] bg-white px-4 text-[13px] font-semibold text-[#4B5675] hover:bg-[#FCFCFC]"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="h-9 rounded-lg bg-[#1B84FF] px-4 text-[13px] font-semibold text-white hover:bg-[#1B84FF]/90"
                            >
                                Save Role Assignments
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}
