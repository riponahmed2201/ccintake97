<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MembershipApplication extends Model
{
    use HasFactory;

    protected $fillable = [
        'application_no',
        'member_id',
        'declared_college_id',
        'declared_roll_no',
        'reference_name',
        'reference_phone',
        'proof_documents',
        'status',
        'submitted_at',
        'decided_at',
        'decision_note',
    ];

    protected $casts = [
        'proof_documents' => 'array',
        'submitted_at' => 'datetime',
        'decided_at' => 'datetime',
    ];

    public function member(): BelongsTo
    {
        return $this->belongsTo(Member::class);
    }

    public function declaredCollege(): BelongsTo
    {
        return $this->belongsTo(College::class, 'declared_college_id');
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(ApplicationReview::class, 'application_id');
    }
}
