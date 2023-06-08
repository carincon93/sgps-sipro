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
        Schema::create('cultura_innovacion_mesa_sectorial', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('cultura_innovacion_id');
            $table->integer('mesa_sectorial_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('cultura_innovacion_mesa_sectorial');
    }
};
