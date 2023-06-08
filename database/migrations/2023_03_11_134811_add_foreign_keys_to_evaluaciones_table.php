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
        Schema::table('evaluaciones', function (Blueprint $table) {
            $table->foreign(['convocatoria_id'], 'convocatoria_id_fkey')->references(['id'])->on('convocatorias')->onUpdate('CASCADE')->onDelete('CASCADE');
            $table->foreign(['proyecto_id'], 'proyecto_id_fkey')->references(['id'])->on('proyectos')->onUpdate('CASCADE')->onDelete('CASCADE');
            $table->foreign(['user_id'], 'user_id_fkey')->references(['id'])->on('users')->onUpdate('CASCADE')->onDelete('CASCADE');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('evaluaciones', function (Blueprint $table) {
            $table->dropForeign('convocatoria_id_fkey');
            $table->dropForeign('proyecto_id_fkey');
            $table->dropForeign('user_id_fkey');
        });
    }
};
