import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import MemberLayout from '@/layouts/member-layout';
import {
    QrCode,
    Calendar,
    Users,
    ArrowRight,
    Bell,
    Clock,
    ShieldCheck,
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
    const isVerified = member?.verification_status === 'verified';
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
                <section className="overflow-hidden rounded-3xl border border-white/10 bg-[#07111F] text-white shadow-[0_18px_40px_rgba(7,17,31,0.16)]">
                    <div className="h-1 bg-gradient-to-r from-[#9A7B3F] via-[#E8D5A3] to-[#C9A55C]" />
                    <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_240px] lg:items-center">
                        <div>
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="rounded-full bg-[#C9A55C]/15 px-2.5 py-1 text-[10px] font-semibold tracking-[0.16em] text-[#E8D5A3] uppercase">
                                    Intake 1997
                                </span>
                                {isVerified ? (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/15 px-2.5 py-1 text-[10px] font-semibold text-emerald-200">
                                        <ShieldCheck className="size-3" /> Verified
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-[#C9A55C]/15 px-2.5 py-1 text-[10px] font-semibold text-[#E8D5A3]">
                                        <Clock className="size-3" /> Verification pending
                                    </span>
                                )}
                            </div>
                            <h1 className="mt-4 font-serif text-3xl leading-tight font-medium tracking-tight sm:text-4xl">
                                Welcome back, {fullName}.
                            </h1>
                            <p className="mt-2 max-w-xl text-sm text-white/65">
                                {collegeName ? (
                                    <>
                                        <span className="text-white">{collegeName}</span>
                                        <span> · </span>
                                    </>
                                ) : (
                                    <>
                                        <Link href="/member/profile" className="text-[#E8D5A3] underline underline-offset-4 hover:text-white">
                                            Add your college
                                        </Link>
                                        <span> · </span>
                                    </>
                                )}
                                Member ID <span className="font-mono text-[#E8D5A3]">{member?.member_code || 'Pending'}</span>
                            </p>
                        </div>

                        <Link
                            href="/member/id-card"
                            className="group rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10"
                        >
                            <div className="flex items-center justify-between text-[11px] font-semibold tracking-wide text-[#E8D5A3] uppercase">
                                <span>Digital ID</span>
                                <QrCode className="size-4" />
                            </div>
                            <div className="mt-4 flex items-center gap-3">
                                <div className="flex size-11 items-center justify-center rounded-xl bg-[#C9A55C] font-serif text-lg font-medium text-[#07111F]">
                                    97
                                </div>
                                <div className="min-w-0">
                                    <div className="truncate text-sm font-semibold">{fullName}</div>
                                    <div className="truncate text-xs text-white/55">{collegeName || 'College not set'}</div>
                                </div>
                            </div>
                            <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-xs text-white/70">
                                <span>View and download</span>
                                <ArrowRight className="size-3.5 transition group-hover:translate-x-0.5" />
                            </div>
                        </Link>
                    </div>
                </section>

                {completion < 100 && (
                    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(7,17,31,0.04)] dark:border-white/10 dark:bg-[#0F1724]">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between gap-3 text-sm">
                                    <span className="font-semibold text-[#0B1220] dark:text-white">Profile {completion}% complete</span>
                                </div>
                                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                                    <div className="h-full rounded-full bg-[#C9A55C]" style={{ width: `${Math.min(completion, 100)}%` }} />
                                </div>
                                <p className="mt-2 text-xs text-slate-500 dark:text-white/55">{gapCopy}</p>
                            </div>
                            <Link
                                href="/member/profile"
                                className="inline-flex shrink-0 items-center justify-center rounded-xl bg-[#07111F] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#121b2e] dark:bg-[#C9A55C] dark:text-[#07111F] dark:hover:bg-[#E8D5A3]"
                            >
                                {member?.college_id ? 'Finish profile' : 'Add college'}
                            </Link>
                        </div>
                    </section>
                )}

                <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                    {stats.map((stat) => {
                        const Icon = stat.icon;

                        return (
                            <Link
                                key={stat.label}
                                href={stat.href}
                                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(7,17,31,0.04)] transition hover:border-[#C9A55C]/70 dark:border-white/10 dark:bg-[#0F1724]"
                            >
                                <div className="flex items-center justify-between gap-2">
                                    <span className="text-[11px] font-semibold tracking-[0.12em] text-slate-500 uppercase dark:text-white/45">{stat.label}</span>
                                    <span className="flex size-8 items-center justify-center rounded-lg bg-[#07111F]/5 text-[#9A7B3F] dark:bg-[#C9A55C]/15 dark:text-[#E8D5A3]">
                                        <Icon className="size-4" />
                                    </span>
                                </div>
                                <div className="mt-3 font-serif text-3xl leading-none text-[#0B1220] dark:text-white">{stat.value}</div>
                                <div className="mt-2 text-[11px] text-slate-400">{stat.hint}</div>
                            </Link>
                        );
                    })}
                </section>

                <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(7,17,31,0.04)] lg:col-span-2 dark:border-white/10 dark:bg-[#0F1724]">
                        <div className="flex items-center justify-between gap-3">
                            <h2 className="flex items-center gap-2 text-sm font-semibold text-[#0B1220] dark:text-white">
                                <Calendar className="size-4 text-[#9A7B3F]" />
                                Upcoming gatherings
                            </h2>
                            <Link href="/member/events" className="inline-flex items-center gap-1 text-xs font-semibold text-[#9A7B3F] hover:text-[#07111F]">
                                All events <ArrowRight className="size-3" />
                            </Link>
                        </div>
                        <div className="mt-4 space-y-3">
                            {upcomingEvents.length === 0 ? (
                                <p className="rounded-xl bg-slate-50 px-4 py-8 text-center text-sm text-slate-500 dark:bg-white/5 dark:text-white/55">
                                    No gatherings are on the calendar yet.
                                </p>
                            ) : (
                                upcomingEvents.map((event) => {
                                    const when = dateParts(event.starts_on);
                                    const registered = registeredEventIds.has(event.id);

                                    return (
                                        <div key={event.id} className="flex flex-col gap-4 rounded-xl border border-slate-100 bg-slate-50/70 p-4 sm:flex-row sm:items-center dark:border-white/10 dark:bg-white/5">
                                            <div className="flex size-14 shrink-0 flex-col items-center justify-center rounded-xl bg-[#07111F] text-white">
                                                <span className="text-[10px] font-semibold tracking-wider text-[#E8D5A3] uppercase">{when.month}</span>
                                                <span className="font-serif text-xl leading-none">{when.day}</span>
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="text-sm font-semibold text-[#0B1220] dark:text-white">{event.title}</div>
                                                <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                                                    <MapPin className="size-3.5 shrink-0" />
                                                    <span className="truncate">{event.venue}</span>
                                                </div>
                                            </div>
                                            <Link
                                                href={`/member/events/${event.slug}`}
                                                className="inline-flex shrink-0 items-center justify-center rounded-xl bg-[#07111F] px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-[#121b2e] dark:bg-[#C9A55C] dark:text-[#07111F] dark:hover:bg-[#E8D5A3]"
                                            >
                                                {registered ? 'View registration' : 'View and register'}
                                            </Link>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(7,17,31,0.04)] dark:border-white/10 dark:bg-[#0F1724]">
                        <h2 className="flex items-center gap-2 text-sm font-semibold text-[#0B1220] dark:text-white">
                            <Bell className="size-4 text-[#9A7B3F]" />
                            Announcements
                        </h2>
                        <div className="mt-4 space-y-3">
                            {latestAnnouncements.length === 0 ? (
                                <p className="rounded-xl bg-slate-50 px-4 py-8 text-center text-sm text-slate-500 dark:bg-white/5 dark:text-white/55">
                                    Nothing published yet.
                                </p>
                            ) : (
                                latestAnnouncements.map((article) => {
                                    const published = dateParts(article.published_at || article.created_at);

                                    return (
                                    <Link
                                        key={article.id}
                                        href={`/member/articles/${article.slug}`}
                                        className="block rounded-xl border border-slate-100 px-3.5 py-3 transition hover:border-[#C9A55C]/60 dark:border-white/10 dark:hover:border-[#C9A55C]/50"
                                    >
                                        <div className="line-clamp-2 text-sm font-semibold text-[#0B1220] dark:text-white">{article.title}</div>
                                        <div className="mt-1 text-[11px] text-slate-400">
                                            {`${published.month} ${published.day}, ${published.year}`}
                                            {article.category?.name ? ` · ${article.category.name}` : ''}
                                        </div>
                                    </Link>
                                    );
                                })
                            )}
                            <Link href="/member/articles" className="inline-flex items-center gap-1 text-xs font-semibold text-[#9A7B3F] hover:text-[#07111F]">
                                All notices <ArrowRight className="size-3" />
                            </Link>
                        </div>
                    </div>
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(7,17,31,0.04)] dark:border-white/10 dark:bg-[#0F1724]">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <h2 className="flex items-center gap-2 text-sm font-semibold text-[#0B1220] dark:text-white">
                                <GraduationCap className="size-4 text-[#9A7B3F]" />
                                {featuredScope === 'college' && collegeName ? `From ${collegeName}` : 'Verified batchmates'}
                            </h2>
                            {featuredScope === 'batch' && (
                                <p className="mt-1 text-xs text-slate-500 dark:text-white/55">Add your college to see your own campus first.</p>
                            )}
                        </div>
                        <Link href="/member/directory" className="inline-flex items-center gap-1 text-xs font-semibold text-[#9A7B3F] hover:text-[#07111F]">
                            Directory <ArrowRight className="size-3" />
                        </Link>
                    </div>
                    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {featuredBatchmates.length === 0 ? (
                            <p className="col-span-full rounded-xl bg-slate-50 px-4 py-8 text-center text-sm text-slate-500 dark:bg-white/5 dark:text-white/55">
                                No verified batchmates to show yet.
                            </p>
                        ) : (
                            featuredBatchmates.map((batchmate) => (
                                <Link
                                    key={batchmate.id}
                                    href={`/member/directory/${batchmate.id}`}
                                    className="flex items-center gap-3 rounded-xl border border-slate-100 px-3 py-3 transition hover:border-[#C9A55C]/60 dark:border-white/10 dark:hover:border-[#C9A55C]/50"
                                >
                                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#07111F] text-sm font-semibold text-[#E8D5A3]">
                                        {batchmate.user?.name?.charAt(0) || 'B'}
                                    </div>
                                    <div className="min-w-0">
                                        <div className="truncate text-sm font-semibold text-[#0B1220] dark:text-white">{batchmate.user?.name}</div>
                                        <div className="truncate text-xs text-slate-500">
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
