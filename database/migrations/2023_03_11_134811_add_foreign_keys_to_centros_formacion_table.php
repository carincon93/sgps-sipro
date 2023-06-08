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
        Schema::table('centros_formacion', function (Blueprint $table) {
            $table->foreign(['dinamizador_sennova_id'], 'dinamizador_sennova_id_fkey')->references(['id'])->on('users')->onUpdate('CASCADE')->onDelete('SET NULL');
            $table->foreign(['regional_id'], 'regional_id_fkey')->references(['id'])->on('regionales')->onUpdate('CASCADE')->onDelete('CASCADE');
            $table->foreign(['subdirector_id'], 'subdirector_id_fkey')->references(['id'])->on('users')->onUpdate('CASCADE')->onDelete('SET NULL');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('centros_formacion', function (Blueprint $table) {
            $table->dropForeign('dinamizador_sennova_id_fkey');
            $table->dropForeign('regional_id_fkey');
            $table->dropForeign('subdirector_id_fkey');
        });
    }
};
