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
        Schema::table('ta_tp_viaticos_municipios', function (Blueprint $table) {
            $table->foreign(['municipio_id'], 'municipio_id_fkey')->references(['id'])->on('municipios')->onUpdate('CASCADE')->onDelete('CASCADE');
            $table->foreign(['proyecto_presupuesto_id'], 'proyecto_presupuesto_id_fkey')->references(['id'])->on('proyecto_presupuesto')->onUpdate('CASCADE')->onDelete('CASCADE');
            $table->foreign(['proyecto_rol_sennova_id'], 'proyecto_rol_sennova_id_fkey')->references(['id'])->on('proyecto_rol_sennova')->onUpdate('CASCADE')->onDelete('CASCADE');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('ta_tp_viaticos_municipios', function (Blueprint $table) {
            $table->dropForeign('municipio_id_fkey');
            $table->dropForeign('proyecto_presupuesto_id_fkey');
            $table->dropForeign('proyecto_rol_sennova_id_fkey');
        });
    }
};
