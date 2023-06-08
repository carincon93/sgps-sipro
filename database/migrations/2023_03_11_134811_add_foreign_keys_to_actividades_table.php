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
        Schema::table('actividades', function (Blueprint $table) {
            $table->foreign(['causa_indirecta_id'], 'causa_indirecta_id_fkey')->references(['id'])->on('causas_indirectas')->onUpdate('CASCADE')->onDelete('CASCADE');
            $table->foreign(['objetivo_especifico_id'], 'objetivo_especifico_id_fkey')->references(['id'])->on('objetivos_especificos');
            $table->foreign(['resultado_id'], 'resultado_id_fkey')->references(['id'])->on('resultados')->onUpdate('SET NULL')->onDelete('SET NULL');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('actividades', function (Blueprint $table) {
            $table->dropForeign('causa_indirecta_id_fkey');
            $table->dropForeign('objetivo_especifico_id_fkey');
            $table->dropForeign('resultado_id_fkey');
        });
    }
};
