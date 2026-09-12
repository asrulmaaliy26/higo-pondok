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
                $pricing = Order::getPricingConfig();
                $base_delivery_fee = $pricing['base_delivery_fee'];
                $admin_fee = $pricing['base_admin_fee'];

                $order = Order::create([
                    'checkout_id' => $request->checkout_id ?: ('CHK-' . date('Ymd') . '-' . strtoupper(\Illuminate\Support\Str::random(6))),
                    'user_id' => $user->id,
                    'canteen_id' => $canteen->id,
                    'courier_id' => null,
                    'is_custom' => true,
                    'custom_notes' => $request->custom_notes,
                    'status' => 'pending',
                    'payment_status' => 'unpaid',
                    'total_price' => 0, // Pending canteen setting price
                    'admin_fee' => $admin_fee,
                    'delivery_fee' => $base_delivery_fee,
                    'delivery_location' => $request->delivery_location,
                ]);

                DB::commit();

                return response()->json([
                    'message' => 'Pesanan khusus berhasil dibuat. Menunggu penentuan harga dari toko.',
                    'order' => $order
                ], 201);
            }

            $total_price = 0;
            
            // Hitung tarif ongkir & admin berdasarkan kuantitas + urutan user di toko ini hari ini
            $totalQuantity = collect($request->items)->sum('quantity');
            $today = now('Asia/Jakarta')->format('Y-m-d');
            $userIndex = Order::getUserDailyIndex($user->id, $canteen->id, $today);
            $fees = Order::calculateUserRankedFees($totalQuantity, $userIndex);
            $delivery_fee = $fees['delivery_fee'];
            $admin_fee    = $fees['admin_fee'];

            $order = Order::create([
                'checkout_id' => $request->checkout_id ?: ('CHK-' . date('Ymd') . '-' . strtoupper(\Illuminate\Support\Str::random(6))),
                'user_id' => $user->id,
                'canteen_id' => $canteen->id,
                'courier_id' => null,
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

    /**
     * Batch Checkout untuk Multi-Toko dalam 1 Keranjang
     */
    public function batchStore(Request $request)
    {
        $user = $request->user();

        if (empty($user->phone) || empty($user->santri_name) || empty($user->santri_room) || empty($user->santri_class) || empty($user->santri_level)) {
            return response()->json([
                'message' => 'Profil santri Anda belum lengkap. Silakan lengkapi data profil (No. HP, Nama Santri, Kamar/Asrama, Kelas, Jenjang) sebelum membuat pesanan.',
                'error_code' => 'INCOMPLETE_PROFILE'
            ], 403);
        }

        $request->validate([
            'delivery_location' => 'required|string|max:255',
            'canteens' => 'required|array|min:1',
            'canteens.*.canteen_id' => 'required|exists:canteens,id',
            'canteens.*.items' => 'required|array|min:1',
            'canteens.*.items.*.product_id' => 'required|exists:products,id',
            'canteens.*.items.*.quantity' => 'required|integer|min:1',
        ]);

        $checkoutId = 'CHK-' . date('Ymd') . '-' . strtoupper(\Illuminate\Support\Str::random(6));
        $createdOrders = [];
        $grandTotal = 0;

        DB::beginTransaction();
        try {
            foreach ($request->canteens as $cData) {
                $canteen = Canteen::findOrFail($cData['canteen_id']);

                if (!$canteen->is_open) {
                    throw new \Exception("Maaf, kantin '{$canteen->name}' sedang tutup. Tidak dapat membuat pesanan.");
                }

                // Hitung tarif ongkir & admin per kantin berdasarkan kuantitas + urutan user hari ini
                $totalQuantity = collect($cData['items'])->sum('quantity');
                $today = now('Asia/Jakarta')->format('Y-m-d');
                $userIndex = Order::getUserDailyIndex($user->id, $canteen->id, $today);
                $fees = Order::calculateUserRankedFees($totalQuantity, $userIndex);
                $delivery_fee = $fees['delivery_fee'];
                $admin_fee    = $fees['admin_fee'];

                $order = Order::create([
                    'checkout_id' => $checkoutId,
                    'user_id' => $user->id,
                    'canteen_id' => $canteen->id,
                    'courier_id' => null,
                    'is_custom' => false,
                    'custom_notes' => $cData['custom_notes'] ?? null,
                    'status' => 'pending',
                    'payment_status' => 'unpaid',
                    'total_price' => 0,
                    'admin_fee' => $admin_fee,
                    'delivery_fee' => $delivery_fee,
                    'delivery_location' => $request->delivery_location,
                ]);

                $subtotal_items = 0;
                foreach ($cData['items'] as $item) {
                    $product = Product::findOrFail($item['product_id']);
                    if ($product->canteen_id !== $canteen->id) {
                        throw new \Exception("Produk {$product->name} bukan milik kantin {$canteen->name}.");
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
                        'notes' => $item['notes'] ?? null,
                    ]);

                    $subtotal_items += $subtotal;
                    $product->increment('sold_count', $item['quantity']);
                    $product->increment('stock', $item['quantity']);
                }

                $orderTotal = $subtotal_items + $delivery_fee + $admin_fee;
                $order->update([
                    'total_price' => $orderTotal,
                    'delivery_fee' => $delivery_fee,
                    'admin_fee' => $admin_fee,
                ]);
                $grandTotal += $orderTotal;

                $createdOrders[] = $order->load(['canteen', 'items.product']);
            }

            DB::commit();

            return response()->json([
                'message' => 'Pesanan berhasil dibuat untuk semua toko dalam 1 checkout!',
                'checkout_id' => $checkoutId,
                'grand_total' => $grandTotal,
                'orders' => $createdOrders
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Gagal membuat pesanan batch.',
                'error' => $e->getMessage()
            ], 400);
        }
    }

    private function getActiveCanteen(Request $request)
    {
        $canteenId = $request->query('canteen_id') ?? $request->input('canteen_id');
        if ($canteenId && $canteenId !== 'all') {
            return $request->user()->canteens()->where('id', $canteenId)->first();
        }
        return $request->user()->canteens()->first();
    }

    private function findCanteenOrder(Request $request, $id, $lock = false)
    {
        $user = $request->user();
        $query = Order::with(['canteen', 'user', 'items.product', 'courier']);
        
        if ($lock) {
            $query->lockForUpdate();
        }

        if ($user->hasRole('admin')) {
            return $query->findOrFail($id);
        }

        $userCanteenIds = $user->canteens()->pluck('id');
        if ($userCanteenIds->isEmpty()) {
            abort(404, 'Anda belum memiliki kantin');
        }

        return $query->whereIn('canteen_id', $userCanteenIds)->findOrFail($id);
    }

    // For Canteen: View orders
    public function canteenOrders(Request $request)
    {
        $canteenId = $request->query('canteen_id') ?? $request->input('canteen_id');
        
        $query = Order::with(['user', 'items.product', 'courier', 'canteen.couriers:users.id,users.name'])
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
        $order = $this->findCanteenOrder($request, $id);
        
        if ($order->status === 'cancelled') {
            return response()->json(['message' => 'Pesanan yang telah dibatalkan tidak dapat diubah status pembayarannya.'], 422);
        }

        $request->validate([
            'payment_status' => 'required|in:unpaid,waiting_confirmation,paid',
        ]);

        $paymentStatus = $request->payment_status;
        $order->update(['payment_status' => $paymentStatus]);

        // Jika memiliki checkout_id, sinkronkan status ke semua order lain dalam checkout yang sama
        if (!empty($order->checkout_id)) {
            Order::where('checkout_id', $order->checkout_id)->update(['payment_status' => $paymentStatus]);
        }

        $msg = $request->payment_status === 'paid' 
            ? 'Pembayaran berhasil divalidasi dan ditandai Lunas!' 
            : ($request->payment_status === 'waiting_confirmation' 
                ? 'Status pembayaran diubah ke Menunggu Validasi' 
                : 'Status pembayaran diubah ke Belum Bayar');

        return response()->json([
            'message' => $msg, 
            'order' => $order->load(['canteen', 'user', 'items.product', 'courier'])
        ]);
    }

    // For Canteen: Batch Update order status (Lanjutkan Semua / Selesaikan Semua / Tolak Semua)
    public function batchUpdateOrderStatus(Request $request)
    {
        $request->validate([
            'order_ids' => 'required|array|min:1',
            'order_ids.*' => 'integer',
            'status' => 'required|in:pending,processing,completed,cancelled',
        ]);

        $user = $request->user();
        $status = $request->status;

        return DB::transaction(function () use ($request, $user, $status) {
            $query = Order::with(['canteen', 'user', 'items.product', 'courier'])
                ->whereIn('id', $request->order_ids)
                ->lockForUpdate();

            if (!$user->hasRole('admin')) {
                $userCanteenIds = $user->canteens()->pluck('id');
                if ($userCanteenIds->isEmpty()) {
                    return response()->json(['message' => 'Anda belum memiliki kantin'], 403);
                }
                $query->whereIn('canteen_id', $userCanteenIds);
            }

            $orders = $query->get();
            $updatedOrders = [];
            $skippedOrders = [];

            foreach ($orders as $order) {
                if ($status === 'processing') {
                    $canteen = $order->canteen;
                    $assignedCouriers = DB::table('canteen_couriers')
                        ->where('canteen_id', $order->canteen_id)
                        ->pluck('courier_id')
                        ->toArray();

                    if (empty($assignedCouriers)) {
                        $skippedOrders[] = [
                            'id' => $order->id,
                            'canteen_id' => $order->canteen_id,
                            'canteen_name' => $canteen ? $canteen->name : "Toko #{$order->canteen_id}",
                            'reason' => 'Toko belum memiliki kurir yang ditugaskan oleh Admin.'
                        ];
                        continue;
                    }

                    if (!$order->courier_id) {
                        $order->courier_id = $assignedCouriers[0];
                    }
                }

                $order->update([
                    'status' => $status,
                    'courier_id' => $order->courier_id
                ]);

                $updatedOrders[] = $order->load(['canteen.couriers:users.id,users.name', 'user', 'items.product', 'courier']);
            }

            $successCount = count($updatedOrders);
            $skippedCount = count($skippedOrders);

            if ($successCount > 0 && $skippedCount === 0) {
                $message = 'Status semua pesanan berhasil diperbarui!';
            } elseif ($successCount > 0 && $skippedCount > 0) {
                $skippedNames = implode(', ', array_unique(array_column($skippedOrders, 'canteen_name')));
                $message = "{$successCount} pesanan berhasil diproses. Namun toko {$skippedNames} belum memiliki kurir yang ditugaskan Admin.";
            } elseif ($successCount === 0 && $skippedCount > 0) {
                $skippedNames = implode(', ', array_unique(array_column($skippedOrders, 'canteen_name')));
                $message = "Toko {$skippedNames} belum memiliki kurir yang ditugaskan oleh Admin. Pesanan tidak dapat diteruskan ke kurir.";
            } else {
                $message = 'Tidak ada pesanan yang diubah.';
            }

            return response()->json([
                'message' => $message,
                'updated_orders' => $updatedOrders,
                'skipped_orders' => $skippedOrders,
                'success_count' => $successCount,
                'skipped_count' => $skippedCount
            ]);
        });
    }

    // For Canteen: Update order status (Lanjutkan / Process / Cancel)
    public function updateOrderStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:pending,processing,completed,cancelled',
        ]);

        return DB::transaction(function () use ($id, $request) {
            $order = $this->findCanteenOrder($request, $id, true);

            if ($request->status === 'processing') {
                $canteen = $order->canteen;
                $assignedCouriers = DB::table('canteen_couriers')
                    ->where('canteen_id', $order->canteen_id)
                    ->pluck('courier_id')
                    ->toArray();

                if (empty($assignedCouriers)) {
                    $canteenName = $canteen ? $canteen->name : "Toko";
                    return response()->json([
                        'message' => "Toko \"{$canteenName}\" belum memiliki kurir yang ditugaskan oleh Admin. Pesanan tidak dapat diteruskan ke kurir.",
                        'error_code' => 'NO_COURIER_ASSIGNED'
                    ], 422);
                }

                if (!$order->courier_id) {
                    $order->courier_id = $assignedCouriers[0];
                }
            }

            $order->update([
                'status' => $request->status,
                'courier_id' => $order->courier_id
            ]);

            return response()->json([
                'message' => 'Status pesanan berhasil diperbarui',
                'order' => $order->load(['canteen.couriers:users.id,users.name', 'user', 'items.product', 'courier'])
            ]);
        });
    }

    // For Canteen: Complete order
    public function completeByCanteen(Request $request, $id)
    {
        $order = $this->findCanteenOrder($request, $id);

        if (!in_array($order->status, ['pending', 'processing'])) {
            return response()->json(['message' => 'Pesanan tidak bisa diselesaikan. Status saat ini: ' . $order->status], 400);
        }

        if (!$order->courier_id) {
            $request->validate([
                'proof_of_delivery' => 'required|array|min:1',
                'proof_of_delivery.*' => 'file',
            ]);
        } else {
            $request->validate([
                'proof_of_delivery' => 'nullable|array',
                'proof_of_delivery.*' => 'file',
            ]);
        }

        $paths = $order->proof_of_delivery ?? [];
        if ($request->hasFile('proof_of_delivery')) {
            $paths = [];
            foreach ($request->file('proof_of_delivery') as $file) {
                $paths[] = $this->storeOrderProofImage($file, $order, 'proff_delivery');
            }
        }

        return DB::transaction(function () use ($id, $request, $paths) {
            $order = $this->findCanteenOrder($request, $id, true);
            $canteen = $order->canteen;
            
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

            $subtotal = ($order->items && $order->items->count() > 0) ? $order->items->sum('subtotal') : (float) $order->total_price;
            $admin_fee = (float) $order->admin_fee;
            $delivery_fee = (float) $order->delivery_fee;

            // Saldo Bersih Kantin (Selisih HPJ dan HPP, ditambah ongkir jika tanpa kurir)
            $canteenNet = (float) $order->canteen_income;
            $delivery_fee = (float) $order->delivery_fee;

            if ($canteen) {
                \App\Domains\Canteen\CanteenBalanceLedger::record(
                    $canteen,
                    'in',
                    $canteenNet,
                    "Penerimaan laba bersih pesanan #" . $order->id . ($order->courier_id ? "" : " (Tanpa Kurir)"),
                    $order->id
                );
                $canteen->increment('balance', $canteenNet);
                
                \App\Domains\Admin\PaymentLog::create([
                    'user_id' => $canteen->user_id,
                    'order_id' => $order->id,
                    'amount' => $canteenNet,
                    'type' => 'order_payment',
                    'description' => "Penerimaan laba bersih pesanan #" . $order->id . ($order->courier_id ? "" : " (Tanpa Kurir)"),
                ]);

                $canteen->increment('sold_count', 1);
            }

            if ($order->courier_id) {
                $courier = User::find($order->courier_id);
                if ($courier && $delivery_fee > 0) {
                    // Kurir menerima 100% delivery_fee yang sudah terkoreksi di DB saat checkout.
                    $courier->increment('balance', $delivery_fee);
                    
                    \App\Domains\Admin\PaymentLog::create([
                        'user_id'     => $courier->id,
                        'order_id'    => $order->id,
                        'amount'      => $delivery_fee,
                        'type'        => 'courier_fee',
                        'description' => "Penerimaan ongkir pesanan #" . $order->id,
                    ]);
                }
            }

            return response()->json(['message' => 'Pesanan berhasil diselesaikan', 'order' => $order]);
        });
    }

    // For Canteen: Get list of couriers assigned to this canteen
    public function getCouriers(Request $request)
    {
        $canteenId = $request->query('canteen_id') ?? $request->input('canteen_id');
        if (!$canteenId) {
            $canteen = $request->user()->canteens()->first();
            $canteenId = $canteen?->id;
        }

        if (!$canteenId) {
            return response()->json([]);
        }

        $canteen = Canteen::find($canteenId);
        if (!$canteen) {
            return response()->json([]);
        }

        $couriers = $canteen->couriers()
            ->where('is_working', true)
            ->get(['users.id', 'users.name', 'users.phone']);

        return response()->json($couriers);
    }

    // For Canteen: Assign courier to order (or self delivery)
    public function assignCourier(Request $request, $id)
    {
        $request->validate([
            'courier_id' => 'nullable',
        ]);

        return DB::transaction(function () use ($id, $request) {
            $order = $this->findCanteenOrder($request, $id, true);
            
            if ($order->status !== 'pending') {
                return response()->json(['message' => 'Pesanan tidak bisa diproses karena status saat ini: ' . $order->status], 400);
            }

            $canteen = $order->canteen;
            $assignedCouriers = $canteen ? $canteen->couriers()->pluck('users.id')->toArray() : [];
            $inputCourierId = $request->courier_id;
            $isSelf = ($inputCourierId === 'self');

            // Jika bukan self delivery dan toko tidak punya kurir sama sekali:
            if (!$isSelf && empty($assignedCouriers)) {
                return response()->json([
                    'message' => 'Toko belum memiliki kurir yang ditugaskan oleh Admin. Pesanan tidak dapat diteruskan ke kurir.',
                    'error_code' => 'NO_COURIER_ASSIGNED'
                ], 422);
            }

            // Jika kurir_id tidak dikirim (atau auto-assign):
            // Jika toko memiliki tepat 1 kurir, otomatis gunakan kurir tersebut
            if (!$isSelf && (empty($inputCourierId) || $inputCourierId === 'auto' || $inputCourierId === 'null')) {
                if (count($assignedCouriers) === 1) {
                    $courierId = $assignedCouriers[0];
                } else {
                    return response()->json([
                        'message' => 'Silakan pilih salah satu kurir toko yang tersedia untuk mengantar pesanan ini.'
                    ], 422);
                }
            } elseif ($isSelf) {
                $courierId = null;
            } else {
                $courierId = (int) $inputCourierId;
                if (!in_array($courierId, $assignedCouriers)) {
                    return response()->json([
                        'message' => 'Kurir yang dipilih bukan merupakan kurir yang terdaftar untuk toko ini.'
                    ], 422);
                }
            }

            $order->update([
                'courier_id' => $courierId,
                'status' => 'processing'
            ]);

            return response()->json([
                'message' => 'Pesanan berhasil diproses dan diteruskan' . ($courierId ? ' ke kurir' : ' (antar sendiri)'),
                'order' => $order->load(['canteen', 'user', 'items.product', 'courier'])
            ]);
        });
    }

    // For User: View their own orders
    public function userOrders(Request $request)
    {
        $user = $request->user();
        $startDate = $request->query('start_date');
        $endDate = $request->query('end_date');
        $status = $request->query('status');

        $query = Order::where('user_id', $user->id)
            ->with(['canteen', 'items.product', 'courier'])
            ->orderBy('created_at', 'desc');

        if ($startDate && $endDate) {
            $query->whereBetween('created_at', [
                $startDate . ' 00:00:00',
                $endDate . ' 23:59:59'
            ]);
        }

        if ($status && $status !== 'all') {
            $query->where('status', $status);
        }

        $orders = $query->get();

        return response()->json($orders);
    }

    // For Courier: View all orders or filtered by scope/status/canteen/date/search
    public function courierOrders(Request $request)
    {
        $user = $request->user();
        $courierId = $user->id;
        $scope = $request->query('scope', 'all'); // 'all', 'assigned', 'pending', 'processing', 'completed', 'cancelled'
        $search = $request->query('search');
        $canteenId = $request->query('canteen_id');
        $startDate = $request->query('start_date');
        $endDate = $request->query('end_date');

        if (!$user->hasRole('admin')) {
            $assignedCanteenIds = $user->assignedCanteens()->pluck('canteens.id')->toArray();
            if (empty($assignedCanteenIds)) {
                return response()->json([]);
            }
        }

        $query = Order::with(['canteen', 'user', 'items.product', 'courier'])
            ->orderByRaw("CASE 
                WHEN status = 'processing' THEN 1 
                WHEN status = 'pending' THEN 2 
                WHEN status = 'completed' THEN 3 
                WHEN status = 'cancelled' THEN 4 
                ELSE 5 
            END ASC")
            ->orderBy('created_at', 'desc');

        if (!$user->hasRole('admin')) {
            $query->whereIn('canteen_id', $assignedCanteenIds)
                  ->where('courier_id', $courierId);
        }

        if ($scope === 'assigned') {
            $query->where('courier_id', $courierId);
        } elseif ($scope === 'pending') {
            // Pending orders belum diteruskan oleh kantin
            if (!$user->hasRole('admin')) {
                return response()->json([]);
            }
            $query->where('status', 'pending');
        } elseif ($scope === 'processing') {
            $query->where('status', 'processing');
        } elseif ($scope === 'completed') {
            $query->where('status', 'completed');
        } elseif ($scope === 'cancelled') {
            $query->where('status', 'cancelled');
        }

        if ($canteenId && $canteenId !== 'all') {
            $query->where('canteen_id', $canteenId);
        }

        if ($startDate && $endDate) {
            $start = \Illuminate\Support\Carbon::parse($startDate, 'Asia/Jakarta')->startOfDay();
            $end = \Illuminate\Support\Carbon::parse($endDate, 'Asia/Jakarta')->endOfDay();
            $query->whereBetween('created_at', [$start, $end]);
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('id', 'like', "%{$search}%")
                  ->orWhere('custom_notes', 'like', "%{$search}%")
                  ->orWhere('delivery_location', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($uq) use ($search) {
                      $uq->where('name', 'like', "%{$search}%")
                         ->orWhere('santri_name', 'like', "%{$search}%")
                         ->orWhere('santri_room', 'like', "%{$search}%")
                         ->orWhere('phone', 'like', "%{$search}%");
                  })
                  ->orWhereHas('canteen', function ($cq) use ($search) {
                      $cq->where('name', 'like', "%{$search}%");
                  })
                  ->orWhereHas('items.product', function ($pq) use ($search) {
                      $pq->where('name', 'like', "%{$search}%");
                  });
            });
        }

        $orders = $query->get();
            
        return response()->json($orders);
    }

    // For Courier: Take / Claim an order to deliver
    public function takeOrder(Request $request, $id)
    {
        $user = $request->user();
        if (!$user->hasRole('kurir') && !$user->hasRole('admin')) {
            return response()->json(['message' => 'Hanya kurir yang dapat mengambil pesanan'], 403);
        }

        return DB::transaction(function () use ($id, $user) {
            $order = Order::with(['canteen', 'user', 'items.product', 'courier'])->lockForUpdate()->findOrFail($id);

            if ($order->status === 'completed' || $order->status === 'cancelled') {
                return response()->json(['message' => 'Pesanan sudah selesai atau dibatalkan'], 400);
            }

            $order->update([
                'courier_id' => $user->id,
                'status' => 'processing'
            ]);

            return response()->json([
                'message' => 'Pesanan berhasil diambil! Silakan beli/ambil makanan di kantin dan antarkan ke santri.',
                'order' => $order
            ]);
        });
    }

    // For Courier / Canteen: Upload purchase receipt (Struk Pembelian / Bukti Pesanan)
    public function uploadPurchaseProof(Request $request, $id)
    {
        $user = $request->user();
        $order = Order::findOrFail($id);

        $isCourier = $user->hasRole('kurir');
        $isOrderCourier = $order->courier_id === $user->id;
        $isCanteenOwner = $order->canteen && $order->canteen->user_id === $user->id;

        if (!$isCourier && !$isOrderCourier && !$isCanteenOwner && !$user->hasRole('admin')) {
            return response()->json(['message' => 'Anda tidak memiliki akses untuk mengunggah struk pesanan ini'], 403);
        }

        $request->validate([
            'proof_of_purchase' => 'required|array|min:1',
            'proof_of_purchase.*' => 'file',
        ]);

        $newPaths = [];
        foreach ($request->file('proof_of_purchase') as $file) {
            $newPaths[] = $this->storeOrderProofImage($file, $order, 'proff_kantin');
        }

        $existing = is_array($order->proof_of_purchase) ? $order->proof_of_purchase : ($order->proof_of_purchase ? [$order->proof_of_purchase] : []);
        $merged = array_merge($existing, $newPaths);

        $updateData = ['proof_of_purchase' => $merged];
        if ($isCourier && !$order->courier_id) {
            $updateData['courier_id'] = $user->id;
            if ($order->status === 'pending') {
                $updateData['status'] = 'processing';
            }
        }

        $order->update($updateData);

        return response()->json(['message' => 'Bukti pesanan/struk berhasil ditambahkan', 'order' => $order->load(['canteen', 'user', 'items.product', 'courier'])]);
    }

    // For Courier / Canteen: Upload delivery proof (Bukti Serah Terima / Pengiriman)
    public function uploadDeliveryProof(Request $request, $id)
    {
        $user = $request->user();
        $order = Order::findOrFail($id);

        $isCourier = $user->hasRole('kurir');
        $isOrderCourier = $order->courier_id === $user->id;
        $isCanteenOwner = $order->canteen && $order->canteen->user_id === $user->id;

        if (!$isCourier && !$isOrderCourier && !$isCanteenOwner && !$user->hasRole('admin')) {
            return response()->json(['message' => 'Anda tidak memiliki akses untuk mengunggah bukti serah terima'], 403);
        }

        $request->validate([
            'proof_of_delivery' => 'required|array|min:1',
            'proof_of_delivery.*' => 'file',
        ]);

        $newPaths = [];
        foreach ($request->file('proof_of_delivery') as $file) {
            $newPaths[] = $this->storeOrderProofImage($file, $order, 'proff_delivery');
        }

        $existing = is_array($order->proof_of_delivery) ? $order->proof_of_delivery : ($order->proof_of_delivery ? [$order->proof_of_delivery] : []);
        $merged = array_merge($existing, $newPaths);

        $updateData = ['proof_of_delivery' => $merged];
        if ($isCourier && !$order->courier_id) {
            $updateData['courier_id'] = $user->id;
            if ($order->status === 'pending') {
                $updateData['status'] = 'processing';
            }
        }

        $order->update($updateData);

        return response()->json(['message' => 'Bukti serah terima berhasil ditambahkan', 'order' => $order->load(['canteen', 'user', 'items.product', 'courier'])]);
    }

    // For Courier / Canteen: Delete a specific uploaded photo
    public function deleteProofPhoto(Request $request, $id)
    {
        $user = $request->user();
        $order = Order::findOrFail($id);

        $isCourier = $user->hasRole('kurir');
        $isOrderCourier = $order->courier_id === $user->id;
        $isCanteenOwner = $order->canteen && $order->canteen->user_id === $user->id;

        if (!$isCourier && !$isOrderCourier && !$isCanteenOwner && !$user->hasRole('admin')) {
            return response()->json(['message' => 'Anda tidak memiliki akses untuk menghapus foto ini'], 403);
        }

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

        return response()->json(['message' => 'Foto berhasil dihapus', 'order' => $order->load(['canteen', 'user', 'items.product', 'courier'])]);
    }

    // For Courier: Mark order as completed
    public function completeOrder(Request $request, $id)
    {
        $user = $request->user();
        
        return DB::transaction(function () use ($id, $user) {
            $order = Order::with(['items.product', 'canteen'])->lockForUpdate()->findOrFail($id);
            
            $isCourier = $user->hasRole('kurir');
            $isOrderCourier = $order->courier_id === $user->id;

            if (!$isCourier && !$isOrderCourier && !$user->hasRole('admin')) {
                return response()->json(['message' => 'Anda tidak memiliki akses untuk menyelesaikan pesanan ini.'], 403);
            }

            if ($order->status === 'completed' || $order->status === 'cancelled') {
                return response()->json(['message' => 'Pesanan sudah selesai atau dibatalkan.'], 400);
            }

            $courierId = $order->courier_id ?: $user->id;

            $order->update([
                'courier_id' => $courierId,
                'status' => 'completed',
                'payment_status' => 'paid',
            ]);

            // Decrement active order stock
            foreach ($order->items as $item) {
                if ($item->product) {
                    $item->product->decrement('stock', $item->quantity);
                }
            }

            // Saldo Bersih Kantin (Selisih HPJ dan HPP)
            $canteenNet = (float) $order->canteen_income;
            $delivery_fee = (float) $order->delivery_fee;

            if ($order->canteen) {
                $canteen = $order->canteen;
                \App\Domains\Canteen\CanteenBalanceLedger::record(
                    $canteen,
                    'in',
                    $canteenNet,
                    "Penerimaan laba bersih pesanan #" . $order->id,
                    $order->id
                );
                $canteen->increment('balance', $canteenNet);
                
                \App\Domains\Admin\PaymentLog::create([
                    'user_id' => $canteen->user_id,
                    'order_id' => $order->id,
                    'amount' => $canteenNet,
                    'type' => 'order_payment',
                    'description' => "Penerimaan laba bersih pesanan #" . $order->id,
                ]);

                $canteen->increment('sold_count', 1);
            }

            $courier = User::find($courierId);
            if ($courier && $delivery_fee > 0) {
                // Kurir menerima 100% delivery_fee yang sudah terkoreksi di DB saat checkout.
                $courier->increment('balance', $delivery_fee);
                
                \App\Domains\Admin\PaymentLog::create([
                    'user_id'     => $courier->id,
                    'order_id'    => $order->id,
                    'amount'      => $delivery_fee,
                    'type'        => 'courier_fee',
                    'description' => "Penerimaan ongkir pesanan #" . $order->id,
                ]);
            }
            
            return response()->json(['message' => 'Pesanan berhasil diselesaikan', 'order' => $order->load(['canteen', 'user', 'items.product', 'courier'])]);
        });
    }

    // For Courier: Cancel or revert order (including completed ones)
    public function courierCancelOrder(Request $request, $id)
    {
        return DB::transaction(function () use ($id, $request) {
            $user = $request->user();
            $order = Order::with(['items.product', 'canteen'])->where('id', $id)->lockForUpdate()->firstOrFail();
            $prevStatus = $order->status;

            // If order was completed, revert balance and log it
            if ($prevStatus === 'completed') {
                $canteen = $order->canteen;
                if ($canteen) {
                    $canteenNet = (float) $order->canteen_income;
                    \App\Domains\Canteen\CanteenBalanceLedger::record(
                        $canteen,
                        'out',
                        $canteenNet,
                        "Pembalikan pendapatan pesanan #" . $order->id . " karena dibatalkan oleh kurir",
                        $order->id
                    );
                    $canteen->decrement('balance', min((float)$canteen->balance, $canteenNet));
                    $canteen->decrement('sold_count', 1);

                    \App\Domains\Admin\PaymentLog::create([
                        'user_id' => $canteen->user_id,
                        'order_id' => $order->id,
                        'amount' => $canteenNet,
                        'type' => 'order_cancel_reversal',
                        'description' => "Pembalikan saldo kantin untuk pesanan #" . $order->id . " dibatalkan kurir",
                    ]);
                }

                $courier = User::find($order->courier_id);
                $deliveryFee = (float) $order->delivery_fee;
                if ($courier && $deliveryFee > 0) {
                    $courier->decrement('balance', min((float)$courier->balance, $deliveryFee));
                    \App\Domains\Admin\PaymentLog::create([
                        'user_id' => $courier->id,
                        'order_id' => $order->id,
                        'amount' => $deliveryFee,
                        'type' => 'courier_fee_reversal',
                        'description' => "Pembalikan ongkir kurir pesanan #" . $order->id . " karena dibatalkan",
                    ]);
                }
            }

            // If order was completed or processing, adjust stock/sold_count
            if ($prevStatus === 'completed' || $prevStatus === 'processing') {
                foreach ($order->items as $item) {
                    if ($item->product) {
                        $item->product->decrement('sold_count', $item->quantity);
                        $item->product->increment('stock', $item->quantity);
                    }
                }
            }

            $order->status = 'cancelled';
            $order->save();

            return response()->json([
                'message' => 'Pesanan berhasil dibatalkan',
                'order' => $order->load(['canteen', 'user', 'items.product', 'courier'])
            ]);
        });
    }

    // For Canteen: Cancel order
    public function cancelOrder(Request $request, $id)
    {
        return DB::transaction(function () use ($id, $request) {
            $order = $this->findCanteenOrder($request, $id, true);
            
            if ($order->status !== 'pending') {
                return response()->json(['message' => 'Pesanan tidak bisa dibatalkan karena sudah diproses'], 400);
            }

            $order->status = 'cancelled';
            $order->save();

            // Restore sold_count, and decrement stock
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
        $request->validate([
            'proof_of_payment' => 'required|array|min:1|max:5',
            'proof_of_payment.*' => 'required|file|max:15360',
        ]);

        $order = DB::transaction(function () use ($request, $id) {
            $user = $request->user();
            if ($user->hasRole('admin')) {
                $order = Order::lockForUpdate()->findOrFail($id);
            } else {
                $order = Order::where('user_id', $user->id)
                    ->lockForUpdate()
                    ->findOrFail($id);
            }

            $targetUser = $order->user ?: $user;

            $paths = [];
            foreach ($request->file('proof_of_payment') as $file) {
                $paths[] = $this->storeOrderProofImage($file, $order, 'proof');
            }

            $existingProofs = is_array($order->proof_of_payment) ? $order->proof_of_payment : [];
            $mergedPaths = array_values(array_unique(array_merge($existingProofs, $paths)));

            // Sinkronkan ke seluruh pesanan dalam checkout_id yang sama jika ada
            if (!empty($order->checkout_id)) {
                $linkedOrders = Order::where('checkout_id', $order->checkout_id)->lockForUpdate()->get();
                foreach ($linkedOrders as $linked) {
                    $linkedExisting = is_array($linked->proof_of_payment) ? $linked->proof_of_payment : [];
                    $linkedMerged = array_values(array_unique(array_merge($linkedExisting, $paths)));
                    $linked->update([
                        'proof_of_payment' => $linkedMerged,
                        'payment_status' => 'waiting_confirmation',
                    ]);
                }
            } else {
                $order->update([
                    'proof_of_payment' => $mergedPaths,
                    'payment_status' => 'waiting_confirmation',
                ]);
            }

            return $order;
        });

        return response()->json([
            'message' => 'Bukti transfer berhasil diunggah! Menunggu konfirmasi & validasi pembayaran.',
            'order' => $order->load(['canteen', 'user', 'items.product', 'courier'])
        ]);
    }

    /**
     * Upload bukti bayar langsung per Checkout ID (Gabungan Multi-Toko)
     */
    public function uploadPaymentProofByCheckout(Request $request, $checkoutId)
    {
        $request->validate([
            'proof_of_payment' => 'required|array|min:1|max:5',
            'proof_of_payment.*' => 'required|file|max:15360',
        ]);

        $user = $request->user();

        $orders = DB::transaction(function () use ($request, $checkoutId, $user) {
            $query = Order::where('checkout_id', $checkoutId)->lockForUpdate();
            if (!$user->hasRole('admin')) {
                $query->where('user_id', $user->id);
            }
            $orders = $query->get();

            if ($orders->isEmpty()) {
                throw new \Exception("Pesanan dengan Kode Checkout {$checkoutId} tidak ditemukan.");
            }

            $targetUser = $orders->first()->user ?: $user;

            $targetOrder = $orders->first();
            $paths = [];
            foreach ($request->file('proof_of_payment') as $file) {
                $paths[] = $this->storeOrderProofImage($file, $targetOrder, 'proof');
            }

            foreach ($orders as $order) {
                $existing = is_array($order->proof_of_payment) ? $order->proof_of_payment : [];
                $merged = array_values(array_unique(array_merge($existing, $paths)));
                $order->update([
                    'proof_of_payment' => $merged,
                    'payment_status' => 'waiting_confirmation',
                ]);
            }

            return $orders;
        });

        return response()->json([
            'message' => 'Bukti transfer berhasil diunggah untuk seluruh pesanan dalam checkout ini!',
            'checkout_id' => $checkoutId,
            'orders' => $orders->load(['canteen', 'user', 'items.product', 'courier'])
        ]);
    }

    // For Canteen: Upload payment proof on behalf of santri
    public function uploadPaymentProofByCanteen(Request $request, $id)
    {
        $request->validate([
            'proof_of_payment' => 'required',
            'proof_of_payment.*' => 'file|max:15360',
            'payment_status' => 'nullable|in:unpaid,waiting_confirmation,paid',
        ]);

        $order = DB::transaction(function () use ($request, $id) {
            $order = $this->findCanteenOrder($request, $id, true);

            if ($order->status === 'cancelled') {
                abort(422, 'Pesanan yang telah dibatalkan tidak dapat diunggah bukti pembayarannya.');
            }

            $files = $request->file('proof_of_payment');
            if (!is_array($files)) {
                $files = [$files];
            }

            $targetUser = $order->user ?: $request->user();

            $paths = [];
            foreach ($files as $file) {
                if ($file) {
                    $paths[] = $this->storeOptimizedImage($file, $targetUser, 'proofs');
                }
            }

            $existingProofs = is_array($order->proof_of_payment) ? $order->proof_of_payment : ($order->proof_of_payment ? [$order->proof_of_payment] : []);
            $mergedPaths = array_values(array_unique(array_merge($existingProofs, $paths)));

            // Default to 'paid' when canteen uploads payment proof, or accept choice
            $newPaymentStatus = $request->input('payment_status', 'paid');

            if (!empty($order->checkout_id)) {
                $linkedOrders = Order::where('checkout_id', $order->checkout_id)->lockForUpdate()->get();
                foreach ($linkedOrders as $linked) {
                    $linkedExisting = is_array($linked->proof_of_payment) ? $linked->proof_of_payment : [];
                    $linkedMerged = array_values(array_unique(array_merge($linkedExisting, $paths)));
                    $linked->update([
                        'proof_of_payment' => $linkedMerged,
                        'payment_status' => $newPaymentStatus,
                    ]);
                }
            } else {
                $order->update([
                    'proof_of_payment' => $mergedPaths,
                    'payment_status' => $newPaymentStatus,
                ]);
            }

            return $order;
        });

        return response()->json([
            'message' => 'Bukti transfer berhasil diunggah dan status pembayaran diperbarui!',
            'order' => $order->load(['canteen', 'user', 'items.product', 'courier'])
        ]);
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

        $pricing = Order::getPricingConfig();
        $admin_fee = $pricing['base_admin_fee'];
        $delivery_fee = $pricing['base_delivery_fee'];
        $productPrice = (float) $request->total_price;
        $totalPrice = $productPrice > 0 ? ($productPrice + $admin_fee + $delivery_fee) : 0;

        $courierUser = User::where('name', 'like', '%kurir1%')->first() ?: User::whereHas('roles', fn($q) => $q->where('name', 'kurir'))->first();

        $order = Order::create([
            'user_id' => $targetUser->id,
            'canteen_id' => $canteen->id,
            'courier_id' => $courierUser ? $courierUser->id : null,
            'is_custom' => true,
            'custom_notes' => $request->custom_notes,
            'status' => 'pending',
            'payment_status' => 'unpaid',
            'total_price' => $totalPrice,
            'admin_fee' => $admin_fee,
            'delivery_fee' => $delivery_fee,
            'delivery_location' => $deliveryLocation,
        ]);

        return response()->json(['message' => 'Pesanan manual berhasil dibuat untuk santri!', 'order' => $order], 201);
    }

    // For Canteen: Set/update custom order price
    public function setCustomOrderPrice(Request $request, $id)
    {
        $order = $this->findCanteenOrder($request, $id);

        if ($order->payment_status === 'paid') {
            return response()->json(['message' => 'Pesanan sudah berstatus Lunas, harga tidak dapat diubah lagi.'], 400);
        }

        $request->validate([
            'total_price' => 'required|numeric|min:0',
        ]);

        $productPrice = (float) $request->total_price;
        $canteen = $order->canteen;
        $category = $canteen ? ($canteen->category ?? 'kauman') : 'kauman';

        $admin_fee = ((float) $order->admin_fee > 0) ? (float) $order->admin_fee : 1500;
        $delivery_fee = ((float) $order->delivery_fee > 0) ? (float) $order->delivery_fee : 3500;

        $total_price = $productPrice > 0 ? ($productPrice + $admin_fee + $delivery_fee) : 0;

        $order->update([
            'total_price' => $total_price,
            'admin_fee' => $admin_fee,
            'delivery_fee' => $delivery_fee,
        ]);

        return response()->json([
            'message' => 'Harga barang pesanan khusus berhasil diperbarui',
            'order' => $order->load(['canteen', 'user', 'items.product', 'courier'])
        ]);
    }

    // For Canteen: Get order recapitulation (per product/canteen and per santri/wali)
    public function recap(Request $request)
    {
        $canteenId = $request->query('canteen_id');
        $userCanteenIds = $request->user()->canteens()->pluck('id');

        if ($userCanteenIds->isEmpty()) {
            return response()->json(['message' => 'Kantin tidak ditemukan'], 404);
        }

        $period = $request->get('period', 'day');
        $startDate = $request->query('start_date');
        $endDate = $request->query('end_date');

        $query = Order::forRecap()->filterPeriod($period, $startDate, $endDate);

        if ($canteenId && $canteenId !== 'all') {
            if (!$userCanteenIds->contains($canteenId)) {
                return response()->json(['message' => 'Anda tidak memiliki akses ke kantin ini'], 403);
            }
            $query->where('canteen_id', $canteenId);
        } else {
            $query->whereIn('canteen_id', $userCanteenIds);
        }

        $orders = $query->orderBy('created_at', 'asc')->orderBy('id', 'asc')->get();

        return response()->json(Order::calculateRecap($orders, $period));
    }

    /**
     * Dapatkan konfigurasi tarif & biaya aktif untuk frontend
     */
    public function pricingConfig(): \Illuminate\Http\JsonResponse
    {
        return response()->json([
            'success' => true,
            'data'    => Order::getPricingConfig(),
        ]);
    }
}
