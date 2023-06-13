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
        Schema::table('proyectos_capacidad_instalada', function (Blueprint $table) {
            $table->foreign(['actividad_economica_id'], 'actividad_economica_id_fkey')->references(['id'])->on('actividades_economicas')->onUpdate('CASCADE')->onDelete('CASCADE');
            $table->foreign(['disciplina_subarea_conocimiento_id'], 'disciplina_subarea_conocimiento_id_fkey')->references(['id'])->on('disciplinas_subarea_conocimiento')->onUpdate('CASCADE')->onDelete('CASCADE');
            $table->foreign(['red_conocimiento_id'], 'red_conocimiento_id_fkey')->references(['id'])->on('redes_conocimiento')->onUpdate('CASCADE')->onDelete('CASCADE');
            $table->foreign(['semillero_investigacion_id'], 'semillero_investigacion_id_fkey')->references(['id'])->on('semilleros_investigacion')->onUpdate('CASCADE')->onDelete('CASCADE');
            $table->foreign(['subtipo_proyecto_capacidad_instalada_id'], 'subtipo_proyecto_capacidad_instalada_id_fkey')->references(['id'])->on('subtipos_proyecto_capacidad_instalada')->onUpdate('CASCADE')->onDelete('CASCADE');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('proyectos_capacidad_instalada', function (Blueprint $table) {
            $table->dropForeign('actividad_economica_id_fkey');
            $table->dropForeign('disciplina_subarea_conocimiento_id_fkey');
            $table->dropForeign('red_conocimiento_id_fkey');
            $table->dropForeign('semillero_investigacion_id_fkey');
            $table->dropForeign('subtipo_proyecto_capacidad_instalada_id_fkey');
        });
    }
};
