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
        Schema::table('disciplinas_subarea_conocimiento', function (Blueprint $table) {
            $table->foreign(['subarea_conocimiento_id'], 'subarea_conocimiento_id_fkey')->references(['id'])->on('subareas_conocimiento')->onUpdate('CASCADE')->onDelete('CASCADE');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('disciplinas_subarea_conocimiento', function (Blueprint $table) {
            $table->dropForeign('subarea_conocimiento_id_fkey');
        });
    }
};
