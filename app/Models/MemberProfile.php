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
        'cadet_name',
        'city',
        'country_code',
        'address',
        'present_address_line',
        'present_area',
        'present_postal_code',
        'same_as_present_address',
        'permanent_address_line',
        'permanent_area',
        'permanent_city',
        'permanent_postal_code',
        'permanent_country_code',
        'gender',
        'date_of_birth',
        'blood_group',
        'spouse_name',
        'spouse_occupation',
        'spouse_job_location',
        'children_names',
        'designation',
        'job_type',
        'organization',
        'office_address',
        'office_phone',
        'industry_id',
        'professional_bio',
        'remarks',
        'skills',
        'education',
        'employment_history',
        'linkedin_url',
        'facebook_url',
        'website_url',
        'owns_business',
        'profile_completion',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
        'same_as_present_address' => 'boolean',
        'children_names' => 'array',
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
