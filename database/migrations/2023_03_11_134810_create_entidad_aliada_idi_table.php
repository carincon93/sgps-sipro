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
        Schema::create('entidades_aliadas_linea_66', function (Blueprint $table) {
            $table->increments('id');

            $table->text('descripcion_convenio')->nullable();
            $table->string('grupo_investigacion', 191)->nullable();
            $table->string('codigo_gruplac', 191)->nullable();
            $table->string('enlace_gruplac', 191)->nullable();
            $table->text('actividades_transferencia_conocimiento');
            $table->text('carta_intencion')->nullable();
            $table->text('carta_propiedad_intelectual')->nullable();
            $table->decimal('recursos_especie', 14, 0)->nullable();
            $table->text('descripcion_recursos_especie')->nullable();
            $table->decimal('recursos_dinero', 14, 0)->nullable();
            $table->text('descripcion_recursos_dinero')->nullable();

            $table->integer('entidad_aliada_id');
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
        Schema::dropIfExists('entidades_aliadas_linea_66');
    }
};
