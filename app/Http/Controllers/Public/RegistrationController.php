<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Member;
use App\Models\MemberPrivacySetting;
use App\Models\MemberProfile;
use App\Models\User;
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
        return Inertia::render('auth/register-alumni');
    }

    public function store(Request $request): RedirectResponse
    {
        // Registration collects only the essentials; professional details,
        // location and references are completed later from the member profile.
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = null;

        DB::transaction(function () use ($validated, &$user) {
            // 1. User
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'phone' => null,
                'password' => Hash::make($validated['password']),
                'account_status' => 'active',
                'is_demo' => false,
                'last_activity_at' => now(),
            ]);
            $user->syncRoles(['regular_member']);

            // 2. Member
            $member = Member::create([
                'user_id' => $user->id,
                'college_id' => null,
                'college_roll_no' => null,
                'intake_year' => 1997,
                'membership_status' => 'pending',
                'verification_status' => 'unverified',
            ]);

            // 3. Member Profile
            MemberProfile::create([
                'member_id' => $member->id,
                'country_code' => 'BD',
                'profile_completion' => 10,
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

        });

        Auth::login($user);

        return redirect()->route('member.dashboard')->with('success', 'Welcome! Complete your profile—including cadet college and roll number—to submit your membership application.');
    }
}
