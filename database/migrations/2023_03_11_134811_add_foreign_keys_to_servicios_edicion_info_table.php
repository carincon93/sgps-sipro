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
        Schema::table('servicios_edicion_info', function (Blueprint $table) {
            $table->foreign(['proyecto_presupuesto_id'], 'proyecto_presupuesto_id_foreign')->references(['id'])->on('proyecto_presupuesto')->onUpdate('CASCADE')->onDelete('CASCADE');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('servicios_edicion_info', function (Blueprint $table) {
            $table->dropForeign('proyecto_presupuesto_id_foreign');
        });
    }
};
