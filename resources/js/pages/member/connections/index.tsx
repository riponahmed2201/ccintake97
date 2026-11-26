import React from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import MemberLayout from '@/layouts/member-layout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserCheck, UserPlus, X, Check, Users, Search } from 'lucide-react';
import type { AuthUser, Member } from '@/types';

interface ConnectionRecord {
    id: number;
    requester?: Member;
    addressee?: Member;
}

interface ConnectionsIndexProps {
    connections: ConnectionRecord[];
    incoming: ConnectionRecord[];
    outgoing: ConnectionRecord[];
    suggestions: Member[];
}

function PeerAvatar({ member }: { member?: Member }) {
    const avatarPath = member?.user?.avatar_path;
    const initial = member?.user?.name?.charAt(0) || 'A';

    return (
        <div className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#F1F6FF] text-[14px] font-semibold text-[#1B84FF] ring-1 ring-[#1B84FF]/15">
            {avatarPath ? (
                <img src={`/storage/${avatarPath}`} alt={member?.user?.name || 'Alumnus'} className="size-full object-cover" />
            ) : (
                initial
            )}
        </div>
    );
}

function EmptyState({ message, actionHref, actionLabel }: { message: string; actionHref?: string; actionLabel?: string }) {
    return (
        <div className="col-span-full flex flex-col items-center justify-center rounded-xl border border-[#F1F1F4] bg-[#FCFCFC] px-6 py-12 text-center">
            <div className="mb-3 flex size-11 items-center justify-center rounded-full bg-[#F1F6FF] text-[#1B84FF]">
                <Users className="size-5" />
            </div>
            <p className="max-w-md text-[13px] text-[#78829D]">{message}</p>
            {actionHref && actionLabel && (
                <Link
                    href={actionHref}
                    className="mt-4 inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#1B84FF] px-4 text-[12.5px] font-semibold text-white transition-colors hover:bg-[#006AE6]"
                >
                    <Search className="size-3.5" />
                    {actionLabel}
                </Link>
            )}
        </div>
    );
}

export default function ConnectionsIndex({
    connections,
    incoming,
    outgoing,
    suggestions,
}: ConnectionsIndexProps) {
    const page = usePage();
    const authUserId = (page.props as { auth?: { user?: AuthUser } }).auth?.user?.id;

    const handleAccept = (id: number) => {
        router.put(`/member/connections/${id}/accept`, {}, { preserveScroll: true });
    };

    const handleReject = (id: number) => {
        router.put(`/member/connections/${id}/reject`, {}, { preserveScroll: true });
    };

    const handleRemove = (id: number, label = 'Disconnect from this alumnus?') => {
        if (confirm(label)) {
            router.delete(`/member/connections/${id}`, { preserveScroll: true });
        }
    };

    const handleConnect = (memberId: number) => {
        router.post(`/member/connections/${memberId}/send`, {}, { preserveScroll: true });
    };

    return (
        <MemberLayout
            title="My Connections"
            breadcrumbs={[{ title: 'My Connections' }]}
        >
            <Head title="My Connections - CCINTAKE97.COM" />

            <div className="w-full space-y-6">
                {/* Page Header */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="text-[22px] font-semibold tracking-tight text-[#071437]">
                            Alumni Peer Network
                        </h1>
                        <p className="mt-1 text-[13px] text-[#78829D]">
                            Connect, network, and collaborate with 1997 intake Cadet College batchmates.
                        </p>
                    </div>
                    <Link
                        href="/member/directory"
                        className="inline-flex h-9 items-center gap-1.5 self-start rounded-lg border border-[#DBDFE9] bg-white px-3.5 text-[12.5px] font-semibold text-[#4B5675] transition-colors hover:bg-[#F9F9F9] hover:text-[#071437] sm:self-auto"
                    >
                        <Search className="size-3.5 text-[#78829D]" />
                        Browse Directory
                    </Link>
                </div>

                <Tabs defaultValue="active" className="space-y-5">
                    <TabsList className="h-auto w-full flex-wrap justify-start gap-1 rounded-xl border border-[#F1F1F4] !bg-[#FCFCFC] p-1.5 sm:w-auto">
                        <TabsTrigger
                            value="active"
                            className="rounded-lg px-3.5 py-2 text-[12.5px] font-semibold text-[#78829D] data-[state=active]:!bg-white data-[state=active]:!text-[#1B84FF] data-[state=active]:shadow-[0_2px_6px_rgba(7,20,55,0.06)]"
                        >
                            Active ({connections.length})
                        </TabsTrigger>
                        <TabsTrigger
                            value="incoming"
                            className="rounded-lg px-3.5 py-2 text-[12.5px] font-semibold text-[#78829D] data-[state=active]:!bg-white data-[state=active]:!text-[#1B84FF] data-[state=active]:shadow-[0_2px_6px_rgba(7,20,55,0.06)]"
                        >
                            Incoming ({incoming.length})
                        </TabsTrigger>
                        <TabsTrigger
                            value="outgoing"
                            className="rounded-lg px-3.5 py-2 text-[12.5px] font-semibold text-[#78829D] data-[state=active]:!bg-white data-[state=active]:!text-[#1B84FF] data-[state=active]:shadow-[0_2px_6px_rgba(7,20,55,0.06)]"
                        >
                            Sent ({outgoing.length})
                        </TabsTrigger>
                        <TabsTrigger
                            value="suggestions"
                            className="rounded-lg px-3.5 py-2 text-[12.5px] font-semibold text-[#78829D] data-[state=active]:!bg-white data-[state=active]:!text-[#1B84FF] data-[state=active]:shadow-[0_2px_6px_rgba(7,20,55,0.06)]"
                        >
                            Suggested ({suggestions.length})
                        </TabsTrigger>
                    </TabsList>

                    {/* Active Connections */}
                    <TabsContent value="active">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {connections.length === 0 ? (
                                <EmptyState
                                    message="You have not established any peer connections yet. Explore the alumni directory or suggested batchmates to grow your network."
                                    actionHref="/member/directory"
                                    actionLabel="Find Batchmates"
                                />
                            ) : (
                                connections.map((c) => {
                                    const peer = c.requester?.user?.id === authUserId ? c.addressee : c.requester;
                                    return (
                                        <div
                                            key={c.id}
                                            className="flex flex-col justify-between rounded-xl border border-[#F1F1F4] bg-white p-5 shadow-[0_3px_4px_0_rgba(0,0,0,0.03)] transition-colors hover:border-[#DBDFE9]"
                                        >
                                            <div className="flex items-center gap-3.5">
                                                <PeerAvatar member={peer} />
                                                <div className="min-w-0">
                                                    <Link
                                                        href={`/member/directory/${peer?.id}`}
                                                        className="block truncate text-[14px] font-semibold text-[#071437] hover:text-[#1B84FF]"
                                                    >
                                                        {peer?.user?.name}
                                                    </Link>
                                                    <div className="truncate text-[12px] text-[#78829D]">
                                                        {peer?.college?.name || 'Intake 1997'}
                                                    </div>
                                                    {peer?.profile?.designation && (
                                                        <div className="mt-0.5 truncate text-[11.5px] text-[#99A1B7]">
                                                            {peer.profile.designation}
                                                            {peer.profile.organization ? ` · ${peer.profile.organization}` : ''}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="mt-4 flex items-center justify-between border-t border-[#F1F1F4] pt-3 text-[12.5px]">
                                                <Link
                                                    href={`/member/directory/${peer?.id}`}
                                                    className="inline-flex items-center gap-1 font-semibold text-[#1B84FF] hover:text-[#006AE6]"
                                                >
                                                    <UserCheck className="size-3.5" />
                                                    View Profile
                                                </Link>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemove(c.id)}
                                                    className="cursor-pointer text-[12px] font-medium text-[#99A1B7] transition-colors hover:text-[#F8285A]"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </TabsContent>

                    {/* Incoming Requests */}
                    <TabsContent value="incoming">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            {incoming.length === 0 ? (
                                <EmptyState message="No incoming connection requests waiting for your review." />
                            ) : (
                                incoming.map((req) => (
                                    <div
                                        key={req.id}
                                        className="flex flex-col justify-between gap-4 rounded-xl border border-[#F1F1F4] bg-white p-5 shadow-[0_3px_4px_0_rgba(0,0,0,0.03)] sm:flex-row sm:items-center"
                                    >
                                        <div className="flex min-w-0 items-center gap-3.5">
                                            <PeerAvatar member={req.requester} />
                                            <div className="min-w-0">
                                                <Link
                                                    href={`/member/directory/${req.requester?.id}`}
                                                    className="block truncate text-[14px] font-semibold text-[#071437] hover:text-[#1B84FF]"
                                                >
                                                    {req.requester?.user?.name}
                                                </Link>
                                                <div className="truncate text-[12px] text-[#78829D]">
                                                    {req.requester?.college?.name || 'Intake 1997'}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex shrink-0 items-center gap-2">
                                            <Button
                                                type="button"
                                                size="sm"
                                                onClick={() => handleAccept(req.id)}
                                                className="h-8.5 rounded-lg bg-[#17C653] px-3 text-[12px] font-semibold text-white hover:bg-[#13a845]"
                                            >
                                                <Check className="mr-1 size-3.5" /> Accept
                                            </Button>
                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleReject(req.id)}
                                                className="h-8.5 rounded-lg border-[#DBDFE9] !bg-white px-2.5 text-[12px] font-semibold text-[#F8285A] hover:!bg-[#FFEEF3]"
                                            >
                                                <X className="size-3.5" />
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </TabsContent>

                    {/* Outgoing Requests */}
                    <TabsContent value="outgoing">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            {outgoing.length === 0 ? (
                                <EmptyState message="No pending sent requests." />
                            ) : (
                                outgoing.map((req) => (
                                    <div
                                        key={req.id}
                                        className="flex flex-col justify-between gap-4 rounded-xl border border-[#F1F1F4] bg-white p-5 shadow-[0_3px_4px_0_rgba(0,0,0,0.03)] sm:flex-row sm:items-center"
                                    >
                                        <div className="flex min-w-0 items-center gap-3.5">
                                            <PeerAvatar member={req.addressee} />
                                            <div className="min-w-0">
                                                <Link
                                                    href={`/member/directory/${req.addressee?.id}`}
                                                    className="block truncate text-[14px] font-semibold text-[#071437] hover:text-[#1B84FF]"
                                                >
                                                    {req.addressee?.user?.name}
                                                </Link>
                                                <div className="truncate text-[12px] text-[#78829D]">
                                                    {req.addressee?.college?.name || 'Intake 1997'}
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => handleRemove(req.id, 'Cancel this connection request?')}
                                            className="cursor-pointer self-start text-[12px] font-semibold text-[#78829D] transition-colors hover:text-[#F8285A] sm:self-auto"
                                        >
                                            Cancel Request
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </TabsContent>

                    {/* Suggested Batchmates */}
                    <TabsContent value="suggestions">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {suggestions.length === 0 ? (
                                <EmptyState
                                    message="No college batchmate suggestions available right now. Check the full directory to connect with alumni across all colleges."
                                    actionHref="/member/directory"
                                    actionLabel="Browse Directory"
                                />
                            ) : (
                                suggestions.map((m) => (
                                    <div
                                        key={m.id}
                                        className="flex flex-col justify-between rounded-xl border border-[#F1F1F4] bg-white p-5 shadow-[0_3px_4px_0_rgba(0,0,0,0.03)] transition-colors hover:border-[#DBDFE9]"
                                    >
                                        <div className="space-y-2.5">
                                            <div className="flex items-center gap-3.5">
                                                <PeerAvatar member={m} />
                                                <div className="min-w-0">
                                                    <Link
                                                        href={`/member/directory/${m.id}`}
                                                        className="block truncate text-[14px] font-semibold text-[#071437] hover:text-[#1B84FF]"
                                                    >
                                                        {m.user?.name}
                                                    </Link>
                                                    <div className="truncate text-[12px] text-[#78829D]">
                                                        {m.college?.name || 'Intake 1997'}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="line-clamp-1 text-[12px] text-[#4B5675]">
                                                {m.profile?.designation ? m.profile.designation : '1997 Alumnus'}
                                                {m.profile?.organization ? ` at ${m.profile.organization}` : ''}
                                            </div>
                                        </div>

                                        <div className="mt-4 flex justify-end border-t border-[#F1F1F4] pt-3">
                                            <Button
                                                type="button"
                                                size="sm"
                                                onClick={() => handleConnect(m.id)}
                                                className="h-8.5 rounded-lg bg-[#1B84FF] px-3.5 text-[12px] font-semibold text-white hover:bg-[#006AE6]"
                                            >
                                                <UserPlus className="mr-1.5 size-3.5" /> Connect
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </MemberLayout>
    );
}
