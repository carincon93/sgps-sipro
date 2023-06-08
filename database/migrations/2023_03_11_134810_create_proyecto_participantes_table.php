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
        Schema::create('proyecto_participantes', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('user_id');
            $table->integer('proyecto_id');
            $table->float('cantidad_meses', 0, 0);
            $table->integer('cantidad_horas');
            $table->integer('rol_sennova')->nullable();
            $table->boolean('es_formulador')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('proyecto_participantes');
    }
};
