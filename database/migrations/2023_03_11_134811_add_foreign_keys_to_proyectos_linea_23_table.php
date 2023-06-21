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
        Schema::table('proyectos_linea_23', function (Blueprint $table) {
            $table->foreign(['actividad_economica_id'], 'actividad_economica_id_fkey')->references(['id'])->on('actividades_economicas')->onUpdate('CASCADE')->onDelete('RESTRICT');
            $table->foreign(['disciplina_subarea_conocimiento_id'], 'disciplina_subarea_conocimiento_id_fkey')->references(['id'])->on('disciplinas_subarea_conocimiento')->onUpdate('CASCADE')->onDelete('RESTRICT');
            $table->foreign(['grupo_investigacion_eni_id'], 'grupo_investigacion_eni_id_fkey')->references(['id'])->on('grupos_investigacion')->onUpdate('CASCADE')->onDelete('CASCADE');
            $table->foreign(['id'], 'proyectos_linea_23_id_fkey')->references(['id'])->on('proyectos')->onUpdate('CASCADE')->onDelete('CASCADE');
            $table->foreign(['linea_investigacion_id'], 'linea_investigacion_id_fkey')->references(['id'])->on('lineas_investigacion')->onUpdate('CASCADE')->onDelete('RESTRICT');
            $table->foreign(['red_conocimiento_id'], 'red_conocimiento_id_fkey')->references(['id'])->on('redes_conocimiento')->onUpdate('CASCADE')->onDelete('RESTRICT');
            $table->foreign(['tematica_estrategica_id'], 'tematica_estrategica_id_fkey')->references(['id'])->on('tematicas_estrategicas')->onUpdate('CASCADE')->onDelete('RESTRICT');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('proyectos_linea_23', function (Blueprint $table) {
            $table->dropForeign('actividad_economica_id_fkey');
            $table->dropForeign('disciplina_subarea_conocimiento_id_fkey');
            $table->dropForeign('grupo_investigacion_eni_id_fkey');
            $table->dropForeign('proyectos_linea_23_id_fkey');
            $table->dropForeign('linea_investigacion_id_fkey');
            $table->dropForeign('red_conocimiento_id_fkey');
            $table->dropForeign('tematica_estrategica_id_fkey');
        });
    }
};
