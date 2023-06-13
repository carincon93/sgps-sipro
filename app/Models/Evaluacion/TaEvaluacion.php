<?php

namespace App\Models\Evaluacion;

use App\Models\Ta;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class TaEvaluacion extends Model
{
    use HasFactory;

    /**
     * table
     *
     * @var string
     */
    protected $table = 'ta_evaluaciones';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'resumen_regional_comentario',
        'antecedentes_tecnoacademia_comentario',
        'retos_oportunidades_comentario',
        'metodologia_comentario',
        'lineas_medulares_centro_comentario',
        'lineas_tecnologicas_centro_comentario',
        'articulacion_sennova_comentario',
        'municipios_comentario',
        'instituciones_comentario',
        'fecha_ejecucion_comentario',
        'cadena_valor_comentario',
        'analisis_riesgos_comentario',
        'anexos_comentario',
        'proyectos_macro_comentario',
        'bibliografia_comentario',
        'productos_comentario',
        'entidad_aliada_comentario',
        'edt_comentario',
        'articulacion_centro_formacion_comentario',
        'proyecto_presupuesto_comentario',
        'ortografia_comentario',
        'redaccion_comentario',
        'normas_apa_comentario',
        'impacto_centro_formacion_comentario'
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
    public function scopeFilterTaEvaluacion($query, array $filters)
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

        if ($authUser->hasRole(1) || $authUser->hasRole(5)) { // Admin
            $ta = Ta::select('evaluaciones.id as evaluacion_id', 'users.nombre as nombre_user', 'evaluaciones.habilitado', 'evaluaciones.iniciado', 'evaluaciones.finalizado', 'evaluaciones.evaluacion_final', 'ta.id', 'ta.fecha_inicio', 'ta.fecha_finalizacion')
                ->join('proyectos', 'ta.id', 'proyectos.id')
                ->join('evaluaciones', 'evaluaciones.proyecto_id', 'proyectos.id')
                ->join('users', 'evaluaciones.user_id', 'users.id')
                ->where('proyectos.convocatoria_id', $convocatoria->id)
                ->distinct()
                ->orderBy('ta.id', 'ASC')
                ->filterTa(request()->only('search'))->paginate();
        } else if ($authUser->hasRole(11)) { // Evaluador
            $ta = Ta::select('evaluaciones.id as evaluacion_id', 'evaluaciones.habilitado', 'evaluaciones.iniciado', 'evaluaciones.finalizado', 'ta.id', 'ta.fecha_inicio', 'ta.fecha_finalizacion')
                ->join('proyectos', 'ta.id', 'proyectos.id')
                ->join('evaluaciones', 'evaluaciones.proyecto_id', 'proyectos.id')
                ->where('proyectos.convocatoria_id', $convocatoria->id)
                ->where('evaluaciones.user_id', $authUser->id)
                ->distinct()
                ->orderBy('ta.id', 'ASC')
                ->filterTa(request()->only('search'))->paginate();
        }
        $ta->load('proyecto');
        $ta->load('proyecto.tecnoacademiaLineasTecnoacademia.tecnoacademia');

        return $ta;
    }
}
