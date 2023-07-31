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
        Schema::table('servicios_tecnologicos', function (Blueprint $table) {
            $table->foreign(['estado_sistema_gestion_id'], 'estado_sistema_gestion_id_fkey')->references(['id'])->on('estados_sistema_gestion')->onUpdate('CASCADE')->onDelete('CASCADE');
            $table->foreign(['id'], 'servicios_tecnologicos_id_fkey')->references(['id'])->on('proyectos')->onUpdate('CASCADE')->onDelete('CASCADE');
            $table->foreign(['tipo_proyecto_linea_68_id'], 'tipo_proyecto_linea_68_id_fkey')->references(['id'])->on('tipos_proyecto_linea_68')->onUpdate('CASCADE')->onDelete('CASCADE');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('servicios_tecnologicos', function (Blueprint $table) {
            $table->dropForeign('estado_sistema_gestion_id_fkey');
            $table->dropForeign('servicios_tecnologicos_id_fkey');
            $table->dropForeign('tipo_proyecto_linea_68_id_fkey');
        });
    }
};
