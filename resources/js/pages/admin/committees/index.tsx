import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Award, Plus, Trash2, UserPlus } from 'lucide-react';
import type { Committee, Member } from '@/types';

interface CommitteesIndexProps {
    committees: Committee[];
    approvedMembers: Member[];
}

const fieldClass =
    'h-10 w-full rounded-md border !border-[#DBDFE9] !bg-[#FCFCFC] px-3 text-[13px] font-normal !text-[#071437] !shadow-none outline-none transition-all duration-200 placeholder:!text-[#99A1B7] hover:!border-[#C4CADA] focus:!border-[#1B84FF] focus:!bg-white focus:!ring-[3px] focus:!ring-[#1B84FF]/10 dark:!bg-[#FCFCFC] dark:!text-[#071437]';

const textareaClass =
    'w-full rounded-md border !border-[#DBDFE9] !bg-[#FCFCFC] p-3 text-[13px] font-normal !text-[#071437] !shadow-none outline-none transition-all duration-200 placeholder:!text-[#99A1B7] hover:!border-[#C4CADA] focus:!border-[#1B84FF] focus:!bg-white focus:!ring-[3px] focus:!ring-[#1B84FF]/10 dark:!bg-[#FCFCFC] dark:!text-[#071437]';

const selectTriggerClass =
    '!h-10 w-full cursor-pointer rounded-md !border-[#DBDFE9] !bg-[#FCFCFC] px-3 text-[13px] font-normal !text-[#071437] !shadow-none transition-all duration-200 hover:!border-[#C4CADA] hover:!bg-[#FCFCFC] focus-visible:!border-[#1B84FF] focus-visible:!bg-white focus-visible:!ring-[3px] focus-visible:!ring-[#1B84FF]/10 dark:!bg-[#FCFCFC] dark:hover:!bg-[#FCFCFC]';

const selectMenuClass =
    'z-[60] rounded-xl !border-[#F1F1F4] !bg-white p-1 !text-[#071437] shadow-[0_12px_32px_-8px_rgba(7,20,55,0.16)] dark:!bg-white dark:!text-[#071437]';

const selectItemClass =
    'cursor-pointer rounded-lg py-2 pr-8 pl-2.5 text-[13px] text-[#071437] focus:!bg-[#F1F6FF] focus:!text-[#1B84FF] dark:text-[#071437]';

const labelClass = 'mb-1.5 block text-[12.5px] font-semibold text-[#071437]';

export default function CommitteesIndex({ committees, approvedMembers }: CommitteesIndexProps) {
    const [createOpen, setCreateOpen] = useState(false);
    const [assignOpen, setAssignOpen] = useState<number | null>(null);

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [termStart, setTermStart] = useState('');
    const [termEnd, setTermEnd] = useState('');

    const [selectedMemberId, setSelectedMemberId] = useState('');
    const [positionTitle, setPositionTitle] = useState('');
    const [roleType, setRoleType] = useState('member');

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(
            '/admin/committees',
            {
                name,
                description,
                term_start: termStart || null,
                term_end: termEnd || null,
                status: 'active',
            },
            {
                onSuccess: () => {
                    setCreateOpen(false);
                    setName('');
                    setDescription('');
                },
            },
        );
    };

    const handleAssign = (e: React.FormEvent) => {
        e.preventDefault();
        if (!assignOpen || !selectedMemberId) return;

        router.post(
            `/admin/committees/${assignOpen}/members`,
            {
                member_id: parseInt(selectedMemberId),
                position_title: positionTitle,
                role_type: roleType,
            },
            {
                onSuccess: () => {
                    setAssignOpen(null);
                    setSelectedMemberId('');
                    setPositionTitle('');
                },
            },
        );
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
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-[20px] font-bold tracking-tight text-[#071437]">
                            Leadership & Executive Committees
                        </h1>
                        <p className="mt-1 text-[13px] text-[#78829D]">
                            Manage the association governance structure, executive committees, terms, and leadership appointments.
                        </p>
                    </div>
                    <Button
                        onClick={() => setCreateOpen(true)}
                        className="h-10 rounded-lg bg-[#1B84FF] px-4 text-[13px] font-semibold text-white hover:bg-[#1B84FF]/90"
                    >
                        <Plus className="mr-1.5 size-4" /> Create Committee
                    </Button>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {committees.map((comm) => (
                        <div
                            key={comm.id}
                            className="overflow-hidden rounded-xl border border-[#F1F1F4] bg-white shadow-[0_3px_4px_0_rgba(0,0,0,0.03)]"
                        >
                            <div className="flex flex-col gap-3 border-b border-[#F1F1F4] bg-[#FCFCFC] px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                                <div className="space-y-1">
                                    <div className="flex flex-wrap items-center gap-2.5">
                                        <span className="flex size-8 items-center justify-center rounded-lg bg-[#F1F6FF] text-[#1B84FF]">
                                            <Award className="size-4" />
                                        </span>
                                        <h2 className="text-[15px] font-bold text-[#071437]">
                                            {comm.name}
                                        </h2>
                                        <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 font-mono text-[10.5px] font-semibold text-emerald-700 uppercase">
                                            {comm.status}
                                        </span>
                                    </div>
                                    <p className="line-clamp-1 text-[12.5px] text-[#78829D]">
                                        {comm.description || 'No description provided.'}
                                    </p>
                                </div>
                                <Button
                                    variant="outline"
                                    onClick={() => setAssignOpen(comm.id)}
                                    className="h-9 shrink-0 rounded-lg border-[#DBDFE9] bg-white px-3.5 text-[12.5px] font-semibold text-[#071437] hover:border-[#1B84FF] hover:bg-[#F1F6FF] hover:text-[#1B84FF]"
                                >
                                    <UserPlus className="mr-1.5 size-3.5" /> Assign Member
                                </Button>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 md:grid-cols-3">
                                    {comm.members?.length === 0 ? (
                                        <div className="col-span-full py-6 text-center text-[13px] text-[#99A1B7]">
                                            No leadership appointments assigned to this committee yet.
                                        </div>
                                    ) : (
                                        comm.members?.map((m) => (
                                            <div
                                                key={m.id}
                                                className="flex items-center justify-between rounded-xl border border-[#F1F1F4] bg-[#FCFCFC] p-3.5 transition-colors hover:border-[#DBDFE9]"
                                            >
                                                <div className="space-y-0.5">
                                                    <div className="text-[13px] font-bold text-[#071437]">
                                                        {m.member?.user?.name}
                                                    </div>
                                                    <div className="text-[12px] font-semibold text-[#1B84FF]">
                                                        {m.position_title}
                                                    </div>
                                                    <div className="text-[11px] text-[#78829D]">
                                                        {m.member?.college?.short_name || m.member?.college?.name}
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveMember(m.id)}
                                                    className="inline-flex size-8 items-center justify-center rounded-lg text-[#99A1B7] transition-colors hover:bg-rose-50 hover:text-rose-600"
                                                    title="Remove member"
                                                >
                                                    <Trash2 className="size-4" />
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Create Committee Dialog */}
            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                <DialogContent className="rounded-2xl border-[#F1F1F4] !bg-white p-0 !text-[#071437] shadow-[0_20px_50px_-12px_rgba(7,20,55,0.18)] sm:max-w-lg">
                    <DialogHeader className="border-b border-[#F1F1F4] px-6 py-5">
                        <DialogTitle className="text-[16px] font-bold text-[#071437]">
                            Create New Committee
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCreate} className="space-y-4 px-6 py-5">
                        <div>
                            <label className={labelClass}>Committee Name *</label>
                            <input
                                required
                                className={fieldClass}
                                placeholder="e.g. Central Executive Committee (2026-2028)"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Responsibilities / Scope</label>
                            <textarea
                                rows={3}
                                className={textareaClass}
                                placeholder="Mandate and objectives..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className={labelClass}>Term Start Date</label>
                                <DatePicker
                                    value={termStart}
                                    onChange={setTermStart}
                                    placeholder="Select start date"
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Term End Date</label>
                                <DatePicker
                                    value={termEnd}
                                    onChange={setTermEnd}
                                    placeholder="Select end date"
                                />
                            </div>
                        </div>
                        <DialogFooter className="border-t border-[#F1F1F4] pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setCreateOpen(false)}
                                className="h-9 rounded-lg border-[#DBDFE9] bg-white px-4 text-[13px] font-semibold text-[#4B5675] hover:bg-[#FCFCFC]"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="h-9 rounded-lg bg-[#1B84FF] px-4 text-[13px] font-semibold text-white hover:bg-[#1B84FF]/90"
                            >
                                Save Committee
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Assign Member Dialog */}
            <Dialog open={!!assignOpen} onOpenChange={(open) => !open && setAssignOpen(null)}>
                <DialogContent className="rounded-2xl border-[#F1F1F4] !bg-white p-0 !text-[#071437] shadow-[0_20px_50px_-12px_rgba(7,20,55,0.18)] sm:max-w-lg">
                    <DialogHeader className="border-b border-[#F1F1F4] px-6 py-5">
                        <DialogTitle className="text-[16px] font-bold text-[#071437]">
                            Assign Alumnus to Committee
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAssign} className="space-y-4 px-6 py-5">
                        <div>
                            <label className={labelClass}>Select Member *</label>
                            <Select value={selectedMemberId} onValueChange={setSelectedMemberId}>
                                <SelectTrigger className={selectTriggerClass}>
                                    <SelectValue placeholder="Choose an approved member..." />
                                </SelectTrigger>
                                <SelectContent className={selectMenuClass}>
                                    {approvedMembers.map((m) => (
                                        <SelectItem key={m.id} value={String(m.id)} className={selectItemClass}>
                                            {m.user?.name} ({m.college?.short_name || m.college?.name} -{' '}
                                            {m.member_code || 'ID Pending'})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label className={labelClass}>Official Position Title *</label>
                            <input
                                required
                                className={fieldClass}
                                placeholder="e.g. Vice President, Joint Secretary, General Member"
                                value={positionTitle}
                                onChange={(e) => setPositionTitle(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Position Hierarchy Role</label>
                            <Select value={roleType} onValueChange={setRoleType}>
                                <SelectTrigger className={selectTriggerClass}>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className={selectMenuClass}>
                                    <SelectItem value="president" className={selectItemClass}>
                                        President
                                    </SelectItem>
                                    <SelectItem value="vice_president" className={selectItemClass}>
                                        Vice President
                                    </SelectItem>
                                    <SelectItem value="general_secretary" className={selectItemClass}>
                                        General Secretary
                                    </SelectItem>
                                    <SelectItem value="joint_secretary" className={selectItemClass}>
                                        Joint Secretary
                                    </SelectItem>
                                    <SelectItem value="treasurer" className={selectItemClass}>
                                        Treasurer
                                    </SelectItem>
                                    <SelectItem value="member" className={selectItemClass}>
                                        Executive Member
                                    </SelectItem>
                                    <SelectItem value="advisor" className={selectItemClass}>
                                        Advisory Board
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <DialogFooter className="border-t border-[#F1F1F4] pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setAssignOpen(null)}
                                className="h-9 rounded-lg border-[#DBDFE9] bg-white px-4 text-[13px] font-semibold text-[#4B5675] hover:bg-[#FCFCFC]"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={!selectedMemberId}
                                className="h-9 rounded-lg bg-[#1B84FF] px-4 text-[13px] font-semibold text-white hover:bg-[#1B84FF]/90 disabled:opacity-50"
                            >
                                Confirm Appointment
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}
