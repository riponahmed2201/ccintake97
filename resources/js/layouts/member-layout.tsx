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
    ChevronsLeft,
    ChevronsRight,
    ExternalLink,
    Search,
    ChevronDown,
    KeyRound,
    AlertCircle,
    Images,
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { AuthUser } from '@/types';

interface MemberLayoutProps {
    children: React.ReactNode;
    title?: string;
    breadcrumbs?: { title: string; href?: string }[];
    fluid?: boolean;
}

const NAV_GROUPS = [
    {
        label: null,
        items: [{ label: 'Overview', href: '/member/dashboard', icon: LayoutDashboard }],
    },
    {
        label: 'Identity & Network',
        items: [
            { label: 'My Profile', href: '/member/profile', icon: UserCircle },
            { label: 'Digital Alumni ID', href: '/member/id-card', icon: QrCode },
            { label: 'Alumni Directory', href: '/member/directory', icon: Users },
            { label: 'My Connections', href: '/member/connections', icon: UserCheck },
        ],
    },
    {
        label: 'Community',
        items: [
            { label: 'Reunions & Events', href: '/member/events', icon: Calendar },
            { label: 'News & Notices', href: '/member/articles', icon: Newspaper },
            { label: 'Gallery', href: '/member/gallery', icon: Images },
            { label: 'Business Network', href: '/member/businesses', icon: Briefcase },
            { label: 'Mentorship Hub', href: '/member/mentorship', icon: GraduationCap },
        ],
    },
    {
        label: 'Account',
        items: [
            { label: 'Notifications', href: '/member/notifications', icon: Bell },
            { label: 'Saved Items', href: '/member/favorites', icon: Bookmark },
            { label: 'Help & Support', href: '/member/tickets', icon: LifeBuoy },
        ],
    },
];

export default function MemberLayout({ children, title, breadcrumbs = [], fluid = false }: MemberLayoutProps) {
    const page = usePage();
    const auth = (page.props as { auth?: { user?: AuthUser } }).auth?.user;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);

    const isStaff = auth?.roles?.some((r) =>
        ['super_admin', 'association_admin', 'membership_manager', 'membership_reviewer', 'event_manager', 'content_editor', 'content_publisher'].includes(r)
    );

    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/member/dashboard';

    return (
        <div className="flex min-h-screen bg-white font-['Inter',ui-sans-serif,system-ui,sans-serif] text-[#071437] antialiased">
            {/* Mobile Overlay */}
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
                {/* Brand Header + Metronic Floating Collapse Toggle */}
                <div className="relative flex h-[64px] shrink-0 items-center justify-between border-b border-[#F1F1F4] bg-white px-5">
                    <Link href="/member/dashboard" className="flex min-w-0 items-center gap-3">
                        <BrandMark className="h-11 w-11 shrink-0" />
                        {!collapsed && (
                            <div className="min-w-0">
                                <div className="truncate text-[16px] leading-tight font-bold tracking-tight text-[#071437]">
                                    ccIntake<span className="text-[#1B84FF]">97</span>
                                </div>
                                <div className="text-[10px] font-medium tracking-[0.08em] text-[#99A1B7] uppercase">
                                    Alumni Portal
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

                    {/* Metronic Edge Collapse Button */}
                    <button
                        type="button"
                        onClick={() => setCollapsed((c) => !c)}
                        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                        className="absolute top-1/2 -right-3.5 hidden size-7 -translate-y-1/2 items-center justify-center rounded-md border border-[#DBDFE9] bg-white text-[#78829D] shadow-[0_2px_6px_rgba(0,0,0,0.06)] transition-colors hover:border-[#1B84FF]/40 hover:text-[#1B84FF] md:flex"
                    >
                        {collapsed ? <ChevronsRight className="size-3.5" /> : <ChevronsLeft className="size-3.5" />}
                    </button>
                </div>

                {/* Metronic Demo 1 Categorized Navigation */}
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
                                        (item.href !== '/member/dashboard' && currentPath.startsWith(item.href));
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
                    {isStaff && (
                        <Link
                            href="/admin/dashboard"
                            title={collapsed ? 'Admin Panel' : undefined}
                            className={`flex items-center rounded-lg bg-[#EAFFF1] px-3 py-2 text-[12.5px] font-semibold text-[#17C653] transition-colors hover:bg-[#dcfce7] ${
                                collapsed ? 'justify-center px-0' : 'justify-between'
                            }`}
                        >
                            <span className="flex items-center gap-2.5">
                                <Shield className="size-[17px] shrink-0 text-[#17C653]" strokeWidth={1.75} />
                                {!collapsed && <span>Admin Panel</span>}
                            </span>
                            {!collapsed && <ChevronRight className="size-3.5 text-[#17C653]" />}
                        </Link>
                    )}
                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        title={collapsed ? 'Sign out' : undefined}
                        className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium text-[#4B5675] transition-colors hover:bg-[#FFEEF3] hover:text-[#F8285A] ${
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
                {/* Metronic Demo 1 Sticky Top Header */}
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
                                <Link href="/member/dashboard" className="hover:text-[#1B84FF]">
                                    Portal
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
                            href="/member/directory"
                            className="hidden items-center gap-2 rounded-lg border border-[#DBDFE9] bg-white px-3 py-1.5 text-[12.5px] font-medium text-[#78829D] transition-colors hover:border-[#1B84FF]/40 hover:text-[#071437] lg:inline-flex"
                        >
                            <Search className="size-3.5 text-[#99A1B7]" />
                            <span>Find batchmates...</span>
                        </Link>

                        <Link
                            href="/"
                            title="Public Website"
                            className="hidden items-center gap-1.5 rounded-lg border border-[#DBDFE9] bg-white px-3 py-1.5 text-[12.5px] font-medium text-[#4B5675] transition-colors hover:bg-[#F9F9F9] hover:text-[#071437] sm:inline-flex"
                        >
                            <span>Public Site</span>
                            <ExternalLink className="size-3.5 text-[#99A1B7]" />
                        </Link>

                        <Link
                            href="/member/notifications"
                            aria-label="Notifications"
                            className="relative flex size-9 items-center justify-center rounded-lg border border-[#F1F1F4] bg-white text-[#78829D] transition-colors hover:bg-[#F9F9F9] hover:text-[#1B84FF]"
                        >
                            <Bell className="size-[17px]" strokeWidth={1.75} />
                        </Link>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button
                                    type="button"
                                    className="flex cursor-pointer items-center gap-2.5 rounded-lg py-1 pr-2 pl-1 transition-colors outline-none hover:bg-[#F9F9F9] focus-visible:ring-2 focus-visible:ring-[#1B84FF]/20"
                                >
                                    <div className="flex size-8 items-center justify-center rounded-full bg-[#F1F6FF] text-[13px] font-semibold text-[#1B84FF] ring-1 ring-[#1B84FF]/20">
                                        {auth?.name?.charAt(0) || 'M'}
                                    </div>
                                    <div className="hidden text-left sm:block">
                                        <div className="max-w-[130px] truncate text-[12.5px] font-semibold text-[#071437]">
                                            {auth?.name}
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
                                        {auth?.name?.charAt(0) || 'M'}
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
                                    <DropdownMenuItem asChild className="cursor-pointer rounded-lg px-2.5 py-2 text-[13px] font-medium text-[#4B5675] focus:!bg-[#F1F6FF] focus:!text-[#1B84FF]">
                                        <Link href="/member/id-card">
                                            <QrCode className="size-4 text-[#99A1B7]" />
                                            <span>Digital Alumni ID</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    {isStaff && (
                                        <DropdownMenuItem asChild className="cursor-pointer rounded-lg px-2.5 py-2 text-[13px] font-medium text-[#17C653] focus:!bg-[#EAFFF1] focus:!text-[#17C653]">
                                            <Link href="/admin/dashboard">
                                                <Shield className="size-4 text-[#17C653]" />
                                                <span>Admin Panel</span>
                                            </Link>
                                        </DropdownMenuItem>
                                    )}
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

                {/* Incomplete College Profile Alert */}
                {auth?.member && !auth.member.college_id && currentPath !== '/member/profile' && (
                    <div className="flex flex-col justify-between gap-2 border-b border-[#F1F1F4] bg-[#FFFBEB] px-4 py-2.5 sm:flex-row sm:items-center sm:px-7">
                        <div className="flex items-center gap-2 text-[12.5px] font-medium text-[#92400E]">
                            <AlertCircle className="size-4 shrink-0 text-[#D97706]" />
                            <span>
                                Complete your college profile to unlock alumni directory access and membership verification.
                            </span>
                        </div>
                        <Link
                            href="/member/profile"
                            className="inline-flex shrink-0 items-center gap-1 self-start rounded-md bg-[#1B84FF] px-3 py-1 text-[12px] font-semibold text-white transition-colors hover:bg-[#006AE6] sm:self-auto"
                        >
                            Complete Profile
                            <ChevronRight className="size-3.5" />
                        </Link>
                    </div>
                )}

                {/* Page Content (Fluid Full-Width White Container) */}
                <main className={fluid ? 'w-full flex-1 bg-white' : 'w-full flex-1 bg-white p-4 sm:p-6 lg:p-7'}>
                    {children}
                </main>
            </div>
        </div>
    );
}
