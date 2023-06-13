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
        Schema::create('ambientes_modernizacion', function (Blueprint $table) {
            $table->increments('id');

            $table->text('nombre_ambiente')->nullable();
            $table->boolean('alineado_mesas_sectoriales');
            $table->boolean('financiado_anteriormente');
            $table->string('estado_general_maquinaria')->nullable();
            $table->text('razon_estado_general')->nullable();
            $table->boolean('ambiente_activo')->nullable();
            $table->text('justificacion_ambiente_inactivo')->nullable();
            $table->boolean('ambiente_activo_procesos_idi')->nullable();
            $table->smallInteger('numero_proyectos_beneficiados')->nullable();
            $table->boolean('ambiente_formacion_complementaria')->nullable();
            $table->smallInteger('numero_total_cursos_comp')->nullable();
            $table->smallInteger('numero_cursos_empresas')->nullable();
            $table->json('datos_empresa')->nullable();
            $table->json('cursos_complementarios')->nullable();
            $table->string('coordenada_latitud_ambiente')->nullable();
            $table->string('coordenada_longitud_ambiente')->nullable();
            $table->text('impacto_procesos_formacion')->nullable();
            $table->text('pertinencia_sector_productivo')->nullable();
            $table->json('palabras_clave_ambiente')->nullable();
            $table->text('observaciones_generales_ambiente')->nullable();
            $table->string('soporte_fotos_ambiente')->nullable();
            $table->integer('numero_personas_certificadas')->nullable();
            $table->integer('numero_tecnicas_tecnologias')->nullable();
            $table->integer('numero_publicaciones')->nullable();
            $table->integer('numero_aprendices_beneficiados')->nullable();
            $table->text('generacion_empleo')->nullable();
            $table->text('creacion_empresas')->nullable();
            $table->text('incorporacion_nuevos_conocimientos')->nullable();
            $table->text('valor_agregado_entidades')->nullable();
            $table->text('fortalecimiento_programas_formacion')->nullable();
            $table->text('transferencia_tecnologias')->nullable();
            $table->text('cobertura_perntinencia_formacion')->nullable();
            $table->text('productividad_beneficiarios')->nullable();
            $table->boolean('finalizado')->default(false);
            $table->text('pdf_path')->nullable();
            $table->json('cod_proyectos_beneficiados')->nullable();

            $table->integer('dinamizador_sennova_id')->nullable();
            $table->integer('linea_investigacion_id')->nullable();
            $table->integer('seguimiento_ambiente_modernizacion_id');
            $table->integer('tipologia_ambiente_id');
            $table->integer('disciplina_subarea_conocimiento_id');
            $table->integer('red_conocimiento_id');
            $table->integer('actividad_economica_id');
            $table->integer('tematica_estrategica_id');
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
        Schema::dropIfExists('ambientes_modernizacion');
    }
};
