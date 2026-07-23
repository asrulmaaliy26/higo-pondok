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

        Route::get('/my-canteens', [CanteenController::class, 'myCanteens']);
        Route::get('/my-canteens/analytics', [\App\Domains\Canteen\Controllers\CanteenAnalyticsController::class, 'globalStats']);
        Route::post('/my-canteens', [CanteenController::class, 'storeMyCanteen']);
        Route::get('/my-canteen', [CanteenController::class, 'myCanteen']);
        Route::get('/my-canteen/stats', [CanteenController::class, 'dashboardStats']);
        Route::put('/my-canteen', [CanteenController::class, 'updateMyCanteen']);
        Route::put('/my-canteen/status', [CanteenController::class, 'toggleOpenStatus']);
        
        Route::apiResource('my-products', ProductController::class)->except(['show']);
        
        Route::post('/canteen/banners', [\App\Domains\Canteen\Controllers\CanteenBannerController::class, 'store']);
        

        
        Route::get('/canteen/orders', [\App\Domains\Canteen\Controllers\OrderController::class, 'canteenOrders']);
        Route::put('/canteen/orders/{id}/payment', [\App\Domains\Canteen\Controllers\OrderController::class, 'updatePaymentStatus']);
        Route::put('/canteen/orders/{id}/complete', [\App\Domains\Canteen\Controllers\OrderController::class, 'completeByCanteen']);
        Route::post('/canteen/orders/{id}/pay-courier', [\App\Domains\Canteen\Controllers\OrderController::class, 'payCourierByCanteen']);
        Route::put('/canteen/orders/{id}/courier', [\App\Domains\Canteen\Controllers\OrderController::class, 'assignCourier']);
        Route::put('/canteen/orders/{id}/cancel', [\App\Domains\Canteen\Controllers\OrderController::class, 'cancelOrder']);
        
        Route::get('/canteen/santri-list', [\App\Domains\Canteen\Controllers\OrderController::class, 'getSantriList']);
        Route::post('/canteen/orders/manual', [\App\Domains\Canteen\Controllers\OrderController::class, 'createOrderByCanteen']);
        Route::put('/canteen/orders/{id}/custom-price', [\App\Domains\Canteen\Controllers\OrderController::class, 'setCustomOrderPrice']);
        
        Route::get('/couriers', [\App\Domains\Canteen\Controllers\OrderController::class, 'getCouriers']);
    });
    
    // Courier routes
    Route::middleware('role:kurir')->group(function () {
        Route::get('/courier/orders', [\App\Domains\Canteen\Controllers\OrderController::class, 'courierOrders']);
        Route::post('/courier/orders/{id}/complete', [\App\Domains\Canteen\Controllers\OrderController::class, 'completeOrder']);
        Route::post('/courier/orders/{id}/upload-receipt', [\App\Domains\Canteen\Controllers\OrderController::class, 'uploadPurchaseProof']);
    });

    // User routes
    Route::post('/orders', [\App\Domains\Canteen\Controllers\OrderController::class, 'store']);
    Route::get('/orders', [\App\Domains\Canteen\Controllers\OrderController::class, 'userOrders']);
    Route::put('/orders/{id}/cancel', [\App\Domains\Canteen\Controllers\OrderController::class, 'userCancelOrder']);
    Route::post('/orders/{id}/payment-proof', [\App\Domains\Canteen\Controllers\OrderController::class, 'uploadPaymentProof']);
});

Route::get('/banners', [\App\Domains\Canteen\Controllers\CanteenBannerController::class, 'index']);
