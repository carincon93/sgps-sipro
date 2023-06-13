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
        Schema::table('subtipos_proyecto_capacidad_instalada', function (Blueprint $table) {
            $table->foreign(['tipo_proyecto_capacidad_instalada_id'], 'tipo_proyecto_capacidad_instalada_id_fkey')->references(['id'])->on('tipos_proyecto_capacidad_instalada')->onUpdate('CASCADE')->onDelete('CASCADE');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('subtipos_proyecto_capacidad_instalada', function (Blueprint $table) {
            $table->dropForeign('tipo_proyecto_capacidad_instalada_id_fkey');
        });
    }
};
