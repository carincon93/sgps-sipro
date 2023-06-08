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
        Schema::create('semilleros_investigacion', function (Blueprint $table) {
            $table->increments('id');

            $table->string('nombre', 191);
            $table->string('codigo', 191)->nullable();
            $table->date('fecha_creacion_semillero')->nullable();
            $table->string('nombre_lider_semillero', 191)->nullable();
            $table->string('email_contacto', 191)->nullable();
            $table->text('reconocimientos_semillero_investigacion')->nullable();
            $table->text('vision')->nullable();
            $table->text('mision')->nullable();
            $table->text('objetivo_general')->nullable();
            $table->text('objetivos_especificos')->nullable();
            $table->text('link_semillero')->nullable();
            $table->text('formato_gic_f_021')->nullable();
            $table->text('formato_gic_f_032')->nullable();
            $table->text('formato_aval_semillero')->nullable();
            $table->boolean('es_semillero_tecnoacademia')->nullable();

            $table->integer('linea_investigacion_id');
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
        Schema::dropIfExists('semilleros_investigacion');
    }
};
