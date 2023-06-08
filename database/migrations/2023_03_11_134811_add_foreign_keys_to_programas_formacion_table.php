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
        Schema::table('programas_formacion', function (Blueprint $table) {
            $table->foreign(['centro_formacion_id'], 'centro_formacion_id_fkey')->references(['id'])->on('centros_formacion')->onUpdate('CASCADE')->onDelete('CASCADE');
            $table->foreign(['red_conocimiento_id'], 'red_conocimiento_id_fkey')->references(['id'])->on('redes_conocimiento')->onUpdate('CASCADE')->onDelete('CASCADE');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('programas_formacion', function (Blueprint $table) {
            $table->dropForeign('centro_formacion_id_fkey');
            $table->dropForeign('red_conocimiento_id_fkey');
        });
    }
};
