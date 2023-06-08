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
        Schema::table('proyecto_presupuesto', function (Blueprint $table) {
            $table->foreign(['convocatoria_presupuesto_id'], 'convocatoria_presupuesto_id_fkey')->references(['id'])->on('convocatoria_presupuesto')->onUpdate('CASCADE')->onDelete('CASCADE');
            $table->foreign(['proyecto_id'], 'proyecto_id_fkey')->references(['id'])->on('proyectos')->onUpdate('CASCADE')->onDelete('CASCADE');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('proyecto_presupuesto', function (Blueprint $table) {
            $table->dropForeign('convocatoria_presupuesto_id_fkey');
            $table->dropForeign('proyecto_id_fkey');
        });
    }
};
