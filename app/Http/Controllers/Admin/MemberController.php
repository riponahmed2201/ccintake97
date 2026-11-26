<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\College;
use App\Models\Industry;
use App\Models\Member;
use App\Models\MemberPrivacySetting;
use App\Models\MemberProfile;
use App\Models\MembershipVerification;
use App\Models\User;
use App\Services\SequenceService;
use App\Support\CadetProfileOptions;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class MemberController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Member::with(['user', 'college', 'profile.industry'])
            ->latest('id');

        // Search
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('member_code', 'like', "%{$search}%")
                  ->orWhere('college_roll_no', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($uq) use ($search) {
                      $uq->where('name', 'like', "%{$search}%")
                         ->orWhere('email', 'like', "%{$search}%");
                  })
                  ->orWhereHas('profile', function ($pq) use ($search) {
                      $pq->where('organization', 'like', "%{$search}%")
                         ->orWhere('designation', 'like', "%{$search}%");
                  });
            });
        }

        // Filters
        if ($collegeId = $request->input('college_id')) {
            $query->where('college_id', $collegeId);
        }
        if ($membershipStatus = $request->input('membership_status')) {
            $query->where('membership_status', $membershipStatus);
        }
        if ($verificationStatus = $request->input('verification_status')) {
            $query->where('verification_status', $verificationStatus);
        }
        if ($industryId = $request->input('industry_id')) {
            $query->whereHas('profile', fn ($q) => $q->where('industry_id', $industryId));
        }

        $perPage = (int) $request->input('per_page', 10);
        if (! in_array($perPage, [10, 25, 50, 100], true)) {
            $perPage = 10;
        }

        $members = $query->paginate($perPage)->withQueryString();

        $colleges = College::where('is_participating', true)->orderBy('name')->get(['id', 'name', 'short_name']);
        $industries = Industry::orderBy('name')->get(['id', 'name']);

        return Inertia::render('admin/members/index', [
            'members' => $members,
            'colleges' => $colleges,
            'industries' => $industries,
            'houses' => CadetProfileOptions::HOUSES,
            'filters' => array_merge(
                $request->only(['search', 'college_id', 'membership_status', 'verification_status', 'industry_id']),
                ['per_page' => (string) $perPage]
            ),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        foreach (['phone', 'college_id', 'college_roll_no', 'house_name'] as $field) {
            if ($request->input($field) === '') {
                $request->merge([$field => null]);
            }
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'phone' => 'nullable|string|max:30',
            'password' => 'required|string|min:8',
            'college_id' => 'nullable|exists:colleges,id',
            'college_roll_no' => 'nullable|string|max:50',
            'intake_year' => 'nullable|integer|min:1950|max:2035',
            'house_name' => 'nullable|string|max:100',
            'membership_status' => 'required|in:pending,approved',
            'verification_status' => 'required|in:unverified,verified',
        ]);

        $member = null;

        DB::transaction(function () use ($validated, &$member) {
            $isVerified = $validated['verification_status'] === 'verified';
            $membershipStatus = $isVerified ? 'approved' : $validated['membership_status'];
            $isApproved = $membershipStatus === 'approved';

            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'phone' => $validated['phone'] ?? null,
                'password' => Hash::make($validated['password']),
                'account_status' => 'active',
                'email_verified_at' => now(),
                'is_demo' => false,
                'last_activity_at' => now(),
            ]);
            $user->syncRoles([$isVerified ? 'verified_member' : 'regular_member']);

            $member = Member::create([
                'user_id' => $user->id,
                'member_code' => $isApproved ? SequenceService::next('member_code') : null,
                'college_id' => $validated['college_id'] ?? null,
                'college_roll_no' => $validated['college_roll_no'] ?? null,
                'intake_year' => $validated['intake_year'] ?? 1997,
                'house_name' => $validated['house_name'] ?? null,
                'membership_status' => $membershipStatus,
                'verification_status' => $validated['verification_status'],
                'approved_at' => $isApproved ? now() : null,
                'verified_at' => $isVerified ? now() : null,
            ]);

            MemberProfile::create([
                'member_id' => $member->id,
                'country_code' => 'BD',
                'profile_completion' => 15,
            ]);

            foreach (['photo', 'organization', 'designation', 'country', 'city', 'linkedin', 'date_of_birth'] as $key) {
                MemberPrivacySetting::create([
                    'member_id' => $member->id,
                    'field_key' => $key,
                    'visibility' => in_array($key, ['date_of_birth', 'city'], true) ? 'connections' : 'verified_members',
                ]);
            }
        });

        AuditLog::log('member.created_by_admin', 'members', $member->id, null, $member->fresh()->toArray());

        return back()->with('success', "Member {$validated['name']} registered successfully.");
    }

    public function edit(int $id): Response
    {
        $member = Member::with(['user', 'college', 'profile.industry'])->findOrFail($id);

        return Inertia::render('admin/members/edit', [
            'member' => $member,
            'colleges' => College::where('is_participating', true)->orderBy('display_order')->get(['id', 'name', 'short_name']),
            'industries' => Industry::orderBy('name')->get(['id', 'name']),
            'houses' => CadetProfileOptions::HOUSES,
            'houseColors' => CadetProfileOptions::HOUSE_COLORS,
            'bloodGroups' => CadetProfileOptions::BLOOD_GROUPS,
            'jobTypes' => CadetProfileOptions::JOB_TYPES,
        ]);
    }

    public function update(Request $request, int $id): RedirectResponse
    {
        $member = Member::with(['user', 'profile'])->findOrFail($id);
        $previousState = $member->toArray();

        foreach ([
            'phone', 'password', 'member_code', 'college_id', 'college_roll_no', 'house_name', 'house_color',
            'cadet_name', 'cccl_life_member_no', 'gender', 'date_of_birth', 'blood_group',
            'spouse_name', 'spouse_occupation', 'spouse_job_location',
            'present_address_line', 'present_area', 'city', 'present_postal_code', 'country_code',
            'permanent_address_line', 'permanent_area', 'permanent_city', 'permanent_postal_code', 'permanent_country_code',
            'job_type', 'designation', 'organization', 'industry_id', 'office_address', 'office_phone',
            'professional_bio', 'facebook_url', 'linkedin_url', 'website_url', 'remarks',
        ] as $field) {
            if ($request->input($field) === '') {
                $request->merge([$field => null]);
            }
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => "required|email|max:255|unique:users,email,{$member->user_id}",
            'phone' => 'nullable|string|max:30',
            'password' => 'nullable|string|min:8',
            'account_status' => 'required|in:active,pending,suspended,archived',
            'member_code' => "nullable|string|max:50|unique:members,member_code,{$member->id}",
            'membership_status' => 'required|in:pending,approved,rejected,suspended',
            'verification_status' => 'required|in:unverified,pending,verified,rejected',
            'college_id' => 'nullable|exists:colleges,id',
            'college_roll_no' => 'nullable|string|max:50',
            'intake_year' => 'nullable|integer|min:1950|max:2035',
            'house_name' => 'nullable|string|max:100',
            'house_color' => ['nullable', \Illuminate\Validation\Rule::in(CadetProfileOptions::HOUSE_COLORS)],
            'cadet_name' => 'nullable|string|max:255',
            'cccl_life_member_no' => 'nullable|string|max:100',
            'gender' => 'nullable|in:male,female,other',
            'date_of_birth' => 'nullable|date',
            'blood_group' => ['nullable', \Illuminate\Validation\Rule::in(CadetProfileOptions::BLOOD_GROUPS)],
            'spouse_name' => 'nullable|string|max:255',
            'spouse_occupation' => 'nullable|string|max:255',
            'spouse_job_location' => 'nullable|string|max:255',
            'children_names' => 'nullable|array|max:10',
            'children_names.*' => 'nullable|string|max:255',
            'present_address_line' => 'nullable|string|max:255',
            'present_area' => 'nullable|string|max:150',
            'city' => 'nullable|string|max:150',
            'present_postal_code' => 'nullable|string|max:30',
            'country_code' => 'nullable|string|max:5',
            'same_as_present_address' => 'nullable|boolean',
            'permanent_address_line' => 'nullable|string|max:255',
            'permanent_area' => 'nullable|string|max:150',
            'permanent_city' => 'nullable|string|max:150',
            'permanent_postal_code' => 'nullable|string|max:30',
            'permanent_country_code' => 'nullable|string|max:5',
            'job_type' => ['nullable', \Illuminate\Validation\Rule::in(CadetProfileOptions::JOB_TYPES)],
            'designation' => 'nullable|string|max:150',
            'organization' => 'nullable|string|max:150',
            'industry_id' => 'nullable|exists:industries,id',
            'office_address' => 'nullable|string|max:500',
            'office_phone' => 'nullable|string|max:30',
            'professional_bio' => 'nullable|string|max:2000',
            'owns_business' => 'nullable|boolean',
            'facebook_url' => 'nullable|url|max:255',
            'linkedin_url' => 'nullable|url|max:255',
            'website_url' => 'nullable|url|max:255',
            'remarks' => 'nullable|string|max:2000',
        ]);

        $children = collect($validated['children_names'] ?? [])
            ->map(fn ($name) => trim((string) $name))
            ->filter()
            ->values()
            ->all();

        DB::transaction(function () use ($member, $validated, $children) {
            $userData = [
                'name' => $validated['name'],
                'email' => $validated['email'],
                'phone' => $validated['phone'] ?? null,
                'account_status' => $validated['account_status'],
            ];
            if (! empty($validated['password'])) {
                $userData['password'] = Hash::make($validated['password']);
            }
            $member->user->update($userData);

            $isApproved = $validated['membership_status'] === 'approved';
            $isVerified = $validated['verification_status'] === 'verified';
            $memberCode = $validated['member_code'] ?? $member->member_code;
            if (! $memberCode && ($isApproved || $isVerified)) {
                $memberCode = SequenceService::next('member_code');
            }

            $member->update([
                'member_code' => $memberCode,
                'membership_status' => $validated['membership_status'],
                'verification_status' => $validated['verification_status'],
                'approved_at' => $isApproved ? ($member->approved_at ?? now()) : null,
                'verified_at' => $isVerified ? ($member->verified_at ?? now()) : null,
                'college_id' => $validated['college_id'] ?? null,
                'college_roll_no' => $validated['college_roll_no'] ?? null,
                'intake_year' => $validated['intake_year'] ?? $member->intake_year ?? 1997,
                'house_name' => $validated['house_name'] ?? null,
                'house_color' => $validated['house_color'] ?? null,
            ]);

            if (! $member->user->hasAnyRole(['super_admin', 'association_admin', 'college_admin'])) {
                $member->user->syncRoles([$isVerified ? 'verified_member' : 'regular_member']);
            }

            $sameAsPresent = (bool) ($validated['same_as_present_address'] ?? false);
            $countryCode = $validated['country_code'] ?? $member->profile?->country_code ?: 'BD';
            $presentParts = array_filter([
                $validated['present_address_line'] ?? null,
                $validated['present_area'] ?? null,
                $validated['city'] ?? null,
                $validated['present_postal_code'] ?? null,
            ]);

            MemberProfile::updateOrCreate(
                ['member_id' => $member->id],
                [
                    'cadet_name' => $validated['cadet_name'] ?? null,
                    'cccl_life_member_no' => $validated['cccl_life_member_no'] ?? null,
                    'gender' => $validated['gender'] ?? null,
                    'date_of_birth' => $validated['date_of_birth'] ?? null,
                    'blood_group' => $validated['blood_group'] ?? null,
                    'spouse_name' => $validated['spouse_name'] ?? null,
                    'spouse_occupation' => $validated['spouse_occupation'] ?? null,
                    'spouse_job_location' => $validated['spouse_job_location'] ?? null,
                    'children_names' => $children === [] ? null : $children,
                    'address' => $presentParts !== [] ? implode(', ', $presentParts) : $member->profile?->address,
                    'present_address_line' => $validated['present_address_line'] ?? null,
                    'present_area' => $validated['present_area'] ?? null,
                    'city' => $validated['city'] ?? null,
                    'present_postal_code' => $validated['present_postal_code'] ?? null,
                    'country_code' => $countryCode,
                    'same_as_present_address' => $sameAsPresent,
                    'permanent_address_line' => $sameAsPresent ? ($validated['present_address_line'] ?? null) : ($validated['permanent_address_line'] ?? null),
                    'permanent_area' => $sameAsPresent ? ($validated['present_area'] ?? null) : ($validated['permanent_area'] ?? null),
                    'permanent_city' => $sameAsPresent ? ($validated['city'] ?? null) : ($validated['permanent_city'] ?? null),
                    'permanent_postal_code' => $sameAsPresent ? ($validated['present_postal_code'] ?? null) : ($validated['permanent_postal_code'] ?? null),
                    'permanent_country_code' => $sameAsPresent ? $countryCode : ($validated['permanent_country_code'] ?? 'BD'),
                    'job_type' => $validated['job_type'] ?? null,
                    'designation' => $validated['designation'] ?? null,
                    'organization' => $validated['organization'] ?? null,
                    'industry_id' => $validated['industry_id'] ?? null,
                    'office_address' => $validated['office_address'] ?? null,
                    'office_phone' => $validated['office_phone'] ?? null,
                    'professional_bio' => $validated['professional_bio'] ?? null,
                    'owns_business' => (bool) ($validated['owns_business'] ?? false),
                    'facebook_url' => $validated['facebook_url'] ?? null,
                    'linkedin_url' => $validated['linkedin_url'] ?? null,
                    'website_url' => $validated['website_url'] ?? null,
                    'remarks' => $validated['remarks'] ?? null,
                ]
            );
        });

        AuditLog::log('member.updated_by_admin', 'members', $member->id, $previousState, $member->fresh(['user', 'profile'])->toArray());

        return redirect()->route('admin.members.index')->with('success', "Member {$validated['name']} updated successfully.");
    }

    public function show(int $id): Response
    {
        $member = Member::with([
            'user',
            'college',
            'profile.industry',
            'privacySettings',
            'applications.declaredCollege',
            'verifications.verifiedBy',
            'businesses',
            'committeeMemberships.committee',
        ])->findOrFail($id);

        $auditLogs = AuditLog::with('user')
            ->where('module', 'members')
            ->where('record_id', $member->id)
            ->latest()
            ->limit(10)
            ->get();

        return Inertia::render('admin/members/show', [
            'member' => $member,
            'auditLogs' => $auditLogs,
        ]);
    }

    public function approve(int $id): RedirectResponse
    {
        $member = Member::findOrFail($id);
        $previousState = $member->toArray();

        DB::transaction(function () use ($member) {
            if (! $member->member_code) {
                $member->member_code = SequenceService::next('member_code');
            }
            $member->membership_status = 'approved';
            $member->approved_at = now();
            $member->save();

            $member->user->syncRoles(['regular_member']);
        });

        AuditLog::log('member.approved', 'members', $member->id, $previousState, $member->fresh()->toArray());

        return back()->with('success', "Member {$member->member_code} approved successfully.");
    }

    public function verify(Request $request, int $id): RedirectResponse
    {
        $request->validate([
            'method' => 'required|string|in:committee_manual,college_record,alumni_reference,document_proof',
            'evidence_note' => 'required|string|max:1000',
        ]);

        $member = Member::findOrFail($id);
        $previousState = $member->toArray();

        DB::transaction(function () use ($request, $member) {
            if ($member->membership_status !== 'approved') {
                $member->membership_status = 'approved';
                $member->approved_at = now();
            }
            if (! $member->member_code) {
                $member->member_code = SequenceService::next('member_code');
            }

            $member->verification_status = 'verified';
            $member->verified_at = now();
            $member->save();

            MembershipVerification::create([
                'member_id' => $member->id,
                'method' => $request->input('method'),
                'result' => 'passed',
                'evidence_note' => $request->input('evidence_note'),
                'verified_by' => auth()->id(),
                'verified_at' => now(),
            ]);

            $member->user->syncRoles(['verified_member']);
        });

        AuditLog::log('member.verified', 'members', $member->id, $previousState, $member->fresh()->toArray());

        return back()->with('success', "Member {$member->member_code} verified as authentic 1997 Cadet College intake alumnus.");
    }

    public function suspend(Request $request, int $id): RedirectResponse
    {
        $request->validate([
            'reason' => 'required|string|max:500',
        ]);

        $member = Member::findOrFail($id);
        $previousState = $member->toArray();

        $member->membership_status = 'suspended';
        $member->suspended_at = now();
        $member->suspension_reason = $request->input('reason');
        $member->save();

        $member->user->update(['account_status' => 'suspended']);

        AuditLog::log('member.suspended', 'members', $member->id, $previousState, $member->fresh()->toArray());

        return back()->with('success', 'Member suspended.');
    }

    public function reactivate(int $id): RedirectResponse
    {
        $member = Member::findOrFail($id);
        $previousState = $member->toArray();

        $member->membership_status = 'approved';
        $member->suspended_at = null;
        $member->suspension_reason = null;
        $member->save();

        $member->user->update(['account_status' => 'active']);

        AuditLog::log('member.reactivated', 'members', $member->id, $previousState, $member->fresh()->toArray());

        return back()->with('success', 'Member reactivated successfully.');
    }

    public function assignCode(int $id): RedirectResponse
    {
        $member = Member::findOrFail($id);
        if ($member->member_code) {
            return back()->with('error', 'Member code is already assigned.');
        }

        $code = SequenceService::next('member_code');
        $member->update(['member_code' => $code]);

        AuditLog::log('member.code_assigned', 'members', $member->id, null, ['member_code' => $code]);

        return back()->with('success', "Assigned member code: {$code}");
    }

    public function export(Request $request): StreamedResponse
    {
        $members = Member::with(['user', 'college', 'profile.industry'])->get();

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="intake97_members_' . date('Y-m-d') . '.csv"',
        ];

        return response()->stream(function () use ($members) {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, ['Member ID', 'Name', 'Email', 'Cadet College', 'Roll No', 'Membership Status', 'Verification Status', 'Designation', 'Organization']);

            foreach ($members as $m) {
                fputcsv($handle, [
                    $m->member_code ?? 'N/A',
                    $m->user->name ?? '',
                    $m->user->email ?? '',
                    $m->college->name ?? '',
                    $m->college_roll_no ?? '',
                    $m->membership_status,
                    $m->verification_status,
                    $m->profile->designation ?? '',
                    $m->profile->organization ?? '',
                ]);
            }
            fclose($handle);
        }, 200, $headers);
    }
}
