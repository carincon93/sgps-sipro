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
        Schema::create('analisis_riesgos', function (Blueprint $table) {
            $table->increments('id');

            $table->string('tipo', 191);
            $table->text('descripcion');
            $table->string('probabilidad', 191);
            $table->string('impacto', 191);
            $table->text('efectos');
            $table->text('medidas_mitigacion');
            $table->string('nivel', 191);

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
        Schema::dropIfExists('analisis_riesgos');
    }
};
