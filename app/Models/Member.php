<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Member extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'member_code',
        'college_id',
        'college_roll_no',
        'intake_year',
        'membership_status',
        'verification_status',
        'approved_at',
        'verified_at',
        'suspended_at',
        'suspension_reason',
    ];

    protected $casts = [
        'intake_year' => 'integer',
        'approved_at' => 'datetime',
        'verified_at' => 'datetime',
        'suspended_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function college(): BelongsTo
    {
        return $this->belongsTo(College::class);
    }

    public function profile(): HasOne
    {
        return $this->hasOne(MemberProfile::class);
    }

    public function privacySettings(): HasMany
    {
        return $this->hasMany(MemberPrivacySetting::class);
    }

    public function applications(): HasMany
    {
        return $this->hasMany(MembershipApplication::class);
    }

    public function verifications(): HasMany
    {
        return $this->hasMany(MembershipVerification::class);
    }

    public function connectionsRequested(): HasMany
    {
        return $this->hasMany(MemberConnection::class, 'requester_id');
    }

    public function connectionsReceived(): HasMany
    {
        return $this->hasMany(MemberConnection::class, 'addressee_id');
    }

    public function favorites(): HasMany
    {
        return $this->hasMany(MemberFavorite::class);
    }

    public function mentorshipProfile(): HasOne
    {
        return $this->hasOne(MentorshipProfile::class);
    }

    public function mentorshipRequestsSent(): HasMany
    {
        return $this->hasMany(MentorshipRequest::class, 'mentee_id');
    }

    public function mentorshipRequestsReceived(): HasMany
    {
        return $this->hasMany(MentorshipRequest::class, 'mentor_id');
    }

    public function eventRegistrations(): HasMany
    {
        return $this->hasMany(EventRegistration::class);
    }

    public function businesses(): HasMany
    {
        return $this->hasMany(Business::class, 'owner_member_id');
    }

    public function committeeMemberships(): HasMany
    {
        return $this->hasMany(CommitteeMember::class);
    }

    public function initiativeParticipations(): HasMany
    {
        return $this->hasMany(InitiativeParticipant::class);
    }

    public function mediaSubmissions(): HasMany
    {
        return $this->hasMany(MediaSubmission::class);
    }
}
