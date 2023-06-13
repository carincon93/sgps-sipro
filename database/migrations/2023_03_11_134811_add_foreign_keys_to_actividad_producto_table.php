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
        Schema::table('actividad_producto', function (Blueprint $table) {
            $table->foreign(['actividad_id'], 'actividad_id_fkey')->references(['id'])->on('actividades')->onUpdate('CASCADE')->onDelete('CASCADE');
            $table->foreign(['producto_id'], 'producto_id_fkey')->references(['id'])->on('productos')->onUpdate('CASCADE')->onDelete('CASCADE');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('actividad_producto', function (Blueprint $table) {
            $table->dropForeign('actividad_id_fkey');
            $table->dropForeign('producto_id_fkey');
        });
    }
};
