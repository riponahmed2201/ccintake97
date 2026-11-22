<?php

namespace App\Http\Controllers\Member;

use App\Http\Controllers\Controller;
use App\Models\Industry;
use App\Models\MemberPrivacySetting;
use App\Models\MemberProfile;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    public function edit(Request $request): Response
    {
        $user = $request->user();
        $member = $user->member->load(['college', 'profile.industry', 'privacySettings']);
        $industries = Industry::orderBy('name')->get(['id', 'name']);

        return Inertia::render('member/profile/edit', [
            'member' => $member,
            'industries' => $industries,
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
        $score = 30; // base from registration
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
}
