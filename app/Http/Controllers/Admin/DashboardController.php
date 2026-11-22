<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Article;
use App\Models\Business;
use App\Models\College;
use App\Models\Committee;
use App\Models\Event;
use App\Models\EventRegistration;
use App\Models\Initiative;
use App\Models\Member;
use App\Models\MembershipApplication;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        // 1. Database KPIs
        $totalMembers = Member::count();
        $verifiedMembers = Member::where('verification_status', 'verified')->count();
        $pendingApplications = MembershipApplication::where('status', 'submitted')->count();
        $rejectedApplications = MembershipApplication::where('status', 'rejected')->count();
        $suspendedMembers = Member::where('membership_status', 'suspended')->count();
        $participatingColleges = College::where('is_participating', true)->count();
        $upcomingEvents = Event::where('status', 'published')
            ->where('starts_on', '>=', now()->toDateString())
            ->count();
        $totalEventRegistrations = EventRegistration::count();
        $publishedNews = Article::where('status', 'published')->count();
        $pendingBusinesses = Business::where('status', 'pending')->count();
        $activeCommittees = Committee::where('status', 'active')->count();
        $communityInitiatives = Initiative::where('status', 'active')->count();

        // 2. College-wise Member Distribution
        $collegeDistribution = College::where('is_participating', true)
            ->withCount('members')
            ->orderBy('display_order')
            ->get(['id', 'name', 'short_name'])
            ->map(fn ($c) => [
                'name' => $c->short_name ?: $c->name,
                'count' => $c->members_count,
            ]);

        // 3. Country-wise Alumni Distribution
        $countryDistribution = DB::table('member_profiles')
            ->select('country_code', DB::raw('count(*) as count'))
            ->groupBy('country_code')
            ->orderByDesc('count')
            ->limit(5)
            ->get();

        // 4. Industry-wise Distribution
        $industryDistribution = DB::table('member_profiles')
            ->join('industries', 'industries.id', '=', 'member_profiles.industry_id')
            ->select('industries.name', DB::raw('count(*) as count'))
            ->groupBy('industries.id', 'industries.name')
            ->orderByDesc('count')
            ->limit(5)
            ->get();

        // 5. Recent Applications
        $recentApplications = MembershipApplication::with(['member.user', 'declaredCollege'])
            ->latest('submitted_at')
            ->limit(5)
            ->get();

        // 6. Upcoming Events
        $recentEvents = Event::with('category')
            ->where('status', 'published')
            ->orderBy('starts_on')
            ->limit(4)
            ->get();

        // 7. Recent System Activity
        $recentActivities = ActivityLog::with(['user', 'member.user'])
            ->latest()
            ->limit(8)
            ->get();

        $stats = [
            'total_members' => $totalMembers,
            'verified_members' => $verifiedMembers,
            'pending_applications' => $pendingApplications,
            'rejected_applications' => $rejectedApplications,
            'suspended_members' => $suspendedMembers,
            'participating_colleges' => $participatingColleges,
            'upcoming_events' => $upcomingEvents,
            'total_registrations' => $totalEventRegistrations,
            'published_news' => $publishedNews,
            'pending_businesses' => $pendingBusinesses,
            'active_committees' => $activeCommittees,
            'community_initiatives' => $communityInitiatives,
        ];

        return Inertia::render('admin/dashboard', [
            'stats' => $stats,
            'collegeDistribution' => $collegeDistribution,
            'countryDistribution' => $countryDistribution,
            'industryDistribution' => $industryDistribution,
            'recentApplications' => $recentApplications,
            'recentEvents' => $recentEvents,
            'recentActivities' => $recentActivities,
        ]);
    }
}
