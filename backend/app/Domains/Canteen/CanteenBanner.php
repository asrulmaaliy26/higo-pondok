<?php

namespace App\Domains\Canteen;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CanteenBanner extends Model
{
    protected $fillable = [
        'canteen_id',
        'image_path',
        'title',
        'status',
    ];

    public function canteen(): BelongsTo
    {
        return $this->belongsTo(Canteen::class);
    }
}
