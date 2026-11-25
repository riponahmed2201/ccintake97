import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowLeft, ArrowRight, ChevronDown, Lock, MapPin, Search, ShieldCheck, Users, X } from 'lucide-react';
import { PrimaryCta } from '@/components/landing/cta';
import { CAMPUS_PHOTOS } from '@/components/landing/constants';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { LANDING_CONTAINER } from '@/components/landing/layout';
import { SectionHeading } from '@/components/landing/primitives';
import PublicSiteHeader from '@/components/public-site-header';

interface PublicMember {
    id: number;
    name: string;
    initials: string;
    college: { id: number; name: string; short_name?: string; logo_url?: string | null } | null;
    photo_url: string | null;
    designation: string | null;
    organization: string | null;
    city: string | null;
    country_code: string | null;
}

interface Paginated<T> {
    data: T[];
    current_page: number;
    last_page: number;
    from: number | null;
    to: number | null;
    total: number;
    prev_page_url: string | null;
    next_page_url: string | null;
}

interface Props {
    members: Paginated<PublicMember>;
    colleges: { id: number; name: string; short_name?: string; logo_url?: string | null }[];
    filters: { search: string; field: 'name' | 'profession' | 'city'; college_id: number | null };
    total: number;
}

const FIELDS = [
    { value: 'name', label: 'Name' },
    { value: 'profession', label: 'Profession' },
    { value: 'city', label: 'City' },
] as const;

const inputBase =
    'h-12 w-full rounded-xl border border-[#091324]/10 bg-[#FAF8F3] text-[15px] text-[#091324] transition-colors placeholder:text-[#091324]/35 focus:border-[#8E6B28] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#C8A252]/15';

export default function PublicDirectory({ members, colleges, filters, total }: Props) {
    const { auth } = usePage().props as { auth?: { user?: unknown } };
    const [search, setSearch] = useState(filters.search ?? '');
    const [field, setField] = useState<Props['filters']['field']>(filters.field ?? 'name');
    const collegeId = filters.college_id;

    const visit = (next: Partial<{ search: string; field: string; college_id: number | null }>) => {
        const q = { search, field, college_id: collegeId, ...next };
        const params: Record<string, string> = {};
        if (q.search) params.search = q.search;
        if (q.search && q.field !== 'name') params.field = q.field;
        if (q.college_id) params.college_id = String(q.college_id);
        router.get('/directory', params, { preserveScroll: true, preserveState: true });
    };

    const activeCollege = colleges.find((c) => c.id === collegeId);
    const hasFilters = !!(filters.search || collegeId);

  const profileHref = (m: PublicMember) =>
        auth?.user ? `/member/directory/${m.id}` : `/directory/${m.id}`;

    return (
        <>
            <Head title="Public Directory — ccIntake97" />
            <div className="min-h-screen bg-[#FAF8F3] font-sans text-[#091324] antialiased selection:bg-[#C8A252] selection:text-[#091324]">
                <PublicSiteHeader active="Directory" />

                <section className="relative isolate overflow-hidden bg-[#091324] text-[#F8F5EE]">
                    <div className="pointer-events-none absolute inset-0 -z-10">
                        <img src="/images/campus/rcc.jpg" alt="" className="h-full w-full object-cover opacity-30" />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#060B15] via-[#091324]/90 to-[#091324]/70" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#091324] via-[#091324]/25 to-[#091324]/50" />
                    </div>
                    <div className={`${LANDING_CONTAINER} pt-28 pb-28 sm:pt-32 lg:pt-36 lg:pb-32`}>
                        <div className="flex flex-col justify-between gap-10 lg:flex-row lg:items-end">
                            <SectionHeading
                                reveal={false}
                                titleTag="h1"
                                light
                                eyebrow="Batch directory"
                                title={
                                    <>
                                        Meet verified <em className="font-normal italic text-[#E8D5A3]">batchmates.</em>
                                    </>
                                }
                                intro="INTAKE 1997 alumni across ten cadet colleges. Only details members mark as public appear here."
                            />
                            <dl className="flex gap-10 rounded-2xl border border-[#C8A252]/30 bg-white/[0.06] px-8 py-6 shadow-[0_24px_48px_-24px_rgba(0,0,0,0.6)] backdrop-blur-md">
                                <div>
                                    <dd className="font-serif text-4xl font-semibold tabular-nums text-[#E8D5A3]">{total}</dd>
                                    <dt className="mt-1 text-[10.5px] font-medium tracking-[0.2em] text-[#F8F5EE]/60 uppercase">Verified</dt>
                                </div>
                                <div>
                                    <dd className="font-serif text-4xl font-semibold tabular-nums text-[#E8D5A3]">{colleges.length}</dd>
                                    <dt className="mt-1 text-[10.5px] font-medium tracking-[0.2em] text-[#F8F5EE]/60 uppercase">Colleges</dt>
                                </div>
                            </dl>
                        </div>
                    </div>
                </section>

                <main className={`${LANDING_CONTAINER} pb-24`}>
                    <div className="relative -mt-14 rounded-[1.75rem] bg-white p-5 shadow-[0_32px_64px_-32px_rgba(9,19,36,0.25)] ring-1 ring-[#091324]/[0.07] sm:p-6">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                visit({ search: search.trim() });
                            }}
                            className="flex flex-col gap-3 lg:flex-row lg:items-center"
                        >
                            <div className="relative lg:w-44">
                                <select
                                    value={field}
                                    onChange={(e) => setField(e.target.value as Props['filters']['field'])}
                                    aria-label="Search by"
                                    className={`${inputBase} appearance-none py-0 pr-10 pl-4 font-medium`}
                                >
                                    {FIELDS.map((f) => (
                                        <option key={f.value} value={f.value}>
                                            {f.label}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="pointer-events-none absolute top-1/2 right-3.5 h-4 w-4 -translate-y-1/2 text-[#0B1220]/40" />
                            </div>
                            <div className="relative min-w-0 flex-1">
                                <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-[#0B1220]/35" />
                                <input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder={
                                        field === 'name'
                                            ? 'Search by name'
                                            : field === 'profession'
                                              ? 'Title, employer, or sector'
                                              : 'City or region'
                                    }
                                    aria-label="Search term"
                                    className={`${inputBase} pl-11 pr-10`}
                                />
                                {search && (
                                    <button
                                        type="button"
                                        aria-label="Clear search"
                                        onClick={() => {
                                            setSearch('');
                                            visit({ search: '' });
                                        }}
                                        className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-1.5 text-[#0B1220]/40 hover:bg-[#0B1220]/5"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                            <button
                                type="submit"
                                className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-[#0B1220] px-8 text-[15px] font-medium text-white transition-colors hover:bg-[#1A2438]"
                            >
                                Search <ArrowRight className="h-4 w-4" />
                            </button>
                        </form>

                        <div className="mt-5 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                            <button
                                type="button"
                                onClick={() => visit({ college_id: null })}
                                className={`shrink-0 rounded-full px-4 py-2 text-[13px] font-medium transition-colors ${
                                    !collegeId ? 'bg-[#0B1220] text-white' : 'bg-[#F4F2EE] text-[#0B1220]/70 hover:text-[#0B1220]'
                                }`}
                            >
                                All colleges
                            </button>
                            {colleges.map((c) => {
                                const active = c.id === collegeId;
                                return (
                                    <button
                                        key={c.id}
                                        type="button"
                                        title={c.name}
                                        onClick={() => visit({ college_id: active ? null : c.id })}
                                        className={`flex shrink-0 items-center gap-2 rounded-full py-1.5 pr-4 pl-1.5 text-[13px] font-medium transition-all ${
                                            active ? 'bg-[#0B1220] text-white shadow-md' : 'bg-[#F4F2EE] text-[#0B1220]/70 hover:bg-[#FAF7F0]'
                                        }`}
                                    >
                                        <span className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-white ring-1 ring-[#0B1220]/10">
                                            {c.logo_url ? (
                                                <img src={c.logo_url} alt="" className="h-full w-full object-contain p-0.5" />
                                            ) : (
                                                <span className="text-[9px] font-semibold">{c.short_name}</span>
                                            )}
                                        </span>
                                        {c.short_name}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="mt-10 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                        <p className="text-[15px] text-[#4A4F5C]">
                            {members.total === 0 ? (
                                'No members match your filters'
                            ) : (
                                <>
                                    Showing <span className="font-semibold text-[#0B1220]">{members.from}–{members.to}</span> of{' '}
                                    <span className="font-semibold text-[#0B1220]">{members.total}</span>
                                </>
                            )}
                            {activeCollege && (
                                <>
                                    {' '}
                                    from <span className="font-semibold text-[#0B1220]">{activeCollege.short_name}</span>
                                </>
                            )}
                            {filters.search && (
                                <>
                                    {' '}
                                    · “<span className="font-semibold text-[#0B1220]">{filters.search}</span>”
                                </>
                            )}
                        </p>
                        {hasFilters && (
                            <button
                                type="button"
                                onClick={() => {
                                    setSearch('');
                                    router.get('/directory');
                                }}
                                className="text-[14px] font-medium text-[#7A5E28] underline decoration-[#9A7B3F]/40 underline-offset-4 hover:decoration-[#9A7B3F]"
                            >
                                Clear filters
                            </button>
                        )}
                    </div>

                    {members.data.length > 0 ? (
                        <ul className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {members.data.map((m) => {
                                const code = m.college?.short_name ?? '';
                                const subtitle = [m.designation, m.organization].filter(Boolean).join(' · ');
                                return (
                                    <li key={m.id}>
                                        <Link
                                            href={profileHref(m)}
                                            className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#0B1220]/10 bg-white text-[#0B1220] shadow-[0_4px_20px_-8px_rgba(11,18,32,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-[#1B84FF]/40 hover:shadow-[0_16px_36px_-12px_rgba(11,18,32,0.16)]"
                                        >
                                            <div className="relative h-56 w-full overflow-hidden bg-[#F4F6FA]">
                                                {m.photo_url ? (
                                                    <img
                                                        src={m.photo_url}
                                                        alt={m.name}
                                                        loading="lazy"
                                                        className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#F4F6FA] to-[#EAECEF]">
                                                        <span className="flex h-24 w-24 items-center justify-center rounded-full bg-white font-serif text-3xl font-semibold text-[#0B1220] shadow-xs ring-1 ring-[#0B1220]/10">
                                                            {m.initials}
                                                        </span>
                                                    </div>
                                                )}

                                                <div className="absolute top-3 right-3 left-3 flex items-center justify-between">
                                                    <span className="flex items-center gap-1.5 rounded-full bg-white/95 py-1 pr-2.5 pl-1 text-[11px] font-semibold text-[#0B1220] shadow-xs ring-1 ring-[#0B1220]/10 backdrop-blur-sm">
                                                        <span className="flex h-5 w-5 items-center justify-center overflow-hidden rounded-full bg-white">
                                                            {m.college?.logo_url ? (
                                                                <img src={m.college.logo_url} alt="" className="h-full w-full object-contain p-0.5" />
                                                            ) : (
                                                                <span className="text-[8px] font-bold text-[#0B1220]">{code || 'CC'}</span>
                                                            )}
                                                        </span>
                                                        {code ? `${code} ’97` : 'INTAKE 97'}
                                                    </span>
                                                    <span
                                                        className="flex h-7 w-7 items-center justify-center rounded-full bg-white/95 text-emerald-600 shadow-xs ring-1 ring-[#0B1220]/10"
                                                        aria-label="Verified member"
                                                    >
                                                        <ShieldCheck className="h-4 w-4" />
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex flex-1 flex-col p-5">
                                                <h2 className="line-clamp-1 text-[17px] leading-snug font-bold text-[#0B1220] transition-colors group-hover:text-[#1B84FF]">
                                                    {m.name}
                                                </h2>
                                                <p className="mt-1 line-clamp-1 text-[13px] text-[#4A4F5C]">
                                                    {subtitle || m.college?.name || '1997 Cadet College Alumnus'}
                                                </p>
                                                {m.city && (
                                                    <p className="mt-2.5 flex items-center gap-1 text-[12px] text-[#78829D]">
                                                        <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />
                                                        <span className="truncate">
                                                            {m.city}
                                                            {m.country_code && m.country_code !== 'BD' ? ` · ${m.country_code}` : ''}
                                                        </span>
                                                    </p>
                                                )}
                                            </div>

                                            <div className="flex items-center justify-between border-t border-[#F1F1F4] px-5 py-3 text-[13px] font-semibold text-[#1B84FF]">
                                                <span>View Profile</span>
                                                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                                            </div>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    ) : (
                        <div className="mt-8 flex flex-col items-center rounded-3xl bg-white px-6 py-20 text-center ring-1 ring-[#0B1220]/[0.06]">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#C9A55C]/15">
                                <Users className="h-7 w-7 text-[#9A7B3F]" strokeWidth={1.5} />
                            </div>
                            <h2 className="mt-6 font-serif text-2xl font-medium text-[#0B1220]">No batchmates match that search</h2>
                            <p className="mt-3 max-w-md text-[15px] leading-relaxed text-[#4A4F5C]">
                                Try another spelling, college, or search field. Profession and city only appear when a member sets them to public.
                            </p>
                            <button
                                type="button"
                                onClick={() => {
                                    setSearch('');
                                    router.get('/directory');
                                }}
                                className="mt-8 text-[14px] font-medium text-[#7A5E28] underline decoration-[#9A7B3F]/40 underline-offset-4"
                            >
                                Reset directory
                            </button>
                        </div>
                    )}

                    {members.last_page > 1 && (
                        <nav
                            className="mt-12 flex flex-col items-center justify-between gap-4 rounded-2xl bg-white px-5 py-5 ring-1 ring-[#0B1220]/[0.06] sm:flex-row"
                            aria-label="Pagination"
                        >
                            <span className="text-[14px] text-[#4A4F5C]">
                                Page <span className="font-semibold text-[#0B1220]">{members.current_page}</span> of {members.last_page}
                            </span>
                            <div className="flex gap-2">
                                {members.prev_page_url ? (
                                    <Link
                                        href={members.prev_page_url}
                                        preserveScroll
                                        className="inline-flex items-center gap-1.5 rounded-full border border-[#0B1220]/15 px-5 py-2.5 text-[14px] font-medium transition-colors hover:border-[#0B1220]"
                                    >
                                        <ArrowLeft className="h-4 w-4" /> Previous
                                    </Link>
                                ) : (
                                    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#0B1220]/8 px-5 py-2.5 text-[14px] text-[#0B1220]/30">
                                        <ArrowLeft className="h-4 w-4" /> Previous
                                    </span>
                                )}
                                {members.next_page_url ? (
                                    <Link
                                        href={members.next_page_url}
                                        preserveScroll
                                        className="inline-flex items-center gap-1.5 rounded-full bg-[#0B1220] px-5 py-2.5 text-[14px] font-medium text-white hover:bg-[#1A2438]"
                                    >
                                        Next <ArrowRight className="h-4 w-4" />
                                    </Link>
                                ) : (
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0B1220]/10 px-5 py-2.5 text-[14px] text-[#0B1220]/30">
                                        Next <ArrowRight className="h-4 w-4" />
                                    </span>
                                )}
                            </div>
                        </nav>
                    )}

                    <div className="mt-16 grid grid-cols-1 gap-5 md:grid-cols-2">
                        <div className="flex items-start gap-4 rounded-2xl bg-white p-7 ring-1 ring-[#091324]/[0.07] shadow-xs">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FAF8F3] ring-1 ring-[#C8A252]/30">
                                <Lock className="h-5 w-5 text-[#8E6B28]" aria-hidden />
                            </span>
                            <div>
                                <div className="font-serif text-xl font-semibold text-[#091324]">Privacy first</div>
                                <p className="mt-1.5 text-[14px] leading-relaxed text-[#4A4F5C]">
                                    Email, phone and WhatsApp stay inside the verified member portal. This page shows only what alumni choose to make public.
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col justify-between gap-5 rounded-2xl bg-gradient-to-br from-[#E8D5A3] via-[#C8A252] to-[#B08A3C] p-7 shadow-sm sm:flex-row sm:items-center">
                            <div>
                                <div className="font-serif text-xl font-semibold text-[#091324]">Not on the roll yet?</div>
                                <p className="mt-1 text-[14px] text-[#091324]/80">Create your account and complete verification to be listed.</p>
                            </div>
                            <PrimaryCta as="link" href="/?signup=1" variant="navy" className="shrink-0 !px-6 !py-3 text-[14px]">
                                Apply now
                            </PrimaryCta>
                        </div>
                    </div>
                </main>

                <LandingFooter />
            </div>
        </>
    );
}