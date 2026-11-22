<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Initiative extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'category',
        'description',
        'coordinator_member_id',
        'budget',
        'target_amount',
        'raised_amount',
        'start_date',
        'end_date',
        'status',
        'documents',
    ];

    protected $casts = [
        'budget' => 'decimal:2',
        'target_amount' => 'decimal:2',
        'raised_amount' => 'decimal:2',
        'start_date' => 'date',
        'end_date' => 'date',
        'documents' => 'array',
    ];

    public function coordinator(): BelongsTo
    {
        return $this->belongsTo(Member::class, 'coordinator_member_id');
    }

    public function participants(): HasMany
    {
        return $this->hasMany(InitiativeParticipant::class);
    }
}
