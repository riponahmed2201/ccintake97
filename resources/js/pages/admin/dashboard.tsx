import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Users,
    UserCheck,
    FileText,
    Calendar,
    Newspaper,
    Briefcase,
    GraduationCap,
    Clock,
    AlertCircle,
    ChevronRight,
    Award,
    HeartHandshake,
} from 'lucide-react';
import type { MembershipApplication, Event, College } from '@/types';

interface DashboardProps {
    stats: {
        total_members: number;
        verified_members: number;
        pending_applications: number;
        rejected_applications: number;
        suspended_members: number;
        participating_colleges: number;
        upcoming_events: number;
        total_registrations: number;
        published_news: number;
        pending_businesses: number;
        active_committees: number;
        community_initiatives: number;
    };
    collegeDistribution: { name: string; count: number }[];
    countryDistribution: { country_code: string; count: number }[];
    industryDistribution: { name: string; count: number }[];
    recentApplications: MembershipApplication[];
    recentEvents: Event[];
    recentActivities: any[];
}

export default function AdminDashboard({
    stats,
    collegeDistribution,
    countryDistribution,
    industryDistribution,
    recentApplications,
    recentEvents,
    recentActivities,
}: DashboardProps) {
    const kpis = [
        { label: 'Total Members', value: stats.total_members, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-950/40', href: '/admin/members' },
        { label: 'Verified Alumni', value: stats.verified_members, icon: UserCheck, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950/40', href: '/admin/members?verification_status=verified' },
        { label: 'Pending Applications', value: stats.pending_applications, icon: FileText, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-950/40', href: '/admin/applications?status=submitted', badge: stats.pending_applications > 0 ? 'Review Needed' : null },
        { label: 'Participating Colleges', value: stats.participating_colleges, icon: GraduationCap, color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-950/40', href: '/admin/colleges' },
        { label: 'Upcoming Events', value: stats.upcoming_events, icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-950/40', href: '/admin/events' },
        { label: 'Event Registrations', value: stats.total_registrations, icon: Users, color: 'text-cyan-600', bg: 'bg-cyan-50 dark:bg-cyan-950/40', href: '/admin/events' },
        { label: 'Published News', value: stats.published_news, icon: Newspaper, color: 'text-teal-600', bg: 'bg-teal-50 dark:bg-teal-950/40', href: '/admin/articles' },
        { label: 'Pending Businesses', value: stats.pending_businesses, icon: Briefcase, color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-950/40', href: '/admin/businesses?status=pending' },
        { label: 'Active Committees', value: stats.active_committees, icon: Award, color: 'text-rose-600', bg: 'bg-rose-50 dark:bg-rose-950/40', href: '/admin/committees' },
        { label: 'Welfare Initiatives', value: stats.community_initiatives, icon: HeartHandshake, color: 'text-pink-600', bg: 'bg-pink-50 dark:bg-pink-950/40', href: '/admin/initiatives' },
    ];

    return (
        <AdminLayout title="Admin Dashboard">
            <Head title="Admin Dashboard - INTAKE97.COM" />

            <div className="space-y-6">
                {/* Header Welcome */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                            Association Executive Dashboard
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            Real-time organizational statistics and platform operations for INTAKE 97 Cadet College Network.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link
                            href="/admin/applications"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors"
                        >
                            <FileText className="size-4" />
                            Review Applications ({stats.pending_applications})
                        </Link>
                    </div>
                </div>

                {/* KPI Cards Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                    {kpis.map((k, idx) => {
                        const Icon = k.icon;
                        return (
                            <Link key={idx} href={k.href} className="block group">
                                <Card className="transition-all duration-150 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 h-full">
                                    <CardContent className="p-4 flex flex-col justify-between h-full">
                                        <div className="flex items-center justify-between">
                                            <div className={`size-9 rounded-xl ${k.bg} flex items-center justify-center ${k.color}`}>
                                                <Icon className="size-4.5" />
                                            </div>
                                            {k.badge && (
                                                <Badge variant="outline" className="text-[10px] bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300">
                                                    {k.badge}
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="mt-3">
                                            <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                                                {k.value}
                                            </div>
                                            <div className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate">
                                                {k.label}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        );
                    })}
                </div>

                {/* Main Dashboard Layout: Left Analytics + Right Feeds */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: 2 Columns */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* College-wise Member Distribution */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                    <GraduationCap className="size-4 text-emerald-600" />
                                    College-wise Alumni Distribution
                                </CardTitle>
                                <span className="text-xs text-slate-400 font-mono">1997 Intake</span>
                            </CardHeader>
                            <CardContent className="space-y-3 pt-2">
                                {collegeDistribution.map((col, idx) => {
                                    const maxCount = Math.max(...collegeDistribution.map(c => c.count), 1);
                                    const percentage = Math.round((col.count / maxCount) * 100);
                                    return (
                                        <div key={idx} className="space-y-1">
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="font-medium text-slate-700 dark:text-slate-300">
                                                    {col.name}
                                                </span>
                                                <span className="font-semibold text-slate-900 dark:text-white">
                                                    {col.count} members
                                                </span>
                                            </div>
                                            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                                                <div
                                                    className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
                                                    style={{ width: `${Math.max(percentage, 5)}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </CardContent>
                        </Card>

                        {/* Recent Membership Applications */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-3">
                                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                    <FileText className="size-4 text-amber-600" />
                                    Recent Membership Applications
                                </CardTitle>
                                <Link
                                    href="/admin/applications"
                                    className="text-xs font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 flex items-center gap-1"
                                >
                                    View Queue <ChevronRight className="size-3.5" />
                                </Link>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {recentApplications.length === 0 ? (
                                        <div className="p-6 text-center text-xs text-slate-400">
                                            No membership applications in queue.
                                        </div>
                                    ) : (
                                        recentApplications.map((app) => (
                                            <div key={app.id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs font-semibold text-slate-900 dark:text-white">
                                                            {app.member?.user?.name}
                                                        </span>
                                                        <Badge variant="outline" className="text-[10px] uppercase font-mono">
                                                            {app.application_no}
                                                        </Badge>
                                                    </div>
                                                    <div className="text-[11px] text-slate-500">
                                                        {app.declared_college?.short_name || app.declared_college?.name} · Roll #{app.declared_roll_no}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <Badge
                                                        className={`text-[10px] capitalize ${
                                                            app.status === 'approved'
                                                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                                                : app.status === 'submitted'
                                                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                                                : app.status === 'under_review'
                                                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                                                                : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                                                        }`}
                                                    >
                                                        {app.status.replace('_', ' ')}
                                                    </Badge>
                                                    <Link
                                                        href={`/admin/applications/${app.id}`}
                                                        className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-medium text-slate-700 dark:text-slate-300"
                                                    >
                                                        Review
                                                    </Link>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Events & System Logs */}
                    <div className="space-y-6">
                        {/* Upcoming Events Widget */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-3">
                                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                    <Calendar className="size-4 text-purple-600" />
                                    Upcoming Events
                                </CardTitle>
                                <Link
                                    href="/admin/events"
                                    className="text-xs font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 flex items-center gap-1"
                                >
                                    Manage <ChevronRight className="size-3.5" />
                                </Link>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {recentEvents.length === 0 ? (
                                    <div className="p-4 text-center text-xs text-slate-400">
                                        No upcoming published events.
                                    </div>
                                ) : (
                                    recentEvents.map((ev) => (
                                        <div key={ev.id} className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 space-y-1">
                                            <div className="text-xs font-semibold text-slate-900 dark:text-white line-clamp-1">
                                                {ev.title}
                                            </div>
                                            <div className="flex items-center justify-between text-[11px] text-slate-500">
                                                <span>{new Date(ev.starts_on).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                                <span className="truncate max-w-[120px]">{ev.venue}</span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </CardContent>
                        </Card>

                        {/* Recent Activity Log */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                    <Clock className="size-4 text-blue-600" />
                                    Recent Audit Trail
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {recentActivities.length === 0 ? (
                                        <div className="p-4 text-center text-xs text-slate-400">
                                            No recent activity logs.
                                        </div>
                                    ) : (
                                        recentActivities.map((act) => (
                                            <div key={act.id} className="p-3 text-xs space-y-0.5">
                                                <div className="font-medium text-slate-800 dark:text-slate-200">
                                                    {act.activity}
                                                </div>
                                                <div className="flex items-center justify-between text-[10px] text-slate-400">
                                                    <span>By {act.user?.name || 'System'}</span>
                                                    <span>{new Date(act.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
