import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    ArrowUpRight,
    Briefcase,
    Building2,
    Calendar,
    Globe,
    GraduationCap,
    Layers,
    Linkedin,
    Lock,
    MapPin,
    Quote,
    ShieldCheck,
} from 'lucide-react';
import { CAMPUS_PHOTOS } from '@/components/landing/constants';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { LANDING_CONTAINER } from '@/components/landing/layout';
import PublicSiteHeader from '@/components/public-site-header';

interface PublicMemberDetail {
    id: number;
    name: string;
    initials: string;
    intake_year?: number;
    college: {
        id: number;
        name: string;
        short_name?: string;
        logo_url?: string | null;
    } | null;
    photo_url: string | null;
    designation: string | null;
    organization: string | null;
    industry: string | null;
    city: string | null;
    country_code: string | null;
    professional_bio: string | null;
    linkedin_url: string | null;
    website_url: string | null;
    businesses?: {
        id: number;
        name: string;
        description: string | null;
        website: string | null;
        city: string | null;
        logo_url: string | null;
    }[];
}

const COUNTRY_NAMES: Record<string, string> = {
    BD: 'Bangladesh', US: 'United States', GB: 'United Kingdom', CA: 'Canada', AU: 'Australia', AE: 'UAE',
    SA: 'Saudi Arabia', SG: 'Singapore', MY: 'Malaysia', QA: 'Qatar', DE: 'Germany', JP: 'Japan',
};

function PrivateValue() {
    return (
        <span className="inline-flex items-center gap-1 text-[13px] font-medium text-[#9A8F92]">
            <Lock className="h-3 w-3" /> Private
        </span>
    );
}

function DetailRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: React.ReactNode }) {
    return (
        <div className="flex items-start gap-4 py-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FAF5F6] text-[#6E1622]">
                <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
            </span>
            <div className="min-w-0 flex-1">
                <div className="text-[11.5px] font-semibold tracking-[0.14em] text-[#9A8F92] uppercase">{label}</div>
                <div className="mt-1 text-[15px] font-semibold break-words text-[#091324]">{value}</div>
            </div>
        </div>
    );
}

export default function PublicMemberShow({ member }: { member: PublicMemberDetail }) {
    const { auth } = usePage().props as { auth?: { user?: unknown } };
    const intake = member.intake_year || 1997;
    const cover = member.college?.short_name ? CAMPUS_PHOTOS[member.college.short_name] : undefined;
    const location = [member.city, member.country_code ? COUNTRY_NAMES[member.country_code] ?? member.country_code : null].filter(Boolean).join(', ');
    const headline = [member.designation, member.organization].filter(Boolean).join(' · ');
    const businesses = member.businesses ?? [];

    return (
        <>
            <Head title={`${member.name} — Batch Directory — ccIntake97`} />
            <div className="min-h-screen bg-[#F7F4F2] font-sans text-[#091324] antialiased">
                <PublicSiteHeader active="Directory" />

                {/* Cover */}
                <div className="relative isolate h-[300px] overflow-hidden bg-[#091324] pt-20 sm:h-[340px]">
                    {cover && <img src={cover} alt="" className="absolute inset-0 -z-20 h-full w-full object-cover opacity-55" />}
                    <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#091324]/70 via-[#2A0A10]/55 to-[#450D15]/85" />
                    <div className={`${LANDING_CONTAINER} pt-8`}>
                        <Link
                            href="/directory"
                            className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-2 text-[13px] font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/20"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Batch Directory
                        </Link>
                    </div>
                </div>

                <main className={`${LANDING_CONTAINER} relative -mt-32 pb-24`}>
                    <div className="mx-auto max-w-6xl">
                        {/* Identity card */}
                        <section className="rounded-[28px] bg-white p-6 shadow-[0_30px_70px_-35px_rgba(69,13,21,0.45)] ring-1 ring-[#450D15]/[0.06] sm:p-8 lg:p-10">
                            <div className="flex flex-col gap-7 lg:flex-row lg:items-end">
                                <div className="relative -mt-20 shrink-0 self-start sm:-mt-24">
                                    {member.photo_url ? (
                                        <img
                                            src={member.photo_url}
                                            alt={member.name}
                                            className="h-40 w-40 rounded-[28px] object-cover object-top shadow-[0_20px_40px_-18px_rgba(9,19,36,0.6)] ring-[6px] ring-white sm:h-48 sm:w-48"
                                        />
                                    ) : (
                                        <div className="flex h-40 w-40 items-center justify-center rounded-[28px] bg-gradient-to-br from-[#6E1622] to-[#2A0A10] font-serif text-5xl font-semibold text-[#F4C2C7] shadow-[0_20px_40px_-18px_rgba(9,19,36,0.6)] ring-[6px] ring-white sm:h-48 sm:w-48">
                                            {member.initials}
                                        </div>
                                    )}
                                    {member.college?.logo_url && (
                                        <img
                                            src={member.college.logo_url}
                                            alt={member.college.name}
                                            title={member.college.name}
                                            className="absolute -right-3 -bottom-3 h-14 w-14 rounded-full bg-white object-contain p-1 shadow-md ring-4 ring-white"
                                        />
                                    )}
                                </div>

                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <h1 className="font-serif text-[2.1rem] leading-tight font-medium tracking-tight sm:text-[2.6rem]">{member.name}</h1>
                                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-[12px] font-semibold text-emerald-700 ring-1 ring-emerald-600/15">
                                            <ShieldCheck className="h-3.5 w-3.5" /> Verified alumnus
                                        </span>
                                    </div>
                                    <p className="mt-2 text-[16.5px] font-medium text-[#4A4F5C]">{headline || `${member.college?.short_name ?? 'Cadet College'} · Intake ${intake}`}</p>
                                    <div className="mt-5 flex flex-wrap gap-2">
                                        {member.college && (
                                            <span className="inline-flex items-center gap-2 rounded-full bg-[#FAF5F6] py-1.5 pr-3.5 pl-1.5 text-[13px] font-semibold text-[#450D15] ring-1 ring-[#450D15]/10">
                                                {member.college.logo_url ? (
                                                    <img src={member.college.logo_url} alt="" className="h-6 w-6 rounded-full bg-white object-contain p-0.5" />
                                                ) : (
                                                    <GraduationCap className="ml-1 h-4 w-4" />
                                                )}
                                                {member.college.name}
                                            </span>
                                        )}
                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FAF5F6] px-3.5 py-1.5 text-[13px] font-semibold text-[#450D15] ring-1 ring-[#450D15]/10">
                                            <Calendar className="h-3.5 w-3.5" /> Intake {intake}
                                        </span>
                                        {location && (
                                            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FAF5F6] px-3.5 py-1.5 text-[13px] font-semibold text-[#450D15] ring-1 ring-[#450D15]/10">
                                                <MapPin className="h-3.5 w-3.5" /> {location}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex shrink-0 flex-wrap items-center gap-2.5">
                                    {member.linkedin_url && (
                                        <a href={member.linkedin_url} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="flex h-11 w-11 items-center justify-center rounded-full ring-1 ring-[#450D15]/15 transition-colors hover:bg-[#0A66C2] hover:text-white hover:ring-[#0A66C2]">
                                            <Linkedin className="h-[18px] w-[18px]" />
                                        </a>
                                    )}
                                    {member.website_url && (
                                        <a href={member.website_url} target="_blank" rel="noreferrer" aria-label="Website" className="flex h-11 w-11 items-center justify-center rounded-full ring-1 ring-[#450D15]/15 transition-colors hover:bg-[#091324] hover:text-white hover:ring-[#091324]">
                                            <Globe className="h-[18px] w-[18px]" />
                                        </a>
                                    )}
                                    {auth?.user ? (
                                        <Link
                                            href={`/member/directory/${member.id}`}
                                            className="inline-flex h-11 items-center gap-2 rounded-full bg-gradient-to-r from-[#6E1622] to-[#450D15] px-6 text-[14px] font-semibold text-white shadow-[0_12px_24px_-12px_rgba(69,13,21,0.7)] transition-all hover:brightness-110"
                                        >
                                            Full member profile <ArrowUpRight className="h-4 w-4" />
                                        </Link>
                                    ) : (
                                        <Link
                                            href="/login"
                                            className="inline-flex h-11 items-center gap-2 rounded-full bg-gradient-to-r from-[#6E1622] to-[#450D15] px-6 text-[14px] font-semibold text-white shadow-[0_12px_24px_-12px_rgba(69,13,21,0.7)] transition-all hover:brightness-110"
                                        >
                                            <Lock className="h-4 w-4" /> Sign in to connect
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </section>

                        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
                            {/* Main column */}
                            <div className="space-y-6 lg:col-span-2">
                                {member.professional_bio && (
                                    <section className="relative overflow-hidden rounded-3xl bg-white p-7 ring-1 ring-[#450D15]/[0.06] sm:p-9">
                                        <Quote className="absolute top-6 right-7 h-14 w-14 text-[#450D15]/[0.06]" />
                                        <h2 className="text-[12px] font-semibold tracking-[0.18em] text-[#6E1622] uppercase">About</h2>
                                        <p className="mt-4 font-serif text-[21px] leading-[1.55] text-[#091324]">{member.professional_bio}</p>
                                    </section>
                                )}

                                <section className="rounded-3xl bg-white px-7 py-3 ring-1 ring-[#450D15]/[0.06] sm:px-9">
                                    <h2 className="pt-5 text-[12px] font-semibold tracking-[0.18em] text-[#6E1622] uppercase">Professional</h2>
                                    <div className="mt-1 grid grid-cols-1 divide-y divide-[#F1ECEC] sm:grid-cols-2 sm:gap-x-8 sm:divide-y-0">
                                        <DetailRow icon={Briefcase} label="Designation" value={member.designation || <PrivateValue />} />
                                        <DetailRow icon={Building2} label="Organization" value={member.organization || <PrivateValue />} />
                                        {member.industry && <DetailRow icon={Layers} label="Industry" value={member.industry} />}
                                        <DetailRow icon={MapPin} label="Based in" value={location || <PrivateValue />} />
                                    </div>
                                </section>

                                {businesses.length > 0 && (
                                    <section className="rounded-3xl bg-white p-7 ring-1 ring-[#450D15]/[0.06] sm:p-9">
                                        <h2 className="text-[12px] font-semibold tracking-[0.18em] text-[#6E1622] uppercase">Ventures</h2>
                                        <div className="mt-5 space-y-3">
                                            {businesses.map((b) => (
                                                <div key={b.id} className="flex items-start gap-4 rounded-2xl bg-[#FAF5F6] p-5">
                                                    <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white ring-1 ring-[#450D15]/10">
                                                        {b.logo_url ? <img src={b.logo_url} alt="" className="h-full w-full object-contain p-1" /> : <Building2 className="h-5 w-5 text-[#6E1622]" />}
                                                    </span>
                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                                            <h3 className="text-[16px] font-semibold">{b.name}</h3>
                                                            {b.website && (
                                                                <a href={b.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#6E1622] hover:underline">
                                                                    Visit <ArrowUpRight className="h-3.5 w-3.5" />
                                                                </a>
                                                            )}
                                                        </div>
                                                        {b.description && <p className="mt-1 line-clamp-2 text-[14px] leading-relaxed text-[#4A4F5C]">{b.description}</p>}
                                                        {b.city && (
                                                            <div className="mt-2 inline-flex items-center gap-1 text-[12.5px] text-[#9A8F92]">
                                                                <MapPin className="h-3 w-3" /> {b.city}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                )}
                            </div>

                            {/* Sidebar */}
                            <aside className="space-y-6">
                                {member.college && (
                                    <section className="relative isolate overflow-hidden rounded-3xl bg-[#091324] p-7 text-white">
                                        {cover && <img src={cover} alt="" className="absolute inset-0 -z-20 h-full w-full object-cover opacity-25" />}
                                        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#091324] via-[#091324]/85 to-[#091324]/50" />
                                        <div className="text-[12px] font-semibold tracking-[0.18em] text-[#F4C2C7] uppercase">Cadet college</div>
                                        <div className="mt-5 flex items-center gap-4">
                                            {member.college.logo_url && <img src={member.college.logo_url} alt="" className="h-16 w-16 rounded-full bg-white object-contain p-1" />}
                                            <div>
                                                <div className="text-[18px] leading-snug font-semibold">{member.college.name}</div>
                                                <div className="mt-1 text-[13px] text-white/60">Intake {intake} · Class of ’{String(intake).slice(-2)}</div>
                                            </div>
                                        </div>
                                        <Link
                                            href={`/directory?college_id=${member.college.id}`}
                                            className="mt-6 inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-[#F4C2C7] hover:text-white"
                                        >
                                            More batchmates from {member.college.short_name ?? 'this college'} <ArrowUpRight className="h-4 w-4" />
                                        </Link>
                                    </section>
                                )}

                                <section className="rounded-3xl bg-white p-7 ring-1 ring-[#450D15]/[0.06]">
                                    <div className="flex items-center gap-2 text-[15px] font-semibold">
                                        <Lock className="h-4 w-4 text-[#6E1622]" /> Contact details
                                    </div>
                                    <p className="mt-2 text-[14px] leading-relaxed text-[#4A4F5C]">
                                        Phone, email and WhatsApp are shared only with verified batchmates.
                                    </p>
                                    {!auth?.user && (
                                        <div className="mt-5 flex gap-2">
                                            <Link href="/login" className="flex-1 rounded-full bg-[#091324] py-2.5 text-center text-[13.5px] font-semibold text-white hover:bg-[#162238]">
                                                Sign in
                                            </Link>
                                            <Link href="/register-alumni" className="flex-1 rounded-full py-2.5 text-center text-[13.5px] font-semibold ring-1 ring-[#091324]/15 hover:bg-[#091324]/5">
                                                Join
                                            </Link>
                                        </div>
                                    )}
                                </section>
                            </aside>
                        </div>
                    </div>
                </main>

                <LandingFooter />
            </div>
        </>
    );
}
