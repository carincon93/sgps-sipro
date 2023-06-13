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
        Schema::create('ta', function (Blueprint $table) {
            $table->integer('id')->primary();

            $table->text('resumen')->nullable();
            $table->text('antecedentes')->nullable();
            $table->text('problema_central')->nullable();
            $table->text('justificacion_problema')->nullable();
            $table->text('marco_conceptual')->nullable();
            $table->text('objetivo_general')->nullable();
            $table->text('metodologia')->nullable();
            $table->text('impacto_municipios')->nullable();
            $table->date('fecha_inicio');
            $table->date('fecha_finalizacion');
            $table->text('propuesta_sostenibilidad_social')->nullable();
            $table->text('articulacion_centro_formacion')->nullable();
            $table->text('bibliografia')->nullable();
            $table->text('resumen_regional')->nullable()->default('');
            $table->text('antecedentes_tecnoacademia')->nullable()->default('');
            $table->text('retos_oportunidades')->nullable()->default('');
            $table->text('pertinencia_territorio')->nullable()->default('');
            $table->text('metodologia_local')->nullable()->default('');
            $table->smallInteger('numero_instituciones')->nullable()->default(0);
            $table->json('nombre_instituciones')->nullable();
            $table->float('max_meses_ejecucion', 0, 0)->default(0);
            $table->text('identificacion_problema')->nullable();
            $table->json('nombre_instituciones_programas')->nullable();
            $table->smallInteger('cantidad_instructores_planta')->nullable();
            $table->smallInteger('cantidad_dinamizadores_planta')->nullable();
            $table->smallInteger('cantidad_psicopedagogos_planta')->nullable();
            $table->text('propuesta_sostenibilidad_financiera')->nullable();
            $table->text('propuesta_sostenibilidad_ambiental')->nullable();
            $table->boolean('modificable')->nullable();
            $table->json('nuevas_instituciones')->nullable();
            $table->text('proyectos_ejecucion')->nullable();
            $table->text('proyectos_macro')->nullable();
            $table->text('lineas_medulares_centro')->nullable();
            $table->text('lineas_tecnologicas_centro')->nullable();
            $table->char('proyeccion_nuevas_tecnoacademias', 1)->nullable();
            $table->char('proyeccion_articulacion_media', 1)->nullable();
            $table->char('articulacion_semillero', 1)->nullable();
            $table->json('semilleros_en_formalizacion')->nullable();
            $table->char('infraestructura_tecnoacademia', 1)->nullable();
            $table->char('proyeccion_nuevas_instituciones', 1)->nullable();
            $table->text('otras_nuevas_instituciones')->nullable();
            $table->text('otras_nombre_instituciones')->nullable();
            $table->text('otras_nombre_instituciones_programas')->nullable();
            $table->boolean('proyecto_base')->nullable()->default(false);
            $table->text('logros_vigencia_anterior')->nullable();
            $table->text('articulacion_plan_educacion')->nullable();
            $table->text('articulacion_territorios_stem')->nullable();
            $table->text('articulacion_programas_centro')->nullable();
            $table->text('articulacion_bienestar_aprendiz')->nullable();
            $table->text('favorecimiento_ruta_formacion')->nullable();
            $table->text('implementacion_modelo_pedagogico')->nullable();
            $table->text('pdf_proyecto_general')->nullable();

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
        Schema::dropIfExists('ta');
    }
};
