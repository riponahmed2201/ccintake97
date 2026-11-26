<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Business;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
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
