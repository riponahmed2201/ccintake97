import React from 'react';
import { Head, Link } from '@inertiajs/react';
import MemberLayout from '@/layouts/member-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Users, QrCode, ArrowRight } from 'lucide-react';
import type { Event, EventRegistration } from '@/types';

interface EventsIndexProps {
    events: Event[];
    myRegistrations: EventRegistration[];
}

export default function MemberEventsIndex({ events, myRegistrations }: EventsIndexProps) {
    return (
        <MemberLayout
            title="Reunions & Alumni Events"
            breadcrumbs={[{ title: 'Reunions & Events' }]}
        >
            <Head title="Reunions & Events - INTAKE97.COM" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                        Alumni Reunions & Events
                    </h1>
                    <p className="text-xs text-slate-500 mt-1">
                        Register for upcoming batch reunions, national gatherings, and sports tournaments.
                    </p>
                </div>

                {/* My Confirmed Passes Carousel / Section (if any) */}
                {myRegistrations.length > 0 && (
                    <div className="space-y-3">
                        <h2 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                            My Active Event Registrations ({myRegistrations.length})
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {myRegistrations.map((reg) => (
                                <Card key={reg.id} className="p-4 border-indigo-200 dark:border-indigo-900 bg-indigo-50/30 dark:bg-slate-900 flex flex-col justify-between">
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Badge className="bg-emerald-100 text-emerald-800 text-[10px] capitalize">
                                                {reg.status}
                                            </Badge>
                                            <span className="font-mono text-[10px] text-slate-400">
                                                Pass #{reg.qr_token.substring(0, 10)}
                                            </span>
                                        </div>
                                        <div className="font-bold text-sm text-slate-900 dark:text-white">
                                            {reg.event?.title}
                                        </div>
                                        <div className="text-xs text-slate-500 flex items-center gap-2">
                                            <MapPin className="size-3.5 text-slate-400" />
                                            <span>{reg.event?.venue}</span>
                                        </div>
                                        <div className="text-[11px] text-slate-600">
                                            Registered with: <strong>{reg.guest_count} additional guests</strong>
                                        </div>
                                    </div>
                                    <div className="pt-3 mt-3 border-t flex justify-end">
                                        <Link
                                            href={`/member/events/${reg.event?.slug}`}
                                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:underline"
                                        >
                                            <QrCode className="size-3.5" /> View Pass QR <ArrowRight className="size-3" />
                                        </Link>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {/* All Upcoming Events Catalog */}
                <div className="space-y-3 pt-2">
                    <h2 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                        All Upcoming Association Gatherings
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {events.length === 0 ? (
                            <Card className="col-span-full p-12 text-center text-xs text-slate-400">
                                No upcoming events scheduled at this moment.
                            </Card>
                        ) : (
                            events.map((ev) => (
                                <Card key={ev.id} className="p-5 flex flex-col justify-between hover:border-indigo-300 transition-all">
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <Badge variant="outline" className="text-[10px]">
                                                {ev.category?.name}
                                            </Badge>
                                            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                                {Number(ev.registration_fee) > 0 ? `BDT ${ev.registration_fee}` : 'Free'}
                                            </span>
                                        </div>

                                        <div className="font-bold text-sm text-slate-900 dark:text-white line-clamp-2">
                                            {ev.title}
                                        </div>

                                        <div className="space-y-1.5 text-xs text-slate-500">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="size-3.5 text-purple-600 shrink-0" />
                                                <span>{new Date(ev.starts_on).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <MapPin className="size-3.5 text-slate-400 shrink-0" />
                                                <span className="truncate">{ev.venue}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-4 mt-4 border-t flex items-center justify-between">
                                        <Link
                                            href={`/member/events/${ev.slug}`}
                                            className="w-full text-center px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors"
                                        >
                                            Event Details & RSVP
                                        </Link>
                                    </div>
                                </Card>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </MemberLayout>
    );
}
