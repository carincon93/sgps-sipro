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
        Schema::table('ta_tematica_estrategica', function (Blueprint $table) {
            $table->foreign(['ta_id'], 'ta_id_fkey')->references(['id'])->on('ta')->onUpdate('CASCADE')->onDelete('CASCADE');
            $table->foreign(['tematica_estrategica_id'], 'tematica_estrategica_id_fkey')->references(['id'])->on('tematicas_estrategicas')->onUpdate('CASCADE')->onDelete('CASCADE');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('ta_tematica_estrategica', function (Blueprint $table) {
            $table->dropForeign('ta_id_fkey');
            $table->dropForeign('tematica_estrategica_id_fkey');
        });
    }
};
