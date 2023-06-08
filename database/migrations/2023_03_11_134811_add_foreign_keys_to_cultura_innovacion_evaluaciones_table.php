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
        Schema::table('cultura_innovacion_evaluaciones', function (Blueprint $table) {
            $table->foreign(['id'], 'cultura_innovacion_evaluaciones_id_fkey')->references(['id'])->on('evaluaciones')->onUpdate('CASCADE')->onDelete('CASCADE');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('cultura_innovacion_evaluaciones', function (Blueprint $table) {
            $table->dropForeign('cultura_innovacion_evaluaciones_id_fkey');
        });
    }
};
