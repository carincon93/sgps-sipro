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
        Schema::create('tecnoacademias', function (Blueprint $table) {
            $table->increments('id');

            $table->string('nombre');
            $table->char('modalidad', 1)->nullable();
            $table->date('fecha_creacion')->nullable();
            $table->text('foco')->nullable();
            $table->integer('centro_formacion_id')->nullable();
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
        Schema::dropIfExists('tecnoacademias');
    }
};
