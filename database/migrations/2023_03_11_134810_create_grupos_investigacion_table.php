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
        Schema::create('grupos_investigacion', function (Blueprint $table) {
            $table->increments('id');

            $table->string('nombre', 191);
            $table->string('acronimo', 191);
            $table->string('email', 191)->unique();
            $table->text('enlace_gruplac');
            $table->string('codigo_minciencias', 10)->unique();
            $table->string('categoria_minciencias', 16);
            $table->text('mision')->nullable();
            $table->text('vision')->nullable();
            $table->date('fecha_creacion_grupo')->nullable();
            $table->string('nombre_lider_grupo', 191)->nullable();
            $table->string('email_contacto', 191)->nullable();
            $table->string('programa_nal_ctei_principal', 191)->nullable();
            $table->string('programa_nal_ctei_secundaria', 191)->nullable();
            $table->text('reconocimientos_grupo_investigacion')->nullable();
            $table->text('objetivo_general')->nullable();
            $table->text('objetivos_especificos')->nullable();
            $table->text('link_propio_grupo')->nullable();
            $table->text('formato_gic_f_020')->nullable();
            $table->text('formato_gic_f_032')->nullable();

            $table->integer('centro_formacion_id');
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
        Schema::dropIfExists('grupos_investigacion');
    }
};
