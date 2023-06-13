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
        Schema::create('anexos', function (Blueprint $table) {
            $table->increments('id');

            $table->string('nombre', 191)->nullable()->comment('ANEXO 1. Acta del comité primario
            Anexo 1B. Carta de aval de director regional.
            ANEXO 2. Proyecto formulado
            ANEXO 3. Cronograma del proyecto.
            ANEXO 4. Estudio de mercado maquinaria y equipos  (diligenciar análisis de mercado y justificación).
            ANEXO 5. Fichas técnicas para maquinaria y equipos.
            ANEXO 9. Carta de intención o acta que soporta el trabajo articulado con entidades externas (diferentes al SENA).
            ANEXO 10. Propiedad intelectual
            ANEXO 14. Presupuesto');
            $table->text('descripcion')->nullable();
            $table->text('archivo')->nullable();
            $table->boolean('obligatorio')->default(false);
            $table->boolean('habilitado')->nullable()->default(true);

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
        Schema::dropIfExists('anexos');
    }
};
