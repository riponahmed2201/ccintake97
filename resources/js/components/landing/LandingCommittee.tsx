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
                                                        <h2 className="text-5xl leading-[1.02] font-medium tracking-[-0.015em] text-[#0B1220] lg:text-[3.75rem]">
                                                            Led by <span className="font-normal text-[#9A7B3F]">batchmates.</span>
                                                        </h2>
                                                        <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-[#4A4F5C]">
                                                            The {committeeName} — elected from every college chapter to serve the whole intake.
                                                        </p>
                                                    </div>
                                                    <div className="flex shrink-0 items-center gap-3 rounded-full bg-white py-2 pr-5 pl-2 ring-1 ring-[#0B1220]/[0.06]">
                                                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0B1220] text-[#E8D5A3]">
                                                            <Calendar className="h-4 w-4" />
                                                        </span>
                                                        <span>
                                                            <span className="block text-[11px] tracking-[0.18em] text-[#0B1220]/45 uppercase">Current term</span>
                                                            <span className="block text-[16px] font-semibold text-[#0B1220]">{term ? `${term[1]} – ${term[2]}` : 'Two-year term'}</span>
                                                        </span>
                                                    </div>
                                                </div>
                                            </Reveal>
        
                                            <div className={`grid grid-cols-1 gap-4 lg:grid-cols-12 ${LANDING_SECTION_BODY}`}>
                                                {/* Featured: President */}
                                                {lead && (
                                                    <Reveal className="lg:col-span-5">
                                                        <article className="group relative isolate flex h-full min-h-[520px] flex-col justify-end overflow-hidden rounded-3xl bg-[#0B1220] text-white ring-2 ring-[#C9A55C]/35 shadow-[0_32px_64px_-32px_rgba(11,18,32,0.55)]">
                                                            {lead.avatar ? (
                                                                <img src={lead.avatar} alt={lead.name} className="absolute inset-0 -z-20 h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-105" />
                                                            ) : (
                                                                <div className="absolute inset-0 -z-20">
                                                                    {CAMPUS_PHOTOS[lead.college] && <img src={CAMPUS_PHOTOS[lead.college]} alt="" className="h-full w-full object-cover opacity-30" />}
                                                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_32%,rgba(201,165,92,0.28),transparent_55%)]" />
                                                                    <div className="absolute inset-x-0 top-[18%] flex justify-center">
                                                                        <div className="rounded-full bg-gradient-to-b from-[#F3E3B5] to-[#9A7B3F] p-1 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.8)]">
                                                                            <span className="flex h-40 w-40 items-center justify-center rounded-full bg-[#0B1220] text-5xl font-semibold text-[#E8D5A3]">{initialsOf(lead.name)}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                            <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#070B14] via-[#070B14]/55 to-transparent" />
                                                            <div className="p-8 sm:p-10">
                                                                <span className="inline-flex items-center gap-2 rounded-full bg-[#C9A55C] px-3 py-1 text-[11px] font-semibold tracking-[0.18em] text-[#0B1220] uppercase">
                                                                    <Award className="h-3.5 w-3.5" /> {lead.title}
                                                                </span>
                                                                <h3 className="mt-4 text-4xl leading-tight font-semibold">{lead.name}</h3>
                                                                {lead.role && <p className="mt-2 text-[16px] text-white/70">{lead.role}</p>}
                                                                <div className="mt-6 flex items-center gap-3 border-t border-white/15 pt-5 text-[14px] text-white/70">
                                                                    {logoOf(lead.college) && <img src={logoOf(lead.college)!} alt="" className="h-8 w-8 rounded-full bg-white object-contain p-0.5" />}
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
                                                    {others.map((p, i) => (
                                                        <Reveal key={p.key} delay={i * 70}>
                                                            <article className="group flex items-center gap-5 rounded-3xl bg-white p-6 ring-1 ring-[#0B1220]/[0.05] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_48px_-28px_rgba(11,18,32,0.35)]">
                                                                <div className="relative shrink-0">
                                                                    {p.avatar ? (
                                                                        <img src={p.avatar} alt={p.name} className="h-20 w-20 rounded-full object-cover" />
                                                                    ) : (
                                                                        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#1E2A42] to-[#0B1220] text-2xl font-semibold text-[#E8D5A3]">{initialsOf(p.name)}</span>
                                                                    )}
                                                                    {logoOf(p.college) && (
                                                                        <img src={logoOf(p.college)!} alt="" className="absolute -right-1 -bottom-1 h-8 w-8 rounded-full bg-white object-contain p-0.5 ring-2 ring-white" />
                                                                    )}
                                                                </div>
                                                                <div className="min-w-0">
                                                                    <div className="text-[11px] font-semibold tracking-[0.16em] text-[#9A7B3F] uppercase">{p.title}</div>
                                                                    <h3 className="mt-1.5 text-[19px] leading-snug font-semibold text-[#0B1220]">{p.name}</h3>
                                                                    {p.role && <p className="mt-0.5 line-clamp-1 text-[14px] text-[#4A4F5C]">{p.role}</p>}
                                                                    <p className="mt-1 text-[12.5px] text-[#0B1220]/45">{p.college ? `${p.college} ’97` : 'Class of ’97'}</p>
                                                                </div>
                                                            </article>
                                                        </Reveal>
                                                    ))}
                                                    </div>
                                                    )}
        
                                                    <Reveal delay={others.length * 70} className="flex-1">
                                                        <div className="relative isolate flex h-full flex-col justify-between gap-8 overflow-hidden rounded-3xl bg-[#0B1220] p-7 text-white sm:p-9">
                                                            <div className="pointer-events-none absolute -top-24 -right-24 -z-10 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(201,165,92,0.22),transparent_65%)]" />
                                                            <div className="max-w-md">
                                                                <Landmark className="h-6 w-6 text-[#C9A55C]" strokeWidth={1.5} />
                                                                <h3 className="mt-4 text-[22px] leading-tight font-semibold">Every college, an equal seat.</h3>
                                                                <p className="mt-2 text-[14px] leading-relaxed text-white/60">
                                                                    Each of the ten colleges is represented on the council. Leadership rotates every two years.
                                                                </p>
                                                            </div>
                                                            <div className="flex flex-wrap gap-2">
                                                                {mergedColleges.map((c) => (
                                                                    <span key={c.short_name} title={c.name} className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-white">
                                                                        {c.logo_url ? <img src={c.logo_url} alt={c.name} className="h-full w-full object-contain p-0.5" /> : <span className="text-[8px] text-[#0B1220]">{c.short_name}</span>}
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
                                                <h3 className="text-3xl font-medium text-[#0B1220] sm:text-4xl">The <span className="font-normal text-[#9A7B3F]">Charter.</span></h3>
                                            </div>
                                            <ExploreLink href="/login" internal={false}>Download full charter</ExploreLink>
                                        </div>
                                    </Reveal>
                                    <ol className={`grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 ${LANDING_SECTION_BODY}`}>
                                        {CHARTER_ARTICLES.map((c, i) => (
                                            <Reveal key={c.numeral} delay={i * 70} className="h-full">
                                                <li className="h-full rounded-3xl bg-white p-7 ring-1 ring-[#0B1220]/[0.05]">
                                                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#0B1220] text-[15px] font-semibold text-[#E8D5A3]">{c.numeral}</span>
                                                    <h4 className="mt-5 text-[17px] font-semibold text-[#0B1220]">{c.title}</h4>
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
