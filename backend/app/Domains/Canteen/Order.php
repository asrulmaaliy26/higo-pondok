<?php

namespace App\Domains\Canteen;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Domains\Auth\User;
use App\Domains\Canteen\Canteen;
use App\Domains\Canteen\OrderItem;
use App\Traits\LogsActivity;

class Order extends Model
{
    use HasFactory, LogsActivity;

    protected $fillable = [
        'user_id',
        'canteen_id',
        'total_price',
        'admin_fee',
        'delivery_fee',
        'status',
        'payment_status',
        'courier_id',
        'delivery_location',
        'proof_of_delivery',
        'proof_of_purchase',
        'proof_of_payment',
        'is_courier_paid_by_canteen',
        'proof_courier_paid',
        'custom_notes',
        'is_custom',
    ];

    protected $casts = [
        'proof_of_delivery' => 'array',
        'proof_of_purchase' => 'array',
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
