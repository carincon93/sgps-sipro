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
        Schema::create('proyecto_presupuesto', function (Blueprint $table) {
            $table->increments('id');

            $table->text('descripcion');
            $table->text('justificacion');
            $table->decimal('valor_total', 14, 0)->nullable();
            $table->text('formato_estudio_mercado')->nullable();
            $table->integer('concepto_viaticos')->nullable();

            $table->integer('proyecto_id');
            $table->integer('convocatoria_presupuesto_id');
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
        Schema::dropIfExists('proyecto_presupuesto');
    }
};
