<?php

namespace App\Domains\Canteen;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'canteen_id',
        'name',
        'category',
        'description',
        'price',
        'discount_price',
        'stock',
        'sold_count',
        'rating',
        'rating_count',
        'image',
        'is_available'
    ];

    protected function casts(): array
    {
        return [
            'price' => 'float',
            'discount_price' => 'float',
            'stock' => 'integer',
            'is_available' => 'boolean',
        ];
    }

    public function canteen()
    {
        return $this->belongsTo(Canteen::class);
    }
}
