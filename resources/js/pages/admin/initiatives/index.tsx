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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { HeartHandshake, Plus } from 'lucide-react';
import type { Initiative, Member } from '@/types';

interface InitiativesIndexProps {
    initiatives: {
        data: Initiative[];
        current_page: number;
        last_page: number;
        total: number;
    };
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

export default function InitiativesIndex({ initiatives, approvedMembers }: InitiativesIndexProps) {
    const [createOpen, setCreateOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState<'scholarship' | 'welfare' | 'medical' | 'emergency' | 'mentorship'>('welfare');
    const [coordinatorId, setCoordinatorId] = useState('none');
    const [budget] = useState('');
    const [targetAmount, setTargetAmount] = useState('');
    const [description, setDescription] = useState('');

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(
            '/admin/initiatives',
            {
                title,
                category,
                coordinator_member_id: coordinatorId && coordinatorId !== 'none' ? parseInt(coordinatorId) : null,
                budget: budget ? parseFloat(budget) : null,
                target_amount: targetAmount ? parseFloat(targetAmount) : null,
                description,
                status: 'active',
            },
            {
                onSuccess: () => {
                    setCreateOpen(false);
                    setTitle('');
                    setDescription('');
                },
            },
        );
    };

    return (
        <AdminLayout
            title="Community Welfare & Initiatives"
            breadcrumbs={[{ title: 'Initiatives' }]}
        >
            <Head title="Community Initiatives - INTAKE 97 Admin" />

            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-[20px] font-bold tracking-tight text-[#071437]">
                            Community Welfare & Initiatives
                        </h1>
                        <p className="mt-1 text-[13px] text-[#78829D]">
                            Track social impact projects, scholarship programs, and emergency assistance funds.
                        </p>
                    </div>
                    <Button
                        onClick={() => setCreateOpen(true)}
                        className="h-10 rounded-lg bg-[#1B84FF] px-4 text-[13px] font-semibold text-white hover:bg-[#1B84FF]/90"
                    >
                        <Plus className="mr-1.5 size-4" /> New Initiative
                    </Button>
                </div>

                <div className="overflow-hidden rounded-xl border border-[#F1F1F4] bg-white shadow-[0_3px_4px_0_rgba(0,0,0,0.03)]">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-[#FCFCFC]">
                                <TableRow className="border-[#F1F1F4] hover:bg-transparent">
                                    <TableHead className="px-5 py-3.5 text-[11.5px] font-semibold tracking-wide text-[#78829D] uppercase">
                                        Initiative Title
                                    </TableHead>
                                    <TableHead className="px-4 py-3.5 text-[11.5px] font-semibold tracking-wide text-[#78829D] uppercase">
                                        Category
                                    </TableHead>
                                    <TableHead className="px-4 py-3.5 text-[11.5px] font-semibold tracking-wide text-[#78829D] uppercase">
                                        Coordinator
                                    </TableHead>
                                    <TableHead className="px-4 py-3.5 text-[11.5px] font-semibold tracking-wide text-[#78829D] uppercase">
                                        Budget / Target
                                    </TableHead>
                                    <TableHead className="px-4 py-3.5 text-[11.5px] font-semibold tracking-wide text-[#78829D] uppercase">
                                        Funds Raised
                                    </TableHead>
                                    <TableHead className="px-5 py-3.5 text-[11.5px] font-semibold tracking-wide text-[#78829D] uppercase">
                                        Status
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {initiatives.data.length === 0 ? (
                                    <TableRow className="border-[#F1F1F4] hover:bg-transparent">
                                        <TableCell colSpan={6} className="h-32 text-center text-[13px] text-[#78829D]">
                                            No initiatives recorded yet.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    initiatives.data.map((ini) => (
                                        <TableRow
                                            key={ini.id}
                                            className="border-[#F1F1F4] transition-colors hover:bg-[#FCFCFC]"
                                        >
                                            <TableCell className="px-5 py-3.5">
                                                <div className="flex items-start gap-2.5">
                                                    <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
                                                        <HeartHandshake className="size-4" />
                                                    </div>
                                                    <div>
                                                        <div className="text-[13px] font-semibold text-[#071437]">
                                                            {ini.title}
                                                        </div>
                                                        <div className="line-clamp-1 text-[11.5px] text-[#78829D]">
                                                            {ini.description || '—'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-4 py-3.5">
                                                <span className="inline-flex items-center rounded-md border border-[#E5E7EB] bg-[#FCFCFC] px-2.5 py-0.5 text-[11px] font-semibold text-[#4B5675] capitalize">
                                                    {ini.category}
                                                </span>
                                            </TableCell>
                                            <TableCell className="px-4 py-3.5 text-[13px] text-[#4B5675]">
                                                {ini.coordinator?.user?.name || 'Central Committee'}
                                            </TableCell>
                                            <TableCell className="px-4 py-3.5 text-[13px] font-semibold text-[#071437]">
                                                BDT {Number(ini.target_amount || ini.budget || 0).toLocaleString()}
                                            </TableCell>
                                            <TableCell className="px-4 py-3.5 text-[13px] font-bold text-emerald-600">
                                                BDT {Number(ini.raised_amount || 0).toLocaleString()}
                                            </TableCell>
                                            <TableCell className="px-5 py-3.5">
                                                <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 capitalize">
                                                    {ini.status}
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>

            {/* Create Initiative Dialog */}
            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                <DialogContent className="rounded-2xl border-[#F1F1F4] !bg-white p-0 !text-[#071437] shadow-[0_20px_50px_-12px_rgba(7,20,55,0.18)] sm:max-w-lg">
                    <DialogHeader className="border-b border-[#F1F1F4] px-6 py-5">
                        <DialogTitle className="text-[16px] font-bold text-[#071437]">
                            Launch Community Initiative
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCreate} className="space-y-4 px-6 py-5">
                        <div>
                            <label className={labelClass}>Title *</label>
                            <input
                                required
                                className={fieldClass}
                                placeholder="e.g. Flood Relief Fund for Batchmates"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className={labelClass}>Category *</label>
                                <Select
                                    value={category}
                                    onValueChange={(val) => setCategory(val as typeof category)}
                                >
                                    <SelectTrigger className={selectTriggerClass}>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className={selectMenuClass}>
                                        <SelectItem value="welfare" className={selectItemClass}>
                                            Social Welfare
                                        </SelectItem>
                                        <SelectItem value="scholarship" className={selectItemClass}>
                                            Scholarship Program
                                        </SelectItem>
                                        <SelectItem value="medical" className={selectItemClass}>
                                            Medical Assistance
                                        </SelectItem>
                                        <SelectItem value="emergency" className={selectItemClass}>
                                            Emergency Relief
                                        </SelectItem>
                                        <SelectItem value="mentorship" className={selectItemClass}>
                                            Mentorship & Development
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className={labelClass}>Target Amount (BDT)</label>
                                <input
                                    type="number"
                                    className={fieldClass}
                                    placeholder="e.g. 500000"
                                    value={targetAmount}
                                    onChange={(e) => setTargetAmount(e.target.value)}
                                />
                            </div>
                        </div>
                        <div>
                            <label className={labelClass}>Assigned Coordinator</label>
                            <Select value={coordinatorId} onValueChange={setCoordinatorId}>
                                <SelectTrigger className={selectTriggerClass}>
                                    <SelectValue placeholder="Select an alumnus coordinator..." />
                                </SelectTrigger>
                                <SelectContent className={selectMenuClass}>
                                    <SelectItem value="none" className={selectItemClass}>
                                        Central Committee (Unassigned)
                                    </SelectItem>
                                    {approvedMembers.map((m) => (
                                        <SelectItem key={m.id} value={String(m.id)} className={selectItemClass}>
                                            {m.user?.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label className={labelClass}>Scope & Objectives</label>
                            <textarea
                                rows={3}
                                className={textareaClass}
                                placeholder="Describe beneficiary criteria and execution timeline..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
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
                                Launch Initiative
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}
