import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    ArrowLeft,
    CheckCircle2,
    XCircle,
    Clock,
    HelpCircle,
    GraduationCap,
    UserCheck,
    History,
} from 'lucide-react';
import type { MembershipApplication } from '@/types';

interface ApplicationShowProps {
    application: MembershipApplication;
}

export default function ApplicationShow({ application }: ApplicationShowProps) {
    const [selectedDecision, setSelectedDecision] = useState<'approved' | 'rejected' | 'under_review' | 'info_required'>('approved');
    const [decisionNote, setDecisionNote] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(`/admin/applications/${application.id}/decide`, {
            status: selectedDecision,
            note: decisionNote,
        }, {
            onSuccess: () => {
                setDecisionNote('');
            },
        });
    };

    return (
        <AdminLayout
            title={`Application #${application.application_no}`}
            breadcrumbs={[
                { title: 'Applications', href: '/admin/applications' },
                { title: application.application_no },
            ]}
        >
            <Head title={`Application ${application.application_no} - INTAKE 97 Admin`} />

            <div className="space-y-6">
                <Link
                    href="/admin/applications"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white"
                >
                    <ArrowLeft className="size-4" />
                    Back to Applications Queue
                </Link>

                {/* Hero Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                                Application #{application.application_no}
                            </h1>
                            <Badge
                                className={`text-[10px] capitalize ${
                                    application.status === 'approved'
                                        ? 'bg-emerald-100 text-emerald-800'
                                        : application.status === 'submitted'
                                        ? 'bg-amber-100 text-amber-800'
                                        : application.status === 'under_review'
                                        ? 'bg-blue-100 text-blue-800'
                                        : 'bg-rose-100 text-rose-800'
                                }`}
                            >
                                {application.status.replace('_', ' ')}
                            </Badge>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                            Submitted on {new Date(application.submitted_at).toLocaleString()}
                        </p>
                    </div>

                    <div className="text-xs text-slate-600 dark:text-slate-400">
                        Applicant: <strong>{application.member?.user?.name}</strong> ({application.member?.user?.email})
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: 2 Columns - Credentials Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Cadet College Credential Declaration */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                    <GraduationCap className="size-4 text-emerald-600" />
                                    Declared Cadet College Credentials
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-xs">
                                <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
                                    <div>
                                        <div className="text-slate-400 text-[11px]">Declared Cadet College</div>
                                        <div className="font-bold text-sm text-slate-900 dark:text-white mt-0.5">
                                            {application.declared_college?.name}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-slate-400 text-[11px]">Declared College Roll #</div>
                                        <div className="font-bold text-sm text-slate-900 dark:text-white mt-0.5">
                                            {application.declared_roll_no}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-slate-400 text-[11px]">Community Intake Year</div>
                                        <div className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                                            1997 (Strict Batch Rule)
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-slate-400 text-[11px]">Alumni Reference</div>
                                        <div className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                                            {application.reference_name || 'None Declared'} {application.reference_phone ? `(${application.reference_phone})` : ''}
                                        </div>
                                    </div>
                                </div>

                                <div className="p-3 bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/60 rounded-lg text-amber-800 dark:text-amber-300 text-[11px] leading-relaxed">
                                    <strong>Important Verification Policy:</strong> Do not approve an application solely based on declared name. Cross-reference college records, batch databases, or obtain confirmation from a Cadet College intake coordinator.
                                </div>
                            </CardContent>
                        </Card>

                        {/* Review History */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                    <History className="size-4 text-blue-600" />
                                    Review & Decision Audit History
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                                    {application.reviews?.length === 0 ? (
                                        <div className="p-4 text-center text-slate-400 text-xs">
                                            No decisions logged yet.
                                        </div>
                                    ) : (
                                        application.reviews?.map((r) => (
                                            <div key={r.id} className="p-4 space-y-1">
                                                <div className="flex items-center justify-between font-semibold">
                                                    <span className="text-slate-800 dark:text-slate-200">
                                                        Transition: {r.from_status} → {r.to_status}
                                                    </span>
                                                    <span className="text-slate-400 text-[11px]">
                                                        {new Date(r.created_at).toLocaleString()}
                                                    </span>
                                                </div>
                                                {r.note && (
                                                    <p className="text-slate-600 dark:text-slate-300 text-[11px]">
                                                        Note: {r.note}
                                                    </p>
                                                )}
                                                <div className="text-[10px] text-slate-400">
                                                    Action by: {r.actor?.name || 'Reviewer'}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right: Decision Action Card */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                    <UserCheck className="size-4 text-indigo-600" />
                                    Review Decision
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="text-xs font-semibold block mb-1.5 text-slate-700 dark:text-slate-300">
                                            Target Decision Status
                                        </label>
                                        <div className="space-y-2">
                                            <label className="flex items-center gap-2 p-2 rounded-lg border text-xs cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800">
                                                <input
                                                    type="radio"
                                                    name="decision"
                                                    value="approved"
                                                    checked={selectedDecision === 'approved'}
                                                    onChange={() => setSelectedDecision('approved')}
                                                    className="text-emerald-600"
                                                />
                                                <CheckCircle2 className="size-4 text-emerald-600" />
                                                <span className="font-medium">Approve Application</span>
                                            </label>

                                            <label className="flex items-center gap-2 p-2 rounded-lg border text-xs cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800">
                                                <input
                                                    type="radio"
                                                    name="decision"
                                                    value="under_review"
                                                    checked={selectedDecision === 'under_review'}
                                                    onChange={() => setSelectedDecision('under_review')}
                                                    className="text-blue-600"
                                                />
                                                <Clock className="size-4 text-blue-600" />
                                                <span className="font-medium">Mark Under Review</span>
                                            </label>

                                            <label className="flex items-center gap-2 p-2 rounded-lg border text-xs cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800">
                                                <input
                                                    type="radio"
                                                    name="decision"
                                                    value="info_required"
                                                    checked={selectedDecision === 'info_required'}
                                                    onChange={() => setSelectedDecision('info_required')}
                                                    className="text-amber-600"
                                                />
                                                <HelpCircle className="size-4 text-amber-600" />
                                                <span className="font-medium">Request Additional Info</span>
                                            </label>

                                            <label className="flex items-center gap-2 p-2 rounded-lg border text-xs cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800">
                                                <input
                                                    type="radio"
                                                    name="decision"
                                                    value="rejected"
                                                    checked={selectedDecision === 'rejected'}
                                                    onChange={() => setSelectedDecision('rejected')}
                                                    className="text-rose-600"
                                                />
                                                <XCircle className="size-4 text-rose-600" />
                                                <span className="font-medium text-rose-600">Reject Application</span>
                                            </label>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-xs font-semibold block mb-1 text-slate-700 dark:text-slate-300">
                                            Decision / Internal Note
                                        </label>
                                        <textarea
                                            rows={3}
                                            placeholder="Provide context or explanation for applicant and reviewer logs..."
                                            value={decisionNote}
                                            onChange={(e) => setDecisionNote(e.target.value)}
                                            className="w-full text-xs rounded-md border p-2 bg-white dark:bg-slate-900"
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        className={`w-full text-xs font-semibold ${
                                            selectedDecision === 'approved'
                                                ? 'bg-emerald-600 hover:bg-emerald-700'
                                                : selectedDecision === 'rejected'
                                                ? 'bg-rose-600 hover:bg-rose-700'
                                                : 'bg-indigo-600 hover:bg-indigo-700'
                                        }`}
                                    >
                                        Submit Decision
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
