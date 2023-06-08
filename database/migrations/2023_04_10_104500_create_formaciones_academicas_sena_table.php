<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('formaciones_academicas_sena', function (Blueprint $table) {
            $table->id();
            $table->boolean('egresado_sena');
            $table->char('modalidad_sena', 1);
            $table->char('nivel_sena', 1);
            $table->string('titulo_obtenido', 255);
            $table->date('fecha_inicio_formacion');
            $table->date('fecha_finalizacion_formacion');
            $table->string('certificado_formacion', 255)->nullable();

            $table->integer('user_id');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('formaciones_academicas_sena');
    }
};
