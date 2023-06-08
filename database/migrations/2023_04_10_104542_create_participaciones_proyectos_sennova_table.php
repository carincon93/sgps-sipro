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
        Schema::create('participaciones_proyectos_sennova', function (Blueprint $table) {
            $table->id();
            $table->char('tipo_proyecto', 1);
            $table->text('titulo');
            $table->string('year_ejecucion', 4);
            $table->string('codigo_proyecto', 20);
            $table->date('fecha_finalizacion_proyecto');

            $table->integer('user_id');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('participaciones_proyectos_sennova');
    }
};
