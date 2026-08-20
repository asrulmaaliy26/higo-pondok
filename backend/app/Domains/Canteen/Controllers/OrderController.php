<?php

namespace App\Domains\Canteen\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Domains\Canteen\Order;
use App\Domains\Canteen\OrderItem;
use App\Domains\Canteen\Canteen;
use App\Domains\Canteen\Product;
use App\Domains\Auth\User;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    // For Users: Create an order
    public function store(Request $request)
    {
        $request->validate([
            'canteen_id' => 'required|exists:canteens,id',
            'is_custom' => 'nullable|boolean',
            'custom_notes' => 'required_if:is_custom,true|nullable|string',
            'items' => 'required_unless:is_custom,true|array',
            'items.*.product_id' => 'required_with:items|exists:products,id',
            'items.*.quantity' => 'required_with:items|integer|min:1',
            'delivery_location' => 'required|string',
        ]);

        $canteen = Canteen::findOrFail($request->canteen_id);
        if (!$canteen->is_open) {
            return response()->json(['message' => 'Maaf, Kantin sedang tutup. Tidak dapat memesan.'], 400);
        }

        $user = $request->user();

        // Check if Santri Profile is complete
        if (empty($user->santri_name) || empty($user->santri_room) || empty($user->santri_class) || empty($user->santri_level)) {
            return response()->json([
                'message' => 'Profil belum lengkap. Silakan isi Nama Santri, Asrama, Kelas, dan Jenjang terlebih dahulu di halaman Profil.',
                'error_code' => 'INCOMPLETE_PROFILE'
            ], 403);
        }

        try {
            DB::beginTransaction();

            $isCustom = (bool) $request->is_custom;

            if ($isCustom) {
                $order = Order::create([
                    'user_id' => $user->id,
                    'canteen_id' => $canteen->id,
                    'is_custom' => true,
                    'custom_notes' => $request->custom_notes,
                    'status' => 'pending',
                    'payment_status' => 'unpaid',
                    'total_price' => 0, // Pending canteen setting price
                    'admin_fee' => 0,
                    'delivery_fee' => 0,
                    'delivery_location' => $request->delivery_location,
                ]);

                DB::commit();

                return response()->json([
                    'message' => 'Pesanan khusus berhasil dibuat. Menunggu penentuan harga dari toko.',
                    'order' => $order
                ], 201);
            }

            $total_price = 0;
            
            // Calculate total quantity of items
            $totalQuantity = collect($request->items)->sum('quantity');

            // Category pricing logic (Kauman vs Kota)
            $category = $canteen->category ?? 'kauman';
            $base_delivery_fee = ($category === 'kota') ? 3500 : 2000;
            $admin_fee = ($category === 'kota') ? 1500 : 1000;

            // Quantity multiplier (+ Rp 3.000 for every block of 5 extra items after the first 5)
            $extra_blocks = max(0, (int) floor(($totalQuantity - 1) / 5));
            $delivery_fee = $base_delivery_fee + ($extra_blocks * 3000);
                
            $courierUser = User::where('name', 'like', '%kurir1%')->first() ?: User::whereHas('roles', fn($q) => $q->where('name', 'kurir'))->first();

            $order = Order::create([
                'user_id' => $user->id,
                'canteen_id' => $canteen->id,
                'courier_id' => $courierUser ? $courierUser->id : null,
                'is_custom' => false,
                'custom_notes' => $request->custom_notes ?: null,
                'status' => 'pending',
                'payment_status' => 'unpaid',
                'total_price' => 0, // Will update below
                'admin_fee' => $admin_fee,
                'delivery_fee' => $delivery_fee,
                'delivery_location' => $request->delivery_location,
            ]);

            $subtotal_items = 0;

            foreach ($request->items as $item) {
                $product = Product::findOrFail($item['product_id']);
                
                // Ensure product belongs to the requested canteen
                if ($product->canteen_id !== $canteen->id) {
                    throw new \Exception("Product {$product->name} does not belong to this canteen.");
                }
                
                if (!$product->is_available) {
                    throw new \Exception("Maaf, produk {$product->name} sedang habis.");
                }

                $price = $product->discount_price ?: $product->price;
                $subtotal = $price * $item['quantity'];

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'price' => $price,
                    'subtotal' => $subtotal,
                    'notes' => isset($item['notes']) ? $item['notes'] : null,
                ]);

                $subtotal_items += $subtotal;
                
                // Update sold_count and stock (stock is active order counter)
                $product->increment('sold_count', $item['quantity']);
                $product->increment('stock', $item['quantity']);
            }

            $total_price = $subtotal_items + $delivery_fee + $admin_fee;

            $order->update([
                'total_price' => $total_price,
                'admin_fee' => $admin_fee,
                'delivery_fee' => $delivery_fee
            ]);

            DB::commit();

            $whatsappNumber = $canteen->whatsapp_number;
            // Format WA number to start with 62 if it starts with 0
            if (strpos($whatsappNumber, '0') === 0) {
                $whatsappNumber = '62' . substr($whatsappNumber, 1);
            }

            $message = "Halo, saya memesan makanan melalui Aplikasi Higo Pondok.%0AOrder ID: #" . $order->id . "%0ATotal: Rp " . number_format($order->total_price, 0, ',', '.') . "%0AMohon konfirmasinya.";
            $wa_url = "https://wa.me/{$whatsappNumber}?text={$message}";

            return response()->json([
                'message' => 'Pesanan berhasil dibuat',
                'order' => $order->load('items.product'),
                'wa_url' => $wa_url
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Gagal membuat pesanan', 'error' => $e->getMessage()], 500);
        }
    }

    private function getActiveCanteen(Request $request)
    {
        $canteenId = $request->query('canteen_id') ?? $request->input('canteen_id');
        if ($canteenId) {
            return $request->user()->canteens()->where('id', $canteenId)->first();
        }
        return $request->user()->canteens()->first();
    }

    // For Canteen: View orders
    public function canteenOrders(Request $request)
    {
        $canteenId = $request->query('canteen_id') ?? $request->input('canteen_id');
        
        $query = Order::with(['user', 'items.product', 'courier', 'canteen'])
            ->orderBy('created_at', 'desc');

        if ($canteenId && $canteenId !== 'all') {
            // Check if user owns this canteen
            $owns = $request->user()->canteens()->where('id', $canteenId)->exists();
            if (!$owns) {
                return response()->json(['message' => 'Anda tidak memiliki akses ke kantin ini'], 403);
            }
            $query->where('canteen_id', $canteenId);
        } else {
            // Fetch for all canteens owned by user
            $canteenIds = $request->user()->canteens()->pluck('id');
            if ($canteenIds->isEmpty()) {
                return response()->json([]);
            }
            $query->whereIn('canteen_id', $canteenIds);
        }

        $startDate = $request->query('start_date');
        $endDate = $request->query('end_date');
        
        if ($startDate && $endDate) {
            $start = \Illuminate\Support\Carbon::parse($startDate, 'Asia/Jakarta')->startOfDay();
            $end = \Illuminate\Support\Carbon::parse($endDate, 'Asia/Jakarta')->endOfDay();
            $query->whereBetween('created_at', [$start, $end]);
        }

        $orders = $query->get();

        return response()->json($orders);
    }

    // For Canteen: Update order payment status
    public function updatePaymentStatus(Request $request, $id)
    {
        $canteen = $this->getActiveCanteen($request);
        if (!$canteen) {
            return response()->json(['message' => 'Anda belum memiliki kantin'], 404);
        }

        $order = Order::where('canteen_id', $canteen->id)->findOrFail($id);
        
        $request->validate([
            'payment_status' => 'required|in:unpaid,paid',
        ]);

        $order->update(['payment_status' => $request->payment_status]);

        return response()->json(['message' => 'Status pembayaran berhasil diperbarui', 'order' => $order]);
    }

    // For Canteen: Update order status (Lanjutkan / Process / Cancel)
    public function updateOrderStatus(Request $request, $id)
    {
        $canteen = $this->getActiveCanteen($request);
        if (!$canteen) {
            return response()->json(['message' => 'Anda belum memiliki kantin'], 404);
        }

        $request->validate([
            'status' => 'required|in:pending,processing,completed,cancelled',
        ]);

        return DB::transaction(function () use ($id, $canteen, $request) {
            $order = Order::where('canteen_id', $canteen->id)->lockForUpdate()->findOrFail($id);
            $order->update(['status' => $request->status]);
            return response()->json(['message' => 'Status pesanan berhasil diperbarui', 'order' => $order]);
        });
    }

    // For Canteen: Complete order
    public function completeByCanteen(Request $request, $id)
    {
        $canteen = $this->getActiveCanteen($request);
        if (!$canteen) {
            return response()->json(['message' => 'Anda belum memiliki kantin'], 404);
        }

        // We check the un-locked order first just to validate request easily
        $order = Order::where('canteen_id', $canteen->id)->findOrFail($id);

        if (!in_array($order->status, ['pending', 'processing'])) {
            return response()->json(['message' => 'Pesanan tidak bisa diselesaikan. Status saat ini: ' . $order->status], 400);
        }

        if (!$order->courier_id) {
            $request->validate([
                'proof_of_delivery' => 'required|array|min:1',
                'proof_of_delivery.*' => 'image|mimes:jpeg,png,jpg,webp|max:2048',
            ]);
        } else {
            $request->validate([
                'proof_of_delivery' => 'nullable|array',
                'proof_of_delivery.*' => 'image|mimes:jpeg,png,jpg,webp|max:2048',
            ]);
        }

        $paths = $order->proof_of_delivery ?? [];
        if ($request->hasFile('proof_of_delivery')) {
            $paths = [];
            foreach ($request->file('proof_of_delivery') as $file) {
                $paths[] = $file->store($this->getUserUploadPath($request->user(), 'proofs'), 'public');
            }
        }

        return DB::transaction(function () use ($id, $canteen, $paths) {
            $order = Order::with('items.product')->where('canteen_id', $canteen->id)->lockForUpdate()->findOrFail($id);
            
            if (!in_array($order->status, ['pending', 'processing'])) {
                return response()->json(['message' => 'Pesanan tidak bisa diselesaikan. Status saat ini: ' . $order->status], 400);
            }

            $order->update([
                'status' => 'completed',
                'payment_status' => 'paid',
                'proof_of_delivery' => count($paths) > 0 ? $paths : $order->proof_of_delivery,
            ]);

            // Decrement active order count
            foreach ($order->items as $item) {
                if ($item->product) {
                    $item->product->decrement('stock', $item->quantity);
                }
            }

            $subtotal = $order->items->sum('subtotal');
            $admin_fee = $order->admin_fee;
            $delivery_fee = $order->delivery_fee;

            if ($order->courier_id) {
                // System holds all money.
                $canteen->increment('balance', $subtotal - $admin_fee);
                
                \App\Domains\Admin\PaymentLog::create([
                    'user_id' => $canteen->user_id,
                    'order_id' => $order->id,
                    'amount' => $subtotal - $admin_fee,
                    'type' => 'order_payment',
                    'description' => "Penerimaan hasil pesanan #" . $order->id,
                ]);

                $courier = User::find($order->courier_id);
                if ($courier) {
                    $courier->increment('balance', $delivery_fee * 0.8);
                    
                    \App\Domains\Admin\PaymentLog::create([
                        'user_id' => $courier->id,
                        'order_id' => $order->id,
                        'amount' => $delivery_fee * 0.8,
                        'type' => 'courier_fee',
                        'description' => "Penerimaan ongkir pesanan #" . $order->id,
                    ]);
                }
            } else {
                $canteen->increment('balance', $subtotal - $admin_fee + $delivery_fee);
                
                \App\Domains\Admin\PaymentLog::create([
                    'user_id' => $canteen->user_id,
                    'order_id' => $order->id,
                    'amount' => $subtotal - $admin_fee + $delivery_fee,
                    'type' => 'order_payment',
                    'description' => "Penerimaan hasil pesanan #" . $order->id . " (Tanpa Kurir)",
                ]);
            }

            // Increment sold count on completion
            $canteen->increment('sold_count', 1);

            return response()->json(['message' => 'Pesanan berhasil diselesaikan', 'order' => $order]);
        });
    }

    // For Canteen: Get list of couriers
    public function getCouriers(Request $request)
    {
        $couriers = User::role('kurir')->where('is_working', true)->get(['id', 'name', 'phone']);
        return response()->json($couriers);
    }

    // For Canteen: Assign courier to order (or self delivery)
    public function assignCourier(Request $request, $id)
    {
        $canteen = $this->getActiveCanteen($request);
        if (!$canteen) {
            return response()->json(['message' => 'Anda belum memiliki kantin'], 404);
        }

        $request->validate([
            'courier_id' => 'nullable',
        ]);

        return DB::transaction(function () use ($id, $canteen, $request) {
            $order = Order::where('canteen_id', $canteen->id)->lockForUpdate()->findOrFail($id);
            
            if ($order->status !== 'pending') {
                return response()->json(['message' => 'Pesanan tidak bisa diproses karena status saat ini: ' . $order->status], 400);
            }

            $courierId = ($request->courier_id === 'self' || $request->courier_id === '' || $request->courier_id === 'null') ? null : $request->courier_id;

            $order->update([
                'courier_id' => $courierId,
                'status' => 'processing'
            ]);

            return response()->json(['message' => 'Pesanan berhasil diproses', 'order' => $order]);
        });
    }

    // For User: View their own orders
    public function userOrders(Request $request)
    {
        $user = $request->user();

        $orders = Order::where('user_id', $user->id)
            ->with(['canteen', 'items.product', 'courier'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($orders);
    }

    // For Courier: View assigned orders
    public function courierOrders(Request $request)
    {
        $orders = Order::where('courier_id', $request->user()->id)
            ->with(['canteen', 'user', 'items.product'])
            ->orderBy('created_at', 'desc')
            ->get();
            
        return response()->json($orders);
    }

    // For Courier / Canteen: Upload purchase receipt (Struk Pembelian / Bukti Pesanan)
    public function uploadPurchaseProof(Request $request, $id)
    {
        $user = $request->user();
        $order = Order::where(function ($query) use ($user) {
            $query->where('courier_id', $user->id)
                  ->orWhereHas('canteen', function ($q) use ($user) {
                      $q->where('user_id', $user->id);
                  });
        })->findOrFail($id);

        $request->validate([
            'proof_of_purchase' => 'required|array|min:1',
            'proof_of_purchase.*' => 'image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        $newPaths = [];
        foreach ($request->file('proof_of_purchase') as $file) {
            $newPaths[] = $file->store($this->getUserUploadPath($request->user(), 'proofs'), 'public');
        }

        $existing = is_array($order->proof_of_purchase) ? $order->proof_of_purchase : ($order->proof_of_purchase ? [$order->proof_of_purchase] : []);
        $merged = array_merge($existing, $newPaths);

        $order->update([
            'proof_of_purchase' => $merged,
        ]);

        return response()->json(['message' => 'Bukti pesanan/struk berhasil ditambahkan', 'order' => $order]);
    }

    // For Courier: Upload delivery proof (Bukti Serah Terima / Pengiriman)
    public function uploadDeliveryProof(Request $request, $id)
    {
        $user = $request->user();
        $order = Order::where('courier_id', $user->id)->findOrFail($id);

        $request->validate([
            'proof_of_delivery' => 'required|array|min:1',
            'proof_of_delivery.*' => 'image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        $newPaths = [];
        foreach ($request->file('proof_of_delivery') as $file) {
            $newPaths[] = $file->store($this->getUserUploadPath($request->user(), 'proofs'), 'public');
        }

        $existing = is_array($order->proof_of_delivery) ? $order->proof_of_delivery : ($order->proof_of_delivery ? [$order->proof_of_delivery] : []);
        $merged = array_merge($existing, $newPaths);

        $order->update([
            'proof_of_delivery' => $merged,
        ]);

        return response()->json(['message' => 'Bukti serah terima berhasil ditambahkan', 'order' => $order]);
    }

    // For Courier / Canteen: Delete a specific uploaded photo
    public function deleteProofPhoto(Request $request, $id)
    {
        $user = $request->user();
        $order = Order::where(function ($query) use ($user) {
            $query->where('courier_id', $user->id)
                  ->orWhereHas('canteen', function ($q) use ($user) {
                      $q->where('user_id', $user->id);
                  });
        })->findOrFail($id);

        $request->validate([
            'type' => 'required|in:proof_of_purchase,proof_of_delivery,proof_of_payment',
            'path' => 'required|string',
        ]);

        $type = $request->type;
        $targetPath = $request->path;
        $currentArray = is_array($order->$type) ? $order->$type : [];

        $filtered = array_values(array_filter($currentArray, function ($p) use ($targetPath) {
            return $p !== $targetPath;
        }));

        $order->update([
            $type => count($filtered) > 0 ? $filtered : null,
        ]);

        \Illuminate\Support\Facades\Storage::disk('public')->delete($targetPath);

        return response()->json(['message' => 'Foto berhasil dihapus', 'order' => $order]);
    }

    // For Courier: Mark order as completed
    public function completeOrder(Request $request, $id)
    {
        $user = $request->user();
        
        return DB::transaction(function () use ($id, $user) {
            $order = Order::where('courier_id', $user->id)->lockForUpdate()->findOrFail($id);
            
            if ($order->status === 'completed' || $order->status === 'cancelled') {
                return response()->json(['message' => 'Pesanan sudah selesai atau dibatalkan.'], 400);
            }

            $order->update(['status' => 'completed']);
            
            return response()->json(['message' => 'Pesanan berhasil diselesaikan', 'order' => $order]);
        });
    }

    // For Canteen: Cancel order
    public function cancelOrder(Request $request, $id)
    {
        $canteen = $this->getActiveCanteen($request);
        if (!$canteen) {
            return response()->json(['message' => 'Kantin tidak ditemukan'], 404);
        }

        return DB::transaction(function () use ($id, $canteen) {
            $order = Order::with('items.product')->where('id', $id)->where('canteen_id', $canteen->id)->lockForUpdate()->firstOrFail();
            
            if ($order->status !== 'pending') {
                return response()->json(['message' => 'Pesanan tidak bisa dibatalkan karena sudah diproses'], 400);
            }

            $order->status = 'cancelled';
            $order->save();

            // Restore sold_count, and decrement active order counter
            foreach ($order->items as $item) {
                if ($item->product) {
                    $item->product->decrement('stock', $item->quantity);
                    $item->product->decrement('sold_count', $item->quantity);
                }
            }

            return response()->json([
                'message' => 'Pesanan berhasil dibatalkan',
                'order' => $order
            ]);
        });
    }

    // For User: Cancel their own order
    public function userCancelOrder(Request $request, $id)
    {
        return DB::transaction(function () use ($id, $request) {
            $order = Order::with('items.product')->where('id', $id)->where('user_id', $request->user()->id)->lockForUpdate()->firstOrFail();
            
            if ($order->status !== 'pending') {
                return response()->json(['message' => 'Pesanan tidak bisa dibatalkan karena sudah diproses'], 400);
            }

            $order->status = 'cancelled';
            $order->save();

            // Restore sold_count, and decrement active order counter
            foreach ($order->items as $item) {
                if ($item->product) {
                    $item->product->decrement('stock', $item->quantity);
                    $item->product->decrement('sold_count', $item->quantity);
                }
            }

            return response()->json([
                'message' => 'Pesanan berhasil dibatalkan',
                'order' => $order
            ]);
        });
    }

    // For User: Upload Payment Proof
    public function uploadPaymentProof(Request $request, $id)
    {
        $order = Order::where('user_id', $request->user()->id)->findOrFail($id);

        $request->validate([
            'proof_of_payment' => 'required|array|min:1',
            'proof_of_payment.*' => 'image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        $paths = [];
        foreach ($request->file('proof_of_payment') as $file) {
            $paths[] = $file->store($this->getUserUploadPath($request->user(), 'proofs'), 'public');
        }

        $existingProofs = is_array($order->proof_of_payment) ? $order->proof_of_payment : [];
        $mergedPaths = array_merge($existingProofs, $paths);

        $order->update([
            'proof_of_payment' => $mergedPaths,
        ]);

        return response()->json(['message' => 'Bukti transfer berhasil diunggah', 'order' => $order]);
    }

    // For Canteen: Get list of all santri users for manual order creation
    public function getSantriList(Request $request)
    {
        $users = User::role('user')
            ->select('id', 'name', 'santri_name', 'santri_room', 'santri_class', 'santri_level', 'phone')
            ->orderBy('name', 'asc')
            ->get();
        return response()->json($users);
    }

    // For Canteen: Create manual order on behalf of santri
    public function createOrderByCanteen(Request $request)
    {
        $canteen = $this->getActiveCanteen($request);
        if (!$canteen) {
            return response()->json(['message' => 'Anda belum memiliki kantin'], 404);
        }

        $request->validate([
            'user_id' => 'required|exists:users,id',
            'total_price' => 'required|numeric|min:0',
            'custom_notes' => 'required|string',
            'delivery_location' => 'nullable|string',
        ]);

        $targetUser = User::findOrFail($request->user_id);
        $deliveryLocation = $request->delivery_location ?: 
            ("Santri: " . ($targetUser->santri_name ?: $targetUser->name) . " | " . $targetUser->santri_room . " | " . $targetUser->santri_class . "/" . $targetUser->santri_level);

        $order = Order::create([
            'user_id' => $targetUser->id,
            'canteen_id' => $canteen->id,
            'is_custom' => true,
            'custom_notes' => $request->custom_notes,
            'status' => 'pending',
            'payment_status' => 'unpaid',
            'total_price' => $request->total_price,
            'admin_fee' => 0,
            'delivery_fee' => 0,
            'delivery_location' => $deliveryLocation,
        ]);

        return response()->json(['message' => 'Pesanan manual berhasil dibuat untuk santri!', 'order' => $order], 201);
    }

    // For Canteen: Set/update custom order price
    public function setCustomOrderPrice(Request $request, $id)
    {
        $canteen = $this->getActiveCanteen($request);
        if (!$canteen) {
            return response()->json(['message' => 'Anda belum memiliki kantin'], 404);
        }

        $order = Order::where('canteen_id', $canteen->id)->findOrFail($id);

        $request->validate([
            'total_price' => 'required|numeric|min:0',
        ]);

        $order->update([
            'total_price' => $request->total_price,
        ]);

        return response()->json(['message' => 'Harga pesanan khusus berhasil diperbarui', 'order' => $order]);
    }

    // For Canteen: Get order recapitulation (per product/canteen and per santri/wali)
    public function recap(Request $request)
    {
        $canteenId = $request->query('canteen_id');
        $userCanteenIds = $request->user()->canteens()->pluck('id');

        if ($userCanteenIds->isEmpty()) {
            return response()->json(['message' => 'Kantin tidak ditemukan'], 404);
        }

        $period = $request->get('period', 'day'); // day, week, month
        
        $query = Order::where('status', '!=', 'cancelled')
            ->with(['user', 'items.product', 'canteen']);

        if ($canteenId && $canteenId !== 'all') {
            if (!$userCanteenIds->contains($canteenId)) {
                return response()->json(['message' => 'Anda tidak memiliki akses ke kantin ini'], 403);
            }
            $query->where('canteen_id', $canteenId);
        } else {
            $query->whereIn('canteen_id', $userCanteenIds);
        }

        if ($period === 'week') {
            $query->whereBetween('created_at', [
                now('Asia/Jakarta')->startOfWeek(),
                now('Asia/Jakarta')->endOfWeek()
            ]);
        } elseif ($period === 'month') {
            $query->whereMonth('created_at', now('Asia/Jakarta')->month)
                  ->whereYear('created_at', now('Asia/Jakarta')->year);
        } else {
            // Default: day
            $query->whereDate('created_at', now('Asia/Jakarta')->format('Y-m-d'));
        }

        $orders = $query->get();

        $totalProducts = 0;
        $totalDeliveryFee = 0;
        $totalAdminFee = 0;
        $grandTotal = 0;

        $canteenRecap = [];
        $userRecap = [];
        $productBreakdown = [];

        foreach ($orders as $order) {
            $deliveryFee = (float) $order->delivery_fee;
            $adminFee = (float) $order->admin_fee;
            $totalPrice = (float) $order->total_price;
            $productsSubtotal = max(0, $totalPrice - $deliveryFee - $adminFee);

            $totalProducts += $productsSubtotal;
            $totalDeliveryFee += $deliveryFee;
            $totalAdminFee += $adminFee;
            $grandTotal += $totalPrice;

            // Group by Canteen / Toko
            $cId = $order->canteen_id;
            $cName = $order->canteen ? $order->canteen->name : 'Toko #' . $cId;
            if (!isset($canteenRecap[$cId])) {
                $canteenRecap[$cId] = [
                    'canteen_id' => $cId,
                    'canteen_name' => $cName,
                    'category' => $order->canteen->category ?? 'kauman',
                    'total_products' => 0,
                    'total_delivery_fee' => 0,
                    'total_admin_fee' => 0,
                    'grand_total' => 0,
                    'order_count' => 0,
                ];
            }
            $canteenRecap[$cId]['total_products'] += $productsSubtotal;
            $canteenRecap[$cId]['total_delivery_fee'] += $deliveryFee;
            $canteenRecap[$cId]['total_admin_fee'] += $adminFee;
            $canteenRecap[$cId]['grand_total'] += $totalPrice;
            $canteenRecap[$cId]['order_count'] += 1;

            // Group by Santri / Wali
            $userId = $order->user_id;
            $santriName = $order->user ? ($order->user->santri_name ?: $order->user->name) : 'Santri #' . $userId;
            $waliName = $order->user ? $order->user->name : 'Wali #' . $userId;

            if (!isset($userRecap[$userId])) {
                $userRecap[$userId] = [
                    'user_id' => $userId,
                    'santri_name' => $santriName,
                    'wali_name' => $waliName,
                    'santri_room' => $order->user->santri_room ?? '',
                    'total_products' => 0,
                    'total_delivery_fee' => 0,
                    'total_admin_fee' => 0,
                    'grand_total' => 0,
                    'order_count' => 0,
                ];
            }

            $userRecap[$userId]['total_products'] += $productsSubtotal;
            $userRecap[$userId]['total_delivery_fee'] += $deliveryFee;
            $userRecap[$userId]['total_admin_fee'] += $adminFee;
            $userRecap[$userId]['grand_total'] += $totalPrice;
            $userRecap[$userId]['order_count'] += 1;

            // Product Breakdown
            foreach ($order->items as $item) {
                $prodId = $item->product_id;
                $prodName = $item->product ? $item->product->name : 'Produk Khusus';
                if (!isset($productBreakdown[$prodId])) {
                    $productBreakdown[$prodId] = [
                        'product_id' => $prodId,
                        'name' => $prodName,
                        'canteen_name' => $cName,
                        'total_quantity' => 0,
                        'total_subtotal' => 0,
                    ];
                }
                $productBreakdown[$prodId]['total_quantity'] += $item->quantity;
                $productBreakdown[$prodId]['total_subtotal'] += (float) $item->subtotal;
            }
        }

        return response()->json([
            'period' => $period,
            'summary' => [
                'total_products' => $totalProducts,
                'total_delivery_fee' => $totalDeliveryFee,
                'total_admin_fee' => $totalAdminFee,
                'grand_total' => $grandTotal,
                'total_orders' => count($orders),
            ],
            'canteen_recap' => array_values($canteenRecap),
            'user_recap' => array_values($userRecap),
            'product_breakdown' => array_values($productBreakdown),
        ]);
    }
}
