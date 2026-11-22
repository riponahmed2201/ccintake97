<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Business extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'owner_member_id',
        'category_id',
        'industry_id',
        'name',
        'slug',
        'logo_path',
        'description',
        'services',
        'website',
        'email',
        'phone',
        'city',
        'country_code',
        'is_featured',
        'status',
        'verified_at',
    ];

    protected $casts = [
        'services' => 'array',
        'is_featured' => 'boolean',
        'verified_at' => 'datetime',
    ];

    public function owner(): BelongsTo
    {
        return $this->belongsTo(Member::class, 'owner_member_id');
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(BusinessCategory::class, 'category_id');
    }

    public function industry(): BelongsTo
    {
        return $this->belongsTo(Industry::class);
    }
}
