<?php

namespace App\Http\Controllers\Member;

use App\Http\Controllers\Controller;
use App\Models\College;
use App\Models\Industry;
use App\Models\MemberPrivacySetting;
use App\Models\MemberProfile;
use App\Models\MembershipApplication;
use App\Services\SequenceService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    public function edit(Request $request): Response
    {
        $user = $request->user();
        $member = $user->member->load(['college', 'profile.industry', 'privacySettings']);
        $industries = Industry::orderBy('name')->get(['id', 'name']);
        $colleges = College::where('is_participating', true)->orderBy('display_order')->get(['id', 'name', 'short_name']);

        return Inertia::render('member/profile/edit', [
            'member' => $member,
            'industries' => $industries,
            'colleges' => $colleges,
            'cadetEditable' => ! $member->college_id && ! $member->applications()->where('status', 'submitted')->exists(),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $user = $request->user();
        $member = $user->member;

        $validatedUser = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:30',
        ]);
        $user->update($validatedUser);

        $validatedProfile = $request->validate([
            'city' => 'nullable|string|max:100',
            'country_code' => 'required|string|max:5',
            'address' => 'nullable|string|max:500',
            'gender' => 'nullable|string|max:20',
            'date_of_birth' => 'nullable|date',
            'designation' => 'nullable|string|max:150',
            'organization' => 'nullable|string|max:150',
            'industry_id' => 'nullable|exists:industries,id',
            'professional_bio' => 'nullable|string|max:2000',
            'linkedin_url' => 'nullable|url|max:255',
            'website_url' => 'nullable|url|max:255',
            'skills' => 'nullable|array',
        ]);

        // Calculate profile completion score
        $score = 10;
        if ($member->college_id) {
            $score += 20;
        }
        if (! empty($validatedProfile['designation'])) $score += 15;
        if (! empty($validatedProfile['organization'])) $score += 15;
        if (! empty($validatedProfile['professional_bio'])) $score += 15;
        if (! empty($validatedProfile['city'])) $score += 10;
        if (! empty($validatedProfile['linkedin_url'])) $score += 15;
        $validatedProfile['profile_completion'] = min(100, $score);

        MemberProfile::updateOrCreate(
            ['member_id' => $member->id],
            $validatedProfile
        );

        return back()->with('success', 'Profile updated successfully.');
    }

    public function updatePrivacy(Request $request): RedirectResponse
    {
        $user = $request->user();
        $member = $user->member;

        $validated = $request->validate([
            'settings' => 'required|array',
            'settings.*' => 'required|in:public,verified_members,connections,private',
        ]);

        foreach ($validated['settings'] as $fieldKey => $visibility) {
            MemberPrivacySetting::updateOrCreate(
                ['member_id' => $member->id, 'field_key' => $fieldKey],
                ['visibility' => $visibility]
            );
        }

        return back()->with('success', 'Privacy preferences saved.');
    }

    public function updateCadet(Request $request): RedirectResponse
    {
        $user = $request->user();
        $member = $user->member;

        if ($member->college_id || $member->applications()->where('status', 'submitted')->exists()) {
            return back()->withErrors(['college_id' => 'Cadet college credentials are already on file. Contact administration to request changes.']);
        }

        $validated = $request->validate([
            'college_id' => 'required|exists:colleges,id',
            'college_roll_no' => 'required|string|max:50',
            'reference_name' => 'nullable|string|max:150',
            'reference_phone' => 'nullable|string|max:50',
            'phone' => 'nullable|string|max:30',
        ]);

        DB::transaction(function () use ($user, $member, $validated) {
            if (! empty($validated['phone'])) {
                $user->update(['phone' => $validated['phone']]);
            }

            $member->update([
                'college_id' => $validated['college_id'],
                'college_roll_no' => $validated['college_roll_no'],
            ]);

            $appNo = SequenceService::next('application_no');
            MembershipApplication::create([
                'application_no' => $appNo,
                'member_id' => $member->id,
                'declared_college_id' => $validated['college_id'],
                'declared_roll_no' => $validated['college_roll_no'],
                'reference_name' => $validated['reference_name'] ?? null,
                'reference_phone' => $validated['reference_phone'] ?? null,
                'status' => 'submitted',
                'submitted_at' => now(),
            ]);

            $profile = $member->profile;
            if ($profile) {
                $profile->update([
                    'profile_completion' => min(100, ($profile->profile_completion ?? 10) + 20),
                ]);
            }
        });

        return back()->with('success', 'Your cadet college details have been saved and your membership application is submitted for verification.');
    }
}
