<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('members', function (Blueprint $table) {
            $table->string('house_name', 100)->nullable()->after('intake_year');
            $table->string('house_color', 30)->nullable()->after('house_name');
        });

        Schema::table('member_profiles', function (Blueprint $table) {
            $table->string('cadet_name')->nullable()->after('member_id');
            $table->string('blood_group', 5)->nullable()->after('gender');
            $table->string('spouse_name')->nullable()->after('blood_group');
            $table->string('spouse_occupation')->nullable()->after('spouse_name');
            $table->string('spouse_job_location')->nullable()->after('spouse_occupation');
            $table->json('children_names')->nullable()->after('spouse_job_location');
            $table->string('job_type', 50)->nullable()->after('designation');
            $table->text('office_address')->nullable()->after('organization');
            $table->string('office_phone', 30)->nullable()->after('office_address');
            $table->string('facebook_url')->nullable()->after('linkedin_url');
            $table->text('remarks')->nullable()->after('professional_bio');
        });
    }

    public function down(): void
    {
        Schema::table('members', function (Blueprint $table) {
            $table->dropColumn(['house_name', 'house_color']);
        });

        Schema::table('member_profiles', function (Blueprint $table) {
            $table->dropColumn([
                'cadet_name',
                'blood_group',
                'spouse_name',
                'spouse_occupation',
                'spouse_job_location',
                'children_names',
                'job_type',
                'office_address',
                'office_phone',
                'facebook_url',
                'remarks',
            ]);
        });
    }
};
