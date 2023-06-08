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
        Schema::table('objetivos_especificos', function (Blueprint $table) {
            $table->foreign(['causa_directa_id'], 'causa_directa_id_fkey')->references(['id'])->on('causas_directas')->onUpdate('CASCADE')->onDelete('CASCADE');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('objetivos_especificos', function (Blueprint $table) {
            $table->dropForeign('causa_directa_id_fkey');
        });
    }
};
