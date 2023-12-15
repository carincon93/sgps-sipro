<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use DateTimeInterface;
use Illuminate\Support\Facades\Storage;

class ProyectoFormulario15Linea65 extends Model
{
    use HasFactory;

    /**
     * table
     *
     * @var string
     */
    protected $table = 'proyectos_formulario_15_linea_65';

    /**
     * appends
     *
     * @var array
     */
    protected $appends = ['fecha_ejecucion', 'lineas_estrategicas_sena_text'];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'linea_investigacion_id',
        'area_conocimiento_id',
        'tematica_estrategica_id',
        'actividad_economica_id',
        'titulo',
        'fecha_inicio',
        'fecha_finalizacion',
        'video',
        'justificacion_politica_discapacidad',
        'resumen',
        'antecedentes',
        'marco_conceptual',
        'metodologia',
        'propuesta_sostenibilidad',
        'impacto_municipios',
        'impacto_centro_formacion',
        'objetivo_general',
        'problema_central',
        'justificacion_problema',
        'relacionado_plan_tecnologico',
        'relacionado_agendas_competitividad',
        'relacionado_mesas_sectoriales',
        'bibliografia',
        'numero_aprendices',
        'max_meses_ejecucion',
        'atencion_pluralista_diferencial',
        'eje_sennova',
        'areas_cualificacion_mnc',
        'aportacion_linea_transeversal_campesena',
        'lineas_estrategicas_sena',
        'justificacion_aportes_lineas_estrategicas',
        'lineas_programaticas_sennova',
        'justificacion_mesas_sectoriales'
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
     * Prepare a date for array / JSON serialization.
     *
     * @param  \DateTimeInterface  $date
     * @return string
     */
    protected function serializeDate(DateTimeInterface $date)
    {
        return $date->format('Y-m-d H:i:s');
    }

    /**
     * Relationship with Proyecto
     *
     * @return object
     */
    public function proyecto()
    {
        return $this->belongsTo(Proyecto::class, 'id');
    }

    /**
     * Relationship with LineaInvestigacion
     *
     * @return object
     */
    public function lineaInvestigacion()
    {
        return $this->belongsTo(LineaInvestigacion::class);
    }

    /**
     * Relationship with AreaConocimiento
     *
     * @return object
     */
    public function areaConocimiento()
    {
        return $this->belongsTo(AreaConocimiento::class);
    }

    /**
     * Relationship with TematicaEstrategica
     *
     * @return object
     */
    public function tematicaEstrategica()
    {
        return $this->belongsTo(TematicaEstrategica::class);
    }

    /**
     * Relationship with ActividadEconomica
     *
     * @return object
     */
    public function actividadEconomica()
    {
        return $this->belongsTo(ActividadEconomica::class);
    }

    /**
     * Filtrar registros
     *
     * @param  mixed $query
     * @param  mixed $filters
     * @return void
     */
    public function scopeFilterProyectoFormulario15Linea65($query, array $filters)
    {
        $query->when($filters['search'] ?? null, function ($query, $search) {
            $search = str_replace('"', "", $search);
            $search = str_replace("'", "", $search);
            $search = str_replace(' ', '%%', $search);
            $query->whereRaw("unaccent(titulo) ilike unaccent('%" . $search . "%')");
            if (is_numeric($search)) {
                $query->orWhere('proyectos_formulario_15_linea_65.id', $search - 8000);
            }
        });
    }

    /**
     * getFechaEjecucionAttribute
     *
     * @return void
     */
    public function getFechaEjecucionAttribute()
    {
        $fecha_inicio       = Carbon::parse($this->fecha_inicio, 'UTC')->locale('es')->isoFormat('DD [de] MMMM [de] YYYY');
        $fecha_finalizacion = Carbon::parse($this->fecha_finalizacion, 'UTC')->locale('es')->isoFormat('DD [de] MMMM [de] YYYY');
        return "$fecha_inicio al $fecha_finalizacion";
    }

    /**
     * getProyectosPorRol
     *
     * @param  mixed $convocatoria
     * @return object
     */
    public static function getProyectosPorRol($convocatoria)
    {
        /** @var \App\Models\User */
        $auth_user = Auth::user();

        $proyectos_formulario_15_linea_65 = ProyectoFormulario15Linea65::select('proyectos_formulario_15_linea_65.id', 'proyectos_formulario_15_linea_65.titulo', 'proyectos_formulario_15_linea_65.fecha_inicio', 'proyectos_formulario_15_linea_65.fecha_finalizacion')
            ->join('proyectos', 'proyectos_formulario_15_linea_65.id', 'proyectos.id')
            ->whereHas(
                'proyecto.centroFormacion',
                function ($query) use ($convocatoria, $auth_user) {
                    if ($auth_user->hasRole([2]) && !$auth_user->hasRole([1])) {
                        $query->where('centros_formacion.regional_id', $auth_user->centroFormacion->regional->id);
                        $query->where('proyectos.convocatoria_id', $convocatoria->id);
                    } else if ($auth_user->hasRole([3, 4, 21, 27]) && !$auth_user->hasRole([1])) {
                        $query->join('proyectos', 'proyectos_formulario_15_linea_65.id', 'proyectos.id');
                        $query->join('proyecto_participantes', 'proyectos.id', 'proyecto_participantes.proyecto_id');

                        $query->where('centros_formacion.id', $auth_user->centro_formacion_id);
                        $query->where('proyectos.convocatoria_id', $convocatoria->id);
                        $query->orWhere('proyecto_participantes.user_id', $auth_user->id);
                        $query->where('proyectos.convocatoria_id', $convocatoria->id);
                    } else if ($auth_user->hasRole([1, 20, 23])) {
                        $query->where('proyectos.convocatoria_id', $convocatoria->id);
                    } else {
                        $query->join('proyectos', 'proyectos_formulario_15_linea_65.id', 'proyectos.id');
                        $query->join('proyecto_participantes', 'proyectos.id', 'proyecto_participantes.proyecto_id');
                        $query->where('proyecto_participantes.user_id', $auth_user->id);
                        $query->where('proyectos.convocatoria_id', $convocatoria->id);
                    }
                }
            )
            ->distinct()
            ->orderBy('proyectos_formulario_15_linea_65.id', 'ASC')
            ->filterProyectoFormulario15Linea65(request()->only('search'))->paginate();


        $proyectos_formulario_15_linea_65->load('proyecto');
        $proyectos_formulario_15_linea_65->load('proyecto.evaluaciones');

        return $proyectos_formulario_15_linea_65;
    }

    /**
     * getUpdatedAtAttribute
     *
     * @return void
     */
    public function getUpdatedAtAttribute($value)
    {
        return "Última modificación de este formulario: " . Carbon::parse($value, 'UTC')->timezone('America/Bogota')->locale('es')->isoFormat('DD [de] MMMM [de] YYYY [a las] HH:mm:ss');
    }

    public function getAreasCualificacionMncAttribute($value)
    {
        return json_decode($value);
    }

    public function getLineasEstrategicasSenaAttribute($value)
    {
        return json_decode($value);
    }

    public function getLineasProgramaticasSennovaAttribute($value)
    {
        return json_decode($value);
    }

    public function getLineasEstrategicasSenaTextAttribute()
    {
        return collect(json_decode(Storage::get('json/lineas-estrategicas.json'), true))->whereIn('value', $this->lineas_estrategicas_sena)->pluck('label')->implode(', ');
    }
}
