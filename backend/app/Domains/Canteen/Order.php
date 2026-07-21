<?php

namespace App\Domains\Canteen;

use Illuminate\Database\Eloquent\Model;
use App\Domains\Auth\User;
use App\Domains\Canteen\Canteen;
use App\Domains\Canteen\OrderItem;

class Order extends Model
{
    protected $fillable = [
        'user_id',
        'canteen_id',
        'total_price',
        'status',
        'payment_status',
        'courier_id',
        'delivery_location',
        'proof_of_delivery',
        'proof_of_payment',
    ];

    protected $casts = [
        'proof_of_delivery' => 'array',
        'proof_of_payment' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function canteen()
    {
        return $this->belongsTo(Canteen::class);
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function courier()
    {
        return $this->belongsTo(User::class, 'courier_id');
    }
}
