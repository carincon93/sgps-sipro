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
        Schema::create('proyectos_capacidad_instalada', function (Blueprint $table) {
            $table->increments('id');

            $table->text('titulo');
            $table->integer('beneficia_a')->nullable();
            $table->date('fecha_inicio');
            $table->date('fecha_finalizacion');
            $table->text('planteamiento_problema')->nullable();
            $table->text('justificacion')->nullable();
            $table->text('objetivo_general')->nullable();
            $table->text('primer_objetivo_especifico')->nullable();
            $table->text('segundo_objetivo_especifico')->nullable();
            $table->text('tercer_objetivo_especifico')->nullable();
            $table->text('cuarto_objetivo_especifico')->nullable();
            $table->text('metodologia')->nullable();
            $table->text('infraestructura_desarrollo_proyecto')->nullable();
            $table->text('materiales_formacion_a_usar')->nullable();
            $table->text('conclusiones')->nullable();
            $table->text('bibliografia')->nullable();

            $table->integer('semillero_investigacion_id');
            $table->integer('subtipo_proyecto_capacidad_instalada_id');
            $table->integer('estado_proyecto')->nullable();
            $table->integer('red_conocimiento_id');
            $table->integer('actividad_economica_id');
            $table->integer('disciplina_subarea_conocimiento_id');
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
        Schema::dropIfExists('proyectos_capacidad_instalada');
    }
};
