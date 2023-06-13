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
        Schema::create('proyectos', function (Blueprint $table) {
            $table->increments('id');

            $table->boolean('finalizado')->default(false);
            $table->json('estado')->nullable();
            $table->integer('centro_formacion_id')->nullable();
            $table->integer('convocatoria_id')->default(3);
            $table->boolean('modificable')->default(true);
            $table->boolean('habilitado_para_evaluar')->default(false);
            $table->integer('linea_programatica_id');
            $table->boolean('radicado')->default(false);
            $table->boolean('estructuracion_proyectos')->nullable()->default(false);
            $table->decimal('precio_proyecto', 14, 0)->default(0);
            $table->boolean('mostrar_recomendaciones')->nullable()->default(false);
            $table->json('estado_cord_sennova')->nullable();
            $table->boolean('mostrar_requiere_subsanacion')->nullable()->default(false);
            $table->boolean('en_evaluacion')->default(false);
            $table->boolean('arboles_completos')->default(false);

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
        Schema::dropIfExists('proyectos');
    }
};
