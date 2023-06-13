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
        Schema::create('impactos', function (Blueprint $table) {
            $table->increments('id');

            $table->text('descripcion')->nullable();
            $table->string('tipo')->default(0)->comment('1 Impacto social
            2 Impacto tecnológico
            3 Impacto económico
            4 Impacto ambiental');

            $table->integer('efecto_indirecto_id');
            $table->timestamps(6);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('impactos');
    }
};
