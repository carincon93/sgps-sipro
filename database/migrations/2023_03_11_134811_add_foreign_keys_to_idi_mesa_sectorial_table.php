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
        Schema::table('idi_mesa_sectorial', function (Blueprint $table) {
            $table->foreign(['idi_id'], 'idi_fkey')->references(['id'])->on('idi')->onUpdate('CASCADE')->onDelete('CASCADE');
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
        Schema::table('idi_mesa_sectorial', function (Blueprint $table) {
            $table->dropForeign('idi_fkey');
            $table->dropForeign('mesa_sectorial_id_fkey');
        });
    }
};
