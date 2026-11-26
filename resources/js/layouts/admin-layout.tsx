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
    ChevronsLeft,
    ChevronsRight,
    ChevronDown,
    UserCircle,
    KeyRound,
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { AuthUser } from '@/types';

interface AdminLayoutProps {
    children: React.ReactNode;
    title?: string;
    breadcrumbs?: { title: string; href?: string }[];
    fluid?: boolean;
}

const NAV_GROUPS = [
    {
        label: null,
        items: [{ label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard }],
    },
    {
        label: 'Directory & Governance',
        items: [
            { label: 'Members', href: '/admin/members', icon: Users },
            { label: 'Applications', href: '/admin/applications', icon: FileCheck2 },
            { label: 'Cadet Colleges', href: '/admin/colleges', icon: GraduationCap },
            { label: 'Committees', href: '/admin/committees', icon: Award },
        ],
    },
    {
        label: 'Community & Operations',
        items: [
            { label: 'Events & Reunions', href: '/admin/events', icon: Calendar },
            { label: 'News & Notices', href: '/admin/articles', icon: Newspaper },
            { label: 'Business Directory', href: '/admin/businesses', icon: Briefcase },
            { label: 'Initiatives', href: '/admin/initiatives', icon: HeartHandshake },
            { label: 'Support Tickets', href: '/admin/tickets', icon: LifeBuoy },
        ],
    },
    {
        label: 'System & Security',
        items: [
            { label: 'Reports', href: '/admin/reports', icon: BarChart3 },
            { label: 'Audit Logs', href: '/admin/audit-logs', icon: ShieldAlert },
            { label: 'Roles & Permissions', href: '/admin/roles', icon: ShieldCheck },
            { label: 'Website Settings', href: '/admin/settings', icon: Settings },
        ],
    },
];

export default function AdminLayout({ children, title, breadcrumbs = [], fluid = false }: AdminLayoutProps) {
    const page = usePage();
    const auth = (page.props as { auth?: { user?: AuthUser } }).auth?.user;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);

    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/admin/dashboard';

    return (
        <div className="flex min-h-screen bg-white font-['Inter',ui-sans-serif,system-ui,sans-serif] text-[#071437] antialiased">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-slate-950/35 backdrop-blur-[1px] md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Metronic Tailwind Demo 1 Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-[#F1F1F4] bg-white transition-all duration-300 ease-in-out ${
                    collapsed ? 'md:w-[76px]' : 'md:w-[270px]'
                } w-[270px] ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
            >
                {/* Brand Header + Edge Collapse Toggle */}
                <div className="relative flex h-[64px] shrink-0 items-center justify-between border-b border-[#F1F1F4] bg-white px-5">
                    <Link href="/admin/dashboard" className="flex min-w-0 items-center gap-3">
                        <BrandMark className="h-11 w-11 shrink-0" />
                        {!collapsed && (
                            <div className="min-w-0">
                                <div className="truncate text-[16px] leading-tight font-bold tracking-tight text-[#071437]">
                                    ccIntake<span className="text-[#1B84FF]">97</span>
                                </div>
                                <div className="text-[10px] font-medium tracking-[0.08em] text-[#99A1B7] uppercase">
                                    Admin Panel
                                </div>
                            </div>
                        )}
                    </Link>

                    <button
                        type="button"
                        onClick={() => setSidebarOpen(false)}
                        aria-label="Close menu"
                        className="rounded-lg p-1.5 text-[#78829D] hover:bg-[#F9F9F9] hover:text-[#071437] md:hidden"
                    >
                        <X className="size-5" />
                    </button>

                    <button
                        type="button"
                        onClick={() => setCollapsed((c) => !c)}
                        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                        className="absolute top-1/2 -right-3.5 hidden size-7 -translate-y-1/2 items-center justify-center rounded-md border border-[#DBDFE9] bg-white text-[#78829D] shadow-[0_2px_6px_rgba(0,0,0,0.06)] transition-colors hover:border-[#1B84FF]/40 hover:text-[#1B84FF] md:flex"
                    >
                        {collapsed ? <ChevronsRight className="size-3.5" /> : <ChevronsLeft className="size-3.5" />}
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-5 overflow-y-auto px-3.5 py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {NAV_GROUPS.map((group, gi) => (
                        <div key={gi}>
                            {group.label && !collapsed && (
                                <div className="mb-1.5 px-3 text-[11px] font-semibold tracking-[0.06em] text-[#99A1B7] uppercase">
                                    {group.label}
                                </div>
                            )}
                            {group.label && collapsed && <div className="mx-2 my-2 border-t border-[#F1F1F4]" />}
                            <div className="space-y-0.5">
                                {group.items.map((item) => {
                                    const Icon = item.icon;
                                    const isActive =
                                        currentPath === item.href ||
                                        (item.href !== '/admin/dashboard' && currentPath.startsWith(item.href));
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            title={collapsed ? item.label : undefined}
                                            className={`group flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] leading-[1.35] transition-colors duration-150 ${
                                                collapsed ? 'justify-center px-0' : ''
                                            } ${
                                                isActive
                                                    ? 'bg-[#F1F6FF] font-semibold text-[#1B84FF]'
                                                    : 'font-medium text-[#4B5675] hover:bg-[#F9F9F9] hover:text-[#071437]'
                                            }`}
                                        >
                                            <Icon
                                                className={`size-[18px] shrink-0 transition-colors ${
                                                    isActive
                                                        ? 'text-[#1B84FF]'
                                                        : 'text-[#99A1B7] group-hover:text-[#4B5675]'
                                                }`}
                                                strokeWidth={1.75}
                                            />
                                            {!collapsed && <span className="truncate">{item.label}</span>}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>

                {/* Sidebar Footer */}
                <div className="shrink-0 space-y-1 border-t border-[#F1F1F4] p-3.5">
                    <Link
                        href="/member/dashboard"
                        title={collapsed ? 'Member Portal' : undefined}
                        className={`flex items-center rounded-lg bg-[#F1F6FF] px-3 py-2 text-[12.5px] font-semibold text-[#1B84FF] transition-colors hover:bg-[#E1ECFF] ${
                            collapsed ? 'justify-center px-0' : 'justify-between'
                        }`}
                    >
                        <span className="flex items-center gap-2.5">
                            <ExternalLink className="size-[17px] shrink-0 text-[#1B84FF]" strokeWidth={1.75} />
                            {!collapsed && <span>Member Portal</span>}
                        </span>
                        {!collapsed && <ChevronRight className="size-3.5 text-[#1B84FF]" />}
                    </Link>
                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        title={collapsed ? 'Sign out' : undefined}
                        className={`flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium text-[#4B5675] transition-colors hover:bg-[#FFEEF3] hover:text-[#F8285A] ${
                            collapsed ? 'justify-center px-0' : ''
                        }`}
                    >
                        <LogOut className="size-[18px] shrink-0" strokeWidth={1.75} />
                        {!collapsed && <span>Sign out</span>}
                    </Link>
                </div>
            </aside>

            {/* Main Content Shell */}
            <div
                className={`flex min-w-0 flex-1 flex-col bg-white transition-all duration-300 ${
                    collapsed ? 'md:pl-[76px]' : 'md:pl-[270px]'
                }`}
            >
                {/* Sticky Top Header */}
                <header className="sticky top-0 z-30 flex h-[64px] items-center justify-between border-b border-[#F1F1F4] bg-white px-4 sm:px-7">
                    <div className="flex min-w-0 items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setSidebarOpen(true)}
                            aria-label="Open menu"
                            className="rounded-lg p-2 text-[#78829D] hover:bg-[#F9F9F9] hover:text-[#071437] md:hidden"
                        >
                            <Menu className="size-5" />
                        </button>

                        <div className="min-w-0">
                            {title && (
                                <div className="truncate text-[16px] leading-tight font-semibold text-[#071437]">
                                    {title}
                                </div>
                            )}
                            <div className="mt-0.5 flex items-center gap-1.5 overflow-hidden text-[12px] text-[#99A1B7]">
                                <Link href="/admin/dashboard" className="hover:text-[#1B84FF]">
                                    Admin
                                </Link>
                                {breadcrumbs.map((b, i) => (
                                    <React.Fragment key={i}>
                                        <span>/</span>
                                        {b.href ? (
                                            <Link href={b.href} className="hover:text-[#1B84FF]">
                                                {b.title}
                                            </Link>
                                        ) : (
                                            <span className="truncate font-medium text-[#4B5675]">
                                                {b.title}
                                            </span>
                                        )}
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Toolbar Actions */}
                    <div className="flex items-center gap-2 sm:gap-2.5">
                        <Link
                            href="/"
                            title="Public Website"
                            className="hidden items-center gap-1.5 rounded-lg border border-[#DBDFE9] bg-white px-3 py-1.5 text-[12.5px] font-medium text-[#4B5675] transition-colors hover:bg-[#F9F9F9] hover:text-[#071437] sm:inline-flex"
                        >
                            <span>Public Site</span>
                            <ExternalLink className="size-3.5 text-[#99A1B7]" />
                        </Link>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button
                                    type="button"
                                    className="flex cursor-pointer items-center gap-2.5 rounded-lg py-1 pr-2 pl-1 transition-colors outline-none hover:bg-[#F9F9F9] focus-visible:ring-2 focus-visible:ring-[#1B84FF]/20"
                                >
                                    <div className="flex size-8 items-center justify-center rounded-full bg-[#F1F6FF] text-[13px] font-semibold text-[#1B84FF] ring-1 ring-[#1B84FF]/20">
                                        {auth?.name?.charAt(0) || 'A'}
                                    </div>
                                    <div className="hidden text-left sm:block">
                                        <div className="max-w-[130px] truncate text-[12.5px] font-semibold text-[#071437]">
                                            {auth?.name}
                                        </div>
                                        <div className="text-[10.5px] font-medium text-[#1B84FF]">
                                            {auth?.roles?.[0] ? auth.roles[0].replace(/_/g, ' ').toUpperCase() : 'ADMIN'}
                                        </div>
                                    </div>
                                    <ChevronDown className="hidden size-3.5 text-[#99A1B7] sm:block" />
                                </button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent
                                align="end"
                                sideOffset={8}
                                className="w-60 rounded-xl border border-[#F1F1F4] !bg-white p-1.5 !text-[#071437] shadow-[0_10px_30px_rgba(15,23,42,0.08)]"
                            >
                                <div className="flex items-center gap-2.5 border-b border-[#F1F1F4] px-2.5 py-2.5">
                                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#F1F6FF] text-[13px] font-semibold text-[#1B84FF] ring-1 ring-[#1B84FF]/20">
                                        {auth?.name?.charAt(0) || 'A'}
                                    </div>
                                    <div className="min-w-0">
                                        <div className="truncate text-[13px] font-semibold text-[#071437]">
                                            {auth?.name}
                                        </div>
                                        <div className="truncate text-[11.5px] text-[#99A1B7]">
                                            {auth?.email}
                                        </div>
                                    </div>
                                </div>

                                <div className="py-1">
                                    <DropdownMenuItem asChild className="cursor-pointer rounded-lg px-2.5 py-2 text-[13px] font-medium text-[#4B5675] focus:!bg-[#F1F6FF] focus:!text-[#1B84FF]">
                                        <Link href="/member/dashboard">
                                            <ExternalLink className="size-4 text-[#99A1B7]" />
                                            <span>Member Portal</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild className="cursor-pointer rounded-lg px-2.5 py-2 text-[13px] font-medium text-[#4B5675] focus:!bg-[#F1F6FF] focus:!text-[#1B84FF]">
                                        <Link href="/member/profile">
                                            <UserCircle className="size-4 text-[#99A1B7]" />
                                            <span>My Profile</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild className="cursor-pointer rounded-lg px-2.5 py-2 text-[13px] font-medium text-[#4B5675] focus:!bg-[#F1F6FF] focus:!text-[#1B84FF]">
                                        <Link href="/settings/security">
                                            <KeyRound className="size-4 text-[#99A1B7]" />
                                            <span>Password &amp; Security</span>
                                        </Link>
                                    </DropdownMenuItem>
                                </div>

                                <DropdownMenuSeparator className="my-1 bg-[#F1F1F4]" />

                                <DropdownMenuItem asChild className="cursor-pointer rounded-lg px-2.5 py-2 text-[13px] font-medium text-[#F8285A] focus:!bg-[#FFEEF3] focus:!text-[#F8285A]">
                                    <Link href="/logout" method="post" as="button" className="w-full">
                                        <LogOut className="size-4 text-[#F8285A]" />
                                        <span>Sign out</span>
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>

                {/* Fluid White Content Container */}
                <main className={fluid ? 'w-full flex-1 bg-white' : 'w-full flex-1 bg-white p-4 sm:p-6 lg:p-7'}>
                    {children}
                </main>
            </div>
        </div>
    );
}
