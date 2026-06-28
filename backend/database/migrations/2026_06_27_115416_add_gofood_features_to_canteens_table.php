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
            $table->decimal('delivery_fee', 10, 2)->default(0);
            $table->decimal('admin_fee', 10, 2)->default(0);
            $table->integer('sold_count')->default(0);
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->decimal('rating', 3, 2)->default(0);
            $table->integer('rating_count')->default(0);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('canteens', function (Blueprint $table) {
            $table->dropColumn(['delivery_fee', 'admin_fee', 'sold_count', 'latitude', 'longitude', 'rating', 'rating_count']);
        });
    }
};
