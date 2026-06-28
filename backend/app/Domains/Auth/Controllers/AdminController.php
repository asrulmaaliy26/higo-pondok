<?php

namespace App\Domains\Auth\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Domains\Canteen\Canteen;
use App\Domains\Delivery\Driver;
use App\Domains\Auth\User;
use App\Domains\Canteen\Order;

class AdminController extends Controller
{
    public function allCanteens()
    {
        // Get all canteens with their user and pending/approved banners
        $canteens = Canteen::with(['user', 'banners' => function($q) {
            $q->orderBy('created_at', 'desc');
        }])->orderBy('created_at', 'desc')->get();
        
        return response()->json($canteens);
    }

    public function updateFees(Request $request, $id)
    {
        $request->validate([
            'delivery_rates' => 'required|array',
            'admin_fee' => 'required|numeric|min:0',
        ]);
        
        $canteen = Canteen::findOrFail($id);
        
        // Fallback for old clients
        $fallback_fee = isset($request->delivery_rates['Lainnya']) ? $request->delivery_rates['Lainnya'] : 0;
        
        $canteen->update([
            'delivery_fee' => $fallback_fee,
            'delivery_rates' => $request->delivery_rates,
            'admin_fee' => $request->admin_fee,
        ]);
        
        return response()->json(['message' => 'Biaya berhasil diperbarui', 'canteen' => $canteen]);
    }

    public function dashboardStats()
    {
        $totalSantri = User::role('user')->count();
        $totalTransactions = Order::where('status', 'completed')->count();
        
        $pendingCanteens = Canteen::where('status', 'pending')->count();
        $pendingDrivers = Driver::where('status', 'pending')->count();
        $pendingApprovals = $pendingCanteens + $pendingDrivers;
        
        // Sum of all paid admin fees (if we have a way to track, else sum of all admin_debt)
        $totalAdminDebt = Canteen::sum('admin_debt');

        // Recent users
        $recentUsers = User::with('roles')->orderBy('created_at', 'desc')->take(3)->get();
        
        $recentActivities = $recentUsers->map(function($u) {
            $roleName = $u->roles->first()?->name ?? 'User';
            return [
                'id' => $u->id,
                'title' => 'Pendaftaran ' . ucfirst($roleName) . ' Baru',
                'description' => $u->name . ' baru saja mendaftar',
                'time' => $u->created_at->diffForHumans(),
            ];
        });

        return response()->json([
            'total_santri' => $totalSantri,
            'total_transactions' => $totalTransactions,
            'pending_approvals' => $pendingApprovals,
            'total_admin_debt' => $totalAdminDebt,
            'recent_activities' => $recentActivities
        ]);
    }

    public function pendingCanteens()
    {
        return response()->json(Canteen::with('user')->where('status', 'pending')->get());
    }

    public function approveCanteen($id)
    {
        $canteen = Canteen::findOrFail($id);
        $canteen->update(['status' => 'approved']);
        return response()->json(['message' => 'Kantin disetujui', 'canteen' => $canteen]);
    }

    public function rejectCanteen($id)
    {
        $canteen = Canteen::findOrFail($id);
        $canteen->update(['status' => 'rejected']);
        return response()->json(['message' => 'Kantin ditolak', 'canteen' => $canteen]);
    }

    public function pendingDrivers()
    {
        return response()->json(Driver::with('user')->where('status', 'pending')->get());
    }

    public function approveDriver($id)
    {
        $driver = Driver::findOrFail($id);
        $driver->update(['status' => 'approved']);
        return response()->json(['message' => 'Kurir disetujui', 'driver' => $driver]);
    }

    public function rejectDriver($id)
    {
        $driver = Driver::findOrFail($id);
        $driver->update(['status' => 'rejected']);
        return response()->json(['message' => 'Kurir ditolak', 'driver' => $driver]);
    }

    public function impersonateUser(Request $request, $id)
    {
        // 1. Pastikan yang meminta ini adalah ADMIN sejati
        if (!$request->user()->hasRole('admin')) {
            return response()->json(['message' => 'Unauthorized. Hanya Admin yang dapat menyamar.'], 403);
        }

        // 2. Cegah admin menyamar menjadi admin lain untuk keamanan
        $targetUser = User::findOrFail($id);
        if ($targetUser->hasRole('admin')) {
            return response()->json(['message' => 'Tidak dapat menyamar sebagai sesama Admin.'], 403);
        }

        // 3. Buatkan token Sanctum baru khusus untuk penyamaran ini
        // Kita beri nama token 'impersonation_token'
        $token = $targetUser->createToken('impersonation_token')->plainTextToken;

        return response()->json([
            'message' => 'Berhasil beralih akun.',
            'user' => $targetUser,
            'token' => $token
        ]);
    }

    public function payAdminDebt(Request $request, $id)
    {
        $canteen = \App\Domains\Canteen\Canteen::findOrFail($id);
        
        $amount = $canteen->admin_debt;
        
        $canteen->update([
            'admin_debt' => 0
        ]);

        return response()->json([
            'message' => 'Pembayaran tagihan admin sebesar Rp ' . number_format($amount, 0, ',', '.') . ' telah diterima.',
            'canteen' => $canteen
        ]);
    }
}
