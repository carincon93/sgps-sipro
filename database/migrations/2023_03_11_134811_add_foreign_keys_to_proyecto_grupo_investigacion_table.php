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
        Schema::table('proyecto_grupo_investigacion', function (Blueprint $table) {
            $table->foreign(['grupo_investigacion_id'], 'grupo_investigacion_id_fkey')->references(['id'])->on('grupos_investigacion')->onUpdate('CASCADE')->onDelete('CASCADE');
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
        Schema::table('proyecto_grupo_investigacion', function (Blueprint $table) {
            $table->dropForeign('grupo_investigacion_id_fkey');
            $table->dropForeign('proyecto_id_fkey');
        });
    }
};
