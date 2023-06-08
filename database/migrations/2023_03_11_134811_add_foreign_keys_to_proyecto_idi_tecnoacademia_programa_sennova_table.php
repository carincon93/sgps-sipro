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
        Schema::table('proyecto_idi_tecnoacademia_programa_sennova', function (Blueprint $table) {
            $table->foreign(['programa_sennova_id'], 'programa_sennova_id_fkey')->references(['id'])->on('programas_sennova')->onUpdate('CASCADE')->onDelete('CASCADE');
            $table->foreign(['proyecto_idi_tecnoacademia_id'], 'proyecto_idi_tecnoacademia_id_fkey')->references(['id'])->on('proyectos_idi_tecnoacademia')->onUpdate('CASCADE')->onDelete('CASCADE');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('proyecto_idi_tecnoacademia_programa_sennova', function (Blueprint $table) {
            $table->dropForeign('programa_sennova_id_fkey');
            $table->dropForeign('proyecto_idi_tecnoacademia_id_fkey');
        });
    }
};
