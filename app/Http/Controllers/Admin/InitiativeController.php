<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Initiative;
use App\Models\Member;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class InitiativeController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Initiative::with(['coordinator.user', 'coordinator.college'])
            ->withCount('participants')
            ->latest();

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($category = $request->input('category')) {
            $query->where('category', $category);
        }

        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        $perPage = (int) $request->input('per_page', 10);
        if (! in_array($perPage, [10, 25, 50, 100], true)) {
            $perPage = 10;
        }

        $initiatives = $query->paginate($perPage)->withQueryString();
        $approvedMembers = Member::with('user')->where('membership_status', 'approved')->get();

        return Inertia::render('admin/initiatives/index', [
            'initiatives' => $initiatives,
            'approvedMembers' => $approvedMembers,
            'filters' => array_merge(
                $request->only(['search', 'category', 'status']),
                ['per_page' => (string) $perPage]
            ),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|in:scholarship,welfare,medical,emergency,mentorship',
            'description' => 'nullable|string',
            'coordinator_member_id' => 'nullable|exists:members,id',
            'budget' => 'nullable|numeric|min:0',
            'target_amount' => 'nullable|numeric|min:0',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'status' => 'required|in:draft,active,completed,archived',
        ]);

        $validated['slug'] = Str::slug($validated['title']) . '-' . Str::random(4);

        $initiative = Initiative::create($validated);
        AuditLog::log('initiative.created', 'initiatives', $initiative->id, null, $initiative->toArray());

        return back()->with('success', "Initiative '{$initiative->title}' created.");
    }
}
