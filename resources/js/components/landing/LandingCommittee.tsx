import { Calendar } from 'lucide-react';
import { CHARTER_ARTICLES, FALLBACK_COMMITTEE } from '@/components/landing/constants';
import { LANDING_CONTAINER, LANDING_SECTION, LANDING_SECTION_BODY, LANDING_SUBSECTION } from '@/components/landing/layout';
import { ExploreLink, Reveal, initialsOf } from '@/components/landing/primitives';
import type { MergedCollege } from '@/components/landing/types';
import type { Committee } from '@/types/intake97';

export function LandingCommittee({
    committee,
    mergedColleges,
    omitHeading = false,
    className = '',
}: {
    committee: Committee | null;
    mergedColleges: MergedCollege[];
    omitHeading?: boolean;
    className?: string;
}) {
    return (
                        <section id={omitHeading ? undefined : 'committee'} className={`${LANDING_SECTION} bg-[#F8FAFC] ${className}`.trim()}>
                            <div className={LANDING_CONTAINER}>
                                {(() => {
                                    const people = (committee?.members && committee.members.length > 0
                                        ? committee.members.map((cm) => ({
                                              key: String(cm.id),
                                              title: cm.position_title || 'Council Member',
                                              name: cm.member?.user?.name || '',
                                              role: cm.member?.profile?.designation || '',
                                              college: cm.member?.college?.short_name || '',
                                              avatar: cm.member?.user?.avatar_path as string | undefined,
                                          }))
                                        : FALLBACK_COMMITTEE.map((c) => ({ key: c.name, title: c.title, name: c.name, role: c.role, college: c.college.split(' ')[0], avatar: undefined as string | undefined }))
                                    ).map((p) => ({ ...p, avatar: p.avatar ? (/^(https?:)?\/\/|^\//.test(p.avatar) ? p.avatar : `/storage/${p.avatar}`) : undefined }));
                                    const leadIdx = Math.max(0, people.findIndex((p) => /^president$/i.test(p.title.trim())));
                                    const lead = people[leadIdx];
                                    const others = people.filter((_, i) => i !== leadIdx);
                                    const term = committee?.name?.match(/\((\d{4})\s*[-–]\s*(\d{4})\)/);
                                    const committeeName = (committee?.name || 'Central Executive Committee').replace(/\s*\(\d{4}\s*[-–]\s*\d{4}\)\s*/, '');
                                    return (
                                        <>
                                            {omitHeading ? (
                                                <Reveal>
                                                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                                                        <div>
                                                            <p className="text-[11px] font-medium tracking-[0.26em] text-[#5E121D] uppercase">
                                                                Executive Roster
                                                            </p>
                                                            <h2 className="mt-2 font-serif text-3xl font-medium text-[#091324] sm:text-4xl">
                                                                {committeeName}
                                                            </h2>
                                                        </div>
                                                        <div className="flex items-center gap-3 rounded-full bg-[#F8FAFC] px-4 py-2 ring-1 ring-[#091324]/[0.07]">
                                                            <Calendar className="h-4 w-4 text-[#5E121D]" />
                                                            <span className="text-[13px] font-semibold text-[#091324]">
                                                                {term ? `${term[1]} – ${term[2]}` : 'Two-year term'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </Reveal>
                                            ) : (
                                                <Reveal>
                                                    <div className="grid items-end gap-10 lg:grid-cols-12">
                                                        <div className="border-l-2 border-brand-gold pl-6 lg:col-span-8">
                                                            <p className="text-[11px] font-medium tracking-[0.26em] text-brand-gold-muted uppercase">
                                                                Secretariat Stewardship
                                                            </p>
                                                            <h2 className="mt-4 font-serif text-5xl leading-[1.02] font-medium tracking-[-0.015em] text-brand-navy lg:text-[3.75rem]">
                                                                Led by <em className="font-normal italic text-brand-gold-muted">batchmates.</em>
                                                            </h2>
                                                            <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-brand-navy/65">
                                                                The {committeeName} — elected from every college chapter to serve the whole intake with zero hierarchy.
                                                            </p>
                                                        </div>
                                                        <div className="flex flex-wrap items-center gap-5 lg:col-span-4 lg:justify-end">
                                                            <div className="flex items-center gap-3">
                                                                <Calendar className="h-4 w-4 text-brand-gold" />
                                                                <span>
                                                                    <span className="block text-[10.5px] tracking-[0.18em] text-brand-navy/45 uppercase">Current term</span>
                                                                    <span className="block text-[15px] font-semibold text-brand-navy">{term ? `${term[1]} – ${term[2]}` : 'Two-year term'}</span>
                                                                </span>
                                                            </div>
                                                            <ExploreLink href="/committee" internal={false}>
                                                                Full council
                                                            </ExploreLink>
                                                        </div>
                                                    </div>
                                                </Reveal>
                                            )}

                                            <div className="mt-10 space-y-5">
                                                {lead && (
                                                    <Reveal>
                                                        <div className="flex flex-col justify-between gap-6 rounded-2xl border border-[#450D15]/40 bg-[#091324] p-6 text-[#F7F3EA] shadow-[0_24px_50px_-24px_rgba(9,19,36,0.45)] sm:flex-row sm:items-center sm:p-8">
                                                            <div className="flex items-center gap-5">
                                                                {lead.avatar ? (
                                                                    <img src={lead.avatar} alt="" className="h-18 w-18 shrink-0 rounded-2xl object-cover ring-2 ring-[#450D15]/50" />
                                                                ) : (
                                                                    <span className="flex h-18 w-18 shrink-0 items-center justify-center rounded-2xl bg-[#11203B] font-serif text-2xl font-semibold text-[#F4C2C7] ring-2 ring-[#450D15]/40">
                                                                        {initialsOf(lead.name)}
                                                                    </span>
                                                                )}
                                                                <div>
                                                                    <span className="inline-block rounded-full bg-[#450D15]/20 px-3 py-0.5 text-[11px] font-semibold tracking-[0.18em] text-[#F4C2C7] uppercase">
                                                                        {lead.title}
                                                                    </span>
                                                                    <h3 className="mt-2 font-serif text-2xl font-medium text-white sm:text-3xl">{lead.name}</h3>
                                                                    {lead.role && <p className="mt-1 text-[14px] text-[#F7F3EA]/70">{lead.role}</p>}
                                                                </div>
                                                            </div>
                                                            <div className="text-[13px] font-medium text-[#F4C2C7]/85 sm:text-right">
                                                                {mergedColleges.find((c) => c.short_name === lead.college)?.name || (lead.college ? `${lead.college} ’97` : 'Class of ’97')}
                                                            </div>
                                                        </div>
                                                    </Reveal>
                                                )}

                                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                                    {others.map((p, i) => {
                                                        const collegeName = mergedColleges.find((c) => c.short_name === p.college)?.name;
                                                        return (
                                                            <Reveal key={p.key} delay={i * 40}>
                                                                <div className="flex h-full flex-col justify-between rounded-2xl border border-[#091324]/[0.08] bg-[#F8FAFC]/75 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#450D15]/45 hover:bg-white hover:shadow-[0_14px_32px_-18px_rgba(9,19,36,0.14)]">
                                                                    <div className="flex items-center gap-4">
                                                                        {p.avatar ? (
                                                                            <img src={p.avatar} alt="" className="h-14 w-14 shrink-0 rounded-full object-cover ring-2 ring-[#450D15]/30" />
                                                                        ) : (
                                                                            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#091324] font-serif text-lg font-semibold text-[#F4C2C7] ring-2 ring-[#450D15]/30">
                                                                                {initialsOf(p.name)}
                                                                            </span>
                                                                        )}
                                                                        <div className="min-w-0">
                                                                            <div className="text-[10.5px] font-semibold tracking-[0.18em] text-[#5E121D] uppercase">{p.title}</div>
                                                                            <h3 className="mt-0.5 truncate font-serif text-xl font-semibold text-[#091324]">{p.name}</h3>
                                                                            {p.role && <p className="mt-0.5 truncate text-[13px] text-[#4A4F5C]">{p.role}</p>}
                                                                        </div>
                                                                    </div>
                                                                    <div className="mt-4 border-t border-[#091324]/[0.06] pt-3 text-[12px] font-medium text-[#091324]/60">
                                                                        {collegeName || (p.college ? `${p.college} ’97` : 'Class of ’97')}
                                                                    </div>
                                                                </div>
                                                            </Reveal>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                                                <p className="max-w-md text-[14px] leading-relaxed text-brand-navy/60">
                                                    Each of the ten colleges holds an equal seat. The chair rotates every two years.
                                                </p>
                                                <div className="flex flex-wrap gap-2">
                                                    {mergedColleges.map((c) => (
                                                        <span key={c.short_name} title={c.name} className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-white ring-1 ring-brand-navy/10">
                                                            {c.logo_url ? <img src={c.logo_url} alt={c.name} className="h-full w-full object-contain p-0.5" /> : <span className="text-[8px] font-semibold text-brand-navy">{c.short_name}</span>}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </>
                                    );
                                })()}
        
                                {/* Charter */}
                                <div id="constitution" className={`scroll-mt-24 ${LANDING_SUBSECTION}`}>
                                    <Reveal>
                                        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
                                            <div>
                                                <p className="text-[11px] font-medium tracking-[0.26em] text-[#5E121D] uppercase">Governance &amp; Bylaws</p>
                                                <h3 className="mt-3 font-serif text-3xl font-medium text-[#091324] sm:text-4xl">
                                                    The <em className="font-normal italic text-[#5E121D]">Charter.</em>
                                                </h3>
                                            </div>
                                            <ExploreLink href="/login" internal={false}>Download full charter</ExploreLink>
                                        </div>
                                    </Reveal>
                                    <ol className={`grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 ${LANDING_SECTION_BODY}`}>
                                        {CHARTER_ARTICLES.map((c, i) => (
                                            <Reveal key={c.numeral} delay={i * 70} className="h-full">
                                                <li className="group h-full rounded-2xl border border-brand-navy/[0.08] bg-[#F8FAFC]/60 p-7 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#450D15]/45 hover:bg-white hover:shadow-md">
                                                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#091324] font-serif text-[16px] font-semibold text-[#F4C2C7] transition-colors group-hover:bg-[#5E121D] group-hover:text-white">
                                                        {c.numeral}
                                                    </span>
                                                    <h4 className="mt-5 text-[17px] font-semibold text-[#091324]">{c.title}</h4>
                                                    <p className="mt-2 text-[14px] leading-relaxed text-[#4A4F5C]">{c.text}</p>
                                                </li>
                                            </Reveal>
                                        ))}
                                    </ol>
                                </div>
                            </div>
                        </section>
    );
}
