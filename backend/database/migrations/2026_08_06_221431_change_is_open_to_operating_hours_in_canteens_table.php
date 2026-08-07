<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('canteens', function (Blueprint $table) {
            $table->dropColumn('is_open');
            $table->time('open_time')->default('09:00:00');
            $table->time('close_time')->default('17:00:00');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('canteens', function (Blueprint $table) {
            $table->boolean('is_open')->default(false);
            $table->dropColumn(['open_time', 'close_time']);
        });
    }
};
