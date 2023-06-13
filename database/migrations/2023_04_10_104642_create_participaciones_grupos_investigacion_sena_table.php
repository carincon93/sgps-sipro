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
        Schema::create('participaciones_grupos_investigacion_sena', function (Blueprint $table) {
            $table->id();
            $table->boolean('pertenece_grupo_investigacion_centro');
            $table->boolean('pertenece_semillero_investigacion_centro');

            $table->integer('user_id');
            $table->integer('grupo_investigacion_id');
            $table->integer('semillero_investigacion_id');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('participaciones_grupos_investigacion_sena');
    }
};
