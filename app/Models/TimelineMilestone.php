<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TimelineMilestone extends Model
{
    protected $fillable = [
        'year',
        'title',
        'tagline',
        'description',
        'is_highlighted',
        'display_order',
        'is_active',
    ];

    protected $casts = [
        'is_highlighted' => 'boolean',
        'display_order' => 'integer',
        'is_active' => 'boolean',
    ];
}
