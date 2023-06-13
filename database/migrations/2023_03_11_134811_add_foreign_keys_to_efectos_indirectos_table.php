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
        Schema::table('efectos_indirectos', function (Blueprint $table) {
            $table->foreign(['efecto_directo_id'], 'efecto_directo_id_fkey')->references(['id'])->on('efectos_directos')->onUpdate('CASCADE')->onDelete('CASCADE');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('efectos_indirectos', function (Blueprint $table) {
            $table->dropForeign('efecto_directo_id_fkey');
        });
    }
};
