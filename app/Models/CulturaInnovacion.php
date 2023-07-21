<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use DateTimeInterface;

class CulturaInnovacion extends Model
{
    use HasFactory;

    /**
     * table
     *
     * @var string
     */
    protected $table = 'cultura_innovacion';

    /**
     * appends
     *
     * @var array
     */
    protected $appends = ['fecha_ejecucion'];

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
        'tipo_evento',
        'titulo',
        'fecha_inicio',
        'fecha_finalizacion',
        'video',
        'justificacion_industria_4',
        'justificacion_economia_naranja',
        'justificacion_politica_discapacidad',
        'resumen',
        'antecedentes',
        'marco_conceptual',
        'metodologia',
        'propuesta_sostenibilidad',
        'muestreo',
        'actividades_muestreo',
        'objetivo_muestreo',
        'recoleccion_especimenes',
        'impacto_municipios',
        'impacto_centro_formacion',
        'objetivo_general',
        'problema_central',
        'justificacion_problema',
        'relacionado_plan_tecnologico',
        'relacionado_agendas_competitividad',
        'relacionado_mesas_sectoriales',
        'relacionado_tecnoacademia',
        'bibliografia',
        'numero_aprendices',
        'max_meses_ejecucion',
        'tipo_proyecto',
        'atencion_pluralista_diferencial',
        'impacto_sector_agricola',
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
     * Relationship with TecnoacademiaLineaTecnoacademia
     *
     * @return object
     */
    public function tecnoacademiaLineasTecnoacademia()
    {
        return $this->belongsToMany(TecnoacademiaLineaTecnoacademia::class, 'cultura_innovacion_linea_tecnoacademia', 'cultura_innovacion_id', 'tecnoacademia_linea_tecnoacademia_id');
    }

    /**
     * Relationship with MesaSectorial
     *
     * @return object
     */
    public function mesasSectoriales()
    {
        return $this->belongsToMany(MesaSectorial::class, 'cultura_innovacion_mesa_sectorial', 'cultura_innovacion_id', 'mesa_sectorial_id');
    }

    /**
     * Relationship with LineaTecnica
     *
     * @return object
     */
    public function lineaTecnica()
    {
        return $this->belongsTo(LineaTecnica::class);
    }

    /**
     * Filtrar registros
     *
     * @param  mixed $query
     * @param  mixed $filters
     * @return void
     */
    public function scopeFilterCulturaInnovacion($query, array $filters)
    {
        $query->when($filters['search'] ?? null, function ($query, $search) {
            $search = str_replace('"', "", $search);
            $search = str_replace("'", "", $search);
            $search = str_replace(' ', '%%', $search);
            $query->whereRaw("unaccent(titulo) ilike unaccent('%" . $search . "%')");
            if (is_numeric($search)) {
                $query->orWhere('cultura_innovacion.id', $search - 8000);
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
        $authUser = Auth::user();

        $culturaInnovacion = CulturaInnovacion::select('cultura_innovacion.id', 'cultura_innovacion.titulo', 'cultura_innovacion.fecha_inicio', 'cultura_innovacion.fecha_finalizacion')
            ->join('proyectos', 'cultura_innovacion.id', 'proyectos.id')
            ->whereHas(
                'proyecto.centroFormacion',
                function ($query) use ($convocatoria, $authUser) {
                    if ($authUser->hasRole([2]) && !$authUser->hasRole([1])) {
                        $query->where('centros_formacion.regional_id', $authUser->centroFormacion->regional->id);
                        $query->where('proyectos.convocatoria_id', $convocatoria->id);
                    } else if ($authUser->hasRole([3, 4, 21, 27]) && !$authUser->hasRole([1])) {
                        $query->where('centros_formacion.id', $authUser->centro_formacion_id);
                        $query->where('proyectos.convocatoria_id', $convocatoria->id);
                    } else if ($authUser->hasRole([1, 20, 23])) {
                        $query->where('proyectos.convocatoria_id', $convocatoria->id);
                    } else {
                        $query->join('proyectos', 'cultura_innovacion.id', 'proyectos.id');
                        $query->join('proyecto_participantes', 'proyectos.id', 'proyecto_participantes.proyecto_id');
                        $query->where('proyecto_participantes.user_id', $authUser->id);
                        $query->where('proyectos.convocatoria_id', $convocatoria->id);
                    }
                }
            )
            ->distinct()
            ->orderBy('cultura_innovacion.id', 'ASC')
            ->filterCulturaInnovacion(request()->only('search'))->paginate();


        $culturaInnovacion->load('proyecto');
        return $culturaInnovacion;
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
}
