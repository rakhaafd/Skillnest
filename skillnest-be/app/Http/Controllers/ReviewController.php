<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Review;
use App\Models\MarketItem;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class ReviewController extends Controller
{
    /**
     * Lihat semua review dari sebuah item (public)
     */
public function index(int $itemId): JsonResponse
{
    $item = MarketItem::withCount('reviews')
        ->withAvg('reviews', 'rating')
        ->findOrFail($itemId);

    $reviews = Review::with('reviewer:id,name')
        ->where('market_item_id', $itemId)
        ->latest()
        ->get();

    return response()->json([
        'message'        => 'Reviews fetched successfully',
        'average_rating' => $item->reviews_avg_rating
            ? round($item->reviews_avg_rating, 1)
            : null,
        'total_reviews'  => $item->reviews_count ?? 0,
        'data'           => $reviews,
    ]);
}

    /**
     * Buat review (hanya buyer yang sudah completed order)
     */
    public function store(Request $request, int $itemId): JsonResponse
    {
        $request->validate([
            'rating'  => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:500',
        ]);

        MarketItem::findOrFail($itemId);

        if (!$this->hasCompletedOrder($itemId)) {
            return $this->errorResponse('You must complete your order before reviewing this item', 403);
        }

        if ($this->alreadyReviewed($itemId)) {
            return $this->errorResponse('You have already reviewed this item', 422);
        }

        $review = Review::create([
            'reviewer_id'    => Auth::id(),
            'market_item_id' => $itemId,
            'rating'         => $request->rating,
            'comment'        => $request->comment,
        ]);

        $review->load('reviewer:id,name');

        return $this->successResponse('Review submitted successfully', $review, 201);
    }

    /**
     * Cek apakah user eligible untuk review item ini
     */
    public function checkEligibility(int $itemId): JsonResponse
    {
        $hasCompletedOrder = $this->hasCompletedOrder($itemId);
        $alreadyReviewed   = $hasCompletedOrder ? $this->alreadyReviewed($itemId) : false;

        return response()->json([
            'hasCompletedOrder' => $hasCompletedOrder,
            'alreadyReviewed'   => $alreadyReviewed,
            'canReview'         => $hasCompletedOrder && !$alreadyReviewed,
        ]);
    }

    // -------------------------
    // Private Helper Methods
    // -------------------------

    private function hasCompletedOrder(int $itemId): bool
    {
        return Order::where('buyer_id', Auth::id())
            ->where('market_item_id', $itemId)
            ->where('status', 'completed')
            ->exists();
    }

    private function alreadyReviewed(int $itemId): bool
    {
        return Review::where('reviewer_id', Auth::id())
            ->where('market_item_id', $itemId)
            ->exists();
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