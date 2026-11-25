import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    Briefcase,
    Globe,
    GraduationCap,
    Linkedin,
    Lock,
    MapPin,
    ShieldCheck,
} from 'lucide-react';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { LANDING_CONTAINER } from '@/components/landing/layout';
import PublicSiteHeader from '@/components/public-site-header';

interface PublicMemberDetail {
    id: number;
    name: string;
    initials: string;
    intake_year?: number;
    college: {
        id: number;
        name: string;
        short_name?: string;
        logo_url?: string | null;
    } | null;
    photo_url: string | null;
    designation: string | null;
    organization: string | null;
    industry: string | null;
    city: string | null;
    country_code: string | null;
    professional_bio: string | null;
    linkedin_url: string | null;
    website_url: string | null;
}

export default function PublicMemberShow({ member }: { member: PublicMemberDetail }) {
    const { auth } = usePage().props as { auth?: { user?: unknown } };

    return (
        <>
            <Head title={`${member.name} — Batch Directory — ccIntake97`} />
            <div className="min-h-screen bg-[#FAF8F3] font-sans text-[#091324] antialiased">
                <PublicSiteHeader active="Directory" />

                <main className={`${LANDING_CONTAINER} pt-28 pb-24 sm:pt-32`}>
                    <div className="mx-auto max-w-4xl space-y-6">
                        <Link
                            href="/directory"
                            className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#4A4F5C] transition-colors hover:text-[#091324]"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Batch Directory
                        </Link>

                        {/* Hero Card */}
                        <div className="overflow-hidden rounded-2xl border border-[#0B1220]/10 bg-white p-6 shadow-sm sm:p-8">
                            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex items-center gap-5">
                                    {member.photo_url ? (
                                        <img
                                            src={member.photo_url}
                                            alt={member.name}
                                            className="h-24 w-24 shrink-0 rounded-2xl border border-[#F1F1F4] object-cover object-top shadow-xs"
                                        />
                                    ) : (
                                        <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-[#F4F6FA] font-serif text-3xl font-semibold text-[#0B1220] ring-1 ring-[#0B1220]/10">
                                            {member.initials}
                                        </div>
                                    )}

                                    <div className="space-y-1.5">
                                        <div className="flex flex-wrap items-center gap-2.5">
                                            <h1 className="text-[22px] font-bold tracking-tight text-[#071437]">
                                                {member.name}
                                            </h1>
                                            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
                                                <ShieldCheck className="h-3.5 w-3.5" />
                                                Verified
                                            </span>
                                        </div>
                                        <p className="text-[14px] font-medium text-[#4B5675]">
                                            {member.designation || '1997 Cadet College Alumnus'}
                                            {member.organization ? ` · ${member.organization}` : ''}
                                        </p>
                                        {member.college && (
                                            <div className="inline-flex items-center gap-2 pt-0.5 text-[13px] font-semibold text-[#071437]">
                                                {member.college.logo_url && (
                                                    <img
                                                        src={member.college.logo_url}
                                                        alt=""
                                                        className="h-5 w-5 rounded-full object-contain"
                                                    />
                                                )}
                                                <span>{member.college.name}</span>
                                                <span className="text-[#99A1B7]">· Intake {member.intake_year || 1997}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="self-start sm:self-center">
                                    {auth?.user ? (
                                        <Link
                                            href={`/member/directory/${member.id}`}
                                            className="inline-flex h-10 items-center rounded-lg bg-[#1B84FF] px-4 text-[13px] font-semibold text-white transition-colors hover:bg-[#1B84FF]/90"
                                        >
                                            Open Full Member Profile
                                        </Link>
                                    ) : (
                                        <Link
                                            href="/login"
                                            className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#0B1220] px-4 text-[13px] font-semibold text-white transition-colors hover:bg-[#1A2438]"
                                        >
                                            <Lock className="h-3.5 w-3.5" />
                                            Sign in for full details
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="rounded-2xl border border-[#0B1220]/10 bg-white p-6 shadow-sm">
                                <h2 className="mb-4 flex items-center gap-2 text-[15px] font-bold text-[#071437]">
                                    <GraduationCap className="h-4 w-4 text-emerald-600" />
                                    Cadet College Background
                                </h2>
                                <div className="divide-y divide-[#F1F1F4] text-[13px]">
                                    <div className="flex items-center justify-between py-2.5">
                                        <span className="text-[#78829D]">Cadet College</span>
                                        <span className="font-semibold text-[#071437]">
                                            {member.college?.name || '—'}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between py-2.5">
                                        <span className="text-[#78829D]">Intake Year</span>
                                        <span className="font-semibold text-[#071437]">
                                            {member.intake_year || 1997}
                                        </span>
                                    </div>
                                    {(member.city || member.country_code) && (
                                        <div className="flex items-center justify-between py-2.5">
                                            <span className="text-[#78829D]">Location</span>
                                            <span className="inline-flex items-center gap-1 font-semibold text-[#071437]">
                                                <MapPin className="h-3.5 w-3.5 text-[#78829D]" />
                                                {[member.city, member.country_code].filter(Boolean).join(', ')}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="rounded-2xl border border-[#0B1220]/10 bg-white p-6 shadow-sm">
                                <h2 className="mb-4 flex items-center gap-2 text-[15px] font-bold text-[#071437]">
                                    <Briefcase className="h-4 w-4 text-[#1B84FF]" />
                                    Professional Overview
                                </h2>
                                <div className="divide-y divide-[#F1F1F4] text-[13px]">
                                    <div className="flex items-center justify-between py-2.5">
                                        <span className="text-[#78829D]">Designation</span>
                                        <span className="font-semibold text-[#071437]">
                                            {member.designation || 'Visible to members'}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between py-2.5">
                                        <span className="text-[#78829D]">Organization</span>
                                        <span className="font-semibold text-[#071437]">
                                            {member.organization || 'Visible to members'}
                                        </span>
                                    </div>
                                    {member.industry && (
                                        <div className="flex items-center justify-between py-2.5">
                                            <span className="text-[#78829D]">Industry</span>
                                            <span className="font-semibold text-[#071437]">{member.industry}</span>
                                        </div>
                                    )}
                                    {(member.linkedin_url || member.website_url) && (
                                        <div className="flex items-center justify-between py-2.5">
                                            <span className="text-[#78829D]">Links</span>
                                            <div className="flex items-center gap-3">
                                                {member.linkedin_url && (
                                                    <a
                                                        href={member.linkedin_url}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="inline-flex items-center gap-1 font-semibold text-[#1B84FF] hover:underline"
                                                    >
                                                        <Linkedin className="h-3.5 w-3.5" /> LinkedIn
                                                    </a>
                                                )}
                                                {member.website_url && (
                                                    <a
                                                        href={member.website_url}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="inline-flex items-center gap-1 font-semibold text-[#1B84FF] hover:underline"
                                                    >
                                                        <Globe className="h-3.5 w-3.5" /> Website
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {member.professional_bio && (
                            <div className="rounded-2xl border border-[#0B1220]/10 bg-white p-6 shadow-sm">
                                <h2 className="mb-2 text-[15px] font-bold text-[#071437]">
                                    About {member.name}
                                </h2>
                                <p className="text-[14px] leading-relaxed text-[#4B5675]">
                                    {member.professional_bio}
                                </p>
                            </div>
                        )}
                    </div>
                </main>

                <LandingFooter />
            </div>
        </>
    );
}
