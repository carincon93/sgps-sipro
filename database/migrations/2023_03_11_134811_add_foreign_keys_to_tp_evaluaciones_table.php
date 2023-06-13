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
        Schema::table('tp_evaluaciones', function (Blueprint $table) {
            $table->foreign(['id'], 'tp_evaluaciones_id_fkey')->references(['id'])->on('evaluaciones')->onUpdate('CASCADE')->onDelete('CASCADE');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('tp_evaluaciones', function (Blueprint $table) {
            $table->dropForeign('tp_evaluaciones_id_fkey');
        });
    }
};
