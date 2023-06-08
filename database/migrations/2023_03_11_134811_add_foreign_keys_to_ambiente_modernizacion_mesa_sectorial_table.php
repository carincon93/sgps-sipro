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
        Schema::table('ambiente_modernizacion_mesa_sectorial', function (Blueprint $table) {
            $table->foreign(['mesa_sectorial_id'], 'ambiente_modernizacion_mesa_sectorial_fk')->references(['id'])->on('mesas_sectoriales')->onUpdate('CASCADE')->onDelete('CASCADE');
            $table->foreign(['ambiente_modernizacion_id'], 'ambiente_modernizacion_mesa_sectorial_fk_1')->references(['id'])->on('ambientes_modernizacion')->onUpdate('CASCADE')->onDelete('CASCADE');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('ambiente_modernizacion_mesa_sectorial', function (Blueprint $table) {
            $table->dropForeign('ambiente_modernizacion_mesa_sectorial_fk');
            $table->dropForeign('ambiente_modernizacion_mesa_sectorial_fk_1');
        });
    }
};
