<?php

use App\Http\Controllers\AdminController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\MarketItemController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\ContactSellerController;
use App\Http\Controllers\UserController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/login-admin', [AuthController::class, 'loginAdmin']);

    Route::get('/users', [UserController::class, 'index']);
    
    Route::get('/users/{id}', [UserController::class, 'show']);

Route::prefix('items')->group(function () {
    Route::get('/', [MarketItemController::class, 'index']);
    Route::get('/{id}', [MarketItemController::class, 'show']);
    Route::get('/{itemId}/reviews', [ReviewController::class, 'index']);
});

Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {

    // Dashboard
    Route::get('/dashboard', [AdminController::class, 'dashboard']);

    // User Management
    Route::get('/users', [AdminController::class, 'getUsers']);
    Route::delete('/users/{id}', [AdminController::class, 'deleteUser']);

    // Item Management
    Route::get('/items', [AdminController::class, 'getItems']);
    Route::put('/items/{id}', [MarketItemController::class, 'update']);
    Route::delete('/items/{id}', [AdminController::class, 'deleteItem']);

    // Order Management
    Route::get('/orders', [AdminController::class, 'getOrders']);

    // Review Management
    Route::get('/reviews', [AdminController::class, 'getReviews']);
    Route::delete('/reviews/{id}', [AdminController::class, 'deleteReview']);
});

Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);

    // Market Items
    Route::prefix('items')->group(function () {
        Route::post('/', [MarketItemController::class, 'store']);
        Route::put('/{id}', [MarketItemController::class, 'update']);
        Route::delete('/{id}', [MarketItemController::class, 'destroy']);
    });

    Route::post('/profile/avatar', [UserController::class, 'updateAvatar']);

    Route::prefix("profile")->group(function() {
        Route::get("/me", [UserController::class, 'me']);
        Route::put('/new-name', [UserController::class, 'updateName']);
        Route::put('/new-password', [UserController::class, 'updatePassword']);
    });


Route::prefix('orders')->group(function () {

    //pesanan kita
    Route::get('/my', [OrderController::class, 'myOrders']);

    //history pesanan kita (yang sudah completed)
    Route::get('/history', [OrderController::class, 'orderHistory']);

    //pesanan yang masuk ke kita
    Route::get('/seller', [OrderController::class, 'sellerOrders']);

    //cek item, apakah sudah selesai pesanannya
    Route::get('/check-item/{itemId}', [ReviewController::class, 'checkEligibility']);

    //beli pesanan
    Route::post('/{itemId}', [OrderController::class, 'store']);

    // update status (khusus seller)
    Route::put('/{orderId}/status', [OrderController::class, 'updateStatus']);
});

    Route::post('/reviews/{itemId}', [ReviewController::class, 'store']);

    Route::post('/contact-seller', [ContactSellerController::class, 'send']);
});
