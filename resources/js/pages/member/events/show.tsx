import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import MemberLayout from '@/layouts/member-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Calendar,
    MapPin,
    ArrowLeft,
    QrCode,
    CheckCircle2,
    Users,
    Clock,
    AlertCircle,
} from 'lucide-react';
import type { Event, EventRegistration } from '@/types';

interface EventShowProps {
    event: Event;
    myRegistration: EventRegistration | null;
}

export default function MemberEventShow({ event, myRegistration }: EventShowProps) {
    const [guestCount, setGuestCount] = useState(0);
    const [specialReq, setSpecialReq] = useState('');
    const [guests, setGuests] = useState<{ name: string; relationship: string; age_group: string }[]>([]);

    const handleGuestCountChange = (count: number) => {
        setGuestCount(count);
        const newGuests = Array.from({ length: count }, (_, i) => ({
            name: guests[i]?.name || '',
            relationship: guests[i]?.relationship || 'spouse',
            age_group: guests[i]?.age_group || 'adult',
        }));
        setGuests(newGuests);
    };

    const handleGuestFieldChange = (index: number, field: string, val: string) => {
        const copy = [...guests];
        copy[index] = { ...copy[index], [field]: val };
        setGuests(copy);
    };

    const handleRegisterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(`/member/events/${event.id}/register`, {
            guest_count: guestCount,
            special_requirements: specialReq,
            guests,
        });
    };

    const handleCancelRegistration = () => {
        if (!myRegistration) return;
        if (confirm('Are you sure you want to cancel your event registration?')) {
            router.delete(`/member/events/${myRegistration.id}/cancel`);
        }
    };

    return (
        <MemberLayout
            title={event.title}
            breadcrumbs={[
                { title: 'Events', href: '/member/events' },
                { title: event.title },
            ]}
        >
            <Head title={`${event.title} - INTAKE 97 Alumni Event`} />

            <div className="max-w-4xl mx-auto space-y-6">
                <Link
                    href="/member/events"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900"
                >
                    <ArrowLeft className="size-4" />
                    Back to Events
                </Link>

                {/* Event Hero */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border space-y-4">
                    <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline" className="text-xs font-semibold text-indigo-600">
                            {event.category?.name}
                        </Badge>
                        <Badge className="bg-emerald-100 text-emerald-800 text-xs capitalize">
                            {event.status}
                        </Badge>
                        {Number(event.registration_fee) > 0 ? (
                            <Badge variant="outline" className="text-xs font-bold">
                                Registration Fee: BDT {event.registration_fee}
                            </Badge>
                        ) : (
                            <Badge variant="outline" className="text-xs font-bold text-emerald-600">
                                Complimentary Event
                            </Badge>
                        )}
                    </div>

                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                        {event.title}
                    </h1>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600 dark:text-slate-400">
                        <div className="flex items-center gap-2">
                            <Calendar className="size-4 text-purple-600 shrink-0" />
                            <span>
                                {new Date(event.starts_on).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                                {event.start_time && ` at ${event.start_time}`}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin className="size-4 text-slate-400 shrink-0" />
                            <span>{event.venue} {event.address ? `(${event.address})` : ''}</span>
                        </div>
                    </div>
                </div>

                {/* Registration Status or Form */}
                {myRegistration ? (
                    <Card className="border-emerald-300 dark:border-emerald-900 bg-emerald-50/20 dark:bg-slate-900 overflow-hidden">
                        <CardHeader className="bg-emerald-100/60 dark:bg-emerald-950/40 p-4 border-b">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-2">
                                    <CheckCircle2 className="size-4.5 text-emerald-600" />
                                    Confirmed Attendance Pass
                                </CardTitle>
                                <Badge className="bg-emerald-600 text-white font-mono text-[10px]">
                                    CONFIRMED
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                                <div className="space-y-2 text-xs">
                                    <div className="text-slate-500 text-[11px]">Pass Token Reference:</div>
                                    <div className="font-mono text-sm font-bold text-slate-900 dark:text-white">
                                        {myRegistration.qr_token}
                                    </div>
                                    <div className="text-slate-700 dark:text-slate-300 pt-1">
                                        Registered Guests: <strong>{myRegistration.guest_count} additional guest(s)</strong>
                                    </div>
                                    {myRegistration.guests && myRegistration.guests.length > 0 && (
                                        <div className="text-[11px] text-slate-500">
                                            Guest Names: {myRegistration.guests.map(g => g.name).join(', ')}
                                        </div>
                                    )}
                                </div>

                                {/* QR Visualization */}
                                <div className="p-3 bg-white text-slate-900 rounded-2xl shadow-sm border flex flex-col items-center">
                                    <QrCode className="size-24" />
                                    <span className="text-[9px] font-mono mt-1 text-slate-500">GATE CHECK-IN</span>
                                </div>
                            </div>

                            <div className="pt-4 mt-4 border-t flex justify-end">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleCancelRegistration}
                                    className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                                >
                                    Cancel Registration
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                <Users className="size-4 text-indigo-600" />
                                RSVP & Register for Event
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
                                {event.allows_guests && (
                                    <div className="space-y-3">
                                        <div>
                                            <label className="font-semibold block mb-1">
                                                Additional Guests (Spouse / Children)
                                            </label>
                                            <select
                                                value={guestCount}
                                                onChange={(e) => handleGuestCountChange(parseInt(e.target.value))}
                                                className="w-full sm:w-48 text-xs rounded-md border p-2 bg-white dark:bg-slate-900"
                                            >
                                                <option value={0}>Just Myself (0 Guests)</option>
                                                {Array.from({ length: event.max_guests_per_registration || 2 }, (_, i) => (
                                                    <option key={i + 1} value={i + 1}>+{i + 1} Guest{i > 0 ? 's' : ''}</option>
                                                ))}
                                            </select>
                                        </div>

                                        {guests.map((g, idx) => (
                                            <div key={idx} className="p-3 rounded-lg border bg-slate-50/50 dark:bg-slate-800/20 grid grid-cols-1 sm:grid-cols-3 gap-3">
                                                <div>
                                                    <label className="font-semibold block mb-1">Guest {idx + 1} Full Name *</label>
                                                    <Input
                                                        required
                                                        placeholder="Guest full name"
                                                        value={g.name}
                                                        onChange={(e) => handleGuestFieldChange(idx, 'name', e.target.value)}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="font-semibold block mb-1">Relationship</label>
                                                    <select
                                                        value={g.relationship}
                                                        onChange={(e) => handleGuestFieldChange(idx, 'relationship', e.target.value)}
                                                        className="w-full text-xs rounded-md border p-2 bg-white dark:bg-slate-900"
                                                    >
                                                        <option value="spouse">Spouse</option>
                                                        <option value="child">Child</option>
                                                        <option value="other">Other</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="font-semibold block mb-1">Age Group</label>
                                                    <select
                                                        value={g.age_group}
                                                        onChange={(e) => handleGuestFieldChange(idx, 'age_group', e.target.value)}
                                                        className="w-full text-xs rounded-md border p-2 bg-white dark:bg-slate-900"
                                                    >
                                                        <option value="adult">Adult</option>
                                                        <option value="child">Child</option>
                                                    </select>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div>
                                    <label className="font-semibold block mb-1">Dietary / Special Requirements</label>
                                    <textarea
                                        rows={2}
                                        placeholder="Any dietary restrictions, medical conditions or accessibility assistance..."
                                        value={specialReq}
                                        onChange={(e) => setSpecialReq(e.target.value)}
                                        className="w-full text-xs rounded-md border p-2.5 bg-white dark:bg-slate-900"
                                    />
                                </div>

                                <div className="flex justify-end pt-2">
                                    <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-xs font-semibold">
                                        Confirm My Registration
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {/* Event Description */}
                {event.description && (
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-semibold">Event Program & Details</CardTitle>
                        </CardHeader>
                        <CardContent className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                            {event.description}
                        </CardContent>
                    </Card>
                )}
            </div>
        </MemberLayout>
    );
}
