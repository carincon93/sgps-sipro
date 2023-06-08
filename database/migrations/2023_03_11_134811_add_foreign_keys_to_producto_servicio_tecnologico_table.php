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
        Schema::table('producto_servicio_tecnologico', function (Blueprint $table) {
            $table->foreign(['producto_id'], 'producto_id')->references(['id'])->on('productos')->onUpdate('CASCADE')->onDelete('CASCADE');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('producto_servicio_tecnologico', function (Blueprint $table) {
            $table->dropForeign('producto_id');
        });
    }
};
