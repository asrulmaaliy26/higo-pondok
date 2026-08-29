<?php

namespace App\Domains\Canteen\Controllers;

use App\Http\Controllers\Controller;
use App\Domains\Canteen\CanteenBanner;
use App\Domains\Canteen\Canteen;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CanteenBannerController extends Controller
{
    // Publik / User (hanya banner yang aktif)
    public function index()
    {
        $banners = CanteenBanner::with('canteen:id,name')
            ->where('status', 'active')
            ->latest()
            ->get();
            
        return response()->json($banners);
    }

    // Kantin: Upload banner baru
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:100',
            'image' => 'required|image|mimes:jpeg,png,jpg|max:2048'
        ]);

        $canteenId = $request->input('canteen_id') ?? $request->query('canteen_id');
        $canteen = null;
        if ($canteenId) {
            $canteen = $request->user()->canteens()->where('id', $canteenId)->first();
        } else {
            $canteen = $request->user()->canteens()->first();
        }
        
        if (!$canteen) {
            return response()->json(['message' => 'Toko tidak ditemukan'], 404);
        }

        $imagePath = $this->storeOptimizedImage($request->file('image'), $request->user(), 'banners');

        $banner = $canteen->banners()->create([
            'title' => $request->title,
            'image_path' => '/storage/' . $imagePath,
            'status' => 'active'
        ]);

        return response()->json(['message' => 'Banner berhasil ditambahkan', 'banner' => $banner]);
    }

    // Kantin: Toggle status banner
    public function toggleStatus(Request $request, $id)
    {
        $canteenId = $request->input('canteen_id') ?? $request->query('canteen_id');
        $canteen = $canteenId ? $request->user()->canteens()->where('id', $canteenId)->first() : $request->user()->canteens()->first();
        if (!$canteen) return response()->json(['message' => 'Toko tidak ditemukan'], 404);

        $banner = $canteen->banners()->findOrFail($id);
        $banner->update(['status' => $banner->status === 'active' ? 'inactive' : 'active']);
        
        return response()->json(['message' => 'Status banner berhasil diubah', 'banner' => $banner]);
    }

    // Kantin: Hapus banner
    public function destroy(Request $request, $id)
    {
        $canteenId = $request->input('canteen_id') ?? $request->query('canteen_id');
        $canteen = $canteenId ? $request->user()->canteens()->where('id', $canteenId)->first() : $request->user()->canteens()->first();
        if (!$canteen) return response()->json(['message' => 'Toko tidak ditemukan'], 404);

        $banner = $canteen->banners()->findOrFail($id);
        $banner->delete(); // File handling is usually done in Model boot method or deleting event

        return response()->json(['message' => 'Banner berhasil dihapus']);
    }
}
