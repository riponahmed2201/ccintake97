<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\College;
use App\Models\Industry;
use App\Models\Member;
use App\Models\MemberPrivacySetting;
use App\Models\MemberProfile;
use App\Models\MembershipApplication;
use App\Models\User;
use App\Services\SequenceService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class RegistrationController extends Controller
{
    public function create(): Response
    {
        $colleges = College::where('is_participating', true)->orderBy('display_order')->get(['id', 'name', 'short_name']);
        $industries = Industry::orderBy('name')->get(['id', 'name']);

        return Inertia::render('auth/register-alumni', [
            'colleges' => $colleges,
            'industries' => $industries,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'phone' => 'nullable|string|max:30',
            'college_id' => 'required|exists:colleges,id',
            'college_roll_no' => 'required|string|max:50',
            'designation' => 'nullable|string|max:150',
            'organization' => 'nullable|string|max:150',
            'industry_id' => 'nullable|exists:industries,id',
            'city' => 'nullable|string|max:100',
            'country_code' => 'required|string|max:5',
            'reference_name' => 'nullable|string|max:150',
            'reference_phone' => 'nullable|string|max:50',
        ]);

        $user = null;

        DB::transaction(function () use ($validated, &$user) {
            // 1. User
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'phone' => $validated['phone'] ?? null,
                'password' => Hash::make($validated['password']),
                'account_status' => 'active',
                'is_demo' => false,
                'last_activity_at' => now(),
            ]);
            $user->syncRoles(['regular_member']);

            // 2. Member
            $member = Member::create([
                'user_id' => $user->id,
                'college_id' => $validated['college_id'],
                'college_roll_no' => $validated['college_roll_no'],
                'intake_year' => 1997,
                'membership_status' => 'pending',
                'verification_status' => 'unverified',
            ]);

            // 3. Member Profile
            MemberProfile::create([
                'member_id' => $member->id,
                'designation' => $validated['designation'] ?? null,
                'organization' => $validated['organization'] ?? null,
                'industry_id' => $validated['industry_id'] ?? null,
                'city' => $validated['city'] ?? null,
                'country_code' => $validated['country_code'] ?? 'BD',
                'profile_completion' => 40,
            ]);

            // 4. Default privacy settings
            $privacyKeys = ['photo', 'organization', 'designation', 'country', 'city', 'linkedin', 'date_of_birth'];
            foreach ($privacyKeys as $key) {
                MemberPrivacySetting::create([
                    'member_id' => $member->id,
                    'field_key' => $key,
                    'visibility' => in_array($key, ['date_of_birth', 'city']) ? 'connections' : 'verified_members',
                ]);
            }

            // 5. Membership Application
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
        });

        Auth::login($user);

        return redirect()->route('member.dashboard')->with('success', 'Your membership application for INTAKE 97 has been submitted for verification!');
    }
}
