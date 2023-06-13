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
        Schema::table('users', function (Blueprint $table) {
            $table->foreign(['centro_formacion_id'], 'centro_formacion_id_fkey')->references(['id'])->on('centros_formacion')->onUpdate('CASCADE')->onDelete('SET NULL');
            $table->foreign(['red_conocimiento_id'], 'red_conocimiento_id_fkey')->references(['id'])->on('redes_conocimiento')->onUpdate('CASCADE')->onDelete('SET NULL');
            $table->foreign(['disciplina_subarea_conocimiento_id'], 'disciplina_subarea_conocimiento_id_fkey')->references(['id'])->on('disciplinas_subarea_conocimiento')->onUpdate('CASCADE')->onDelete('SET NULL');
            $table->foreign(['lugar_expedicion_id'], 'lugar_expedicion_id_fkey')->references(['id'])->on('municipios')->onUpdate('CASCADE')->onDelete('SET NULL');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign('disciplina_subarea_conocimiento_id_fkey');
            $table->dropForeign('red_conocimiento_id_fkey');
            $table->dropForeign('centro_formacion_id_fkey');
            $table->dropForeign('lugar_expedicion_id_fkey');
        });
    }
};
