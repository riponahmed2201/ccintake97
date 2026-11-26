import React, { useRef } from 'react';
import { Head, Link } from '@inertiajs/react';
import MemberLayout from '@/layouts/member-layout';
import BrandMark from '@/components/brand-mark';
import { Button } from '@/components/ui/button';
import { QrCode, Printer, ShieldCheck, GraduationCap, Award, UserCog, CheckCircle2, Clock } from 'lucide-react';
import type { Member } from '@/types';

interface IdCardPageProps {
    member: Member;
    photoUrl?: string | null;
    qrPayload: string;
}

export default function IdCardPage({ member, photoUrl, qrPayload }: IdCardPageProps) {
    const cardRef = useRef<HTMLDivElement>(null);

    let tokenSnippet = 'VERIFIED';
    try {
        const parsed = JSON.parse(qrPayload) as { token?: string };
        if (parsed?.token) {
            tokenSnippet = parsed.token.slice(0, 10).toUpperCase();
        }
    } catch {
        // ignore invalid json
    }

    const isVerified = member.verification_status === 'verified';

    const handlePrint = () => {
        window.print();
    };

    return (
        <MemberLayout
            title="Digital Alumni ID"
            breadcrumbs={[{ title: 'Digital Alumni ID' }]}
        >
            <Head title="Digital Alumni ID - CCINTAKE97.COM" />

            <div className="w-full space-y-6">
                {/* Page Header */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between print:hidden">
                    <div>
                        <h1 className="text-[22px] font-semibold tracking-tight text-[#071437]">
                            Official Digital Membership Card
                        </h1>
                        <p className="mt-1 text-[13px] text-[#78829D]">
                            Authorized credentials for CCINTAKE 97 reunions, chapter privileges, and events.
                        </p>
                    </div>
                    <div className="flex items-center gap-2.5">
                        <Link
                            href="/member/profile"
                            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#DBDFE9] bg-white px-3.5 text-[12.5px] font-semibold text-[#4B5675] transition-colors hover:bg-[#F9F9F9] hover:text-[#071437]"
                        >
                            <UserCog className="size-3.5 text-[#78829D]" />
                            Edit profile
                        </Link>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handlePrint}
                            className="h-9 gap-1.5 rounded-lg border-[#DBDFE9] !bg-white px-3.5 text-[12.5px] font-semibold text-[#071437] shadow-none hover:!bg-[#F9F9F9]"
                        >
                            <Printer className="size-3.5 text-[#78829D]" /> Print / Save PDF
                        </Button>
                    </div>
                </div>

                {/* Main Fluid Grid */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                    {/* Left: Official Membership Card */}
                    <div className="lg:col-span-7">
                        <div className="rounded-xl border border-[#F1F1F4] bg-white p-5 shadow-[0_3px_4px_0_rgba(0,0,0,0.03)] sm:p-6 print:border-0 print:p-0 print:shadow-none">
                            <div
                                ref={cardRef}
                                className="relative overflow-hidden rounded-2xl border border-[#D4AF37]/30 bg-gradient-to-br from-[#071437] via-[#0B1B44] to-[#112659] p-6 text-white shadow-[0_18px_40px_-15px_rgba(7,20,55,0.45)] sm:p-7 print:border-black print:shadow-none"
                            >
                                {/* Subtle Gold & Navy Accents */}
                                <div className="pointer-events-none absolute -top-14 -right-14 size-52 rounded-full bg-[#D4AF37]/10 blur-2xl" />
                                <div className="pointer-events-none absolute -bottom-16 -left-12 size-52 rounded-full bg-[#1B84FF]/15 blur-2xl" />

                                {/* Card Top: Brand & Status */}
                                <div className="relative flex items-center justify-between border-b border-white/10 pb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/10 p-1.5 ring-1 ring-[#D4AF37]/35">
                                            <BrandMark className="size-full" />
                                        </div>
                                        <div>
                                            <div className="text-[14px] font-bold tracking-[0.08em] text-[#E8D5A3] uppercase">
                                                CCINTAKE 97
                                            </div>
                                            <div className="text-[10px] font-medium tracking-[0.14em] text-slate-300 uppercase">
                                                Cadet College Alumni Association
                                            </div>
                                        </div>
                                    </div>

                                    <span
                                        className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-[10.5px] font-semibold tracking-wider uppercase ${
                                            isVerified
                                                ? 'bg-[#17C653]/20 text-[#4ADE80] ring-1 ring-[#17C653]/40'
                                                : 'bg-[#D4AF37]/20 text-[#F3E5B5] ring-1 ring-[#D4AF37]/40'
                                        }`}
                                    >
                                        {isVerified ? <CheckCircle2 className="size-3" /> : <Clock className="size-3" />}
                                        {member.verification_status}
                                    </span>
                                </div>

                                {/* Card Body: Photo & Credentials */}
                                <div className="relative flex flex-col items-center gap-5 py-6 sm:flex-row sm:items-center">
                                    <div className="relative shrink-0">
                                        <div className="flex size-24 items-center justify-center overflow-hidden rounded-2xl border-2 border-[#D4AF37]/50 bg-[#0D1E4A] text-3xl font-bold text-[#E8D5A3] shadow-lg sm:size-28">
                                            {photoUrl ? (
                                                <img
                                                    src={photoUrl}
                                                    alt={member.user?.name || 'Member'}
                                                    className="size-full object-cover"
                                                />
                                            ) : (
                                                member.user?.name?.charAt(0) || 'A'
                                            )}
                                        </div>
                                        {isVerified && (
                                            <div className="absolute -right-2 -bottom-2 rounded-full bg-[#17C653] p-1.5 text-white shadow-md ring-2 ring-[#0B1B44]">
                                                <ShieldCheck className="size-4" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="min-w-0 flex-1 space-y-1.5 text-center sm:text-left">
                                        <h2 className="truncate text-[20px] font-bold tracking-tight text-white sm:text-[22px]">
                                            {member.user?.name}
                                        </h2>
                                        <div className="flex items-center justify-center gap-1.5 text-[13px] font-medium text-[#E8D5A3] sm:justify-start">
                                            <GraduationCap className="size-4 shrink-0" />
                                            <span className="truncate">{member.college?.name || 'College not selected'}</span>
                                        </div>
                                        <div className="text-[12px] font-medium text-slate-300">
                                            Cadet Roll #{member.college_roll_no || 'N/A'} · Intake {member.intake_year || '1997'}
                                        </div>
                                        {member.profile?.designation && (
                                            <div className="truncate text-[12px] text-slate-300/80">
                                                {member.profile.designation}
                                                {member.profile.organization ? ` at ${member.profile.organization}` : ''}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Card Bottom: ID Code & QR Verification */}
                                <div className="relative flex items-center justify-between gap-4 border-t border-white/10 pt-4">
                                    <div>
                                        <div className="text-[10px] font-semibold tracking-[0.12em] text-slate-400 uppercase">
                                            Member Identification
                                        </div>
                                        <div className="mt-0.5 font-mono text-[15px] font-bold tracking-wider text-[#E8D5A3] sm:text-[16px]">
                                            {member.member_code || 'PENDING VERIFICATION'}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2.5 rounded-xl bg-white px-2.5 py-2 text-[#071437] shadow-md">
                                        <QrCode className="size-10 shrink-0 text-[#071437]" strokeWidth={1.75} />
                                        <div className="hidden font-mono text-[9.5px] leading-tight sm:block">
                                            <div className="font-bold tracking-wider text-[#071437]">PASS</div>
                                            <div className="text-[#78829D]">{tokenSnippet}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Credential Details & Verification Notice */}
                    <div className="space-y-5 lg:col-span-5 print:hidden">
                        <div className="rounded-xl border border-[#F1F1F4] bg-white p-5 shadow-[0_3px_4px_0_rgba(0,0,0,0.03)] sm:p-6">
                            <h3 className="text-[15px] font-semibold text-[#071437]">Credential Summary</h3>
                            <p className="mt-0.5 text-[12.5px] text-[#78829D]">
                                Details encoded on your official digital ID.
                            </p>

                            <dl className="mt-4 divide-y divide-[#F1F1F4] text-[13px]">
                                <div className="flex items-center justify-between py-2.5">
                                    <dt className="text-[#78829D]">Member Code</dt>
                                    <dd className="font-mono font-semibold text-[#071437]">
                                        {member.member_code || 'Pending'}
                                    </dd>
                                </div>
                                <div className="flex items-center justify-between py-2.5">
                                    <dt className="text-[#78829D]">College</dt>
                                    <dd className="max-w-[200px] truncate font-medium text-[#071437]">
                                        {member.college?.short_name || member.college?.name || 'Not set'}
                                    </dd>
                                </div>
                                <div className="flex items-center justify-between py-2.5">
                                    <dt className="text-[#78829D]">Cadet Number</dt>
                                    <dd className="font-medium text-[#071437]">{member.college_roll_no || '—'}</dd>
                                </div>
                                <div className="flex items-center justify-between py-2.5">
                                    <dt className="text-[#78829D]">House</dt>
                                    <dd className="font-medium text-[#071437]">{member.house_name || '—'}</dd>
                                </div>
                                <div className="flex items-center justify-between py-2.5">
                                    <dt className="text-[#78829D]">Blood Group</dt>
                                    <dd className="font-medium text-[#071437]">{member.profile?.blood_group || '—'}</dd>
                                </div>
                            </dl>
                        </div>

                        <div className="rounded-xl border border-[#F1F1F4] bg-[#FCFCFC] p-5">
                            <div className="flex items-center gap-2 text-[13.5px] font-semibold text-[#071437]">
                                <Award className="size-4 text-[#1B84FF]" />
                                Verification Notice
                            </div>
                            <p className="mt-1.5 text-[12.5px] leading-relaxed text-[#78829D]">
                                This digital alumni identity card is issued by CCINTAKE 97 Central Administration. The embedded QR code enables authorized event gate staff to verify identity and event access without exposing private contact data.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </MemberLayout>
    );
}
