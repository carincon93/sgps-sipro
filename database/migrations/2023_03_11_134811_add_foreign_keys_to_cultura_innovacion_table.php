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
        Schema::table('cultura_innovacion', function (Blueprint $table) {
            $table->foreign(['area_conocimiento_id'], 'area_conocimiento_id_fkey')->references(['id'])->on('areas_conocimiento')->onUpdate('CASCADE')->onDelete('RESTRICT');
            $table->foreign(['actividad_economica_id'], 'cultura_innovacion_actividad_economica_id_fkey')->references(['id'])->on('actividades_economicas')->onUpdate('CASCADE')->onDelete('RESTRICT');
            $table->foreign(['id'], 'cultura_innovacion_id_fkey')->references(['id'])->on('proyectos')->onUpdate('CASCADE')->onDelete('CASCADE');
            $table->foreign(['linea_investigacion_id'], 'cultura_innovacion_linea_investigacion_id_fkey')->references(['id'])->on('lineas_investigacion')->onUpdate('CASCADE')->onDelete('RESTRICT');
            $table->foreign(['tematica_estrategica_id'], 'cultura_innovacion_tematica_estrategica_id_fkey')->references(['id'])->on('tematicas_estrategicas')->onUpdate('CASCADE')->onDelete('RESTRICT');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('cultura_innovacion', function (Blueprint $table) {
            $table->dropForeign('area_conocimiento_id_fkey');
            $table->dropForeign('cultura_innovacion_actividad_economica_id_fkey');
            $table->dropForeign('cultura_innovacion_id_fkey');
            $table->dropForeign('cultura_innovacion_linea_investigacion_id_fkey');
            $table->dropForeign('cultura_innovacion_tematica_estrategica_id_fkey');
        });
    }
};
