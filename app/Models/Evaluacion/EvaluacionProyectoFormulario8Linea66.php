<?php

namespace App\Models\Evaluacion;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EvaluacionProyectoFormulario8Linea66 extends Model
{
    use HasFactory;

    /**
     * table
     *
     * @var string
     */
    protected $table = 'evaluaciones_proyectos_formulario_8_linea_66';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'titulo_puntaje',
        'titulo_comentario',
        'video_puntaje',
        'video_comentario',
        'resumen_puntaje',
        'resumen_comentario',
        'problema_central_puntaje',
        'problema_central_comentario',
        'objetivos_puntaje',
        'objetivos_comentario',
        'metodologia_puntaje',
        'metodologia_comentario',
        'entidad_aliada_puntaje',
        'entidad_aliada_comentario',
        'resultados_puntaje',
        'resultados_comentario',
        'productos_puntaje',
        'productos_comentario',
        'cadena_valor_puntaje',
        'cadena_valor_comentario',
        'analisis_riesgos_puntaje',
        'analisis_riesgos_comentario',
        'ortografia_puntaje',
        'ortografia_comentario',
        'redaccion_puntaje',
        'redaccion_comentario',
        'normas_apa_puntaje',
        'normas_apa_comentario',

        'justificacion_economia_naranja_requiere_comentario',
        'justificacion_economia_naranja_comentario',

        'justificacion_industria_4_requiere_comentario',
        'justificacion_industria_4_comentario',

        'bibliografia_requiere_comentario',
        'bibliografia_comentario',

        'fechas_requiere_comentario',
        'fechas_comentario',

        'justificacion_politica_discapacidad_requiere_comentario',
        'justificacion_politica_discapacidad_comentario',

        'actividad_economica_requiere_comentario',
        'actividad_economica_comentario',

        'disciplina_subarea_conocimiento_requiere_comentario',
        'disciplina_subarea_conocimiento_comentario',

        'red_conocimiento_requiere_comentario',
        'red_conocimiento_comentario',

        'tematica_estrategica_requiere_comentario',
        'tematica_estrategica_comentario',

        'impacto_sector_agricola_comentario',
        'impacto_poblacion_campesina_comentario'
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
    public function scopeFilterEvaluacionProyectoFormulario8Linea66($query, array $filters)
    {
        $query->when($filters['search'] ?? null, function ($query, $search) {
            $search = str_replace('"', "", $search);
            $search = str_replace("'", "", $search);
            $search = str_replace(' ', '%%', $search);
            $query->whereRaw("unaccent(titulo) ilike unaccent('%" . $search . "%')");
        });
    }
}
