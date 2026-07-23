<?php

use Illuminate\Support\Facades\Route;
use App\Domains\Auth\Controllers\AuthController;
use App\Domains\Auth\Controllers\RegisterController;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [RegisterController::class, 'registerUser']);
Route::post('/register/canteen', [RegisterController::class, 'registerCanteen']);
Route::post('/register/driver', [RegisterController::class, 'registerDriver']);

use App\Domains\Auth\Controllers\AdminController;

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::put('/me', [AuthController::class, 'updateProfile']);
    Route::put('/me/working-status', [AuthController::class, 'toggleWorkingStatus']);
    
    // Admin routes
    Route::middleware('role:admin')->group(function () {
        Route::get('/admin/users', [\App\Domains\Auth\Controllers\UserController::class, 'index']);
        Route::post('/admin/users', [\App\Domains\Auth\Controllers\UserController::class, 'store']);
        Route::put('/admin/users/{id}', [\App\Domains\Auth\Controllers\UserController::class, 'update']);
        Route::delete('/admin/users/{id}', [\App\Domains\Auth\Controllers\UserController::class, 'destroy']);

        Route::get('/admin/canteens', [AdminController::class, 'allCanteens']);
        Route::get('/admin/stats', [AdminController::class, 'dashboardStats']);
        Route::put('/admin/canteens/{id}/fees', [AdminController::class, 'updateFees']);
        Route::post('/admin/canteens/{id}/pay-debt', [AdminController::class, 'payAdminDebt']);
        Route::post('/admin/canteens/{id}/withdraw', [AdminController::class, 'processWithdrawal']);
        
        Route::get('/admin/canteens/pending', [AdminController::class, 'pendingCanteens']);
        Route::post('/admin/canteens/{id}/approve', [AdminController::class, 'approveCanteen']);
        Route::post('/admin/canteens/{id}/reject', [AdminController::class, 'rejectCanteen']);
        
        Route::get('/admin/drivers/pending', [AdminController::class, 'pendingDrivers']);
        Route::post('/admin/drivers/{id}/approve', [AdminController::class, 'approveDriver']);
        Route::post('/admin/drivers/{id}/reject', [AdminController::class, 'rejectDriver']);

        // Impersonate Route
        Route::post('/admin/impersonate/{id}', [AdminController::class, 'impersonateUser']);

        // Banner Management
        Route::get('/admin/banners/pending', [\App\Domains\Canteen\Controllers\CanteenBannerController::class, 'pending']);
        Route::post('/admin/banners/{id}/approve', [\App\Domains\Canteen\Controllers\CanteenBannerController::class, 'approve']);
        Route::post('/admin/banners/{id}/reject', [\App\Domains\Canteen\Controllers\CanteenBannerController::class, 'reject']);
    });
});
