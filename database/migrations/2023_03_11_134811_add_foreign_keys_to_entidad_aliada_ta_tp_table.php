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
        Schema::table('entidad_aliada_ta_tp', function (Blueprint $table) {
            $table->foreign(['entidad_aliada_id'], 'entidad_aliada_id_fkey')->references(['id'])->on('entidades_aliadas')->onUpdate('CASCADE')->onDelete('CASCADE');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('entidad_aliada_ta_tp', function (Blueprint $table) {
            $table->dropForeign('entidad_aliada_id_fkey');
        });
    }
};
