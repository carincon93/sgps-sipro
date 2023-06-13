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
        Schema::table('grupos_investigacion', function (Blueprint $table) {
            $table->foreign(['centro_formacion_id'], 'centro_formacion_id_fkey')->references(['id'])->on('centros_formacion')->onUpdate('CASCADE')->onDelete('CASCADE');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('grupos_investigacion', function (Blueprint $table) {
            $table->dropForeign('centro_formacion_id_fkey');
        });
    }
};
