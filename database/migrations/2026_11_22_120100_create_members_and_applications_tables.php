<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('members', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained('users')->cascadeOnDelete();
            $table->string('member_code', 30)->unique()->nullable();
            $table->foreignId('college_id')->constrained('colleges')->restrictOnDelete();
            $table->string('college_roll_no', 50)->nullable();
            $table->unsignedSmallInteger('intake_year')->default(1997);
            $table->string('membership_status', 30)->default('pending')->index(); // pending, under_review, approved, rejected, suspended, archived
            $table->string('verification_status', 30)->default('unverified')->index(); // unverified, pending, verified, rejected
            $table->timestamp('approved_at')->nullable();
            $table->timestamp('verified_at')->nullable();
            $table->timestamp('suspended_at')->nullable();
            $table->text('suspension_reason')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });

        Schema::create('member_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('member_id')->unique()->constrained('members')->cascadeOnDelete();
            $table->string('city')->nullable();
            $table->string('country_code', 5)->default('BD');
            $table->text('address')->nullable();
            $table->string('gender', 20)->nullable();
            $table->date('date_of_birth')->nullable();
            $table->string('designation')->nullable();
            $table->string('organization')->nullable();
            $table->foreignId('industry_id')->nullable()->constrained('industries')->nullOnDelete();
            $table->text('professional_bio')->nullable();
            $table->json('skills')->nullable();
            $table->json('education')->nullable();
            $table->json('employment_history')->nullable();
            $table->string('linkedin_url')->nullable();
            $table->string('website_url')->nullable();
            $table->boolean('owns_business')->default(false);
            $table->unsignedTinyInteger('profile_completion')->default(0);
            $table->timestamps();
        });

        Schema::create('member_privacy_settings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('member_id')->constrained('members')->cascadeOnDelete();
            $table->string('field_key', 50);
            $table->string('visibility', 30)->default('verified_members'); // public, verified_members, connections, private
            $table->timestamps();

            $table->unique(['member_id', 'field_key']);
        });

        Schema::create('membership_applications', function (Blueprint $table) {
            $table->id();
            $table->string('application_no', 30)->unique();
            $table->foreignId('member_id')->constrained('members')->cascadeOnDelete();
            $table->foreignId('declared_college_id')->constrained('colleges')->restrictOnDelete();
            $table->string('declared_roll_no', 50);
            $table->string('reference_name')->nullable();
            $table->string('reference_phone', 30)->nullable();
            $table->json('proof_documents')->nullable();
            $table->string('status', 30)->default('submitted')->index(); // submitted, under_review, info_required, approved, rejected
            $table->timestamp('submitted_at')->useCurrent();
            $table->timestamp('decided_at')->nullable();
            $table->text('decision_note')->nullable();
            $table->timestamps();
        });

        Schema::create('application_reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('application_id')->constrained('membership_applications')->cascadeOnDelete();
            $table->foreignId('actor_id')->constrained('users')->cascadeOnDelete();
            $table->string('action', 50);
            $table->string('from_status', 30)->nullable();
            $table->string('to_status', 30)->nullable();
            $table->text('note')->nullable();
            $table->boolean('is_internal')->default(true);
            $table->timestamps();
        });

        Schema::create('membership_verifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('member_id')->constrained('members')->cascadeOnDelete();
            $table->string('method', 50); // committee_manual, college_record, alumni_reference, document_proof
            $table->string('result', 30)->default('passed'); // passed, failed
            $table->text('evidence_note')->nullable();
            $table->foreignId('verified_by')->constrained('users')->cascadeOnDelete();
            $table->timestamp('verified_at')->useCurrent();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('membership_verifications');
        Schema::dropIfExists('application_reviews');
        Schema::dropIfExists('membership_applications');
        Schema::dropIfExists('member_privacy_settings');
        Schema::dropIfExists('member_profiles');
        Schema::dropIfExists('members');
    }
};
