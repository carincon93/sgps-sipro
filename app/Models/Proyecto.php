<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;

class Proyecto extends Model
{
    use HasFactory;

    /**
     * table
     *
     * @var string
     */
    protected $table = 'proyectos';

    /**
     * appends
     *
     * @var array
     */
    protected $appends = ['codigo', 'diff_meses', 'precio_proyecto', 'total_roles_sennova', 'fecha_inicio', 'fecha_finalizacion', 'estado_evaluacion_idi', 'estado_evaluacion_cultura_innovacion', 'estado_evaluacion_ta', 'estado_evaluacion_tp', 'estado_evaluacion_servicios_tecnologicos', 'cantidad_objetivos', 'total_proyecto_presupuesto_aprobado', 'total_roles_sennova_aprobado', 'precio_proyecto_aprobado', 'all_files', 'allowed', 'resultados'];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'convocatoria_id',
        'centro_formacion_id',
        'linea_programatica_id',
        'finalizado',
        'modificable',
        'habilitado_para_evaluar',
        'en_subsanacion',
        'estructuracion_proyectos',
        'estado',
        'estado_cord_sennova',
        'mostrar_recomendaciones',
        'mostrar_requiere_subsanacion',
        'en_evaluacion',
        'arboles_completos'
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
     * Relationship with Convocatoria
     *
     * @return object
     */
    public function convocatoria()
    {
        return $this->belongsTo(Convocatoria::class);
    }

    /**
     * Relationship with LineaProgramatica
     *
     * @return object
     */
    public function lineaProgramatica()
    {
        return $this->belongsTo(LineaProgramatica::class);
    }

    /**
     * Relationship with CentroFormacion
     *
     * @return object
     */
    public function centroFormacion()
    {
        return $this->belongsTo(CentroFormacion::class);
    }

    /**
     * Relationship with Idi
     *
     * @return object
     */
    public function idi()
    {
        return $this->hasOne(Idi::class, 'id');
    }

    /**
     * Relationship with CulturaInnovacion
     *
     * @return object
     */
    public function culturaInnovacion()
    {
        return $this->hasOne(CulturaInnovacion::class, 'id');
    }

    /**
     * Relationship with ServicioTecnologico
     *
     * @return object
     */
    public function servicioTecnologico()
    {
        return $this->hasOne(ServicioTecnologico::class, 'id');
    }

    /**
     * Relationship with Ta
     *
     * @return object
     */
    public function ta()
    {
        return $this->hasOne(Ta::class, 'id');
    }

    /**
     * Relationship with Tp
     *
     * @return object
     */
    public function tp()
    {
        return $this->hasOne(Tp::class, 'id');
    }

    /**
     * Relationship with ProyectoDemo
     *
     * @return object
     */
    public function proyectoDemo()
    {
        return $this->hasOne(ProyectoDemo::class);
    }

    /**
     * Relationship with EntidadAliada
     *
     * @return object
     */
    public function entidadesAliadas()
    {
        return $this->hasMany(EntidadAliada::class);
    }

    /**
     * Relationship with Municipio
     *
     * @return object
     */
    public function municipios()
    {
        return $this->belongsToMany(Municipio::class, 'proyecto_municipio', 'proyecto_id', 'municipio_id')->orderBy('municipios.nombre', 'ASC');
    }

    /**
     * Relationship with Municipio
     *
     * @return object
     */
    public function municipiosAImpactar()
    {
        return $this->belongsToMany(Municipio::class, 'proyecto_municipio_impactar', 'proyecto_id', 'municipio_id')->orderBy('municipios.nombre', 'ASC');
    }

    /**
     * Relationship with CausaDirecta
     *
     * @return object
     */
    public function causasDirectas()
    {
        return $this->hasMany(CausaDirecta::class)->orderBy('id', 'ASC');
    }

    /**
     * Relationship with EfectoDirecto
     *
     * @return object
     */
    public function efectosDirectos()
    {
        return $this->hasMany(EfectoDirecto::class)->orderBy('id', 'ASC');
    }

    /**
     * Relationship with ProyectoAnexo
     *
     * @return object
     */
    public function proyectoAnexo()
    {
        return $this->hasMany(ProyectoAnexo::class);
    }

    /**
     * Relationship with AnalisisRiesgo
     *
     * @return object
     */
    public function analisisRiesgos()
    {
        return $this->hasMany(AnalisisRiesgo::class);
    }

    /**
     * Relationship with ProyectoPresupuesto
     *
     * @return object
     */
    public function proyectoPresupuesto()
    {
        return $this->hasMany(ProyectoPresupuesto::class);
    }

    /**
     * Relationship with ProyectoRolSennova
     *
     * @return object
     */
    public function proyectoRolesSennova()
    {
        return $this->hasMany(ProyectoRolSennova::class);
    }

    /**
     * Relationship with InventarioEquipo
     *
     * @return object
     */
    public function inventarioEquipos()
    {
        return $this->hasMany(InventarioEquipo::class);
    }

    /**
     * Relationship with ProyectoIdiTecnoacademia
     *
     * @return object
     */
    public function proyectosIdiTecnoacademia()
    {
        return $this->hasMany(ProyectoIdiTecnoacademia::class);
    }

    /**
     * Relationship with Evaluacion
     *
     * @return object
     */
    public function evaluaciones()
    {
        return $this->hasMany(\App\Models\Evaluacion\Evaluacion::class)->orderBy('id');
    }

    /**
     * Relationship with ProgramaFormacion
     *
     * @return object
     */
    public function programasFormacion()
    {
        return $this->belongsToMany(ProgramaFormacion::class, 'proyecto_programa_formacion', 'proyecto_id', 'programa_formacion_id');
    }

    /**
     * Relationship with ProgramaFormacion
     *
     * @return object
     */
    public function taProgramasFormacion()
    {
        return $this->belongsToMany(ProgramaFormacion::class, 'ta_programa_formacion', 'proyecto_id', 'programa_formacion_id');
    }

    /**
     * Relationship with GrupoInvestigacion
     *
     * @return object
     */
    public function gruposInvestigacion()
    {
        return $this->belongsToMany(GrupoInvestigacion::class, 'proyecto_grupo_investigacion', 'proyecto_id', 'grupo_investigacion_id');
    }

    /**
     * Relationship with LineaInvestigacion
     *
     * @return object
     */
    public function lineasInvestigacion()
    {
        return $this->belongsToMany(LineaInvestigacion::class, 'proyecto_linea_investigacion', 'proyecto_id', 'linea_investigacion_id');
    }

    /**
     * Relationship with SemilleroInvestigacion
     *
     * @return object
     */
    public function semillerosInvestigacion()
    {
        return $this->belongsToMany(SemilleroInvestigacion::class, 'proyecto_semillero_investigacion', 'proyecto_id', 'semillero_investigacion_id');
    }

    /**
     * Relationship with TecnoacademiaLineasTecnoacademia
     *
     * @return object
     */
    public function tecnoacademiaLineasTecnoacademia()
    {
        return $this->belongsToMany(TecnoacademiaLineaTecnoacademia::class, 'proyecto_linea_tecnoacademia', 'proyecto_id', 'tecnoacademia_linea_tecnoacademia_id');
    }

    /**
     * Relationship with DisenoCurricular
     *
     * @return object
     */
    public function disenosCurriculares()
    {
        return $this->belongsToMany(DisenoCurricular::class, 'proyecto_diseno_curricular', 'proyecto_id', 'diseno_curricular_id');
    }

    /**
     * Relationship with participantes
     *
     * @return object
     */
    public function participantes()
    {
        return $this->belongsToMany(User::class, 'proyecto_participantes', 'proyecto_id', 'user_id')
            ->withPivot([
                'user_id',
                'es_formulador',
                'cantidad_meses',
                'cantidad_horas',
                'rol_sennova'
            ]);
    }

    /**
     * Filtrar registros
     *
     * @param  mixed $query
     * @param  mixed $filters
     * @return void
     */
    public function scopeFilterProyecto($query, array $filters)
    {
        $query->when($filters['search'] ?? null, function ($query, $search) {
            $search = str_replace('"', "", $search);
            $search = str_replace("'", "", $search);
            $search = str_replace(' ', '%%', $search);
            $query->where('proyectos.id', $search - 8000);
        });
    }

    /**
     * getUpdatedAtAttribute
     *
     * @return void
     */
    public function getUpdatedAtAttribute($value)
    {
        return "Última modificación de este formulario: " . Carbon::parse($value, 'UTC')->timezone('America/Bogota')->timezone('America/Bogota')->locale('es')->isoFormat('DD [de] MMMM [de] YYYY [a las] HH:mm:ss');
    }

    public static function getLog($proyectoId)
    {
        return DB::table('notifications')->select('data', 'created_at')->whereRaw("data->>'proyectoId' = '" . $proyectoId . "'")->where('type', '!=', 'App\Notifications\EvaluacionFinalizada')->orderBy('created_at', 'DESC')->get();
    }

    /**
     * Relationship with ProyectoPdfVersion
     *
     * @return object
     */
    public function PdfVersiones()
    {
        return $this->hasMany(ProyectoPdfVersion::class);
    }

    /**
     * Get codigo e.g. SGPS-8000-2021
     *
     * @return string
     */
    public function getCodigoAttribute()
    {
        $fechaFinalizacion = null;
        if ($this->idi()->exists()) $fechaFinalizacion =  $this->idi->fecha_finalizacion;
        if ($this->ta()->exists()) $fechaFinalizacion  =  $this->ta->fecha_finalizacion;
        if ($this->tp()->exists()) $fechaFinalizacion  =  $this->tp->fecha_finalizacion;
        if ($this->servicioTecnologico()->exists()) $fechaFinalizacion =  $this->servicioTecnologico->fecha_finalizacion;
        if ($this->culturaInnovacion()->exists()) $fechaFinalizacion =  $this->culturaInnovacion->fecha_finalizacion;
        $codigo = 'SGPS-' . ($this->id + 8000) . '-' . date('Y', strtotime($fechaFinalizacion));
        if ($this->proyectoDemo()->exists()) {
            $numeroConsecutivo = sprintf("%05s", $this->proyectoDemo->id);
            $codigo = 'DEMO-' . $numeroConsecutivo . '-' . date('Y', strtotime($fechaFinalizacion));
            $fechaFinalizacion =  $this->idi->fecha_finalizacion;
        }

        return $codigo;
    }

    public function getFechaInicioAttribute()
    {
        $fechaInicio = null;
        if ($this->idi()->exists()) {
            $fechaInicio = $this->idi->fecha_inicio;
        } else if ($this->ta()->exists()) {
            $fechaInicio = $this->ta->fecha_inicio;
        } else if ($this->tp()->exists()) {
            $fechaInicio = $this->tp->fecha_inicio;
        } else if ($this->servicioTecnologico()->exists()) {
            $fechaInicio = $this->servicioTecnologico->fecha_inicio;
        } else if ($this->culturaInnovacion()->exists()) {
            $fechaInicio = $this->culturaInnovacion->fecha_inicio;
        }

        return $fechaInicio;
    }

    public function getFechaFinalizacionAttribute()
    {
        $fechaInicio = null;
        if ($this->idi()->exists()) {
            $fechaInicio = $this->idi->fecha_finalizacion;
        } else if ($this->ta()->exists()) {
            $fechaInicio = $this->ta->fecha_finalizacion;
        } else if ($this->tp()->exists()) {
            $fechaInicio = $this->tp->fecha_finalizacion;
        } else if ($this->servicioTecnologico()->exists()) {
            $fechaInicio = $this->servicioTecnologico->fecha_finalizacion;
        } else if ($this->culturaInnovacion()->exists()) {
            $fechaInicio = $this->culturaInnovacion->fecha_finalizacion;
        }

        return $fechaInicio;
    }

    /**
     * getDiffMesesAttribute
     *
     * @return int
     */
    public function getDiffMesesAttribute()
    {
        $cantidadMesesEjecucion = 0;
        if ($this->idi()->exists()) {
            $cantidadMesesEjecucion = $this->idi->max_meses_ejecucion;
        }

        if ($this->ta()->exists()) {
            $cantidadMesesEjecucion = $this->ta->max_meses_ejecucion;
        }

        if ($this->tp()->exists()) {
            $cantidadMesesEjecucion = $this->tp->max_meses_ejecucion;
        }

        if ($this->servicioTecnologico()->exists()) {
            $cantidadMesesEjecucion = $this->servicioTecnologico->max_meses_ejecucion;
        }

        if ($this->culturaInnovacion()->exists()) {
            $cantidadMesesEjecucion = $this->culturaInnovacion->max_meses_ejecucion;
        }

        return $cantidadMesesEjecucion;
    }

    /**
     * getTotalProyectoPresupuestoAttribute
     *
     * @return int
     */
    public function getTotalProyectoPresupuestoAttribute()
    {
        $total = 0;

        foreach ($this->proyectoPresupuesto as $proyectoPresupuesto) {
            if ($proyectoPresupuesto->convocatoriaPresupuesto->presupuestoSennova->sumar_al_presupuesto) {
                $total += $proyectoPresupuesto->valor_total;
            }
        }

        return $total;
    }

    /**
     * getTotalRolesSennovaAttribute
     *
     * @return int
     */
    public function getTotalRolesSennovaAttribute()
    {
        $total = 0;

        foreach ($this->proyectoRolesSennova as $proyectoRolSennova) {
            if ($proyectoRolSennova->convocatoriaRolSennova->rolSennova->sumar_al_presupuesto) {
                $total += $proyectoRolSennova->getTotalRolSennova();
            }
        }

        return $total;
    }

    /**
     * getTotalProyectoPresupuestoAprobadoAttribute
     *
     * @return int
     */
    public function getTotalProyectoPresupuestoAprobadoAttribute()
    {
        $total = 0;

        foreach ($this->proyectoPresupuesto as $proyectoPresupuesto) {
            if ($proyectoPresupuesto->convocatoriaPresupuesto->presupuestoSennova->sumar_al_presupuesto && $proyectoPresupuesto->getPresupuestoAprobadoAttribute()) {
                $total += $proyectoPresupuesto->valor_total;
            }
        }

        return $total;
    }

    /**
     * getTotalRolesSennovaAprobadoAttribute
     *
     * @return int
     */
    public function getTotalRolesSennovaAprobadoAttribute()
    {
        $total = 0;

        foreach ($this->proyectoRolesSennova as $proyectoRolSennova) {
            if ($proyectoRolSennova->convocatoriaRolSennova->rolSennova->sumar_al_presupuesto && $proyectoRolSennova->getRolAprobadoAttribute()) {
                $total += $proyectoRolSennova->getTotalRolSennova();
            }
        }

        return $total;
    }

    /**
     * getPrecioProyectoAprobadoAttribute
     *
     * @return int
     */
    public function getPrecioProyectoAprobadoAttribute()
    {
        $total = 0;

        $total = $this->getTotalProyectoPresupuestoAprobadoAttribute() + $this->getTotalRolesSennovaAprobadoAttribute();

        return $total;
    }


    /**
     * getPrecioProyecto
     *
     * @return int
     */
    public function getPrecioProyectoAttribute()
    {
        return $this->getTotalProyectoPresupuestoAttribute() + $this->getTotalRolesSennovaAttribute();
    }

    public function getCantidadObjetivosAttribute()
    {
        $numeroObjetivos = 0;

        foreach ($this->causasDirectas as $causaDirecta) {
            strlen($causaDirecta->objetivoEspecifico->descripcion) > 10 ? $numeroObjetivos++ : null;
        }

        return $numeroObjetivos;
    }

    /**
     * getEstadoEvaluacionIdiAttribute - Estrategia regional
     *
     * @return void
     */
    public function getEstadoEvaluacionIdiAttribute()
    {
        if ($this->idi()->exists()) {
            $convocatoria = Convocatoria::select('fase')->where('esta_activa', true)->first();
            $evaluaciones = $this->evaluaciones()->where('habilitado', true)->get();
            $evaluacionesFinalizadas = $this->evaluaciones()->where('habilitado', true)->where('finalizado', true)->count();

            $puntajeTotal = 0;
            $totalRecomendaciones = 0;
            $estadoEvaluacion = '';
            $causalRechazo  = null;
            $requiereSubsanar = false;
            $totalPresupuestosEvaluados = 0;

            $estados = array(1, 2);

            foreach ($evaluaciones as $key => $evaluacion) {
                $puntajeTotal += $evaluacion->total_evaluacion;
                $totalRecomendaciones += $evaluacion->total_recomendaciones;

                array_push($estados, $this->estadoEvaluacionIdi($evaluacion->total_evaluacion, $totalRecomendaciones, $requiereSubsanar, null)['id']);

                if ($causalRechazo == null) {

                    switch ($evaluacion) {
                        case $evaluacion->idiEvaluacion()->exists():

                            if ($evaluacion->evaluacionCausalesRechazo()->where('causal_rechazo', '=', 4)->first()) {
                                $causalRechazo = 'En revisión por Cord. SENNOVA';
                            } else if ($evaluacion->evaluacionCausalesRechazo()->whereIn('causal_rechazo', [1, 2, 3])->first()) {
                                $causalRechazo = 'Rechazado - Por causal de rechazo';
                            }

                            if ($evaluacion->idiEvaluacion->anexos_comentario != null) {
                                $requiereSubsanar = true;
                            }
                            break;

                        default:
                            break;
                    }
                }

                if ($causalRechazo == null && $evaluacion->proyectoPresupuestosEvaluaciones()->count() > 0 && $convocatoria->fase == 5) {
                    $this->precio_proyecto - $this->getPrecioProyectoAprobadoAttribute() >= floor($this->precio_proyecto * 0.8) ? $causalRechazo = 'Rechazado - No cumple con el presupuesto' : $causalRechazo = null;
                }
            }

            $cantidadEvaluaciones = count($evaluaciones);

            $sq = 0;
            $sq = $this->getDesviacionEstandarAttribute();
            $alerta = null;
            if (in_array(2, $estados) && $sq >= 25  || in_array(3, $estados) && $sq >= 25) {
                if (in_array(2, $estados)) {
                    $estadoArr = 'Pre-aprobado';
                } else if (in_array(3, $estados)) {
                    $estadoArr = 'Pre-aprobado con observaciones';
                }
                $alerta = "Hay una evaluación en estado '{$estadoArr}' y la desviación estándar de las {$cantidadEvaluaciones} evaluaciones es {$sq}.";
            }

            $cantidadEvaluaciones > 0 ? $puntajeTotal = $puntajeTotal / $cantidadEvaluaciones : $puntajeTotal = 0;

            if ($causalRechazo == null && $cantidadEvaluaciones > 0) {
                $estadoEvaluacion = $this->estadoEvaluacionIdi($puntajeTotal, $totalRecomendaciones, $requiereSubsanar, null)['estado'];
                $requiereSubsanar = $this->estadoEvaluacionIdi($puntajeTotal, $totalRecomendaciones, $requiereSubsanar, null)['requiereSubsanar'];
            } else {
                $estadoEvaluacion = $causalRechazo;
            }

            if ($cantidadEvaluaciones == 0) {
                $estadosEvaluacion = collect(json_decode(Storage::get('json/estados_evaluacion.json'), true));
                $estadoEvaluacion = $estadosEvaluacion->where('value', 1)->first()['label'];
            }

            if ($this->estado_cord_sennova != NULL && request()->isMethod('GET')) {
                $estadosEvaluacion = collect(json_decode($this->estado_cord_sennova, true));
                $estadoEvaluacion = $estadosEvaluacion['estado'];
            }

            return collect(['estado' => $estadoEvaluacion, 'puntaje' => $puntajeTotal, 'numeroRecomendaciones' => $totalRecomendaciones, 'evaluacionesHabilitadas' => $cantidadEvaluaciones, 'evaluacionesFinalizadas' => $evaluacionesFinalizadas, 'requiereSubsanar' => $requiereSubsanar, 'alerta' => $alerta]);
        }
    }

    /**
     * getEstadoEvaluacionCulturaInnovacionAttribute
     *
     * @return void
     */
    public function getEstadoEvaluacionCulturaInnovacionAttribute()
    {
        if ($this->culturaInnovacion()->exists()) {

            $evaluaciones = $this->evaluaciones()->where('habilitado', true)->get();
            $evaluacionesFinalizadas = $this->evaluaciones()->where('habilitado', true)->where('finalizado', true)->count();

            $puntajeTotal = 0;
            $totalRecomendaciones = 0;
            $estadoEvaluacion = '';
            $causalRechazo  = null;
            $requiereSubsanar = false;
            $totalPresupuestosEvaluados = 0;
            $countPresupuestoNoAprobado = 0;

            $estados = array(1, 2);

            foreach ($evaluaciones as $key => $evaluacion) {
                $puntajeTotal += $evaluacion->total_evaluacion;
                $totalRecomendaciones += $evaluacion->total_recomendaciones;

                // Sumar los presupuesto no aprobados
                $totalPresupuestosEvaluados += $evaluacion->proyectoPresupuestosEvaluaciones()->count();

                foreach ($evaluacion->proyectoPresupuestosEvaluaciones()->get() as $presupuestoEvaluacion) {
                    $presupuestoEvaluacion->correcto == false ? $countPresupuestoNoAprobado++ : null;
                }

                array_push($estados, $this->estadoEvaluacionCulturaInnovacion($evaluacion->total_evaluacion, $totalRecomendaciones, $requiereSubsanar)['id']);

                if ($causalRechazo == null) {
                    switch ($evaluacion) {
                        case $evaluacion->culturaInnovacionEvaluacion()->exists():
                            if ($evaluacion->culturaInnovacionEvaluacion->anexos_comentario != null) {
                                $requiereSubsanar = true;
                            }
                            break;

                        default:
                            break;
                    }
                }

                // if ($causalRechazo == null && $evaluacion->proyectoPresupuestosEvaluaciones()->count() > 0) {
                //     $countPresupuestoNoAprobado >= floor($totalPresupuestosEvaluados * 0.8) ? $causalRechazo = 'Rechazado - No cumple con el presupuesto' : $causalRechazo = null;
                // }
            }

            $cantidadEvaluaciones = count($evaluaciones);

            $sq = 0;
            $sq = $this->getDesviacionEstandarAttribute();
            $alerta = null;
            if (in_array(2, $estados) && $sq >= 25  || in_array(3, $estados) && $sq >= 25) {
                if (in_array(2, $estados)) {
                    $estadoArr = 'Pre-aprobado';
                } else if (in_array(3, $estados)) {
                    $estadoArr = 'Pre-aprobado con observaciones';
                }
                $alerta = "Hay una evaluación en estado '{$estadoArr}' y la desviación estándar de las {$cantidadEvaluaciones} evaluaciones es {$sq}.";
            }

            $cantidadEvaluaciones > 0 ? $puntajeTotal = $puntajeTotal / $cantidadEvaluaciones : $puntajeTotal = 0;

            if ($causalRechazo == null && $cantidadEvaluaciones > 0) {
                $estadoEvaluacion = $this->estadoEvaluacionCulturaInnovacion($puntajeTotal, $totalRecomendaciones, $requiereSubsanar)['estado'];
                $requiereSubsanar = $this->estadoEvaluacionCulturaInnovacion($puntajeTotal, $totalRecomendaciones, $requiereSubsanar)['requiereSubsanar'];
            } else {
                $estadoEvaluacion = $causalRechazo;
            }

            if ($cantidadEvaluaciones == 0) {
                $estadosEvaluacion = collect(json_decode(Storage::get('json/estados_evaluacion.json'), true));
                $estadoEvaluacion = $estadosEvaluacion->where('value', 1)->first()['label'];
            }

            if ($this->estado_cord_sennova != NULL && request()->isMethod('GET')) {
                $estadosEvaluacion = collect(json_decode($this->estado_cord_sennova, true));
                $estadoEvaluacion = $estadosEvaluacion['estado'];
            }

            return collect(['estado' => $estadoEvaluacion, 'puntaje' => $puntajeTotal, 'numeroRecomendaciones' => $totalRecomendaciones, 'evaluacionesHabilitadas' => $cantidadEvaluaciones, 'evaluacionesFinalizadas' => $evaluacionesFinalizadas, 'requiereSubsanar' => $requiereSubsanar, 'alerta' => $alerta]);
        }
    }

    /**
     * getEstadoEvaluacionServiciosTecnologicosAttribute - Estrategia regional
     *
     * @return void
     */
    public function getEstadoEvaluacionServiciosTecnologicosAttribute()
    {
        if ($this->servicioTecnologico()->exists()) {

            $evaluaciones = $this->evaluaciones()->where('habilitado', true)->get();
            $evaluacionesFinalizadas = $this->evaluaciones()->where('habilitado', true)->where('finalizado', true)->count();

            $puntajeTotal = 0;
            $totalRecomendaciones = 0;
            $estadoEvaluacion = '';
            $causalRechazo  = null;
            $requiereSubsanar = false;
            $totalPresupuestosEvaluados = 0;
            $countPresupuestoNoAprobado = 0;

            $estados = array(1, 2);

            foreach ($evaluaciones as $key => $evaluacion) {
                $puntajeTotal += $evaluacion->total_evaluacion;
                $totalRecomendaciones += $evaluacion->total_recomendaciones;

                // Sumar los presupuesto no aprobados
                $totalPresupuestosEvaluados += $evaluacion->proyectoPresupuestosEvaluaciones()->count();
                foreach ($evaluacion->proyectoPresupuestosEvaluaciones()->get() as $presupuestoEvaluacion) {
                    $presupuestoEvaluacion->correcto == false ? $countPresupuestoNoAprobado++ : null;
                }

                array_push($estados, $this->estadoEvaluacionServiciosTecnologicos($evaluacion->total_evaluacion, $totalRecomendaciones, $requiereSubsanar)['id']);

                if ($causalRechazo == null) {
                    switch ($evaluacion) {
                        case $evaluacion->servicioTecnologicoEvaluacion()->exists():
                            // if ($evaluacion->evaluacionCausalesRechazo()->where('causal_rechazo', '=', 4)->first()) {
                            //     $causalRechazo = 'En revisión por Cord. SENNOVA';
                            // } else if ($evaluacion->evaluacionCausalesRechazo()->whereIn('causal_rechazo', [1, 2, 3])->first()) {
                            //     $causalRechazo = 'Rechazado - Causal de rechazo';
                            // }

                            if ($evaluacion->servicioTecnologicoEvaluacion->anexos_comentario != null) {
                                $requiereSubsanar = true;
                            }
                            break;

                        default:
                            break;
                    }
                }

                // if ($causalRechazo == null && $evaluacion->proyectoPresupuestosEvaluaciones()->count() > 0) {
                //     $countPresupuestoNoAprobado >= floor($totalPresupuestosEvaluados * 0.8) ? $causalRechazo = 'Rechazado - No cumple con el presupuesto' : $causalRechazo = null;
                // }
            }

            $cantidadEvaluaciones = count($evaluaciones);

            $sq = 0;
            $sq = $this->getDesviacionEstandarAttribute();
            $alerta = null;
            if (in_array(2, $estados) && $sq >= 25  || in_array(3, $estados) && $sq >= 25) {
                if (in_array(2, $estados)) {
                    $estadoArr = 'Pre-aprobado';
                } else if (in_array(3, $estados)) {
                    $estadoArr = 'Pre-aprobado con observaciones';
                }
                $alerta = "Hay una evaluación en estado '{$estadoArr}' y la desviación estándar de las {$cantidadEvaluaciones} evaluaciones es {$sq}.";
            }

            $cantidadEvaluaciones > 0 ? $puntajeTotal = $puntajeTotal / $cantidadEvaluaciones : $puntajeTotal = 0;

            if ($causalRechazo == null && $cantidadEvaluaciones > 0) {
                $estadoEvaluacion = $this->estadoEvaluacionServiciosTecnologicos($puntajeTotal, $totalRecomendaciones, $requiereSubsanar)['estado'];
                $requiereSubsanar = $this->estadoEvaluacionServiciosTecnologicos($puntajeTotal, $totalRecomendaciones, $requiereSubsanar)['requiereSubsanar'];
            } else {
                $estadoEvaluacion = $causalRechazo;
            }

            if ($cantidadEvaluaciones == 0) {
                $estadosEvaluacion = collect(json_decode(Storage::get('json/estados_evaluacion_st.json'), true));
                $estadoEvaluacion = $estadosEvaluacion->where('value', 1)->first()['label'];
            }

            if ($this->estado_cord_sennova != NULL && request()->isMethod('GET')) {
                $estadosEvaluacion = collect(json_decode($this->estado_cord_sennova, true));
                $estadoEvaluacion = $estadosEvaluacion['estado'];
            }

            return collect(['estado' => $estadoEvaluacion, 'puntaje' => $puntajeTotal, 'numeroRecomendaciones' => $totalRecomendaciones, 'evaluacionesHabilitadas' => $cantidadEvaluaciones, 'evaluacionesFinalizadas' => $evaluacionesFinalizadas, 'requiereSubsanar' => $requiereSubsanar, 'alerta' => $alerta]);
        }
    }

    /**
     * getEstadoEvaluacionTaAttribute - Tecnoacademia
     *
     * @return void
     */
    public function getEstadoEvaluacionTaAttribute()
    {
        if ($this->ta()->exists()) {

            $evaluaciones = $this->evaluaciones()->where('habilitado', true)->get();
            $evaluacionesFinalizadas = $this->evaluaciones()->where('habilitado', true)->where('finalizado', true)->count();
            $cantidadEvaluaciones = count($evaluaciones);

            $totalRecomendaciones = 0;
            $requiereSubsanar = false;
            $totalPresupuestosEvaluados = 0;
            $countPresupuestoNoAprobado = 0;

            foreach ($evaluaciones as $key => $evaluacion) {
                $totalRecomendaciones += $evaluacion->total_recomendaciones;

                if ($evaluacion->taEvaluacion->anexos_comentario != null) {
                    $requiereSubsanar = true;
                }

                // Sumar los presupuestos no aprobados
                $totalPresupuestosEvaluados += $evaluacion->proyectoPresupuestosEvaluaciones()->count();
                foreach ($evaluacion->proyectoPresupuestosEvaluaciones()->get() as $presupuestoEvaluacion) {
                    $presupuestoEvaluacion->correcto == false ? $countPresupuestoNoAprobado++ : null;
                }
            }

            $estadoEvaluacion = null;

            $estadoEvaluacion = $totalRecomendaciones == 0 &&  $evaluacionesFinalizadas > 0 ? 'Cumple' : ($totalRecomendaciones == 0 &&  $evaluacionesFinalizadas == 0 ? 'No priorizado' : 'Proyecto con asignación de apoyo técnico para la formulación');
            $requiereSubsanar = $totalRecomendaciones == 0 &&  $evaluacionesFinalizadas > 0 ? false : ($totalRecomendaciones == 0 &&  $evaluacionesFinalizadas == 0 ? false : true);

            if ($this->estado_cord_sennova != NULL && request()->isMethod('GET')) {
                $estadosEvaluacion = collect(json_decode($this->estado_cord_sennova, true));
                $estadoEvaluacion = $estadosEvaluacion['estado'];
            }

            return collect(['estado' => $estadoEvaluacion, 'numeroRecomendaciones' => $totalRecomendaciones, 'evaluacionesHabilitadas' => $cantidadEvaluaciones, 'evaluacionesFinalizadas' => $evaluacionesFinalizadas, 'requiereSubsanar' => $requiereSubsanar, 'alerta' => null]);
        }
    }

    /**
     * getEstadoEvaluacionTpAttribute - Tecnoacademia
     *
     * @return void
     */
    public function getEstadoEvaluacionTpAttribute()
    {
        if ($this->tp()->exists()) {
            $evaluaciones = $this->evaluaciones()->where('habilitado', true)->get();
            $evaluacionesFinalizadas = $this->evaluaciones()->where('habilitado', true)->where('finalizado', true)->count();
            $cantidadEvaluaciones = count($evaluaciones);

            $totalRecomendaciones = 0;
            $requiereSubsanar = false;
            $totalPresupuestosEvaluados = 0;
            $countPresupuestoNoAprobado = 0;


            foreach ($evaluaciones as $evaluacion) {
                $totalRecomendaciones += $evaluacion->total_recomendaciones;

                if ($evaluacion->tpEvaluacion->anexos_comentario != null) {
                    $requiereSubsanar = true;
                }

                // Sumar los presupuestos no aprobados
                $totalPresupuestosEvaluados += $evaluacion->proyectoPresupuestosEvaluaciones()->count();
                foreach ($evaluacion->proyectoPresupuestosEvaluaciones()->get() as $presupuestoEvaluacion) {
                    $presupuestoEvaluacion->correcto == false ? $countPresupuestoNoAprobado++ : null;
                }
            }

            $estadoEvaluacion = null;

            $estadoEvaluacion = $totalRecomendaciones == 0 &&  $evaluacionesFinalizadas > 0 ? 'Cumple' : ($totalRecomendaciones == 0 &&  $evaluacionesFinalizadas == 0 ? 'No priorizado' : 'Proyecto con asignación de apoyo técnico para la formulación');
            $requiereSubsanar = $totalRecomendaciones == 0 &&  $evaluacionesFinalizadas > 0 ? false : ($totalRecomendaciones == 0 &&  $evaluacionesFinalizadas == 0 ? false : true);

            if ($this->estado_cord_sennova != NULL && request()->isMethod('GET')) {
                $estadosEvaluacion = collect(json_decode($this->estado_cord_sennova, true));
                $estadoEvaluacion = $estadosEvaluacion['estado'];
            }

            return collect(['estado' => $estadoEvaluacion, 'numeroRecomendaciones' => $totalRecomendaciones, 'evaluacionesHabilitadas' => $cantidadEvaluaciones, 'evaluacionesFinalizadas' => $evaluacionesFinalizadas, 'requiereSubsanar' => $requiereSubsanar, 'alerta' => null]);
        }
    }

    /**
     * estadoEvaluacionIdi
     *
     * @param  mixed $puntajeTotal
     * @param  mixed $totalRecomendaciones
     * @param  mixed $requiereSubsanar
     * @param  mixed $causalRechazo
     * @return void
     */
    public function estadoEvaluacionIdi($puntajeTotal, $totalRecomendaciones, $requiereSubsanar, $causalRechazo)
    {
        $estadosEvaluacion = collect(json_decode(Storage::get('json/estados_evaluacion.json'), true));

        $id = null;
        $estadoEvaluacion = '';
        if ($puntajeTotal == 0 && $totalRecomendaciones == 0) {
            $estadoEvaluacion = $estadosEvaluacion->where('value', 1)->first()['label'];
            $id = $estadosEvaluacion->where('value', 1)->first()['value'];
        } elseif ($puntajeTotal >= 91 && $totalRecomendaciones == 0) { // Preaprobado - No requiere ser subsanado
            $estadoEvaluacion = $estadosEvaluacion->where('value', 2)->first()['label'];
            $id = $estadosEvaluacion->where('value', 2)->first()['value'];
        } elseif ($puntajeTotal >= 91 && $totalRecomendaciones > 0) { // Pre-aprobado con observaciones
            $estadoEvaluacion = $estadosEvaluacion->where('value', 3)->first()['label'];
            $id = $estadosEvaluacion->where('value', 3)->first()['value'];
            $requiereSubsanar = true;
        } elseif ($puntajeTotal >= 70 && $puntajeTotal < 91 && $totalRecomendaciones == 0) { // Pre-aprobado con observaciones
            $estadoEvaluacion = $estadosEvaluacion->where('value', 3)->first()['label'];
            $id = $estadosEvaluacion->where('value', 3)->first()['value'];
            $requiereSubsanar = true;
        } elseif ($puntajeTotal >= 70 && $puntajeTotal < 91 && $totalRecomendaciones > 0) { // Pre-aprobado con observaciones
            $estadoEvaluacion = $estadosEvaluacion->where('value', 3)->first()['label'];
            $id = $estadosEvaluacion->where('value', 3)->first()['value'];
            $requiereSubsanar = true;
        } elseif ($puntajeTotal < 70) { // Rechazado - No requiere ser subsanado
            $estadoEvaluacion = $estadosEvaluacion->where('value', 4)->first()['label'];
            $id = $estadosEvaluacion->where('value', 4)->first()['value'];
            $requiereSubsanar = false;
        }

        if ($causalRechazo) {
            $estadoEvaluacion = $causalRechazo;
        }

        return collect(['id' => $id, 'estado' => $estadoEvaluacion, 'requiereSubsanar' => $requiereSubsanar]);
    }

    /**
     * estadoEvaluacionIdi
     *
     * @param  mixed $puntajeTotal
     * @param  mixed $totalRecomendaciones
     * @param  mixed $requiereSubsanar
     * @return void
     */
    public function estadoEvaluacionServiciosTecnologicos($puntajeTotal, $totalRecomendaciones, $requiereSubsanar)
    {
        $estadosEvaluacion = collect(json_decode(Storage::get('json/estados_evaluacion_st.json'), true));

        $id = null;
        $estadoEvaluacion = '';
        if ($puntajeTotal == 0 && $totalRecomendaciones == 0) {
            $estadoEvaluacion = $estadosEvaluacion->where('value', 1)->first()['label'];
            $id = $estadosEvaluacion->where('value', 1)->first()['value'];
        } elseif ($puntajeTotal >= 90 && $totalRecomendaciones == 0) { // Pre-aprobado
            $estadoEvaluacion = $estadosEvaluacion->where('value', 2)->first()['label'];
            $id = $estadosEvaluacion->where('value', 2)->first()['value'];
        } elseif ($puntajeTotal >= 90 && $totalRecomendaciones >= 0) { // Pre-aprobado con observaciones
            $estadoEvaluacion = $estadosEvaluacion->where('value', 5)->first()['label'];
            $id = $estadosEvaluacion->where('value', 5)->first()['value'];
            $requiereSubsanar = true;
        } elseif ($puntajeTotal >= 70 && $puntajeTotal < 90 && $totalRecomendaciones >= 0) { // Pre-aprobado con observaciones
            $estadoEvaluacion = $estadosEvaluacion->where('value', 5)->first()['label'];
            $id = $estadosEvaluacion->where('value', 5)->first()['value'];
            $requiereSubsanar = true;
        } elseif ($puntajeTotal >= 0 && $puntajeTotal <= 69 && $totalRecomendaciones >= 0) { // Rechazado
            $estadoEvaluacion = $estadosEvaluacion->where('value', 3)->first()['label'];
            $id = $estadosEvaluacion->where('value', 3)->first()['value'];
        }

        return collect(['id' => $id, 'estado' => $estadoEvaluacion, 'requiereSubsanar' => $requiereSubsanar]);
    }


    /**
     * estadoEvaluacionCulturaInnovacion
     *
     * @param  mixed $puntajeTotal
     * @param  mixed $totalRecomendaciones
     * @param  mixed $requiereSubsanar
     * @return void
     */
    public function estadoEvaluacionCulturaInnovacion($puntajeTotal, $totalRecomendaciones, $requiereSubsanar)
    {
        $id = null;
        $estadoEvaluacion = '';
        if ($puntajeTotal == 0 && $totalRecomendaciones == 0) {
            $estadoEvaluacion = 'No priorizado anexo 1C. Comuníquese con el Dinamizador SENNOVA.';
            $id = 1;
        } elseif ($puntajeTotal >= 70) { // Cumple
            $estadoEvaluacion = 'Cumple';
            $id = 2;
        } elseif ($puntajeTotal >= 0 && $puntajeTotal <= 69) { // Cumple
            $estadoEvaluacion = 'Proyecto con asignación de apoyo técnico para la formulación';
            $id = 2;
        }

        $requiereSubsanar = $totalRecomendaciones > 0 ? true : false;

        return collect(['id' => $id, 'estado' => $estadoEvaluacion, 'requiereSubsanar' => $requiereSubsanar]);
    }

    public function getDesviacionEstandarAttribute()
    {
        $evaluaciones = $this->evaluaciones()->where('habilitado', true)->get();
        $nums = [];
        $sample = true;
        $dvst = 0;

        foreach ($evaluaciones as $evaluacion) {
            array_push($nums, $evaluacion->total_evaluacion);
        }
        if (count($nums) > 0 && ($sample ? count($nums) - 1 : count($nums)) > 0) {
            $fMean = array_sum($nums) / count($nums);
            $fVariance = 0.0;
            foreach ($nums as $i) {
                $fVariance += pow($i - $fMean, 2);
            }

            $fVariance /= ($sample ? count($nums) - 1 : count($nums));

            $dvst = (float) sqrt($fVariance);
        }

        return $dvst;
    }

    public function updateValoresProyecto()
    {
        $proyecto = $this;
        $proyecto->update(['precio_proyecto' => $proyecto->precio_proyecto]);
        switch ($proyecto) {
            case $proyecto->estado_evaluacion_idi != null:
                $proyecto->update(['estado' => $proyecto->estado_evaluacion_idi]);
                break;
            case $proyecto->estado_evaluacion_cultura_innovacion != null:
                $proyecto->update(['estado' => $proyecto->estado_evaluacion_cultura_innovacion]);
                break;
            case $proyecto->estado_evaluacion_ta != null:
                $proyecto->update(['estado' => $proyecto->estado_evaluacion_ta]);
                break;
            case $proyecto->estado_evaluacion_tp != null:
                $proyecto->update(['estado' => $proyecto->estado_evaluacion_tp]);
                break;
            case $proyecto->estado_evaluacion_servicios_tecnologicos != null:
                $proyecto->update(['estado' => $proyecto->estado_evaluacion_servicios_tecnologicos]);
                break;
            default:
                break;
        }
    }

    public function getAllFilesAttribute()
    {
        $collect = collect([]);
        foreach ($this->proyectoPresupuesto()->get() as $presupuesto) {
            if ($presupuesto->formato_estudio_mercado) {
                $collect->push(['id' => $presupuesto->id, 'tipo_archivo' => 'formato_estudio_mercado', 'ruta_formato_estudio_mercado' => $presupuesto->formato_estudio_mercado]);
            }
            foreach ($presupuesto->soportesEstudioMercado()->get() as $estudioMercado) {
                $collect->push(['id' => $estudioMercado->id, 'tipo_archivo' => 'soporte', 'empresa' => $estudioMercado->empresa, 'ruta_soporte' => $estudioMercado->soporte]);
            }
        }

        foreach ($this->entidadesAliadas()->get() as $entidadAliada) {
            if ($entidadAliada->entidadAliadaIdi()->exists()) {
                $collect->push(['id' => $entidadAliada->id, 'tipo_archivo' => 'carta_intencion', 'entidad_aliada' => $entidadAliada->nombre, 'ruta_carta_intencion' => $entidadAliada->entidadAliadaIdi->carta_intencion]);
                $collect->push(['id' => $entidadAliada->id, 'tipo_archivo' => 'carta_propiedad_intelectual', 'entidad_aliada' => $entidadAliada->nombre, 'ruta_carta_propiedad_intelectual' => $entidadAliada->entidadAliadaIdi->carta_propiedad_intelectual]);
            } else if ($entidadAliada->entidadAliadaTaTp()->exists()) {
                $collect->push(['id' => $entidadAliada->id, 'tipo_archivo' => 'soporte_convenio', 'entidad_aliada' => $entidadAliada->nombre, 'ruta_soporte_convenio' => $entidadAliada->entidadAliadaTaTp->soporte_convenio]);
            }
        }

        foreach ($this->proyectoAnexo()->get() as $proyectoAnexo) {
            $collect->push(['id' => $proyectoAnexo->id, 'tipo_archivo' => 'archivo', 'anexo' => $proyectoAnexo->anexo->nombre, 'ruta_archivo' => $proyectoAnexo->archivo]);
        }

        return $collect;
    }

    public function getResultadosAttribute()
    {
        return Resultado::select('objetivos_especificos.numero', 'resultados.*')->join('efectos_directos', 'resultados.efecto_directo_id', 'efectos_directos.id')
            ->join('objetivos_especificos', 'resultados.objetivo_especifico_id', 'objetivos_especificos.id')
            ->where('efectos_directos.proyecto_id', $this->id)
            ->orderBy('objetivos_especificos.numero')
            ->get();
    }

    public function getAllowedAttribute()
    {
        $allowedToView      = Gate::inspect('visualizar-proyecto-autor', $this);
        $allowedToUpdate    = Gate::inspect('modificar-proyecto-autor', $this);
        $allowedToDestroy   = Gate::inspect('eliminar-proyecto-autor', $this);

        return collect(['to_view' => $allowedToView->allowed(), 'to_update' => $allowedToUpdate->allowed(), 'to_destroy' => $allowedToDestroy->allowed()]);
    }
}
