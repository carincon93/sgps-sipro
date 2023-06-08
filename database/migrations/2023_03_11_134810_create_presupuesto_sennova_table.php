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
        Schema::create('presupuesto_sennova', function (Blueprint $table) {
            $table->increments('id');

            $table->boolean('requiere_estudio_mercado')->default(true);
            $table->boolean('sumar_al_presupuesto')->default(true);
            $table->text('mensaje')->nullable();
            $table->boolean('habilitado')->nullable()->default(true);

            $table->integer('primer_grupo_presupuestal_id');
            $table->integer('segundo_grupo_presupuestal_id');
            $table->integer('tercer_grupo_presupuestal_id');
            $table->integer('uso_presupuestal_id');
            $table->integer('linea_programatica_id');
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
        Schema::dropIfExists('presupuesto_sennova');
    }
};
