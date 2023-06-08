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
        Schema::create('equipos_ambiente_modernizacion', function (Blueprint $table) {
            $table->increments('id');

            $table->string('numero_inventario_equipo', 100);
            $table->text('descripcion_tecnica_equipo');
            $table->string('estado_equipo', 50);
            $table->text('observaciones_generales');
            $table->string('nombre_equipo', 191);
            $table->string('equipo_en_funcionamiento');
            $table->string('marca', 191);
            $table->integer('horas_promedio_uso');
            $table->string('frecuencia_mantenimiento', 50);
            $table->smallInteger('year_adquisicion');
            $table->string('nombre_cuentadante', 100);
            $table->string('cedula_cuentadante');
            $table->string('rol_cuentadante', 50);

            $table->integer('ambiente_modernizacion_id');
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
        Schema::dropIfExists('equipos_ambiente_modernizacion');
    }
};
