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
        Schema::table('ambiente_modernizacion_programa_formacion', function (Blueprint $table) {
            $table->foreign(['ambiente_modernizacion_id'], 'ambiente_modernizacion_id_fk')->references(['id'])->on('ambientes_modernizacion')->onUpdate('CASCADE')->onDelete('CASCADE');
            $table->foreign(['programa_formacion_id'], 'programa_formacion_id_fk')->references(['id'])->on('programas_formacion')->onUpdate('CASCADE')->onDelete('CASCADE');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('ambiente_modernizacion_programa_formacion', function (Blueprint $table) {
            $table->dropForeign('ambiente_modernizacion_id_fk');
            $table->dropForeign('programa_formacion_id_fk');
        });
    }
};
