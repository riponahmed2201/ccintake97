<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\College;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
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

    public function uploadLogo(Request $request, int $id): RedirectResponse
    {
        $college = College::findOrFail($id);

        $request->validate([
            // SVG intentionally excluded: it can carry script when served from our origin.
            'logo' => 'required|image|mimes:png,jpg,jpeg,webp|max:2048',
        ]);

        $previous = $college->logo_path;
        $path = $request->file('logo')->store('college-logos', 'public');
        $college->update(['logo_path' => $path]);

        if ($previous && $previous !== $path) {
            Storage::disk('public')->delete($previous);
        }

        AuditLog::log('college.logo_updated', 'colleges', $college->id, ['logo_path' => $previous], ['logo_path' => $path]);

        return back()->with('success', "Logo updated for {$college->name}.");
    }

    public function removeLogo(int $id): RedirectResponse
    {
        $college = College::findOrFail($id);
        $previous = $college->logo_path;

        if ($previous) {
            Storage::disk('public')->delete($previous);
            $college->update(['logo_path' => null]);
            AuditLog::log('college.logo_removed', 'colleges', $college->id, ['logo_path' => $previous], ['logo_path' => null]);
        }

        return back()->with('success', "Logo removed for {$college->name}.");
    }
}
