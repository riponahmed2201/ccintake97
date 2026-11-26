import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import MemberLayout from '@/layouts/member-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Calendar,
    MapPin,
    ArrowLeft,
    QrCode,
    CheckCircle2,
    Users,
    FileText,
} from 'lucide-react';
import type { Event, EventRegistration } from '@/types';

interface EventShowProps {
    event: Event;
    myRegistration: EventRegistration | null;
}

const fieldClass =
    'h-10 w-full rounded-md border !border-[#DBDFE9] !bg-[#FCFCFC] px-3 text-[13px] font-normal !text-[#071437] !shadow-none outline-none transition-all duration-200 placeholder:!text-[#99A1B7] hover:!border-[#C4CADA] focus:!border-[#1B84FF] focus:!bg-white focus:!ring-[3px] focus:!ring-[#1B84FF]/10 dark:!bg-[#FCFCFC] dark:!text-[#071437]';

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
        router.post(
            `/member/events/${event.id}/register`,
            {
                guest_count: guestCount,
                special_requirements: specialReq,
                guests,
            },
            { preserveScroll: true }
        );
    };

    const handleCancelRegistration = () => {
        if (!myRegistration) return;
        if (confirm('Are you sure you want to cancel your event registration?')) {
            router.delete(`/member/events/${myRegistration.id}/cancel`, { preserveScroll: true });
        }
    };

    return (
        <MemberLayout
            title={event.title}
            breadcrumbs={[
                { title: 'Reunions & Events', href: '/member/events' },
                { title: event.title },
            ]}
        >
            <Head title={`${event.title} - CCINTAKE 97 Alumni Event`} />

            <div className="w-full space-y-6">
                <div>
                    <Link
                        href="/member/events"
                        className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-[#78829D] transition-colors hover:text-[#1B84FF]"
                    >
                        <ArrowLeft className="size-4" />
                        Back to Events
                    </Link>
                </div>

                {/* Event Header Card */}
                <div className="rounded-xl border border-[#F1F1F4] bg-white p-5 shadow-[0_3px_4px_0_rgba(0,0,0,0.03)] sm:p-6">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex rounded-md bg-[#F1F6FF] px-2.5 py-0.5 text-[11px] font-semibold text-[#1B84FF]">
                            {event.category?.name || 'Event'}
                        </span>
                        <span className="inline-flex rounded-md bg-[#EAFFF1] px-2.5 py-0.5 text-[11px] font-semibold text-[#17C653] capitalize">
                            {event.status}
                        </span>
                        <span className="inline-flex rounded-md border border-[#F1F1F4] bg-[#FCFCFC] px-2.5 py-0.5 text-[11px] font-semibold text-[#071437]">
                            {Number(event.registration_fee) > 0 ? `Fee: BDT ${event.registration_fee}` : 'Complimentary Event'}
                        </span>
                    </div>

                    <h1 className="mt-3 text-[22px] font-semibold tracking-tight text-[#071437]">
                        {event.title}
                    </h1>

                    <div className="mt-4 flex flex-wrap gap-x-8 gap-y-2.5 text-[13px] text-[#4B5675]">
                        <div className="flex items-center gap-2">
                            <Calendar className="size-4 shrink-0 text-[#1B84FF]" />
                            <span>
                                {new Date(event.starts_on).toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric',
                                })}
                                {event.start_time ? ` at ${event.start_time}` : ''}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin className="size-4 shrink-0 text-[#99A1B7]" />
                            <span>
                                {event.venue}
                                {event.address ? ` (${event.address})` : ''}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                    {/* Left: Registration Pass or RSVP Form */}
                    <div className={event.description ? 'lg:col-span-7' : 'lg:col-span-12'}>
                        {myRegistration ? (
                            <div className="overflow-hidden rounded-xl border border-[#17C653]/30 bg-white shadow-[0_3px_4px_0_rgba(0,0,0,0.03)]">
                                <div className="flex items-center justify-between border-b border-[#EAFFF1] bg-[#F4FFF8] px-5 py-4 sm:px-6">
                                    <div className="flex items-center gap-2 text-[14.5px] font-semibold text-[#071437]">
                                        <CheckCircle2 className="size-4.5 text-[#17C653]" />
                                        Confirmed Attendance Pass
                                    </div>
                                    <span className="rounded-md bg-[#17C653] px-2.5 py-0.5 font-mono text-[10.5px] font-semibold text-white">
                                        CONFIRMED
                                    </span>
                                </div>

                                <div className="p-5 sm:p-6">
                                    <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
                                        <div className="space-y-2 text-[13px]">
                                            <div className="text-[11.5px] font-medium text-[#99A1B7]">
                                                Pass Token Reference
                                            </div>
                                            <div className="font-mono text-[15px] font-bold text-[#071437]">
                                                {myRegistration.qr_token}
                                            </div>
                                            <div className="pt-1 text-[#4B5675]">
                                                Registered Guests:{' '}
                                                <strong className="text-[#071437]">
                                                    {myRegistration.guest_count} additional guest(s)
                                                </strong>
                                            </div>
                                            {myRegistration.guests && myRegistration.guests.length > 0 && (
                                                <div className="text-[12px] text-[#78829D]">
                                                    Guest Names: {myRegistration.guests.map((g) => g.name).join(', ')}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex flex-col items-center rounded-xl border border-[#F1F1F4] bg-[#FCFCFC] p-3.5 text-[#071437]">
                                            <QrCode className="size-24 text-[#071437]" strokeWidth={1.5} />
                                            <span className="mt-1.5 font-mono text-[10px] font-semibold tracking-wider text-[#78829D]">
                                                GATE CHECK-IN
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mt-6 flex justify-end border-t border-[#F1F1F4] pt-4">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={handleCancelRegistration}
                                            className="h-9 rounded-lg border-[#DBDFE9] !bg-white px-3.5 text-[12.5px] font-semibold text-[#F8285A] hover:!bg-[#FFEEF3]"
                                        >
                                            Cancel Registration
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="rounded-xl border border-[#F1F1F4] bg-white p-5 shadow-[0_3px_4px_0_rgba(0,0,0,0.03)] sm:p-6">
                                <div className="flex items-center gap-2 border-b border-[#F1F1F4] pb-4 text-[15px] font-semibold text-[#071437]">
                                    <Users className="size-4 text-[#1B84FF]" />
                                    RSVP &amp; Register for Event
                                </div>

                                <form onSubmit={handleRegisterSubmit} className="mt-5 space-y-4">
                                    {event.allows_guests && (
                                        <div className="space-y-4">
                                            <div>
                                                <label className="mb-1.5 block text-[12.5px] font-semibold text-[#071437]">
                                                    Additional Guests (Spouse / Children)
                                                </label>
                                                <select
                                                    value={guestCount}
                                                    onChange={(e) => handleGuestCountChange(parseInt(e.target.value))}
                                                    className={`${fieldClass} sm:w-56`}
                                                >
                                                    <option value={0}>Just Myself (0 Guests)</option>
                                                    {Array.from({ length: event.max_guests_per_registration || 2 }, (_, i) => (
                                                        <option key={i + 1} value={i + 1}>
                                                            +{i + 1} Guest{i > 0 ? 's' : ''}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            {guests.map((g, idx) => (
                                                <div
                                                    key={idx}
                                                    className="grid grid-cols-1 gap-3 rounded-xl border border-[#F1F1F4] bg-[#FCFCFC] p-4 sm:grid-cols-3"
                                                >
                                                    <div>
                                                        <label className="mb-1.5 block text-[12px] font-semibold text-[#071437]">
                                                            Guest {idx + 1} Full Name <span className="text-[#F8285A]">*</span>
                                                        </label>
                                                        <Input
                                                            required
                                                            placeholder="Guest full name"
                                                            value={g.name}
                                                            onChange={(e) => handleGuestFieldChange(idx, 'name', e.target.value)}
                                                            className={fieldClass}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="mb-1.5 block text-[12px] font-semibold text-[#071437]">
                                                            Relationship
                                                        </label>
                                                        <select
                                                            value={g.relationship}
                                                            onChange={(e) => handleGuestFieldChange(idx, 'relationship', e.target.value)}
                                                            className={fieldClass}
                                                        >
                                                            <option value="spouse">Spouse</option>
                                                            <option value="child">Child</option>
                                                            <option value="other">Other</option>
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="mb-1.5 block text-[12px] font-semibold text-[#071437]">
                                                            Age Group
                                                        </label>
                                                        <select
                                                            value={g.age_group}
                                                            onChange={(e) => handleGuestFieldChange(idx, 'age_group', e.target.value)}
                                                            className={fieldClass}
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
                                        <label className="mb-1.5 block text-[12.5px] font-semibold text-[#071437]">
                                            Dietary / Special Requirements
                                            <span className="ml-1.5 font-normal text-[#99A1B7]">(Optional)</span>
                                        </label>
                                        <textarea
                                            rows={3}
                                            placeholder="Any dietary restrictions, medical conditions, or accessibility assistance..."
                                            value={specialReq}
                                            onChange={(e) => setSpecialReq(e.target.value)}
                                            className={`${fieldClass} h-auto py-2.5`}
                                        />
                                    </div>

                                    <div className="flex justify-end pt-2">
                                        <Button
                                            type="submit"
                                            className="h-10 rounded-lg bg-[#1B84FF] px-5 text-[13px] font-semibold text-white hover:bg-[#006AE6]"
                                        >
                                            Confirm My Registration
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>

                    {/* Right: Event Program & Details */}
                    {event.description && (
                        <div className="lg:col-span-5">
                            <div className="rounded-xl border border-[#F1F1F4] bg-white p-5 shadow-[0_3px_4px_0_rgba(0,0,0,0.03)] sm:p-6">
                                <div className="flex items-center gap-2 border-b border-[#F1F1F4] pb-4 text-[15px] font-semibold text-[#071437]">
                                    <FileText className="size-4 text-[#1B84FF]" />
                                    Event Program &amp; Details
                                </div>
                                <div className="mt-4 text-[13px] leading-relaxed whitespace-pre-wrap text-[#4B5675]">
                                    {event.description}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </MemberLayout>
    );
}
