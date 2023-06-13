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
        Schema::create('programas_formacion', function (Blueprint $table) {
            $table->increments('id');

            $table->string('nombre', 191);
            $table->string('codigo')->nullable();
            $table->char('modalidad');
            $table->char('nivel_formacion');
            $table->boolean('registro_calificado')->nullable()->default(true);
            $table->char('tipo')->nullable();
            $table->string('snies', 50)->nullable();

            $table->integer('red_conocimiento_id')->nullable();
            $table->integer('centro_formacion_id')->nullable();
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
        Schema::dropIfExists('programas_formacion');
    }
};
