<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Committee extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'head_member_id',
        'term_start',
        'term_end',
        'status',
        'display_order',
    ];

    protected $casts = [
        'term_start' => 'date',
        'term_end' => 'date',
        'display_order' => 'integer',
    ];

    public function headMember(): BelongsTo
    {
        return $this->belongsTo(Member::class, 'head_member_id');
    }

    public function members(): HasMany
    {
        return $this->hasMany(CommitteeMember::class)->orderBy('display_order');
    }
}
