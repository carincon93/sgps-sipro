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
        Schema::create('proyecto_pdf_versiones', function (Blueprint $table) {
            $table->increments('id');

            $table->string('version');
            $table->char('estado')->default(0);

            $table->bigInteger('proyecto_id')->index('fk_proyecto_pdf_versiones_proyecto_id_foreign');
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
        Schema::dropIfExists('proyecto_pdf_versiones');
    }
};
