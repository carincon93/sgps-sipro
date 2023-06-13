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
        Schema::table('censo_roles_sennova', function (Blueprint $table) {
            $table->foreign(['user_id'], 'user_id_fkey')->references(['id'])->on('users')->onUpdate('CASCADE')->onDelete('CASCADE');
            $table->foreign(['rol_sennova_id'], 'rol_sennova_id_fkey')->references(['id'])->on('roles_sennova')->onUpdate('CASCADE')->onDelete('CASCADE');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('censo_roles_sennova', function (Blueprint $table) {
            $table->dropForeign('user_id_fkey');
            $table->dropForeign('rol_sennova_id_fkey');
        });
    }
};
