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
        Schema::create('ta_tp_viaticos_municipios', function (Blueprint $table) {
            $table->increments('id');

            $table->integer('distancia_municipio')->nullable();
            $table->integer('frecuencia_semanal')->nullable();
            $table->integer('numero_visitas')->nullable();
            $table->text('actividad_a_realizar');

            $table->integer('municipio_id');
            $table->integer('proyecto_rol_sennova_id');
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
        Schema::dropIfExists('ta_tp_viaticos_municipios');
    }
};
