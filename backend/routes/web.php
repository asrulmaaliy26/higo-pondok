<?php

use Illuminate\Support\Facades\Route;

// Tangkap semua route selain /api dan arahkan ke frontend React
Route::get('/{any}', function () {
    $path = public_path('spa/index.html');
    if (file_exists($path)) {
        return file_get_contents($path);
    }
    return "Tolong jalankan 'npm run build' di folder frontend terlebih dahulu.";
})->where('any', '.*');
