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
        Schema::table('anexo_lineas_programaticas', function (Blueprint $table) {
            $table->foreign(['anexo_id'], 'anexo_id_fkey')->references(['id'])->on('anexos')->onUpdate('CASCADE')->onDelete('CASCADE');
            $table->foreign(['linea_programatica_id'], 'linea_programatica_id_fkey')->references(['id'])->on('lineas_programaticas')->onUpdate('CASCADE')->onDelete('CASCADE');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('anexo_lineas_programaticas', function (Blueprint $table) {
            $table->dropForeign('anexo_id_fkey');
            $table->dropForeign('linea_programatica_id_fkey');
        });
    }
};
