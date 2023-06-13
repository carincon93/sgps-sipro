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
        Schema::create('software_info', function (Blueprint $table) {
            $table->increments('id');

            $table->char('tipo_licencia', 1);
            $table->char('tipo_software', 1);
            $table->date('fecha_inicio');
            $table->date('fecha_finalizacion')->nullable();

            $table->integer('proyecto_presupuesto_id');
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
        Schema::dropIfExists('software_info');
    }
};
