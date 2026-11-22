<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('businesses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('owner_member_id')->constrained('members')->cascadeOnDelete();
            $table->foreignId('category_id')->constrained('business_categories')->restrictOnDelete();
            $table->foreignId('industry_id')->constrained('industries')->restrictOnDelete();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('logo_path')->nullable();
            $table->text('description')->nullable();
            $table->json('services')->nullable();
            $table->string('website')->nullable();
            $table->string('email')->nullable();
            $table->string('phone', 30)->nullable();
            $table->string('city')->nullable();
            $table->string('country_code', 5)->default('BD');
            $table->boolean('is_featured')->default(false)->index();
            $table->string('status', 30)->default('pending')->index(); // pending, approved, rejected, suspended
            $table->timestamp('verified_at')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });

        Schema::create('initiatives', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('category', 30)->default('welfare')->index(); // scholarship, welfare, medical, emergency, mentorship
            $table->longText('description')->nullable();
            $table->foreignId('coordinator_member_id')->nullable()->constrained('members')->nullOnDelete();
            $table->decimal('budget', 12, 2)->nullable();
            $table->decimal('target_amount', 12, 2)->nullable();
            $table->decimal('raised_amount', 12, 2)->default(0);
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->string('status', 30)->default('active')->index(); // draft, active, completed, archived
            $table->json('documents')->nullable();
            $table->timestamps();
        });

        Schema::create('initiative_participants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('initiative_id')->constrained('initiatives')->cascadeOnDelete();
            $table->foreignId('member_id')->constrained('members')->cascadeOnDelete();
            $table->string('role', 30)->default('volunteer'); // volunteer, contributor, beneficiary
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('documents', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('category', 50)->default('governance')->index(); // constitution, governance, membership_guidelines, annual_reports, meeting_minutes, official_notices, financial_reports, other
            $table->string('file_path');
            $table->unsignedBigInteger('file_size')->default(0);
            $table->string('visibility', 30)->default('members'); // public, members, verified_members, committee_only
            $table->boolean('is_published')->default(true)->index();
            $table->string('version', 20)->default('1.0');
            $table->foreignId('uploaded_by')->constrained('users')->cascadeOnDelete();
            $table->timestamps();
        });

        Schema::create('support_tickets', function (Blueprint $table) {
            $table->id();
            $table->string('ticket_no', 30)->unique();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('category', 30)->default('general')->index(); // general, membership, event, business, technical, other
            $table->string('subject');
            $table->string('status', 30)->default('open')->index(); // open, in_progress, waiting_member, resolved, closed
            $table->string('priority', 20)->default('medium'); // low, medium, high, urgent
            $table->foreignId('assigned_to')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });

        Schema::create('support_ticket_messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ticket_id')->constrained('support_tickets')->cascadeOnDelete();
            $table->foreignId('sender_id')->constrained('users')->cascadeOnDelete();
            $table->text('message');
            $table->json('attachments')->nullable();
            $table->boolean('is_internal_note')->default(false);
            $table->timestamps();
        });

        Schema::create('system_settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->longText('value')->nullable();
            $table->string('group', 30)->default('general')->index(); // general, homepage, seo, system
            $table->timestamps();
        });

        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('action', 100)->index();
            $table->string('module', 50)->index();
            $table->unsignedBigInteger('record_id')->nullable();
            $table->json('previous_state')->nullable();
            $table->json('new_state')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->timestamp('created_at')->useCurrent()->index();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
        Schema::dropIfExists('system_settings');
        Schema::dropIfExists('support_ticket_messages');
        Schema::dropIfExists('support_tickets');
        Schema::dropIfExists('documents');
        Schema::dropIfExists('initiative_participants');
        Schema::dropIfExists('initiatives');
        Schema::dropIfExists('businesses');
    }
};
