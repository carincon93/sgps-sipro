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
        Schema::create('proyecto_rol_sennova', function (Blueprint $table) {
            $table->increments('id');

            $table->text('descripcion')->nullable();
            $table->float('numero_meses', 0, 0);
            $table->smallInteger('numero_roles');
            $table->text('educacion')->nullable();
            $table->text('formacion')->nullable();
            $table->text('experiencia')->nullable();
            $table->integer('horas_monitorias')->nullable();

            $table->integer('proyecto_id');
            $table->integer('convocatoria_rol_sennova_id');
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
        Schema::dropIfExists('proyecto_rol_sennova');
    }
};
