<?php

namespace App\Http\Controllers;

use App\Models\MarketItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class MarketItemController extends Controller
{
    public function index()
    {
        $items = MarketItem::with('user')
            ->withCount('reviews')
            ->withAvg('reviews', 'rating')
            ->latest()
            ->get()
            ->map(function ($item) {
                $item->average_rating = $item->reviews_avg_rating
                    ? round($item->reviews_avg_rating, 1)
                    : null;
                $item->total_reviews = $item->reviews_count ?? 0;
                return $item;
            });

        return response()->json($items);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'        => 'required|string|max:255',
            'category'    => 'required|in:Programming & Tech,Design & Creative,Writing,Digital Marketing,Handmade,Education',
            'price'       => 'required|numeric|min:0',
            'description' => 'required|string',
            'skill_level' => 'required|in:Beginner,Intermediate,Expert',
            'what_you_get' => 'required|string',
            'thumbnail'   => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $data = $request->except('thumbnail');
        $data['user_id'] = Auth::id();

        if ($request->hasFile('thumbnail')) {
            $path = $request->file('thumbnail')->store('market-items/thumbnails', 'public');
            $data['thumbnail'] = $path;
        }

        $marketItem = MarketItem::create($data);
        $marketItem->load('user');

        return response()->json([
            'message' => 'Market item created successfully',
            'data'    => $marketItem,
        ], 201);
    }

    public function show($id): JsonResponse
    {
        $item = MarketItem::with([
            'user',
            'reviews.reviewer:id,name',
            'orders.buyer:id,name,email', // ✅ load buyers via orders
        ])->findOrFail($id);

        return response()->json($item);
    }

    public function update(Request $request, $id)
    {
        $item = MarketItem::findOrFail($id);

        $user = Auth::user();
        if ($item->user_id !== $user->id && $user->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'name'        => 'sometimes|required|string|max:255',
            'category'    => 'sometimes|required|in:Programming & Tech,Design & Creative,Writing,Digital Marketing,Handmade,Education',
            'price'       => 'sometimes|required|numeric|min:0',
            'description' => 'sometimes|required|string',
            'skill_level' => 'sometimes|required|in:Beginner,Intermediate,Expert',
            'what_you_get' => 'sometimes|required|string',
            'thumbnail'   => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $data = $request->except('thumbnail');

        if ($request->hasFile('thumbnail')) {
            if ($item->thumbnail) {
                Storage::disk('public')->delete($item->thumbnail);
            }
            $path = $request->file('thumbnail')->store('market-items/thumbnails', 'public');
            $data['thumbnail'] = $path;
        }

        $item->update($data);
        $item->load(['user', 'reviews']);

        return response()->json([
            'message' => 'Market item updated successfully',
            'data'    => $item,
        ]);
    }

    public function destroy($id)
    {
        $item = MarketItem::findOrFail($id);

        if ($item->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($item->thumbnail) {
            Storage::disk('public')->delete($item->thumbnail);
        }

        $item->delete();

        return response()->json(['message' => 'Market item deleted successfully']);
    }
}
