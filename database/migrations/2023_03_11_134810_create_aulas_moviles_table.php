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
        Schema::create('aulas_moviles', function (Blueprint $table) {
            $table->increments('id');

            $table->text('placa');
            $table->integer('modelo');
            $table->text('logros_vigencia');
            $table->integer('numero_municipios_visitados');
            $table->integer('numero_aprendices_beneficiados');
            $table->text('estado');
            $table->text('modulos_interactivos');
            $table->text('acciones_a_desarrollar');
            $table->integer('numero_aprendices_a_beneficiar');
            $table->text('recursos_mantenimiento')->nullable();
            $table->text('soat')->nullable();
            $table->text('tecnicomecanica')->nullable();

            $table->integer('ta_id');
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
        Schema::dropIfExists('aulas_moviles');
    }
};
