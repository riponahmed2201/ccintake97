import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, ArrowRight, ChevronDown, Lock, MapPin, Search, ShieldCheck, Users, X } from 'lucide-react';
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

export default function PublicDirectory({ members, colleges, filters, total }: Props) {
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

    return (
        <>
            <Head title="Public Directory — ccIntake97" />
            <div className="min-h-screen bg-[#FAF7F0] text-[#0B1220] antialiased selection:bg-[#C9A55C] selection:text-[#0B1220]">
                <PublicSiteHeader active="Directory" />

                {/* Hero band */}
                <section className="relative isolate overflow-hidden bg-[#0B1220] text-[#F7F3EA]">
                    <div className="pointer-events-none absolute inset-0 -z-10">
                        <img src="/images/campus/playground-mcc.jpg" alt="" className="h-full w-full object-cover opacity-30" />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#0B1220] via-[#0B1220]/85 to-[#0B1220]/50" />
                    </div>
                    <div className="mx-auto max-w-[1320px] px-5 pt-14 pb-28 sm:px-8 lg:px-10 lg:pt-20 lg:pb-32">
                        <Link href="/" className="inline-flex items-center gap-2 text-[14px] text-[#F7F3EA]/60 hover:text-[#F7F3EA]">
                            <ArrowLeft className="h-4 w-4" /> Home
                        </Link>
                        <div className="mt-8 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
                            <div>
                                <div className="flex items-center gap-3 text-[11px] font-medium tracking-[0.28em] text-[#D9BF85] uppercase">
                                    <span className="h-px w-8 bg-[#D9BF85]/50" /> The Cadet Roll
                                </div>
                                <h1 className="mt-5 text-5xl leading-[1.02] font-medium tracking-[-0.015em] sm:text-6xl">
                                    Public <span className="font-normal text-[#E8D5A3]">directory.</span>
                                </h1>
                                <p className="mt-4 max-w-xl text-[17px] text-[#F7F3EA]/65">Verified members of the 1997 intake, across all ten cadet colleges.</p>
                            </div>
                            <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.05] px-6 py-4 backdrop-blur">
                                <Users className="h-6 w-6 text-[#C9A55C]" strokeWidth={1.5} />
                                <div>
                                    <div className="text-3xl font-semibold tabular-nums">{total}</div>
                                    <div className="text-[12px] tracking-[0.18em] text-[#F7F3EA]/50 uppercase">Verified members</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <main className="mx-auto max-w-[1320px] px-5 pb-24 sm:px-8 lg:px-10">
                    {/* Search panel — overlaps the hero band */}
                    <div className="relative -mt-16 rounded-3xl bg-white p-4 shadow-[0_30px_60px_-30px_rgba(11,18,32,0.35)] ring-1 ring-[#0B1220]/[0.05] sm:p-6">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                visit({ search: search.trim() });
                            }}
                            className="flex flex-col gap-2 sm:flex-row"
                        >
                            <div className="relative sm:w-44">
                                <select
                                    value={field}
                                    onChange={(e) => setField(e.target.value as Props['filters']['field'])}
                                    aria-label="Search by"
                                    className="h-13 w-full appearance-none rounded-xl border border-[#0B1220]/10 bg-[#FAF7F0] py-3.5 pr-10 pl-4 text-[15px] font-medium text-[#0B1220] focus:border-[#9A7B3F] focus:ring-4 focus:ring-[#C9A55C]/15 focus:outline-none"
                                >
                                    {FIELDS.map((f) => (
                                        <option key={f.value} value={f.value}>{f.label}</option>
                                    ))}
                                </select>
                                <ChevronDown className="pointer-events-none absolute top-1/2 right-3.5 h-4 w-4 -translate-y-1/2 text-[#0B1220]/40" />
                            </div>
                            <div className="relative flex-1">
                                <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-[#0B1220]/35" />
                                <input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder={field === 'name' ? 'Type a name to search' : field === 'profession' ? 'e.g. surgeon, Bangladesh Army, Google' : 'e.g. Dhaka, London, Toronto'}
                                    aria-label="Search term"
                                    className="w-full rounded-xl border border-[#0B1220]/10 bg-[#FAF7F0] py-3.5 pr-10 pl-11 text-[15px] placeholder:text-[#0B1220]/35 focus:border-[#9A7B3F] focus:bg-white focus:ring-4 focus:ring-[#C9A55C]/15 focus:outline-none"
                                />
                                {search && (
                                    <button
                                        type="button"
                                        aria-label="Clear search"
                                        onClick={() => {
                                            setSearch('');
                                            visit({ search: '' });
                                        }}
                                        className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-1 text-[#0B1220]/40 hover:bg-[#0B1220]/5 hover:text-[#0B1220]"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                            <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0B1220] px-7 py-3.5 text-[15px] font-medium text-white hover:bg-[#1A2438]">
                                Search <ArrowRight className="h-4 w-4" />
                            </button>
                        </form>

                        <div className="mt-5 flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
                            <button
                                type="button"
                                onClick={() => visit({ college_id: null })}
                                className={`shrink-0 rounded-full px-4 py-2 text-[14px] font-medium transition-colors ${!collegeId ? 'bg-[#0B1220] text-white' : 'bg-[#FAF7F0] text-[#0B1220]/70 hover:text-[#0B1220]'}`}
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
                                        className={`flex shrink-0 items-center gap-2 rounded-full py-1.5 pr-4 pl-1.5 text-[14px] font-medium transition-colors ${
                                            active ? 'bg-[#0B1220] text-white' : 'bg-[#FAF7F0] text-[#0B1220]/70 hover:text-[#0B1220]'
                                        }`}
                                    >
                                        <span className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-white">
                                            {c.logo_url ? <img src={c.logo_url} alt="" className="h-full w-full object-contain p-0.5" /> : <span className="text-[9px]">{c.short_name}</span>}
                                        </span>
                                        {c.short_name}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Result meta */}
                    <div className="mt-10 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                        <p className="text-[15px] text-[#4A4F5C]">
                            {members.total === 0 ? 'No members found' : (
                                <>
                                    Showing <span className="font-semibold text-[#0B1220]">{members.from}–{members.to}</span> of{' '}
                                    <span className="font-semibold text-[#0B1220]">{members.total}</span> members
                                </>
                            )}
                            {activeCollege && <> from <span className="font-semibold text-[#0B1220]">{activeCollege.name}</span></>}
                            {filters.search && <> matching “<span className="font-semibold text-[#0B1220]">{filters.search}</span>”</>}
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

                    {/* Grid */}
                    {members.data.length > 0 ? (
                        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                            {members.data.map((m) => (
                                <Link
                                    key={m.id}
                                    href={`/member/directory/${m.id}`}
                                    className="group flex flex-col items-center rounded-2xl bg-white px-4 pt-7 pb-5 text-center ring-1 ring-[#0B1220]/[0.05] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_48px_-28px_rgba(11,18,32,0.4)]"
                                >
                                    <div className="relative">
                                        <div className="h-24 w-24 overflow-hidden rounded-full ring-4 ring-[#FAF7F0] transition-all duration-300 group-hover:ring-[#C9A55C]/40">
                                            {m.photo_url ? (
                                                <img src={m.photo_url} alt={m.name} loading="lazy" className="h-full w-full object-cover" />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#1E2A42] to-[#0B1220] text-2xl font-semibold text-[#E8D5A3]">{m.initials}</div>
                                            )}
                                        </div>
                                        {m.college?.logo_url && (
                                            <img src={m.college.logo_url} alt={m.college.name} title={m.college.name} className="absolute -right-1 bottom-0 h-8 w-8 rounded-full bg-white object-contain p-0.5 ring-2 ring-white" />
                                        )}
                                    </div>
                                    <div className="mt-4 flex items-center gap-1 text-[16px] leading-snug font-semibold">
                                        <span className="line-clamp-2">{m.name}</span>
                                        <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-emerald-600" aria-label="Verified" />
                                    </div>
                                    <div className="mt-1 line-clamp-1 min-h-[1.25rem] text-[13px] text-[#4A4F5C]">
                                        {[m.designation, m.organization].filter(Boolean).join(', ') || `${m.college?.short_name ?? 'Cadet College'} ’97`}
                                    </div>
                                    {m.city && (
                                        <div className="mt-1 flex items-center gap-1 text-[12px] text-[#0B1220]/45">
                                            <MapPin className="h-3 w-3" /> {m.city}
                                        </div>
                                    )}
                                    <span className="mt-4 inline-flex items-center gap-1 text-[13px] font-medium text-[#7A5E28] group-hover:gap-2">
                                        View profile <ArrowRight className="h-3.5 w-3.5 transition-all" />
                                    </span>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="mt-6 flex flex-col items-center rounded-3xl bg-white px-6 py-20 text-center ring-1 ring-[#0B1220]/[0.05]">
                            <Search className="h-8 w-8 text-[#C9A55C]" strokeWidth={1.5} />
                            <h2 className="mt-5 text-2xl font-semibold">No batchmates match that search</h2>
                            <p className="mt-2 max-w-md text-[15px] text-[#4A4F5C]">
                                Try a different spelling or college. Members who keep their profession or city private won’t appear in those searches.
                            </p>
                        </div>
                    )}

                    {/* Pagination */}
                    {members.last_page > 1 && (
                        <nav className="mt-12 flex items-center justify-between gap-4 rounded-2xl bg-white px-5 py-4 ring-1 ring-[#0B1220]/[0.05]" aria-label="Pagination">
                            <span className="text-[14px] text-[#4A4F5C]">
                                Page <span className="font-semibold text-[#0B1220]">{members.current_page}</span> of {members.last_page}
                            </span>
                            <div className="flex gap-2">
                                {members.prev_page_url ? (
                                    <Link href={members.prev_page_url} preserveScroll className="inline-flex items-center gap-1.5 rounded-full border border-[#0B1220]/15 px-4 py-2 text-[14px] font-medium hover:border-[#0B1220]">
                                        <ArrowLeft className="h-4 w-4" /> Previous
                                    </Link>
                                ) : (
                                    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#0B1220]/10 px-4 py-2 text-[14px] text-[#0B1220]/30">
                                        <ArrowLeft className="h-4 w-4" /> Previous
                                    </span>
                                )}
                                {members.next_page_url ? (
                                    <Link href={members.next_page_url} preserveScroll className="inline-flex items-center gap-1.5 rounded-full bg-[#0B1220] px-4 py-2 text-[14px] font-medium text-white hover:bg-[#1A2438]">
                                        Next <ArrowRight className="h-4 w-4" />
                                    </Link>
                                ) : (
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0B1220]/10 px-4 py-2 text-[14px] text-[#0B1220]/30">
                                        Next <ArrowRight className="h-4 w-4" />
                                    </span>
                                )}
                            </div>
                        </nav>
                    )}

                    {/* Privacy + CTA */}
                    <div className="mt-16 grid grid-cols-1 gap-3 md:grid-cols-2">
                        <div className="flex items-start gap-4 rounded-2xl bg-white p-6 ring-1 ring-[#0B1220]/[0.05]">
                            <Lock className="mt-0.5 h-5 w-5 shrink-0 text-[#9A7B3F]" />
                            <div>
                                <div className="text-[16px] font-semibold">Privacy first</div>
                                <p className="mt-1 text-[14px] leading-relaxed text-[#4A4F5C]">
                                    Only details members choose to make public appear here. Phone, email and WhatsApp are visible to verified batchmates only.
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col justify-between gap-4 rounded-2xl bg-gradient-to-r from-[#C9A55C] to-[#E8D5A3] p-6 sm:flex-row sm:items-center">
                            <div>
                                <div className="text-[16px] font-semibold">Not on the roll yet?</div>
                                <p className="mt-1 text-[14px] text-[#0B1220]/70">Join to appear here and reach every batchmate.</p>
                            </div>
                            <Link href="/register-alumni" className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#0B1220] px-5 py-3 text-[14px] font-medium text-white hover:bg-[#1A2438]">
                                Apply now <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                </main>

                <footer className="border-t border-[#0B1220]/[0.06] bg-white">
                    <div className="mx-auto flex max-w-[1320px] flex-col items-center justify-between gap-3 px-5 py-8 text-[13px] text-[#0B1220]/45 sm:flex-row sm:px-8 lg:px-10">
                        <span>© {new Date().getFullYear()} ccIntake97 · Cadet College Alumni Association</span>
                        <span className="tracking-[0.28em] uppercase">Fidelitas et Disciplina</span>
                    </div>
                </footer>
            </div>
        </>
    );
}
