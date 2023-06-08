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
        Schema::create('proyecto_capacidad_entidad_aliada', function (Blueprint $table) {
            $table->increments('id');

            $table->string('nombre');
            $table->string('nit', 15);
            $table->string('documento');

            $table->integer('proyecto_capacidad_instalada_id');
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
        Schema::dropIfExists('proyecto_capacidad_entidad_aliada');
    }
};
