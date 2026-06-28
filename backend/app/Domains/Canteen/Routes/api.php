<?php

use Illuminate\Support\Facades\Route;
use App\Domains\Canteen\Controllers\CanteenController;
use App\Domains\Canteen\Controllers\ProductController;

// Public routes (for Santri to see canteens and their products)
Route::get('/canteens', [CanteenController::class, 'index']);
Route::get('/canteens/{id}', [CanteenController::class, 'show']);

Route::middleware(['auth:sanctum', 'impersonate'])->group(function () {
    // Routes for kantin role
    Route::middleware('role:kantin')->group(function () {

        Route::get('/my-canteen', [CanteenController::class, 'myCanteen']);
        Route::get('/my-canteen/stats', [CanteenController::class, 'dashboardStats']);
        Route::put('/my-canteen', [CanteenController::class, 'updateMyCanteen']);
        Route::put('/my-canteen/status', [CanteenController::class, 'toggleOpenStatus']);
        
        Route::apiResource('my-products', ProductController::class)->except(['show']);
        
        Route::post('/canteen/banners', [\App\Domains\Canteen\Controllers\CanteenBannerController::class, 'store']);
        
        Route::get('/canteen/vouchers', [\App\Domains\Canteen\Controllers\VoucherController::class, 'canteenVouchers']);
        Route::post('/canteen/vouchers', [\App\Domains\Canteen\Controllers\VoucherController::class, 'store']);
        Route::put('/canteen/vouchers/{id}', [\App\Domains\Canteen\Controllers\VoucherController::class, 'update']);
        Route::delete('/canteen/vouchers/{id}', [\App\Domains\Canteen\Controllers\VoucherController::class, 'destroy']);
        
        Route::get('/canteen/orders', [\App\Domains\Canteen\Controllers\OrderController::class, 'canteenOrders']);
        Route::put('/canteen/orders/{id}/payment', [\App\Domains\Canteen\Controllers\OrderController::class, 'updatePaymentStatus']);
        Route::put('/canteen/orders/{id}/complete', [\App\Domains\Canteen\Controllers\OrderController::class, 'completeByCanteen']);
        Route::put('/canteen/orders/{id}/courier', [\App\Domains\Canteen\Controllers\OrderController::class, 'assignCourier']);
        Route::put('/canteen/orders/{id}/cancel', [\App\Domains\Canteen\Controllers\OrderController::class, 'cancelOrder']);
        
        Route::get('/couriers', [\App\Domains\Canteen\Controllers\OrderController::class, 'getCouriers']);
    });
    
    // Courier routes
    Route::middleware('role:kurir')->group(function () {
        Route::get('/courier/orders', [\App\Domains\Canteen\Controllers\OrderController::class, 'courierOrders']);
        Route::post('/courier/orders/{id}/complete', [\App\Domains\Canteen\Controllers\OrderController::class, 'completeOrder']);
    });

    // User routes
    Route::post('/orders', [\App\Domains\Canteen\Controllers\OrderController::class, 'store']);
    Route::get('/orders', [\App\Domains\Canteen\Controllers\OrderController::class, 'userOrders']);
    Route::put('/orders/{id}/cancel', [\App\Domains\Canteen\Controllers\OrderController::class, 'userCancelOrder']);
});

Route::get('/banners', [\App\Domains\Canteen\Controllers\CanteenBannerController::class, 'index']);
Route::get('/vouchers', [\App\Domains\Canteen\Controllers\VoucherController::class, 'index']);
