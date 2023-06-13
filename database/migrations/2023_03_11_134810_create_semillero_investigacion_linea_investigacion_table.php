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
        Schema::create('semillero_investigacion_linea_investigacion', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('semillero_investigacion_id');
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
        Schema::dropIfExists('semillero_investigacion_linea_investigacion');
    }
};
