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
        Schema::table('evaluaciones_proyectos_formulario_1_linea_65.', function (Blueprint $table) {
            $table->foreign(['id'], 'evaluaciones_proyectos_formulario_1_linea_65._id_fkey')->references(['id'])->on('evaluaciones')->onUpdate('CASCADE')->onDelete('CASCADE');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('evaluaciones_proyectos_formulario_1_linea_65.', function (Blueprint $table) {
            $table->dropForeign('evaluaciones_proyectos_formulario_1_linea_65._id_fkey');
        });
    }
};
