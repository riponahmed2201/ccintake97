import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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

export default function InitiativesIndex({ initiatives, approvedMembers }: InitiativesIndexProps) {
    const [createOpen, setCreateOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState<'scholarship' | 'welfare' | 'medical' | 'emergency' | 'mentorship'>('welfare');
    const [coordinatorId, setCoordinatorId] = useState('');
    const [budget, setBudget] = useState('');
    const [targetAmount, setTargetAmount] = useState('');
    const [description, setDescription] = useState('');

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/admin/initiatives', {
            title,
            category,
            coordinator_member_id: coordinatorId ? parseInt(coordinatorId) : null,
            budget: budget ? parseFloat(budget) : null,
            target_amount: targetAmount ? parseFloat(targetAmount) : null,
            description,
            status: 'active',
        }, {
            onSuccess: () => {
                setCreateOpen(false);
                setTitle('');
                setDescription('');
            },
        });
    };

    return (
        <AdminLayout
            title="Community Welfare & Initiatives"
            breadcrumbs={[{ title: 'Initiatives' }]}
        >
            <Head title="Community Initiatives - INTAKE 97 Admin" />

            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                            Community Welfare & Initiatives
                        </h1>
                        <p className="text-xs text-slate-500 mt-1">
                            Track social impact projects, scholarship programs, and emergency assistance funds.
                        </p>
                    </div>
                    <Button
                        size="sm"
                        onClick={() => setCreateOpen(true)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-xs font-semibold"
                    >
                        <Plus className="size-3.5 mr-1" /> New Initiative
                    </Button>
                </div>

                <Card className="overflow-hidden">
                    <Table>
                        <TableHeader className="bg-slate-50 dark:bg-slate-900/60">
                            <TableRow>
                                <TableHead className="text-xs font-semibold">Initiative Title</TableHead>
                                <TableHead className="text-xs font-semibold">Category</TableHead>
                                <TableHead className="text-xs font-semibold">Coordinator</TableHead>
                                <TableHead className="text-xs font-semibold">Budget / Target</TableHead>
                                <TableHead className="text-xs font-semibold">Funds Raised</TableHead>
                                <TableHead className="text-xs font-semibold">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {initiatives.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-28 text-center text-xs text-slate-500">
                                        No initiatives recorded yet.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                initiatives.data.map((ini) => (
                                    <TableRow key={ini.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                                        <TableCell>
                                            <div className="font-semibold text-xs text-slate-900 dark:text-white flex items-center gap-2">
                                                <HeartHandshake className="size-4 text-pink-600" />
                                                {ini.title}
                                            </div>
                                            <div className="text-[11px] text-slate-400 line-clamp-1">
                                                {ini.description || '—'}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="text-[10px] capitalize">
                                                {ini.category}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-xs text-slate-800 dark:text-slate-200">
                                            {ini.coordinator?.user?.name || 'Central Committee'}
                                        </TableCell>
                                        <TableCell className="text-xs font-semibold">
                                            BDT {Number(ini.target_amount || ini.budget || 0).toLocaleString()}
                                        </TableCell>
                                        <TableCell className="text-xs font-bold text-emerald-600">
                                            BDT {Number(ini.raised_amount || 0).toLocaleString()}
                                        </TableCell>
                                        <TableCell>
                                            <Badge className="bg-emerald-100 text-emerald-800 text-[10px] capitalize">
                                                {ini.status}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </Card>
            </div>

            {/* Create Initiative Dialog */}
            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-sm font-semibold">Launch Community Initiative</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCreate} className="space-y-3 py-2 text-xs">
                        <div>
                            <label className="font-semibold block mb-1">Title *</label>
                            <Input
                                required
                                placeholder="e.g. Flood Relief Fund for Batchmates"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="font-semibold block mb-1">Category *</label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value as any)}
                                    className="w-full text-xs rounded-md border p-2 bg-white dark:bg-slate-900"
                                >
                                    <option value="welfare">Social Welfare</option>
                                    <option value="scholarship">Scholarship Program</option>
                                    <option value="medical">Medical Assistance</option>
                                    <option value="emergency">Emergency Relief</option>
                                    <option value="mentorship">Mentorship & Development</option>
                                </select>
                            </div>
                            <div>
                                <label className="font-semibold block mb-1">Target Amount (BDT)</label>
                                <Input
                                    type="number"
                                    placeholder="e.g. 500000"
                                    value={targetAmount}
                                    onChange={(e) => setTargetAmount(e.target.value)}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="font-semibold block mb-1">Assigned Coordinator</label>
                            <select
                                value={coordinatorId}
                                onChange={(e) => setCoordinatorId(e.target.value)}
                                className="w-full text-xs rounded-md border p-2 bg-white dark:bg-slate-900"
                            >
                                <option value="">Select an alumnus coordinator...</option>
                                {approvedMembers.map((m) => (
                                    <option key={m.id} value={m.id}>{m.user?.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="font-semibold block mb-1">Scope & Objectives</label>
                            <textarea
                                rows={3}
                                className="w-full text-xs rounded-md border p-2"
                                placeholder="Describe beneficiary criteria and execution timeline..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" size="sm" onClick={() => setCreateOpen(false)}>Cancel</Button>
                            <Button type="submit" size="sm" className="bg-emerald-600 hover:bg-emerald-700">Launch Initiative</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}
