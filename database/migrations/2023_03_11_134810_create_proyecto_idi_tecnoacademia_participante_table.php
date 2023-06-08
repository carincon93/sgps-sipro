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
        Schema::create('proyecto_idi_tecnoacademia_participante', function (Blueprint $table) {
            $table->increments('id');

            $table->integer('rol_sennova');
            $table->float('cantidad_meses', 0, 0);
            $table->smallInteger('cantidad_horas');
            $table->boolean('autor_principal')->nullable();

            $table->integer('proyecto_idi_tecnoacademia_id');
            $table->integer('user_id');
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
        Schema::dropIfExists('proyecto_idi_tecnoacademia_participante');
    }
};
