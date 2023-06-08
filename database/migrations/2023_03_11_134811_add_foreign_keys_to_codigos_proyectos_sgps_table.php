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
        Schema::table('codigos_proyectos_sgps', function (Blueprint $table) {
            $table->foreign(['centro_formacion_id'], 'codigos_proyectos_sgps_fk')->references(['id'])->on('centros_formacion')->onUpdate('CASCADE')->onDelete('CASCADE');
            $table->foreign(['linea_programatica_id'], 'codigos_proyectos_sgps_fk_1')->references(['id'])->on('lineas_programaticas')->onUpdate('CASCADE')->onDelete('CASCADE');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('codigos_proyectos_sgps', function (Blueprint $table) {
            $table->dropForeign('codigos_proyectos_sgps_fk');
            $table->dropForeign('codigos_proyectos_sgps_fk_1');
        });
    }
};
