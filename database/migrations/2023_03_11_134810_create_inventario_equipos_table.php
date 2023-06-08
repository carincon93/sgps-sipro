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
        Schema::create('inventario_equipos', function (Blueprint $table) {
            $table->increments('id');

            $table->string('nombre');
            $table->text('marca');
            $table->text('serial');
            $table->text('codigo_interno');
            $table->date('fecha_adquisicion');
            $table->char('estado');
            $table->char('uso_st');
            $table->char('uso_otra_dependencia');
            $table->string('dependencia')->nullable();
            $table->text('descripcion');
            $table->char('mantenimiento_prox_year');
            $table->char('calibracion_prox_year');

            $table->integer('proyecto_id');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('inventario_equipos');
    }
};
