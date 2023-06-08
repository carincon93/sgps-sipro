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
        Schema::create('evaluaciones', function (Blueprint $table) {
            $table->increments('id');

            $table->boolean('finalizado')->default(false);
            $table->boolean('habilitado')->default(true);
            $table->boolean('iniciado')->default(false);
            $table->boolean('clausula_confidencialidad')->nullable()->default(false);
            $table->text('comentario_formulador')->nullable();
            $table->text('replicas')->nullable();
            $table->text('justificacion_causal_rechazo')->nullable();
            $table->boolean('modificable')->nullable()->default(false);
            $table->text('comentario_evaluador')->nullable();
            $table->string('estado')->nullable();
            $table->boolean('evaluacion_final')->nullable();

            $table->integer('proyecto_id');
            $table->integer('user_id');
            $table->integer('convocatoria_id');
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
        Schema::dropIfExists('evaluaciones');
    }
};
