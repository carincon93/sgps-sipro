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
        Schema::table('ambientes_modernizacion', function (Blueprint $table) {
            $table->foreign(['actividad_economica_id'], 'ambientes_modernizacion_fk')->references(['id'])->on('actividades_economicas')->onUpdate('CASCADE')->onDelete('CASCADE');
            $table->foreign(['tematica_estrategica_id'], 'ambientes_modernizacion_fk_1')->references(['id'])->on('tematicas_estrategicas')->onUpdate('CASCADE')->onDelete('CASCADE');
            $table->foreign(['disciplina_subarea_conocimiento_id'], 'ambientes_modernizacion_fk_2')->references(['id'])->on('disciplinas_subarea_conocimiento')->onUpdate('CASCADE')->onDelete('CASCADE');
            $table->foreign(['red_conocimiento_id'], 'ambientes_modernizacion_fk_4')->references(['id'])->on('redes_conocimiento')->onUpdate('CASCADE')->onDelete('CASCADE');
            $table->foreign(['tipologia_ambiente_id'], 'ambientes_modernizacion_fk_6')->references(['id'])->on('tipologias_ambientes')->onUpdate('CASCADE')->onDelete('CASCADE');
            $table->foreign(['dinamizador_sennova_id'], 'ambientes_modernizacion_fk_7')->references(['id'])->on('users')->onUpdate('CASCADE')->onDelete('CASCADE');
            $table->foreign(['linea_investigacion_id'], 'ambientes_modernizacion_fk_8')->references(['id'])->on('lineas_investigacion')->onUpdate('CASCADE')->onDelete('CASCADE');
            $table->foreign(['seguimiento_ambiente_modernizacion_id'], 'ambientes_modernizacion_fk_9')->references(['id'])->on('seguimientos_ambiente_modernizacion')->onUpdate('CASCADE')->onDelete('CASCADE');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('ambientes_modernizacion', function (Blueprint $table) {
            $table->dropForeign('ambientes_modernizacion_fk');
            $table->dropForeign('ambientes_modernizacion_fk_1');
            $table->dropForeign('ambientes_modernizacion_fk_2');
            $table->dropForeign('ambientes_modernizacion_fk_4');
            $table->dropForeign('ambientes_modernizacion_fk_6');
            $table->dropForeign('ambientes_modernizacion_fk_7');
            $table->dropForeign('ambientes_modernizacion_fk_8');
            $table->dropForeign('ambientes_modernizacion_fk_9');
        });
    }
};
