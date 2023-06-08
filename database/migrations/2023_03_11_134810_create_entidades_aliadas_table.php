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
        Schema::create('entidades_aliadas', function (Blueprint $table) {
            $table->increments('id');

            $table->string('tipo', 191);
            $table->string('nombre');
            $table->string('naturaleza', 191)->comment('Público, Privado, Mixta, ONG');
            $table->string('tipo_empresa', 191)->comment('Microempresa, Pequeña, mediana, grande');
            $table->string('nit', 11);

            $table->integer('proyecto_id');
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
        Schema::dropIfExists('entidades_aliadas');
    }
};
