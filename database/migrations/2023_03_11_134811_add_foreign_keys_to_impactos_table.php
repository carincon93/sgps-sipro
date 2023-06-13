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
        Schema::table('impactos', function (Blueprint $table) {
            $table->foreign(['efecto_indirecto_id'], 'efecto_indirecto_id_fkey')->references(['id'])->on('efectos_indirectos')->onUpdate('CASCADE')->onDelete('CASCADE');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('impactos', function (Blueprint $table) {
            $table->dropForeign('efecto_indirecto_id_fkey');
        });
    }
};
