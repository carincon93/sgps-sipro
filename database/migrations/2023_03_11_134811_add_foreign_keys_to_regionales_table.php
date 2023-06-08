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
        Schema::table('regionales', function (Blueprint $table) {
            $table->foreign(['director_regional_id'], 'director_regional_id_fkey')->references(['id'])->on('users')->onUpdate('CASCADE')->onDelete('SET NULL');
            $table->foreign(['region_id'], 'region_id_fkey')->references(['id'])->on('regiones')->onUpdate('CASCADE')->onDelete('CASCADE');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('regionales', function (Blueprint $table) {
            $table->dropForeign('director_regional_id_fkey');
            $table->dropForeign('region_id_fkey');
        });
    }
};
