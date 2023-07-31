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
        Schema::create('tipos_proyecto_linea_68', function (Blueprint $table) {
            $table->increments('id');

            $table->char('tipologia', 1);
            $table->char('subclasificacion', 1);
            $table->char('tipo_proyecto', 1);

            $table->integer('linea_tecnica_id');
            $table->integer('centro_formacion_id');
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
        Schema::dropIfExists('tipos_proyecto_linea_68');
    }
};
