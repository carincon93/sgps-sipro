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
        Schema::create('proyecto_idi_tecnoacademia_beneficiados', function (Blueprint $table) {
            $table->increments('id');

            $table->char('beneficiado');

            $table->integer('proyecto_idi_tecnoacademia_id');
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
        Schema::dropIfExists('proyecto_idi_tecnoacademia_beneficiados');
    }
};
