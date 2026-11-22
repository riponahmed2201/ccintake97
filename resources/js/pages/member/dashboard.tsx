import React from 'react';
import { Head, Link } from '@inertiajs/react';
import MemberLayout from '@/layouts/member-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    QrCode,
    Calendar,
    Users,
    GraduationCap,
    ArrowRight,
    Bell,
    CheckCircle2,
    Clock,
    Briefcase,
    ShieldCheck,
} from 'lucide-react';
import type { Member, Event, EventRegistration, Article } from '@/types';

interface MemberDashboardProps {
    member: Member | null;
    upcomingEvents: Event[];
    myRegistrations: EventRegistration[];
    latestAnnouncements: Article[];
    connectionsCount: number;
    pendingRequestsCount: number;
    featuredBatchmates: Member[];
    unreadNotificationsCount: number;
}

export default function MemberDashboard({
    member,
    upcomingEvents,
    myRegistrations,
    latestAnnouncements,
    connectionsCount,
    pendingRequestsCount,
    featuredBatchmates,
    unreadNotificationsCount,
}: MemberDashboardProps) {
    const isVerified = member?.verification_status === 'verified';
    const completion = member?.profile?.profile_completion || 40;

    return (
        <MemberLayout title="Alumni Dashboard">
            <Head title="Alumni Portal - INTAKE97.COM" />

            <div className="space-y-6">
                {/* Welcome Hero Banner */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 shadow-md">
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Badge className="bg-indigo-600/80 hover:bg-indigo-600 text-white border-0 text-[11px] font-semibold tracking-wider uppercase">
                                    Intake 1997 Network
                                </Badge>
                                {isVerified ? (
                                    <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-[11px] flex items-center gap-1 font-semibold">
                                        <ShieldCheck className="size-3" /> Verified Alumnus
                                    </Badge>
                                ) : (
                                    <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 text-[11px] flex items-center gap-1">
                                        <Clock className="size-3" /> Verification Pending
                                    </Badge>
                                )}
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                                Welcome back, {member?.user?.name || 'Batchmate'}!
                            </h1>
                            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                                Connected with <strong>{member?.college?.name}</strong> · Member ID: <span className="font-mono text-indigo-300">{member?.member_code || 'Pending'}</span>
                            </p>
                        </div>

                        {/* Digital Alumni ID Quick Card Preview */}
                        <Link
                            href="/member/id-card"
                            className="group block p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/15 transition-all w-full md:w-64"
                        >
                            <div className="flex items-center justify-between text-xs font-semibold text-indigo-200">
                                <span>Digital Alumni ID</span>
                                <QrCode className="size-4" />
                            </div>
                            <div className="mt-3 flex items-center gap-3">
                                <div className="size-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
                                    97
                                </div>
                                <div>
                                    <div className="font-bold text-xs truncate text-white">
                                        {member?.user?.name}
                                    </div>
                                    <div className="text-[10px] text-slate-300 truncate">
                                        {member?.college?.short_name || member?.college?.name}
                                    </div>
                                </div>
                            </div>
                            <div className="mt-3 pt-2 border-t border-white/10 text-[11px] text-indigo-300 flex items-center justify-between font-medium">
                                <span>View & Download ID</span>
                                <ArrowRight className="size-3 group-hover:translate-x-0.5 transition-transform" />
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Profile Completion Bar (if incomplete) */}
                {completion < 100 && (
                    <Card className="p-4 border-indigo-100 dark:border-indigo-950 bg-indigo-50/40 dark:bg-slate-900">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="space-y-1">
                                <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <span>Profile Completion: {completion}%</span>
                                </div>
                                <p className="text-[11px] text-slate-500">
                                    Add your profession, current organization, and city to facilitate networking with batchmates.
                                </p>
                            </div>
                            <Link
                                href="/member/profile"
                                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold self-start sm:self-auto transition-colors"
                            >
                                Complete Profile
                            </Link>
                        </div>
                    </Card>
                )}

                {/* KPI Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <Link href="/member/connections" className="block group">
                        <Card className="p-4 hover:border-indigo-300 transition-colors">
                            <div className="text-xs text-slate-500 font-medium">My Connections</div>
                            <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                                {connectionsCount}
                            </div>
                        </Card>
                    </Link>

                    <Link href="/member/connections" className="block group">
                        <Card className="p-4 hover:border-indigo-300 transition-colors">
                            <div className="text-xs text-slate-500 font-medium">Pending Requests</div>
                            <div className="text-2xl font-bold text-amber-600 mt-1">
                                {pendingRequestsCount}
                            </div>
                        </Card>
                    </Link>

                    <Link href="/member/events" className="block group">
                        <Card className="p-4 hover:border-indigo-300 transition-colors">
                            <div className="text-xs text-slate-500 font-medium">My Registered Events</div>
                            <div className="text-2xl font-bold text-purple-600 mt-1">
                                {myRegistrations.length}
                            </div>
                        </Card>
                    </Link>

                    <Link href="/member/notifications" className="block group">
                        <Card className="p-4 hover:border-indigo-300 transition-colors">
                            <div className="text-xs text-slate-500 font-medium">Unread Notifications</div>
                            <div className="text-2xl font-bold text-emerald-600 mt-1">
                                {unreadNotificationsCount}
                            </div>
                        </Card>
                    </Link>
                </div>

                {/* 2-Column Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left 2 Columns: Events & Featured Batchmates */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Upcoming Events */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-3">
                                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                    <Calendar className="size-4 text-purple-600" />
                                    Upcoming Reunions & Gatherings
                                </CardTitle>
                                <Link
                                    href="/member/events"
                                    className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1"
                                >
                                    Browse All <ArrowRight className="size-3" />
                                </Link>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {upcomingEvents.length === 0 ? (
                                    <div className="p-4 text-center text-xs text-slate-400">
                                        No upcoming events scheduled at this moment.
                                    </div>
                                ) : (
                                    upcomingEvents.map((ev) => (
                                        <div
                                            key={ev.id}
                                            className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                                        >
                                            <div className="space-y-1">
                                                <div className="font-bold text-xs text-slate-900 dark:text-white">
                                                    {ev.title}
                                                </div>
                                                <div className="text-[11px] text-slate-500 flex items-center gap-3">
                                                    <span>{new Date(ev.starts_on).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                                    <span>·</span>
                                                    <span className="truncate">{ev.venue}</span>
                                                </div>
                                            </div>
                                            <Link
                                                href={`/member/events/${ev.slug}`}
                                                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold self-start sm:self-auto transition-colors"
                                            >
                                                View & Register
                                            </Link>
                                        </div>
                                    ))
                                )}
                            </CardContent>
                        </Card>

                        {/* Featured Batchmates from Same College */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-3">
                                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                    <GraduationCap className="size-4 text-emerald-600" />
                                    Batchmates from {member?.college?.short_name || 'Your College'}
                                </CardTitle>
                                <Link
                                    href="/member/directory"
                                    className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1"
                                >
                                    Explore Directory <ArrowRight className="size-3" />
                                </Link>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {featuredBatchmates.length === 0 ? (
                                        <div className="col-span-full p-4 text-center text-xs text-slate-400">
                                            No verified batchmates found yet.
                                        </div>
                                    ) : (
                                        featuredBatchmates.map((bm) => (
                                            <Link
                                                key={bm.id}
                                                href={`/member/directory/${bm.id}`}
                                                className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-300 transition-all flex items-center gap-3"
                                            >
                                                <div className="size-10 rounded-full bg-slate-100 dark:bg-slate-800 text-indigo-600 font-bold text-sm flex items-center justify-center shrink-0">
                                                    {bm.user?.name?.charAt(0)}
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="font-bold text-xs text-slate-900 dark:text-white truncate">
                                                        {bm.user?.name}
                                                    </div>
                                                    <div className="text-[11px] text-slate-500 truncate">
                                                        {bm.profile?.designation || bm.profile?.organization || '1997 Alumnus'}
                                                    </div>
                                                </div>
                                            </Link>
                                        ))
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Announcements */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                    <Bell className="size-4 text-amber-600" />
                                    Official Announcements
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {latestAnnouncements.length === 0 ? (
                                    <div className="p-4 text-center text-xs text-slate-400">
                                        No announcements published yet.
                                    </div>
                                ) : (
                                    latestAnnouncements.map((art) => (
                                        <Link
                                            key={art.id}
                                            href={`/member/articles/${art.slug}`}
                                            className="block p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-indigo-200 transition-colors space-y-1"
                                        >
                                            <div className="font-bold text-xs text-slate-900 dark:text-white line-clamp-2">
                                                {art.title}
                                            </div>
                                            <div className="text-[10px] text-slate-400">
                                                {new Date(art.published_at || art.created_at).toLocaleDateString()} · {art.category?.name}
                                            </div>
                                        </Link>
                                    ))
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </MemberLayout>
    );
}
