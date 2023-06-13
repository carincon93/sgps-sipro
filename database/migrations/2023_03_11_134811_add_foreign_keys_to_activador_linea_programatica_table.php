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
        Schema::table('activador_linea_programatica', function (Blueprint $table) {
            $table->foreign(['activador_id'], 'activador_id_fkey')->references(['id'])->on('users')->onUpdate('CASCADE')->onDelete('CASCADE');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('activador_linea_programatica', function (Blueprint $table) {
            $table->dropForeign('activador_id_fkey');
        });
    }
};
