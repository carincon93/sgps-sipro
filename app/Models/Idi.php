<?php

namespace App\Models;

use App\Models\ProyectoConvocatoria\AreaTematicaEni;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;
use DateTimeInterface;
use Illuminate\Support\Facades\Auth;

class Idi extends Model
{
    use HasFactory;

    /**
     * table
     *
     * @var string
     */
    protected $table = 'idi';

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
        'disciplina_subarea_conocimiento_id',
        'tematica_estrategica_id',
        'red_conocimiento_id',
        'actividad_economica_id',
        'titulo',
        'fecha_inicio',
        'fecha_finalizacion',
        'video',
        'justificacion_industria_4',
        'justificacion_economia_naranja',
        'justificacion_politica_discapacidad',
        'atencion_pluralista_diferencial',
        'impacto_sector_agricola',
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
        'proyecto_investigacion_pedagogica',
        'articulacion_eni',
        'grupo_investigacion_eni_id',
        'justificacion_proyecto_investigacion_pedagogica',
        'productividad_beneficiaros',
        'generacion_empleo_beneficiarios',
        'creacion_nuevos_desarrollos',
        'generacion_conocimientos_beneficiarios',
        'generacion_valor_beneficiarios',
        'fortalecimiento_programas_formacion',
        'transferencia_tecnologias',
        'calidad_formacion',
        'impacto_ambiental_proyectos',
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
     * Relationship with DisciplinaSubareaConocimiento
     *
     * @return object
     */
    public function disciplinaSubareaConocimiento()
    {
        return $this->belongsTo(DisciplinaSubareaConocimiento::class);
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
     * Relationship with RedConocimiento
     *
     * @return object
     */
    public function redConocimiento()
    {
        return $this->belongsTo(RedConocimiento::class);
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
     * Relationship with MesaSectorial
     *
     * @return object
     */
    public function mesasSectoriales()
    {
        return $this->belongsToMany(MesaSectorial::class, 'idi_mesa_sectorial', 'idi_id', 'mesa_sectorial_id');
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
     * Relationship with GrupoInvestigacion
     *
     * @return object
     */
    public function grupoInvestigacionEni()
    {
        return $this->belongsTo(GrupoInvestigacion::class, 'grupo_investigacion_eni_id');
    }

    /**
     * Relationship with AreaTematicaEni
     *
     * @return object
     */
    public function areasTematicasEni()
    {
        return $this->belongsToMany(AreaTematicaEni::class, 'idi_areas_tematicas_eni', 'idi_id', 'area_tematica_eni_id');
    }

    /**
     * Relationship with lineasInvestigacionEni
     *
     * @return object
     */
    public function lineasInvestigacionEni()
    {
        return $this->belongsToMany(LineaInvestigacion::class, 'idi_lineas_investigacion_eni', 'idi_id', 'linea_investigacion_id');
    }

    /**
     * Filtrar registros
     *
     * @param  mixed $query
     * @param  mixed $filters
     * @return void
     */
    public function scopeFilterIdi($query, array $filters)
    {
        $query->when($filters['search'] ?? null, function ($query, $search) {
            $search = str_replace('"', "", $search);
            $search = str_replace("'", "", $search);
            $search = str_replace(' ', '%%', $search);
            $query->whereRaw("unaccent(titulo) ilike unaccent('%" . $search . "%')");
            if (is_numeric($search)) {
                $query->orWhere('idi.id', $search - 8000);
            }
        });
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

        $idi = Idi::select('idi.id', 'idi.titulo', 'idi.fecha_inicio', 'idi.fecha_finalizacion')
            ->join('proyectos', 'idi.id', 'proyectos.id')
            ->whereHas(
                'proyecto.centroFormacion',
                function ($query) use ($convocatoria, $authUser) {

                    if ($authUser->hasRole([2]) && !$authUser->hasRole([1])) {
                        $query->where('centros_formacion.regional_id', $authUser->centroFormacion->regional->id);
                        $query->where('proyectos.convocatoria_id', $convocatoria->id);
                    } else if ($authUser->hasRole([3, 4, 21, 27]) && !$authUser->hasRole([1])) {
                        $query->where('centros_formacion.id', $authUser->centro_formacion_id);
                        $query->where('proyectos.convocatoria_id', $convocatoria->id);
                    } else if ($authUser->hasRole([1, 18, 23])) {
                        $query->where('proyectos.convocatoria_id', $convocatoria->id);
                    } else {
                        $query->join('proyectos', 'idi.id', 'proyectos.id');
                        $query->join('proyecto_participantes', 'proyectos.id', 'proyecto_participantes.proyecto_id');
                        $query->where('proyecto_participantes.user_id', $authUser->id);
                        $query->where('proyectos.convocatoria_id', $convocatoria->id);
                    }
                }
            )
            ->with('proyecto.proyectoPresupuesto')
            ->distinct('idi.id')
            ->orderBy('idi.id', 'ASC')
            ->filterIdi(request()->only('search'))->paginate();

        $idi->load('proyecto');

        return $idi;
    }
}
