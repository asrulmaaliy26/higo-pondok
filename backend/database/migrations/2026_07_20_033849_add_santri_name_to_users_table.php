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
        Schema::table('users', function (Blueprint $table) {
            $table->string('santri_name')->nullable()->after('password');
            $table->string('santri_room')->nullable()->after('santri_name');
            $table->string('santri_class')->nullable()->after('santri_room');
            $table->string('santri_level')->nullable()->after('santri_class');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['santri_name', 'santri_room', 'santri_class', 'santri_level']);
        });
    }
};
