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
        Schema::create('ta_disciplina_subarea_conocimiento', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('ta_id');
            $table->integer('disciplina_subarea_conocimiento_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('ta_disciplina_subarea_conocimiento');
    }
};
