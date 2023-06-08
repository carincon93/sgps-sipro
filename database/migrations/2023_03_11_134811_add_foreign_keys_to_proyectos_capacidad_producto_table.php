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
        Schema::table('proyectos_capacidad_producto', function (Blueprint $table) {
            $table->foreign(['proyecto_capacidad_resultado_id'], 'proyectos_capacidad_resultado_id_fkey')->references(['id'])->on('proyectos_capacidad_resultado')->onUpdate('CASCADE')->onDelete('CASCADE');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('proyectos_capacidad_producto', function (Blueprint $table) {
            $table->dropForeign('proyectos_capacidad_resultado_id_fkey');
        });
    }
};
