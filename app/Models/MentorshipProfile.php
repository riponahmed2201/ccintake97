<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MentorshipProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'member_id',
        'is_available',
        'expertise_areas',
        'preferred_topics',
        'max_mentees',
        'consent_given_at',
    ];

    protected $casts = [
        'is_available' => 'boolean',
        'max_mentees' => 'integer',
        'consent_given_at' => 'datetime',
    ];

    public function member(): BelongsTo
    {
        return $this->belongsTo(Member::class);
    }
}
