<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\College;
use App\Models\Committee;
use Inertia\Inertia;
use Inertia\Response;

class MarketingPageController extends Controller
{
    public function about(): Response
    {
        return Inertia::render('public/marketing', [
            'page' => 'about',
        ]);
    }

    public function colleges(): Response
    {
        return Inertia::render('public/marketing', [
            'page' => 'colleges',
            'colleges' => $this->collegeList(),
        ]);
    }

    public function committee(): Response
    {
        return Inertia::render('public/marketing', [
            'page' => 'committee',
            'colleges' => $this->collegeList(),
            'committee' => $this->executiveCommittee(),
        ]);
    }

    public function welfare(): Response
    {
        return Inertia::render('public/marketing', [
            'page' => 'welfare',
        ]);
    }

    public function contact(): Response
    {
        return Inertia::render('public/marketing', [
            'page' => 'contact',
        ]);
    }

    /** @return \Illuminate\Database\Eloquent\Collection<int, College> */
    private function collegeList()
    {
        return College::withCount('members')
            ->orderBy('display_order')
            ->get();
    }

    private function executiveCommittee(): ?Committee
    {
        return Committee::with(['members.member.user', 'members.member.college'])
            ->where('status', 'active')
            ->orderBy('display_order')
            ->first();
    }
}