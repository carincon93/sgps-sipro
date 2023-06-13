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
        Schema::table('equipos_ambiente_modernizacion', function (Blueprint $table) {
            $table->foreign(['ambiente_modernizacion_id'], 'ambiente_modernizacion_id_fkey')->references(['id'])->on('ambientes_modernizacion')->onUpdate('CASCADE')->onDelete('CASCADE');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('equipos_ambiente_modernizacion', function (Blueprint $table) {
            $table->dropForeign('ambiente_modernizacion_id_fkey');
        });
    }
};
