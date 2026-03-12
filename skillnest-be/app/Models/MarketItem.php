<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MarketItem extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'category',
        'price',
        'description',
        'thumbnail',
        'skill_level',
        'what_you_get',
    ];

    protected $appends = ['thumbnail_url', 'average_rating', 'total_reviews'];

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relasi ke orders
    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    // Buyers melalui orders (hasManyThrough)
    public function buyers()
    {
        return $this->hasManyThrough(
            User::class,    // target model
            Order::class,   // pivot model
            'market_item_id', // FK di orders
            'id',             // FK di users
            'id',             // LK di market_items
            'buyer_id'        // LK di orders
        );
    }

    public function getThumbnailUrlAttribute()
    {
        if ($this->thumbnail) {
            return asset('storage/' . $this->thumbnail);
        }
        return null;
    }

public function getAverageRatingAttribute()
{
    if (array_key_exists('reviews_avg_rating', $this->attributes)) {
        $avg = $this->attributes['reviews_avg_rating'];
        return $avg ? round($avg, 1) : null;
    }
    $avg = $this->reviews()->avg('rating');
    return $avg ? round($avg, 1) : null;
}

public function getTotalReviewsAttribute()
{
    if (array_key_exists('reviews_count', $this->attributes)) {
        return $this->attributes['reviews_count'] ?? 0;
    }
    return $this->reviews()->count();
}
}
