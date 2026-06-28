<?php

namespace App\Domains\Canteen;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Voucher extends Model
{
    protected $fillable = [
        'code',
        'discount_amount',
        'min_purchase',
        'canteen_id',
        'valid_until',
        'is_active'
    ];

    protected function casts(): array
    {
        return [
            'discount_amount' => 'float',
            'min_purchase' => 'float',
            'valid_until' => 'datetime',
            'is_active' => 'boolean',
        ];
    }

    public function canteen(): BelongsTo
    {
        return $this->belongsTo(Canteen::class);
    }
}
