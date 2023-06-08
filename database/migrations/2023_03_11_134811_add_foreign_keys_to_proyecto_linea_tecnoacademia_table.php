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
        Schema::table('proyecto_linea_tecnoacademia', function (Blueprint $table) {
            $table->foreign(['proyecto_id'], 'proyecto_id_fkey')->references(['id'])->on('proyectos')->onUpdate('CASCADE')->onDelete('CASCADE');
            $table->foreign(['tecnoacademia_linea_tecnoacademia_id'], 'tecnoacademia_linea_tecnoacademia_id_fkey')->references(['id'])->on('tecnoacademia_linea_tecnoacademia')->onUpdate('CASCADE')->onDelete('CASCADE');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('proyecto_linea_tecnoacademia', function (Blueprint $table) {
            $table->dropForeign('proyecto_id_fkey');
            $table->dropForeign('tecnoacademia_linea_tecnoacademia_id_fkey');
        });
    }
};
