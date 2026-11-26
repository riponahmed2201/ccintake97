import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import MemberLayout from '@/layouts/member-layout';
import { Button } from '@/components/ui/button';
import {
    ArrowLeft,
    Briefcase,
    Building2,
    Clock,
    Globe,
    GraduationCap,
    HeartHandshake,
    Linkedin,
    MapPin,
    ShieldCheck,
    UserCheck,
    UserPlus,
} from 'lucide-react';
import type { Member } from '@/types';

interface DirectoryShowProps {
    member: Member;
    isConnected: boolean;
    connectionStatus: string | null;
}

export default function DirectoryShow({
    member,
    isConnected,
    connectionStatus,
}: DirectoryShowProps) {
    const handleConnect = () => {
        router.post(`/member/connections/${member.id}/send`);
    };

    const avatarUrl = member.user?.avatar_path
        ? `/storage/${member.user.avatar_path.replace(/^\/+/, '')}`
        : null;

    const approvedBusinesses = member.businesses?.filter((b) => b.status === 'approved') ?? [];

    return (
        <MemberLayout
            title={`${member.user?.name} - Alumni Profile`}
            breadcrumbs={[
                { title: 'Alumni Directory', href: '/member/directory' },
                { title: member.user?.name || 'Profile' },
            ]}
        >
            <Head title={`${member.user?.name} - CCINTAKE 97 Alumni Profile`} />

            <div className="mx-auto max-w-4xl space-y-6">
                <Link
                    href="/member/directory"
                    className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#78829D] transition-colors hover:text-[#071437]"
                >
                    <ArrowLeft className="size-4" />
                    Back to Directory
                </Link>

                {/* Hero Header Card */}
                <div className="rounded-xl border border-[#F1F1F4] bg-white p-6 shadow-[0_3px_4px_0_rgba(0,0,0,0.03)]">
                    <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
                        <div className="flex items-center gap-5">
                            {avatarUrl ? (
                                <img
                                    src={avatarUrl}
                                    alt={member.user?.name || ''}
                                    className="size-20 shrink-0 rounded-2xl border border-[#F1F1F4] object-cover object-top shadow-xs"
                                />
                            ) : (
                                <div className="flex size-20 shrink-0 items-center justify-center rounded-2xl bg-[#F1F6FF] text-2xl font-bold text-[#1B84FF]">
                                    {member.user?.name?.charAt(0) || 'A'}
                                </div>
                            )}

                            <div className="space-y-1">
                                <div className="flex flex-wrap items-center gap-2.5">
                                    <h1 className="text-[20px] font-bold tracking-tight text-[#071437]">
                                        {member.user?.name}
                                    </h1>
                                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
                                        <ShieldCheck className="size-3.5" />
                                        Verified
                                    </span>
                                </div>
                                <div className="text-[13.5px] font-medium text-[#4B5675]">
                                    {member.profile?.designation
                                        ? member.profile.designation
                                        : '1997 Cadet College Alumnus'}
                                    {member.profile?.organization
                                        ? ` · ${member.profile.organization}`
                                        : ''}
                                </div>
                                <div className="text-[12px] text-[#78829D]">
                                    Member Code:{' '}
                                    <span className="font-mono font-semibold text-[#071437]">
                                        {member.member_code}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="self-start sm:self-center">
                            {isConnected ? (
                                <span className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3.5 py-2 text-[12.5px] font-semibold text-emerald-700">
                                    <UserCheck className="size-4" /> Connected Peer
                                </span>
                            ) : connectionStatus === 'pending' ? (
                                <span className="inline-flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-3.5 py-2 text-[12.5px] font-semibold text-amber-700">
                                    <Clock className="size-4" /> Connection Pending
                                </span>
                            ) : (
                                <Button
                                    onClick={handleConnect}
                                    className="h-10 rounded-lg bg-[#1B84FF] px-4 text-[13px] font-semibold text-white hover:bg-[#1B84FF]/90"
                                >
                                    <UserPlus className="mr-1.5 size-4" /> Send Connection Request
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Information Sections */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Cadet College Affiliation */}
                    <div className="overflow-hidden rounded-xl border border-[#F1F1F4] bg-white shadow-[0_3px_4px_0_rgba(0,0,0,0.03)]">
                        <div className="flex items-center gap-2.5 border-b border-[#F1F1F4] px-6 py-4">
                            <span className="flex size-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                                <GraduationCap className="size-4" />
                            </span>
                            <h2 className="text-[15px] font-bold text-[#071437]">
                                Cadet College Background
                            </h2>
                        </div>
                        <div className="divide-y divide-[#F1F1F4] px-6 py-2 text-[13px]">
                            <div className="flex items-center justify-between py-3">
                                <span className="text-[#78829D]">Cadet College</span>
                                <span className="font-semibold text-[#071437]">
                                    {member.college?.name || '—'}
                                </span>
                            </div>
                            {member.profile?.cadet_name && (
                                <div className="flex items-center justify-between py-3">
                                    <span className="text-[#78829D]">Cadet Name</span>
                                    <span className="font-semibold text-[#071437]">
                                        {member.profile.cadet_name}
                                    </span>
                                </div>
                            )}
                            <div className="flex items-center justify-between py-3">
                                <span className="text-[#78829D]">Intake Year</span>
                                <span className="font-semibold text-[#071437]">
                                    {member.intake_year || 1997}
                                </span>
                            </div>
                            <div className="flex items-center justify-between py-3">
                                <span className="text-[#78829D]">College Roll #</span>
                                <span className="font-mono font-semibold text-[#071437]">
                                    {member.college_roll_no || 'N/A'}
                                </span>
                            </div>
                            {member.profile?.blood_group && (
                                <div className="flex items-center justify-between py-3">
                                    <span className="text-[#78829D]">Blood Group</span>
                                    <span className="inline-flex items-center rounded-md border border-rose-200 bg-rose-50 px-2 py-0.5 text-[11.5px] font-bold text-rose-700">
                                        {member.profile.blood_group}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Professional Career & Location */}
                    <div className="overflow-hidden rounded-xl border border-[#F1F1F4] bg-white shadow-[0_3px_4px_0_rgba(0,0,0,0.03)]">
                        <div className="flex items-center gap-2.5 border-b border-[#F1F1F4] px-6 py-4">
                            <span className="flex size-8 items-center justify-center rounded-lg bg-[#F1F6FF] text-[#1B84FF]">
                                <Briefcase className="size-4" />
                            </span>
                            <h2 className="text-[15px] font-bold text-[#071437]">
                                Professional Career & Location
                            </h2>
                        </div>
                        <div className="divide-y divide-[#F1F1F4] px-6 py-2 text-[13px]">
                            <div className="flex items-center justify-between py-3">
                                <span className="text-[#78829D]">Designation</span>
                                <span className="font-semibold text-[#071437]">
                                    {member.profile?.designation || '—'}
                                </span>
                            </div>
                            <div className="flex items-center justify-between py-3">
                                <span className="text-[#78829D]">Organization</span>
                                <span className="font-semibold text-[#071437]">
                                    {member.profile?.organization || '—'}
                                </span>
                            </div>
                            <div className="flex items-center justify-between py-3">
                                <span className="text-[#78829D]">Industry</span>
                                <span className="font-semibold text-[#071437]">
                                    {member.profile?.industry?.name || '—'}
                                </span>
                            </div>
                            <div className="flex items-center justify-between py-3">
                                <span className="text-[#78829D]">City / Country</span>
                                <span className="inline-flex items-center gap-1 font-semibold text-[#071437]">
                                    <MapPin className="size-3.5 text-[#78829D]" />
                                    {member.profile?.city
                                        ? `${member.profile.city}, ${member.profile.country_code}`
                                        : member.profile?.country_code || '—'}
                                </span>
                            </div>
                            {(member.profile?.linkedin_url || member.profile?.website_url) && (
                                <div className="flex items-center justify-between py-3">
                                    <span className="text-[#78829D]">Links</span>
                                    <div className="flex items-center gap-3">
                                        {member.profile?.linkedin_url && (
                                            <a
                                                href={member.profile.linkedin_url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex items-center gap-1 font-semibold text-[#1B84FF] hover:underline"
                                            >
                                                <Linkedin className="size-3.5" /> LinkedIn
                                            </a>
                                        )}
                                        {member.profile?.website_url && (
                                            <a
                                                href={member.profile.website_url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex items-center gap-1 font-semibold text-[#1B84FF] hover:underline"
                                            >
                                                <Globe className="size-3.5" /> Website
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Biography */}
                {member.profile?.professional_bio && (
                    <div className="rounded-xl border border-[#F1F1F4] bg-white p-6 shadow-[0_3px_4px_0_rgba(0,0,0,0.03)]">
                        <h2 className="mb-2 text-[15px] font-bold text-[#071437]">
                            About {member.user?.name}
                        </h2>
                        <p className="text-[13.5px] leading-relaxed text-[#4B5675]">
                            {member.profile.professional_bio}
                        </p>
                    </div>
                )}

                {/* Mentorship & Businesses */}
                {(member.mentorship_profile?.is_available || approvedBusinesses.length > 0) && (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {member.mentorship_profile?.is_available && (
                            <div className="rounded-xl border border-[#F1F1F4] bg-white p-6 shadow-[0_3px_4px_0_rgba(0,0,0,0.03)]">
                                <h2 className="mb-3 flex items-center gap-2 text-[15px] font-bold text-[#071437]">
                                    <HeartHandshake className="size-4 text-emerald-600" />
                                    Available for Mentorship
                                </h2>
                                {member.mentorship_profile.expertise_areas && (
                                    <div className="text-[13px] text-[#4B5675]">
                                        <span className="font-semibold text-[#071437]">Expertise: </span>
                                        {member.mentorship_profile.expertise_areas}
                                    </div>
                                )}
                                {member.mentorship_profile.preferred_topics && (
                                    <div className="mt-1.5 text-[13px] text-[#4B5675]">
                                        <span className="font-semibold text-[#071437]">Topics: </span>
                                        {member.mentorship_profile.preferred_topics}
                                    </div>
                                )}
                            </div>
                        )}

                        {approvedBusinesses.length > 0 && (
                            <div className="rounded-xl border border-[#F1F1F4] bg-white p-6 shadow-[0_3px_4px_0_rgba(0,0,0,0.03)]">
                                <h2 className="mb-3 flex items-center gap-2 text-[15px] font-bold text-[#071437]">
                                    <Building2 className="size-4 text-[#1B84FF]" />
                                    Verified Alumni Businesses
                                </h2>
                                <div className="space-y-3">
                                    {approvedBusinesses.map((b) => (
                                        <div
                                            key={b.id}
                                            className="rounded-lg border border-[#F1F1F4] bg-[#FCFCFC] p-3"
                                        >
                                            <div className="text-[13px] font-bold text-[#071437]">
                                                {b.name}
                                            </div>
                                            {b.description && (
                                                <div className="mt-0.5 line-clamp-2 text-[12px] text-[#78829D]">
                                                    {b.description}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </MemberLayout>
    );
}
