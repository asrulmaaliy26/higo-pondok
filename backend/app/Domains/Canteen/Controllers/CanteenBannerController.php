<?php

namespace App\Domains\Canteen\Controllers;

use App\Http\Controllers\Controller;
use App\Domains\Canteen\CanteenBanner;
use App\Domains\Canteen\Canteen;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CanteenBannerController extends Controller
{
    // Publik / User (hanya banner yang disetujui)
    public function index()
    {
        $banners = CanteenBanner::with('canteen:id,name')
            ->where('status', 'approved')
            ->latest()
            ->get();
            
        return response()->json($banners);
    }

    // Admin: Lihat semua pending
    public function pending()
    {
        $banners = CanteenBanner::with('canteen:id,name')
            ->where('status', 'pending')
            ->latest()
            ->get();
            
        return response()->json($banners);
    }

    // Admin: Approve
    public function approve($id)
    {
        $banner = CanteenBanner::findOrFail($id);
        $banner->update(['status' => 'approved']);
        return response()->json(['message' => 'Banner disetujui']);
    }

    // Admin: Reject
    public function reject($id)
    {
        $banner = CanteenBanner::findOrFail($id);
        $banner->update(['status' => 'rejected']);
        return response()->json(['message' => 'Banner ditolak']);
    }

    // Kantin: Upload banner baru
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:100',
            'image' => 'required|image|mimes:jpeg,png,jpg|max:2048'
        ]);

        $canteen = $request->user()->canteen()->first();
        
        if (!$canteen) {
            return response()->json(['message' => 'Toko tidak ditemukan'], 404);
        }

        // Cek jika kantin sudah punya banner (maks 1 per kantin, hapus yang lama jika ada)
        // Sesuai permintaan user: "setiap toko 1 lalu admin menyetujui itu"
        $existingBanner = $canteen->banners()->first();
        if ($existingBanner) {
            // Kita bisa menimpa yang lama
            if (Storage::disk('public')->exists(str_replace('/storage/', '', $existingBanner->image_path))) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $existingBanner->image_path));
            }
            $existingBanner->delete();
        }

        $imagePath = $request->file('image')->store($this->getUserUploadPath($request->user(), 'banners'), 'public');

        $banner = $canteen->banners()->create([
            'title' => $request->title,
            'image_path' => '/storage/' . $imagePath,
            'status' => 'pending' // kembali ke pending jika diupdate
        ]);

        return response()->json(['message' => 'Banner berhasil diunggah dan menunggu persetujuan admin', 'banner' => $banner]);
    }
}
