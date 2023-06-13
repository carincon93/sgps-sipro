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
        Schema::table('tp', function (Blueprint $table) {
            $table->foreign(['id'], 'tp_id_fkey')->references(['id'])->on('proyectos')->onUpdate('CASCADE')->onDelete('CASCADE');
            $table->foreign(['nodo_tecnoparque_id'], 'tp_nodo_tecnoparque_id_fkey')->references(['id'])->on('nodos_tecnoparque')->onUpdate('CASCADE')->onDelete('CASCADE');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('tp', function (Blueprint $table) {
            $table->dropForeign('tp_id_fkey');
            $table->dropForeign('tp_nodo_tecnoparque_id_fkey');
        });
    }
};
