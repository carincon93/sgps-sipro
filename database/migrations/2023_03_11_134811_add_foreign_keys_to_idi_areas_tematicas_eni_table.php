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
        Schema::table('idi_areas_tematicas_eni', function (Blueprint $table) {
            $table->foreign(['area_tematica_eni_id'], 'area_tematica_eni_id_fkey')->references(['id'])->on('areas_tematicas_eni')->onUpdate('CASCADE')->onDelete('CASCADE');
            $table->foreign(['idi_id'], 'idi_id_fkey')->references(['id'])->on('idi')->onUpdate('CASCADE')->onDelete('CASCADE');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('idi_areas_tematicas_eni', function (Blueprint $table) {
            $table->dropForeign('area_tematica_eni_id_fkey');
            $table->dropForeign('idi_id_fkey');
        });
    }
};
