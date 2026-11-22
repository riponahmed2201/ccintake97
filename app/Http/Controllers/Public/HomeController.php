<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\Business;
use App\Models\College;
use App\Models\Committee;
use App\Models\Event;
use App\Models\Member;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(): Response
    {
        $participatingColleges = College::where('is_participating', true)
            ->withCount('members')
            ->orderBy('display_order')
            ->get();

        $featuredEvents = Event::with('category')
            ->where('status', 'published')
            ->where('starts_on', '>=', now()->toDateString())
            ->orderBy('starts_on')
            ->limit(3)
            ->get();

        $latestArticles = Article::with('category')
            ->where('status', 'published')
            ->latest('published_at')
            ->limit(3)
            ->get();

        $executiveCommittee = Committee::with(['members.member.user', 'members.member.college'])
            ->where('status', 'active')
            ->orderBy('display_order')
            ->first();

        $businesses = Business::with(['industry', 'category', 'owner.college', 'owner.user'])
            ->where('status', 'approved')
            ->limit(4)
            ->get();

        $metrics = [
            'total_members' => Member::count(),
            'verified_members' => Member::where('verification_status', 'verified')->count(),
            'total_colleges' => $participatingColleges->count(),
            'intake_year' => 1997,
        ];

        return Inertia::render('welcome', [
            'colleges' => $participatingColleges,
            'events' => $featuredEvents,
            'articles' => $latestArticles,
            'committee' => $executiveCommittee,
            'businesses' => $businesses,
            'metrics' => $metrics,
        ]);
    }
}
