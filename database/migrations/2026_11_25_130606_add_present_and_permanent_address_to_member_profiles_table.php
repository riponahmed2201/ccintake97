<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('member_profiles', function (Blueprint $table) {
            $table->string('present_address_line')->nullable()->after('address');
            $table->string('present_area', 150)->nullable()->after('present_address_line');
            $table->string('present_postal_code', 30)->nullable()->after('present_area');
            $table->boolean('same_as_present_address')->default(false)->after('present_postal_code');
            $table->string('permanent_address_line')->nullable()->after('same_as_present_address');
            $table->string('permanent_area', 150)->nullable()->after('permanent_address_line');
            $table->string('permanent_city', 150)->nullable()->after('permanent_area');
            $table->string('permanent_postal_code', 30)->nullable()->after('permanent_city');
            $table->string('permanent_country_code', 5)->nullable()->after('permanent_postal_code');
        });
    }

    public function down(): void
    {
        Schema::table('member_profiles', function (Blueprint $table) {
            $table->dropColumn([
                'present_address_line',
                'present_area',
                'present_postal_code',
                'same_as_present_address',
                'permanent_address_line',
                'permanent_area',
                'permanent_city',
                'permanent_postal_code',
                'permanent_country_code',
            ]);
        });
    }
};
