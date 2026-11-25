import { Award, Calendar, Landmark } from 'lucide-react';
import { CHARTER_ARTICLES, CAMPUS_PHOTOS, FALLBACK_COMMITTEE } from '@/components/landing/constants';
import { LANDING_CONTAINER, LANDING_SECTION, LANDING_SECTION_BODY, LANDING_SUBSECTION } from '@/components/landing/layout';
import { ExploreLink, Reveal, initialsOf } from '@/components/landing/primitives';
import type { MergedCollege } from '@/components/landing/types';
import type { Committee } from '@/types/intake97';

export function LandingCommittee({ committee, mergedColleges }: { committee: Committee | null; mergedColleges: MergedCollege[] }) {
    return (
                        <section id="committee" className={`${LANDING_SECTION} bg-[#F4F2EE]`}>
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
                                    const logoOf = (code: string) => mergedColleges.find((c) => c.short_name === code)?.logo_url;
        
                                    return (
                                        <>
                                            <Reveal>
                                                <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
                                                    <div>
                                                        <p className="text-[11px] font-medium tracking-[0.26em] text-[#8E6B28] uppercase">
                                                            Secretariat Stewardship
                                                        </p>
                                                        <h2 className="mt-4 font-serif text-5xl leading-[1.02] font-medium tracking-[-0.015em] text-[#091324] lg:text-[3.75rem]">
                                                            Led by <em className="font-normal italic text-[#8E6B28]">batchmates.</em>
                                                        </h2>
                                                        <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-[#4A4F5C]">
                                                            The {committeeName} — elected from every college chapter to serve the whole intake with zero hierarchy.
                                                        </p>
                                                    </div>
                                                    <div className="flex flex-wrap items-center gap-4">
                                                        <div className="flex shrink-0 items-center gap-3 rounded-full bg-white py-2 pr-5 pl-2 shadow-xs ring-1 ring-[#091324]/[0.07]">
                                                            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#091324] text-[#E8D5A3]">
                                                                <Calendar className="h-4 w-4" />
                                                            </span>
                                                            <span>
                                                                <span className="block text-[10.5px] tracking-[0.18em] text-[#091324]/45 uppercase">Current term</span>
                                                                <span className="block text-[15px] font-semibold text-[#091324]">{term ? `${term[1]} – ${term[2]}` : 'Two-year term'}</span>
                                                            </span>
                                                        </div>
                                                        <ExploreLink href="/committee" internal={false}>
                                                            Full council
                                                        </ExploreLink>
                                                    </div>
                                                </div>
                                            </Reveal>
        
                                            <div className={`grid grid-cols-1 gap-5 lg:grid-cols-12 ${LANDING_SECTION_BODY}`}>
                                                {/* Featured: President */}
                                                {lead && (
                                                    <Reveal className="lg:col-span-5">
                                                        <article className="group relative isolate flex h-full min-h-[540px] flex-col justify-between overflow-hidden rounded-3xl bg-[#091324] text-white ring-1 ring-[#C8A252]/40 shadow-[0_32px_64px_-32px_rgba(9,19,36,0.55)]">
                                                            {lead.avatar ? (
                                                                <img src={lead.avatar} alt={lead.name} className="absolute inset-0 -z-20 h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-105" />
                                                            ) : (
                                                                <div className="absolute inset-0 -z-20">
                                                                    {CAMPUS_PHOTOS[lead.college] && <img src={CAMPUS_PHOTOS[lead.college]} alt="" className="h-full w-full object-cover opacity-25" />}
                                                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_28%,rgba(200,162,82,0.28),transparent_58%)]" />
                                                                </div>
                                                            )}
                                                            <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#060B15] via-[#060B15]/60 to-[#060B15]/20" />

                                                            {/* Top Crest Row */}
                                                            <div className="flex items-center justify-between p-7 sm:p-9">
                                                                <span className="inline-flex items-center gap-2 rounded-full bg-[#C8A252] px-3.5 py-1.5 text-[11px] font-semibold tracking-[0.18em] text-[#091324] uppercase shadow-sm">
                                                                    <Award className="h-3.5 w-3.5" /> {lead.title}
                                                                </span>
                                                                {logoOf(lead.college) && (
                                                                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white p-1 shadow-md ring-2 ring-[#C8A252]/50">
                                                                        <img src={logoOf(lead.college)!} alt="" className="h-full w-full object-contain" />
                                                                    </span>
                                                                )}
                                                            </div>

                                                            {/* Center Monogram when no avatar */}
                                                            {!lead.avatar && (
                                                                <div className="flex justify-center py-4">
                                                                    <div className="rounded-full bg-gradient-to-b from-[#F3E3B5] to-[#8E6B28] p-1 shadow-[0_24px_50px_-16px_rgba(0,0,0,0.85)] transition-transform duration-500 group-hover:scale-105">
                                                                        <span className="flex h-36 w-36 items-center justify-center rounded-full bg-[#091324] font-serif text-5xl font-semibold text-[#E8D5A3]">
                                                                            {initialsOf(lead.name)}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            )}

                                                            <div className="p-7 sm:p-9">
                                                                <h3 className="font-serif text-3xl leading-tight font-semibold sm:text-4xl">{lead.name}</h3>
                                                                {lead.role && <p className="mt-1.5 text-[15px] text-[#E8D5A3]/90">{lead.role}</p>}
                                                                <p className="mt-4 border-l-2 border-[#C8A252]/60 pl-3.5 font-serif text-[15px] leading-snug text-white/75 italic">
                                                                    “Sovereign servants to our batchmates — upholding parity across every cadet college.”
                                                                </p>
                                                                <div className="mt-6 flex items-center gap-3 border-t border-white/15 pt-5 text-[13.5px] text-white/70">
                                                                    {mergedColleges.find((c) => c.short_name === lead.college)?.name ?? lead.college} · Class of ’97
                                                                </div>
                                                            </div>
                                                        </article>
                                                    </Reveal>
                                                )}
        
                                                {/* Council */}
                                                <div className="flex flex-col gap-4 lg:col-span-7">
                                                    {others.length > 0 && (
                                                    <div className={`grid grid-cols-1 gap-4 ${others.length > 1 ? 'sm:grid-cols-2' : ''}`}>
                                                    {others.slice(0, 4).map((p, i) => (
                                                        <Reveal key={p.key} delay={i * 70}>
                                                            <article className="group flex h-full items-center gap-4 rounded-2xl bg-white p-5 ring-1 ring-[#091324]/[0.06] transition-all duration-300 hover:-translate-y-1 hover:ring-[#C8A252]/45 hover:shadow-[0_24px_48px_-28px_rgba(9,19,36,0.28)] sm:p-6">
                                                                <div className="relative shrink-0">
                                                                    {p.avatar ? (
                                                                        <img src={p.avatar} alt={p.name} className="h-18 w-18 rounded-full object-cover ring-2 ring-[#C8A252]/30" />
                                                                    ) : (
                                                                        <span className="flex h-18 w-18 items-center justify-center rounded-full bg-gradient-to-br from-[#1C2840] to-[#091324] font-serif text-2xl font-semibold text-[#E8D5A3] ring-2 ring-[#C8A252]/30">
                                                                            {initialsOf(p.name)}
                                                                        </span>
                                                                    )}
                                                                    {logoOf(p.college) && (
                                                                        <img src={logoOf(p.college)!} alt="" className="absolute -right-1 -bottom-1 h-7 w-7 rounded-full bg-white object-contain p-0.5 shadow-xs ring-2 ring-white" />
                                                                    )}
                                                                </div>
                                                                <div className="min-w-0">
                                                                    <div className="text-[10.5px] font-semibold tracking-[0.18em] text-[#8E6B28] uppercase">{p.title}</div>
                                                                    <h3 className="mt-1 font-serif text-[19px] leading-snug font-semibold text-[#091324] transition-colors group-hover:text-[#8E6B28]">{p.name}</h3>
                                                                    {p.role && <p className="mt-0.5 line-clamp-1 text-[13.5px] text-[#4A4F5C]">{p.role}</p>}
                                                                    <p className="mt-1 text-[12px] font-medium text-[#091324]/45">{p.college ? `${p.college} ’97` : 'Class of ’97'}</p>
                                                                </div>
                                                            </article>
                                                        </Reveal>
                                                    ))}
                                                    </div>
                                                    )}
        
                                                    <Reveal delay={others.length * 70} className="flex-1">
                                                        <div className="relative isolate flex h-full flex-col justify-between gap-6 overflow-hidden rounded-2xl bg-[#091324] p-7 text-white ring-1 ring-[#C8A252]/25 sm:p-8">
                                                            <div className="pointer-events-none absolute -top-24 -right-24 -z-10 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(200,162,82,0.22),transparent_65%)]" />
                                                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                                                <div className="max-w-md">
                                                                    <div className="flex items-center gap-2.5">
                                                                        <Landmark className="h-5 w-5 text-[#C8A252]" strokeWidth={1.6} />
                                                                        <span className="text-[10.5px] font-semibold tracking-[0.22em] text-[#E8D5A3] uppercase">
                                                                            Equal Representation
                                                                        </span>
                                                                    </div>
                                                                    <h3 className="mt-3 font-serif text-2xl leading-tight font-medium">Every college, an equal seat.</h3>
                                                                    <p className="mt-2 text-[14px] leading-relaxed text-white/65">
                                                                        Each of the ten colleges holds an equal seat on the council. Leadership rotates democratically every two years.
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className="flex flex-wrap gap-2">
                                                                {mergedColleges.map((c) => (
                                                                    <span key={c.short_name} title={c.name} className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-white ring-1 ring-white/20 transition-transform duration-300 hover:scale-110">
                                                                        {c.logo_url ? <img src={c.logo_url} alt={c.name} className="h-full w-full object-contain p-0.5" /> : <span className="text-[8px] font-semibold text-[#091324]">{c.short_name}</span>}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </Reveal>
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
                                                <p className="text-[11px] font-medium tracking-[0.26em] text-[#8E6B28] uppercase">Governance &amp; Bylaws</p>
                                                <h3 className="mt-3 font-serif text-3xl font-medium text-[#091324] sm:text-4xl">
                                                    The <em className="font-normal italic text-[#8E6B28]">Charter.</em>
                                                </h3>
                                            </div>
                                            <ExploreLink href="/login" internal={false}>Download full charter</ExploreLink>
                                        </div>
                                    </Reveal>
                                    <ol className={`grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 ${LANDING_SECTION_BODY}`}>
                                        {CHARTER_ARTICLES.map((c, i) => (
                                            <Reveal key={c.numeral} delay={i * 70} className="h-full">
                                                <li className="group h-full rounded-2xl bg-white p-7 ring-1 ring-[#091324]/[0.06] transition-all duration-300 hover:-translate-y-0.5 hover:ring-[#C8A252]/45 hover:shadow-md">
                                                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#091324] font-serif text-[16px] font-semibold text-[#E8D5A3] transition-colors group-hover:bg-[#8E6B28] group-hover:text-white">
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
