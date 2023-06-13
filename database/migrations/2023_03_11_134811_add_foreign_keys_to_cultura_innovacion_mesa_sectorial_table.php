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
        Schema::table('cultura_innovacion_mesa_sectorial', function (Blueprint $table) {
            $table->foreign(['cultura_innovacion_id'], 'cultura_innovacion_id_fkey')->references(['id'])->on('cultura_innovacion')->onUpdate('CASCADE')->onDelete('CASCADE');
            $table->foreign(['mesa_sectorial_id'], 'mesa_sectorial_id_fkey')->references(['id'])->on('mesas_sectoriales')->onUpdate('CASCADE')->onDelete('CASCADE');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('cultura_innovacion_mesa_sectorial', function (Blueprint $table) {
            $table->dropForeign('cultura_innovacion_id_fkey');
            $table->dropForeign('mesa_sectorial_id_fkey');
        });
    }
};
