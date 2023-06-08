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
        Schema::table('ambiente_modernizacion_semillero_investigacion', function (Blueprint $table) {
            $table->foreign(['ambiente_modernizacion_id'], 'ambiente_modernizacion_semillero_investigacion_fk')->references(['id'])->on('ambientes_modernizacion')->onUpdate('CASCADE')->onDelete('CASCADE');
            $table->foreign(['semillero_investigacion_id'], 'ambiente_modernizacion_semillero_investigacion_fk_1')->references(['id'])->on('semilleros_investigacion')->onUpdate('CASCADE')->onDelete('CASCADE');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('ambiente_modernizacion_semillero_investigacion', function (Blueprint $table) {
            $table->dropForeign('ambiente_modernizacion_semillero_investigacion_fk');
            $table->dropForeign('ambiente_modernizacion_semillero_investigacion_fk_1');
        });
    }
};
