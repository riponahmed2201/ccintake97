<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ApplicationReview;
use App\Models\AuditLog;
use App\Models\College;
use App\Models\MembershipApplication;
use App\Services\SequenceService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ApplicationController extends Controller
{
    public function index(Request $request): Response
    {
        $query = MembershipApplication::with(['member.user', 'declaredCollege'])
            ->latest('submitted_at');

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('application_no', 'like', "%{$search}%")
                  ->orWhere('declared_roll_no', 'like', "%{$search}%")
                  ->orWhereHas('member.user', function ($uq) use ($search) {
                      $uq->where('name', 'like', "%{$search}%")
                         ->orWhere('email', 'like', "%{$search}%");
                  });
            });
        }

        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        if ($collegeId = $request->input('college_id')) {
            $query->where('declared_college_id', $collegeId);
        }

        $perPage = (int) $request->input('per_page', 10);
        if (! in_array($perPage, [10, 25, 50, 100], true)) {
            $perPage = 10;
        }

        $applications = $query->paginate($perPage)->withQueryString();
        $colleges = College::where('is_participating', true)->orderBy('name')->get(['id', 'name', 'short_name']);

        $statusCounts = MembershipApplication::query()
            ->selectRaw('status, count(*) as aggregate')
            ->groupBy('status')
            ->pluck('aggregate', 'status');

        return Inertia::render('admin/applications/index', [
            'applications' => $applications,
            'colleges' => $colleges,
            'counts' => [
                'total' => (int) $statusCounts->sum(),
                'submitted' => (int) ($statusCounts['submitted'] ?? 0),
                'under_review' => (int) ($statusCounts['under_review'] ?? 0),
                'info_required' => (int) ($statusCounts['info_required'] ?? 0),
                'approved' => (int) ($statusCounts['approved'] ?? 0),
                'rejected' => (int) ($statusCounts['rejected'] ?? 0),
            ],
            'filters' => array_merge(
                $request->only(['search', 'status', 'college_id']),
                ['per_page' => (string) $perPage]
            ),
        ]);
    }

    public function show(int $id): Response
    {
        $application = MembershipApplication::with([
            'member.user',
            'member.profile',
            'declaredCollege',
            'reviews.actor',
        ])->findOrFail($id);

        return Inertia::render('admin/applications/show', [
            'application' => $application,
        ]);
    }

    public function decide(Request $request, int $id): RedirectResponse
    {
        $request->validate([
            'status' => 'required|string|in:under_review,info_required,approved,rejected',
            'note' => 'nullable|string|max:1000',
        ]);

        $app = MembershipApplication::with('member.user')->findOrFail($id);
        $previousStatus = $app->status;
        $newStatus = $request->input('status');

        DB::transaction(function () use ($app, $previousStatus, $newStatus, $request) {
            $app->status = $newStatus;
            $app->decided_at = now();
            $app->decision_note = $request->input('note');
            $app->save();

            ApplicationReview::create([
                'application_id' => $app->id,
                'actor_id' => auth()->id(),
                'action' => 'status_transition',
                'from_status' => $previousStatus,
                'to_status' => $newStatus,
                'note' => $request->input('note'),
                'is_internal' => true,
            ]);

            // Synchronize member state
            $member = $app->member;
            if ($newStatus === 'approved') {
                if (! $member->member_code) {
                    $member->member_code = SequenceService::next('member_code');
                }
                $member->membership_status = 'approved';
                $member->approved_at = now();
                $member->save();

                $member->user->syncRoles(['regular_member']);
            } elseif ($newStatus === 'rejected') {
                $member->membership_status = 'rejected';
                $member->save();
            } elseif ($newStatus === 'under_review') {
                $member->membership_status = 'under_review';
                $member->save();
            }
        });

        AuditLog::log('application.decided', 'applications', $app->id, ['status' => $previousStatus], ['status' => $newStatus, 'note' => $request->input('note')]);

        return back()->with('success', "Application {$app->application_no} status changed to {$newStatus}.");
    }
}
