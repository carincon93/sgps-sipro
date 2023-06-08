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
        Schema::table('talentos_otros_departamentos', function (Blueprint $table) {
            $table->foreign(['regional_id'], 'regiona_id_fkey')->references(['id'])->on('regionales')->onUpdate('CASCADE')->onDelete('CASCADE');
            $table->foreign(['tp_id'], 'tp_id_fkey')->references(['id'])->on('tp')->onUpdate('CASCADE')->onDelete('CASCADE');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('talentos_otros_departamentos', function (Blueprint $table) {
            $table->dropForeign('regiona_id_fkey');
            $table->dropForeign('tp_id_fkey');
        });
    }
};
