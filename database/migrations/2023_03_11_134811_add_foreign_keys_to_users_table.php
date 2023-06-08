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
        Schema::table('users', function (Blueprint $table) {
            $table->foreign(['centro_formacion_id'], 'centro_formacion_id_fkey')->references(['id'])->on('centros_formacion')->onUpdate('CASCADE')->onDelete('SET NULL');
            $table->foreign(['lugar_expedicion_id'], 'lugar_expedicion_id_fkey')->references(['id'])->on('municipios')->onUpdate('CASCADE')->onDelete('SET NULL');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign('centro_formacion_id_fkey');
            $table->dropForeign('lugar_expedicion_id_fkey');
        });
    }
};
