<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\MarketItem;
use App\Mail\OrderStatusMail;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class OrderController extends Controller
{
    private const STATUS_TRANSITIONS = [
        'pending' => ['paid', 'cancelled'],
        'paid'    => ['completed', 'cancelled'],
    ];

    public function store(int $itemId): JsonResponse
    {
        $item = MarketItem::findOrFail($itemId);

        if ($item->user_id === Auth::id()) {
            return $this->errorResponse('You cannot buy your own item', 403);
        }

        if ($this->hasExistingOrder($itemId)) {
            return $this->errorResponse('You have already purchased this item', 409);
        }

        $order = Order::create([
            'buyer_id'       => Auth::id(),
            'market_item_id' => $item->id,
            'price'          => $item->price,
            'status'         => 'pending',
        ]);

        return $this->successResponse(
            'Order placed successfully, waiting for seller confirmation',
            $order->load('item.user'),
            201
        );
    }

    public function updateStatus(Request $request, int $orderId): JsonResponse
    {
        $request->validate([
            'status' => 'required|in:paid,completed,cancelled',
        ]);

        // Load buyer & item sekaligus untuk kebutuhan email
        $order = Order::with('buyer', 'item')->findOrFail($orderId);

        if ($order->item->user_id !== Auth::id()) {
            return $this->errorResponse('Unauthorized', 403);
        }

        if (!$this->isTransitionAllowed($order->status, $request->status)) {
            return $this->errorResponse(
                "Cannot change status from '{$order->status}' to '{$request->status}'",
                422
            );
        }

        $order->update(['status' => $request->status]);

        // ✅ Kirim email notifikasi ke buyer
        Mail::to($order->buyer->email)->send(new OrderStatusMail($order));

        return $this->successResponse('Order status updated', $order);
    }

    public function myOrders(): JsonResponse
    {
        $orders = Order::where('buyer_id', Auth::id())
            ->with('item.user')
            ->latest()
            ->get();

        return response()->json($orders);
    }

    public function sellerOrders(): JsonResponse
    {
        $orders = Order::whereHas('item', fn($q) => $q->where('user_id', Auth::id()))
            ->with('buyer', 'item')
            ->latest()
            ->get();

        return response()->json($orders);
    }

    public function orderHistory(): JsonResponse
    {
        $orders = Order::where('buyer_id', Auth::id())
            ->where('status', 'completed')
            ->with('item.user')
            ->latest()
            ->get();

        return response()->json($orders);
    }

    // -------------------------
    // Private Helper Methods
    // -------------------------

    private function hasExistingOrder(int $itemId): bool
    {
        return Order::where('buyer_id', Auth::id())
            ->where('market_item_id', $itemId)
            ->whereIn('status', ['pending', 'paid', 'completed'])
            ->exists();
    }

    private function isTransitionAllowed(string $currentStatus, string $newStatus): bool
    {
        $allowed = self::STATUS_TRANSITIONS[$currentStatus] ?? [];

        return in_array($newStatus, $allowed);
    }

    private function successResponse(string $message, mixed $data, int $status = 200): JsonResponse
    {
        return response()->json([
            'message' => $message,
            'data'    => $data,
        ], $status);
    }

    private function errorResponse(string $message, int $status): JsonResponse
    {
        return response()->json([
            'message' => $message,
        ], $status);
    }
}