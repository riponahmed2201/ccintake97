import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import MemberLayout from '@/layouts/member-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserCheck, UserPlus, X, Check, Trash2, GraduationCap, ArrowRight } from 'lucide-react';
import type { Member } from '@/types';

interface ConnectionsIndexProps {
    connections: any[];
    incoming: any[];
    outgoing: any[];
    suggestions: Member[];
}

export default function ConnectionsIndex({
    connections,
    incoming,
    outgoing,
    suggestions,
}: ConnectionsIndexProps) {
    const handleAccept = (id: number) => {
        router.put(`/member/connections/${id}/accept`);
    };

    const handleReject = (id: number) => {
        router.put(`/member/connections/${id}/reject`);
    };

    const handleRemove = (id: number) => {
        if (confirm('Disconnect from this alumnus?')) {
            router.delete(`/member/connections/${id}`);
        }
    };

    const handleConnect = (memberId: number) => {
        router.post(`/member/connections/${memberId}/send`);
    };

    return (
        <MemberLayout
            title="My Alumni Network & Connections"
            breadcrumbs={[{ title: 'My Connections' }]}
        >
            <Head title="My Connections - INTAKE97.COM" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                        Alumni Peer Network
                    </h1>
                    <p className="text-xs text-slate-500 mt-1">
                        Connect, network, and collaborate with 1997 intake Cadet College batchmates.
                    </p>
                </div>

                <Tabs defaultValue="active" className="space-y-4">
                    <TabsList className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                        <TabsTrigger value="active" className="text-xs">
                            Active Connections ({connections.length})
                        </TabsTrigger>
                        <TabsTrigger value="incoming" className="text-xs">
                            Incoming Requests ({incoming.length})
                        </TabsTrigger>
                        <TabsTrigger value="outgoing" className="text-xs">
                            Sent Requests ({outgoing.length})
                        </TabsTrigger>
                        <TabsTrigger value="suggestions" className="text-xs">
                            Suggested Batchmates ({suggestions.length})
                        </TabsTrigger>
                    </TabsList>

                    {/* Active Connections */}
                    <TabsContent value="active">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {connections.length === 0 ? (
                                <Card className="col-span-full p-8 text-center text-xs text-slate-400">
                                    You have not established any peer connections yet. Explore suggested batchmates to grow your network!
                                </Card>
                            ) : (
                                connections.map((c) => {
                                    // Identify peer alumnus (other side of connection)
                                    const peer = c.requester?.user?.id === (window as any)?.__auth_id ? c.addressee : c.requester;
                                    return (
                                        <Card key={c.id} className="p-4 flex flex-col justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="size-11 rounded-xl bg-indigo-600 text-white font-bold text-sm flex items-center justify-center shrink-0">
                                                    {peer?.user?.name?.charAt(0)}
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="font-bold text-xs text-slate-900 dark:text-white truncate">
                                                        {peer?.user?.name}
                                                    </div>
                                                    <div className="text-[11px] text-slate-500 truncate">
                                                        {peer?.college?.name}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="pt-3 mt-3 border-t flex items-center justify-between text-xs">
                                                <Link
                                                    href={`/member/directory/${peer?.id}`}
                                                    className="font-semibold text-indigo-600 hover:underline"
                                                >
                                                    View Profile
                                                </Link>
                                                <button
                                                    onClick={() => handleRemove(c.id)}
                                                    className="text-slate-400 hover:text-rose-500 text-[11px]"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </Card>
                                    );
                                })
                            )}
                        </div>
                    </TabsContent>

                    {/* Incoming Requests */}
                    <TabsContent value="incoming">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {incoming.length === 0 ? (
                                <Card className="col-span-full p-8 text-center text-xs text-slate-400">
                                    No incoming connection requests waiting for your review.
                                </Card>
                            ) : (
                                incoming.map((req) => (
                                    <Card key={req.id} className="p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="size-11 rounded-xl bg-indigo-600 text-white font-bold text-sm flex items-center justify-center shrink-0">
                                                {req.requester?.user?.name?.charAt(0)}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="font-bold text-xs text-slate-900 dark:text-white truncate">
                                                    {req.requester?.user?.name}
                                                </div>
                                                <div className="text-[11px] text-slate-500 truncate">
                                                    {req.requester?.college?.name}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-1.5 shrink-0">
                                            <Button
                                                size="sm"
                                                onClick={() => handleAccept(req.id)}
                                                className="bg-emerald-600 hover:bg-emerald-700 text-xs px-2.5 h-8"
                                            >
                                                <Check className="size-3.5 mr-1" /> Accept
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleReject(req.id)}
                                                className="text-xs px-2.5 h-8 text-rose-600"
                                            >
                                                <X className="size-3.5" />
                                            </Button>
                                        </div>
                                    </Card>
                                ))
                            )}
                        </div>
                    </TabsContent>

                    {/* Outgoing Requests */}
                    <TabsContent value="outgoing">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {outgoing.length === 0 ? (
                                <Card className="col-span-full p-8 text-center text-xs text-slate-400">
                                    No pending sent requests.
                                </Card>
                            ) : (
                                outgoing.map((req) => (
                                    <Card key={req.id} className="p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="size-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-indigo-600 font-bold text-sm flex items-center justify-center shrink-0">
                                                {req.addressee?.user?.name?.charAt(0)}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="font-bold text-xs text-slate-900 dark:text-white truncate">
                                                    {req.addressee?.user?.name}
                                                </div>
                                                <div className="text-[11px] text-slate-500 truncate">
                                                    {req.addressee?.college?.name}
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => handleRemove(req.id)}
                                            className="text-xs text-slate-400 hover:text-rose-500 font-medium"
                                        >
                                            Cancel Request
                                        </button>
                                    </Card>
                                ))
                            )}
                        </div>
                    </TabsContent>

                    {/* Suggested Batchmates */}
                    <TabsContent value="suggestions">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {suggestions.map((m) => (
                                <Card key={m.id} className="p-4 flex flex-col justify-between">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3">
                                            <div className="size-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-indigo-600 font-bold text-sm flex items-center justify-center shrink-0">
                                                {m.user?.name?.charAt(0)}
                                            </div>
                                            <div className="min-w-0">
                                                <Link href={`/member/directory/${m.id}`} className="font-bold text-xs text-slate-900 dark:text-white hover:underline block truncate">
                                                    {m.user?.name}
                                                </Link>
                                                <div className="text-[11px] text-slate-500 truncate">
                                                    {m.college?.name}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-[11px] text-slate-600 line-clamp-1">
                                            {m.profile?.designation ? `${m.profile.designation}` : '1997 Alumnus'}
                                            {m.profile?.organization ? ` at ${m.profile.organization}` : ''}
                                        </div>
                                    </div>

                                    <div className="pt-3 mt-3 border-t flex justify-end">
                                        <Button
                                            size="sm"
                                            onClick={() => handleConnect(m.id)}
                                            className="bg-indigo-600 hover:bg-indigo-700 text-xs h-7 px-3"
                                        >
                                            <UserPlus className="size-3 mr-1" /> Connect
                                        </Button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </MemberLayout>
    );
}
