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

        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        $businesses = $query->paginate(10)->withQueryString();

        return Inertia::render('admin/businesses/index', [
            'businesses' => $businesses,
            'filters' => $request->only('status'),
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
