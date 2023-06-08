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
        Schema::create('primer_grupo_presupuestal', function (Blueprint $table) {
            $table->increments('id');

            $table->text('nombre');
            $table->char('cta');
            $table->string('bpin', 20);

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
        Schema::dropIfExists('primer_grupo_presupuestal');
    }
};
