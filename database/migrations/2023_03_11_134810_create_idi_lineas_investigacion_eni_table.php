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
        Schema::create('idi_lineas_investigacion_eni', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('idi_id');
            $table->integer('linea_investigacion_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('idi_lineas_investigacion_eni');
    }
};
