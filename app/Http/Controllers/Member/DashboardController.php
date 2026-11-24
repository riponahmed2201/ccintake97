<?php

namespace App\Http\Controllers\Member;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\Event;
use App\Models\EventRegistration;
use App\Models\Member;
use App\Models\MemberConnection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $member = $user->member ? $user->member->load(['user', 'college', 'profile.industry', 'privacySettings']) : null;

        $upcomingEvents = Event::with('category')
            ->where('status', 'published')
            ->where('starts_on', '>=', now()->toDateString())
            ->orderBy('starts_on')
            ->limit(3)
            ->get();

        $myRegistrations = $member ? EventRegistration::with('event')
            ->where('member_id', $member->id)
            ->latest()
            ->limit(3)
            ->get() : collect();

        $latestAnnouncements = Article::with('category')
            ->where('status', 'published')
            ->latest('published_at')
            ->limit(3)
            ->get();

        $connectionsCount = $member ? MemberConnection::where(function ($q) use ($member) {
            $q->where('requester_id', $member->id)->orWhere('addressee_id', $member->id);
        })->where('status', 'accepted')->count() : 0;

        $pendingRequestsCount = $member ? MemberConnection::where('addressee_id', $member->id)
            ->where('status', 'pending')
            ->count() : 0;

        $featuredScope = $member && $member->college_id ? 'college' : 'batch';

        $featuredBatchmates = $member ? Member::with(['user', 'college', 'profile.industry'])
            ->where('id', '!=', $member->id)
            ->where('verification_status', 'verified')
            ->when($featuredScope === 'college', fn ($query) => $query->where('college_id', $member->college_id))
            ->limit(4)
            ->get() : collect();

        $unreadNotificationsCount = DB::table('notifications')
            ->where('notifiable_id', $user->id)
            ->whereNull('read_at')
            ->count();

        return Inertia::render('member/dashboard', [
            'member' => $member,
            'upcomingEvents' => $upcomingEvents,
            'myRegistrations' => $myRegistrations,
            'latestAnnouncements' => $latestAnnouncements,
            'connectionsCount' => $connectionsCount,
            'pendingRequestsCount' => $pendingRequestsCount,
            'featuredBatchmates' => $featuredBatchmates,
            'featuredScope' => $featuredScope,
            'unreadNotificationsCount' => $unreadNotificationsCount,
        ]);
    }
}
