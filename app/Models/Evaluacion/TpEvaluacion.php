<?php

namespace App\Models\Evaluacion;

use App\Models\Tp;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class TpEvaluacion extends Model
{
    use HasFactory;

    /**
     * table
     *
     * @var string
     */
    protected $table = 'tp_evaluaciones';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'resumen_regional_comentario',
        'antecedentes_regional_comentario',
        'municipios_comentario',
        'fecha_ejecucion_comentario',
        'cadena_valor_comentario',
        'impacto_centro_formacion_comentario',
        'bibliografia_comentario',
        'retos_oportunidades_comentario',
        'pertinencia_territorio_comentario',
        'metodologia_comentario',
        'analisis_riesgos_comentario',
        'anexos_comentario',
        'productos_comentario',
        'arbol_problemas_comentario',
        'arbol_objetivos_comentario',
        'ortografia_comentario',
        'proyecto_presupuesto_comentario',
        'redaccion_comentario',
        'normas_apa_comentario',
        'articulacion_sennova_comentario'
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
    public function scopeFilterTpEvaluacion($query, array $filters)
    {
        $query->when($filters['search'] ?? null, function ($query, $search) {
            $search = str_replace('"', "", $search);
            $search = str_replace("'", "", $search);
            $search = str_replace(' ', '%%', $search);
            $query->whereRaw("unaccent(resumen) ilike unaccent('%" . $search . "%')");
        });
    }

    /**
     * getProyectosPorEvaluador
     *
     * @param  mixed $convocatoria
     * @return object
     */
    public static function getProyectosPorEvaluador($convocatoria)
    {
        /** @var \App\Models\User */
        $authUser = Auth::user();

        if ($authUser->hasRole(1) || $authUser->hasRole(17)) { // Admin
            $tp = Tp::select('evaluaciones.id as evaluacion_id', 'evaluaciones.habilitado', 'evaluaciones.iniciado', 'evaluaciones.finalizado', 'tp.id', 'tp.nodo_tecnoparque_id', 'tp.fecha_inicio', 'tp.fecha_finalizacion')
                ->join('proyectos', 'tp.id', 'proyectos.id')
                ->join('evaluaciones', 'evaluaciones.proyecto_id', 'proyectos.id')
                ->where('proyectos.convocatoria_id', $convocatoria->id)
                ->distinct()
                ->orderBy('tp.id', 'ASC')
                ->filterTp(request()->only('search'))->paginate();
        } else if ($authUser->hasRole(11)) { // Evaluador
            $tp = Tp::select('evaluaciones.id as evaluacion_id', 'evaluaciones.habilitado', 'evaluaciones.iniciado', 'evaluaciones.finalizado', 'tp.id', 'tp.nodo_tecnoparque_id', 'tp.fecha_inicio', 'tp.fecha_finalizacion')
                ->join('proyectos', 'tp.id', 'proyectos.id')
                ->join('evaluaciones', 'evaluaciones.proyecto_id', 'proyectos.id')
                ->where('proyectos.convocatoria_id', $convocatoria->id)
                ->where('evaluaciones.user_id', $authUser->id)
                ->distinct()
                ->orderBy('tp.id', 'ASC')
                ->filterTp(request()->only('search'))->paginate();
        }
        $tp->load('proyecto');

        return $tp;
    }
}
