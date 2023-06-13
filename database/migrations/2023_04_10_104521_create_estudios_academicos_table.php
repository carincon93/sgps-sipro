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
        Schema::create('estudios_academicos', function (Blueprint $table) {
            $table->id();
            $table->char('grado_formacion', 1);
            $table->string('titulo_obtenido', 255);
            $table->string('soporte_titulo_obtenido', 255)->nullable();

            $table->integer('user_id');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('estudios_academicos');
    }
};
