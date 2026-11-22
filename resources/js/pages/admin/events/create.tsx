import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft } from 'lucide-react';
import type { EventCategory } from '@/types';

interface EventCreateProps {
    categories: EventCategory[];
}

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

            <div className="max-w-4xl mx-auto space-y-6">
                <Link
                    href="/admin/events"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900"
                >
                    <ArrowLeft className="size-4" />
                    Back to Events
                </Link>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base font-bold">Create Alumni Event / Reunion</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="sm:col-span-2">
                                    <label className="font-semibold block mb-1">Event Title *</label>
                                    <Input
                                        required
                                        placeholder="e.g. INTAKE 97 Grand Silver Jubilee Reunion"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="font-semibold block mb-1">Category *</label>
                                    <select
                                        value={categoryId}
                                        onChange={(e) => setCategoryId(e.target.value)}
                                        className="w-full text-xs rounded-md border p-2 bg-white dark:bg-slate-900"
                                    >
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="font-semibold block mb-1">Visibility Audience *</label>
                                    <select
                                        value={visibility}
                                        onChange={(e) => setVisibility(e.target.value)}
                                        className="w-full text-xs rounded-md border p-2 bg-white dark:bg-slate-900"
                                    >
                                        <option value="members">All Registered Members</option>
                                        <option value="verified_members">Verified Members Only</option>
                                        <option value="public">Public (Open for Everyone)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="font-semibold block mb-1">Venue / Hall *</label>
                                    <Input
                                        required
                                        placeholder="e.g. Army Golf Club, Dhaka"
                                        value={venue}
                                        onChange={(e) => setVenue(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="font-semibold block mb-1">Venue Address</label>
                                    <Input
                                        placeholder="e.g. Airport Road, Dhaka"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="font-semibold block mb-1">Event Start Date *</label>
                                    <Input
                                        required
                                        type="date"
                                        value={startsOn}
                                        onChange={(e) => setStartsOn(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="font-semibold block mb-1">Event End Date</label>
                                    <Input
                                        type="date"
                                        value={endsOn}
                                        onChange={(e) => setEndsOn(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="font-semibold block mb-1">Start Time</label>
                                    <Input
                                        type="time"
                                        value={startTime}
                                        onChange={(e) => setStartTime(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="font-semibold block mb-1">End Time</label>
                                    <Input
                                        type="time"
                                        value={endTime}
                                        onChange={(e) => setEndTime(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="font-semibold block mb-1">Maximum Capacity (Seats)</label>
                                    <Input
                                        type="number"
                                        placeholder="Leave blank for unlimited"
                                        value={capacity}
                                        onChange={(e) => setCapacity(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="font-semibold block mb-1">Registration Fee (BDT)</label>
                                    <Input
                                        type="number"
                                        placeholder="0 for free"
                                        value={registrationFee}
                                        onChange={(e) => setRegistrationFee(e.target.value)}
                                    />
                                </div>

                                <div className="flex items-center gap-4 sm:col-span-2 pt-2">
                                    <label className="flex items-center gap-2 cursor-pointer font-medium">
                                        <input
                                            type="checkbox"
                                            checked={allowsGuests}
                                            onChange={(e) => setAllowsGuests(e.target.checked)}
                                            className="rounded text-emerald-600"
                                        />
                                        Allow members to register additional guests (spouse, children)
                                    </label>

                                    {allowsGuests && (
                                        <div className="flex items-center gap-2">
                                            <span>Max guests:</span>
                                            <Input
                                                type="number"
                                                className="w-16"
                                                value={maxGuests}
                                                onChange={(e) => setMaxGuests(e.target.value)}
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="font-semibold block mb-1">Event Description & Program Schedule</label>
                                    <textarea
                                        rows={5}
                                        className="w-full text-xs rounded-md border p-3 bg-white dark:bg-slate-900"
                                        placeholder="Full details regarding reunion agenda, dress code, catering, accommodation..."
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-4 border-t">
                                <Link
                                    href="/admin/events"
                                    className="px-4 py-2 rounded-lg border text-xs font-semibold hover:bg-slate-50"
                                >
                                    Cancel
                                </Link>
                                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-xs font-semibold">
                                    Save Event Draft
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
