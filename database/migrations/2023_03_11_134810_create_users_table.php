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
        Schema::create('users', function (Blueprint $table) {
            $table->increments('id');

            $table->string('nombre');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->rememberToken();
            $table->char('tipo_documento', 1);
            $table->string('numero_documento');
            $table->integer('lugar_expedicion_id')->nullable();
            $table->string('numero_celular');
            $table->date('fecha_nacimiento')->nullable();
            $table->char('genero', 1)->nullable();
            $table->char('tipo_vinculacion', 1)->nullable();
            $table->boolean('autorizacion_datos')->nullable();
            $table->boolean('habilitado')->nullable()->default(false);

            $table->smallInteger('horas_dedicadas')->nullable();
            $table->smallInteger('meses_dedicados')->nullable();
            $table->char('nivel_ingles', 1)->nullable();
            $table->string('certificado_ingles', 255)->nullable();
            $table->boolean('es_temporal_sennova')->nullable();
            $table->date('fecha_resolucion_nombramiento')->nullable();
            $table->date('fecha_acta_nombramiento')->nullable();
            $table->string('nro_acta_nombramiento', 10)->nullable();
            $table->string('archivo_acta_resolucion', 255)->nullable();
            $table->char('grado_sennova', 2)->nullable();
            $table->date('fecha_inicio_contrato')->nullable();
            $table->date('fecha_finalizacion_contrato')->nullable();
            $table->integer('asignacion_mensual')->nullable();
            $table->char('grupo_etnico', 1)->nullable();
            $table->char('discapacidad', 1)->nullable();
            $table->boolean('tiene_pasaporte_vigente')->nullable();
            $table->boolean('tiene_visa_vigente')->nullable();
            $table->string('cvlac', 255)->nullable();
            $table->string('link_sigep_ii', 255)->nullable();

            
            $table->smallInteger('experiencia_laboral_sena')->nullable();
            $table->boolean('cursos_evaluacion_proyectos')->nullable();
            $table->json('cursos_de_evaluacion_realizados')->nullable();
            $table->boolean('experiencia_como_evaluador')->nullable();
            $table->smallInteger('numero_proyectos_evaluados')->nullable();
            $table->boolean('participacion_como_eveluador_sennova')->nullable();
            $table->boolean('conocimiento_iso_17025')->nullable();
            $table->boolean('conocimiento_iso_19011')->nullable();
            $table->boolean('conocimiento_iso_29119')->nullable();
            $table->boolean('conocimiento_iso_9001')->nullable();
            $table->boolean('experiencia_metodos_ensayo')->nullable();
            $table->smallInteger('meses_experiencia_metodos_ensayo')->nullable();

            $table->boolean('experiencia_metodos_calibracion')->nullable();
            $table->smallInteger('meses_experiencia_metodos_calibracion')->nullable();

            $table->integer('red_conocimiento_id')->nullable();
            $table->integer('centro_formacion_id')->nullable();
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
        Schema::dropIfExists('users');
    }
};
