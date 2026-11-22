<?php

namespace App\Http\Controllers\Member;

use App\Http\Controllers\Controller;
use App\Models\MemberFavorite;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FavoriteController extends Controller
{
    public function index(Request $request): Response
    {
        $member = $request->user()->member;
        $favorites = $member ? MemberFavorite::with('favoritable')
            ->where('member_id', $member->id)
            ->latest()
            ->paginate(12) : collect();

        return Inertia::render('member/favorites/index', [
            'favorites' => $favorites,
        ]);
    }

    public function toggle(Request $request): RedirectResponse
    {
        $member = $request->user()->member;
        if (! $member) abort(403);

        $request->validate([
            'favoritable_type' => 'required|string',
            'favoritable_id' => 'required|integer',
        ]);

        $existing = MemberFavorite::where('member_id', $member->id)
            ->where('favoritable_type', $request->input('favoritable_type'))
            ->where('favoritable_id', $request->input('favoritable_id'))
            ->first();

        if ($existing) {
            $existing->delete();
            return back()->with('info', 'Item removed from favorites.');
        }

        MemberFavorite::create([
            'member_id' => $member->id,
            'favoritable_type' => $request->input('favoritable_type'),
            'favoritable_id' => $request->input('favoritable_id'),
        ]);

        return back()->with('success', 'Item saved to favorites.');
    }
}
