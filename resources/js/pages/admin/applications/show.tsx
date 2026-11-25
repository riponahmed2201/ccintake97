import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
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

const fieldClass =
    'w-full rounded-md border !border-[#DBDFE9] !bg-[#FCFCFC] p-3 text-[13px] font-normal !text-[#071437] !shadow-none outline-none transition-all duration-200 placeholder:!text-[#99A1B7] hover:!border-[#C4CADA] focus:!border-[#1B84FF] focus:!bg-white focus:!ring-[3px] focus:!ring-[#1B84FF]/10 dark:!bg-[#FCFCFC] dark:!text-[#071437]';

export default function ApplicationShow({ application }: ApplicationShowProps) {
    const [selectedDecision, setSelectedDecision] = useState<'approved' | 'rejected' | 'under_review' | 'info_required'>('approved');
    const [decisionNote, setDecisionNote] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(
            `/admin/applications/${application.id}/decide`,
            {
                status: selectedDecision,
                note: decisionNote,
            },
            {
                preserveScroll: true,
                onSuccess: () => setDecisionNote(''),
            }
        );
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

            <div className="w-full space-y-6">
                <div>
                    <Link
                        href="/admin/applications"
                        className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-[#78829D] transition-colors hover:text-[#1B84FF]"
                    >
                        <ArrowLeft className="size-4" />
                        Back to Applications Queue
                    </Link>
                </div>

                {/* Hero Header */}
                <div className="flex flex-col justify-between gap-4 rounded-xl border border-[#F1F1F4] bg-white p-5 shadow-[0_3px_4px_0_rgba(0,0,0,0.03)] sm:flex-row sm:items-center sm:p-6">
                    <div>
                        <div className="flex flex-wrap items-center gap-2.5">
                            <h1 className="text-[20px] font-bold tracking-tight text-[#071437]">
                                Application #{application.application_no}
                            </h1>
                            <span
                                className={`inline-flex rounded-md px-2.5 py-0.5 text-[11px] font-semibold capitalize ${
                                    application.status === 'approved'
                                        ? 'bg-[#EAFFF1] text-[#17C653]'
                                        : application.status === 'submitted'
                                          ? 'bg-[#FFF8DD] text-[#B45309]'
                                          : application.status === 'under_review'
                                            ? 'bg-[#F1F6FF] text-[#1B84FF]'
                                            : 'bg-[#FFEEF3] text-[#F8285A]'
                                }`}
                            >
                                {application.status.replace('_', ' ')}
                            </span>
                        </div>
                        <p className="mt-1 text-[12.5px] text-[#78829D]">
                            Submitted on {new Date(application.submitted_at).toLocaleString()}
                        </p>
                    </div>

                    <div className="text-[13px] text-[#4B5675]">
                        Applicant: <strong className="font-semibold text-[#071437]">{application.member?.user?.name}</strong>{' '}
                        <span className="text-[#78829D]">({application.member?.user?.email})</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Left: 2 Columns */}
                    <div className="space-y-6 lg:col-span-2">
                        <section className="rounded-xl border border-[#F1F1F4] bg-white p-5 shadow-[0_3px_4px_0_rgba(0,0,0,0.03)] sm:p-6">
                            <h2 className="flex items-center gap-2 border-b border-[#F1F1F4] pb-3.5 text-[15px] font-semibold text-[#071437]">
                                <GraduationCap className="size-4 text-[#1B84FF]" />
                                Declared Cadet College Credentials
                            </h2>

                            <div className="mt-4 grid grid-cols-1 gap-4 rounded-xl border border-[#F1F1F4] bg-[#FCFCFC] p-4 sm:grid-cols-2">
                                <div>
                                    <div className="text-[11.5px] text-[#99A1B7]">Declared Cadet College</div>
                                    <div className="mt-0.5 text-[14px] font-semibold text-[#071437]">
                                        {application.declared_college?.name}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-[11.5px] text-[#99A1B7]">Declared College Roll #</div>
                                    <div className="mt-0.5 text-[14px] font-semibold text-[#071437]">
                                        {application.declared_roll_no}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-[11.5px] text-[#99A1B7]">Community Intake Year</div>
                                    <div className="mt-0.5 text-[13px] font-semibold text-[#071437]">
                                        1997 (Strict Batch Rule)
                                    </div>
                                </div>
                                <div>
                                    <div className="text-[11.5px] text-[#99A1B7]">Alumni Reference</div>
                                    <div className="mt-0.5 text-[13px] font-semibold text-[#071437]">
                                        {application.reference_name || 'None Declared'}{' '}
                                        {application.reference_phone ? `(${application.reference_phone})` : ''}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 rounded-xl border border-[#F6C000]/30 bg-[#FFFBEB] p-3.5 text-[12px] leading-relaxed text-[#92400E]">
                                <strong>Important Verification Policy:</strong> Do not approve an application solely based on declared name. Cross-reference college records, batch databases, or obtain confirmation from a Cadet College intake coordinator.
                            </div>
                        </section>

                        <section className="overflow-hidden rounded-xl border border-[#F1F1F4] bg-white shadow-[0_3px_4px_0_rgba(0,0,0,0.03)]">
                            <div className="border-b border-[#F1F1F4] px-5 py-4 sm:px-6">
                                <h2 className="flex items-center gap-2 text-[15px] font-semibold text-[#071437]">
                                    <History className="size-4 text-[#1B84FF]" />
                                    Review &amp; Decision Audit History
                                </h2>
                            </div>
                            <div className="divide-y divide-[#F1F1F4] text-[13px]">
                                {application.reviews?.length === 0 ? (
                                    <div className="p-6 text-center text-[12.5px] text-[#99A1B7]">
                                        No decisions logged yet.
                                    </div>
                                ) : (
                                    application.reviews?.map((r) => (
                                        <div key={r.id} className="space-y-1 px-5 py-4 sm:px-6">
                                            <div className="flex items-center justify-between font-semibold">
                                                <span className="text-[#071437]">
                                                    Transition: {r.from_status} → {r.to_status}
                                                </span>
                                                <span className="text-[11.5px] font-normal text-[#99A1B7]">
                                                    {new Date(r.created_at).toLocaleString()}
                                                </span>
                                            </div>
                                            {r.note && <p className="text-[12.5px] text-[#4B5675]">Note: {r.note}</p>}
                                            <div className="text-[11.5px] text-[#99A1B7]">
                                                Action by: {r.actor?.name || 'Reviewer'}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </section>
                    </div>

                    {/* Right: Decision Action Card */}
                    <div>
                        <section className="rounded-xl border border-[#F1F1F4] bg-white p-5 shadow-[0_3px_4px_0_rgba(0,0,0,0.03)] sm:p-6">
                            <h2 className="flex items-center gap-2 border-b border-[#F1F1F4] pb-3.5 text-[15px] font-semibold text-[#071437]">
                                <UserCheck className="size-4 text-[#1B84FF]" />
                                Review Decision
                            </h2>

                            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                                <div>
                                    <label className="mb-2 block text-[12.5px] font-semibold text-[#071437]">
                                        Target Decision Status
                                    </label>
                                    <div className="space-y-2">
                                        {[
                                            { value: 'approved' as const, label: 'Approve Application', icon: CheckCircle2, color: 'text-[#17C653]' },
                                            { value: 'under_review' as const, label: 'Mark Under Review', icon: Clock, color: 'text-[#1B84FF]' },
                                            { value: 'info_required' as const, label: 'Request Additional Info', icon: HelpCircle, color: 'text-[#B45309]' },
                                            { value: 'rejected' as const, label: 'Reject Application', icon: XCircle, color: 'text-[#F8285A]' },
                                        ].map((opt) => {
                                            const Icon = opt.icon;
                                            const active = selectedDecision === opt.value;
                                            return (
                                                <label
                                                    key={opt.value}
                                                    className={`flex cursor-pointer items-center gap-2.5 rounded-lg border p-2.5 text-[12.5px] transition-colors ${
                                                        active
                                                            ? 'border-[#1B84FF] bg-[#F1F6FF]/60'
                                                            : 'border-[#F1F1F4] bg-[#FCFCFC] hover:bg-[#F9F9F9]'
                                                    }`}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="decision"
                                                        value={opt.value}
                                                        checked={active}
                                                        onChange={() => setSelectedDecision(opt.value)}
                                                        className="text-[#1B84FF]"
                                                    />
                                                    <Icon className={`size-4 ${opt.color}`} />
                                                    <span className={`font-semibold ${opt.value === 'rejected' ? 'text-[#F8285A]' : 'text-[#071437]'}`}>
                                                        {opt.label}
                                                    </span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-[12.5px] font-semibold text-[#071437]">
                                        Decision / Internal Note
                                    </label>
                                    <textarea
                                        rows={3}
                                        placeholder="Provide context or explanation for applicant and reviewer logs..."
                                        value={decisionNote}
                                        onChange={(e) => setDecisionNote(e.target.value)}
                                        className={fieldClass}
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    className={`h-10 w-full rounded-lg text-[13px] font-semibold text-white ${
                                        selectedDecision === 'approved'
                                            ? 'bg-[#17C653] hover:bg-[#13a845]'
                                            : selectedDecision === 'rejected'
                                              ? 'bg-[#F8285A] hover:bg-[#e11d48]'
                                              : 'bg-[#1B84FF] hover:bg-[#006AE6]'
                                    }`}
                                >
                                    Submit Decision
                                </Button>
                            </form>
                        </section>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
