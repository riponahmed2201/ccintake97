import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, QrCode, CheckCircle2, Users, Search } from 'lucide-react';
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
                    'Accept': 'application/json',
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
        } catch (err: any) {
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
            <Head title={`Attendees: ${event.title} - INTAKE 97 Admin`} />

            <div className="space-y-6">
                <Link
                    href="/admin/events"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900"
                >
                    <ArrowLeft className="size-4" />
                    Back to Events
                </Link>

                {/* Event Summary & Fast Check-in Terminal */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="md:col-span-2">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
                                {event.title}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                            <div>Venue: <strong>{event.venue}</strong></div>
                            <div>
                                Date: <strong>{new Date(event.starts_on).toLocaleDateString()}</strong> · Start Time: {event.start_time || 'TBA'}
                            </div>
                            <div className="flex items-center gap-4 pt-2">
                                <Badge variant="outline" className="text-xs font-bold text-emerald-600">
                                    Total Registered: {registrations.total}
                                </Badge>
                                {event.capacity && (
                                    <Badge variant="outline" className="text-xs">
                                        Capacity: {event.capacity} seats
                                    </Badge>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* QR Check-in Terminal Box */}
                    <Card className="border-indigo-200 dark:border-indigo-900 bg-indigo-50/40 dark:bg-indigo-950/20">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs font-bold flex items-center gap-2 text-indigo-700 dark:text-indigo-400">
                                <QrCode className="size-4" />
                                Live QR Check-in Terminal
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleCheckinSubmit} className="space-y-3">
                                <div>
                                    <Input
                                        placeholder="Scan or paste QR Token..."
                                        value={qrCodeInput}
                                        onChange={(e) => setQrCodeInput(e.target.value)}
                                        className="text-xs bg-white dark:bg-slate-900"
                                        autoFocus
                                    />
                                </div>
                                <Button type="submit" size="sm" className="w-full bg-indigo-600 hover:bg-indigo-700 text-xs font-semibold">
                                    Validate & Check In
                                </Button>
                                {checkinMessage && (
                                    <div className={`p-2.5 rounded-lg text-xs font-medium ${
                                        checkinMessage.error
                                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                                            : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                    }`}>
                                        {checkinMessage.text}
                                    </div>
                                )}
                            </form>
                        </CardContent>
                    </Card>
                </div>

                {/* Attendee Registry Table */}
                <Card className="overflow-hidden">
                    <Table>
                        <TableHeader className="bg-slate-50 dark:bg-slate-900/60">
                            <TableRow>
                                <TableHead className="text-xs font-semibold">Alumnus Name & Email</TableHead>
                                <TableHead className="text-xs font-semibold">Cadet College & Roll</TableHead>
                                <TableHead className="text-xs font-semibold">Additional Guests</TableHead>
                                <TableHead className="text-xs font-semibold">QR Pass Token</TableHead>
                                <TableHead className="text-xs font-semibold">Attendance Status</TableHead>
                                <TableHead className="text-xs font-semibold text-right">Checked In At</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {registrations.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-28 text-center text-xs text-slate-500">
                                        No registrations found for this event yet.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                registrations.data.map((reg) => (
                                    <TableRow key={reg.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                                        <TableCell>
                                            <div className="font-semibold text-xs text-slate-900 dark:text-white">
                                                {reg.member?.user?.name}
                                            </div>
                                            <div className="text-[11px] text-slate-500">
                                                {reg.member?.user?.email}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-xs font-medium text-slate-800 dark:text-slate-200">
                                                {reg.member?.college?.name}
                                            </div>
                                            <div className="text-[10px] text-slate-400">
                                                Roll #{reg.member?.college_roll_no}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="font-semibold text-xs text-slate-800 dark:text-slate-200">
                                                {reg.guest_count} guests
                                            </span>
                                            {reg.guests && reg.guests.length > 0 && (
                                                <div className="text-[10px] text-slate-500">
                                                    ({reg.guests.map(g => g.name).join(', ')})
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell className="font-mono text-[11px] text-slate-500">
                                            {reg.qr_token.substring(0, 16)}...
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                className={`text-[10px] capitalize ${
                                                    reg.status === 'attended'
                                                        ? 'bg-emerald-100 text-emerald-800'
                                                        : 'bg-blue-100 text-blue-800'
                                                }`}
                                            >
                                                {reg.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right text-xs text-slate-500">
                                            {reg.checked_in_at ? (
                                                <span className="text-emerald-600 font-semibold flex items-center justify-end gap-1">
                                                    <CheckCircle2 className="size-3.5" />
                                                    {new Date(reg.checked_in_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            ) : (
                                                <button
                                                    onClick={() => {
                                                        setQrCodeInput(reg.qr_token);
                                                    }}
                                                    className="text-xs text-indigo-600 hover:underline"
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
                </Card>
            </div>
        </AdminLayout>
    );
}
