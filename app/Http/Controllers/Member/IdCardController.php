<?php

namespace App\Http\Controllers\Member;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class IdCardController extends Controller
{
    public function show(Request $request): Response|RedirectResponse
    {
        $user = $request->user();
        if (! $user->member) {
            return redirect()->route('member.dashboard')->with('info', 'Digital Alumni ID is only available for alumni member accounts.');
        }

        $member = $user->member->load(['user', 'college', 'profile.industry']);

        // Generate or retrieve QR verification payload
        $qrPayload = [
            'type' => 'INTAKE97_ALUMNI_ID',
            'member_code' => $member->member_code,
            'name' => $user->name,
            'college' => $member->college?->name,
            'verification' => $member->verification_status,
            'token' => sha1($member->id . '-' . $member->created_at),
        ];

        return Inertia::render('member/id-card', [
            'member' => $member,
            'photoUrl' => $user->avatar_path ? asset('storage/'.ltrim($user->avatar_path, '/')) : null,
            'qrPayload' => json_encode($qrPayload),
        ]);
    }
}
