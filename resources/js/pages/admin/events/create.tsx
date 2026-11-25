import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';
import type { EventCategory } from '@/types';

interface EventCreateProps {
    categories: EventCategory[];
}

const fieldClass =
    'h-10 w-full rounded-md border !border-[#DBDFE9] !bg-[#FCFCFC] px-3 text-[13px] font-normal !text-[#071437] !shadow-none outline-none transition-all duration-200 placeholder:!text-[#99A1B7] hover:!border-[#C4CADA] focus:!border-[#1B84FF] focus:!bg-white focus:!ring-[3px] focus:!ring-[#1B84FF]/10 dark:!bg-[#FCFCFC] dark:!text-[#071437]';

const textareaClass =
    'w-full rounded-md border !border-[#DBDFE9] !bg-[#FCFCFC] p-3 text-[13px] font-normal !text-[#071437] !shadow-none outline-none transition-all duration-200 placeholder:!text-[#99A1B7] hover:!border-[#C4CADA] focus:!border-[#1B84FF] focus:!bg-white focus:!ring-[3px] focus:!ring-[#1B84FF]/10 dark:!bg-[#FCFCFC] dark:!text-[#071437]';

const selectTriggerClass =
    '!h-10 w-full cursor-pointer rounded-md !border-[#DBDFE9] !bg-[#FCFCFC] px-3 text-[13px] font-normal !text-[#071437] !shadow-none transition-all duration-200 hover:!border-[#C4CADA] hover:!bg-[#FCFCFC] focus-visible:!border-[#1B84FF] focus-visible:!bg-white focus-visible:!ring-[3px] focus-visible:!ring-[#1B84FF]/10 dark:!bg-[#FCFCFC] dark:hover:!bg-[#FCFCFC]';

const selectMenuClass =
    'z-[60] rounded-xl !border-[#F1F1F4] !bg-white p-1 !text-[#071437] shadow-[0_12px_32px_-8px_rgba(7,20,55,0.16)] dark:!bg-white dark:!text-[#071437]';

const selectItemClass =
    'cursor-pointer rounded-lg py-2 pr-8 pl-2.5 text-[13px] text-[#071437] focus:!bg-[#F1F6FF] focus:!text-[#1B84FF] dark:text-[#071437]';

const labelClass = 'mb-1.5 block text-[12.5px] font-semibold text-[#071437]';

export default function EventCreate({ categories }: EventCreateProps) {
    const [title, setTitle] = useState('');
    const [categoryId, setCategoryId] = useState(categories[0]?.id ? String(categories[0].id) : '');
    const [venue, setVenue] = useState('');
    const [address, setAddress] = useState('');
    const [googleMapsLink, setGoogleMapsLink] = useState('');
    const [startsOn, setStartsOn] = useState('');
    const [endsOn, setEndsOn] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [capacity, setCapacity] = useState('');
    const [allowsGuests, setAllowsGuests] = useState(true);
    const [maxGuests, setMaxGuests] = useState('2');
    const [registrationClosesAt, setRegistrationClosesAt] = useState('');
    const [registrationFee, setRegistrationFee] = useState('0');
    const [visibility, setVisibility] = useState('members');
    const [description, setDescription] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/admin/events', {
            title,
            category_id: parseInt(categoryId),
            venue,
            address,
            google_maps_link: googleMapsLink,
            starts_on: startsOn,
            ends_on: endsOn || null,
            start_time: startTime || null,
            end_time: endTime || null,
            capacity: capacity ? parseInt(capacity) : null,
            allows_guests: allowsGuests,
            max_guests_per_registration: parseInt(maxGuests),
            registration_closes_at: registrationClosesAt || null,
            registration_fee: parseFloat(registrationFee) || 0,
            visibility,
            description,
        });
    };

    return (
        <AdminLayout
            title="Create Event"
            breadcrumbs={[
                { title: 'Events', href: '/admin/events' },
                { title: 'Create Event' },
            ]}
        >
            <Head title="Create New Event - INTAKE 97 Admin" />

            <div className="mx-auto max-w-4xl space-y-5">
                <Link
                    href="/admin/events"
                    className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#78829D] transition-colors hover:text-[#071437]"
                >
                    <ArrowLeft className="size-4" />
                    Back to Events
                </Link>

                <div className="overflow-hidden rounded-xl border border-[#F1F1F4] bg-white shadow-[0_3px_4px_0_rgba(0,0,0,0.03)]">
                    <div className="border-b border-[#F1F1F4] px-6 py-4">
                        <h2 className="text-[16px] font-bold text-[#071437]">
                            Create Alumni Event / Reunion
                        </h2>
                        <p className="mt-0.5 text-[12.5px] text-[#78829D]">
                            Configure schedule, venue, capacity, and registration rules for the event.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5 p-6">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="sm:col-span-2">
                                <label className={labelClass}>Event Title *</label>
                                <input
                                    required
                                    className={fieldClass}
                                    placeholder="e.g. INTAKE 97 Grand Silver Jubilee Reunion"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className={labelClass}>Category *</label>
                                <Select value={categoryId} onValueChange={setCategoryId}>
                                    <SelectTrigger className={selectTriggerClass}>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent className={selectMenuClass}>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat.id} value={String(cat.id)} className={selectItemClass}>
                                                {cat.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <label className={labelClass}>Visibility Audience *</label>
                                <Select value={visibility} onValueChange={setVisibility}>
                                    <SelectTrigger className={selectTriggerClass}>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className={selectMenuClass}>
                                        <SelectItem value="members" className={selectItemClass}>
                                            All Registered Members
                                        </SelectItem>
                                        <SelectItem value="verified_members" className={selectItemClass}>
                                            Verified Members Only
                                        </SelectItem>
                                        <SelectItem value="public" className={selectItemClass}>
                                            Public (Open for Everyone)
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <label className={labelClass}>Venue / Hall *</label>
                                <input
                                    required
                                    className={fieldClass}
                                    placeholder="e.g. Army Golf Club, Dhaka"
                                    value={venue}
                                    onChange={(e) => setVenue(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className={labelClass}>Venue Address</label>
                                <input
                                    className={fieldClass}
                                    placeholder="e.g. Airport Road, Dhaka"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className={labelClass}>Google Maps Link</label>
                                <input
                                    className={fieldClass}
                                    placeholder="https://maps.google.com/..."
                                    value={googleMapsLink}
                                    onChange={(e) => setGoogleMapsLink(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className={labelClass}>Registration Closes At</label>
                                <input
                                    type="date"
                                    className={fieldClass}
                                    value={registrationClosesAt}
                                    onChange={(e) => setRegistrationClosesAt(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className={labelClass}>Event Start Date *</label>
                                <input
                                    required
                                    type="date"
                                    className={fieldClass}
                                    value={startsOn}
                                    onChange={(e) => setStartsOn(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className={labelClass}>Event End Date</label>
                                <input
                                    type="date"
                                    className={fieldClass}
                                    value={endsOn}
                                    onChange={(e) => setEndsOn(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className={labelClass}>Start Time</label>
                                <input
                                    type="time"
                                    className={fieldClass}
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className={labelClass}>End Time</label>
                                <input
                                    type="time"
                                    className={fieldClass}
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className={labelClass}>Maximum Capacity (Seats)</label>
                                <input
                                    type="number"
                                    className={fieldClass}
                                    placeholder="Leave blank for unlimited"
                                    value={capacity}
                                    onChange={(e) => setCapacity(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className={labelClass}>Registration Fee (BDT)</label>
                                <input
                                    type="number"
                                    className={fieldClass}
                                    placeholder="0 for free"
                                    value={registrationFee}
                                    onChange={(e) => setRegistrationFee(e.target.value)}
                                />
                            </div>

                            <div className="flex flex-wrap items-center gap-4 pt-2 sm:col-span-2">
                                <label className="flex cursor-pointer items-center gap-2 text-[13px] font-medium text-[#071437]">
                                    <input
                                        type="checkbox"
                                        checked={allowsGuests}
                                        onChange={(e) => setAllowsGuests(e.target.checked)}
                                        className="size-4 rounded border-[#DBDFE9] text-[#1B84FF] focus:ring-[#1B84FF]"
                                    />
                                    Allow members to register additional guests (spouse, children)
                                </label>

                                {allowsGuests && (
                                    <div className="flex items-center gap-2 text-[13px] text-[#4B5675]">
                                        <span>Max guests:</span>
                                        <input
                                            type="number"
                                            className={`${fieldClass} w-20`}
                                            value={maxGuests}
                                            onChange={(e) => setMaxGuests(e.target.value)}
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="sm:col-span-2">
                                <label className={labelClass}>Event Description & Program Schedule</label>
                                <textarea
                                    rows={5}
                                    className={textareaClass}
                                    placeholder="Full details regarding reunion agenda, dress code, catering, accommodation..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 border-t border-[#F1F1F4] pt-5">
                            <Link
                                href="/admin/events"
                                className="inline-flex h-10 items-center rounded-lg border border-[#DBDFE9] bg-white px-4 text-[13px] font-semibold text-[#4B5675] transition-colors hover:bg-[#FCFCFC]"
                            >
                                Cancel
                            </Link>
                            <Button
                                type="submit"
                                className="h-10 rounded-lg bg-[#1B84FF] px-5 text-[13px] font-semibold text-white hover:bg-[#1B84FF]/90"
                            >
                                Save Event Draft
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
