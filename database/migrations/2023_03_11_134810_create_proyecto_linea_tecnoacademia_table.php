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
        Schema::create('proyecto_linea_tecnoacademia', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('proyecto_id');
            $table->integer('tecnoacademia_linea_tecnoacademia_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('proyecto_linea_tecnoacademia');
    }
};
