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
        Schema::create('proyecto_presupuesto_evaluacion', function (Blueprint $table) {
            $table->increments('id');

            $table->text('comentario')->nullable();
            $table->boolean('correcto');

            $table->integer('proyecto_presupuesto_id');
            $table->integer('evaluacion_id');
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
        Schema::dropIfExists('proyecto_presupuesto_evaluacion');
    }
};
