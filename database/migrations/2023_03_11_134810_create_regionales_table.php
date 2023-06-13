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
        Schema::create('regionales', function (Blueprint $table) {
            $table->increments('id');

            $table->string('nombre', 191)->unique();
            $table->string('codigo')->unique();

            $table->integer('region_id');
            $table->integer('director_regional_id')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('regionales');
    }
};
