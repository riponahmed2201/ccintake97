<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\GalleryItem;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class GalleryController extends Controller
{
    public function index(Request $request): Response
    {
        $query = GalleryItem::query();

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('place_label', 'like', "%{$search}%");
            });
        }

        if ($request->filled('category')) {
            $query->where('category', $request->input('category'));
        }

        $perPage = in_array((int) $request->input('per_page', 20), [10, 20, 50, 100])
            ? (int) $request->input('per_page', 20)
            : 20;

        $items = $query->orderBy('display_order')->orderBy('id')->paginate($perPage)->withQueryString();

        return Inertia::render('admin/gallery/index', [
            'items' => $items,
            'filters' => [
                'search' => $request->input('search', ''),
                'category' => $request->input('category', ''),
                'per_page' => (string) $perPage,
            ],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:160',
            'place_label' => 'nullable|string|max:60',
            'category' => 'required|in:campus_life,reunion,events',
            'display_order' => 'required|integer|min:0|max:999',
            'is_active' => 'boolean',
            'image' => 'required|image|max:5120',
        ]);

        $path = $request->file('image')->store('cms/gallery', 'public');

        $item = GalleryItem::create([
            'title' => $validated['title'],
            'place_label' => $validated['place_label'] ?: null,
            'category' => $validated['category'],
            'image_path' => $path,
            'display_order' => $validated['display_order'],
            'is_active' => $request->boolean('is_active', true),
        ]);

        AuditLog::log('gallery.created', 'gallery', $item->id, null, ['title' => $item->title]);

        return back()->with('success', 'Gallery photo added.');
    }

    public function update(Request $request, int $id): RedirectResponse
    {
        $item = GalleryItem::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:160',
            'place_label' => 'nullable|string|max:60',
            'category' => 'required|in:campus_life,reunion,events',
            'display_order' => 'required|integer|min:0|max:999',
            'is_active' => 'boolean',
            'image' => 'nullable|image|max:5120',
        ]);

        if ($request->hasFile('image')) {
            if ($item->image_path && ! str_starts_with($item->image_path, '/')) {
                Storage::disk('public')->delete($item->image_path);
            }
            $item->image_path = $request->file('image')->store('cms/gallery', 'public');
        }

        $item->title = $validated['title'];
        $item->place_label = $validated['place_label'] ?: null;
        $item->category = $validated['category'];
        $item->display_order = $validated['display_order'];
        $item->is_active = $request->boolean('is_active', true);
        $item->save();

        AuditLog::log('gallery.updated', 'gallery', $item->id, null, ['title' => $item->title]);

        return back()->with('success', 'Gallery photo updated.');
    }

    public function destroy(int $id): RedirectResponse
    {
        $item = GalleryItem::findOrFail($id);
        if ($item->image_path && ! str_starts_with($item->image_path, '/')) {
            Storage::disk('public')->delete($item->image_path);
        }
        $title = $item->title;
        $item->delete();

        AuditLog::log('gallery.deleted', 'gallery', $id, ['title' => $title], null);

        return back()->with('success', 'Gallery photo deleted.');
    }
}
