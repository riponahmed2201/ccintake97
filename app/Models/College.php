<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class College extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'short_name',
        'slug',
        'website',
        'established_year',
        'location',
        'description',
        'logo_path',
        'cover_image_path',
        'is_participating',
        'display_order',
    ];

    protected $casts = [
        'is_participating' => 'boolean',
        'established_year' => 'integer',
        'display_order' => 'integer',
    ];

    public function members(): HasMany
    {
        return $this->hasMany(Member::class);
    }

    public function applications(): HasMany
    {
        return $this->hasMany(MembershipApplication::class, 'declared_college_id');
    }
}
