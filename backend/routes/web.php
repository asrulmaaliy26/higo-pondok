<?php

use Illuminate\Support\Facades\Route;

// Serve public storage files directly (fallback if symlink is missing on hosting server)
Route::get('/storage/{path}', function ($path) {
    $filePath = storage_path('app/public/' . $path);
    if (!file_exists($filePath)) {
        abort(404, 'File not found');
    }
    return response()->file($filePath, [
        'Cache-Control' => 'public, max-age=86400',
    ]);
})->where('path', '.*');

// Tangkap semua route selain /api dan /storage, arahkan ke frontend React
Route::get('/{any}', function () {
    if (view()->exists('react_app')) {
        return view('react_app');
    }
    return "Tolong jalankan deployment agar file react_app.blade.php ter-generate.";
})->where('any', '.*');

