<?php

namespace App\Domains\Admin\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Domains\Canteen\Order;
use App\Domains\Admin\ActivityLog;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;

class AdminOrderController extends Controller
{
    /**
     * Get all orders with filtering and search
     */
    public function index(Request $request)
    {
        $query = Order::with(['user', 'canteen', 'courier', 'items.product'])
            ->orderBy('created_at', 'desc');

        // Filter by Canteen / Toko
        $canteenId = $request->query('canteen_id');
        if ($canteenId && $canteenId !== 'all') {
            $query->where('canteen_id', $canteenId);
        }

        // Filter by Order Status
        $status = $request->query('status');
        if ($status && $status !== 'all') {
            if (in_array($status, ['unpaid', 'waiting_confirmation', 'paid'])) {
                $query->where('payment_status', $status);
            } else {
                $query->where('status', $status);
            }
        }

        // Filter by Payment Status
        $paymentStatus = $request->query('payment_status');
        if ($paymentStatus && $paymentStatus !== 'all') {
            $query->where('payment_status', $paymentStatus);
        }

        // Filter by Date Range
        $startDate = $request->query('start_date');
        $endDate = $request->query('end_date');
        if ($startDate && $endDate) {
            $start = Carbon::parse($startDate, 'Asia/Jakarta')->startOfDay();
            $end = Carbon::parse($endDate, 'Asia/Jakarta')->endOfDay();
            $query->whereBetween('created_at', [$start, $end]);
        }

        // Search by ID, User name, Santri name, Canteen name, Delivery location
        $search = $request->query('search');
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
                  ->orWhereHas('courier', function ($rq) use ($search) {
                      $rq->where('name', 'like', "%{$search}%");
                  });
            });
        }

        $orders = $query->get();

        return response()->json($orders);
    }

    /**
     * Get global order recapitulation for Admin
     */
    public function recap(Request $request)
    {
        $canteenId = $request->query('canteen_id');
        $period = $request->query('period', 'day'); // day, week, month, year, custom
        $startDate = $request->query('start_date');
        $endDate = $request->query('end_date');

        // Only count processing and completed orders for recap (sudah dilanjutkan)
        $query = Order::whereIn('status', ['processing', 'completed'])
            ->with(['user', 'items.product', 'canteen']);

        if ($canteenId && $canteenId !== 'all') {
            $query->where('canteen_id', $canteenId);
        }

        if ($startDate && $endDate) {
            $start = Carbon::parse($startDate, 'Asia/Jakarta')->startOfDay();
            $end = Carbon::parse($endDate, 'Asia/Jakarta')->endOfDay();
            $query->whereBetween('created_at', [$start, $end]);
        } elseif ($period === 'all') {
            // No date filter - all time
        } else {
            if ($period === 'week') {
                $query->whereBetween('created_at', [
                    now('Asia/Jakarta')->startOfWeek(),
                    now('Asia/Jakarta')->endOfWeek()
                ]);
            } elseif ($period === 'month') {
                $query->whereMonth('created_at', now('Asia/Jakarta')->month)
                      ->whereYear('created_at', now('Asia/Jakarta')->year);
            } elseif ($period === 'year') {
                $query->whereYear('created_at', now('Asia/Jakarta')->year);
            } else {
                // Default: day (hari ini)
                $query->whereDate('created_at', now('Asia/Jakarta')->format('Y-m-d'));
            }
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

        // Sort breakdowns
        usort($productBreakdown, fn($a, $b) => $b['total_quantity'] <=> $a['total_quantity']);
        usort($canteenRecap, fn($a, $b) => $b['grand_total'] <=> $a['grand_total']);
        usort($userRecap, fn($a, $b) => $b['grand_total'] <=> $a['grand_total']);

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

    /**
     * Move an order to Recycle Bin (Soft Delete)
     */
    public function destroy(Request $request, $id)
    {
        return DB::transaction(function () use ($request, $id) {
            $order = Order::findOrFail($id);

            $orderId = $order->id;
            $canteenName = $order->canteen ? $order->canteen->name : "Kantin #{$order->canteen_id}";
            $customerName = $order->user ? $order->user->name : "User #{$order->user_id}";
            $totalAmount = number_format($order->total_price, 0, ',', '.');

            // Soft delete order
            $order->delete();

            // Log activity
            ActivityLog::create([
                'user_id' => $request->user()->id,
                'action' => 'trash_order',
                'model_type' => Order::class,
                'model_id' => $orderId,
                'description' => "Admin {$request->user()->name} memindahkan pesanan #{$orderId} ({$canteenName} - {$customerName} Rp {$totalAmount}) ke Kotak Sampah",
            ]);

            return response()->json([
                'message' => "Pesanan #{$orderId} berhasil dipindahkan ke Kotak Sampah.",
            ]);
        });
    }

    /**
     * List all deleted orders in Recycle Bin
     */
    public function trash(Request $request)
    {
        $trashedOrders = Order::onlyTrashed()
            ->with(['user', 'canteen', 'items.product', 'courier'])
            ->latest('deleted_at')
            ->get();

        return response()->json($trashedOrders);
    }

    /**
     * Restore an order from Recycle Bin
     */
    public function restore(Request $request, $id)
    {
        return DB::transaction(function () use ($request, $id) {
            $order = Order::onlyTrashed()->with(['canteen', 'user'])->findOrFail($id);
            $orderId = $order->id;
            $canteenName = $order->canteen ? $order->canteen->name : "Kantin #{$order->canteen_id}";
            $customerName = $order->user ? $order->user->name : "User #{$order->user_id}";

            $order->restore();

            ActivityLog::create([
                'user_id' => $request->user()->id,
                'action' => 'restore_order',
                'model_type' => Order::class,
                'model_id' => $orderId,
                'description' => "Admin {$request->user()->name} memulihkan pesanan #{$orderId} ({$canteenName} - {$customerName}) dari Kotak Sampah",
            ]);

            return response()->json([
                'message' => "Pesanan #{$orderId} berhasil dipulihkan.",
            ]);
        });
    }

    /**
     * Permanently delete an order from Recycle Bin (Hard Delete with File Cleanup)
     */
    public function forceDelete(Request $request, $id)
    {
        return DB::transaction(function () use ($request, $id) {
            $order = Order::onlyTrashed()->with(['items', 'canteen', 'user'])->findOrFail($id);

            // Delete proof files from public storage
            $deleteFiles = function ($field) {
                if (empty($field)) return;
                $files = is_array($field) ? $field : [$field];
                foreach ($files as $file) {
                    if ($file && is_string($file)) {
                        Storage::disk('public')->delete($file);
                    }
                }
            };

            $deleteFiles($order->proof_of_delivery);
            $deleteFiles($order->proof_of_purchase);
            $deleteFiles($order->proof_of_payment);
            $deleteFiles($order->proof_courier_paid);

            $orderId = $order->id;
            $canteenName = $order->canteen ? $order->canteen->name : "Kantin #{$order->canteen_id}";
            $customerName = $order->user ? $order->user->name : "User #{$order->user_id}";
            $totalAmount = number_format($order->total_price, 0, ',', '.');

            // Force delete items & order
            $order->items()->delete();
            $order->forceDelete();

            ActivityLog::create([
                'user_id' => $request->user()->id,
                'action' => 'force_delete_order',
                'model_type' => Order::class,
                'model_id' => $orderId,
                'description' => "Admin {$request->user()->name} menghapus permanen pesanan #{$orderId} ({$canteenName} - {$customerName} Rp {$totalAmount})",
            ]);

            return response()->json([
                'message' => "Pesanan #{$orderId} berhasil dihapus permanen beserta berkas buktinya.",
            ]);
        });
    }

    /**
     * Empty entire Recycle Bin (Permanently delete all trashed orders)
     */
    public function emptyTrash(Request $request)
    {
        return DB::transaction(function () use ($request) {
            $trashedOrders = Order::onlyTrashed()->with('items')->get();
            $count = $trashedOrders->count();

            if ($count === 0) {
                return response()->json([
                    'message' => "Kotak sampah sudah kosong.",
                ]);
            }

            $deleteFiles = function ($field) {
                if (empty($field)) return;
                $files = is_array($field) ? $field : [$field];
                foreach ($files as $file) {
                    if ($file && is_string($file)) {
                        Storage::disk('public')->delete($file);
                    }
                }
            };

            foreach ($trashedOrders as $order) {
                $deleteFiles($order->proof_of_delivery);
                $deleteFiles($order->proof_of_purchase);
                $deleteFiles($order->proof_of_payment);
                $deleteFiles($order->proof_courier_paid);
                $order->items()->delete();
                $order->forceDelete();
            }

            ActivityLog::create([
                'user_id' => $request->user()->id,
                'action' => 'empty_trash_orders',
                'model_type' => Order::class,
                'model_id' => null,
                'description' => "Admin {$request->user()->name} mengosongkan Kotak Sampah ({$count} pesanan dihapus permanen)",
            ]);

            return response()->json([
                'message' => "Kotak sampah berhasil dikosongkan. {$count} pesanan telah dihapus permanen.",
            ]);
        });
    }
}
