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
        Schema::create('tp', function (Blueprint $table) {
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
            $table->text('propuesta_sostenibilidad')->nullable();
            $table->text('impacto_centro_formacion')->nullable();
            $table->text('bibliografia')->nullable();
            $table->text('resumen_regional')->nullable()->default('');
            $table->text('antecedentes_regional')->nullable()->default('');
            $table->text('retos_oportunidades')->nullable()->default('');
            $table->text('pertinencia_territorio')->nullable()->default('');
            $table->text('metodologia_local')->nullable()->default('');
            $table->smallInteger('numero_instituciones')->nullable()->default(0);
            $table->json('nombre_instituciones')->nullable();
            $table->float('max_meses_ejecucion', 0, 0)->default(0);
            $table->text('identificacion_problema')->nullable();
            $table->boolean('modificable')->nullable();
            $table->boolean('proyecto_base')->nullable()->default(false);
            $table->text('aportacion_semilleros_grupos')->nullable();
            $table->text('proyeccion_con_st')->nullable();
            $table->text('proyeccion_extensionismo_tecnologico')->nullable();
            $table->text('proyeccion_centros_desarrollo')->nullable();
            $table->text('proyeccion_formacion_regional')->nullable();
            $table->text('articulacion_agenda_competitividad')->nullable();
            $table->text('aportes_linea_ocho_conpes')->nullable();
            $table->text('estado_ecosistema_ctel')->nullable();
            $table->text('logros_vigencia_anterior')->nullable();
            $table->text('estrategia_articulacion_prox_vigencia')->nullable();
            $table->text('alianzas_estrategicas')->nullable();
            $table->text('estrategia_divulgacion')->nullable();
            $table->text('promover_productividad')->nullable();
            $table->json('departamentos_atencion_talentos')->nullable();
            $table->text('estrategia_atencion_talentos')->nullable();
            $table->text('pdf_proyecto_general')->nullable();

            $table->integer('nodo_tecnoparque_id')->nullable();
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
        Schema::dropIfExists('tp');
    }
};
