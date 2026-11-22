<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class MemberFavorite extends Model
{
    use HasFactory;

    protected $fillable = [
        'member_id',
        'favoritable_type',
        'favoritable_id',
    ];

    public function member(): BelongsTo
    {
        return $this->belongsTo(Member::class);
    }

    public function favoritable(): MorphTo
    {
        return $this->morphTo();
    }
}
