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
        Schema::create('servicios_tecnologicos_evaluaciones', function (Blueprint $table) {
            $table->integer('id')->primary();

            $table->text('titulo_comentario')->nullable();
            $table->decimal('titulo_puntaje')->nullable();
            $table->text('resumen_comentario')->nullable();
            $table->decimal('resumen_puntaje')->nullable();
            $table->text('antecedentes_comentario')->nullable();
            $table->decimal('antecedentes_puntaje')->nullable();
            $table->text('justificacion_problema_comentario')->nullable();
            $table->decimal('justificacion_problema_puntaje')->nullable();
            $table->text('pregunta_formulacion_problema_comentario')->nullable();
            $table->decimal('pregunta_formulacion_problema_puntaje')->nullable();
            $table->text('objetivo_general_comentario')->nullable();
            $table->text('fecha_ejecucion_comentario')->nullable();
            $table->text('propuesta_sostenibilidad_comentario')->nullable();
            $table->decimal('propuesta_sostenibilidad_puntaje')->nullable();
            $table->text('identificacion_problema_comentario')->nullable();
            $table->decimal('identificacion_problema_puntaje')->nullable();
            $table->text('video_comentario')->nullable();
            $table->text('especificaciones_area_comentario')->nullable();
            $table->text('ortografia_comentario')->nullable();
            $table->text('redaccion_comentario')->nullable();
            $table->text('normas_apa_comentario')->nullable();
            $table->text('arbol_problemas_comentario')->nullable();
            $table->decimal('arbol_problemas_puntaje')->nullable();
            $table->text('arbol_objetivos_comentario')->nullable();
            $table->decimal('impacto_ambiental_puntaje')->nullable();
            $table->text('impacto_ambiental_comentario')->nullable();
            $table->decimal('impacto_social_centro_puntaje')->nullable();
            $table->text('impacto_social_centro_comentario')->nullable();
            $table->decimal('impacto_social_productivo_puntaje')->nullable();
            $table->text('impacto_social_productivo_comentario')->nullable();
            $table->decimal('impacto_tecnologico_puntaje')->nullable();
            $table->text('impacto_tecnologico_comentario')->nullable();
            $table->decimal('riesgos_objetivo_general_puntaje')->nullable();
            $table->text('riesgos_objetivo_general_comentario')->nullable();
            $table->decimal('riesgos_productos_puntaje')->nullable();
            $table->text('riesgos_productos_comentario')->nullable();
            $table->decimal('riesgos_actividades_puntaje')->nullable();
            $table->text('riesgos_actividades_comentario')->nullable();
            $table->decimal('objetivo_general_puntaje')->nullable();
            $table->decimal('resultados_primer_obj_puntaje')->nullable();
            $table->text('resultados_primer_obj_comentario')->nullable();
            $table->decimal('resultados_segundo_obj_puntaje')->nullable();
            $table->text('resultados_segundo_obj_comentario')->nullable();
            $table->decimal('resultados_tercer_obj_puntaje')->nullable();
            $table->text('resultados_tercer_obj_comentario')->nullable();
            $table->decimal('resultados_cuarto_obj_puntaje')->nullable();
            $table->text('resultados_cuarto_obj_comentario')->nullable();
            $table->decimal('actividades_primer_obj_puntaje')->nullable();
            $table->text('actividades_primer_obj_comentario')->nullable();
            $table->decimal('actividades_segundo_obj_puntaje')->nullable();
            $table->text('actividades_segundo_obj_comentario')->nullable();
            $table->decimal('actividades_tercer_obj_puntaje')->nullable();
            $table->text('actividades_tercer_obj_comentario')->nullable();
            $table->decimal('actividades_cuarto_obj_puntaje')->nullable();
            $table->text('actividades_cuarto_obj_comentario')->nullable();
            $table->decimal('metodologia_puntaje')->nullable();
            $table->text('metodologia_comentario')->nullable();
            $table->decimal('productos_primer_obj_puntaje')->nullable();
            $table->text('productos_primer_obj_comentario')->nullable();
            $table->decimal('productos_segundo_obj_puntaje')->nullable();
            $table->text('productos_segundo_obj_comentario')->nullable();
            $table->decimal('productos_tercer_obj_puntaje')->nullable();
            $table->text('productos_tercer_obj_comentario')->nullable();
            $table->decimal('productos_cuarto_obj_puntaje')->nullable();
            $table->text('productos_cuarto_obj_comentario')->nullable();
            $table->decimal('primer_objetivo_puntaje')->nullable();
            $table->text('primer_objetivo_comentario')->nullable();
            $table->decimal('segundo_objetivo_puntaje')->nullable();
            $table->text('segundo_objetivo_comentario')->nullable();
            $table->decimal('tercer_objetivo_puntaje')->nullable();
            $table->text('tercer_objetivo_comentario')->nullable();
            $table->decimal('cuarto_objetivo_puntaje')->nullable();
            $table->text('cuarto_objetivo_comentario')->nullable();
            $table->text('anexos_comentario')->nullable();
            $table->text('bibliografia_comentario')->nullable();
            $table->text('inventario_equipos_comentario')->nullable();

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
        Schema::dropIfExists('servicios_tecnologicos_evaluaciones');
    }
};
