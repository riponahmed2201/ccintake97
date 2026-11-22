<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GalleryMedia extends Model
{
    use HasFactory;

    protected $fillable = [
        'album_id',
        'file_path',
        'media_type',
        'caption',
        'taken_at',
        'display_order',
    ];

    protected $casts = [
        'taken_at' => 'date',
        'display_order' => 'integer',
    ];

    public function album(): BelongsTo
    {
        return $this->belongsTo(GalleryAlbum::class);
    }
}
