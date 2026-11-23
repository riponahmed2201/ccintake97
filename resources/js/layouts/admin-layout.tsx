import React, { useState } from 'react';
import BrandMark from '@/components/brand-mark';
import { Link, usePage } from '@inertiajs/react';
import {
    LayoutDashboard,
    Users,
    FileCheck2,
    GraduationCap,
    Award,
    Calendar,
    Newspaper,
    Briefcase,
    HeartHandshake,
    LifeBuoy,
    BarChart3,
    ShieldAlert,
    ShieldCheck,
    Settings,
    LogOut,
    Menu,
    X,
    ExternalLink,
    ChevronRight,
} from 'lucide-react';
import type { AuthUser } from '@/types';

interface AdminLayoutProps {
    children: React.ReactNode;
    title?: string;
    breadcrumbs?: { title: string; href?: string }[];
}

export default function AdminLayout({ children, title, breadcrumbs = [] }: AdminLayoutProps) {
    const page = usePage();
    const auth = (page.props as any).auth?.user as AuthUser | undefined;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navItems = [
        { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
        { label: 'Members', href: '/admin/members', icon: Users },
        { label: 'Applications', href: '/admin/applications', icon: FileCheck2 },
        { label: 'Cadet Colleges', href: '/admin/colleges', icon: GraduationCap },
        { label: 'Committees', href: '/admin/committees', icon: Award },
        { label: 'Events & Reunions', href: '/admin/events', icon: Calendar },
        { label: 'News & Notices', href: '/admin/articles', icon: Newspaper },
        { label: 'Business Directory', href: '/admin/businesses', icon: Briefcase },
        { label: 'Initiatives', href: '/admin/initiatives', icon: HeartHandshake },
        { label: 'Support Tickets', href: '/admin/tickets', icon: LifeBuoy },
        { label: 'Reports', href: '/admin/reports', icon: BarChart3 },
        { label: 'Audit Logs', href: '/admin/audit-logs', icon: ShieldAlert },
        { label: 'Roles & Permissions', href: '/admin/roles', icon: ShieldCheck },
        { label: 'Website Settings', href: '/admin/settings', icon: Settings },
    ];

    const currentPath = window.location.pathname;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-200 border-r border-slate-800 flex flex-col transition-transform duration-200 ease-in-out md:translate-x-0 ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                {/* Brand */}
                <div className="h-16 px-6 flex items-center justify-between border-b border-slate-800 bg-slate-950/40">
                    <Link href="/admin/dashboard" className="flex items-center gap-3">
                        <BrandMark className="h-10 w-auto shrink-0" />
                        <div>
                            <div className="font-bold text-sm tracking-wide text-white">
                                ccIntake97
                            </div>
                            <div className="text-[10px] text-emerald-400 font-medium tracking-wider">
                                ADMIN MANAGEMENT
                            </div>
                        </div>
                    </Link>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="p-1 rounded-md text-slate-400 hover:text-white md:hidden"
                    >
                        <X className="size-5" />
                    </button>
                </div>

                {/* Nav Items */}
                <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
                    <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                        Operations & Governance
                    </div>
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = currentPath.startsWith(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                                    isActive
                                        ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                }`}
                            >
                                <Icon className="size-4 shrink-0" />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </div>

                {/* Footer Switcher */}
                <div className="p-3 border-t border-slate-800 bg-slate-950/60 space-y-2">
                    <Link
                        href="/member/dashboard"
                        className="flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium bg-slate-800/80 hover:bg-slate-800 text-slate-200 transition-colors"
                    >
                        <span className="flex items-center gap-2">
                            <ExternalLink className="size-3.5 text-emerald-400" />
                            Member Portal
                        </span>
                        <ChevronRight className="size-3.5 text-slate-400" />
                    </Link>
                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium text-rose-400 hover:bg-rose-950/30 hover:text-rose-300 transition-colors"
                    >
                        <LogOut className="size-3.5" />
                        Log out
                    </Link>
                </div>
            </aside>

            {/* Main Content Area */}
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
                        {/* Breadcrumbs */}
                        <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 gap-1.5 overflow-hidden">
                            <Link href="/admin/dashboard" className="hover:text-slate-900 dark:hover:text-white">
                                Admin
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

                    {/* User profile dropdown & badge */}
                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex flex-col text-right">
                            <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                                {auth?.name}
                            </span>
                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                                {auth?.roles?.[0] ? auth.roles[0].replace('_', ' ').toUpperCase() : 'ADMIN'}
                            </span>
                        </div>
                        <div className="size-9 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-sm shadow-sm ring-2 ring-emerald-500/20">
                            {auth?.name?.charAt(0) || 'A'}
                        </div>
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
