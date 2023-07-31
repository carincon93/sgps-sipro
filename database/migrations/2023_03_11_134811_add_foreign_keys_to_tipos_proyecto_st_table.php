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
        Schema::table('tipos_proyecto_linea_68', function (Blueprint $table) {
            $table->foreign(['centro_formacion_id'], 'centro_formacion_id_fkey')->references(['id'])->on('centros_formacion')->onUpdate('CASCADE')->onDelete('CASCADE');
            $table->foreign(['linea_tecnica_id'], 'linea_tecnica_id_fkey')->references(['id'])->on('lineas_tecnicas')->onUpdate('CASCADE')->onDelete('CASCADE');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('tipos_proyecto_linea_68', function (Blueprint $table) {
            $table->dropForeign('centro_formacion_id_fkey');
            $table->dropForeign('linea_tecnica_id_fkey');
        });
    }
};
