<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('members', function (Blueprint $table) {
            $table->dropForeign(['college_id']);
        });

        Schema::table('members', function (Blueprint $table) {
            $table->dropColumn('college_id');
        });

        Schema::table('members', function (Blueprint $table) {
            $table->foreignId('college_id')->nullable()->after('member_code')->constrained('colleges')->restrictOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('members', function (Blueprint $table) {
            $table->dropForeign(['college_id']);
            $table->dropColumn('college_id');
        });

        Schema::table('members', function (Blueprint $table) {
            $table->foreignId('college_id')->after('member_code')->constrained('colleges')->restrictOnDelete();
        });
    }
};