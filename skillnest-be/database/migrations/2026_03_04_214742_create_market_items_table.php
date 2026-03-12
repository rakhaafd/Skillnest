<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('market_items', function (Blueprint $table) {
            $table->id();

            // Relasi ke user
            $table->foreignId('user_id')->constrained()->onDelete('cascade');

            // Basic Info
            $table->string('name');

            $table->enum('category', [
                'Programming & Tech',
                'Design & Creative',
                'Writing',
                'Digital Marketing',
                'Handmade',
                'Education'
            ]);

            // Price Range
            $table->decimal('price', 12, 2);

            $table->text('description');

            $table->string('thumbnail')->nullable();

            $table->enum('skill_level', [
                'Beginner',
                'Intermediate',
                'Expert'
            ]);

            $table->text('what_you_get');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('market_items');
    }
};
