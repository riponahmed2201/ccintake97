import { Link } from '@inertiajs/react';
import { ArrowRight, Calendar, MapPin } from 'lucide-react';
import { LANDING_CONTAINER, LANDING_SECTION, LANDING_SECTION_BODY } from '@/components/landing/layout';
import { Reveal, SectionHeading } from '@/components/landing/primitives';
import type { Event } from '@/types/intake97';

function formatEventDate(startsOn: string, startsTime?: string) {
    const d = new Date(startsOn);
    const date = d.toLocaleDateString(undefined, { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' });
    return startsTime ? `${date} · ${startsTime}` : date;
}

export function LandingEvents({ events }: { events: Event[] }) {
    if (events.length === 0) return null;

    return (
        <section id="events" className={`border-y border-brand-navy/[0.06] bg-white ${LANDING_SECTION}`}>
            <div className={LANDING_CONTAINER}>
                <SectionHeading
                    eyebrow="On the calendar"
                    title={
                        <>
                            Upcoming <em className="font-normal text-brand-gold-muted">gatherings.</em>
                        </>
                    }
                    intro="Public events open to verified batchmates and guests — reunions, conclaves, and chapter musters."
                />
                <div className={`grid grid-cols-1 gap-4 ${LANDING_SECTION_BODY}`}>
                    {events.map((ev, i) => (
                        <Reveal key={ev.id} delay={i * 50}>
                            <div className="group flex flex-col gap-4 rounded-2xl border border-brand-navy/[0.08] bg-[#F8FAFC]/60 p-6 transition-all duration-300 hover:border-[#450D15]/45 hover:bg-white hover:shadow-[0_18px_40px_-22px_rgba(11,18,32,0.15)] sm:flex-row sm:items-center sm:justify-between">
                                <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-3 text-[11px] tracking-[0.18em] text-brand-gold-muted uppercase">
                                        <span className="rounded-full bg-[#450D15]/15 px-2.5 py-0.5 font-semibold text-[#5E121D]">{ev.category?.name ?? 'Event'}</span>
                                        <span className="flex items-center gap-1.5 text-brand-navy/60 normal-case tracking-normal">
                                            <Calendar className="h-3.5 w-3.5 text-[#5E121D]" />
                                            {formatEventDate(ev.starts_on, ev.start_time)}
                                        </span>
                                    </div>
                                    <h3 className="mt-2.5 font-serif text-2xl font-medium text-brand-navy transition-colors group-hover:text-[#5E121D]">{ev.title}</h3>
                                    {ev.description && <p className="mt-2 line-clamp-2 max-w-2xl text-[15px] text-[#4A4F5C]">{ev.description}</p>}
                                    <p className="mt-2.5 flex items-center gap-1.5 text-[13px] text-brand-navy/65">
                                        <MapPin className="h-3.5 w-3.5 shrink-0 text-[#5E121D]" />
                                        {[ev.venue, ev.city].filter(Boolean).join(' · ')}
                                    </p>
                                </div>
                                <Link
                                    href={`/events/${ev.slug}`}
                                    className="inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-brand-navy/15 bg-white px-5 py-2.5 text-[13.5px] font-semibold text-brand-navy transition-all hover:border-[#091324] hover:bg-[#091324] hover:text-[#F7F3EA] sm:self-center"
                                >
                                    Details <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}