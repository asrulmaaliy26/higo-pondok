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
                    'delivery_location' => $request->delivery_location,
                ]);

                $canteen->increment('sold_count', 1);

                DB::commit();

                return response()->json([
                    'message' => 'Pesanan khusus berhasil dibuat. Menunggu penentuan harga dari toko.',
                    'order' => $order
                ], 201);
            }

            $total_price = 0;
            
            // Calculate total quantity of items
            $totalQuantity = collect($request->items)->sum('quantity');

            // Determine base delivery fee from canteen
            $base_delivery_fee = (float) $canteen->delivery_fee;
            
            // Double the delivery fee if total items > 5
            $delivery_fee = $totalQuantity > 5 ? $base_delivery_fee * 2 : $base_delivery_fee;
                
            $total_price += $delivery_fee;

            $order = Order::create([
                'user_id' => $user->id,
                'canteen_id' => $canteen->id,
                'is_custom' => false,
                'status' => 'pending',
                'payment_status' => 'unpaid',
                'total_price' => 0, // Will update below
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

                if ($product->stock < $item['quantity']) {
                    throw new \Exception("Maaf, sisa stok {$product->name} hanya {$product->stock}.");
                }

                $price = $product->discount_price ?: $product->price;
                $subtotal = $price * $item['quantity'];

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'price' => $price,
                    'subtotal' => $subtotal,
                ]);

                $subtotal_items += $subtotal;
                
                // Update sold_count and stock
                $product->increment('sold_count', $item['quantity']);
                $product->decrement('stock', $item['quantity']);
            }

            $admin_fee = $subtotal_items > 0 ? (floor($subtotal_items / 20000) + 1) * 500 : 0;
            $total_price = $subtotal_items + $delivery_fee + $admin_fee;

            $order->update([
                'total_price' => $total_price
            ]);
            
            // Update canteen sold_count
            $canteen->increment('sold_count', 1);

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
                return response()->json(['message' => 'Anda belum memiliki kantin'], 404);
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

    // For Canteen: Complete order
    public function completeByCanteen(Request $request, $id)
    {
        $canteen = $this->getActiveCanteen($request);
        if (!$canteen) {
            return response()->json(['message' => 'Anda belum memiliki kantin'], 404);
        }

        $order = Order::where('canteen_id', $canteen->id)->findOrFail($id);

        if (!in_array($order->status, ['pending', 'processing'])) {
            return response()->json(['message' => 'Pesanan tidak bisa diselesaikan. Status saat ini: ' . $order->status], 400);
        }

        $request->validate([
            'proof_of_delivery' => 'required|array|min:1',
            'proof_of_delivery.*' => 'image|max:5120',
        ]);

        $paths = [];
        foreach ($request->file('proof_of_delivery') as $file) {
            $paths[] = $file->store($this->getUserUploadPath($request->user(), 'proofs'), 'public');
        }

        DB::transaction(function () use ($order, $canteen, $paths) {
            $order->update([
                'status' => 'completed',
                'payment_status' => 'paid',
                'proof_of_delivery' => $paths,
            ]);

            $subtotal = $order->items->sum('subtotal');
            $admin_fee = $subtotal > 0 ? (floor($subtotal / 20000) + 1) * 500 : 0;
            $delivery_fee = max(0, $order->total_price - $subtotal - $admin_fee);

            if ($order->courier_id) {
                if ($order->is_courier_paid_by_canteen) {
                    // Canteen paid courier in cash (80% driver share paid by canteen)
                    $driver_share = $delivery_fee * 0.8;
                    $canteen->increment('balance', $subtotal - $canteen->admin_fee + $driver_share);
                } else {
                    // System holds all money.
                    $canteen->increment('balance', $subtotal - $canteen->admin_fee);
                    $courier = User::find($order->courier_id);
                    if ($courier) {
                        $courier->increment('balance', $delivery_fee * 0.8);
                    }
                }
            } else {
                $canteen->increment('balance', $subtotal - $canteen->admin_fee);
            }
        });

        return response()->json(['message' => 'Pesanan berhasil diselesaikan', 'order' => $order]);
    }

    // For Canteen: Get list of couriers
    public function getCouriers(Request $request)
    {
        $couriers = User::role('kurir')->where('is_working', true)->get(['id', 'name', 'phone']);
        return response()->json($couriers);
    }

    // For Canteen: Assign courier to order
    public function assignCourier(Request $request, $id)
    {
        $canteen = $this->getActiveCanteen($request);
        if (!$canteen) {
            return response()->json(['message' => 'Anda belum memiliki kantin'], 404);
        }

        $order = Order::where('canteen_id', $canteen->id)->findOrFail($id);
        
        $request->validate([
            'courier_id' => 'required|exists:users,id',
        ]);

        $order->update([
            'courier_id' => $request->courier_id,
            'status' => 'processing'
        ]);

        return response()->json(['message' => 'Kurir berhasil ditugaskan', 'order' => $order]);
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

    // For Courier: Upload purchase receipt (Struk Pembelian)
    public function uploadPurchaseProof(Request $request, $id)
    {
        $order = Order::where('courier_id', $request->user()->id)->findOrFail($id);

        $request->validate([
            'proof_of_purchase' => 'required|array|min:1',
            'proof_of_purchase.*' => 'image|max:5120',
        ]);

        $paths = [];
        foreach ($request->file('proof_of_purchase') as $file) {
            $paths[] = $file->store($this->getUserUploadPath($request->user(), 'proofs'), 'public');
        }

        $order->update([
            'proof_of_purchase' => $paths,
        ]);

        return response()->json(['message' => 'Struk pembelian berhasil diunggah', 'order' => $order]);
    }

    // Legacy / fallback endpoint for courier complete order
    public function completeOrder(Request $request, $id)
    {
        if ($request->hasFile('proof_of_purchase')) {
            return $this->uploadPurchaseProof($request, $id);
        }
        
        // If proof_of_delivery sent by mistake, redirect to purchase proof
        if ($request->hasFile('proof_of_delivery')) {
            $request->merge(['proof_of_purchase' => $request->file('proof_of_delivery')]);
            return $this->uploadPurchaseProof($request, $id);
        }

        return $this->uploadPurchaseProof($request, $id);
    }
    // For Canteen: Pay courier directly (Talangan)
    public function payCourierByCanteen(Request $request, $id)
    {
        $canteen = $this->getActiveCanteen($request);
        if (!$canteen) {
            return response()->json(['message' => 'Kantin tidak ditemukan'], 404);
        }

        $order = Order::where('canteen_id', $canteen->id)->findOrFail($id);

        if ($order->status === 'completed' || $order->status === 'cancelled') {
            return response()->json(['message' => 'Pesanan sudah selesai atau dibatalkan'], 400);
        }
        
        if ($order->is_courier_paid_by_canteen) {
            return response()->json(['message' => 'Kurir sudah dibayar untuk pesanan ini'], 400);
        }

        $request->validate([
            'proof_courier_paid' => 'required|image|max:5120',
        ]);

        $path = $request->file('proof_courier_paid')->store($this->getUserUploadPath($request->user(), 'proofs'), 'public');

        $order->update([
            'is_courier_paid_by_canteen' => true,
            'proof_courier_paid' => $path,
        ]);

        return response()->json(['message' => 'Berhasil menandai kurir telah dibayar', 'order' => $order]);
    }

    // For Canteen: Cancel order
    public function cancelOrder(Request $request, $id)
    {
        $canteen = $this->getActiveCanteen($request);
        if (!$canteen) {
            return response()->json(['message' => 'Kantin tidak ditemukan'], 404);
        }

        $order = Order::with('items.product')->where('id', $id)->where('canteen_id', $canteen->id)->firstOrFail();
        
        if ($order->status !== 'pending') {
            return response()->json(['message' => 'Pesanan tidak bisa dibatalkan karena sudah diproses'], 400);
        }

        DB::transaction(function () use ($order) {
            $order->status = 'cancelled';
            $order->save();

            // Restore stock and sold_count
            foreach ($order->items as $item) {
                if ($item->product) {
                    $item->product->increment('stock', $item->quantity);
                    $item->product->decrement('sold_count', $item->quantity);
                }
            }
        });

        return response()->json([
            'message' => 'Pesanan berhasil dibatalkan',
            'order' => $order
        ]);
    }

    // For User: Cancel their own order
    public function userCancelOrder(Request $request, $id)
    {
        $order = Order::with('items.product')->where('id', $id)->where('user_id', $request->user()->id)->firstOrFail();
        
        if ($order->status !== 'pending') {
            return response()->json(['message' => 'Pesanan tidak bisa dibatalkan karena sudah diproses'], 400);
        }

        DB::transaction(function () use ($order) {
            $order->status = 'cancelled';
            $order->save();

            // Restore stock and sold_count
            foreach ($order->items as $item) {
                if ($item->product) {
                    $item->product->increment('stock', $item->quantity);
                    $item->product->decrement('sold_count', $item->quantity);
                }
            }
        });

        return response()->json([
            'message' => 'Pesanan berhasil dibatalkan',
            'order' => $order
        ]);
    }

    // For User: Upload Payment Proof
    public function uploadPaymentProof(Request $request, $id)
    {
        $order = Order::where('user_id', $request->user()->id)->findOrFail($id);

        $request->validate([
            'proof_of_payment' => 'required|array|min:1',
            'proof_of_payment.*' => 'image|max:5120',
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
            'delivery_location' => $deliveryLocation,
        ]);

        $canteen->increment('sold_count', 1);

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
}
