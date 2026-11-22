<?php

namespace App\Http\Controllers\Member;

use App\Http\Controllers\Controller;
use App\Models\Business;
use App\Models\BusinessCategory;
use App\Models\Industry;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class BusinessController extends Controller
{
    public function index(Request $request): Response
    {
        $businesses = Business::with(['owner.user', 'owner.college', 'category', 'industry'])
            ->where('status', 'approved')
            ->latest('is_featured')
            ->paginate(12);

        $myBusiness = $request->user()->member ? Business::where('owner_member_id', $request->user()->member->id)->first() : null;
        $categories = BusinessCategory::orderBy('display_order')->get(['id', 'name']);
        $industries = Industry::orderBy('name')->get(['id', 'name']);

        return Inertia::render('member/businesses/index', [
            'businesses' => $businesses,
            'myBusiness' => $myBusiness,
            'categories' => $categories,
            'industries' => $industries,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $member = $request->user()->member;
        if (! $member) abort(403);

        $validated = $request->validate([
            'category_id' => 'required|exists:business_categories,id',
            'industry_id' => 'required|exists:industries,id',
            'name' => 'required|string|max:255',
            'description' => 'required|string|max:2000',
            'website' => 'nullable|url|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:30',
            'city' => 'nullable|string|max:100',
            'services' => 'nullable|array',
        ]);

        $validated['slug'] = Str::slug($validated['name']) . '-' . Str::random(4);
        $validated['owner_member_id'] = $member->id;
        $validated['status'] = 'pending';

        Business::create($validated);

        return back()->with('success', 'Your business listing has been submitted for administrative verification.');
    }
}
