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
        Schema::table('proyectos_idi_tecnoacademia', function (Blueprint $table) {
            $table->foreign(['proyecto_id'], 'proyecto_id_fkey')->references(['id'])->on('proyectos')->onUpdate('CASCADE')->onDelete('CASCADE');
            $table->foreign(['semillero_investigacion_id'], 'semillero_investigacion_id_fkey')->references(['id'])->on('semilleros_investigacion')->onUpdate('CASCADE')->onDelete('CASCADE');
            $table->foreign(['tecnoacademia_id'], 'tecnoacademia_id_fkey')->references(['id'])->on('tecnoacademias')->onUpdate('CASCADE')->onDelete('CASCADE');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('proyectos_idi_tecnoacademia', function (Blueprint $table) {
            $table->dropForeign('proyecto_id_fkey');
            $table->dropForeign('semillero_investigacion_id_fkey');
            $table->dropForeign('tecnoacademia_id_fkey');
        });
    }
};
