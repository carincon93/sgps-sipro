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
        Schema::create('convocatoria_rol_sennova', function (Blueprint $table) {
            $table->increments('id');

            $table->decimal('asignacion_mensual', 10);
            $table->text('experiencia')->nullable();
            $table->char('nivel_academico')->default(0)->comment('0	ninguna
            1	técnico
            2	tecnólogo
            3	pregrado
            4	especalización
            5	maestría
            6	doctorado
            ');
            $table->text('mensaje')->nullable();
            $table->text('perfil')->nullable();

            $table->integer('convocatoria_id');
            $table->integer('rol_sennova_id');
            $table->integer('linea_programatica_id')->nullable();
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
        Schema::dropIfExists('convocatoria_rol_sennova');
    }
};
