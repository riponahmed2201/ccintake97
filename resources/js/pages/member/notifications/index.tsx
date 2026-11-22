import React from 'react';
import { Head, router } from '@inertiajs/react';
import MemberLayout from '@/layouts/member-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
    const handleMarkAsRead = (id: string) => {
        router.put(`/member/notifications/${id}/read`);
    };

    const handleMarkAllRead = () => {
        router.post('/member/notifications/read-all');
    };

    return (
        <MemberLayout
            title="My Notifications"
            breadcrumbs={[{ title: 'Notifications' }]}
        >
            <Head title="Notifications - INTAKE97.COM" />

            <div className="max-w-3xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                            Notification Center
                        </h1>
                        <p className="text-xs text-slate-500 mt-1">
                            Membership verification notices, event registration alerts, and connection updates.
                        </p>
                    </div>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleMarkAllRead}
                        className="text-xs font-semibold gap-1.5"
                    >
                        <CheckCheck className="size-3.5" /> Mark All as Read
                    </Button>
                </div>

                <div className="space-y-3">
                    {notifications.data.length === 0 ? (
                        <Card className="p-12 text-center text-xs text-slate-400">
                            You have no notifications.
                        </Card>
                    ) : (
                        notifications.data.map((n) => {
                            const data = typeof n.data === 'string' ? JSON.parse(n.data) : n.data;
                            const isRead = !!n.read_at;
                            return (
                                <Card
                                    key={n.id}
                                    className={`p-4 transition-colors flex items-center justify-between ${
                                        !isRead
                                            ? 'border-indigo-200 dark:border-indigo-900 bg-indigo-50/20 dark:bg-slate-900'
                                            : ''
                                    }`}
                                >
                                    <div className="space-y-1 text-xs">
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className="text-[10px] uppercase font-semibold">
                                                {n.category || 'Notification'}
                                            </Badge>
                                            <span className="text-[10px] text-slate-400">
                                                {new Date(n.created_at).toLocaleString()}
                                            </span>
                                        </div>
                                        <p className="text-slate-800 dark:text-slate-200 font-medium">
                                            {data?.message || 'New association alert received.'}
                                        </p>
                                    </div>

                                    {!isRead && (
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => handleMarkAsRead(n.id)}
                                            className="text-xs text-indigo-600 hover:text-indigo-700"
                                            title="Mark as read"
                                        >
                                            <Check className="size-4" />
                                        </Button>
                                    )}
                                </Card>
                            );
                        })
                    )}
                </div>
            </div>
        </MemberLayout>
    );
}
