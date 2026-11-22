import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import MemberLayout from '@/layouts/member-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
import { GraduationCap, UserCheck, Send, Check, X, Sparkles } from 'lucide-react';
import type { MentorshipProfile } from '@/types';

interface MentorshipIndexProps {
    mentors: any[];
    myMentorProfile: MentorshipProfile | null;
    requestsReceived: any[];
    requestsSent: any[];
}

export default function MemberMentorshipIndex({
    mentors,
    myMentorProfile,
    requestsReceived,
    requestsSent,
}: MentorshipIndexProps) {
    // Mentor settings state
    const [isAvailable, setIsAvailable] = useState(myMentorProfile?.is_available || false);
    const [expertise, setExpertise] = useState(myMentorProfile?.expertise_areas || '');
    const [preferredTopics, setPreferredTopics] = useState(myMentorProfile?.preferred_topics || '');

    // Request dialog state
    const [selectedMentor, setSelectedMentor] = useState<any | null>(null);
    const [goals, setGoals] = useState('');

    const handleSaveMentorProfile = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/member/mentorship/profile', {
            is_available: isAvailable,
            expertise_areas: expertise,
            preferred_topics: preferredTopics,
        });
    };

    const handleSendRequest = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedMentor) return;

        router.post('/member/mentorship/request', {
            mentor_id: selectedMentor.member_id,
            goals,
        }, {
            onSuccess: () => {
                setSelectedMentor(null);
                setGoals('');
            },
        });
    };

    const handleRespond = (id: number, status: 'accepted' | 'declined') => {
        router.put(`/member/mentorship/respond/${id}`, { status });
    };

    return (
        <MemberLayout
            title="Alumni Mentorship & Knowledge Sharing"
            breadcrumbs={[{ title: 'Mentorship Hub' }]}
        >
            <Head title="Mentorship Hub - INTAKE97.COM" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                        Alumni Mentorship & Career Guidance
                    </h1>
                    <p className="text-xs text-slate-500 mt-1">
                        Offer professional guidance to batchmates or seek mentorship in new industries and domains.
                    </p>
                </div>

                <Tabs defaultValue="mentors" className="space-y-4">
                    <TabsList className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                        <TabsTrigger value="mentors" className="text-xs">
                            Available Mentors ({mentors.length})
                        </TabsTrigger>
                        <TabsTrigger value="my_status" className="text-xs">
                            My Mentor Mode {isAvailable ? '(Active)' : '(Off)'}
                        </TabsTrigger>
                        <TabsTrigger value="received" className="text-xs">
                            Received Requests ({requestsReceived.length})
                        </TabsTrigger>
                        <TabsTrigger value="sent" className="text-xs">
                            Sent Requests ({requestsSent.length})
                        </TabsTrigger>
                    </TabsList>

                    {/* Mentors Directory */}
                    <TabsContent value="mentors">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {mentors.length === 0 ? (
                                <Card className="col-span-full p-12 text-center text-xs text-slate-400">
                                    No batchmates have listed mentor availability at the moment.
                                </Card>
                            ) : (
                                mentors.map((m) => (
                                    <Card key={m.id} className="p-5 flex flex-col justify-between hover:border-indigo-300 transition-all">
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3">
                                                <div className="size-11 rounded-xl bg-indigo-600 text-white font-bold text-sm flex items-center justify-center shrink-0">
                                                    {m.member?.user?.name?.charAt(0)}
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="font-bold text-xs text-slate-900 dark:text-white truncate">
                                                        {m.member?.user?.name}
                                                    </div>
                                                    <div className="text-[11px] text-slate-500 truncate">
                                                        {m.member?.college?.name}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-1 text-xs">
                                                <div className="font-semibold text-slate-800 dark:text-slate-200">
                                                    {m.member?.profile?.designation} {m.member?.profile?.organization ? `at ${m.member?.profile.organization}` : ''}
                                                </div>
                                                {m.expertise_areas && (
                                                    <div className="text-[11px] text-slate-600 dark:text-slate-400">
                                                        <strong>Expertise:</strong> {m.expertise_areas}
                                                    </div>
                                                )}
                                                {m.preferred_topics && (
                                                    <div className="text-[11px] text-slate-600 dark:text-slate-400">
                                                        <strong>Topics:</strong> {m.preferred_topics}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="pt-4 mt-4 border-t flex justify-end">
                                            <Button
                                                size="sm"
                                                onClick={() => setSelectedMentor(m)}
                                                className="bg-indigo-600 hover:bg-indigo-700 text-xs font-semibold"
                                            >
                                                <Send className="size-3 mr-1.5" /> Request Mentorship
                                            </Button>
                                        </div>
                                    </Card>
                                ))
                            )}
                        </div>
                    </TabsContent>

                    {/* My Mentor Status */}
                    <TabsContent value="my_status">
                        <Card className="max-w-2xl">
                            <CardHeader>
                                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                    <Sparkles className="size-4 text-amber-500" />
                                    Offer Mentorship to 1997 Batchmates
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSaveMentorProfile} className="space-y-4 text-xs">
                                    <label className="flex items-center gap-2.5 p-3 rounded-lg border cursor-pointer bg-slate-50 dark:bg-slate-800/40 font-semibold">
                                        <input
                                            type="checkbox"
                                            checked={isAvailable}
                                            onChange={(e) => setIsAvailable(e.target.checked)}
                                            className="rounded text-indigo-600"
                                        />
                                        <span>I am available to provide voluntary career / industry mentorship</span>
                                    </label>

                                    <div>
                                        <label className="font-semibold block mb-1">Your Core Domains of Expertise</label>
                                        <Input
                                            placeholder="e.g. Cloud Architecture, Corporate Finance, Clinical Surgery"
                                            value={expertise}
                                            onChange={(e) => setExpertise(e.target.value)}
                                        />
                                    </div>

                                    <div>
                                        <label className="font-semibold block mb-1">Preferred Topics to Discuss</label>
                                        <textarea
                                            rows={3}
                                            className="w-full text-xs rounded-md border p-2 bg-white dark:bg-slate-900"
                                            placeholder="e.g. Career transitions, Executive leadership, Global relocation"
                                            value={preferredTopics}
                                            onChange={(e) => setPreferredTopics(e.target.value)}
                                        />
                                    </div>

                                    <Button type="submit" size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-xs font-semibold">
                                        Save Mentorship Settings
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Received Requests */}
                    <TabsContent value="received">
                        <div className="space-y-3">
                            {requestsReceived.length === 0 ? (
                                <Card className="p-8 text-center text-xs text-slate-400">
                                    No pending mentorship requests received.
                                </Card>
                            ) : (
                                requestsReceived.map((req) => (
                                    <Card key={req.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                                        <div className="space-y-1">
                                            <div className="font-bold text-slate-900 dark:text-white">
                                                From: {req.mentee?.user?.name} ({req.mentee?.college?.name})
                                            </div>
                                            <p className="text-slate-600 dark:text-slate-400">
                                                Goals: "{req.goals}"
                                            </p>
                                        </div>

                                        {req.status === 'pending' ? (
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleRespond(req.id, 'accepted')}
                                                    className="bg-emerald-600 hover:bg-emerald-700 text-xs"
                                                >
                                                    <Check className="size-3.5 mr-1" /> Accept
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleRespond(req.id, 'declined')}
                                                    className="text-xs text-rose-600"
                                                >
                                                    <X className="size-3.5 mr-1" /> Decline
                                                </Button>
                                            </div>
                                        ) : (
                                            <Badge className="capitalize text-[10px]">{req.status}</Badge>
                                        )}
                                    </Card>
                                ))
                            )}
                        </div>
                    </TabsContent>

                    {/* Sent Requests */}
                    <TabsContent value="sent">
                        <div className="space-y-3">
                            {requestsSent.length === 0 ? (
                                <Card className="p-8 text-center text-xs text-slate-400">
                                    You have not submitted any mentorship requests.
                                </Card>
                            ) : (
                                requestsSent.map((req) => (
                                    <Card key={req.id} className="p-4 flex items-center justify-between text-xs">
                                        <div>
                                            <div className="font-bold text-slate-900 dark:text-white">
                                                To: {req.mentor?.user?.name} ({req.mentor?.college?.name})
                                            </div>
                                            <p className="text-slate-500 text-[11px] line-clamp-1">
                                                Goals: "{req.goals}"
                                            </p>
                                        </div>
                                        <Badge variant="outline" className="capitalize text-[10px] font-semibold">
                                            {req.status}
                                        </Badge>
                                    </Card>
                                ))
                            )}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Send Request Dialog */}
            <Dialog open={!!selectedMentor} onOpenChange={(open) => !open && setSelectedMentor(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-sm font-semibold">
                            Request Mentorship from {selectedMentor?.member?.user?.name}
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSendRequest} className="space-y-3 py-2 text-xs">
                        <div>
                            <label className="font-semibold block mb-1">Your Learning Goals & Discussion Objectives *</label>
                            <textarea
                                required
                                rows={4}
                                placeholder="Describe what you want to learn or discuss (e.g. system design interview prep, career progression)..."
                                value={goals}
                                onChange={(e) => setGoals(e.target.value)}
                                className="w-full text-xs rounded-md border p-2 bg-white dark:bg-slate-900"
                            />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" size="sm" onClick={() => setSelectedMentor(null)}>Cancel</Button>
                            <Button type="submit" size="sm" className="bg-indigo-600 hover:bg-indigo-700">Submit Request</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </MemberLayout>
    );
}
