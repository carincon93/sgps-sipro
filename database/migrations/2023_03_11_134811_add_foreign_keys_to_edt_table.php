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
        Schema::table('edt', function (Blueprint $table) {
            $table->foreign(['proyecto_presupuesto_id'], 'proyecto_presupuesto_id_fkey')->references(['id'])->on('proyecto_presupuesto')->onUpdate('CASCADE')->onDelete('CASCADE');
            $table->foreign(['ta_id'], 'ta_id_fkey')->references(['id'])->on('ta')->onUpdate('CASCADE')->onDelete('CASCADE');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('edt', function (Blueprint $table) {
            $table->dropForeign('proyecto_presupuesto_id_fkey');
            $table->dropForeign('ta_id_fkey');
        });
    }
};
