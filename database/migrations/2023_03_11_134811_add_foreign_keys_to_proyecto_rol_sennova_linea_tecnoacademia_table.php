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
        Schema::table('proyecto_rol_sennova_linea_tecnoacademia', function (Blueprint $table) {
            $table->foreign(['linea_tecnoacademia_id'], 'linea_tecnoacademia_id_fkey')->references(['id'])->on('lineas_tecnoacademia')->onUpdate('CASCADE')->onDelete('CASCADE');
            $table->foreign(['proyecto_rol_sennova_id'], 'proyecto_rol_sennova_id_fkey')->references(['id'])->on('proyecto_rol_sennova')->onUpdate('CASCADE')->onDelete('CASCADE');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('proyecto_rol_sennova_linea_tecnoacademia', function (Blueprint $table) {
            $table->dropForeign('linea_tecnoacademia_id_fkey');
            $table->dropForeign('proyecto_rol_sennova_id_fkey');
        });
    }
};
