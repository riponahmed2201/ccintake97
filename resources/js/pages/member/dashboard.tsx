import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import MemberLayout from '@/layouts/member-layout';
import {
    QrCode,
    Calendar,
    Users,
    ArrowRight,
    Bell,
    UserCheck,
    MapPin,
    GraduationCap,
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
    featuredScope: 'college' | 'batch';
    unreadNotificationsCount: number;
}

function dateParts(value: string) {
    const [year, month, day] = value.slice(0, 10).split('-').map(Number);
    const date = new Date(year, (month || 1) - 1, day || 1);

    return {
        day: day || date.getDate(),
        month: date.toLocaleDateString('en-GB', { month: 'short' }),
        year,
    };
}

export default function MemberDashboard({
    member,
    upcomingEvents,
    myRegistrations,
    latestAnnouncements,
    connectionsCount,
    pendingRequestsCount,
    featuredBatchmates,
    featuredScope,
    unreadNotificationsCount,
}: MemberDashboardProps) {
    const page = usePage();
    const authName = (page.props as { auth?: { user?: { name?: string } } }).auth?.user?.name;
    const fullName = member?.user?.name || authName || 'Batchmate';
    const completion = member?.profile?.profile_completion ?? 0;
    const collegeName = member?.college?.short_name || member?.college?.name;
    const registeredEventIds = new Set(myRegistrations.map((registration) => registration.event_id));

    const gaps = [
        !member?.college_id ? 'college' : null,
        !member?.profile?.designation ? 'profession' : null,
        !member?.profile?.organization ? 'organization' : null,
        !member?.profile?.city ? 'city' : null,
        !member?.profile?.professional_bio ? 'a short bio' : null,
    ].filter((gap): gap is string => Boolean(gap));

    const gapCopy = !member?.college_id
        ? 'Add your college so batchmates from your campus can find you.'
        : gaps.length > 0
          ? `Add ${gaps.slice(0, 2).join(' and ')} to finish your profile.`
          : 'A few details will make you easier to find.';

    const stats = [
        { label: 'Connections', value: connectionsCount, href: '/member/connections', icon: UserCheck, hint: 'Accepted' },
        { label: 'Requests', value: pendingRequestsCount, href: '/member/connections', icon: Users, hint: 'Waiting on you' },
        { label: 'Events', value: myRegistrations.length, href: '/member/events', icon: Calendar, hint: 'Registered' },
        { label: 'Notices', value: unreadNotificationsCount, href: '/member/notifications', icon: Bell, hint: 'Unread' },
    ];

    return (
        <MemberLayout title="Alumni Dashboard" breadcrumbs={[{ title: 'Overview' }]}>
            <Head title="Alumni Portal - INTAKE97.COM" />

            <div className="space-y-6">
                {/* Clean Metronic Welcome Header + Digital ID */}
                <section className="rounded-xl border border-[#F1F1F4] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] sm:p-7">
                    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_270px] lg:items-center">
                        <div>
                            <p className="text-[11px] font-semibold tracking-[0.12em] text-[#99A1B7] uppercase">
                                Alumni Overview · Class of 1997
                            </p>
                            <h1 className="mt-1.5 text-[24px] leading-tight font-semibold tracking-tight text-[#071437] sm:text-[28px]">
                                Welcome back, {fullName}
                            </h1>
                            <p className="mt-2 max-w-xl text-[13.5px] text-[#78829D]">
                                {collegeName ? (
                                    <>
                                        <span className="font-medium text-[#071437]">{collegeName}</span>
                                        <span className="mx-2 text-[#DBDFE9]">·</span>
                                    </>
                                ) : (
                                    <>
                                        <Link href="/member/profile" className="font-medium text-[#1B84FF] hover:underline">
                                            Add your college
                                        </Link>
                                        <span className="mx-2 text-[#DBDFE9]">·</span>
                                    </>
                                )}
                                <span>Member ID </span>
                                <span className="font-mono font-medium text-[#071437]">{member?.member_code || 'Pending'}</span>
                            </p>
                        </div>

                        <Link
                            href="/member/id-card"
                            className="group rounded-xl border border-[#F1F1F4] bg-[#FCFCFC] p-4 transition-all hover:border-[#1B84FF]/35 hover:bg-white"
                        >
                            <div className="flex items-center justify-between text-[11px] font-semibold tracking-wide text-[#78829D] uppercase">
                                <span>Digital Alumni ID</span>
                                <QrCode className="size-4 text-[#1B84FF]" />
                            </div>
                            <div className="mt-3 flex items-center gap-3">
                                <div className="flex size-10 items-center justify-center rounded-lg bg-[#071437] text-[13px] font-bold text-white">
                                    97
                                </div>
                                <div className="min-w-0">
                                    <div className="truncate text-[13.5px] font-semibold text-[#071437]">{fullName}</div>
                                    <div className="truncate text-[12px] text-[#78829D]">{collegeName || 'College not set'}</div>
                                </div>
                            </div>
                            <div className="mt-3 flex items-center justify-between border-t border-[#F1F1F4] pt-2.5 text-[12px] font-medium text-[#4B5675] group-hover:text-[#1B84FF]">
                                <span>View &amp; download pass</span>
                                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                            </div>
                        </Link>
                    </div>
                </section>

                {/* Metronic KPI Stat Cards */}
                <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                    {stats.map((stat) => {
                        const Icon = stat.icon;

                        return (
                            <Link
                                key={stat.label}
                                href={stat.href}
                                className="group rounded-xl border border-[#F1F1F4] bg-white p-5 shadow-[0_3px_4px_0_rgba(0,0,0,0.03)] transition-all hover:border-[#1B84FF]/35 hover:shadow-md"
                            >
                                <div className="flex items-center justify-between gap-2">
                                    <span className="text-[12px] font-medium text-[#78829D]">{stat.label}</span>
                                    <span className="flex size-9 items-center justify-center rounded-lg bg-[#F1F6FF] text-[#1B84FF]">
                                        <Icon className="size-[18px]" strokeWidth={1.75} />
                                    </span>
                                </div>
                                <div className="mt-3 text-[28px] leading-none font-semibold tracking-tight text-[#071437] tabular-nums">{stat.value}</div>
                                <div className="mt-2.5 flex items-center justify-between text-[12px] text-[#99A1B7]">
                                    <span>{stat.hint}</span>
                                    <ArrowRight className="size-3.5 text-[#1B84FF] opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
                                </div>
                            </Link>
                        );
                    })}
                </section>

                {completion < 100 && (
                    <section className="rounded-xl border border-[#F1F1F4] bg-white p-5 shadow-[0_3px_4px_0_rgba(0,0,0,0.03)]">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between gap-3 text-[13.5px]">
                                    <span className="font-semibold text-[#071437]">Profile Completion</span>
                                    <span className="font-semibold text-[#1B84FF]">{completion}%</span>
                                </div>
                                <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#F1F1F4]">
                                    <div className="h-full rounded-full bg-[#1B84FF]" style={{ width: `${Math.min(completion, 100)}%` }} />
                                </div>
                                <p className="mt-2 text-[12.5px] text-[#78829D]">{gapCopy}</p>
                            </div>
                            <Link
                                href="/member/profile"
                                className="inline-flex shrink-0 items-center justify-center rounded-lg bg-[#1B84FF] px-4 py-2 text-[12.5px] font-semibold text-white transition hover:bg-[#006AE6]"
                            >
                                {member?.college_id ? 'Finish profile' : 'Add college'}
                            </Link>
                        </div>
                    </section>
                )}

                <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="rounded-xl border border-[#F1F1F4] bg-white p-5 shadow-[0_3px_4px_0_rgba(0,0,0,0.03)] lg:col-span-2">
                        <div className="flex items-center justify-between gap-3 border-b border-[#F1F1F4] pb-4">
                            <h2 className="flex items-center gap-2 text-[15px] font-semibold text-[#071437]">
                                <Calendar className="size-[18px] text-[#1B84FF]" strokeWidth={1.75} />
                                Upcoming gatherings
                            </h2>
                            <Link href="/member/events" className="inline-flex items-center gap-1 text-[12.5px] font-semibold text-[#1B84FF] hover:text-[#006AE6]">
                                All events <ArrowRight className="size-3.5" />
                            </Link>
                        </div>
                        <div className="mt-4 space-y-3">
                            {upcomingEvents.length === 0 ? (
                                <p className="rounded-lg bg-[#FCFCFC] px-4 py-8 text-center text-[13px] text-[#78829D]">
                                    No gatherings are on the calendar yet.
                                </p>
                            ) : (
                                upcomingEvents.map((event) => {
                                    const when = dateParts(event.starts_on);
                                    const registered = registeredEventIds.has(event.id);

                                    return (
                                        <div key={event.id} className="flex flex-col gap-4 rounded-xl border border-[#F1F1F4] bg-[#FCFCFC] p-4 transition hover:border-[#1B84FF]/30 hover:bg-white sm:flex-row sm:items-center">
                                            <div className="flex size-13 shrink-0 flex-col items-center justify-center rounded-lg bg-[#F1F6FF] text-[#1B84FF]">
                                                <span className="text-[10px] font-semibold tracking-wider uppercase">{when.month}</span>
                                                <span className="text-[18px] leading-none font-bold">{when.day}</span>
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="text-[14px] font-semibold text-[#071437]">{event.title}</div>
                                                <div className="mt-1 flex items-center gap-1.5 text-[12.5px] text-[#78829D]">
                                                    <MapPin className="size-3.5 shrink-0 text-[#99A1B7]" />
                                                    <span className="truncate">{event.venue}</span>
                                                </div>
                                            </div>
                                            <Link
                                                href={`/member/events/${event.slug}`}
                                                className="inline-flex shrink-0 items-center justify-center rounded-lg border border-[#DBDFE9] bg-white px-3.5 py-2 text-[12px] font-semibold text-[#4B5675] transition hover:border-[#1B84FF] hover:bg-[#1B84FF] hover:text-white"
                                            >
                                                {registered ? 'View registration' : 'View and register'}
                                            </Link>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    <div className="rounded-xl border border-[#F1F1F4] bg-white p-5 shadow-[0_3px_4px_0_rgba(0,0,0,0.03)]">
                        <div className="flex items-center justify-between gap-3 border-b border-[#F1F1F4] pb-4">
                            <h2 className="flex items-center gap-2 text-[15px] font-semibold text-[#071437]">
                                <Bell className="size-[18px] text-[#1B84FF]" strokeWidth={1.75} />
                                Announcements
                            </h2>
                            <Link href="/member/articles" className="inline-flex items-center gap-1 text-[12.5px] font-semibold text-[#1B84FF] hover:text-[#006AE6]">
                                All notices <ArrowRight className="size-3.5" />
                            </Link>
                        </div>
                        <div className="mt-4 space-y-2.5">
                            {latestAnnouncements.length === 0 ? (
                                <p className="rounded-lg bg-[#FCFCFC] px-4 py-8 text-center text-[13px] text-[#78829D]">
                                    Nothing published yet.
                                </p>
                            ) : (
                                latestAnnouncements.map((article) => {
                                    const published = dateParts(article.published_at || article.created_at);

                                    return (
                                    <Link
                                        key={article.id}
                                        href={`/member/articles/${article.slug}`}
                                        className="block rounded-lg border border-[#F1F1F4] px-3.5 py-3 transition hover:border-[#1B84FF]/30 hover:bg-[#FCFCFC]"
                                    >
                                        <div className="line-clamp-2 text-[13.5px] font-semibold text-[#071437]">{article.title}</div>
                                        <div className="mt-1 text-[11.5px] text-[#99A1B7]">
                                            {`${published.month} ${published.day}, ${published.year}`}
                                            {article.category?.name ? ` · ${article.category.name}` : ''}
                                        </div>
                                    </Link>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </section>

                <section className="rounded-xl border border-[#F1F1F4] bg-white p-5 shadow-[0_3px_4px_0_rgba(0,0,0,0.03)]">
                    <div className="flex items-center justify-between gap-3 border-b border-[#F1F1F4] pb-4">
                        <div>
                            <h2 className="flex items-center gap-2 text-[15px] font-semibold text-[#071437]">
                                <GraduationCap className="size-[18px] text-[#1B84FF]" strokeWidth={1.75} />
                                {featuredScope === 'college' && collegeName ? `From ${collegeName}` : 'Verified batchmates'}
                            </h2>
                            {featuredScope === 'batch' && (
                                <p className="mt-1 text-[12.5px] text-[#78829D]">Add your college to see your own campus first.</p>
                            )}
                        </div>
                        <Link href="/member/directory" className="inline-flex items-center gap-1 text-[12.5px] font-semibold text-[#1B84FF] hover:text-[#006AE6]">
                            Directory <ArrowRight className="size-3.5" />
                        </Link>
                    </div>
                    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {featuredBatchmates.length === 0 ? (
                            <p className="col-span-full rounded-lg bg-[#FCFCFC] px-4 py-8 text-center text-[13px] text-[#78829D]">
                                No verified batchmates to show yet.
                            </p>
                        ) : (
                            featuredBatchmates.map((batchmate) => (
                                <Link
                                    key={batchmate.id}
                                    href={`/member/directory/${batchmate.id}`}
                                    className="group flex items-center gap-3 rounded-xl border border-[#F1F1F4] px-3.5 py-3 transition hover:border-[#1B84FF]/35 hover:bg-[#FCFCFC]"
                                >
                                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#F1F6FF] text-[13px] font-semibold text-[#1B84FF]">
                                        {batchmate.user?.name?.charAt(0) || 'B'}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="truncate text-[13.5px] font-semibold text-[#071437] group-hover:text-[#1B84FF]">{batchmate.user?.name}</div>
                                        <div className="truncate text-[12px] text-[#78829D]">
                                            {batchmate.profile?.designation || batchmate.profile?.organization || batchmate.college?.short_name || '1997 alumnus'}
                                        </div>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                </section>
            </div>
        </MemberLayout>
    );
}
