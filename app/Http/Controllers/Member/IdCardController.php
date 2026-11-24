<?php

namespace App\Http\Controllers\Member;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class IdCardController extends Controller
{
    public function show(Request $request): Response
    {
        $user = $request->user();
        $member = $user->member->load(['college', 'profile.industry']);

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
            'qrPayload' => json_encode($qrPayload),
        ]);
    }
}
