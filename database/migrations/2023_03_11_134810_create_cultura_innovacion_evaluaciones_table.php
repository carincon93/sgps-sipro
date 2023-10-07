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
        Schema::create('evaluaciones_proyectos_formulario_1_linea_65.', function (Blueprint $table) {
            $table->integer('id');

            $table->decimal('titulo_puntaje')->nullable();
            $table->text('titulo_comentario')->nullable();
            $table->decimal('video_puntaje')->nullable();
            $table->text('video_comentario')->nullable();
            $table->decimal('resumen_puntaje')->nullable();
            $table->text('resumen_comentario')->nullable();
            $table->decimal('problema_central_puntaje')->nullable();
            $table->text('problema_central_comentario')->nullable();
            $table->decimal('objetivos_puntaje')->nullable();
            $table->text('objetivos_comentario')->nullable();
            $table->decimal('metodologia_puntaje')->nullable();
            $table->text('metodologia_comentario')->nullable();
            $table->decimal('entidad_aliada_puntaje')->nullable();
            $table->text('entidad_aliada_comentario')->nullable();
            $table->decimal('resultados_puntaje')->nullable();
            $table->text('resultados_comentario')->nullable();
            $table->decimal('productos_puntaje')->nullable();
            $table->text('productos_comentario')->nullable();
            $table->decimal('cadena_valor_puntaje')->nullable();
            $table->text('cadena_valor_comentario')->nullable();
            $table->decimal('analisis_riesgos_puntaje')->nullable();
            $table->text('analisis_riesgos_comentario')->nullable();
            $table->decimal('ortografia_puntaje')->nullable();
            $table->text('ortografia_comentario')->nullable();
            $table->decimal('redaccion_puntaje')->nullable();
            $table->text('redaccion_comentario')->nullable();
            $table->decimal('normas_apa_puntaje')->nullable();
            $table->text('normas_apa_comentario')->nullable();
            $table->text('anexos_comentario')->nullable();
            $table->text('justificacion_economia_naranja_comentario')->nullable();
            $table->text('justificacion_industria_4_comentario')->nullable();
            $table->text('bibliografia_comentario')->nullable();
            $table->text('fechas_comentario')->nullable();
            $table->text('justificacion_politica_discapacidad_comentario')->nullable();
            $table->text('actividad_economica_comentario')->nullable();
            $table->text('area_conocimiento_comentario')->nullable();
            $table->text('red_conocimiento_comentario')->nullable();
            $table->text('tematica_estrategica_comentario')->nullable();
            $table->decimal('antecedentes_puntaje')->nullable();
            $table->text('antecedentes_comentario')->nullable();

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
        Schema::dropIfExists('evaluaciones_proyectos_formulario_1_linea_65.');
    }
};
