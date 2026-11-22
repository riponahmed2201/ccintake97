<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MentorshipRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'mentor_id',
        'mentee_id',
        'goals',
        'status',
        'response_note',
    ];

    public function mentor(): BelongsTo
    {
        return $this->belongsTo(Member::class, 'mentor_id');
    }

    public function mentee(): BelongsTo
    {
        return $this->belongsTo(Member::class, 'mentee_id');
    }
}
