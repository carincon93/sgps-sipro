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
        Schema::table('productos_linea_66', function (Blueprint $table) {
            $table->foreign(['producto_id'], 'producto_id_fkey')->references(['id'])->on('productos')->onUpdate('CASCADE')->onDelete('CASCADE');
            $table->foreign(['subtipologia_minciencias_id'], 'subtipologia_minciencias_id_fkey')->references(['id'])->on('subtipologias_minciencias')->onUpdate('CASCADE')->onDelete('CASCADE');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('productos_linea_66', function (Blueprint $table) {
            $table->dropForeign('producto_id_fkey');
            $table->dropForeign('subtipologia_minciencias_id_fkey');
        });
    }
};
