import React, { useState } from 'react';
import BrandMark from '@/components/brand-mark';
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
    fluid?: boolean;
}

export default function MemberLayout({ children, title, breadcrumbs = [], fluid = false }: MemberLayoutProps) {
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
        <div className="flex min-h-screen bg-[#F4F6F8] text-slate-900 dark:bg-[#070B14] dark:text-slate-100">
            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#07111F] border-r border-white/10 text-white flex flex-col transition-transform duration-200 ease-in-out md:translate-x-0 ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                {/* Brand */}
                <div className="h-16 px-6 flex items-center justify-between border-b border-white/10">
                    <Link href="/member/dashboard" className="flex items-center gap-3">
                        <BrandMark className="h-10 w-auto shrink-0" />
                        <div>
                            <div className="font-brand text-lg leading-tight font-semibold text-white">
                                ccIntake97
                            </div>
                            <div className="text-[10px] text-[#E8D5A3] font-semibold tracking-wider">
                                ALUMNI PORTAL
                            </div>
                        </div>
                    </Link>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="p-1 rounded-md text-white/50 hover:text-white md:hidden"
                    >
                        <X className="size-5" />
                    </button>
                </div>

                {/* Member ID preview widget in sidebar */}
                {auth?.member && (
                    <div className="mx-3 mt-3 p-3 rounded-xl border border-white/10 bg-white/5">
                        <div className="text-[10px] font-semibold tracking-wider text-[#E8D5A3] uppercase">
                            Cadet Affiliation
                        </div>
                        <div className="text-xs font-bold text-white truncate mt-0.5">
                            {auth.member.college?.short_name || auth.member.college?.name || 'College not set'}
                        </div>
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/10 text-[11px]">
                            <span className="text-white/50 font-mono text-[10px]">
                                {auth.member.member_code || 'Pending ID'}
                            </span>
                            <span
                                className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                                    auth.member.verification_status === 'verified'
                                        ? 'bg-emerald-400/15 text-emerald-200'
                                        : 'bg-[#C9A55C]/20 text-[#E8D5A3]'
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
                                        ? 'bg-[#C9A55C] text-[#07111F] font-semibold shadow-sm'
                                        : 'text-white/70 hover:bg-white/10 hover:text-white'
                                }`}
                            >
                                <Icon className="size-4 shrink-0" />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </div>

                {/* Footer Switcher */}
                <div className="p-3 border-t border-white/10 space-y-1.5">
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
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-rose-300 hover:bg-white/10 transition-colors"
                    >
                        <LogOut className="size-3.5" />
                        Log out
                    </Link>
                </div>
            </aside>

            {/* Main Area */}
            <div className="flex-1 flex flex-col md:pl-64 min-w-0">
                {/* Header */}
                <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6 dark:border-white/10 dark:bg-[#0B1220]">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="rounded-md p-2 text-slate-500 hover:bg-slate-100 md:hidden dark:text-white/70 dark:hover:bg-white/10"
                        >
                            <Menu className="size-5" />
                        </button>
                        <div className="flex items-center gap-1.5 overflow-hidden text-xs text-slate-500 dark:text-white/50">
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
                                        <span className="truncate font-semibold text-slate-900 dark:text-white">
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
                            className="relative rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
                        >
                            <Bell className="size-4" />
                        </Link>
                        <Link href="/member/profile" className="flex items-center gap-2.5 pl-2">
                            <div className="flex size-8 items-center justify-center rounded-full bg-[#07111F] text-xs font-bold text-[#E8D5A3] shadow-sm ring-2 ring-[#C9A55C]/30">
                                {auth?.name?.charAt(0) || 'M'}
                            </div>
                            <span className="hidden text-xs font-semibold text-slate-800 sm:inline dark:text-white">
                                {auth?.name}
                            </span>
                        </Link>
                    </div>
                </header>

                {/* Page Content */}
                <main className={fluid ? 'w-full flex-1' : 'mx-auto w-full max-w-7xl flex-1 p-4 sm:p-6 lg:p-8'}>
                    {children}
                </main>
            </div>
        </div>
    );
}
