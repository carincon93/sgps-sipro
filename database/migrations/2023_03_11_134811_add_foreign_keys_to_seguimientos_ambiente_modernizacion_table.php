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
        Schema::table('seguimientos_ambiente_modernizacion', function (Blueprint $table) {
            $table->foreign(['centro_formacion_id'], 'centro_formacion_id_fkey')->references(['id'])->on('centros_formacion')->onUpdate('CASCADE')->onDelete('CASCADE');
            $table->foreign(['codigo_proyecto_sgps_id'], 'codigo_proyecto_sgps_id_fkey')->references(['id'])->on('codigos_proyectos_sgps')->onUpdate('CASCADE')->onDelete('CASCADE');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('seguimientos_ambiente_modernizacion', function (Blueprint $table) {
            $table->dropForeign('centro_formacion_id_fkey');
            $table->dropForeign('codigo_proyecto_sgps_id_fkey');
        });
    }
};
