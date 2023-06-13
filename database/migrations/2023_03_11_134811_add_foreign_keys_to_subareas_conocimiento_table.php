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
        Schema::table('subareas_conocimiento', function (Blueprint $table) {
            $table->foreign(['area_conocimiento_id'], 'area_conocimiento_id_fkey')->references(['id'])->on('areas_conocimiento')->onUpdate('CASCADE')->onDelete('CASCADE');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('subareas_conocimiento', function (Blueprint $table) {
            $table->dropForeign('area_conocimiento_id_fkey');
        });
    }
};
