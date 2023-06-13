<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('proyecto_capacidad_instalada_integrante', function (Blueprint $table) {
            $table->foreign(['proyecto_capacidad_instalada_id'], 'proyecto_capacidad_instalada_id_fkey')->references(['id'])->on('proyectos_capacidad_instalada')->onUpdate('CASCADE')->onDelete('CASCADE');
            $table->foreign(['user_id'], 'user_id_fkey')->references(['id'])->on('users')->onUpdate('CASCADE')->onDelete('CASCADE');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('proyecto_capacidad_instalada_integrante', function (Blueprint $table) {
            $table->dropForeign('proyecto_capacidad_instalada_id_fkey');
            $table->dropForeign('user_id_fkey');
        });
    }
};
