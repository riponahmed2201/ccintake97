import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
    Globe,
    Mail,
    Phone,
    MapPin,
    ArrowLeft,
    FileText,
    History,
    Lock,
} from 'lucide-react';
import type { Member, AuditLogItem } from '@/types';

interface MemberShowProps {
    member: Member;
    auditLogs: AuditLogItem[];
}

export default function MemberShow({ member, auditLogs }: MemberShowProps) {
    const [verifyOpen, setVerifyOpen] = useState(false);
    const [verifyMethod, setVerifyMethod] = useState('committee_manual');
    const [evidenceNote, setEvidenceNote] = useState('');

    const [suspendOpen, setSuspendOpen] = useState(false);
    const [suspendReason, setSuspendReason] = useState('');

    const handleApprove = () => {
        router.post(`/admin/members/${member.id}/approve`);
    };

    const handleVerifySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(`/admin/members/${member.id}/verify`, {
            method: verifyMethod,
            evidence_note: evidenceNote,
        }, {
            onSuccess: () => {
                setVerifyOpen(false);
                setEvidenceNote('');
            },
        });
    };

    const handleSuspendSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(`/admin/members/${member.id}/suspend`, {
            reason: suspendReason,
        }, {
            onSuccess: () => {
                setSuspendOpen(false);
                setSuspendReason('');
            },
        });
    };

    const handleReactivate = () => {
        router.post(`/admin/members/${member.id}/reactivate`);
    };

    const handleAssignCode = () => {
        router.post(`/admin/members/${member.id}/assign-code`);
    };

    return (
        <AdminLayout
            title={`Member: ${member.user?.name}`}
            breadcrumbs={[
                { title: 'Members', href: '/admin/members' },
                { title: member.user?.name || 'Profile' },
            ]}
        >
            <Head title={`${member.user?.name} - Member Profile - INTAKE 97 Admin`} />

            <div className="space-y-6">
                {/* Back Button & Action Toolbar */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <Link
                        href="/admin/members"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white"
                    >
                        <ArrowLeft className="size-4" />
                        Back to Members Registry
                    </Link>

                    <div className="flex flex-wrap items-center gap-2">
                        {!member.member_code && (
                            <Button size="sm" variant="outline" onClick={handleAssignCode} className="text-xs">
                                Assign Member Code
                            </Button>
                        )}
                        {member.membership_status === 'pending' && (
                            <Button size="sm" onClick={handleApprove} className="bg-emerald-600 hover:bg-emerald-700 text-xs">
                                <CheckCircle2 className="size-3.5 mr-1" /> Approve Membership
                            </Button>
                        )}
                        {member.verification_status !== 'verified' && (
                            <Button size="sm" onClick={() => setVerifyOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-xs">
                                <ShieldCheck className="size-3.5 mr-1" /> Verify 1997 Affiliation
                            </Button>
                        )}
                        {member.membership_status !== 'suspended' ? (
                            <Button size="sm" variant="destructive" onClick={() => setSuspendOpen(true)} className="text-xs">
                                <Ban className="size-3.5 mr-1" /> Suspend
                            </Button>
                        ) : (
                            <Button size="sm" onClick={handleReactivate} className="bg-amber-600 hover:bg-amber-700 text-xs">
                                <RotateCcw className="size-3.5 mr-1" /> Reactivate Member
                            </Button>
                        )}
                    </div>
                </div>

                {/* Profile Hero Header Card */}
                <Card className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="size-20 rounded-2xl bg-indigo-600 text-white font-bold text-3xl flex items-center justify-center shadow-md">
                                {member.user?.name?.charAt(0) || 'A'}
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center gap-3">
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                        {member.user?.name}
                                    </h2>
                                    <Badge variant="outline" className="font-mono text-xs font-semibold">
                                        {member.member_code || 'PENDING ID'}
                                    </Badge>
                                </div>
                                <div className="text-xs text-slate-500 font-medium">
                                    {member.profile?.designation ? `${member.profile.designation} at ${member.profile.organization}` : 'Cadet College 1997 Alumnus'}
                                </div>
                                <div className="flex items-center gap-2 pt-1">
                                    <Badge
                                        className={`text-[10px] capitalize ${
                                            member.membership_status === 'approved'
                                                ? 'bg-emerald-100 text-emerald-800'
                                                : member.membership_status === 'suspended'
                                                ? 'bg-rose-100 text-rose-800'
                                                : 'bg-amber-100 text-amber-800'
                                        }`}
                                    >
                                        Status: {member.membership_status}
                                    </Badge>
                                    <Badge
                                        variant="outline"
                                        className={`text-[10px] capitalize font-semibold ${
                                            member.verification_status === 'verified'
                                                ? 'border-emerald-500 text-emerald-600 bg-emerald-50'
                                                : 'border-amber-500 text-amber-600 bg-amber-50'
                                        }`}
                                    >
                                        Verification: {member.verification_status}
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        {/* Cadet College Affiliation Badge */}
                        <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col justify-center min-w-[220px]">
                            <div className="flex items-center gap-2 text-indigo-600 font-semibold text-xs">
                                <GraduationCap className="size-4" />
                                {member.college?.name}
                            </div>
                            <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                                Cadet Roll #{member.college_roll_no || 'N/A'} · Intake 1997
                            </div>
                            <div className="text-[11px] text-slate-400 mt-1">
                                Profile Completion: {member.profile?.profile_completion || 0}%
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Profile Tabs */}
                <Tabs defaultValue="overview" className="space-y-4">
                    <TabsList className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                        <TabsTrigger value="overview" className="text-xs">Overview & Contact</TabsTrigger>
                        <TabsTrigger value="applications" className="text-xs">Applications ({member.applications?.length || 0})</TabsTrigger>
                        <TabsTrigger value="verifications" className="text-xs">Verifications ({member.verifications?.length || 0})</TabsTrigger>
                        <TabsTrigger value="privacy" className="text-xs">Privacy Settings</TabsTrigger>
                        <TabsTrigger value="audit" className="text-xs">Audit History</TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Contact Card */}
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                        <Mail className="size-4 text-indigo-600" />
                                        Contact & Location
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3 text-xs">
                                    <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                                        <span className="text-slate-500">Email Address</span>
                                        <span className="font-semibold text-slate-800 dark:text-slate-200">{member.user?.email}</span>
                                    </div>
                                    <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                                        <span className="text-slate-500">Phone Number</span>
                                        <span className="font-semibold text-slate-800 dark:text-slate-200">{member.user?.phone || 'Not provided'}</span>
                                    </div>
                                    <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                                        <span className="text-slate-500">Location</span>
                                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                                            {member.profile?.city ? `${member.profile.city}, ${member.profile.country_code}` : member.profile?.country_code}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between py-1.5">
                                        <span className="text-slate-500">Address</span>
                                        <span className="font-semibold text-slate-800 dark:text-slate-200">{member.profile?.address || '—'}</span>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Professional Card */}
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                        <Briefcase className="size-4 text-emerald-600" />
                                        Professional Profile
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3 text-xs">
                                    <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                                        <span className="text-slate-500">Current Designation</span>
                                        <span className="font-semibold text-slate-800 dark:text-slate-200">{member.profile?.designation || '—'}</span>
                                    </div>
                                    <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                                        <span className="text-slate-500">Current Organization</span>
                                        <span className="font-semibold text-slate-800 dark:text-slate-200">{member.profile?.organization || '—'}</span>
                                    </div>
                                    <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                                        <span className="text-slate-500">Industry</span>
                                        <span className="font-semibold text-slate-800 dark:text-slate-200">{member.profile?.industry?.name || '—'}</span>
                                    </div>
                                    <div className="flex items-center justify-between py-1.5">
                                        <span className="text-slate-500">Owns Business</span>
                                        <span className="font-semibold text-slate-800 dark:text-slate-200">{member.profile?.owns_business ? 'Yes' : 'No'}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Professional Biography */}
                        {member.profile?.professional_bio && (
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-semibold">Professional Biography</CardTitle>
                                </CardHeader>
                                <CardContent className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                                    {member.profile.professional_bio}
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>

                    {/* Applications Tab */}
                    <TabsContent value="applications">
                        <Card>
                            <CardContent className="p-4">
                                <div className="space-y-3">
                                    {member.applications?.map((app: any) => (
                                        <div key={app.id} className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                                            <div>
                                                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                                    <span>{app.application_no}</span>
                                                    <Badge variant="outline" className="text-[10px] uppercase font-mono">{app.status}</Badge>
                                                </div>
                                                <div className="text-slate-500 text-[11px] mt-0.5">
                                                    Declared: {app.declared_college?.name} (Roll #{app.declared_roll_no}) · Submitted: {new Date(app.submitted_at).toLocaleDateString()}
                                                </div>
                                            </div>
                                            <Link
                                                href={`/admin/applications/${app.id}`}
                                                className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-semibold"
                                            >
                                                View Review Details
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Verifications Tab */}
                    <TabsContent value="verifications">
                        <Card>
                            <CardContent className="p-4 space-y-3">
                                {member.verifications?.length === 0 ? (
                                    <div className="text-center py-6 text-xs text-slate-400">
                                        No formal verification events recorded yet.
                                    </div>
                                ) : (
                                    member.verifications?.map((v: any) => (
                                        <div key={v.id} className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 text-xs space-y-1">
                                            <div className="flex items-center justify-between font-semibold">
                                                <span className="text-indigo-600 flex items-center gap-1.5">
                                                    <ShieldCheck className="size-4" />
                                                    Method: {v.method.replace('_', ' ').toUpperCase()}
                                                </span>
                                                <span className="text-slate-400 text-[11px]">
                                                    {new Date(v.verified_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="text-slate-700 dark:text-slate-300">
                                                Evidence: {v.evidence_note}
                                            </p>
                                            <div className="text-[11px] text-slate-400">
                                                Verified by: {v.verified_by?.name || 'Administrator'}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Privacy Tab */}
                    <TabsContent value="privacy">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                    <Lock className="size-4 text-slate-500" />
                                    Active Field Privacy Policies
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4">
                                <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                                    {member.privacy_settings?.map((p) => (
                                        <div key={p.id} className="py-2.5 flex items-center justify-between">
                                            <span className="font-medium text-slate-700 dark:text-slate-300 capitalize">
                                                {p.field_key.replace('_', ' ')}
                                            </span>
                                            <Badge variant="outline" className="capitalize text-[10px]">
                                                {p.visibility.replace('_', ' ')}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Audit Tab */}
                    <TabsContent value="audit">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                    <History className="size-4 text-blue-600" />
                                    Administrative Action History
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                                    {auditLogs.map((log) => (
                                        <div key={log.id} className="p-3 flex items-center justify-between">
                                            <div>
                                                <div className="font-semibold text-slate-800 dark:text-slate-200">
                                                    {log.action}
                                                </div>
                                                <div className="text-[11px] text-slate-400">
                                                    Actor: {log.user?.name || 'System'} · IP: {log.ip_address}
                                                </div>
                                            </div>
                                            <div className="text-[11px] text-slate-400">
                                                {new Date(log.created_at).toLocaleString()}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Verification Dialog */}
            <Dialog open={verifyOpen} onOpenChange={setVerifyOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <ShieldCheck className="size-5 text-indigo-600" />
                            Verify 1997 Cadet Affiliation
                        </DialogTitle>
                        <DialogDescription className="text-xs">
                            Verify authentic membership for {member.user?.name}.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleVerifySubmit} className="space-y-4 py-2">
                        <div>
                            <label className="text-xs font-semibold block mb-1">Method</label>
                            <select
                                value={verifyMethod}
                                onChange={(e) => setVerifyMethod(e.target.value)}
                                className="w-full text-xs rounded-md border p-2"
                            >
                                <option value="committee_manual">Committee Manual Verification</option>
                                <option value="college_record">Cadet College Roll / Official Archive Record</option>
                                <option value="alumni_reference">Batchmate Reference</option>
                                <option value="document_proof">Documentary Proof</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-semibold block mb-1">Evidence Note</label>
                            <textarea
                                required
                                rows={3}
                                value={evidenceNote}
                                onChange={(e) => setEvidenceNote(e.target.value)}
                                className="w-full text-xs rounded-md border p-2"
                            />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" size="sm" onClick={() => setVerifyOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                                Confirm Verification
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Suspension Dialog */}
            <Dialog open={suspendOpen} onOpenChange={setSuspendOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-rose-600 flex items-center gap-2">
                            <Ban className="size-5" />
                            Suspend Alumni Account
                        </DialogTitle>
                        <DialogDescription className="text-xs">
                            Document the rationale for suspending this member.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSuspendSubmit} className="space-y-4 py-2">
                        <div>
                            <label className="text-xs font-semibold block mb-1">Suspension Reason</label>
                            <textarea
                                required
                                rows={3}
                                value={suspendReason}
                                onChange={(e) => setSuspendReason(e.target.value)}
                                className="w-full text-xs rounded-md border p-2"
                            />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" size="sm" onClick={() => setSuspendOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" size="sm" variant="destructive">
                                Confirm Suspension
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}
