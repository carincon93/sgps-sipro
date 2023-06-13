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
        Schema::create('subtipos_proyecto_capacidad_instalada', function (Blueprint $table) {
            $table->increments('id');

            $table->string('subtipo', 191);

            $table->integer('tipo_proyecto_capacidad_instalada_id');
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
        Schema::dropIfExists('subtipos_proyecto_capacidad_instalada');
    }
};
