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
        Schema::create('tp_evaluaciones', function (Blueprint $table) {
            $table->integer('id')->primary();

            $table->text('resumen_regional_comentario')->nullable();
            $table->text('antecedentes_regional_comentario')->nullable();
            $table->text('municipios_comentario')->nullable();
            $table->text('fecha_ejecucion_comentario')->nullable();
            $table->text('cadena_valor_comentario')->nullable();
            $table->text('impacto_centro_formacion_comentario')->nullable();
            $table->text('bibliografia_comentario')->nullable();
            $table->text('retos_oportunidades_comentario')->nullable();
            $table->text('pertinencia_territorio_comentario')->nullable();
            $table->text('metodologia_comentario')->nullable();
            $table->text('instituciones_comentario')->nullable();
            $table->text('analisis_riesgos_comentario')->nullable();
            $table->text('anexos_comentario')->nullable();
            $table->text('productos_comentario')->nullable();
            $table->text('ortografia_comentario')->nullable();
            $table->text('redaccion_comentario')->nullable();
            $table->text('normas_apa_comentario')->nullable();
            $table->text('arbol_problemas_comentario')->nullable();
            $table->text('arbol_objetivos_comentario')->nullable();
            $table->text('proyecto_presupuesto_comentario')->nullable();
            $table->text('articulacion_sennova_comentario')->nullable();

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
        Schema::dropIfExists('tp_evaluaciones');
    }
};
