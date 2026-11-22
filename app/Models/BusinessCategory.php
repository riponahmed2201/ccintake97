<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BusinessCategory extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'display_order',
    ];

    public function businesses(): HasMany
    {
        return $this->hasMany(Business::class, 'category_id');
    }
}
