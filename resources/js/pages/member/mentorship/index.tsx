import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import MemberLayout from '@/layouts/member-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { GraduationCap, Send, Check, X, Sparkles } from 'lucide-react';
import type { MentorshipProfile } from '@/types';

interface MentorshipIndexProps {
    mentors: any[];
    myMentorProfile: MentorshipProfile | null;
    requestsReceived: any[];
    requestsSent: any[];
}

const fieldClass =
    'h-10 w-full rounded-md border !border-[#DBDFE9] !bg-[#FCFCFC] px-3 text-[13px] font-normal !text-[#071437] !shadow-none outline-none transition-all duration-200 placeholder:!text-[#99A1B7] hover:!border-[#C4CADA] focus:!border-[#1B84FF] focus:!bg-white focus:!ring-[3px] focus:!ring-[#1B84FF]/10 dark:!bg-[#FCFCFC] dark:!text-[#071437]';

function EmptyState({ message }: { message: string }) {
    return (
        <div className="col-span-full flex flex-col items-center justify-center rounded-xl border border-[#F1F1F4] bg-[#FCFCFC] px-6 py-12 text-center">
            <div className="mb-3 flex size-11 items-center justify-center rounded-full bg-[#F1F6FF] text-[#1B84FF]">
                <GraduationCap className="size-5" />
            </div>
            <p className="max-w-md text-[13px] text-[#78829D]">{message}</p>
        </div>
    );
}

export default function MemberMentorshipIndex({
    mentors,
    myMentorProfile,
    requestsReceived,
    requestsSent,
}: MentorshipIndexProps) {
    const [isAvailable, setIsAvailable] = useState(myMentorProfile?.is_available || false);
    const [expertise, setExpertise] = useState(myMentorProfile?.expertise_areas || '');
    const [preferredTopics, setPreferredTopics] = useState(myMentorProfile?.preferred_topics || '');

    const [selectedMentor, setSelectedMentor] = useState<any | null>(null);
    const [goals, setGoals] = useState('');

    const handleSaveMentorProfile = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(
            '/member/mentorship/profile',
            {
                is_available: isAvailable,
                expertise_areas: expertise,
                preferred_topics: preferredTopics,
            },
            { preserveScroll: true }
        );
    };

    const handleSendRequest = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedMentor) return;

        router.post(
            '/member/mentorship/request',
            {
                mentor_id: selectedMentor.member_id,
                goals,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setSelectedMentor(null);
                    setGoals('');
                },
            }
        );
    };

    const handleRespond = (id: number, status: 'accepted' | 'declined') => {
        router.put(`/member/mentorship/respond/${id}`, { status }, { preserveScroll: true });
    };

    return (
        <MemberLayout
            title="Mentorship Hub"
            breadcrumbs={[{ title: 'Mentorship Hub' }]}
        >
            <Head title="Mentorship Hub - INTAKE97.COM" />

            <div className="w-full space-y-6">
                {/* Page Header */}
                <div>
                    <h1 className="text-[22px] font-semibold tracking-tight text-[#071437]">
                        Alumni Mentorship &amp; Career Guidance
                    </h1>
                    <p className="mt-1 text-[13px] text-[#78829D]">
                        Offer professional guidance to batchmates or seek mentorship in new industries and domains.
                    </p>
                </div>

                <Tabs defaultValue="mentors" className="space-y-5">
                    <TabsList className="h-auto w-full flex-wrap justify-start gap-1 rounded-xl border border-[#F1F1F4] !bg-[#FCFCFC] p-1.5 sm:w-auto">
                        <TabsTrigger
                            value="mentors"
                            className="rounded-lg px-3.5 py-2 text-[12.5px] font-semibold text-[#78829D] data-[state=active]:!bg-white data-[state=active]:!text-[#1B84FF] data-[state=active]:shadow-[0_2px_6px_rgba(7,20,55,0.06)]"
                        >
                            Available Mentors ({mentors.length})
                        </TabsTrigger>
                        <TabsTrigger
                            value="my_status"
                            className="rounded-lg px-3.5 py-2 text-[12.5px] font-semibold text-[#78829D] data-[state=active]:!bg-white data-[state=active]:!text-[#1B84FF] data-[state=active]:shadow-[0_2px_6px_rgba(7,20,55,0.06)]"
                        >
                            My Mentor Mode {isAvailable ? '(Active)' : '(Off)'}
                        </TabsTrigger>
                        <TabsTrigger
                            value="received"
                            className="rounded-lg px-3.5 py-2 text-[12.5px] font-semibold text-[#78829D] data-[state=active]:!bg-white data-[state=active]:!text-[#1B84FF] data-[state=active]:shadow-[0_2px_6px_rgba(7,20,55,0.06)]"
                        >
                            Received ({requestsReceived.length})
                        </TabsTrigger>
                        <TabsTrigger
                            value="sent"
                            className="rounded-lg px-3.5 py-2 text-[12.5px] font-semibold text-[#78829D] data-[state=active]:!bg-white data-[state=active]:!text-[#1B84FF] data-[state=active]:shadow-[0_2px_6px_rgba(7,20,55,0.06)]"
                        >
                            Sent ({requestsSent.length})
                        </TabsTrigger>
                    </TabsList>

                    {/* Mentors Directory */}
                    <TabsContent value="mentors">
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {mentors.length === 0 ? (
                                <EmptyState message="No batchmates have listed mentor availability at the moment." />
                            ) : (
                                mentors.map((m) => {
                                    const avatarPath = m.member?.user?.avatar_path;
                                    const name = m.member?.user?.name || 'Alumnus';
                                    return (
                                        <div
                                            key={m.id}
                                            className="flex flex-col justify-between rounded-xl border border-[#F1F1F4] bg-white p-5 shadow-[0_3px_4px_0_rgba(0,0,0,0.03)] transition-colors hover:border-[#DBDFE9]"
                                        >
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-3.5">
                                                    <div className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#F1F6FF] text-[14px] font-semibold text-[#1B84FF] ring-1 ring-[#1B84FF]/15">
                                                        {avatarPath ? (
                                                            <img src={`/storage/${avatarPath}`} alt={name} className="size-full object-cover" />
                                                        ) : (
                                                            name.charAt(0)
                                                        )}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="truncate text-[14px] font-semibold text-[#071437]">
                                                            {name}
                                                        </div>
                                                        <div className="truncate text-[12px] text-[#78829D]">
                                                            {m.member?.college?.name || 'Intake 1997'}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="space-y-1.5 border-t border-[#F1F1F4] pt-2.5 text-[12.5px]">
                                                    {m.member?.profile?.designation && (
                                                        <div className="font-semibold text-[#071437]">
                                                            {m.member.profile.designation}
                                                            {m.member.profile.organization ? ` at ${m.member.profile.organization}` : ''}
                                                        </div>
                                                    )}
                                                    {m.expertise_areas && (
                                                        <div className="text-[12px] text-[#4B5675]">
                                                            <span className="font-semibold text-[#071437]">Expertise:</span> {m.expertise_areas}
                                                        </div>
                                                    )}
                                                    {m.preferred_topics && (
                                                        <div className="text-[12px] text-[#78829D]">
                                                            <span className="font-semibold text-[#4B5675]">Topics:</span> {m.preferred_topics}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="mt-4 flex justify-end border-t border-[#F1F1F4] pt-3.5">
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    onClick={() => setSelectedMentor(m)}
                                                    className="h-8.5 rounded-lg bg-[#1B84FF] px-3.5 text-[12px] font-semibold text-white hover:bg-[#006AE6]"
                                                >
                                                    <Send className="mr-1.5 size-3.5" /> Request Mentorship
                                                </Button>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </TabsContent>

                    {/* My Mentor Status */}
                    <TabsContent value="my_status">
                        <div className="max-w-2xl rounded-xl border border-[#F1F1F4] bg-white p-5 shadow-[0_3px_4px_0_rgba(0,0,0,0.03)] sm:p-6">
                            <div className="flex items-center gap-2 border-b border-[#F1F1F4] pb-4 text-[15px] font-semibold text-[#071437]">
                                <Sparkles className="size-4 text-[#1B84FF]" />
                                Offer Mentorship to 1997 Batchmates
                            </div>

                            <form onSubmit={handleSaveMentorProfile} className="mt-5 space-y-4">
                                <label className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-[#F1F1F4] bg-[#FCFCFC] p-3.5 text-[13px] font-semibold text-[#071437]">
                                    <input
                                        type="checkbox"
                                        checked={isAvailable}
                                        onChange={(e) => setIsAvailable(e.target.checked)}
                                        className="size-4 rounded border-[#DBDFE9] text-[#1B84FF] focus:ring-[#1B84FF]"
                                    />
                                    <span>I am available to provide voluntary career / industry mentorship</span>
                                </label>

                                <div>
                                    <label className="mb-1.5 block text-[12.5px] font-semibold text-[#071437]">
                                        Your Core Domains of Expertise
                                    </label>
                                    <Input
                                        placeholder="e.g. Cloud Architecture, Corporate Finance, Clinical Surgery"
                                        value={expertise}
                                        onChange={(e) => setExpertise(e.target.value)}
                                        className={fieldClass}
                                    />
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-[12.5px] font-semibold text-[#071437]">
                                        Preferred Topics to Discuss
                                    </label>
                                    <textarea
                                        rows={3}
                                        className={`${fieldClass} h-auto py-2.5`}
                                        placeholder="e.g. Career transitions, Executive leadership, Global relocation"
                                        value={preferredTopics}
                                        onChange={(e) => setPreferredTopics(e.target.value)}
                                    />
                                </div>

                                <div className="flex justify-end pt-1">
                                    <Button
                                        type="submit"
                                        className="h-9.5 rounded-lg bg-[#1B84FF] px-5 text-[12.5px] font-semibold text-white hover:bg-[#006AE6]"
                                    >
                                        Save Mentorship Settings
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </TabsContent>

                    {/* Received Requests */}
                    <TabsContent value="received">
                        <div className="space-y-3">
                            {requestsReceived.length === 0 ? (
                                <EmptyState message="No pending mentorship requests received." />
                            ) : (
                                requestsReceived.map((req) => (
                                    <div
                                        key={req.id}
                                        className="flex flex-col justify-between gap-4 rounded-xl border border-[#F1F1F4] bg-white p-5 shadow-[0_3px_4px_0_rgba(0,0,0,0.03)] sm:flex-row sm:items-center"
                                    >
                                        <div className="space-y-1">
                                            <div className="text-[14px] font-semibold text-[#071437]">
                                                From: {req.mentee?.user?.name}{' '}
                                                <span className="font-normal text-[#78829D]">
                                                    ({req.mentee?.college?.name || 'Intake 1997'})
                                                </span>
                                            </div>
                                            <p className="text-[12.5px] text-[#4B5675]">
                                                Goals: &ldquo;{req.goals}&rdquo;
                                            </p>
                                        </div>

                                        {req.status === 'pending' ? (
                                            <div className="flex shrink-0 items-center gap-2">
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    onClick={() => handleRespond(req.id, 'accepted')}
                                                    className="h-8.5 rounded-lg bg-[#17C653] px-3 text-[12px] font-semibold text-white hover:bg-[#13a845]"
                                                >
                                                    <Check className="mr-1 size-3.5" /> Accept
                                                </Button>
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleRespond(req.id, 'declined')}
                                                    className="h-8.5 rounded-lg border-[#DBDFE9] !bg-white px-3 text-[12px] font-semibold text-[#F8285A] hover:!bg-[#FFEEF3]"
                                                >
                                                    <X className="mr-1 size-3.5" /> Decline
                                                </Button>
                                            </div>
                                        ) : (
                                            <span
                                                className={`inline-flex self-start rounded-md px-2.5 py-0.5 text-[11px] font-semibold capitalize sm:self-auto ${
                                                    req.status === 'accepted'
                                                        ? 'bg-[#EAFFF1] text-[#17C653]'
                                                        : 'bg-[#FFEEF3] text-[#F8285A]'
                                                }`}
                                            >
                                                {req.status}
                                            </span>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </TabsContent>

                    {/* Sent Requests */}
                    <TabsContent value="sent">
                        <div className="space-y-3">
                            {requestsSent.length === 0 ? (
                                <EmptyState message="You have not submitted any mentorship requests." />
                            ) : (
                                requestsSent.map((req) => (
                                    <div
                                        key={req.id}
                                        className="flex flex-col justify-between gap-3 rounded-xl border border-[#F1F1F4] bg-white p-5 shadow-[0_3px_4px_0_rgba(0,0,0,0.03)] sm:flex-row sm:items-center"
                                    >
                                        <div className="space-y-1">
                                            <div className="text-[14px] font-semibold text-[#071437]">
                                                To: {req.mentor?.user?.name}{' '}
                                                <span className="font-normal text-[#78829D]">
                                                    ({req.mentor?.college?.name || 'Intake 1997'})
                                                </span>
                                            </div>
                                            <p className="line-clamp-1 text-[12.5px] text-[#78829D]">
                                                Goals: &ldquo;{req.goals}&rdquo;
                                            </p>
                                        </div>
                                        <span
                                            className={`inline-flex shrink-0 self-start rounded-md px-2.5 py-0.5 text-[11px] font-semibold capitalize sm:self-auto ${
                                                req.status === 'accepted'
                                                    ? 'bg-[#EAFFF1] text-[#17C653]'
                                                    : req.status === 'declined'
                                                      ? 'bg-[#FFEEF3] text-[#F8285A]'
                                                      : 'bg-[#FFF8DD] text-[#B45309]'
                                            }`}
                                        >
                                            {req.status}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Send Request Dialog */}
            <Dialog open={!!selectedMentor} onOpenChange={(open) => !open && setSelectedMentor(null)}>
                <DialogContent className="border-[#F1F1F4] !bg-white !text-[#071437] sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-[16px] font-semibold text-[#071437]">
                            Request Mentorship from {selectedMentor?.member?.user?.name}
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSendRequest} className="space-y-4 pt-2">
                        <div>
                            <label className="mb-1.5 block text-[12.5px] font-semibold text-[#071437]">
                                Your Learning Goals &amp; Discussion Objectives <span className="text-[#F8285A]">*</span>
                            </label>
                            <textarea
                                required
                                rows={4}
                                placeholder="Describe what you want to learn or discuss (e.g. system design interview prep, career progression)..."
                                value={goals}
                                onChange={(e) => setGoals(e.target.value)}
                                className={`${fieldClass} h-auto py-2.5`}
                            />
                        </div>
                        <DialogFooter className="pt-1">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setSelectedMentor(null)}
                                className="h-9 rounded-lg border-[#DBDFE9] !bg-white px-4 text-[12.5px] font-semibold text-[#4B5675] hover:!bg-[#F9F9F9]"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="h-9 rounded-lg bg-[#1B84FF] px-4 text-[12.5px] font-semibold text-white hover:bg-[#006AE6]"
                            >
                                Submit Request
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </MemberLayout>
    );
}
