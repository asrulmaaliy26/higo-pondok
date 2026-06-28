<?php

namespace App\Domains\Canteen;

use Illuminate\Database\Eloquent\Model;
use App\Domains\Canteen\Product;
use App\Domains\Canteen\Order;

class OrderItem extends Model
{
    protected $fillable = [
        'order_id',
        'product_id',
        'quantity',
        'price',
        'subtotal',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
