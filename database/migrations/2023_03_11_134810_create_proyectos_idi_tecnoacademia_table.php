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
        Schema::create('proyectos_idi_tecnoacademia', function (Blueprint $table) {
            $table->increments('id');

            $table->text('titulo');
            $table->date('fecha_inicio');
            $table->date('fecha_finalizacion');
            $table->text('resumen');
            $table->text('texto_exposicion');
            $table->text('pdf_proyecto');
            $table->json('nombre_aprendices_vinculados');
            $table->json('nombre_instituciones_educativas')->nullable();
            $table->json('nuevas_instituciones_educativas')->nullable();
            $table->string('programa_formacion_articulado_media');
            $table->json('entidades_vinculadas')->nullable();
            $table->string('fuente_recursos');
            $table->decimal('presupuesto', 14, 0);
            $table->boolean('hace_parte_de_semillero');
            $table->char('estado_proyecto');
            $table->text('poblacion_beneficiada');
            $table->text('resultados_obtenidos');
            $table->string('documentos_resultados')->nullable();
            $table->text('observaciones_resultados');
            $table->string('nombre_centro_programa');
            $table->text('otra_poblacion_beneficiada')->nullable();
            $table->json('palabras_clave');
            $table->boolean('tiene_linea_investigacion');
            $table->json('lineas_investigacion')->nullable();
            $table->json('especies')->nullable();
            $table->boolean('proyecto_nuevo');
            $table->boolean('proyecto_con_continuidad');
            $table->text('productos_premios')->nullable();

            $table->integer('proyecto_id')->nullable();
            $table->integer('semillero_investigacion_id')->nullable();
            $table->integer('tecnoacademia_id');
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
        Schema::dropIfExists('proyectos_idi_tecnoacademia');
    }
};
