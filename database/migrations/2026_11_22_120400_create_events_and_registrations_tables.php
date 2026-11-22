<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained('event_categories')->restrictOnDelete();
            $table->string('title');
            $table->string('slug')->unique();
            $table->longText('description')->nullable();
            $table->string('venue');
            $table->text('address')->nullable();
            $table->text('google_maps_link')->nullable();
            $table->string('cover_image_path')->nullable();
            $table->date('starts_on');
            $table->date('ends_on')->nullable();
            $table->time('start_time')->nullable();
            $table->time('end_time')->nullable();
            $table->integer('capacity')->nullable();
            $table->boolean('allows_guests')->default(false);
            $table->unsignedTinyInteger('max_guests_per_registration')->default(0);
            $table->timestamp('registration_closes_at')->nullable();
            $table->decimal('registration_fee', 10, 2)->default(0);
            $table->string('visibility', 30)->default('members'); // public, members, verified_members
            $table->string('status', 30)->default('draft')->index(); // draft, published, cancelled, completed
            $table->timestamp('published_at')->nullable();
            $table->foreignId('created_by')->constrained('users')->cascadeOnDelete();
            $table->softDeletes();
            $table->timestamps();
        });

        Schema::create('event_registrations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('event_id')->constrained('events')->cascadeOnDelete();
            $table->foreignId('member_id')->constrained('members')->cascadeOnDelete();
            $table->string('status', 30)->default('confirmed')->index(); // registered, pending_approval, confirmed, waitlisted, cancelled, attended, no_show
            $table->unsignedTinyInteger('guest_count')->default(0);
            $table->text('special_requirements')->nullable();
            $table->string('qr_token', 64)->unique();
            $table->timestamp('checked_in_at')->nullable();
            $table->foreignId('checked_in_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });

        Schema::create('event_guests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('registration_id')->constrained('event_registrations')->cascadeOnDelete();
            $table->string('name');
            $table->string('relationship', 50)->default('guest');
            $table->string('age_group', 30)->default('adult');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('event_guests');
        Schema::dropIfExists('event_registrations');
        Schema::dropIfExists('events');
    }
};
