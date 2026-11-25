import React from 'react';
import { Head, router } from '@inertiajs/react';
import MemberLayout from '@/layouts/member-layout';
import { Button } from '@/components/ui/button';
import { Bell, CheckCheck, Check } from 'lucide-react';

interface NotificationsIndexProps {
    notifications: {
        data: any[];
        current_page: number;
        last_page: number;
        total: number;
    };
}

export default function MemberNotificationsIndex({ notifications }: NotificationsIndexProps) {
    const unreadCount = notifications.data.filter((n) => !n.read_at).length;

    const handleMarkAsRead = (id: string) => {
        router.put(`/member/notifications/${id}/read`, {}, { preserveScroll: true });
    };

    const handleMarkAllRead = () => {
        router.post('/member/notifications/read-all', {}, { preserveScroll: true });
    };

    return (
        <MemberLayout
            title="Notifications"
            breadcrumbs={[{ title: 'Notifications' }]}
        >
            <Head title="Notifications - INTAKE97.COM" />

            <div className="w-full space-y-6">
                {/* Page Header */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="text-[22px] font-semibold tracking-tight text-[#071437]">
                            Notification Center
                        </h1>
                        <p className="mt-1 text-[13px] text-[#78829D]">
                            Membership verification notices, event registration alerts, and connection updates.
                        </p>
                    </div>

                    {unreadCount > 0 && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleMarkAllRead}
                            className="h-9 gap-1.5 self-start rounded-lg border-[#DBDFE9] !bg-white px-3.5 text-[12.5px] font-semibold text-[#4B5675] shadow-none hover:!bg-[#F9F9F9] hover:text-[#071437] sm:self-auto"
                        >
                            <CheckCheck className="size-3.5 text-[#1B84FF]" /> Mark All as Read
                        </Button>
                    )}
                </div>

                {/* Notifications List */}
                <div className="space-y-3">
                    {notifications.data.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-xl border border-[#F1F1F4] bg-[#FCFCFC] px-6 py-12 text-center">
                            <div className="mb-3 flex size-11 items-center justify-center rounded-full bg-[#F1F6FF] text-[#1B84FF]">
                                <Bell className="size-5" />
                            </div>
                            <p className="text-[13.5px] font-semibold text-[#071437]">You&apos;re all caught up</p>
                            <p className="mt-1 max-w-md text-[12.5px] text-[#78829D]">
                                You have no notifications right now.
                            </p>
                        </div>
                    ) : (
                        notifications.data.map((n) => {
                            const data = typeof n.data === 'string' ? JSON.parse(n.data) : n.data;
                            const isRead = !!n.read_at;
                            return (
                                <div
                                    key={n.id}
                                    className={`flex items-center justify-between gap-4 rounded-xl border p-4.5 transition-colors sm:p-5 ${
                                        !isRead
                                            ? 'border-[#1B84FF]/25 bg-[#F8FBFF]'
                                            : 'border-[#F1F1F4] bg-white shadow-[0_3px_4px_0_rgba(0,0,0,0.02)]'
                                    }`}
                                >
                                    <div className="min-w-0 space-y-1.5">
                                        <div className="flex flex-wrap items-center gap-2">
                                            {!isRead && <span className="size-2 rounded-full bg-[#1B84FF]" />}
                                            <span className="inline-flex rounded-md bg-[#F1F6FF] px-2 py-0.5 text-[10.5px] font-semibold tracking-wide text-[#1B84FF] uppercase">
                                                {n.category || 'Notification'}
                                            </span>
                                            <span className="text-[11.5px] text-[#99A1B7]">
                                                {new Date(n.created_at).toLocaleString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                    hour: 'numeric',
                                                    minute: '2-digit',
                                                })}
                                            </span>
                                        </div>
                                        <p className={`text-[13.5px] leading-relaxed ${!isRead ? 'font-semibold text-[#071437]' : 'font-medium text-[#4B5675]'}`}>
                                            {data?.message || 'New association alert received.'}
                                        </p>
                                    </div>

                                    {!isRead && (
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleMarkAsRead(n.id)}
                                            className="h-8.5 shrink-0 rounded-lg border-[#DBDFE9] !bg-white px-2.5 text-[12px] font-semibold text-[#1B84FF] hover:!bg-[#F1F6FF]"
                                            title="Mark as read"
                                        >
                                            <Check className="mr-1 size-3.5" /> Read
                                        </Button>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </MemberLayout>
    );
}
