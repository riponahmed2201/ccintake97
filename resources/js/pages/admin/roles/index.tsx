import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { ShieldCheck, UserCheck, Edit2 } from 'lucide-react';
import type { AuthUser } from '@/types';

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
    const [selectedUser, setSelectedUser] = useState<any | null>(null);
    const [userRoles, setUserRoles] = useState<string[]>([]);

    const openAssign = (u: any) => {
        setSelectedUser(u);
        setUserRoles(u.roles.map((r: any) => r.name));
    };

    const handleAssignSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUser) return;

        router.post(`/admin/roles/assign/${selectedUser.id}`, {
            roles: userRoles,
        }, {
            onSuccess: () => setSelectedUser(null),
        });
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
                    <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                        Roles & Action-Level Permission Management
                    </h1>
                    <p className="text-xs text-slate-500 mt-1">
                        Spatie Role-Based Access Control (RBAC) assigning operational privileges across admin modules.
                    </p>
                </div>

                {/* Staff Users Assignment Card */}
                <Card className="overflow-hidden">
                    <CardHeader className="p-4 border-b">
                        <CardTitle className="text-sm font-semibold flex items-center gap-2">
                            <UserCheck className="size-4 text-emerald-600" />
                            Administrative Staff & Role Assignments
                        </CardTitle>
                    </CardHeader>
                    <Table>
                        <TableHeader className="bg-slate-50 dark:bg-slate-900/60">
                            <TableRow>
                                <TableHead className="text-xs font-semibold">User Name & Email</TableHead>
                                <TableHead className="text-xs font-semibold">Assigned Roles</TableHead>
                                <TableHead className="text-xs font-semibold text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {staffUsers.map((u) => (
                                <TableRow key={u.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                                    <TableCell>
                                        <div className="font-semibold text-xs text-slate-900 dark:text-white">
                                            {u.name}
                                        </div>
                                        <div className="text-[11px] text-slate-500">
                                            {u.email}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1.5">
                                            {u.roles.map((r) => (
                                                <Badge key={r.id} variant="outline" className="text-[10px] uppercase font-mono text-indigo-600">
                                                    {r.name.replace('_', ' ')}
                                                </Badge>
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => openAssign(u)}
                                            className="text-xs"
                                        >
                                            <Edit2 className="size-3.5 mr-1" /> Edit Roles
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>

                {/* System Defined Roles & Capabilities */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {roles.map((r) => (
                        <Card key={r.id} className="p-4 space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="font-bold text-xs uppercase text-slate-900 dark:text-white flex items-center gap-1.5">
                                    <ShieldCheck className="size-4 text-indigo-600" />
                                    {r.name.replace('_', ' ')}
                                </span>
                                <Badge variant="outline" className="text-[10px]">
                                    {r.permissions.length} perms
                                </Badge>
                            </div>
                            <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto pt-1">
                                {r.permissions.slice(0, 8).map((p) => (
                                    <span key={p.id} className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[9px] font-mono text-slate-600 dark:text-slate-400">
                                        {p.name}
                                    </span>
                                ))}
                                {r.permissions.length > 8 && (
                                    <span className="text-[9px] text-slate-400 pl-1 self-center">
                                        +{r.permissions.length - 8} more
                                    </span>
                                )}
                            </div>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Assign Roles Dialog */}
            <Dialog open={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-sm font-semibold">
                            Assign Roles for {selectedUser?.name}
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAssignSubmit} className="space-y-4 py-2 text-xs">
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                            {roles.map((r) => (
                                <label key={r.id} className="flex items-center gap-2 p-2 rounded-lg border text-xs cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800">
                                    <input
                                        type="checkbox"
                                        checked={userRoles.includes(r.name)}
                                        onChange={() => toggleRole(r.name)}
                                        className="rounded text-indigo-600"
                                    />
                                    <span className="font-medium uppercase">{r.name.replace('_', ' ')}</span>
                                </label>
                            ))}
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" size="sm" onClick={() => setSelectedUser(null)}>Cancel</Button>
                            <Button type="submit" size="sm" className="bg-indigo-600 hover:bg-indigo-700">Save Role Assignments</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}
