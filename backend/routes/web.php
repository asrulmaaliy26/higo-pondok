<?php

use Illuminate\Support\Facades\Route;

// Tangkap semua route selain /api dan arahkan ke frontend React
Route::get('/{any}', function () {
    if (view()->exists('react_app')) {
        return view('react_app');
    }
    return "Tolong jalankan deployment agar file react_app.blade.php ter-generate.";
})->where('any', '.*');
