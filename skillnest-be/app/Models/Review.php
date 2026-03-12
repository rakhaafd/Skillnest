<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    protected $fillable = [
        'reviewer_id',
        'market_item_id',
        'rating',
        'comment', // ✅ tambah comment
    ];

    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewer_id');
    }

    public function item()
    {
        return $this->belongsTo(MarketItem::class, 'market_item_id');
    }
}