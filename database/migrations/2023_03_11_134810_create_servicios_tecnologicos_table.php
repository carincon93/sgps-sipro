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
        Schema::create('servicios_tecnologicos', function (Blueprint $table) {
            $table->integer('id');

            $table->text('titulo');
            $table->text('resumen');
            $table->text('antecedentes');
            $table->text('problema_central')->nullable();
            $table->text('justificacion_problema')->nullable();
            $table->text('pregunta_formulacion_problema');
            $table->text('objetivo_general')->nullable();
            $table->text('metodologia')->nullable();
            $table->date('fecha_inicio');
            $table->date('fecha_finalizacion');
            $table->text('propuesta_sostenibilidad')->nullable();
            $table->text('bibliografia');
            $table->float('max_meses_ejecucion', 0, 0)->default(0);
            $table->text('identificacion_problema')->nullable();
            $table->text('video')->nullable();
            $table->text('especificaciones_area')->nullable();
            $table->boolean('infraestructura_adecuada')->nullable();
            $table->char('sector_productivo', 1)->nullable();
            $table->text('zona_influencia')->nullable();
            $table->text('nombre_area_tecnica')->nullable();

            $table->integer('tipo_proyecto_st_id')->nullable();
            $table->integer('estado_sistema_gestion_id')->nullable();
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
        Schema::dropIfExists('servicios_tecnologicos');
    }
};
