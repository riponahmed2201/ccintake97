import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    LayoutDashboard,
    UserCircle,
    QrCode,
    Users,
    UserCheck,
    Calendar,
    Newspaper,
    Briefcase,
    GraduationCap,
    Bell,
    Bookmark,
    LifeBuoy,
    LogOut,
    Menu,
    X,
    Shield,
    ChevronRight,
} from 'lucide-react';
import type { AuthUser } from '@/types';

interface MemberLayoutProps {
    children: React.ReactNode;
    title?: string;
    breadcrumbs?: { title: string; href?: string }[];
}

export default function MemberLayout({ children, title, breadcrumbs = [] }: MemberLayoutProps) {
    const page = usePage();
    const auth = (page.props as any).auth?.user as AuthUser | undefined;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const isStaff = auth?.roles?.some((r) =>
        ['super_admin', 'association_admin', 'membership_manager', 'membership_reviewer', 'event_manager', 'content_editor', 'content_publisher'].includes(r)
    );

    const navItems = [
        { label: 'Overview', href: '/member/dashboard', icon: LayoutDashboard },
        { label: 'My Profile', href: '/member/profile', icon: UserCircle },
        { label: 'Digital Alumni ID', href: '/member/id-card', icon: QrCode },
        { label: 'Alumni Directory', href: '/member/directory', icon: Users },
        { label: 'My Connections', href: '/member/connections', icon: UserCheck },
        { label: 'Reunions & Events', href: '/member/events', icon: Calendar },
        { label: 'News & Notices', href: '/member/articles', icon: Newspaper },
        { label: 'Business Network', href: '/member/businesses', icon: Briefcase },
        { label: 'Mentorship Hub', href: '/member/mentorship', icon: GraduationCap },
        { label: 'Notifications', href: '/member/notifications', icon: Bell },
        { label: 'Saved Items', href: '/member/favorites', icon: Bookmark },
        { label: 'Help & Support', href: '/member/tickets', icon: LifeBuoy },
    ];

    const currentPath = window.location.pathname;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex">
            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-transform duration-200 ease-in-out md:translate-x-0 ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                {/* Brand */}
                <div className="h-16 px-6 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
                    <Link href="/member/dashboard" className="flex items-center gap-3">
                        <div className="size-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white text-base shadow-sm">
                            97
                        </div>
                        <div>
                            <div className="font-bold text-sm tracking-wide text-slate-900 dark:text-white uppercase">
                                INTAKE 97
                            </div>
                            <div className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold tracking-wider">
                                ALUMNI PORTAL
                            </div>
                        </div>
                    </Link>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-white md:hidden"
                    >
                        <X className="size-5" />
                    </button>
                </div>

                {/* Member ID preview widget in sidebar */}
                {auth?.member && (
                    <div className="mx-3 mt-3 p-3 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-slate-800 dark:to-indigo-950/40 rounded-xl border border-indigo-100 dark:border-indigo-900/50">
                        <div className="text-[10px] font-semibold tracking-wider text-indigo-600 dark:text-indigo-400 uppercase">
                            Cadet Affiliation
                        </div>
                        <div className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate mt-0.5">
                            {auth.member.college?.short_name || auth.member.college?.name}
                        </div>
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-indigo-100 dark:border-slate-700/50 text-[11px]">
                            <span className="text-slate-500 font-mono text-[10px]">
                                {auth.member.member_code || 'Pending ID'}
                            </span>
                            <span
                                className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                                    auth.member.verification_status === 'verified'
                                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                                        : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                                }`}
                            >
                                {auth.member.verification_status}
                            </span>
                        </div>
                    </div>
                )}

                {/* Nav Items */}
                <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = currentPath === item.href || (item.href !== '/member/dashboard' && currentPath.startsWith(item.href));
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                                    isActive
                                        ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                                }`}
                            >
                                <Icon className="size-4 shrink-0" />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </div>

                {/* Footer Switcher */}
                <div className="p-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
                    {isStaff && (
                        <Link
                            href="/admin/dashboard"
                            className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium bg-slate-900 text-emerald-400 hover:bg-slate-800 transition-colors"
                        >
                            <span className="flex items-center gap-2">
                                <Shield className="size-3.5 text-emerald-400" />
                                Admin Management
                            </span>
                            <ChevronRight className="size-3.5 text-slate-400" />
                        </Link>
                    )}
                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                    >
                        <LogOut className="size-3.5" />
                        Log out
                    </Link>
                </div>
            </aside>

            {/* Main Area */}
            <div className="flex-1 flex flex-col md:pl-64 min-w-0">
                {/* Header */}
                <header className="sticky top-0 z-30 h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="p-2 rounded-md text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden"
                        >
                            <Menu className="size-5" />
                        </button>
                        <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 gap-1.5 overflow-hidden">
                            <Link href="/member/dashboard" className="hover:text-slate-900 dark:hover:text-white">
                                Portal
                            </Link>
                            {breadcrumbs.map((b, i) => (
                                <React.Fragment key={i}>
                                    <span>/</span>
                                    {b.href ? (
                                        <Link href={b.href} className="hover:text-slate-900 dark:hover:text-white">
                                            {b.title}
                                        </Link>
                                    ) : (
                                        <span className="font-semibold text-slate-900 dark:text-white truncate">
                                            {b.title}
                                        </span>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href="/member/notifications"
                            className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-colors relative"
                        >
                            <Bell className="size-4" />
                        </Link>
                        <Link href="/member/profile" className="flex items-center gap-2.5 pl-2">
                            <div className="size-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-sm ring-2 ring-indigo-500/20">
                                {auth?.name?.charAt(0) || 'M'}
                            </div>
                            <span className="hidden sm:inline text-xs font-semibold text-slate-800 dark:text-slate-200">
                                {auth?.name}
                            </span>
                        </Link>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
