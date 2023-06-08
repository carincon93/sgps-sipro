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
        Schema::table('presupuesto_sennova', function (Blueprint $table) {
            $table->foreign(['linea_programatica_id'], 'linea_programatica_id_fkey')->references(['id'])->on('lineas_programaticas')->onUpdate('CASCADE')->onDelete('CASCADE');
            $table->foreign(['primer_grupo_presupuestal_id'], 'primer_grupo_presupuestal_id_fkey')->references(['id'])->on('primer_grupo_presupuestal')->onUpdate('CASCADE')->onDelete('CASCADE');
            $table->foreign(['segundo_grupo_presupuestal_id'], 'segundo_grupo_presupuestal_id_fkey')->references(['id'])->on('segundo_grupo_presupuestal')->onUpdate('CASCADE')->onDelete('CASCADE');
            $table->foreign(['tercer_grupo_presupuestal_id'], 'tercer_grupo_presupuestal_id_fkey')->references(['id'])->on('tercer_grupo_presupuestal')->onUpdate('CASCADE')->onDelete('CASCADE');
            $table->foreign(['uso_presupuestal_id'], 'uso_presupuestal_id_fkey')->references(['id'])->on('usos_presupuestales')->onUpdate('CASCADE')->onDelete('CASCADE');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('presupuesto_sennova', function (Blueprint $table) {
            $table->dropForeign('linea_programatica_id_fkey');
            $table->dropForeign('primer_grupo_presupuestal_id_fkey');
            $table->dropForeign('segundo_grupo_presupuestal_id_fkey');
            $table->dropForeign('tercer_grupo_presupuestal_id_fkey');
            $table->dropForeign('uso_presupuestal_id_fkey');
        });
    }
};
