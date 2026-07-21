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
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'delivery_location' => 'required|string',
            'voucher_code' => 'nullable|string',
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

            $total_price = 0;
            
            // Calculate dynamic delivery fee based on location
            $location = $request->delivery_location;
            $rates = $canteen->delivery_rates ?? [];
            $delivery_fee = isset($rates[$location]) 
                ? (float) $rates[$location] 
                : (isset($rates['Lainnya']) ? (float) $rates['Lainnya'] : (float) $canteen->delivery_fee);
                
            $total_price += $delivery_fee;

            $order = Order::create([
                'user_id' => $user->id,
                'canteen_id' => $canteen->id,
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

            // Voucher logic
            $discount_amount = 0;
            $voucher_id = null;
            if ($request->voucher_code) {
                $voucher = \App\Domains\Canteen\Voucher::where('code', $request->voucher_code)
                    ->where('canteen_id', $canteen->id)
                    ->where('is_active', true)
                    ->where(function($q) {
                        $q->whereNull('valid_until')->orWhere('valid_until', '>=', now());
                    })
                    ->first();
                    
                if ($voucher && $subtotal_items >= $voucher->min_purchase) {
                    $discount_amount = $voucher->discount_amount;
                    $voucher_id = $voucher->id;
                }
            }

            $total_price = $subtotal_items + $delivery_fee - $discount_amount;
            if ($total_price < 0) $total_price = 0;

            $order->update([
                'total_price' => $total_price,
                'voucher_id' => $voucher_id,
                'discount_amount' => $discount_amount
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

    // For Canteen: View orders
    public function canteenOrders(Request $request)
    {
        $canteen = $request->user()->canteen()->first();
        if (!$canteen) {
            return response()->json(['message' => 'Anda belum memiliki kantin'], 404);
        }

        $orders = Order::where('canteen_id', $canteen->id)
            ->with(['user', 'items.product', 'courier'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($orders);
    }

    // For Canteen: Update order payment status
    public function updatePaymentStatus(Request $request, $id)
    {
        $canteen = $request->user()->canteen()->first();
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

    // For Canteen: Complete order without courier
    public function completeByCanteen(Request $request, $id)
    {
        $canteen = $request->user()->canteen()->first();
        if (!$canteen) {
            return response()->json(['message' => 'Anda belum memiliki kantin'], 404);
        }

        $order = Order::where('canteen_id', $canteen->id)->findOrFail($id);

        if ($order->status !== 'pending') {
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

            // Add admin fee to canteen's debt
            $canteen->increment('admin_debt', $canteen->admin_fee);
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
        $canteen = $request->user()->canteen()->first();
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

    // For Courier: Complete order and upload proof
    public function completeOrder(Request $request, $id)
    {
        $order = Order::where('courier_id', $request->user()->id)->findOrFail($id);

        $request->validate([
            'proof_of_delivery' => 'required|array|min:1',
            'proof_of_delivery.*' => 'image|max:5120',
        ]);

        $paths = [];
        foreach ($request->file('proof_of_delivery') as $file) {
            $paths[] = $file->store($this->getUserUploadPath($request->user(), 'proofs'), 'public');
        }

        DB::transaction(function () use ($order, $paths) {
            $order->update([
                'status' => 'completed',
                'proof_of_delivery' => $paths,
                'payment_status' => 'paid', // Courier collects cash
            ]);

            $canteen = $order->canteen;
            if ($canteen) {
                $canteen->increment('admin_debt', $canteen->admin_fee);
            }
        });

        return response()->json(['message' => 'Pesanan berhasil diselesaikan', 'order' => $order]);
    }
    // For Canteen: Cancel order
    public function cancelOrder(Request $request, $id)
    {
        $canteen = $request->user()->canteen()->first();
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

        $order->update([
            'proof_of_payment' => $paths,
        ]);

        return response()->json(['message' => 'Bukti transfer berhasil diunggah', 'order' => $order]);
    }
}
