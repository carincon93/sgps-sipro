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
        Schema::create('edt', function (Blueprint $table) {
            $table->increments('id');

            $table->char('tipo_evento');
            $table->text('descripcion_evento');
            $table->text('descripcion_participacion_entidad');
            $table->string('publico_objetivo');
            $table->integer('numero_asistentes');
            $table->string('estrategia_comunicacion');
            $table->string('nombre_evento')->nullable();
            $table->date('fecha_evento')->nullable();
            $table->string('organizador', 191)->nullable();

            $table->integer('ta_id');
            $table->integer('proyecto_presupuesto_id');
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
        Schema::dropIfExists('edt');
    }
};
