<?php

namespace App\Models\Evaluacion;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EvaluacionProyectoFormulario12Linea68 extends Model
{
    use HasFactory;

    /**
     * table
     *
     * @var string
     */
    protected $table = 'evaluaciones_proyectos_formulario_12_linea_68';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'titulo_comentario',
        'titulo_puntaje',
        'resumen_comentario',
        'resumen_puntaje',
        'antecedentes_comentario',
        'antecedentes_puntaje',

        'justificacion_problema_comentario',
        'justificacion_problema_puntaje',
        'pregunta_formulacion_problema_comentario',
        'pregunta_formulacion_problema_puntaje',
        'fecha_ejecucion_comentario',
        'propuesta_sostenibilidad_comentario',
        'propuesta_sostenibilidad_puntaje',
        'identificacion_problema_comentario',
        'identificacion_problema_puntaje',
        'arbol_problemas_puntaje',
        'arbol_problemas_comentario',
        'video_comentario',
        'especificaciones_area_comentario',

        'ortografia_comentario',
        'redaccion_comentario',
        'normas_apa_comentario',
        'arbol_objetivos_comentario',
        'impacto_ambiental_puntaje',
        'impacto_ambiental_comentario',
        'impacto_social_centro_puntaje',
        'impacto_social_centro_comentario',
        'impacto_social_productivo_puntaje',
        'impacto_social_productivo_comentario',
        'impacto_tecnologico_puntaje',
        'impacto_tecnologico_comentario',

        'riesgos_objetivo_general_comentario',
        'riesgos_productos_comentario',
        'riesgos_actividades_comentario',

        'objetivo_general_puntaje',
        'objetivo_general_comentario',

        'primer_objetivo_puntaje',
        'primer_objetivo_comentario',
        'segundo_objetivo_puntaje',
        'segundo_objetivo_comentario',
        'tercer_objetivo_puntaje',
        'tercer_objetivo_comentario',
        'cuarto_objetivo_puntaje',
        'cuarto_objetivo_comentario',

        'resultados_primer_obj_puntaje',
        'resultados_primer_obj_comentario',
        'resultados_segundo_obj_puntaje',
        'resultados_segundo_obj_comentario',
        'resultados_tercer_obj_puntaje',
        'resultados_tercer_obj_comentario',
        'resultados_cuarto_obj_puntaje',
        'resultados_cuarto_obj_comentario',

        'metodologia_puntaje',
        'metodologia_comentario',

        'actividades_primer_obj_puntaje',
        'actividades_primer_obj_comentario',
        'actividades_segundo_obj_puntaje',
        'actividades_segundo_obj_comentario',
        'actividades_tercer_obj_puntaje',
        'actividades_tercer_obj_comentario',
        'actividades_cuarto_obj_puntaje',
        'actividades_cuarto_obj_comentario',

        'productos_primer_obj_puntaje',
        'productos_primer_obj_comentario',
        'productos_segundo_obj_puntaje',
        'productos_segundo_obj_comentario',
        'productos_tercer_obj_puntaje',
        'productos_tercer_obj_comentario',
        'productos_cuarto_obj_puntaje',
        'productos_cuarto_obj_comentario',

        'cadena_valor_comentario',
        'bibliografia_comentario',

        'anexos_comentario',

        'inventario_equipos_comentario'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        //
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        //
    ];

    /**
     * Relationship with Evaluacion
     *
     * @return object
     */
    public function evaluacion()
    {
        return $this->belongsTo(Evaluacion::class, 'id');
    }

    /**
     * Filtrar registros
     *
     * @param  mixed $query
     * @param  mixed $filters
     * @return void
     */
    public function scopeFilterEvaluacionProyectoFormulario12Linea68($query, array $filters)
    {
        $query->when($filters['search'] ?? null, function ($query, $search) {
            $search = str_replace('"', "", $search);
            $search = str_replace("'", "", $search);
            $search = str_replace(' ', '%%', $search);
            $query->whereRaw("unaccent(titulo) ilike unaccent('%" . $search . "%')");
        });
    }
}
