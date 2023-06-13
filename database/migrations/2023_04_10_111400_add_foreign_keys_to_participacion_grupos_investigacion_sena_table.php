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
        Schema::table('participacion_grupos_investigacion_sena', function (Blueprint $table) {
            $table->foreign(['user_id'], 'user_id_fkey')->references(['id'])->on('users')->onUpdate('CASCADE')->onDelete('CASCADE');
            $table->foreign(['grupo_investigacion_id'], 'grupo_investigacion_id_fkey')->references(['id'])->on('grupos_investigacion')->onUpdate('CASCADE')->onDelete('CASCADE');
            $table->foreign(['semillero_investigacion_id'], 'semillero_investigacion_id_fkey')->references(['id'])->on('semilleros_investigacion')->onUpdate('CASCADE')->onDelete('CASCADE');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('participacion_grupos_investigacion_sena', function (Blueprint $table) {
            $table->dropForeign('user_id_fkey');
            $table->dropForeign('grupo_investigacion_id_fkey');
            $table->dropForeign('semillero_investigacion_id_fkey');
        });
    }
};
