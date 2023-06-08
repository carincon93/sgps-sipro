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
        Schema::table('ta_programa_formacion', function (Blueprint $table) {
            $table->foreign(['programa_formacion_id'], 'programa_formacion_id_fkey')->references(['id'])->on('programas_formacion')->onUpdate('CASCADE')->onDelete('CASCADE');
            $table->foreign(['proyecto_id'], 'proyecto_id_fkey')->references(['id'])->on('proyectos')->onUpdate('CASCADE')->onDelete('CASCADE');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('ta_programa_formacion', function (Blueprint $table) {
            $table->dropForeign('programa_formacion_id_fkey');
            $table->dropForeign('proyecto_id_fkey');
        });
    }
};
