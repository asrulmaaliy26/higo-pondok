<?php

namespace App\Domains\Canteen;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Domains\Auth\User;

class Canteen extends Model
{
    use SoftDeletes;
    protected $fillable = [
        'user_id',
        'name',
        'description',
        'image',
        'status',
        'is_open',
        'delivery_fee',
        'delivery_rates',
        'admin_fee',
        'admin_debt',
        'is_gofood_mode',
        'sold_count',
        'latitude',
        'longitude',
        'rating',
        'rating_count',
        'whatsapp_number'
    ];

    protected function casts(): array
    {
        return [
            'is_open' => 'boolean',
            'delivery_fee' => 'float',
            'delivery_rates' => 'array',
            'admin_fee' => 'float',
            'admin_debt' => 'float',
            'is_gofood_mode' => 'boolean',
            'latitude' => 'float',
            'longitude' => 'float',
            'rating' => 'float',
            'sold_count' => 'integer',
            'rating_count' => 'integer'
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    public function banners(): HasMany
    {
        return $this->hasMany(CanteenBanner::class);
    }

    public function vouchers(): HasMany
    {
        return $this->hasMany(Voucher::class);
    }

    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    public function scopeOpen($query)
    {
        return $query->where('is_open', true);
    }
}
