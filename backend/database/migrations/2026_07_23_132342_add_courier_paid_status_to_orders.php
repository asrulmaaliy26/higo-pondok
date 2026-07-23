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
        Schema::table('orders', function (Blueprint $table) {
            $table->boolean('is_courier_paid_by_canteen')->default(false)->after('courier_id');
            $table->string('proof_courier_paid')->nullable()->after('is_courier_paid_by_canteen');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['is_courier_paid_by_canteen', 'proof_courier_paid']);
        });
    }
};
