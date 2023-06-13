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
        Schema::table('proyecto_capacidad_programa_formacion', function (Blueprint $table) {
            $table->foreign(['programa_formacion_id'], 'programa_formacion_id_fkey')->references(['id'])->on('programas_formacion')->onUpdate('CASCADE')->onDelete('CASCADE');
            $table->foreign(['proyecto_capacidad_instalada_id'], 'proyecto_capacidad_instalada_id_fkey')->references(['id'])->on('proyectos_capacidad_instalada')->onUpdate('CASCADE')->onDelete('CASCADE');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('proyecto_capacidad_programa_formacion', function (Blueprint $table) {
            $table->dropForeign('programa_formacion_id_fkey');
            $table->dropForeign('proyecto_capacidad_instalada_id_fkey');
        });
    }
};
