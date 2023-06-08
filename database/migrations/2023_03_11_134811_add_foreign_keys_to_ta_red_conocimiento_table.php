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
        Schema::table('ta_red_conocimiento', function (Blueprint $table) {
            $table->foreign(['red_conocimiento_id'], 'red_conocimiento_id_fkey')->references(['id'])->on('redes_conocimiento')->onUpdate('CASCADE')->onDelete('CASCADE');
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
        Schema::table('ta_red_conocimiento', function (Blueprint $table) {
            $table->dropForeign('red_conocimiento_id_fkey');
            $table->dropForeign('ta_id_fkey');
        });
    }
};
