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
        Schema::create('miembros_entidad_aliada', function (Blueprint $table) {
            $table->increments('id');

            $table->string('nombre');
            $table->string('email');
            $table->char('tipo_documento', 2);
            $table->string('numero_documento');
            $table->string('numero_celular');
            $table->boolean('autorizacion_datos')->default(true);

            $table->integer('entidad_aliada_id');
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
        Schema::dropIfExists('miembros_entidad_aliada');
    }
};
