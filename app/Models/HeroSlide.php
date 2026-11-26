<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HeroSlide extends Model
{
    protected $fillable = [
        'title',
        'college_code',
        'image_path',
        'object_position',
        'overlay_dim',
        'display_order',
        'is_active',
    ];

    protected $casts = [
        'overlay_dim' => 'float',
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
