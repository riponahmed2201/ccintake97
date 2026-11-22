<?php

namespace App\Http\Controllers\Member;

use App\Http\Controllers\Controller;
use App\Models\MentorshipProfile;
use App\Models\MentorshipRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MentorshipController extends Controller
{
    public function index(Request $request): Response
    {
        $member = $request->user()->member;

        $mentors = MentorshipProfile::with(['member.user', 'member.college', 'member.profile.industry'])
            ->where('is_available', true)
            ->where('member_id', '!=', $member?->id)
            ->get();

        $myMentorProfile = $member ? MentorshipProfile::where('member_id', $member->id)->first() : null;

        $requestsReceived = $member ? MentorshipRequest::with(['mentee.user', 'mentee.college'])
            ->where('mentor_id', $member->id)
            ->latest()
            ->get() : collect();

        $requestsSent = $member ? MentorshipRequest::with(['mentor.user', 'mentor.college'])
            ->where('mentee_id', $member->id)
            ->latest()
            ->get() : collect();

        return Inertia::render('member/mentorship/index', [
            'mentors' => $mentors,
            'myMentorProfile' => $myMentorProfile,
            'requestsReceived' => $requestsReceived,
            'requestsSent' => $requestsSent,
        ]);
    }

    public function updateProfile(Request $request): RedirectResponse
    {
        $member = $request->user()->member;
        if (! $member) abort(403);

        $validated = $request->validate([
            'is_available' => 'required|boolean',
            'expertise_areas' => 'nullable|string|max:500',
            'preferred_topics' => 'nullable|string|max:500',
            'max_mentees' => 'integer|min:1|max:10',
        ]);

        if ($validated['is_available']) {
            $validated['consent_given_at'] = now();
        }

        MentorshipProfile::updateOrCreate(
            ['member_id' => $member->id],
            $validated
        );

        return back()->with('success', 'Mentorship preferences saved.');
    }

    public function sendRequest(Request $request): RedirectResponse
    {
        $member = $request->user()->member;
        if (! $member) abort(403);

        $validated = $request->validate([
            'mentor_id' => 'required|exists:members,id',
            'goals' => 'required|string|max:1000',
        ]);

        if ($member->id == $validated['mentor_id']) {
            return back()->with('error', 'Cannot request mentorship from yourself.');
        }

        MentorshipRequest::create([
            'mentor_id' => $validated['mentor_id'],
            'mentee_id' => $member->id,
            'goals' => $validated['goals'],
            'status' => 'pending',
        ]);

        return back()->with('success', 'Mentorship request sent successfully.');
    }

    public function respond(Request $request, int $id): RedirectResponse
    {
        $member = $request->user()->member;
        $req = MentorshipRequest::where('id', $id)
            ->where('mentor_id', $member->id)
            ->firstOrFail();

        $validated = $request->validate([
            'status' => 'required|in:accepted,declined',
            'response_note' => 'nullable|string|max:500',
        ]);

        $req->update($validated);

        return back()->with('success', "Request {$validated['status']}.");
    }
}
