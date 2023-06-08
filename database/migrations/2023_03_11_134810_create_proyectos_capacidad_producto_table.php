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
        Schema::create('proyectos_capacidad_producto', function (Blueprint $table) {
            $table->increments('id');

            $table->text('descripcion');
            $table->char('tipologia_minciencias');

            $table->integer('proyecto_capacidad_resultado_id');
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
        Schema::dropIfExists('proyectos_capacidad_producto');
    }
};
