<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Committee;
use App\Models\CommitteeMember;
use App\Models\Member;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class CommitteeController extends Controller
{
    public function index(): Response
    {
        $committees = Committee::with(['headMember.user', 'members.member.user', 'members.member.college'])
            ->orderBy('display_order')
            ->get();

        $approvedMembers = Member::with(['user', 'college'])
            ->where('membership_status', 'approved')
            ->get();

        return Inertia::render('admin/committees/index', [
            'committees' => $committees,
            'approvedMembers' => $approvedMembers,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'head_member_id' => 'nullable|exists:members,id',
            'term_start' => 'nullable|date',
            'term_end' => 'nullable|date|after_or_equal:term_start',
            'status' => 'required|in:active,past',
            'display_order' => 'integer',
        ]);

        $validated['slug'] = Str::slug($validated['name']) . '-' . Str::random(4);

        $committee = Committee::create($validated);
        AuditLog::log('committee.created', 'committees', $committee->id, null, $committee->toArray());

        return back()->with('success', "Committee '{$committee->name}' created.");
    }

    public function assignMember(Request $request, int $committeeId): RedirectResponse
    {
        $request->validate([
            'member_id' => 'required|exists:members,id',
            'position_title' => 'required|string|max:255',
            'role_type' => 'required|string|max:50',
            'display_order' => 'integer',
        ]);

        CommitteeMember::create([
            'committee_id' => $committeeId,
            'member_id' => $request->input('member_id'),
            'position_title' => $request->input('position_title'),
            'role_type' => $request->input('role_type'),
            'display_order' => $request->input('display_order', 0),
            'start_date' => now(),
        ]);

        AuditLog::log('committee.member_assigned', 'committees', $committeeId, null, $request->all());

        return back()->with('success', 'Committee member assigned successfully.');
    }

    public function removeMember(int $id): RedirectResponse
    {
        $cm = CommitteeMember::findOrFail($id);
        $cm->delete();

        AuditLog::log('committee.member_removed', 'committees', $cm->committee_id, null, ['committee_member_id' => $id]);

        return back()->with('success', 'Committee member removed.');
    }
}
