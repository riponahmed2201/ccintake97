import React, { useRef } from 'react';
import { Head } from '@inertiajs/react';
import MemberLayout from '@/layouts/member-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { QrCode, Printer, ShieldCheck, GraduationCap, Award } from 'lucide-react';
import type { Member } from '@/types';

interface IdCardPageProps {
    member: Member;
    qrPayload: string;
}

export default function IdCardPage({ member, qrPayload }: IdCardPageProps) {
    const cardRef = useRef<HTMLDivElement>(null);

    const handlePrint = () => {
        window.print();
    };

    return (
        <MemberLayout
            title="Digital Alumni ID Card"
            breadcrumbs={[{ title: 'Digital Alumni ID' }]}
        >
            <Head title="Digital Alumni ID - INTAKE97.COM" />

            <div className="max-w-xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                            Official Digital Membership Card
                        </h1>
                        <p className="text-xs text-slate-500 mt-1">
                            Authorized credentials for INTAKE 97 reunions, chapter privileges, and events.
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePrint}
                        className="text-xs font-semibold gap-1.5"
                    >
                        <Printer className="size-3.5" /> Print / Save PDF
                    </Button>
                </div>

                {/* The Membership Card Container */}
                <div
                    ref={cardRef}
                    className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white p-7 shadow-2xl border border-amber-500/30 print:border-black print:text-black print:shadow-none"
                >
                    {/* Background Cadet College Watermark & Accent Lines */}
                    <div className="absolute -top-12 -right-12 size-48 rounded-full bg-amber-500/10 blur-2xl pointer-events-none" />
                    <div className="absolute -bottom-12 -left-12 size-48 rounded-full bg-indigo-500/10 blur-2xl pointer-events-none" />

                    {/* Card Top: Brand & Badge */}
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                        <div className="flex items-center gap-3">
                            <div className="size-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 flex items-center justify-center font-black text-xl shadow-md">
                                97
                            </div>
                            <div>
                                <div className="font-extrabold text-sm tracking-wider uppercase text-amber-400">
                                    INTAKE 97
                                </div>
                                <div className="text-[10px] tracking-widest text-slate-300 font-semibold uppercase">
                                    CADET COLLEGE ALUMNI ASSOCIATION
                                </div>
                            </div>
                        </div>

                        <Badge
                            className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 border-0 ${
                                member.verification_status === 'verified'
                                    ? 'bg-emerald-500 text-white shadow-xs'
                                    : 'bg-amber-500 text-slate-950'
                            }`}
                        >
                            {member.verification_status}
                        </Badge>
                    </div>

                    {/* Card Body: Photo & Credentials */}
                    <div className="py-6 flex flex-col sm:flex-row items-center gap-6">
                        <div className="relative">
                            <div className="size-28 rounded-2xl bg-gradient-to-tr from-indigo-700 to-slate-800 border-2 border-amber-400/40 p-1 flex items-center justify-center shadow-lg shrink-0">
                                <div className="size-full rounded-xl bg-slate-900 text-amber-300 font-black text-4xl flex items-center justify-center">
                                    {member.user?.name?.charAt(0) || 'A'}
                                </div>
                            </div>
                            <div className="absolute -bottom-2 -right-2 p-1.5 rounded-full bg-emerald-600 text-white shadow-md">
                                <ShieldCheck className="size-4" />
                            </div>
                        </div>

                        <div className="space-y-1.5 text-center sm:text-left min-w-0 flex-1">
                            <h2 className="text-xl font-bold tracking-tight text-white truncate">
                                {member.user?.name}
                            </h2>
                            <div className="text-xs font-semibold text-amber-300/90 flex items-center justify-center sm:justify-start gap-1.5">
                                <GraduationCap className="size-4 shrink-0" />
                                <span className="truncate">{member.college?.name}</span>
                            </div>
                            <div className="text-[11px] text-slate-300 font-medium">
                                Cadet Roll #{member.college_roll_no || 'N/A'} · Intake 1997
                            </div>
                            {member.profile?.designation && (
                                <div className="text-[11px] text-slate-400 truncate">
                                    {member.profile.designation} {member.profile.organization ? `at ${member.profile.organization}` : ''}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Card Bottom: ID Code & QR Token Block */}
                    <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                        <div>
                            <div className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
                                Member Identification
                            </div>
                            <div className="font-mono text-base font-black tracking-wider text-amber-400 mt-0.5">
                                {member.member_code || 'PENDING VERIFICATION'}
                            </div>
                        </div>

                        {/* Interactive QR Simulation Box */}
                        <div className="p-2 rounded-xl bg-white text-slate-950 shadow-md flex items-center gap-2">
                            <QrCode className="size-10" />
                            <div className="text-[9px] font-mono leading-tight max-w-[80px] hidden sm:block">
                                SECURE VERIFICATION
                            </div>
                        </div>
                    </div>
                </div>

                {/* Security and usage notice */}
                <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900 border text-xs text-slate-600 dark:text-slate-400 space-y-1">
                    <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                        <Award className="size-4 text-amber-500" />
                        Verification Notice
                    </div>
                    <p className="text-[11px] leading-relaxed">
                        This digital alumni identity card is issued by INTAKE 97 Central Administration. The embedded QR code enables authorized event gate staff to verify identity and ticket access without exposing private contact data.
                    </p>
                </div>
            </div>
        </MemberLayout>
    );
}
