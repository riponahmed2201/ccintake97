<?php

namespace App\Http\Controllers\Member;

use App\Http\Controllers\Controller;
use App\Models\GalleryItem;
use Inertia\Inertia;
use Inertia\Response;

class GalleryController extends Controller
{
    public function index(): Response
    {
        $items = GalleryItem::where('is_active', true)
            ->orderBy('display_order')
            ->orderBy('id')
            ->get()
            ->map(fn (GalleryItem $g) => [
                'id' => $g->id,
                'title' => $g->title,
                'place_label' => $g->place_label,
                'category' => $g->category,
                'image_url' => $g->image_url,
            ])
            ->values();

        return Inertia::render('member/gallery/index', [
            'items' => $items,
        ]);
    }
}
