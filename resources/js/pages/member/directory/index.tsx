import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import MemberLayout from '@/layouts/member-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Search,
    GraduationCap,
    Briefcase,
    MapPin,
    UserPlus,
    UserCheck,
    LayoutGrid,
    List,
    ShieldCheck,
} from 'lucide-react';
import type { Member, College, Industry } from '@/types';

interface DirectoryIndexProps {
    members: {
        data: (Member & { is_connected?: boolean })[];
        current_page: number;
        last_page: number;
        total: number;
        links: any[];
    };
    colleges: College[];
    industries: Industry[];
    filters: {
        search?: string;
        college_id?: string;
        industry_id?: string;
        country?: string;
    };
}

export default function DirectoryIndex({
    members,
    colleges,
    industries,
    filters,
}: DirectoryIndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [selectedCollege, setSelectedCollege] = useState(filters.college_id || '');
    const [selectedIndustry, setSelectedIndustry] = useState(filters.industry_id || '');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    const applyFilter = (key: string, val: string) => {
        const query = {
            search,
            college_id: selectedCollege,
            industry_id: selectedIndustry,
            [key]: val,
        };
        router.get('/member/directory', query, { preserveState: true, replace: true });
    };

    const handleConnect = (memberId: number) => {
        router.post(`/member/connections/${memberId}/send`);
    };

    return (
        <MemberLayout
            title="Verified Alumni Directory"
            breadcrumbs={[{ title: 'Alumni Directory' }]}
        >
            <Head title="Alumni Directory - INTAKE97.COM" />

            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                            Verified Batch Directory
                        </h1>
                        <p className="text-xs text-slate-500 mt-1">
                            Discover and connect with verified 1997 intake Cadet College batchmates across the world.
                        </p>
                    </div>

                    {/* View Mode Toggle */}
                    <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg self-start sm:self-auto">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-1.5 rounded-md text-xs flex items-center gap-1 font-semibold transition-colors ${
                                viewMode === 'grid'
                                    ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-xs'
                                    : 'text-slate-500 hover:text-slate-900'
                            }`}
                        >
                            <LayoutGrid className="size-3.5" /> Grid
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-1.5 rounded-md text-xs flex items-center gap-1 font-semibold transition-colors ${
                                viewMode === 'list'
                                    ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-xs'
                                    : 'text-slate-500 hover:text-slate-900'
                            }`}
                        >
                            <List className="size-3.5" /> List
                        </button>
                    </div>
                </div>

                {/* Search & Filter Bar */}
                <Card className="p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 size-4 text-slate-400" />
                            <Input
                                placeholder="Search by name, organization, designation..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && applyFilter('search', search)}
                                className="pl-9 text-xs"
                            />
                        </div>

                        <select
                            value={selectedCollege}
                            onChange={(e) => {
                                setSelectedCollege(e.target.value);
                                applyFilter('college_id', e.target.value);
                            }}
                            className="text-xs rounded-md border p-2 bg-white dark:bg-slate-900"
                        >
                            <option value="">All Cadet Colleges</option>
                            {colleges.map((c) => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>

                        <select
                            value={selectedIndustry}
                            onChange={(e) => {
                                setSelectedIndustry(e.target.value);
                                applyFilter('industry_id', e.target.value);
                            }}
                            className="text-xs rounded-md border p-2 bg-white dark:bg-slate-900"
                        >
                            <option value="">All Industry Sectors</option>
                            {industries.map((ind) => (
                                <option key={ind.id} value={ind.id}>{ind.name}</option>
                            ))}
                        </select>
                    </div>
                </Card>

                {/* Directory Content: Grid or List */}
                {members.data.length === 0 ? (
                    <Card className="p-12 text-center text-xs text-slate-400">
                        No verified alumni found matching the criteria.
                    </Card>
                ) : viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {members.data.map((m) => (
                            <Card key={m.id} className="overflow-hidden hover:border-indigo-300 transition-all flex flex-col justify-between">
                                <CardContent className="p-5 space-y-4">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            <div className="size-12 rounded-2xl bg-indigo-600 text-white font-bold text-lg flex items-center justify-center shrink-0 shadow-sm">
                                                {m.user?.name?.charAt(0)}
                                            </div>
                                            <div className="min-w-0">
                                                <Link
                                                    href={`/member/directory/${m.id}`}
                                                    className="font-bold text-sm text-slate-900 dark:text-white hover:text-indigo-600 block truncate"
                                                >
                                                    {m.user?.name}
                                                </Link>
                                                <div className="text-[11px] text-slate-400 font-mono">
                                                    {m.member_code}
                                                </div>
                                            </div>
                                        </div>

                                        <Badge variant="outline" className="text-[9px] capitalize text-emerald-600 border-emerald-300">
                                            <ShieldCheck className="size-2.5 mr-0.5" /> Verified
                                        </Badge>
                                    </div>

                                    {/* Cadet College tag */}
                                    <div className="space-y-1.5 text-xs">
                                        <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200">
                                            <GraduationCap className="size-4 text-emerald-600 shrink-0" />
                                            <span className="truncate">{m.college?.name}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                                            <Briefcase className="size-4 text-purple-600 shrink-0" />
                                            <span className="truncate">
                                                {m.profile?.designation ? `${m.profile.designation}` : '1997 Alumnus'}
                                                {m.profile?.organization ? ` · ${m.profile.organization}` : ''}
                                            </span>
                                        </div>
                                        {m.profile?.city && (
                                            <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                                                <MapPin className="size-3.5 text-slate-400 shrink-0" />
                                                <span>{m.profile.city}, {m.profile.country_code}</span>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>

                                <div className="p-3 bg-slate-50 dark:bg-slate-800/40 border-t flex items-center justify-between text-xs">
                                    <Link
                                        href={`/member/directory/${m.id}`}
                                        className="font-semibold text-indigo-600 hover:underline"
                                    >
                                        View Profile
                                    </Link>

                                    {m.is_connected ? (
                                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                                            <UserCheck className="size-3.5" /> Connected
                                        </span>
                                    ) : (
                                        <button
                                            onClick={() => handleConnect(m.id)}
                                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white dark:bg-slate-900 border hover:bg-slate-50 text-[11px] font-semibold text-slate-800 dark:text-slate-200"
                                        >
                                            <UserPlus className="size-3" /> Connect
                                        </button>
                                    )}
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card className="divide-y divide-slate-100 dark:divide-slate-800">
                        {members.data.map((m) => (
                            <div key={m.id} className="p-4 flex items-center justify-between hover:bg-slate-50/50">
                                <div className="flex items-center gap-4">
                                    <div className="size-10 rounded-xl bg-indigo-600 text-white font-bold text-sm flex items-center justify-center shrink-0">
                                        {m.user?.name?.charAt(0)}
                                    </div>
                                    <div>
                                        <Link href={`/member/directory/${m.id}`} className="font-bold text-xs text-slate-900 dark:text-white hover:underline">
                                            {m.user?.name}
                                        </Link>
                                        <div className="text-[11px] text-slate-500">
                                            {m.college?.name} · Roll #{m.college_roll_no}
                                        </div>
                                    </div>
                                </div>

                                <div className="hidden sm:block text-xs text-slate-600">
                                    {m.profile?.designation || 'Alumnus'} {m.profile?.organization ? `at ${m.profile.organization}` : ''}
                                </div>

                                <div className="flex items-center gap-3">
                                    <Link
                                        href={`/member/directory/${m.id}`}
                                        className="text-xs font-semibold text-indigo-600 hover:underline"
                                    >
                                        Profile
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </Card>
                )}
            </div>
        </MemberLayout>
    );
}
