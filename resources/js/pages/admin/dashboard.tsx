import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import {
    Users,
    UserCheck,
    FileText,
    Calendar,
    Newspaper,
    Briefcase,
    GraduationCap,
    Clock,
    ChevronRight,
    Award,
    HeartHandshake,
} from 'lucide-react';
import type { MembershipApplication, Event } from '@/types';

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
    recentApplications,
    recentEvents,
    recentActivities,
}: DashboardProps) {
    const kpis = [
        { label: 'Total Members', value: stats.total_members, icon: Users, color: 'text-[#1B84FF]', bg: 'bg-[#F1F6FF]', href: '/admin/members' },
        { label: 'Verified Alumni', value: stats.verified_members, icon: UserCheck, color: 'text-[#17C653]', bg: 'bg-[#EAFFF1]', href: '/admin/members?verification_status=verified' },
        { label: 'Pending Applications', value: stats.pending_applications, icon: FileText, color: 'text-[#B45309]', bg: 'bg-[#FFF8DD]', href: '/admin/applications?status=submitted' },
        { label: 'Participating Colleges', value: stats.participating_colleges, icon: GraduationCap, color: 'text-[#7239EA]', bg: 'bg-[#F3F0FF]', href: '/admin/colleges' },
        { label: 'Upcoming Events', value: stats.upcoming_events, icon: Calendar, color: 'text-[#1B84FF]', bg: 'bg-[#F1F6FF]', href: '/admin/events' },
        { label: 'Event Registrations', value: stats.total_registrations, icon: Users, color: 'text-[#0EA5E9]', bg: 'bg-[#EFF6FF]', href: '/admin/events' },
        { label: 'Published News', value: stats.published_news, icon: Newspaper, color: 'text-[#17C653]', bg: 'bg-[#EAFFF1]', href: '/admin/articles' },
        { label: 'Pending Businesses', value: stats.pending_businesses, icon: Briefcase, color: 'text-[#B45309]', bg: 'bg-[#FFF8DD]', href: '/admin/businesses?status=pending' },
        { label: 'Active Committees', value: stats.active_committees, icon: Award, color: 'text-[#7239EA]', bg: 'bg-[#F3F0FF]', href: '/admin/committees' },
        { label: 'Welfare Initiatives', value: stats.community_initiatives, icon: HeartHandshake, color: 'text-[#F8285A]', bg: 'bg-[#FFEEF3]', href: '/admin/initiatives' },
    ];

    return (
        <AdminLayout title="Admin Dashboard">
            <Head title="Admin Dashboard - INTAKE97.COM" />

            <div className="w-full space-y-6">
                {/* Header Welcome Card */}
                <div className="flex flex-col justify-between gap-4 rounded-xl border border-[#F1F1F4] bg-white p-5 shadow-[0_3px_4px_0_rgba(0,0,0,0.03)] sm:flex-row sm:items-center sm:p-6">
                    <div>
                        <h1 className="text-[20px] font-semibold tracking-tight text-[#071437] sm:text-[22px]">
                            Association Executive Dashboard
                        </h1>
                        <p className="mt-1 text-[13px] text-[#78829D]">
                            Real-time organizational statistics and platform operations for INTAKE 97 Cadet College Network.
                        </p>
                    </div>
                    <Link
                        href="/admin/applications"
                        className="inline-flex h-9.5 shrink-0 items-center gap-2 self-start rounded-lg bg-[#1B84FF] px-4 text-[12.5px] font-semibold text-white transition-colors hover:bg-[#006AE6] sm:self-auto"
                    >
                        <FileText className="size-4" />
                        Review Applications ({stats.pending_applications})
                    </Link>
                </div>

                {/* KPI Cards Grid */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                    {kpis.map((k, idx) => {
                        const Icon = k.icon;
                        return (
                            <Link key={idx} href={k.href} className="group block">
                                <div className="flex h-full flex-col justify-between rounded-xl border border-[#F1F1F4] bg-white p-4.5 shadow-[0_3px_4px_0_rgba(0,0,0,0.03)] transition-colors hover:border-[#DBDFE9]">
                                    <div className={`flex size-9 items-center justify-center rounded-lg ${k.bg} ${k.color}`}>
                                        <Icon className="size-4.5" strokeWidth={1.75} />
                                    </div>
                                    <div className="mt-3.5">
                                        <div className="text-[24px] leading-tight font-bold tracking-tight text-[#071437]">
                                            {k.value}
                                        </div>
                                        <div className="mt-0.5 truncate text-[12px] font-medium text-[#78829D]">
                                            {k.label}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* Main Dashboard Layout: Left Analytics + Right Feeds */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Left: 2 Columns */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* College-wise Member Distribution */}
                        <div className="rounded-xl border border-[#F1F1F4] bg-white p-5 shadow-[0_3px_4px_0_rgba(0,0,0,0.03)] sm:p-6">
                            <div className="flex items-center justify-between border-b border-[#F1F1F4] pb-4">
                                <h2 className="flex items-center gap-2 text-[15px] font-semibold text-[#071437]">
                                    <GraduationCap className="size-4 text-[#1B84FF]" />
                                    College-wise Alumni Distribution
                                </h2>
                                <span className="font-mono text-[11.5px] text-[#99A1B7]">1997 Intake</span>
                            </div>
                            <div className="mt-4 space-y-3.5">
                                {collegeDistribution.map((col, idx) => {
                                    const maxCount = Math.max(...collegeDistribution.map((c) => c.count), 1);
                                    const percentage = Math.round((col.count / maxCount) * 100);
                                    return (
                                        <div key={idx} className="space-y-1.5">
                                            <div className="flex items-center justify-between text-[12.5px]">
                                                <span className="font-medium text-[#4B5675]">{col.name}</span>
                                                <span className="font-semibold text-[#071437]">{col.count} members</span>
                                            </div>
                                            <div className="h-2 w-full overflow-hidden rounded-full bg-[#F1F6FF]">
                                                <div
                                                    className="h-2 rounded-full bg-[#1B84FF] transition-all duration-500"
                                                    style={{ width: `${Math.max(percentage, 5)}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Recent Membership Applications */}
                        <div className="overflow-hidden rounded-xl border border-[#F1F1F4] bg-white shadow-[0_3px_4px_0_rgba(0,0,0,0.03)]">
                            <div className="flex items-center justify-between border-b border-[#F1F1F4] px-5 py-4 sm:px-6">
                                <h2 className="flex items-center gap-2 text-[15px] font-semibold text-[#071437]">
                                    <FileText className="size-4 text-[#1B84FF]" />
                                    Recent Membership Applications
                                </h2>
                                <Link
                                    href="/admin/applications"
                                    className="inline-flex items-center gap-1 text-[12.5px] font-semibold text-[#1B84FF] hover:text-[#006AE6]"
                                >
                                    View Queue <ChevronRight className="size-3.5" />
                                </Link>
                            </div>
                            <div className="divide-y divide-[#F1F1F4]">
                                {recentApplications.length === 0 ? (
                                    <div className="p-8 text-center text-[12.5px] text-[#99A1B7]">
                                        No membership applications in queue.
                                    </div>
                                ) : (
                                    recentApplications.map((app) => (
                                        <div
                                            key={app.id}
                                            className="flex items-center justify-between gap-4 px-5 py-3.5 transition-colors hover:bg-[#FCFCFC] sm:px-6"
                                        >
                                            <div className="min-w-0 space-y-0.5">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span className="truncate text-[13.5px] font-semibold text-[#071437]">
                                                        {app.member?.user?.name}
                                                    </span>
                                                    <span className="rounded bg-[#FCFCFC] px-1.5 py-0.5 font-mono text-[10.5px] text-[#78829D] ring-1 ring-[#F1F1F4]">
                                                        {app.application_no}
                                                    </span>
                                                </div>
                                                <div className="text-[12px] text-[#78829D]">
                                                    {app.declared_college?.short_name || app.declared_college?.name} · Roll #{app.declared_roll_no}
                                                </div>
                                            </div>
                                            <div className="flex shrink-0 items-center gap-3">
                                                <span
                                                    className={`inline-flex rounded-md px-2 py-0.5 text-[11px] font-semibold capitalize ${
                                                        app.status === 'approved'
                                                            ? 'bg-[#EAFFF1] text-[#17C653]'
                                                            : app.status === 'submitted'
                                                              ? 'bg-[#FFF8DD] text-[#B45309]'
                                                              : app.status === 'under_review'
                                                                ? 'bg-[#F1F6FF] text-[#1B84FF]'
                                                                : 'bg-[#FFEEF3] text-[#F8285A]'
                                                    }`}
                                                >
                                                    {app.status.replace('_', ' ')}
                                                </span>
                                                <Link
                                                    href={`/admin/applications/${app.id}`}
                                                    className="rounded-lg border border-[#DBDFE9] bg-white px-2.5 py-1 text-[12px] font-semibold text-[#4B5675] transition-colors hover:bg-[#F9F9F9] hover:text-[#071437]"
                                                >
                                                    Review
                                                </Link>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Events & System Logs */}
                    <div className="space-y-6">
                        {/* Upcoming Events Widget */}
                        <div className="rounded-xl border border-[#F1F1F4] bg-white p-5 shadow-[0_3px_4px_0_rgba(0,0,0,0.03)] sm:p-6">
                            <div className="flex items-center justify-between border-b border-[#F1F1F4] pb-3.5">
                                <h2 className="flex items-center gap-2 text-[15px] font-semibold text-[#071437]">
                                    <Calendar className="size-4 text-[#1B84FF]" />
                                    Upcoming Events
                                </h2>
                                <Link
                                    href="/admin/events"
                                    className="inline-flex items-center gap-1 text-[12.5px] font-semibold text-[#1B84FF] hover:text-[#006AE6]"
                                >
                                    Manage <ChevronRight className="size-3.5" />
                                </Link>
                            </div>
                            <div className="mt-4 space-y-3">
                                {recentEvents.length === 0 ? (
                                    <div className="py-4 text-center text-[12.5px] text-[#99A1B7]">
                                        No upcoming published events.
                                    </div>
                                ) : (
                                    recentEvents.map((ev) => (
                                        <div
                                            key={ev.id}
                                            className="space-y-1 rounded-xl border border-[#F1F1F4] bg-[#FCFCFC] p-3.5"
                                        >
                                            <div className="line-clamp-1 text-[13px] font-semibold text-[#071437]">
                                                {ev.title}
                                            </div>
                                            <div className="flex items-center justify-between text-[11.5px] text-[#78829D]">
                                                <span>
                                                    {new Date(ev.starts_on).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric',
                                                    })}
                                                </span>
                                                <span className="max-w-[140px] truncate">{ev.venue}</span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Recent Activity Log */}
                        <div className="overflow-hidden rounded-xl border border-[#F1F1F4] bg-white shadow-[0_3px_4px_0_rgba(0,0,0,0.03)]">
                            <div className="border-b border-[#F1F1F4] px-5 py-4 sm:px-6">
                                <h2 className="flex items-center gap-2 text-[15px] font-semibold text-[#071437]">
                                    <Clock className="size-4 text-[#1B84FF]" />
                                    Recent Audit Trail
                                </h2>
                            </div>
                            <div className="divide-y divide-[#F1F1F4]">
                                {recentActivities.length === 0 ? (
                                    <div className="p-6 text-center text-[12.5px] text-[#99A1B7]">
                                        No recent activity logs.
                                    </div>
                                ) : (
                                    recentActivities.map((act) => (
                                        <div key={act.id} className="space-y-0.5 px-5 py-3.5 sm:px-6">
                                            <div className="text-[12.5px] font-medium text-[#071437]">
                                                {act.activity}
                                            </div>
                                            <div className="flex items-center justify-between text-[11px] text-[#99A1B7]">
                                                <span>By {act.user?.name || 'System'}</span>
                                                <span>
                                                    {new Date(act.created_at).toLocaleTimeString([], {
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
