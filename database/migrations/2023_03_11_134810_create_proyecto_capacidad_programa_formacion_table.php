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
        Schema::create('proyecto_capacidad_programa_formacion', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('proyecto_capacidad_instalada_id');
            $table->integer('programa_formacion_id');

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
        Schema::dropIfExists('proyecto_capacidad_programa_formacion');
    }
};
