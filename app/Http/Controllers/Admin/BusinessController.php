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
use Illuminate\Support\Facades\Storage;
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
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/businesses/form', ['business' => null] + $this->formOptions());
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validated($request);

        $data = $this->normalise($request, $validated);
        $data['slug'] = Str::slug($validated['name']).'-'.Str::lower(Str::random(4));
        $data['verified_at'] = $validated['status'] === 'approved' ? now() : null;

        $biz = Business::create($data);
        AuditLog::log('business.created_by_admin', 'businesses', $biz->id, null, $biz->toArray());

        return redirect()->route('admin.businesses.index')->with('success', "Business '{$biz->name}' added.");
    }

    public function edit(int $id): Response
    {
        $biz = Business::findOrFail($id);

        return Inertia::render('admin/businesses/form', [
            'business' => [
                'id' => $biz->id,
                'owner_member_id' => $biz->owner_member_id,
                'name' => $biz->name,
                'category_id' => $biz->category_id,
                'industry_id' => $biz->industry_id,
                'description' => $biz->description,
                'website' => $biz->website,
                'email' => $biz->email,
                'phone' => $biz->phone,
                'city' => $biz->city,
                'country_code' => $biz->country_code,
                'status' => $biz->status,
                'logo_url' => $biz->logo_path ? asset('storage/'.ltrim($biz->logo_path, '/')) : null,
                'is_featured' => (bool) $biz->is_featured,
                'verified_at' => $biz->verified_at?->toIso8601String(),
                'created_at' => $biz->created_at?->toIso8601String(),
                'updated_at' => $biz->updated_at?->toIso8601String(),
            ],
        ] + $this->formOptions($biz->owner_member_id));
    }

    public function update(Request $request, int $id): RedirectResponse
    {
        $biz = Business::findOrFail($id);
        $previous = $biz->toArray();
        $validated = $this->validated($request, true);

        $data = $this->normalise($request, $validated);
        if ($validated['status'] === 'approved' && ! $biz->verified_at) {
            $data['verified_at'] = now();
        }
        $oldLogo = $biz->logo_path;
        if ($request->boolean('remove_logo') && ! $request->hasFile('logo')) {
            $data['logo_path'] = null;
        }

        $biz->update($data);
        if ($oldLogo && $oldLogo !== $biz->logo_path) {
            Storage::disk('public')->delete($oldLogo);
        }
        AuditLog::log('business.updated_by_admin', 'businesses', $biz->id, $previous, $biz->fresh()->toArray());

        return redirect()->route('admin.businesses.index')->with('success', "Business '{$biz->name}' updated.");
    }

    private function validated(Request $request, bool $updating = false): array
    {
        return $request->validate([
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
            'status' => $updating ? 'required|in:approved,pending,rejected,suspended' : 'required|in:approved,pending',
            // SVG excluded: it can carry script when served from our origin.
            'logo' => 'nullable|image|mimes:png,jpg,jpeg,webp|max:2048',
            'remove_logo' => 'nullable|boolean',
        ]);
    }

    private function normalise(Request $request, array $validated): array
    {
        $data = collect($validated)->except(['logo', 'remove_logo'])->all();
        $data['country_code'] = strtoupper($validated['country_code'] ?? 'BD');
        if ($request->hasFile('logo')) {
            $data['logo_path'] = $request->file('logo')->store('business-logos', 'public');
        }

        return $data;
    }

    /** @param  int|null  $currentOwnerId  always listed, even if no longer approved */
    private function formOptions(?int $currentOwnerId = null): array
    {
        return [
            'categories' => BusinessCategory::orderBy('name')->get(['id', 'name']),
            'industries' => Industry::orderBy('name')->get(['id', 'name']),
            'owners' => Member::with(['user:id,name', 'college:id,short_name'])
                ->where(fn ($q) => $q->where('membership_status', 'approved')->when($currentOwnerId, fn ($q) => $q->orWhere('id', $currentOwnerId)))
                ->whereHas('user')
                ->get(['id', 'user_id', 'college_id', 'membership_status'])
                ->map(fn ($m) => ['id' => $m->id, 'name' => $m->user->name, 'college' => $m->college?->short_name, 'status' => $m->membership_status])
                ->sortBy('name')
                ->values(),
        ];
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
