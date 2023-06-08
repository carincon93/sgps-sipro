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
        Schema::create('codigos_proyectos_sgps', function (Blueprint $table) {
            $table->increments('id');

            $table->text('titulo');
            $table->string('codigo_sgps')->unique('codigo_sgps_unique');
            $table->string('year_ejecucion', 4);

            $table->integer('centro_formacion_id');
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
        Schema::dropIfExists('codigos_proyectos_sgps');
    }
};
