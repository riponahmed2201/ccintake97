<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('hero_slides', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('college_code', 20)->nullable();
            $table->string('image_path');
            $table->string('object_position', 40)->default('center 50%');
            $table->decimal('overlay_dim', 3, 2)->default(0.35);
            $table->unsignedInteger('display_order')->default(0);
            $table->boolean('is_active')->default(true)->index();
            $table->timestamps();
        });

        Schema::create('timeline_milestones', function (Blueprint $table) {
            $table->id();
            $table->string('year', 20);
            $table->string('title');
            $table->string('tagline');
            $table->text('description');
            $table->boolean('is_highlighted')->default(false);
            $table->unsignedInteger('display_order')->default(0);
            $table->boolean('is_active')->default(true)->index();
            $table->timestamps();
        });

        Schema::create('gallery_items', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('place_label', 60)->nullable();
            $table->string('category', 40)->default('campus_life')->index();
            $table->string('image_path');
            $table->unsignedInteger('display_order')->default(0);
            $table->boolean('is_active')->default(true)->index();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('gallery_items');
        Schema::dropIfExists('timeline_milestones');
        Schema::dropIfExists('hero_slides');
    }
};
