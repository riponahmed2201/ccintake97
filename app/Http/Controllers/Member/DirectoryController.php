<?php

namespace App\Http\Controllers\Member;

use App\Http\Controllers\Controller;
use App\Models\College;
use App\Models\Industry;
use App\Models\Member;
use App\Models\MemberConnection;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DirectoryController extends Controller
{
    public function index(Request $request): Response
    {
        $viewer = $request->user()->member;

        if (! $viewer || $viewer->verification_status !== 'verified') {
            abort(403, 'Alumni directory access requires a verified 1997 intake membership.');
        }

        $query = Member::with(['user', 'college', 'profile.industry', 'privacySettings'])
            ->where('verification_status', 'verified')
            ->where('membership_status', 'approved');

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->whereHas('user', fn ($uq) => $uq->where('name', 'like', "%{$search}%"))
                  ->orWhere('member_code', 'like', "%{$search}%")
                  ->orWhereHas('profile', function ($pq) use ($search) {
                      $pq->where('designation', 'like', "%{$search}%")
                         ->orWhere('organization', 'like', "%{$search}%")
                         ->orWhere('city', 'like', "%{$search}%");
                  });
            });
        }

        if ($collegeId = $request->input('college_id')) {
            $query->where('college_id', $collegeId);
        }

        if ($industryId = $request->input('industry_id')) {
            $query->whereHas('profile', fn ($q) => $q->where('industry_id', $industryId));
        }

        if ($country = $request->input('country')) {
            $query->whereHas('profile', fn ($q) => $q->where('country_code', $country));
        }

        $members = $query->paginate(12)->withQueryString();

        // Get connected member IDs for the viewer
        $connectedMemberIds = [];
        if ($viewer) {
            $connectedMemberIds = MemberConnection::where(function ($q) use ($viewer) {
                $q->where('requester_id', $viewer->id)->orWhere('addressee_id', $viewer->id);
            })->where('status', 'accepted')
              ->get()
              ->map(fn ($c) => $c->requester_id === $viewer->id ? $c->addressee_id : $c->requester_id)
              ->toArray();
        }

        // Apply privacy masking to each member
        $members->getCollection()->transform(function ($m) use ($viewer, $connectedMemberIds) {
            $isConnected = $viewer && in_array($m->id, $connectedMemberIds);
            $privacy = $m->privacySettings->pluck('visibility', 'field_key')->toArray();

            // Mask fields according to settings
            if (isset($privacy['phone']) && ($privacy['phone'] === 'private' || ($privacy['phone'] === 'connections' && ! $isConnected)) && $m->id !== $viewer?->id) {
                if ($m->user) $m->user->phone = '[Private]';
            }
            if (isset($privacy['email']) && ($privacy['email'] === 'private' || ($privacy['email'] === 'connections' && ! $isConnected)) && $m->id !== $viewer?->id) {
                if ($m->user) $m->user->email = '[Private]';
            }
            if (isset($privacy['organization']) && $privacy['organization'] === 'private') {
                if ($m->profile) $m->profile->organization = 'Confidential';
            }
            if (isset($privacy['city']) && $privacy['city'] === 'connections' && ! $isConnected && $m->id !== $viewer?->id) {
                if ($m->profile) $m->profile->city = null;
            }
            if (isset($privacy['linkedin']) && $privacy['linkedin'] === 'connections' && ! $isConnected && $m->id !== $viewer?->id) {
                if ($m->profile) $m->profile->linkedin_url = null;
            }

            $m->is_connected = $isConnected;
            return $m;
        });

        $colleges = College::where('is_participating', true)->orderBy('name')->get(['id', 'name', 'short_name']);
        $industries = Industry::orderBy('name')->get(['id', 'name']);

        return Inertia::render('member/directory/index', [
            'members' => $members,
            'colleges' => $colleges,
            'industries' => $industries,
            'filters' => $request->only(['search', 'college_id', 'industry_id', 'country']),
        ]);
    }

    public function show(Request $request, int $id): Response
    {
        $viewer = $request->user()->member;

        $member = Member::with(['user', 'college', 'profile.industry', 'privacySettings', 'businesses', 'mentorshipProfile'])
            ->where('verification_status', 'verified')
            ->findOrFail($id);

        $isConnected = false;
        $connectionStatus = null;
        if ($viewer) {
            $conn = MemberConnection::where(function ($q) use ($viewer, $member) {
                $q->where('requester_id', $viewer->id)->where('addressee_id', $member->id);
            })->orWhere(function ($q) use ($viewer, $member) {
                $q->where('requester_id', $member->id)->where('addressee_id', $viewer->id);
            })->first();

            if ($conn) {
                $connectionStatus = $conn->status;
                $isConnected = $conn->status === 'accepted';
            }
        }

        return Inertia::render('member/directory/show', [
            'member' => $member,
            'isConnected' => $isConnected,
            'connectionStatus' => $connectionStatus,
        ]);
    }
}
