<?php

namespace App\Http\Controllers\Member;

use App\Http\Controllers\Controller;
use App\Models\Member;
use App\Models\MemberConnection;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ConnectionController extends Controller
{
    public function index(Request $request): Response
    {
        $member = $request->user()->member;
        if (! $member) {
            abort(403, 'Member account not initialized.');
        }

        // Active connections
        $connections = MemberConnection::with(['requester.user', 'requester.college', 'requester.profile', 'addressee.user', 'addressee.college', 'addressee.profile'])
            ->where(function ($q) use ($member) {
                $q->where('requester_id', $member->id)->orWhere('addressee_id', $member->id);
            })
            ->where('status', 'accepted')
            ->get();

        // Pending incoming
        $incoming = MemberConnection::with(['requester.user', 'requester.college', 'requester.profile'])
            ->where('addressee_id', $member->id)
            ->where('status', 'pending')
            ->get();

        // Pending outgoing
        $outgoing = MemberConnection::with(['addressee.user', 'addressee.college', 'addressee.profile'])
            ->where('requester_id', $member->id)
            ->where('status', 'pending')
            ->get();

        // Suggested batchmates
        $connectedIds = $connections->map(fn ($c) => $c->requester_id === $member->id ? $c->addressee_id : $c->requester_id)->toArray();
        $pendingIds = $outgoing->pluck('addressee_id')->merge($incoming->pluck('requester_id'))->toArray();
        $excludeIds = array_merge([$member->id], $connectedIds, $pendingIds);

        $suggestions = Member::with(['user', 'college', 'profile'])
            ->whereNotIn('id', $excludeIds)
            ->where('verification_status', 'verified')
            ->where('college_id', $member->college_id)
            ->limit(6)
            ->get();

        return Inertia::render('member/connections/index', [
            'connections' => $connections,
            'incoming' => $incoming,
            'outgoing' => $outgoing,
            'suggestions' => $suggestions,
        ]);
    }

    public function send(Request $request, int $memberId): RedirectResponse
    {
        $viewer = $request->user()->member;
        if (! $viewer) abort(403);
        if ($viewer->id === $memberId) return back()->with('error', 'Cannot connect with yourself.');

        $existing = MemberConnection::where(function ($q) use ($viewer, $memberId) {
            $q->where('requester_id', $viewer->id)->where('addressee_id', $memberId);
        })->orWhere(function ($q) use ($viewer, $memberId) {
            $q->where('requester_id', $memberId)->where('addressee_id', $viewer->id);
        })->first();

        if ($existing) {
            return back()->with('info', 'A connection or request already exists.');
        }

        MemberConnection::create([
            'requester_id' => $viewer->id,
            'addressee_id' => $memberId,
            'status' => 'pending',
        ]);

        return back()->with('success', 'Connection request sent.');
    }

    public function accept(Request $request, int $id): RedirectResponse
    {
        $viewer = $request->user()->member;
        $conn = MemberConnection::where('id', $id)
            ->where('addressee_id', $viewer->id)
            ->firstOrFail();

        $conn->update(['status' => 'accepted']);

        return back()->with('success', 'Connection request accepted.');
    }

    public function reject(Request $request, int $id): RedirectResponse
    {
        $viewer = $request->user()->member;
        $conn = MemberConnection::where('id', $id)
            ->where('addressee_id', $viewer->id)
            ->firstOrFail();

        $conn->update(['status' => 'rejected']);

        return back()->with('success', 'Connection request declined.');
    }

    public function remove(Request $request, int $id): RedirectResponse
    {
        $viewer = $request->user()->member;
        $conn = MemberConnection::where('id', $id)
            ->where(function ($q) use ($viewer) {
                $q->where('requester_id', $viewer->id)->orWhere('addressee_id', $viewer->id);
            })->firstOrFail();

        $conn->delete();

        return back()->with('success', 'Connection removed.');
    }
}
