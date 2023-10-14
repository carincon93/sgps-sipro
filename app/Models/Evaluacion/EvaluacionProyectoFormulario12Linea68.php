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
        'objetivo_general_comentario',
        'fecha_ejecucion_comentario',
        'propuesta_sostenibilidad_comentario',
        'propuesta_sostenibilidad_puntaje',
        'identificacion_problema_comentario',
        'identificacion_problema_puntaje',
        'video_comentario',
        'especificaciones_area_comentario',
        'ortografia_comentario',
        'redaccion_comentario',
        'normas_apa_comentario',
        'arbol_problemas_comentario',
        'arbol_problemas_puntaje',
        'impacto_ambiental_puntaje',
        'impacto_ambiental_comentario',
        'impacto_social_centro_puntaje',
        'impacto_social_centro_comentario',
        'impacto_social_productivo_puntaje',
        'impacto_social_productivo_comentario',
        'impacto_tecnologico_puntaje',
        'impacto_tecnologico_comentario',
        'riesgos_objetivo_general_puntaje',
        'riesgos_objetivo_general_comentario',
        'riesgos_productos_puntaje',
        'riesgos_productos_comentario',
        'riesgos_actividades_puntaje',
        'riesgos_actividades_comentario',
        'objetivo_general_puntaje',
        'metodologia_puntaje',
        'metodologia_comentario',
        'anexos_comentario',
        'bibliografia_comentario',
        'inventario_equipos_comentario',
        'resultados_comentario',
        'resultados_puntaje',
        'actividades_comentario',
        'actividades_puntaje',
        'productos_comentario',
        'productos_puntaje',
        'objetivos_especificos_comentario',
        'objetivos_especificos_puntaje',
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
