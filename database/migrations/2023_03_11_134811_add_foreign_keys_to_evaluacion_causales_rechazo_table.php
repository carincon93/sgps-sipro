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
        Schema::table('evaluacion_causales_rechazo', function (Blueprint $table) {
            $table->foreign(['evaluacion_id'], 'evaluacion_id_fkey')->references(['id'])->on('evaluaciones')->onUpdate('CASCADE')->onDelete('CASCADE');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('evaluacion_causales_rechazo', function (Blueprint $table) {
            $table->dropForeign('evaluacion_id_fkey');
        });
    }
};
