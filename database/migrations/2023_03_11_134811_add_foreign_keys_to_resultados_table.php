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
        Schema::table('resultados', function (Blueprint $table) {
            $table->foreign(['efecto_directo_id'], 'efecto_directo_id_fkey')->references(['id'])->on('efectos_directos')->onUpdate('CASCADE')->onDelete('CASCADE');
            $table->foreign(['objetivo_especifico_id'], 'objetivo_especifico_id_fkey')->references(['id'])->on('objetivos_especificos')->onUpdate('CASCADE')->onDelete('CASCADE');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('resultados', function (Blueprint $table) {
            $table->dropForeign('efecto_directo_id_fkey');
            $table->dropForeign('objetivo_especifico_id_fkey');
        });
    }
};
