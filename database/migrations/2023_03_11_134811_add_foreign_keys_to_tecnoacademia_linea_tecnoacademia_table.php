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
        Schema::table('tecnoacademia_linea_tecnoacademia', function (Blueprint $table) {
            $table->foreign(['linea_tecnoacademia_id'], 'linea_tecnoacademia_id_fkey')->references(['id'])->on('lineas_tecnoacademia')->onUpdate('CASCADE')->onDelete('CASCADE');
            $table->foreign(['tecnoacademia_id'], 'tecnoacademia_id_fkey')->references(['id'])->on('tecnoacademias')->onUpdate('CASCADE')->onDelete('CASCADE');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('tecnoacademia_linea_tecnoacademia', function (Blueprint $table) {
            $table->dropForeign('linea_tecnoacademia_id_fkey');
            $table->dropForeign('tecnoacademia_id_fkey');
        });
    }
};
