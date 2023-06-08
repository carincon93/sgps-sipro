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
        Schema::table('idi_lineas_investigacion_eni', function (Blueprint $table) {
            $table->foreign(['idi_id'], 'idi_id_fkey')->references(['id'])->on('idi')->onUpdate('CASCADE')->onDelete('CASCADE');
            $table->foreign(['linea_investigacion_id'], 'linea_investigacion_id_fkey')->references(['id'])->on('lineas_investigacion')->onUpdate('CASCADE')->onDelete('CASCADE');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('idi_lineas_investigacion_eni', function (Blueprint $table) {
            $table->dropForeign('idi_id_fkey');
            $table->dropForeign('linea_investigacion_id_fkey');
        });
    }
};
