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
        Schema::create('proyecto_capacidad_objetivo_especifico', function (Blueprint $table) {
            $table->increments('id');

            $table->char('numero');
            $table->text('descripcion');

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
        Schema::dropIfExists('proyecto_capacidad_objetivo_especifico');
    }
};
