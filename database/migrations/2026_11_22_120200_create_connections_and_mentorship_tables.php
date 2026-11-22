<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('member_connections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('requester_id')->constrained('members')->cascadeOnDelete();
            $table->foreignId('addressee_id')->constrained('members')->cascadeOnDelete();
            $table->string('status', 30)->default('pending')->index(); // pending, accepted, rejected
            $table->timestamps();

            $table->unique(['requester_id', 'addressee_id']);
        });

        Schema::create('member_favorites', function (Blueprint $table) {
            $table->id();
            $table->foreignId('member_id')->constrained('members')->cascadeOnDelete();
            $table->string('favoritable_type');
            $table->unsignedBigInteger('favoritable_id');
            $table->timestamps();

            $table->index(['member_id', 'favoritable_type', 'favoritable_id']);
        });

        Schema::create('mentorship_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('member_id')->unique()->constrained('members')->cascadeOnDelete();
            $table->boolean('is_available')->default(false)->index();
            $table->text('expertise_areas')->nullable();
            $table->text('preferred_topics')->nullable();
            $table->unsignedTinyInteger('max_mentees')->default(2);
            $table->timestamp('consent_given_at')->nullable();
            $table->timestamps();
        });

        Schema::create('mentorship_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mentor_id')->constrained('members')->cascadeOnDelete();
            $table->foreignId('mentee_id')->constrained('members')->cascadeOnDelete();
            $table->text('goals');
            $table->string('status', 30)->default('pending')->index(); // pending, accepted, declined, completed
            $table->text('response_note')->nullable();
            $table->timestamps();
        });

        Schema::create('activity_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('member_id')->nullable()->constrained('members')->nullOnDelete();
            $table->string('activity');
            $table->string('subject_type')->nullable();
            $table->unsignedBigInteger('subject_id')->nullable();
            $table->json('details')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('activity_logs');
        Schema::dropIfExists('mentorship_requests');
        Schema::dropIfExists('mentorship_profiles');
        Schema::dropIfExists('member_favorites');
        Schema::dropIfExists('member_connections');
    }
};
