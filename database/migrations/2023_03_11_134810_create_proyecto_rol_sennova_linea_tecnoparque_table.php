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
        Schema::create('proyecto_rol_sennova_linea_tecnoparque', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('proyecto_rol_sennova_id');
            $table->integer('linea_tecnoparque_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('proyecto_rol_sennova_linea_tecnoparque');
    }
};
