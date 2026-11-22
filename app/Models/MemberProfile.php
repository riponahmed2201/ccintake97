<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MemberProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'member_id',
        'city',
        'country_code',
        'address',
        'gender',
        'date_of_birth',
        'designation',
        'organization',
        'industry_id',
        'professional_bio',
        'skills',
        'education',
        'employment_history',
        'linkedin_url',
        'website_url',
        'owns_business',
        'profile_completion',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
        'skills' => 'array',
        'education' => 'array',
        'employment_history' => 'array',
        'owns_business' => 'boolean',
        'profile_completion' => 'integer',
    ];

    public function member(): BelongsTo
    {
        return $this->belongsTo(Member::class);
    }

    public function industry(): BelongsTo
    {
        return $this->belongsTo(Industry::class);
    }
}
