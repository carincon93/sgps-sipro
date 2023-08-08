<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;
use DateTimeInterface;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ProyectoLinea70 extends Model
{
    use HasFactory;

    /**
     * table
     *
     * @var string
     */
    protected $table = 'ta';

    /**
     * appends
     *
     * @var array
     */
    protected $appends = ['titulo', 'fecha_ejecucion', 'filename', 'extension'];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'id',
        'resumen',
        'resumen_regional',
        'antecedentes',
        'antecedentes_tecnoacademia',
        'problema_central',
        'justificacion_problema',
        'retos_oportunidades',
        'pertinencia_territorio',
        'marco_conceptual',
        'objetivo_general',
        'metodologia',
        'metodologia_local',
        'impacto_municipios',
        'fecha_inicio',
        'fecha_finalizacion',
        'propuesta_sostenibilidad_social',
        'propuesta_sostenibilidad_financiera',
        'propuesta_sostenibilidad_ambiental',
        'articulacion_centro_formacion',
        'bibliografia',
        'numero_instituciones',
        'nuevas_instituciones',
        'nombre_instituciones',
        'nombre_instituciones_programas',
        'max_meses_ejecucion',
        'cantidad_instructores_planta',
        'cantidad_dinamizadores_planta',
        'cantidad_psicopedagogos_planta',
        'proyectos_ejecucion',
        'proyectos_macro',
        'lineas_medulares_centro',
        'lineas_tecnologicas_centro',
        'proyeccion_nuevas_instituciones',
        'proyeccion_articulacion_media',
        'articulacion_semillero',
        'semilleros_en_formalizacion',
        'infraestructura_tecnoacademia',
        'modificable',
        'otras_nuevas_instituciones',
        'otras_nombre_instituciones_programas',
        'otras_nombre_instituciones',
        'logros_vigencia_anterior',
        'articulacion_plan_educacion',
        'articulacion_territorios_stem',
        'articulacion_programas_centro',
        'articulacion_bienestar_aprendiz',
        'favorecimiento_ruta_formacion',
        'implementacion_modelo_pedagogico',
        'pdf_proyecto_general',
        'proyecto_base'
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
     * Relationship with Edt
     *
     * @return object
     */
    public function edt()
    {
        return $this->hasMany(Edt::class, 'ta_id');
    }

    /**
     * Relationship with AulaMovil
     *
     * @return object
     */
    public function aulasMoviles()
    {
        return $this->hasMany(AulaMovil::class, 'proeycto_linea70_id');
    }

    /**
     * Relationship with TematicaEstrategica
     *
     * @return object
     */
    public function tematicasEstrategicas()
    {
        return $this->belongsToMany(TematicaEstrategica::class, 'ta_tematica_estrategica', 'ta_id', 'tematica_estrategica_id');
    }

    /**
     * Relationship with ProyectoIdiTecnoacademia
     *
     * @return object
     */
    public function proyectosIdiTecnoacademia()
    {
        return $this->belongsToMany(ProyectoIdiTecnoacademia::class, 'ta_proyectos_idi_tecnoacademia', 'ta_id', 'proyecto_idi_tecnoacademia_id');
    }

    /**
     * Relationship with DisciplinaSubareaConocimiento
     *
     * @return object
     */
    public function disciplinasSubareaConocimiento()
    {
        return $this->belongsToMany(DisciplinaSubareaConocimiento::class, 'ta_disciplina_subarea_conocimiento', 'ta_id', 'disciplina_subarea_conocimiento_id');
    }

    /**
     * Relationship with RedConocimiento
     *
     * @return object
     */
    public function redesConocimiento()
    {
        return $this->belongsToMany(RedConocimiento::class, 'ta_red_conocimiento', 'ta_id', 'red_conocimiento_id');
    }

    /**
     * Relationship with ActividadEconomica
     *
     * @return object
     */
    public function actividadesEconomicas()
    {
        return $this->belongsToMany(ActividadEconomica::class, 'ta_actividad_economica', 'ta_id', 'actividad_economica_id');
    }

    /**
     * Filtrar registros
     *
     * @param  mixed $query
     * @param  mixed $filters
     * @return void
     */
    public function scopeFilterProyectoLinea70($query, array $filters)
    {
        $query->when($filters['search'] ?? null, function ($query, $search) {
            $search = str_replace('"', "", $search);
            $search = str_replace("'", "", $search);
            $search = str_replace(' ', '%%', $search);
            $query->where('resumen', 'ilike', '%' . $search . '%');
            if (is_numeric($search)) {
                $query->orWhere('ta.id', $search - 8000);
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
        $auth_user = Auth::user();

        $proyectos_linea_70 = ProyectoLinea70::select('ta.id', 'ta.fecha_inicio', 'ta.fecha_finalizacion', 'ta.proyecto_base')
            ->join('proyectos', 'ta.id', 'proyectos.id')
            ->join('centros_formacion', 'proyectos.centro_formacion_id', 'centros_formacion.id')
            ->whereHas(
                'proyecto.centroFormacion',
                function ($query) use ($convocatoria, $auth_user) {
                    if ($auth_user->hasRole([2]) && !$auth_user->hasRole([1])) {
                        $query->where('centros_formacion.regional_id', $auth_user->centroFormacion->regional->id);
                        $query->where('proyectos.convocatoria_id', $convocatoria->id);
                    } else if ($auth_user->hasRole([3, 4, 21, 22, 27]) && !$auth_user->hasRole([1])) {
                        $query->where('centros_formacion.id', $auth_user->centro_formacion_id);
                        $query->where('proyectos.convocatoria_id', $convocatoria->id);
                    } else if ($auth_user->hasRole([1, 5, 23])) {
                        $query->where('proyectos.convocatoria_id', $convocatoria->id);
                    } else {
                        $query->join('proyectos', 'ta.id', 'proyectos.id');
                        $query->join('proyecto_participantes', 'proyectos.id', 'proyecto_participantes.proyecto_id');
                        $query->where('proyecto_participantes.user_id', $auth_user->id);
                        $query->where('proyectos.convocatoria_id', $convocatoria->id);
                    }
                }
            )
            ->distinct()
            ->orderBy('ta.id', 'ASC')
            ->filterProyectoLinea70(request()->only('search'))->paginate();


        $proyectos_linea_70->load('proyecto.tecnoacademiaLineasTecnoacademia.tecnoacademia');
        $proyectos_linea_70->load('proyecto.evaluaciones');

        return $proyectos_linea_70;
    }

    /**
     * getTituloAttribute
     *
     * @return void
     */
    public function getTituloAttribute()
    {
        return DB::table('proyectos')->select('tecnoacademias.nombre')->join('proyecto_linea_tecnoacademia', 'proyectos.id', 'proyecto_linea_tecnoacademia.proyecto_id')
            ->join('tecnoacademia_linea_tecnoacademia', 'proyecto_linea_tecnoacademia.tecnoacademia_linea_tecnoacademia_id', 'tecnoacademia_linea_tecnoacademia.id')
            ->join('tecnoacademias', 'tecnoacademia_linea_tecnoacademia.tecnoacademia_id', 'tecnoacademias.id')->where('proyectos.id', $this->id)->first() ? DB::table('proyectos')->select('tecnoacademias.nombre')->join('proyecto_linea_tecnoacademia', 'proyectos.id', 'proyecto_linea_tecnoacademia.proyecto_id')
            ->join('tecnoacademia_linea_tecnoacademia', 'proyecto_linea_tecnoacademia.tecnoacademia_linea_tecnoacademia_id', 'tecnoacademia_linea_tecnoacademia.id')
            ->join('tecnoacademias', 'tecnoacademia_linea_tecnoacademia.tecnoacademia_id', 'tecnoacademias.id')->where('proyectos.id', $this->id)->first()->nombre : '';
    }

    public function getFilenameAttribute()
    {
        $fileInfo = pathinfo($this->pdf_proyecto_general);

        return $fileInfo['filename'] ?? '';
    }

    public function getExtensionAttribute()
    {
        $fileInfo = pathinfo($this->pdf_proyecto_general);

        return $fileInfo['extension'] ?? '';
    }
}
