<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();

            // Buyer
            $table->foreignId('buyer_id')
                  ->constrained('users')
                  ->onDelete('cascade');

            // Item yang dibeli
            $table->foreignId('market_item_id')
                  ->constrained()
                  ->onDelete('cascade');

            $table->decimal('price', 12, 2);

            $table->enum('status', [
                'pending',
                'paid',
                'completed',
                'cancelled'
            ])->default('pending');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};