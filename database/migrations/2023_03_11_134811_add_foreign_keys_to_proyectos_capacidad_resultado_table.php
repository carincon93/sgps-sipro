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
        Schema::table('proyectos_capacidad_resultado', function (Blueprint $table) {
            $table->foreign(['proyecto_capacidad_objetivo_especifico_id'], 'proyecto_capacidad_objetivo_especifico_id_fkey')->references(['id'])->on('proyecto_capacidad_objetivo_especifico')->onUpdate('CASCADE')->onDelete('CASCADE');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('proyectos_capacidad_resultado', function (Blueprint $table) {
            $table->dropForeign('proyecto_capacidad_objetivo_especifico_id_fkey');
        });
    }
};
