<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\College;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class CollegeController extends Controller
{
    public function index(): Response
    {
        $colleges = College::withCount('members')
            ->orderBy('display_order')
            ->get();

        return Inertia::render('admin/colleges/index', [
            'colleges' => $colleges,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'short_name' => 'nullable|string|max:50',
            'website' => 'nullable|url|max:255',
            'established_year' => 'nullable|integer|min:1900|max:2099',
            'location' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'is_participating' => 'boolean',
            'display_order' => 'integer',
        ]);

        $validated['slug'] = Str::slug($validated['name']);

        $college = College::create($validated);
        AuditLog::log('college.created', 'colleges', $college->id, null, $college->toArray());

        return back()->with('success', "College {$college->name} added successfully.");
    }

    public function update(Request $request, int $id): RedirectResponse
    {
        $college = College::findOrFail($id);
        $previous = $college->toArray();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'short_name' => 'nullable|string|max:50',
            'website' => 'nullable|url|max:255',
            'established_year' => 'nullable|integer|min:1900|max:2099',
            'location' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'is_participating' => 'boolean',
            'display_order' => 'integer',
        ]);

        $college->update($validated);
        AuditLog::log('college.updated', 'colleges', $college->id, $previous, $college->fresh()->toArray());

        return back()->with('success', "College {$college->name} updated.");
    }

    public function toggleParticipation(int $id): RedirectResponse
    {
        $college = College::findOrFail($id);
        $previous = $college->is_participating;
        $college->update(['is_participating' => ! $previous]);

        AuditLog::log('college.toggled_participation', 'colleges', $college->id, ['is_participating' => $previous], ['is_participating' => ! $previous]);

        return back()->with('success', "Participation status updated for {$college->name}.");
    }
}
