<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();

            $table->foreignId('reviewer_id')
                ->constrained('users')
                ->onDelete('cascade');

            $table->foreignId('market_item_id')
                ->constrained()
                ->onDelete('cascade');

            $table->unsignedTinyInteger('rating'); // 1-5
            $table->text('comment')->nullable();   // ✅ tambah comment

            $table->timestamps();

            $table->unique(['reviewer_id', 'market_item_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};