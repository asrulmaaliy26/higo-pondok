<?php

namespace App\Domains\Canteen\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Domains\Canteen\Canteen;
use App\Domains\Canteen\Requests\UpdateCanteenRequest;
use App\Domains\Canteen\Resources\CanteenResource;

class CanteenController extends Controller
{
    public function index(Request $request)
    {
        // Public route: list approved canteens
        // Asumsi lokasi user di Asrama Pondok (Misal: -7.250445, 112.768845)
        $userLat = $request->query('lat', -7.250445);
        $userLng = $request->query('lng', 112.768845);

        $canteens = Canteen::approved()
            ->open()
            ->selectRaw("*, ( 6371 * acos( cos( radians(?) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(?) ) + sin( radians(?) ) * sin( radians( latitude ) ) ) ) AS distance", [$userLat, $userLng, $userLat])
            ->orderBy('distance')
            ->get();
            
        return CanteenResource::collection($canteens);
    }

    public function show($id)
    {
        $canteen = Canteen::with(['products', 'vouchers' => function($q) {
            $q->where('is_active', true)
              ->where(function($query) {
                  $query->whereNull('valid_until')->orWhere('valid_until', '>=', now());
              });
        }])->findOrFail($id);
        return response()->json($canteen);
    }

    public function myCanteen(Request $request)
    {
        // For kantin role
        $canteen = $request->user()->canteen()->with(['products', 'banners', 'orders.items'])->first();
        
        if (!$canteen) {
            return response()->json(['message' => 'Kantin tidak ditemukan'], 404);
        }
        return new CanteenResource($canteen);
    }

    public function dashboardStats(Request $request)
    {
        $canteen = $request->user()->canteen()->with(['products', 'orders.items'])->first();
        if (!$canteen) {
            return response()->json(['message' => 'Kantin tidak ditemukan'], 404);
        }

        $pendingOrders = $canteen->orders()->whereIn('status', ['pending', 'processing'])->count();
        
        $todayIncome = 0;
        $completedToday = $canteen->orders()->where('status', 'completed')
            ->whereDate('updated_at', today())->get();
            
        foreach ($completedToday as $order) {
            $itemsTotal = $order->items->sum('subtotal');
            $todayIncome += $itemsTotal;
            if (is_null($order->courier_id)) {
                $delivery_fee = $order->total_price + $order->discount_amount - $itemsTotal;
                $todayIncome += max(0, $delivery_fee);
            }
        }

        $outOfStock = $canteen->products()->where(function($q) {
            $q->where('stock', 0)->orWhere('is_available', false);
        })->count();

        return response()->json([
            'pending_orders' => $pendingOrders,
            'today_income' => $todayIncome,
            'out_of_stock_products' => $outOfStock,
            'rating' => $canteen->rating
        ]);
    }

    public function updateMyCanteen(UpdateCanteenRequest $request)
    {
        $canteen = $request->user()->canteen()->firstOrFail();
        
        $data = $request->validated();
        
        if ($request->hasFile('image')) {
            // Hapus gambar lama jika ada
            if ($canteen->image) {
                Storage::disk('public')->delete($canteen->image);
            }
            // Simpan gambar baru
            $path = $request->file('image')->store($this->getUserUploadPath($request->user(), 'canteens'), 'public');
            $data['image'] = $path;
        }

        $canteen->update($data);
        
        return response()->json([
            'message' => 'Kantin berhasil diupdate', 
            'canteen' => new CanteenResource($canteen)
        ]);
    }
    public function toggleOpenStatus(Request $request)
    {
        $canteen = $request->user()->canteen()->firstOrFail();
        $canteen->is_open = !$canteen->is_open;
        $canteen->save();

        return response()->json([
            'message' => 'Status Kantin berhasil diubah',
            'is_open' => $canteen->is_open,
            'canteen' => new CanteenResource($canteen)
        ]);
    }
}
