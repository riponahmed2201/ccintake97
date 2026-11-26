<?php

namespace App\Http\Controllers\Member;

use App\Http\Controllers\Controller;
use App\Models\College;
use App\Models\MemberPrivacySetting;
use App\Models\MemberProfile;
use App\Models\MembershipApplication;
use App\Services\SequenceService;
use App\Support\CadetProfileOptions;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    public function edit(Request $request): Response|RedirectResponse
    {
        $user = $request->user();
        if (! $user->member) {
            return redirect()->route('profile.edit')->with('info', 'This account does not have an alumni member profile. Showing account settings instead.');
        }

        $member = $user->member->load(['user', 'college', 'profile', 'privacySettings']);
        $colleges = College::where('is_participating', true)->orderBy('display_order')->get(['id', 'name', 'short_name']);

        return Inertia::render('member/profile/edit', [
            'member' => $member,
            'colleges' => $colleges,
            'houses' => CadetProfileOptions::HOUSES,
            'houseColors' => CadetProfileOptions::HOUSE_COLORS,
            'bloodGroups' => CadetProfileOptions::BLOOD_GROUPS,
            'jobTypes' => CadetProfileOptions::JOB_TYPES,
            'photoUrl' => $user->avatar_path ? asset('storage/'.ltrim($user->avatar_path, '/')) : null,
            'cadetEditable' => ! $member->college_id && ! $member->applications()->where('status', 'submitted')->exists(),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $user = $request->user();
        $member = $user->member;
        if (! $member) {
            return redirect()->route('profile.edit');
        }

        foreach ([
            'cadet_name', 'cccl_life_member_no', 'phone', 'blood_group', 'spouse_name', 'spouse_occupation', 'spouse_job_location',
            'address', 'city', 'country_code', 'present_address_line', 'present_area', 'present_postal_code',
            'permanent_address_line', 'permanent_area', 'permanent_city', 'permanent_postal_code', 'permanent_country_code',
            'house_name', 'house_color', 'job_type', 'organization', 'designation',
            'office_address', 'office_phone', 'facebook_url', 'linkedin_url', 'remarks', 'college_roll_no',
        ] as $field) {
            if ($request->input($field) === '') {
                $request->merge([$field => null]);
            }
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'cadet_name' => 'nullable|string|max:255',
            'cccl_life_member_no' => 'nullable|string|max:100',
            'phone' => 'required|string|max:30',
            'blood_group' => ['nullable', Rule::in(CadetProfileOptions::BLOOD_GROUPS)],
            'spouse_name' => 'nullable|string|max:255',
            'spouse_occupation' => 'nullable|string|max:255',
            'spouse_job_location' => 'nullable|string|max:255',
            'children_names' => 'nullable|array|max:10',
            'children_names.*' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:500',
            'city' => 'nullable|string|max:150',
            'country_code' => 'nullable|string|max:5',
            'present_address_line' => 'nullable|string|max:255',
            'present_area' => 'nullable|string|max:150',
            'present_postal_code' => 'nullable|string|max:30',
            'same_as_present_address' => 'nullable|boolean',
            'permanent_address_line' => 'nullable|string|max:255',
            'permanent_area' => 'nullable|string|max:150',
            'permanent_city' => 'nullable|string|max:150',
            'permanent_postal_code' => 'nullable|string|max:30',
            'permanent_country_code' => 'nullable|string|max:5',
            'college_id' => 'required|exists:colleges,id',
            'college_roll_no' => 'required|string|max:50',
            'intake_year' => 'required|integer|min:1950|max:2035',
            'house_name' => 'nullable|string|max:100',
            'house_color' => ['nullable', Rule::in(CadetProfileOptions::HOUSE_COLORS)],
            'job_type' => ['nullable', Rule::in(CadetProfileOptions::JOB_TYPES)],
            'organization' => 'nullable|string|max:150',
            'designation' => 'nullable|string|max:150',
            'office_address' => 'nullable|string|max:500',
            'office_phone' => 'nullable|string|max:30',
            'facebook_url' => 'nullable|url|max:255',
            'linkedin_url' => 'nullable|url|max:255',
            'remarks' => 'nullable|string|max:2000',
            'photo' => 'nullable|image|max:5120',
        ]);

        $children = collect($validated['children_names'] ?? [])
            ->map(fn ($name) => trim((string) $name))
            ->filter()
            ->values()
            ->all();

        DB::transaction(function () use ($request, $user, $member, $validated, $children) {
            if ($request->hasFile('photo')) {
                if ($user->avatar_path) {
                    Storage::disk('public')->delete($user->avatar_path);
                }
                $user->avatar_path = $request->file('photo')->store('avatars', 'public');
            }

            $user->fill([
                'name' => $validated['name'],
                'phone' => $validated['phone'],
            ]);
            $user->save();

            $member->update([
                'college_id' => $validated['college_id'],
                'college_roll_no' => $validated['college_roll_no'],
                'intake_year' => $validated['intake_year'],
                'house_name' => $validated['house_name'],
                'house_color' => $validated['house_color'],
            ]);

            $sameAsPresent = (bool) ($validated['same_as_present_address'] ?? false);
            $presentParts = array_filter([
                $validated['present_address_line'] ?? null,
                $validated['present_area'] ?? null,
                $validated['city'] ?? null,
                $validated['present_postal_code'] ?? null,
            ]);
            $formattedPresent = $presentParts !== [] ? implode(', ', $presentParts) : ($validated['address'] ?? null);
            $countryCode = $validated['country_code'] ?? $member->profile?->country_code ?: 'BD';

            $profileData = [
                'cadet_name' => $validated['cadet_name'],
                'cccl_life_member_no' => $validated['cccl_life_member_no'] ?? null,
                'blood_group' => $validated['blood_group'],
                'spouse_name' => $validated['spouse_name'],
                'spouse_occupation' => $validated['spouse_occupation'],
                'spouse_job_location' => $validated['spouse_job_location'],
                'children_names' => $children === [] ? null : $children,
                'address' => $formattedPresent,
                'city' => $validated['city'] ?? null,
                'country_code' => $countryCode,
                'present_address_line' => $validated['present_address_line'] ?? null,
                'present_area' => $validated['present_area'] ?? null,
                'present_postal_code' => $validated['present_postal_code'] ?? null,
                'same_as_present_address' => $sameAsPresent,
                'permanent_address_line' => $sameAsPresent ? ($validated['present_address_line'] ?? null) : ($validated['permanent_address_line'] ?? null),
                'permanent_area' => $sameAsPresent ? ($validated['present_area'] ?? null) : ($validated['permanent_area'] ?? null),
                'permanent_city' => $sameAsPresent ? ($validated['city'] ?? null) : ($validated['permanent_city'] ?? null),
                'permanent_postal_code' => $sameAsPresent ? ($validated['present_postal_code'] ?? null) : ($validated['permanent_postal_code'] ?? null),
                'permanent_country_code' => $sameAsPresent ? $countryCode : ($validated['permanent_country_code'] ?? 'BD'),
                'job_type' => $validated['job_type'],
                'organization' => $validated['organization'],
                'designation' => $validated['designation'],
                'office_address' => $validated['office_address'],
                'office_phone' => $validated['office_phone'],
                'facebook_url' => $validated['facebook_url'],
                'linkedin_url' => $validated['linkedin_url'],
                'remarks' => $validated['remarks'],
            ];

            $profileData['profile_completion'] = $this->completionScore($user->fresh(), $member->fresh(), $profileData);

            MemberProfile::updateOrCreate(
                ['member_id' => $member->id],
                $profileData
            );

            $this->submitApplicationIfMissing($member->fresh());
        });

        return back()->with('success', 'Profile updated successfully.');
    }

    public function updatePhoto(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'photo' => 'required|image|max:5120',
        ]);

        $user = $request->user();
        if ($user->avatar_path) {
            Storage::disk('public')->delete($user->avatar_path);
        }
        $user->avatar_path = $validated['photo']->store('avatars', 'public');
        $user->save();

        if ($user->member?->profile) {
            $user->member->profile->update([
                'profile_completion' => $this->completionScore(
                    $user->fresh(),
                    $user->member->fresh(),
                    $user->member->profile->toArray()
                ),
            ]);
        }

        return back()->with('success', 'Profile picture updated successfully.');
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

            $this->submitApplicationIfMissing($member->fresh(), $validated['reference_name'] ?? null, $validated['reference_phone'] ?? null);

            $profile = $member->profile;
            if ($profile) {
                $profile->update([
                    'profile_completion' => min(100, ($profile->profile_completion ?? 10) + 20),
                ]);
            }
        });

        return back()->with('success', 'Your cadet college details have been saved and your membership application is submitted for verification.');
    }

    private function submitApplicationIfMissing($member, ?string $referenceName = null, ?string $referencePhone = null): void
    {
        if (! $member->college_id || ! $member->college_roll_no) {
            return;
        }

        if ($member->applications()->where('status', 'submitted')->exists()) {
            return;
        }

        MembershipApplication::create([
            'application_no' => SequenceService::next('application_no'),
            'member_id' => $member->id,
            'declared_college_id' => $member->college_id,
            'declared_roll_no' => $member->college_roll_no,
            'reference_name' => $referenceName,
            'reference_phone' => $referencePhone,
            'status' => 'submitted',
            'submitted_at' => now(),
        ]);
    }

    /**
     * @param  array<string, mixed>  $profile
     */
    private function completionScore($user, $member, array $profile): int
    {
        $score = 10;
        if ($member->college_id) {
            $score += 15;
        }
        if ($member->college_roll_no) {
            $score += 5;
        }
        if ($member->house_name) {
            $score += 5;
        }
        if (! empty($profile['cadet_name'])) {
            $score += 5;
        }
        if (! empty($user->phone)) {
            $score += 5;
        }
        if (! empty($profile['blood_group'])) {
            $score += 5;
        }
        if (! empty($profile['address'])) {
            $score += 10;
        }
        if (! empty($profile['job_type'])) {
            $score += 10;
        }
        if (! empty($profile['organization'])) {
            $score += 10;
        }
        if (! empty($profile['designation'])) {
            $score += 10;
        }
        if ($user->avatar_path) {
            $score += 10;
        }

        return min(100, $score);
    }
}
