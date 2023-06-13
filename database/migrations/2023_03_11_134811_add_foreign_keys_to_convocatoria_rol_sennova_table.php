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
        Schema::table('convocatoria_rol_sennova', function (Blueprint $table) {
            $table->foreign(['convocatoria_id'], 'convocatoria_id_fkey')->references(['id'])->on('convocatorias')->onUpdate('CASCADE')->onDelete('CASCADE');
            $table->foreign(['linea_programatica_id'], 'linea_programatica_id_fkey')->references(['id'])->on('lineas_programaticas')->onUpdate('CASCADE')->onDelete('CASCADE');
            $table->foreign(['rol_sennova_id'], 'rol_sennova_id_fkey')->references(['id'])->on('roles_sennova')->onUpdate('CASCADE')->onDelete('CASCADE');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('convocatoria_rol_sennova', function (Blueprint $table) {
            $table->dropForeign('convocatoria_id_fkey');
            $table->dropForeign('linea_programatica_id_fkey');
            $table->dropForeign('rol_sennova_id_fkey');
        });
    }
};
