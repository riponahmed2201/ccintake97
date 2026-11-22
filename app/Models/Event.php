<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Event extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'category_id',
        'title',
        'slug',
        'description',
        'venue',
        'address',
        'google_maps_link',
        'cover_image_path',
        'starts_on',
        'ends_on',
        'start_time',
        'end_time',
        'capacity',
        'allows_guests',
        'max_guests_per_registration',
        'registration_closes_at',
        'registration_fee',
        'visibility',
        'status',
        'published_at',
        'created_by',
    ];

    protected $casts = [
        'starts_on' => 'date',
        'ends_on' => 'date',
        'capacity' => 'integer',
        'allows_guests' => 'boolean',
        'max_guests_per_registration' => 'integer',
        'registration_closes_at' => 'datetime',
        'registration_fee' => 'decimal:2',
        'published_at' => 'datetime',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(EventCategory::class, 'category_id');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function registrations(): HasMany
    {
        return $this->hasMany(EventRegistration::class);
    }
}
