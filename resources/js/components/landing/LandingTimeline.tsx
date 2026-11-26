import { LANDING_CONTAINER, LANDING_GRID_GAP, LANDING_SECTION, LANDING_SECTION_BODY } from '@/components/landing/layout';
import { Reveal, SectionHeading } from '@/components/landing/primitives';
import { TIMELINE_MILESTONES } from '@/components/landing/constants';
import type { CmsMilestoneItem } from '@/components/landing/types';

export function LandingTimeline({ className = '', milestones }: { className?: string; milestones?: CmsMilestoneItem[] }) {
    const items = milestones && milestones.length > 0 ? milestones : TIMELINE_MILESTONES;
    return (
        <section className={`${LANDING_SECTION} bg-white ${className}`.trim()}>
                            <div className={LANDING_CONTAINER}>
                                <SectionHeading eyebrow="Since 1997" title={<>From induction <em className="font-normal text-[#047857]">to 2027.</em></>} align="center" intro="Class 7 in 1997, passing out around 2003, and a reunion planned for the thirtieth year." />
        
                                <div className={LANDING_SECTION_BODY}>
                                    <ol className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-7">
                                        {items.map((m, i) => {
                                            const highlighted = m.is_highlighted ?? i === items.length - 1;
                                            return (
                                            <Reveal key={m.year} delay={i * 90}>
                                                <li
                                                    className={`relative flex h-full flex-col justify-between rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1 ${
                                                        highlighted
                                                            ? 'border-[#10B981]/45 bg-[#091324] text-[#F7F3EA] shadow-[0_24px_50px_-20px_rgba(9,19,36,0.45)]'
                                                            : 'border-[#0B1220]/[0.07] bg-[#FAF8F3]/75 hover:border-[#10B981]/45 hover:bg-white hover:shadow-[0_18px_40px_-18px_rgba(11,18,32,0.14)]'
                                                    }`}
                                                >
                                                    <div>
                                                        <div className="flex items-center justify-between gap-3">
                                                            <span
                                                                className={`inline-flex items-center rounded-full px-3 py-1 font-sans text-[11px] font-bold tracking-[0.18em] tabular-nums uppercase ${
                                                                    highlighted
                                                                        ? 'bg-[#10B981]/20 text-[#34D399]'
                                                                        : 'bg-[#091324]/[0.06] text-[#047857]'
                                                                }`}
                                                            >
                                                                {String(i + 1).padStart(2, '0')}
                                                            </span>
                                                            <span className={`font-sans text-3xl font-bold tracking-tight tabular-nums ${highlighted ? 'text-[#34D399]' : 'text-[#091324]'}`}>
                                                                {m.year}
                                                            </span>
                                                        </div>
                                                        <h3 className={`mt-5 text-[18px] font-semibold ${highlighted ? 'text-white' : 'text-[#091324]'}`}>{m.title}</h3>
                                                        <p className={`mt-1 text-[11px] font-semibold tracking-[0.18em] uppercase ${highlighted ? 'text-[#34D399]/80' : 'text-[#047857]'}`}>{m.tagline}</p>
                                                        <p className={`mt-3 text-[14px] leading-relaxed ${highlighted ? 'text-[#F7F3EA]/75' : 'text-[#4A4F5C]'}`}>{m.description}</p>
                                                    </div>
                                                </li>
                                            </Reveal>
                                            );
                                        })}
                                    </ol>
                                </div>
                            </div>
                        </section>
    );
}
