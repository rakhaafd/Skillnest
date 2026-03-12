<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Order;
use App\Models\Review;
use App\Models\MarketItem;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

class AdminController extends Controller
{
    // -------------------------
    // Dashboard
    // -------------------------

    public function dashboard(): JsonResponse
    {
        $totalUsers  = User::where('role', 'user')->count();
        $totalItems  = MarketItem::count();
        $totalOrders = Order::count();

        $orderSummary = [
            'pending'   => Order::where('status', 'pending')->count(),
            'paid'      => Order::where('status', 'paid')->count(),
            'completed' => Order::where('status', 'completed')->count(),
            'cancelled' => Order::where('status', 'cancelled')->count(),
        ];

        $topItems = MarketItem::withCount(['orders' => function ($query) {
                $query->where('status', 'completed');
            }])
            ->orderByDesc('orders_count')
            ->limit(5)
            ->get(['id', 'name', 'price', 'category']);

        return response()->json([
            'message' => 'Dashboard fetched successfully',
            'data'    => [
                'total_users'   => $totalUsers,
                'total_items'   => $totalItems,
                'total_orders'  => $totalOrders,
                'order_summary' => $orderSummary,
                'top_items'     => $topItems,
            ],
        ]);
    }

    // -------------------------
    // User Management
    // -------------------------

    public function getUsers(): JsonResponse
    {
        $users = User::withCount('marketItems')
            ->latest()
            ->get();

        return response()->json([
            'message' => 'Users fetched successfully',
            'data'    => $users,
        ]);
    }

    public function deleteUser(int $id): JsonResponse
    {
        $user = User::findOrFail($id);

        if ($user->isAdmin()) {
            return response()->json(['message' => 'Cannot delete admin user'], 403);
        }

        $user->delete();

        return response()->json(['message' => 'User deleted successfully']);
    }

    // -------------------------
    // Item Management
    // -------------------------

    public function getItems(): JsonResponse
    {
        $items = MarketItem::with('user')
            ->withCount('orders', 'reviews')
            ->withAvg('reviews', 'rating')
            ->latest()
            ->get();

        return response()->json([
            'message' => 'Items fetched successfully',
            'data'    => $items,
        ]);
    }

    public function deleteItem(int $id): JsonResponse
    {
        $item = MarketItem::findOrFail($id);

        if ($item->thumbnail) {
            Storage::disk('public')->delete($item->thumbnail);
        }

        $item->delete();

        return response()->json(['message' => 'Item deleted successfully']);
    }

    // -------------------------
    // Order Management
    // -------------------------

    public function getOrders(): JsonResponse
    {
        $orders = Order::with('buyer:id,name,email', 'item.user:id,name')
            ->latest()
            ->get();

        $summary = [
            'total'     => $orders->count(),
            'pending'   => $orders->where('status', 'pending')->count(),
            'paid'      => $orders->where('status', 'paid')->count(),
            'completed' => $orders->where('status', 'completed')->count(),
            'cancelled' => $orders->where('status', 'cancelled')->count(),
        ];

        return response()->json([
            'message' => 'Orders fetched successfully',
            'data'    => $orders,
            'summary' => $summary,
        ]);
    }

    // -------------------------
    // Review Management
    // -------------------------

    public function getReviews(): JsonResponse
    {
        $reviews = Review::with(
                'reviewer:id,name',
                'item:id,name'
            )
            ->latest()
            ->get();

        return response()->json([
            'message' => 'Reviews fetched successfully',
            'data'    => $reviews,
        ]);
    }

    public function deleteReview(int $id): JsonResponse
    {
        $review = Review::findOrFail($id);
        $review->delete();

        return response()->json(['message' => 'Review deleted successfully']);
    }
}