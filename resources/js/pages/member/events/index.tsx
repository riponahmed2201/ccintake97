import React from 'react';
import { Head, Link } from '@inertiajs/react';
import MemberLayout from '@/layouts/member-layout';
import { Calendar, MapPin, QrCode, ArrowRight, Ticket } from 'lucide-react';
import type { Event, EventRegistration } from '@/types';

interface EventsIndexProps {
    events: Event[];
    myRegistrations: EventRegistration[];
}

export default function MemberEventsIndex({ events, myRegistrations }: EventsIndexProps) {
    const registeredEventIds = new Set(myRegistrations.map((r) => r.event_id));

    return (
        <MemberLayout
            title="Reunions & Events"
            breadcrumbs={[{ title: 'Reunions & Events' }]}
        >
            <Head title="Reunions & Events - CCINTAKE97.COM" />

            <div className="w-full space-y-6">
                {/* Page Header */}
                <div>
                    <h1 className="text-[22px] font-semibold tracking-tight text-[#071437]">
                        Alumni Reunions &amp; Events
                    </h1>
                    <p className="mt-1 text-[13px] text-[#78829D]">
                        Register for upcoming batch reunions, national gatherings, and sports tournaments.
                    </p>
                </div>

                {/* My Active Event Registrations */}
                {myRegistrations.length > 0 && (
                    <div className="space-y-3.5">
                        <div className="text-[11.5px] font-semibold tracking-[0.06em] text-[#99A1B7] uppercase">
                            My Active Registrations ({myRegistrations.length})
                        </div>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            {myRegistrations.map((reg) => (
                                <div
                                    key={reg.id}
                                    className="flex flex-col justify-between rounded-xl border border-[#1B84FF]/20 bg-[#F8FBFF] p-5 shadow-[0_3px_4px_0_rgba(0,0,0,0.02)]"
                                >
                                    <div className="space-y-2.5">
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="inline-flex items-center gap-1 rounded-md bg-[#EAFFF1] px-2.5 py-0.5 text-[11px] font-semibold text-[#17C653] capitalize">
                                                <Ticket className="size-3" />
                                                {reg.status}
                                            </span>
                                            <span className="font-mono text-[11px] text-[#78829D]">
                                                Pass #{reg.qr_token ? reg.qr_token.substring(0, 10).toUpperCase() : 'PENDING'}
                                            </span>
                                        </div>

                                        <div className="text-[15px] font-semibold text-[#071437]">
                                            {reg.event?.title}
                                        </div>

                                        {reg.event?.venue && (
                                            <div className="flex items-center gap-2 text-[12.5px] text-[#78829D]">
                                                <MapPin className="size-3.5 shrink-0 text-[#99A1B7]" />
                                                <span className="truncate">{reg.event.venue}</span>
                                            </div>
                                        )}

                                        <div className="text-[12px] text-[#4B5675]">
                                            Guests: <span className="font-semibold text-[#071437]">{reg.guest_count}</span> additional
                                        </div>
                                    </div>

                                    <div className="mt-4 flex justify-end border-t border-[#E6EEF8] pt-3">
                                        <Link
                                            href={`/member/events/${reg.event?.slug}`}
                                            className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-[#1B84FF] hover:text-[#006AE6]"
                                        >
                                            <QrCode className="size-3.5" />
                                            View Pass QR
                                            <ArrowRight className="size-3.5" />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* All Upcoming Events Catalog */}
                <div className="space-y-3.5">
                    <div className="text-[11.5px] font-semibold tracking-[0.06em] text-[#99A1B7] uppercase">
                        All Upcoming Gatherings ({events.length})
                    </div>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {events.length === 0 ? (
                            <div className="col-span-full flex flex-col items-center justify-center rounded-xl border border-[#F1F1F4] bg-[#FCFCFC] px-6 py-12 text-center">
                                <div className="mb-3 flex size-11 items-center justify-center rounded-full bg-[#F1F6FF] text-[#1B84FF]">
                                    <Calendar className="size-5" />
                                </div>
                                <p className="text-[13.5px] font-semibold text-[#071437]">No upcoming events</p>
                                <p className="mt-1 max-w-md text-[12.5px] text-[#78829D]">
                                    No upcoming reunions or gatherings are scheduled right now. Check back soon.
                                </p>
                            </div>
                        ) : (
                            events.map((ev) => {
                                const isRegistered = registeredEventIds.has(ev.id);
                                return (
                                    <div
                                        key={ev.id}
                                        className="flex flex-col justify-between rounded-xl border border-[#F1F1F4] bg-white p-5 shadow-[0_3px_4px_0_rgba(0,0,0,0.03)] transition-colors hover:border-[#DBDFE9]"
                                    >
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between gap-2">
                                                <span className="inline-flex rounded-md bg-[#F1F6FF] px-2.5 py-0.5 text-[11px] font-semibold text-[#1B84FF]">
                                                    {ev.category?.name || 'Event'}
                                                </span>
                                                <span className="text-[12.5px] font-semibold text-[#071437]">
                                                    {Number(ev.registration_fee) > 0 ? `BDT ${ev.registration_fee}` : 'Free'}
                                                </span>
                                            </div>

                                            <Link
                                                href={`/member/events/${ev.slug}`}
                                                className="line-clamp-2 block text-[15px] leading-snug font-semibold text-[#071437] hover:text-[#1B84FF]"
                                            >
                                                {ev.title}
                                            </Link>

                                            <div className="space-y-1.5 text-[12.5px] text-[#78829D]">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="size-3.5 shrink-0 text-[#1B84FF]" />
                                                    <span>
                                                        {new Date(ev.starts_on).toLocaleDateString('en-US', {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            year: 'numeric',
                                                        })}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="size-3.5 shrink-0 text-[#99A1B7]" />
                                                    <span className="truncate">{ev.venue}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-5 border-t border-[#F1F1F4] pt-4">
                                            <Link
                                                href={`/member/events/${ev.slug}`}
                                                className={`flex h-9 w-full items-center justify-center gap-1.5 rounded-lg px-4 text-[12.5px] font-semibold transition-colors ${
                                                    isRegistered
                                                        ? 'border border-[#DBDFE9] bg-white text-[#071437] hover:bg-[#F9F9F9]'
                                                        : 'bg-[#1B84FF] text-white hover:bg-[#006AE6]'
                                                }`}
                                            >
                                                {isRegistered ? 'View Pass & Details' : 'Event Details & RSVP'}
                                                <ArrowRight className="size-3.5" />
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </MemberLayout>
    );
}
