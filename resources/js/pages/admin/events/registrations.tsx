import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { ArrowLeft, Calendar, CheckCircle2, MapPin, QrCode, Users } from 'lucide-react';
import type { Event, EventRegistration } from '@/types';

interface RegistrationsProps {
    event: Event;
    registrations: {
        data: EventRegistration[];
        current_page: number;
        last_page: number;
        total: number;
    };
}

const fieldClass =
    'h-10 w-full rounded-md border !border-[#DBDFE9] !bg-white px-3 text-[13px] font-normal !text-[#071437] !shadow-none outline-none transition-all duration-200 placeholder:!text-[#99A1B7] hover:!border-[#C4CADA] focus:!border-[#1B84FF] focus:!ring-[3px] focus:!ring-[#1B84FF]/10 dark:!bg-white dark:!text-[#071437]';

export default function EventRegistrations({ event, registrations }: RegistrationsProps) {
    const [qrCodeInput, setQrCodeInput] = useState('');
    const [checkinMessage, setCheckinMessage] = useState<{ text: string; error?: boolean } | null>(null);

    const handleCheckinSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!qrCodeInput.trim()) return;

        try {
            const res = await fetch('/admin/events/checkin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as any)?.content || '',
                },
                body: JSON.stringify({ qr_token: qrCodeInput.trim() }),
            });
            const data = await res.json();
            if (data.success) {
                setCheckinMessage({ text: data.message });
                setQrCodeInput('');
                router.reload({ only: ['registrations'] });
            } else {
                setCheckinMessage({ text: data.message || 'Check-in failed.', error: true });
            }
        } catch {
            setCheckinMessage({ text: 'Error executing check-in.', error: true });
        }
    };

    return (
        <AdminLayout
            title={`Event Registrations - ${event.title}`}
            breadcrumbs={[
                { title: 'Events', href: '/admin/events' },
                { title: 'Attendees & Check-in' },
            ]}
        >
            <Head title={`Attendees: ${event.title} - CCINTAKE 97 Admin`} />

            <div className="space-y-6">
                <Link
                    href="/admin/events"
                    className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#78829D] transition-colors hover:text-[#071437]"
                >
                    <ArrowLeft className="size-4" />
                    Back to Events
                </Link>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <div className="rounded-xl border border-[#F1F1F4] bg-white p-6 shadow-[0_3px_4px_0_rgba(0,0,0,0.03)] md:col-span-2">
                        <h1 className="text-[18px] font-bold text-[#071437]">{event.title}</h1>
                        <div className="mt-3 flex flex-wrap gap-4 text-[13px] text-[#4B5675]">
                            <span className="inline-flex items-center gap-1.5">
                                <MapPin className="size-4 text-[#78829D]" />
                                <strong className="font-semibold text-[#071437]">{event.venue}</strong>
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                                <Calendar className="size-4 text-[#78829D]" />
                                <strong className="font-semibold text-[#071437]">
                                    {new Date(event.starts_on).toLocaleDateString()}
                                </strong>
                                · Start Time: {event.start_time || 'TBA'}
                            </span>
                        </div>
                        <div className="mt-5 flex flex-wrap items-center gap-3">
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[12px] font-semibold text-emerald-700">
                                <Users className="size-3.5" />
                                Total Registered: {registrations.total}
                            </span>
                            {event.capacity && (
                                <span className="inline-flex items-center rounded-full border border-[#E5E7EB] bg-[#FCFCFC] px-3 py-1 text-[12px] font-semibold text-[#4B5675]">
                                    Capacity: {event.capacity} seats
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="rounded-xl border border-[#DCEBFF] bg-[#F6FAFF] p-5 shadow-[0_3px_4px_0_rgba(0,0,0,0.03)]">
                        <div className="mb-3 flex items-center gap-2 text-[13px] font-bold text-[#1B84FF]">
                            <QrCode className="size-4" />
                            Live QR Check-in Terminal
                        </div>
                        <form onSubmit={handleCheckinSubmit} className="space-y-3">
                            <input
                                placeholder="Scan or paste QR Token..."
                                value={qrCodeInput}
                                onChange={(e) => setQrCodeInput(e.target.value)}
                                className={fieldClass}
                                autoFocus
                            />
                            <Button
                                type="submit"
                                className="h-10 w-full rounded-lg bg-[#1B84FF] text-[13px] font-semibold text-white hover:bg-[#1B84FF]/90"
                            >
                                Validate & Check In
                            </Button>
                            {checkinMessage && (
                                <div
                                    className={`rounded-lg border px-3 py-2.5 text-[12.5px] font-medium ${
                                        checkinMessage.error
                                            ? 'border-rose-200 bg-rose-50 text-rose-700'
                                            : 'border-emerald-200 bg-emerald-50 text-emerald-700'
                                    }`}
                                >
                                    {checkinMessage.text}
                                </div>
                            )}
                        </form>
                    </div>
                </div>

                <div className="overflow-hidden rounded-xl border border-[#F1F1F4] bg-white shadow-[0_3px_4px_0_rgba(0,0,0,0.03)]">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-[#FCFCFC]">
                                <TableRow className="border-[#F1F1F4] hover:bg-transparent">
                                    <TableHead className="px-5 py-3.5 text-[11.5px] font-semibold tracking-wide text-[#78829D] uppercase">
                                        Alumnus Name & Email
                                    </TableHead>
                                    <TableHead className="px-4 py-3.5 text-[11.5px] font-semibold tracking-wide text-[#78829D] uppercase">
                                        Cadet College & Roll
                                    </TableHead>
                                    <TableHead className="px-4 py-3.5 text-[11.5px] font-semibold tracking-wide text-[#78829D] uppercase">
                                        Additional Guests
                                    </TableHead>
                                    <TableHead className="px-4 py-3.5 text-[11.5px] font-semibold tracking-wide text-[#78829D] uppercase">
                                        QR Pass Token
                                    </TableHead>
                                    <TableHead className="px-4 py-3.5 text-[11.5px] font-semibold tracking-wide text-[#78829D] uppercase">
                                        Attendance Status
                                    </TableHead>
                                    <TableHead className="px-5 py-3.5 text-right text-[11.5px] font-semibold tracking-wide text-[#78829D] uppercase">
                                        Checked In At
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {registrations.data.length === 0 ? (
                                    <TableRow className="border-[#F1F1F4] hover:bg-transparent">
                                        <TableCell colSpan={6} className="h-32 text-center text-[13px] text-[#78829D]">
                                            No registrations found for this event yet.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    registrations.data.map((reg) => (
                                        <TableRow
                                            key={reg.id}
                                            className="border-[#F1F1F4] transition-colors hover:bg-[#FCFCFC]"
                                        >
                                            <TableCell className="px-5 py-3.5">
                                                <div className="text-[13px] font-semibold text-[#071437]">
                                                    {reg.member?.user?.name}
                                                </div>
                                                <div className="text-[11.5px] text-[#78829D]">
                                                    {reg.member?.user?.email}
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-4 py-3.5">
                                                <div className="text-[13px] font-medium text-[#071437]">
                                                    {reg.member?.college?.name}
                                                </div>
                                                <div className="text-[11px] text-[#99A1B7]">
                                                    Roll #{reg.member?.college_roll_no}
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-4 py-3.5">
                                                <span className="text-[13px] font-semibold text-[#071437]">
                                                    {reg.guest_count} guests
                                                </span>
                                                {reg.guests && reg.guests.length > 0 && (
                                                    <div className="text-[11px] text-[#78829D]">
                                                        ({reg.guests.map((g) => g.name).join(', ')})
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell className="px-4 py-3.5 font-mono text-[12px] text-[#78829D]">
                                                {reg.qr_token.substring(0, 16)}...
                                            </TableCell>
                                            <TableCell className="px-4 py-3.5">
                                                <span
                                                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize ${
                                                        reg.status === 'attended'
                                                            ? 'border border-emerald-200 bg-emerald-50 text-emerald-700'
                                                            : 'border border-blue-200 bg-[#F1F6FF] text-[#1B84FF]'
                                                    }`}
                                                >
                                                    {reg.status}
                                                </span>
                                            </TableCell>
                                            <TableCell className="px-5 py-3.5 text-right text-[13px] text-[#78829D]">
                                                {reg.checked_in_at ? (
                                                    <span className="inline-flex items-center justify-end gap-1 font-semibold text-emerald-600">
                                                        <CheckCircle2 className="size-3.5" />
                                                        {new Date(reg.checked_in_at).toLocaleTimeString([], {
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        })}
                                                    </span>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        onClick={() => setQrCodeInput(reg.qr_token)}
                                                        className="text-[12.5px] font-semibold text-[#1B84FF] hover:underline"
                                                    >
                                                        Manual Check-in
                                                    </button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
