import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Award, Plus, UserPlus, Trash2, Calendar } from 'lucide-react';
import type { Committee, Member } from '@/types';

interface CommitteesIndexProps {
    committees: Committee[];
    approvedMembers: Member[];
}

export default function CommitteesIndex({ committees, approvedMembers }: CommitteesIndexProps) {
    const [createOpen, setCreateOpen] = useState(false);
    const [assignOpen, setAssignOpen] = useState<number | null>(null);

    // Create form
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [termStart, setTermStart] = useState('');
    const [termEnd, setTermEnd] = useState('');

    // Assign form
    const [selectedMemberId, setSelectedMemberId] = useState('');
    const [positionTitle, setPositionTitle] = useState('');
    const [roleType, setRoleType] = useState('member');

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/admin/committees', {
            name,
            description,
            term_start: termStart || null,
            term_end: termEnd || null,
            status: 'active',
        }, {
            onSuccess: () => {
                setCreateOpen(false);
                setName('');
                setDescription('');
            },
        });
    };

    const handleAssign = (e: React.FormEvent) => {
        e.preventDefault();
        if (!assignOpen) return;

        router.post(`/admin/committees/${assignOpen}/members`, {
            member_id: parseInt(selectedMemberId),
            position_title: positionTitle,
            role_type: roleType,
        }, {
            onSuccess: () => {
                setAssignOpen(null);
                setSelectedMemberId('');
                setPositionTitle('');
            },
        });
    };

    const handleRemoveMember = (id: number) => {
        if (confirm('Remove this member from the committee?')) {
            router.delete(`/admin/committees/members/${id}`);
        }
    };

    return (
        <AdminLayout
            title="Leadership & Executive Committees"
            breadcrumbs={[{ title: 'Committees' }]}
        >
            <Head title="Leadership & Committees - INTAKE 97 Admin" />

            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                            Leadership & Executive Committees
                        </h1>
                        <p className="text-xs text-slate-500 mt-1">
                            Manage the association governance structure, executive committees, terms, and leadership appointments.
                        </p>
                    </div>
                    <Button
                        size="sm"
                        onClick={() => setCreateOpen(true)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-xs font-semibold"
                    >
                        <Plus className="size-3.5 mr-1" /> Create Committee
                    </Button>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {committees.map((comm) => (
                        <Card key={comm.id} className="overflow-hidden">
                            <CardHeader className="bg-slate-50/50 dark:bg-slate-900/40 p-4 border-b flex flex-row items-center justify-between">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <Award className="size-4.5 text-indigo-600" />
                                        <CardTitle className="text-sm font-bold text-slate-900 dark:text-white">
                                            {comm.name}
                                        </CardTitle>
                                        <Badge variant="outline" className="text-[10px] uppercase font-mono">
                                            {comm.status}
                                        </Badge>
                                    </div>
                                    <p className="text-xs text-slate-500 line-clamp-1">
                                        {comm.description || 'No description provided.'}
                                    </p>
                                </div>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setAssignOpen(comm.id)}
                                    className="text-xs"
                                >
                                    <UserPlus className="size-3.5 mr-1" /> Assign Member
                                </Button>
                            </CardHeader>
                            <CardContent className="p-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                    {comm.members?.length === 0 ? (
                                        <div className="col-span-full py-4 text-center text-xs text-slate-400">
                                            No leadership appointments assigned to this committee yet.
                                        </div>
                                    ) : (
                                        comm.members?.map((m) => (
                                            <div
                                                key={m.id}
                                                className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/30 flex items-center justify-between"
                                            >
                                                <div className="space-y-0.5">
                                                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                                                        {m.member?.user?.name}
                                                    </div>
                                                    <div className="text-[11px] text-indigo-600 font-semibold">
                                                        {m.position_title}
                                                    </div>
                                                    <div className="text-[10px] text-slate-400">
                                                        {m.member?.college?.short_name || m.member?.college?.name}
                                                    </div>
                                                </div>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => handleRemoveMember(m.id)}
                                                    className="size-7 p-0 text-slate-400 hover:text-rose-500"
                                                >
                                                    <Trash2 className="size-3.5" />
                                                </Button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Create Committee Dialog */}
            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-sm font-semibold">Create New Committee</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCreate} className="space-y-3 py-2 text-xs">
                        <div>
                            <label className="font-semibold block mb-1">Committee Name *</label>
                            <Input
                                required
                                placeholder="e.g. Central Executive Committee (2026-2028)"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="font-semibold block mb-1">Responsibilities / Scope</label>
                            <textarea
                                rows={3}
                                className="w-full text-xs rounded-md border p-2"
                                placeholder="Mandate and objectives..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="font-semibold block mb-1">Term Start Date</label>
                                <Input type="date" value={termStart} onChange={(e) => setTermStart(e.target.value)} />
                            </div>
                            <div>
                                <label className="font-semibold block mb-1">Term End Date</label>
                                <Input type="date" value={termEnd} onChange={(e) => setTermEnd(e.target.value)} />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" size="sm" onClick={() => setCreateOpen(false)}>Cancel</Button>
                            <Button type="submit" size="sm" className="bg-emerald-600 hover:bg-emerald-700">Save Committee</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Assign Member Dialog */}
            <Dialog open={!!assignOpen} onOpenChange={(open) => !open && setAssignOpen(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-sm font-semibold">Assign Alumnus to Committee</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAssign} className="space-y-3 py-2 text-xs">
                        <div>
                            <label className="font-semibold block mb-1">Select Member *</label>
                            <select
                                required
                                value={selectedMemberId}
                                onChange={(e) => setSelectedMemberId(e.target.value)}
                                className="w-full text-xs rounded-md border p-2 bg-white dark:bg-slate-900"
                            >
                                <option value="">Choose an approved member...</option>
                                {approvedMembers.map((m) => (
                                    <option key={m.id} value={m.id}>
                                        {m.user?.name} ({m.college?.short_name || m.college?.name} - {m.member_code || 'ID Pending'})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="font-semibold block mb-1">Official Position Title *</label>
                            <Input
                                required
                                placeholder="e.g. Vice President, Joint Secretary, General Member"
                                value={positionTitle}
                                onChange={(e) => setPositionTitle(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="font-semibold block mb-1">Position Hierarchy Role</label>
                            <select
                                value={roleType}
                                onChange={(e) => setRoleType(e.target.value)}
                                className="w-full text-xs rounded-md border p-2 bg-white dark:bg-slate-900"
                            >
                                <option value="president">President</option>
                                <option value="vice_president">Vice President</option>
                                <option value="general_secretary">General Secretary</option>
                                <option value="joint_secretary">Joint Secretary</option>
                                <option value="treasurer">Treasurer</option>
                                <option value="member">Executive Member</option>
                                <option value="advisor">Advisory Board</option>
                            </select>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" size="sm" onClick={() => setAssignOpen(null)}>Cancel</Button>
                            <Button type="submit" size="sm" className="bg-indigo-600 hover:bg-indigo-700">Confirm Appointment</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}
