import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    ShieldCheck,
    CheckCircle2,
    Ban,
    RotateCcw,
    GraduationCap,
    Briefcase,
    Mail,
    ArrowLeft,
    History,
    Lock,
} from 'lucide-react';
import type { Member, AuditLogItem } from '@/types';

interface MemberShowProps {
    member: Member;
    auditLogs: AuditLogItem[];
}

const fieldClass =
    'w-full rounded-md border !border-[#DBDFE9] !bg-[#FCFCFC] p-3 text-[13px] font-normal !text-[#071437] !shadow-none outline-none transition-all duration-200 placeholder:!text-[#99A1B7] hover:!border-[#C4CADA] focus:!border-[#1B84FF] focus:!bg-white focus:!ring-[3px] focus:!ring-[#1B84FF]/10 dark:!bg-[#FCFCFC] dark:!text-[#071437]';

const selectTriggerClass =
    '!h-10 w-full cursor-pointer rounded-md !border-[#DBDFE9] !bg-[#FCFCFC] px-3 text-[13px] font-normal !text-[#071437] !shadow-none transition-all duration-200 hover:!border-[#C4CADA] hover:!bg-[#FCFCFC] focus-visible:!border-[#1B84FF] focus-visible:!bg-white focus-visible:!ring-[3px] focus-visible:!ring-[#1B84FF]/10 dark:!bg-[#FCFCFC] dark:hover:!bg-[#FCFCFC]';

const selectMenuClass =
    'z-[60] rounded-xl !border-[#F1F1F4] !bg-white p-1 !text-[#071437] shadow-[0_12px_32px_-8px_rgba(7,20,55,0.16)] dark:!bg-white dark:!text-[#071437]';

const selectItemClass =
    'cursor-pointer rounded-lg py-2 pr-8 pl-2.5 text-[13px] text-[#071437] focus:!bg-[#F1F6FF] focus:!text-[#1B84FF] dark:text-[#071437]';

export default function MemberShow({ member, auditLogs }: MemberShowProps) {
    const [activeTab, setActiveTab] = useState<'overview' | 'applications' | 'verifications' | 'privacy' | 'audit'>('overview');
    const [verifyOpen, setVerifyOpen] = useState(false);
    const [verifyMethod, setVerifyMethod] = useState('committee_manual');
    const [evidenceNote, setEvidenceNote] = useState('');

    const [suspendOpen, setSuspendOpen] = useState(false);
    const [suspendReason, setSuspendReason] = useState('');

    const handleApprove = () => {
        router.post(`/admin/members/${member.id}/approve`, {}, { preserveScroll: true });
    };

    const handleVerifySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(
            `/admin/members/${member.id}/verify`,
            { method: verifyMethod, evidence_note: evidenceNote },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setVerifyOpen(false);
                    setEvidenceNote('');
                },
            }
        );
    };

    const handleSuspendSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(
            `/admin/members/${member.id}/suspend`,
            { reason: suspendReason },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setSuspendOpen(false);
                    setSuspendReason('');
                },
            }
        );
    };

    const handleReactivate = () => {
        router.post(`/admin/members/${member.id}/reactivate`, {}, { preserveScroll: true });
    };

    const handleAssignCode = () => {
        router.post(`/admin/members/${member.id}/assign-code`, {}, { preserveScroll: true });
    };

    const avatarPath = member.user?.avatar_path;

    return (
        <AdminLayout
            title={`Member: ${member.user?.name}`}
            breadcrumbs={[
                { title: 'Members', href: '/admin/members' },
                { title: member.user?.name || 'Profile' },
            ]}
        >
            <Head title={`${member.user?.name} - Member Profile - CCINTAKE 97 Admin`} />

            <div className="w-full space-y-6">
                {/* Back & Action Toolbar */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <Link
                        href="/admin/members"
                        className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-[#78829D] transition-colors hover:text-[#1B84FF]"
                    >
                        <ArrowLeft className="size-4" />
                        Back to Members Registry
                    </Link>

                    <div className="flex flex-wrap items-center gap-2">
                        {!member.member_code && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleAssignCode}
                                className="h-9 rounded-lg border-[#DBDFE9] !bg-white px-3.5 text-[12.5px] font-semibold text-[#4B5675] hover:!bg-[#F9F9F9] hover:text-[#071437]"
                            >
                                Assign Member Code
                            </Button>
                        )}
                        {member.membership_status === 'pending' && (
                            <Button
                                type="button"
                                onClick={handleApprove}
                                className="h-9 rounded-lg bg-[#17C653] px-3.5 text-[12.5px] font-semibold text-white hover:bg-[#13a845]"
                            >
                                <CheckCircle2 className="mr-1.5 size-3.5" /> Approve Membership
                            </Button>
                        )}
                        {member.verification_status !== 'verified' && (
                            <Button
                                type="button"
                                onClick={() => setVerifyOpen(true)}
                                className="h-9 rounded-lg bg-[#1B84FF] px-3.5 text-[12.5px] font-semibold text-white hover:bg-[#006AE6]"
                            >
                                <ShieldCheck className="mr-1.5 size-3.5" /> Verify 1997 Affiliation
                            </Button>
                        )}
                        {member.membership_status !== 'suspended' ? (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setSuspendOpen(true)}
                                className="h-9 rounded-lg border-[#DBDFE9] !bg-white px-3.5 text-[12.5px] font-semibold text-[#F8285A] hover:!bg-[#FFEEF3]"
                            >
                                <Ban className="mr-1.5 size-3.5" /> Suspend
                            </Button>
                        ) : (
                            <Button
                                type="button"
                                onClick={handleReactivate}
                                className="h-9 rounded-lg bg-[#B45309] px-3.5 text-[12.5px] font-semibold text-white hover:bg-[#92400E]"
                            >
                                <RotateCcw className="mr-1.5 size-3.5" /> Reactivate Member
                            </Button>
                        )}
                    </div>
                </div>

                {/* Profile Hero Header Card */}
                <div className="flex flex-col justify-between gap-5 rounded-xl border border-[#F1F1F4] bg-white p-5 shadow-[0_3px_4px_0_rgba(0,0,0,0.03)] sm:p-6 md:flex-row md:items-center">
                    <div className="flex items-center gap-4">
                        <div className="flex size-18 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#F1F6FF] text-[22px] font-semibold text-[#1B84FF] ring-2 ring-[#F1F1F4] sm:size-20">
                            {avatarPath ? (
                                <img src={`/storage/${avatarPath}`} alt={member.user?.name || 'Member'} className="size-full object-cover" />
                            ) : (
                                member.user?.name?.charAt(0) || 'A'
                            )}
                        </div>
                        <div className="min-w-0 space-y-1">
                            <div className="flex flex-wrap items-center gap-2.5">
                                <h1 className="text-[20px] font-bold tracking-tight text-[#071437]">
                                    {member.user?.name}
                                </h1>
                                <span className="rounded-md bg-[#FCFCFC] px-2 py-0.5 font-mono text-[11.5px] font-semibold text-[#4B5675] ring-1 ring-[#F1F1F4]">
                                    {member.member_code || 'PENDING ID'}
                                </span>
                            </div>
                            <div className="text-[13px] font-medium text-[#78829D]">
                                {member.profile?.designation
                                    ? `${member.profile.designation}${member.profile.organization ? ` at ${member.profile.organization}` : ''}`
                                    : 'Cadet College 1997 Alumnus'}
                            </div>
                            <div className="flex flex-wrap items-center gap-2 pt-1">
                                <span
                                    className={`inline-flex rounded-md px-2 py-0.5 text-[11px] font-semibold capitalize ${
                                        member.membership_status === 'approved'
                                            ? 'bg-[#EAFFF1] text-[#17C653]'
                                            : member.membership_status === 'suspended'
                                              ? 'bg-[#FFEEF3] text-[#F8285A]'
                                              : 'bg-[#FFF8DD] text-[#B45309]'
                                    }`}
                                >
                                    Status: {member.membership_status}
                                </span>
                                <span
                                    className={`inline-flex rounded-md px-2 py-0.5 text-[11px] font-semibold capitalize ${
                                        member.verification_status === 'verified'
                                            ? 'bg-[#EAFFF1] text-[#17C653]'
                                            : 'bg-[#FFF8DD] text-[#B45309]'
                                    }`}
                                >
                                    Verification: {member.verification_status}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="min-w-[230px] rounded-xl border border-[#F1F1F4] bg-[#FCFCFC] p-4">
                        <div className="flex items-center gap-2 text-[12.5px] font-semibold text-[#1B84FF]">
                            <GraduationCap className="size-4" />
                            <span>{member.college?.name || 'College not selected'}</span>
                        </div>
                        <div className="mt-1 text-[12px] text-[#4B5675]">
                            Cadet Roll #{member.college_roll_no || 'N/A'} · Intake {member.intake_year || '1997'}
                        </div>
                        <div className="mt-1 text-[11.5px] text-[#99A1B7]">
                            Profile Completion: {member.profile?.profile_completion || 0}%
                        </div>
                    </div>
                </div>

                {/* Metronic Underline Tabs */}
                <div className="space-y-5">
                    <div
                        role="tablist"
                        className="flex w-full items-center gap-6 overflow-x-auto border-b border-[#F1F1F4] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                    >
                        {[
                            { value: 'overview' as const, label: 'Overview & Contact' },
                            { value: 'applications' as const, label: `Applications (${member.applications?.length || 0})` },
                            { value: 'verifications' as const, label: `Verifications (${member.verifications?.length || 0})` },
                            { value: 'privacy' as const, label: 'Privacy Settings' },
                            { value: 'audit' as const, label: 'Audit History' },
                        ].map((tab) => {
                            const active = activeTab === tab.value;
                            return (
                                <button
                                    key={tab.value}
                                    type="button"
                                    role="tab"
                                    aria-selected={active}
                                    onClick={() => setActiveTab(tab.value)}
                                    className={`flex-none cursor-pointer border-b-2 px-1 pt-1.5 pb-3 text-[13px] transition-colors duration-200 outline-none focus:outline-none ${
                                        active
                                            ? 'border-[#1B84FF] font-semibold text-[#1B84FF]'
                                            : 'border-transparent font-medium text-[#78829D] hover:text-[#071437]'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>

                    {/* Overview Tab */}
                    {activeTab === 'overview' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <section className="rounded-xl border border-[#F1F1F4] bg-white p-5 shadow-[0_3px_4px_0_rgba(0,0,0,0.03)] sm:p-6">
                                    <h2 className="flex items-center gap-2 border-b border-[#F1F1F4] pb-3.5 text-[15px] font-semibold text-[#071437]">
                                        <Mail className="size-4 text-[#1B84FF]" />
                                        Contact &amp; Location
                                    </h2>
                                    <dl className="mt-2 divide-y divide-[#F1F1F4] text-[13px]">
                                        <div className="flex items-center justify-between py-2.5">
                                            <dt className="text-[#78829D]">Email Address</dt>
                                            <dd className="font-semibold text-[#071437]">{member.user?.email}</dd>
                                        </div>
                                        <div className="flex items-center justify-between py-2.5">
                                            <dt className="text-[#78829D]">Phone Number</dt>
                                            <dd className="font-semibold text-[#071437]">{member.user?.phone || 'Not provided'}</dd>
                                        </div>
                                        <div className="flex items-center justify-between py-2.5">
                                            <dt className="text-[#78829D]">Location</dt>
                                            <dd className="font-semibold text-[#071437]">
                                                {member.profile?.city ? `${member.profile.city}, ${member.profile.country_code}` : member.profile?.country_code || '—'}
                                            </dd>
                                        </div>
                                        <div className="flex items-center justify-between gap-4 py-2.5">
                                            <dt className="shrink-0 text-[#78829D]">Present Address</dt>
                                            <dd className="text-right font-semibold text-[#071437]">{member.profile?.address || '—'}</dd>
                                        </div>
                                    </dl>
                                </section>

                                <section className="rounded-xl border border-[#F1F1F4] bg-white p-5 shadow-[0_3px_4px_0_rgba(0,0,0,0.03)] sm:p-6">
                                    <h2 className="flex items-center gap-2 border-b border-[#F1F1F4] pb-3.5 text-[15px] font-semibold text-[#071437]">
                                        <Briefcase className="size-4 text-[#17C653]" />
                                        Professional Profile
                                    </h2>
                                    <dl className="mt-2 divide-y divide-[#F1F1F4] text-[13px]">
                                        <div className="flex items-center justify-between py-2.5">
                                            <dt className="text-[#78829D]">Current Designation</dt>
                                            <dd className="font-semibold text-[#071437]">{member.profile?.designation || '—'}</dd>
                                        </div>
                                        <div className="flex items-center justify-between py-2.5">
                                            <dt className="text-[#78829D]">Current Organization</dt>
                                            <dd className="font-semibold text-[#071437]">{member.profile?.organization || '—'}</dd>
                                        </div>
                                        <div className="flex items-center justify-between py-2.5">
                                            <dt className="text-[#78829D]">Industry</dt>
                                            <dd className="font-semibold text-[#071437]">{member.profile?.industry?.name || '—'}</dd>
                                        </div>
                                        <div className="flex items-center justify-between py-2.5">
                                            <dt className="text-[#78829D]">Owns Business</dt>
                                            <dd className="font-semibold text-[#071437]">{member.profile?.owns_business ? 'Yes' : 'No'}</dd>
                                        </div>
                                    </dl>
                                </section>
                            </div>

                            {member.profile?.professional_bio && (
                                <section className="rounded-xl border border-[#F1F1F4] bg-white p-5 shadow-[0_3px_4px_0_rgba(0,0,0,0.03)] sm:p-6">
                                    <h2 className="border-b border-[#F1F1F4] pb-3 text-[15px] font-semibold text-[#071437]">
                                        Professional Biography
                                    </h2>
                                    <p className="mt-3 text-[13px] leading-relaxed text-[#4B5675]">
                                        {member.profile.professional_bio}
                                    </p>
                                </section>
                            )}
                        </div>
                    )}

                    {/* Applications Tab */}
                    {activeTab === 'applications' && (
                        <section className="rounded-xl border border-[#F1F1F4] bg-white p-5 shadow-[0_3px_4px_0_rgba(0,0,0,0.03)] sm:p-6">
                            {member.applications?.length === 0 ? (
                                <div className="py-8 text-center text-[13px] text-[#99A1B7]">
                                    No membership applications submitted yet.
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {member.applications?.map((app: any) => (
                                        <div
                                            key={app.id}
                                            className="flex flex-col justify-between gap-3 rounded-xl border border-[#F1F1F4] bg-[#FCFCFC] p-4 sm:flex-row sm:items-center"
                                        >
                                            <div>
                                                <div className="flex items-center gap-2 font-semibold text-[#071437]">
                                                    <span className="font-mono text-[13px]">{app.application_no}</span>
                                                    <span className="rounded-md bg-[#F1F6FF] px-2 py-0.5 font-mono text-[10.5px] font-semibold text-[#1B84FF] uppercase">
                                                        {app.status}
                                                    </span>
                                                </div>
                                                <div className="mt-1 text-[12px] text-[#78829D]">
                                                    Declared: {app.declared_college?.name} (Roll #{app.declared_roll_no}) · Submitted:{' '}
                                                    {new Date(app.submitted_at).toLocaleDateString('en-US')}
                                                </div>
                                            </div>
                                            <Link
                                                href={`/admin/applications/${app.id}`}
                                                className="inline-flex h-8.5 items-center self-start rounded-lg border border-[#DBDFE9] bg-white px-3 text-[12px] font-semibold text-[#4B5675] hover:bg-[#F9F9F9] hover:text-[#071437] sm:self-auto"
                                            >
                                                View Review Details
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    )}

                    {/* Verifications Tab */}
                    {activeTab === 'verifications' && (
                        <section className="rounded-xl border border-[#F1F1F4] bg-white p-5 shadow-[0_3px_4px_0_rgba(0,0,0,0.03)] sm:p-6">
                            {member.verifications?.length === 0 ? (
                                <div className="py-8 text-center text-[13px] text-[#99A1B7]">
                                    No formal verification events recorded yet.
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {member.verifications?.map((v: any) => (
                                        <div key={v.id} className="space-y-1 rounded-xl border border-[#F1F1F4] bg-[#FCFCFC] p-4 text-[13px]">
                                            <div className="flex items-center justify-between font-semibold">
                                                <span className="flex items-center gap-1.5 text-[#1B84FF]">
                                                    <ShieldCheck className="size-4" />
                                                    Method: {v.method.replace('_', ' ').toUpperCase()}
                                                </span>
                                                <span className="text-[11.5px] text-[#99A1B7]">
                                                    {new Date(v.verified_at).toLocaleDateString('en-US')}
                                                </span>
                                            </div>
                                            <p className="text-[#4B5675]">Evidence: {v.evidence_note}</p>
                                            <div className="text-[11.5px] text-[#99A1B7]">
                                                Verified by: {v.verified_by?.name || 'Administrator'}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    )}

                    {/* Privacy Tab */}
                    {activeTab === 'privacy' && (
                        <section className="rounded-xl border border-[#F1F1F4] bg-white p-5 shadow-[0_3px_4px_0_rgba(0,0,0,0.03)] sm:p-6">
                            <h2 className="flex items-center gap-2 border-b border-[#F1F1F4] pb-3.5 text-[15px] font-semibold text-[#071437]">
                                <Lock className="size-4 text-[#78829D]" />
                                Active Field Privacy Policies
                            </h2>
                            <div className="mt-2 divide-y divide-[#F1F1F4] text-[13px]">
                                {member.privacy_settings?.map((p) => (
                                    <div key={p.id} className="flex items-center justify-between py-3">
                                        <span className="font-medium text-[#4B5675] capitalize">
                                            {p.field_key.replace('_', ' ')}
                                        </span>
                                        <span className="rounded-md bg-[#F1F6FF] px-2.5 py-0.5 text-[11px] font-semibold text-[#1B84FF] capitalize">
                                            {p.visibility.replace('_', ' ')}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Audit Tab */}
                    {activeTab === 'audit' && (
                        <section className="overflow-hidden rounded-xl border border-[#F1F1F4] bg-white shadow-[0_3px_4px_0_rgba(0,0,0,0.03)]">
                            <div className="border-b border-[#F1F1F4] px-5 py-4 sm:px-6">
                                <h2 className="flex items-center gap-2 text-[15px] font-semibold text-[#071437]">
                                    <History className="size-4 text-[#1B84FF]" />
                                    Administrative Action History
                                </h2>
                            </div>
                            <div className="divide-y divide-[#F1F1F4] text-[13px]">
                                {auditLogs.map((log) => (
                                    <div key={log.id} className="flex items-center justify-between gap-4 px-5 py-3.5 sm:px-6">
                                        <div>
                                            <div className="font-semibold text-[#071437]">{log.action}</div>
                                            <div className="text-[11.5px] text-[#99A1B7]">
                                                Actor: {log.user?.name || 'System'} · IP: {log.ip_address}
                                            </div>
                                        </div>
                                        <div className="shrink-0 text-[11.5px] text-[#99A1B7]">
                                            {new Date(log.created_at).toLocaleString()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>

            {/* Verification Dialog */}
            <Dialog open={verifyOpen} onOpenChange={setVerifyOpen}>
                <DialogContent className="rounded-2xl border-[#F1F1F4] !bg-white p-0 !text-[#071437] shadow-[0_20px_50px_-12px_rgba(7,20,55,0.18)] sm:max-w-lg">
                    <DialogHeader className="border-b border-[#F1F1F4] px-6 py-5">
                        <DialogTitle className="flex items-center gap-2 text-[16px] font-semibold text-[#071437]">
                            <ShieldCheck className="size-5 text-[#1B84FF]" />
                            Verify 1997 Cadet Affiliation
                        </DialogTitle>
                        <DialogDescription className="mt-1 text-[12.5px] text-[#78829D]">
                            Verify authentic membership for <strong className="text-[#071437]">{member.user?.name}</strong>.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleVerifySubmit} className="space-y-4 px-6 py-5">
                        <div>
                            <label className="mb-1.5 block text-[12.5px] font-semibold text-[#071437]">
                                Method <span className="text-[#F8285A]">*</span>
                            </label>
                            <Select value={verifyMethod} onValueChange={setVerifyMethod}>
                                <SelectTrigger className={selectTriggerClass}>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className={selectMenuClass}>
                                    <SelectItem value="committee_manual" className={selectItemClass}>Committee Manual Verification</SelectItem>
                                    <SelectItem value="college_record" className={selectItemClass}>Cadet College Roll / Official Archive Record</SelectItem>
                                    <SelectItem value="alumni_reference" className={selectItemClass}>Batchmate Reference</SelectItem>
                                    <SelectItem value="document_proof" className={selectItemClass}>Documentary Proof</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label className="mb-1.5 block text-[12.5px] font-semibold text-[#071437]">
                                Evidence Note <span className="text-[#F8285A]">*</span>
                            </label>
                            <textarea
                                required
                                rows={3}
                                placeholder="Enter verification evidence note..."
                                value={evidenceNote}
                                onChange={(e) => setEvidenceNote(e.target.value)}
                                className={fieldClass}
                            />
                        </div>
                        <DialogFooter className="border-t border-[#F1F1F4] pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setVerifyOpen(false)}
                                className="h-9.5 rounded-lg border-[#DBDFE9] !bg-white px-4 text-[12.5px] font-semibold text-[#4B5675] hover:!bg-[#F9F9F9]"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="h-9.5 rounded-lg bg-[#1B84FF] px-4 text-[12.5px] font-semibold text-white hover:bg-[#006AE6]"
                            >
                                Confirm Verification
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Suspension Dialog */}
            <Dialog open={suspendOpen} onOpenChange={setSuspendOpen}>
                <DialogContent className="rounded-2xl border-[#F1F1F4] !bg-white p-0 !text-[#071437] shadow-[0_20px_50px_-12px_rgba(7,20,55,0.18)] sm:max-w-lg">
                    <DialogHeader className="border-b border-[#F1F1F4] px-6 py-5">
                        <DialogTitle className="flex items-center gap-2 text-[16px] font-semibold text-[#F8285A]">
                            <Ban className="size-5" />
                            Suspend Alumni Account
                        </DialogTitle>
                        <DialogDescription className="mt-1 text-[12.5px] text-[#78829D]">
                            Document the rationale for suspending this member.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSuspendSubmit} className="space-y-4 px-6 py-5">
                        <div>
                            <label className="mb-1.5 block text-[12.5px] font-semibold text-[#071437]">
                                Suspension Reason <span className="text-[#F8285A]">*</span>
                            </label>
                            <textarea
                                required
                                rows={3}
                                placeholder="Enter suspension reason..."
                                value={suspendReason}
                                onChange={(e) => setSuspendReason(e.target.value)}
                                className={fieldClass}
                            />
                        </div>
                        <DialogFooter className="border-t border-[#F1F1F4] pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setSuspendOpen(false)}
                                className="h-9.5 rounded-lg border-[#DBDFE9] !bg-white px-4 text-[12.5px] font-semibold text-[#4B5675] hover:!bg-[#F9F9F9]"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="h-9.5 rounded-lg bg-[#F8285A] px-4 text-[12.5px] font-semibold text-white hover:bg-[#e11d48]"
                            >
                                Confirm Suspension
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}
