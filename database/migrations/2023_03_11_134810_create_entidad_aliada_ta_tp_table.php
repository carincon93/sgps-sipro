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
        Schema::create('entidad_aliada_ta_tp', function (Blueprint $table) {
            $table->increments('id');

            $table->text('soporte_convenio')->nullable();
            $table->date('fecha_inicio_convenio')->nullable();
            $table->date('fecha_fin_convenio')->nullable();

            $table->integer('entidad_aliada_id');
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
        Schema::dropIfExists('entidad_aliada_ta_tp');
    }
};
