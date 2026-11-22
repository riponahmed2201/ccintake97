import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import MemberLayout from '@/layouts/member-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    ArrowLeft,
    GraduationCap,
    Briefcase,
    MapPin,
    UserPlus,
    UserCheck,
    Clock,
    Globe,
    ShieldCheck,
    Linkedin,
} from 'lucide-react';
import type { Member } from '@/types';

interface DirectoryShowProps {
    member: Member;
    isConnected: boolean;
    connectionStatus: string | null;
}

export default function DirectoryShow({ member, isConnected, connectionStatus }: DirectoryShowProps) {
    const handleConnect = () => {
        router.post(`/member/connections/${member.id}/send`);
    };

    return (
        <MemberLayout
            title={`${member.user?.name} - Alumni Profile`}
            breadcrumbs={[
                { title: 'Alumni Directory', href: '/member/directory' },
                { title: member.user?.name || 'Profile' },
            ]}
        >
            <Head title={`${member.user?.name} - INTAKE 97 Alumni Profile`} />

            <div className="max-w-4xl mx-auto space-y-6">
                <Link
                    href="/member/directory"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900"
                >
                    <ArrowLeft className="size-4" />
                    Back to Directory
                </Link>

                {/* Hero Header Card */}
                <Card className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="size-20 rounded-2xl bg-indigo-600 text-white font-black text-3xl flex items-center justify-center shadow-md">
                                {member.user?.name?.charAt(0) || 'A'}
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                                        {member.user?.name}
                                    </h1>
                                    <Badge variant="outline" className="text-[10px] font-mono text-emerald-600 border-emerald-300">
                                        <ShieldCheck className="size-3 mr-1" /> Verified
                                    </Badge>
                                </div>
                                <div className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                                    {member.profile?.designation ? `${member.profile.designation}` : '1997 Cadet College Alumnus'}
                                    {member.profile?.organization ? ` at ${member.profile.organization}` : ''}
                                </div>
                                <div className="text-[11px] text-slate-400">
                                    Member Code: <span className="font-mono">{member.member_code}</span>
                                </div>
                            </div>
                        </div>

                        {/* Connection Action Button */}
                        <div className="self-start sm:self-auto">
                            {isConnected ? (
                                <Badge className="bg-emerald-100 text-emerald-800 text-xs py-1.5 px-3 flex items-center gap-1.5">
                                    <UserCheck className="size-4" /> Connected Peer
                                </Badge>
                            ) : connectionStatus === 'pending' ? (
                                <Badge variant="outline" className="border-amber-400 text-amber-600 text-xs py-1.5 px-3 flex items-center gap-1.5">
                                    <Clock className="size-4" /> Connection Pending
                                </Badge>
                            ) : (
                                <Button
                                    size="sm"
                                    onClick={handleConnect}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-xs font-semibold"
                                >
                                    <UserPlus className="size-4 mr-1.5" /> Send Connection Request
                                </Button>
                            )}
                        </div>
                    </div>
                </Card>

                {/* Information Sections */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Cadet College Affiliation */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                <GraduationCap className="size-4 text-emerald-600" />
                                Cadet College Background
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-xs">
                            <div className="flex justify-between py-1.5 border-b">
                                <span className="text-slate-500">Cadet College</span>
                                <span className="font-bold text-slate-900 dark:text-white">{member.college?.name}</span>
                            </div>
                            <div className="flex justify-between py-1.5 border-b">
                                <span className="text-slate-500">Intake Year</span>
                                <span className="font-semibold text-slate-900 dark:text-white">1997</span>
                            </div>
                            <div className="flex justify-between py-1.5">
                                <span className="text-slate-500">College Roll #</span>
                                <span className="font-mono font-semibold text-slate-900 dark:text-white">{member.college_roll_no || 'N/A'}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Career & Location */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                <Briefcase className="size-4 text-purple-600" />
                                Professional Career
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-xs">
                            <div className="flex justify-between py-1.5 border-b">
                                <span className="text-slate-500">Industry</span>
                                <span className="font-semibold text-slate-900 dark:text-white">{member.profile?.industry?.name || '—'}</span>
                            </div>
                            <div className="flex justify-between py-1.5 border-b">
                                <span className="text-slate-500">City / Country</span>
                                <span className="font-semibold text-slate-900 dark:text-white">
                                    {member.profile?.city ? `${member.profile.city}, ${member.profile.country_code}` : member.profile?.country_code}
                                </span>
                            </div>
                            {member.profile?.linkedin_url && (
                                <div className="flex justify-between py-1.5">
                                    <span className="text-slate-500">LinkedIn</span>
                                    <a
                                        href={member.profile.linkedin_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="font-semibold text-indigo-600 hover:underline flex items-center gap-1"
                                    >
                                        <Linkedin className="size-3.5" /> View Profile
                                    </a>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Biography */}
                {member.profile?.professional_bio && (
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-semibold">About {member.user?.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                            {member.profile.professional_bio}
                        </CardContent>
                    </Card>
                )}
            </div>
        </MemberLayout>
    );
}
