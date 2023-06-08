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
        Schema::table('proyecto_rol_evaluacion', function (Blueprint $table) {
            $table->foreign(['evaluacion_id'], 'evaluacion_id_fkey')->references(['id'])->on('evaluaciones')->onUpdate('CASCADE')->onDelete('CASCADE');
            $table->foreign(['proyecto_rol_sennova_id'], 'proyecto_rol_sennova_id_fkey')->references(['id'])->on('proyecto_rol_sennova')->onUpdate('CASCADE')->onDelete('CASCADE');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('proyecto_rol_evaluacion', function (Blueprint $table) {
            $table->dropForeign('evaluacion_id_fkey');
            $table->dropForeign('proyecto_rol_sennova_id_fkey');
        });
    }
};
