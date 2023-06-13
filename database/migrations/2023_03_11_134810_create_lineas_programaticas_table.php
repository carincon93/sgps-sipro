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
        Schema::create('lineas_programaticas', function (Blueprint $table) {
            $table->increments('id');

            $table->string('nombre', 191);
            $table->string('codigo');
            $table->text('descripcion');

            $table->timestamps();

            $table->char('categoria_proyecto', 1);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('lineas_programaticas');
    }
};
