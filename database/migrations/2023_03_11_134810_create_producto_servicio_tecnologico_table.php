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
        Schema::create('producto_servicio_tecnologico', function (Blueprint $table) {
            $table->increments('id');

            $table->text('medio_verificacion');
            $table->text('nombre_indicador')->default('');
            $table->text('formula_indicador')->nullable()->default('');
            $table->text('meta_indicador')->nullable();

            $table->integer('producto_id');
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
        Schema::dropIfExists('producto_servicio_tecnologico');
    }
};
