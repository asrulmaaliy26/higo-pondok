<?php

namespace App\Domains\Canteen;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Domains\Auth\User;

class UserVoucher extends Model
{
    protected $fillable = [
        'user_id',
        'voucher_id',
        'is_used'
    ];

    protected function casts(): array
    {
        return [
            'is_used' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function voucher(): BelongsTo
    {
        return $this->belongsTo(Voucher::class);
    }
}
