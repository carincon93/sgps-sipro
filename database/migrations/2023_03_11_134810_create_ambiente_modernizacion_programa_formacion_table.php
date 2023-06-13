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
        Schema::create('ambiente_modernizacion_programa_formacion', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('ambiente_modernizacion_id');
            $table->integer('programa_formacion_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('ambiente_modernizacion_programa_formacion');
    }
};
