<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Business;
use App\Models\BusinessCategory;
use App\Models\Industry;
use App\Models\Member;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class BusinessController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Business::with(['owner.user', 'owner.college', 'category', 'industry'])
            ->latest();

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('city', 'like', "%{$search}%")
                    ->orWhereHas('owner.user', function ($uq) use ($search) {
                        $uq->where('name', 'like', "%{$search}%");
                    });
            });
        }

        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        $perPage = (int) $request->input('per_page', 10);
        if (! in_array($perPage, [10, 25, 50, 100], true)) {
            $perPage = 10;
        }

        $businesses = $query->paginate($perPage)->withQueryString();

        return Inertia::render('admin/businesses/index', [
            'businesses' => $businesses,
            'filters' => array_merge(
                $request->only(['search', 'status']),
                ['per_page' => (string) $perPage]
            ),
            'categories' => BusinessCategory::orderBy('name')->get(['id', 'name']),
            'industries' => Industry::orderBy('name')->get(['id', 'name']),
            'owners' => Member::with(['user:id,name', 'college:id,short_name'])
                ->where('membership_status', 'approved')
                ->whereHas('user')
                ->get(['id', 'user_id', 'college_id'])
                ->map(fn ($m) => ['id' => $m->id, 'name' => $m->user->name, 'college' => $m->college?->short_name])
                ->sortBy('name')
                ->values(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'owner_member_id' => 'required|exists:members,id',
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:business_categories,id',
            'industry_id' => 'required|exists:industries,id',
            'description' => 'nullable|string|max:2000',
            'website' => 'nullable|url|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:30',
            'city' => 'nullable|string|max:100',
            'country_code' => 'nullable|string|size:2',
            'status' => 'required|in:approved,pending',
            'is_featured' => 'boolean',
            // SVG excluded: it can carry script when served from our origin.
            'logo' => 'nullable|image|mimes:png,jpg,jpeg,webp|max:2048',
        ]);

        $data = collect($validated)->except('logo')->all();
        $data['slug'] = Str::slug($validated['name']).'-'.Str::lower(Str::random(4));
        $data['country_code'] = strtoupper($validated['country_code'] ?? 'BD');
        $data['is_featured'] = (bool) ($validated['is_featured'] ?? false);
        $data['verified_at'] = $validated['status'] === 'approved' ? now() : null;
        if ($request->hasFile('logo')) {
            $data['logo_path'] = $request->file('logo')->store('business-logos', 'public');
        }

        $biz = Business::create($data);
        AuditLog::log('business.created_by_admin', 'businesses', $biz->id, null, $biz->toArray());

        return back()->with('success', "Business '{$biz->name}' added.");
    }

    public function verify(int $id): RedirectResponse
    {
        $biz = Business::findOrFail($id);
        $biz->update([
            'status' => 'approved',
            'verified_at' => now(),
        ]);

        AuditLog::log('business.approved', 'businesses', $biz->id, ['status' => 'pending'], ['status' => 'approved']);

        return back()->with('success', "Business '{$biz->name}' approved and published.");
    }

    public function reject(Request $request, int $id): RedirectResponse
    {
        $biz = Business::findOrFail($id);
        $biz->update(['status' => 'rejected']);

        AuditLog::log('business.rejected', 'businesses', $biz->id, ['status' => 'pending'], ['status' => 'rejected']);

        return back()->with('success', "Business '{$biz->name}' rejected.");
    }

    public function toggleFeatured(int $id): RedirectResponse
    {
        $biz = Business::findOrFail($id);
        $biz->update(['is_featured' => ! $biz->is_featured]);

        AuditLog::log('business.featured_toggled', 'businesses', $biz->id, null, ['is_featured' => $biz->is_featured]);

        return back()->with('success', "Featured status updated for '{$biz->name}'.");
    }
}
