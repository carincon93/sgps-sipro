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
        Schema::create('ta_proyectos_idi_tecnoacademia', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('ta_id');
            $table->integer('proyecto_idi_tecnoacademia_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('ta_proyectos_idi_tecnoacademia');
    }
};
