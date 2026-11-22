<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EventGuest extends Model
{
    use HasFactory;

    protected $fillable = [
        'registration_id',
        'name',
        'relationship',
        'age_group',
    ];

    public function registration(): BelongsTo
    {
        return $this->belongsTo(EventRegistration::class);
    }
}
