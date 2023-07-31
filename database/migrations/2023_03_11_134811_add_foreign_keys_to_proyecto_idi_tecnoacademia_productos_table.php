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
        Schema::table('proyecto_idi_tecnoacademia_productos', function (Blueprint $table) {
            $table->foreign(['proyecto_idi_tecnoacademia_id'], 'proyecto_idi_tecnoacademia_id_fkey')->references(['id'])->on('proyectos_idi_tecnoacademia')->onUpdate('CASCADE')->onDelete('CASCADE');
            $table->foreign(['tipo_productos_linea_66_id'], 'tipo_productos_linea_66_id_fkey')->references(['id'])->on('tipos_productos_linea_66')->onUpdate('CASCADE')->onDelete('CASCADE');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('proyecto_idi_tecnoacademia_productos', function (Blueprint $table) {
            $table->dropForeign('proyecto_idi_tecnoacademia_id_fkey');
            $table->dropForeign('tipo_productos_linea_66_id_fkey');
        });
    }
};
