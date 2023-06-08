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
        Schema::table('semillero_investigacion_red_conocimiento', function (Blueprint $table) {
            $table->foreign(['red_conocimiento_id'], 'red_conocimiento_id_fkey')->references(['id'])->on('redes_conocimiento')->onUpdate('CASCADE')->onDelete('CASCADE');
            $table->foreign(['semillero_investigacion_id'], 'semillero_investigacion_id_fkey')->references(['id'])->on('semilleros_investigacion')->onUpdate('CASCADE')->onDelete('CASCADE');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('semillero_investigacion_red_conocimiento', function (Blueprint $table) {
            $table->dropForeign('red_conocimiento_id_fkey');
            $table->dropForeign('semillero_investigacion_id_fkey');
        });
    }
};
