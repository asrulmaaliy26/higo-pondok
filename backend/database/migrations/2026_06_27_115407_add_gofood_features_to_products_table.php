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
        Schema::table('products', function (Blueprint $table) {
            $table->decimal('discount_price', 10, 2)->nullable();
            $table->integer('sold_count')->default(0);
            $table->decimal('rating', 3, 2)->default(0);
            $table->integer('rating_count')->default(0);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['discount_price', 'sold_count', 'rating', 'rating_count']);
        });
    }
};
