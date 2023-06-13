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
        Schema::table('convocatoria_presupuesto', function (Blueprint $table) {
            $table->foreign(['convocatoria_id'], 'convocatoria_id_fkey')->references(['id'])->on('convocatorias')->onUpdate('CASCADE')->onDelete('CASCADE');
            $table->foreign(['presupuesto_sennova_id'], 'presupuesto_sennova_id_fkey')->references(['id'])->on('presupuesto_sennova')->onUpdate('CASCADE')->onDelete('CASCADE');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('convocatoria_presupuesto', function (Blueprint $table) {
            $table->dropForeign('convocatoria_id_fkey');
            $table->dropForeign('presupuesto_sennova_id_fkey');
        });
    }
};
