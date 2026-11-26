<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GalleryItem extends Model
{
    protected $fillable = [
        'title',
        'place_label',
        'category',
        'image_path',
        'display_order',
        'is_active',
    ];

    protected $casts = [
        'display_order' => 'integer',
        'is_active' => 'boolean',
    ];

    protected $appends = ['image_url'];

    public function getImageUrlAttribute(): string
    {
        if (preg_match('#^(https?:)?//#', $this->image_path)) {
            return $this->image_path;
        }

        if (str_starts_with($this->image_path, '/')) {
            return asset(ltrim($this->image_path, '/'));
        }

        return asset('storage/'.ltrim($this->image_path, '/'));
    }
}
