<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\College;
use App\Models\Industry;
use App\Models\Member;
use App\Models\MembershipVerification;
use App\Services\SequenceService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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

        $members = $query->paginate($request->input('per_page', 10))->withQueryString();

        $colleges = College::where('is_participating', true)->orderBy('name')->get(['id', 'name', 'short_name']);
        $industries = Industry::orderBy('name')->get(['id', 'name']);

        return Inertia::render('admin/members/index', [
            'members' => $members,
            'colleges' => $colleges,
            'industries' => $industries,
            'filters' => $request->only(['search', 'college_id', 'membership_status', 'verification_status', 'industry_id']),
        ]);
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
