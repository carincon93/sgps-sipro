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
    protected $appends = ['codigo', 'diff_meses', 'precio_proyecto', 'total_roles_sennova', 'fecha_inicio', 'fecha_finalizacion', 'estado_evaluacion_proyecto_linea_66', 'estado_evaluacion_proyecto_linea_65', 'estado_evaluacion_proyecto_linea_70', 'estado_evaluacion_proyecto_linea_69', 'estado_evaluacion_proyecto_linea_68', 'cantidad_objetivos', 'total_proyecto_presupuesto_aprobado', 'total_roles_sennova_aprobado', 'precio_proyecto_aprobado', 'all_files', 'allowed', 'resultados'];

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
     * Relationship with ProyectoLinea66
     *
     * @return object
     */
    public function proyectoLinea66()
    {
        return $this->hasOne(ProyectoLinea66::class, 'id');
    }

    /**
     * Relationship with ProyectoLinea65
     *
     * @return object
     */
    public function proyectoLinea65()
    {
        return $this->hasOne(ProyectoLinea65::class, 'id');
    }

    /**
     * Relationship with ProyectoLinea68
     *
     * @return object
     */
    public function proyectoLinea68()
    {
        return $this->hasOne(ProyectoLinea68::class, 'id');
    }

    /**
     * Relationship with ProyectoHubLinea69
     *
     * @return object
     */
    public function proyectoHubLinea69()
    {
        return $this->hasOne(ProyectoHubLinea69::class, 'id');
    }

    /**
     * Relationship with ProyectoLinea69
     *
     * @return object
     */
    public function proyectoLinea69()
    {
        return $this->hasOne(ProyectoLinea69::class, 'id');
    }

    /**
     * Relationship with ProyectoLinea70
     *
     * @return object
     */
    public function proyectoLinea70()
    {
        return $this->hasOne(ProyectoLinea70::class, 'id');
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
     * Relationship with ProyectoProyectoLinea66Tecnoacademia
     *
     * @return object
     */
    public function proyectosProyectoLinea66Tecnoacademia()
    {
        return $this->hasMany(ProyectoProyectoLinea66Tecnoacademia::class);
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
    public function programasFormacionLinea70()
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

    public static function getLog($proyecto_id)
    {
        return DB::table('notifications')->select('data', 'created_at')->whereRaw("data->>'proyectoId' = '" . $proyecto_id . "'")->where('type', '!=', 'App\Notifications\EvaluacionFinalizada')->orderBy('created_at', 'DESC')->get();
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
        $fecha_finalizacion = null;
        if ($this->proyectoLinea66()->exists()) $fecha_finalizacion =  $this->proyectoLinea66->fecha_finalizacion;
        if ($this->proyectoLinea70()->exists()) $fecha_finalizacion =  $this->proyectoLinea70->fecha_finalizacion;
        if ($this->proyectoLinea69()->exists()) $fecha_finalizacion =  $this->proyectoLinea69->fecha_finalizacion;
        if ($this->proyectoLinea68()->exists()) $fecha_finalizacion =  $this->proyectoLinea68->fecha_finalizacion;
        if ($this->proyectoLinea65()->exists()) $fecha_finalizacion =  $this->proyectoLinea65->fecha_finalizacion;
        $codigo = 'SGPS-' . ($this->id + 8000) . '-' . date('Y', strtotime($fecha_finalizacion));
        if ($this->proyectoDemo()->exists()) {
            $numero_consecutivo = sprintf("%05s", $this->proyectoDemo->id);
            $codigo = 'DEMO-' . $numero_consecutivo . '-' . date('Y', strtotime($fecha_finalizacion));
            $fecha_finalizacion =  $this->proyectoLinea66->fecha_finalizacion;
        }

        return $codigo;
    }

    public function getFechaInicioAttribute()
    {
        $fecha_inicio = null;
        if ($this->proyectoLinea66()->exists()) {
            $fecha_inicio = $this->proyectoLinea66->fecha_inicio;
        } else if ($this->proyectoLinea70()->exists()) {
            $fecha_inicio = $this->proyectoLinea70->fecha_inicio;
        } else if ($this->proyectoLinea69()->exists()) {
            $fecha_inicio = $this->proyectoLinea69->fecha_inicio;
        } else if ($this->proyectoLinea68()->exists()) {
            $fecha_inicio = $this->proyectoLinea68->fecha_inicio;
        } else if ($this->proyectoLinea65()->exists()) {
            $fecha_inicio = $this->proyectoLinea65->fecha_inicio;
        }

        return $fecha_inicio;
    }

    public function getFechaFinalizacionAttribute()
    {
        $fecha_inicio = null;
        if ($this->proyectoLinea66()->exists()) {
            $fecha_inicio = $this->proyectoLinea66->fecha_finalizacion;
        } else if ($this->proyectoLinea70()->exists()) {
            $fecha_inicio = $this->proyectoLinea70->fecha_finalizacion;
        } else if ($this->proyectoLinea69()->exists()) {
            $fecha_inicio = $this->proyectoLinea69->fecha_finalizacion;
        } else if ($this->proyectoLinea68()->exists()) {
            $fecha_inicio = $this->proyectoLinea68->fecha_finalizacion;
        } else if ($this->proyectoLinea65()->exists()) {
            $fecha_inicio = $this->proyectoLinea65->fecha_finalizacion;
        }

        return $fecha_inicio;
    }

    /**
     * getDiffMesesAttribute
     *
     * @return int
     */
    public function getDiffMesesAttribute()
    {
        $cantidad_meses_ejecucion = 0;
        if ($this->proyectoLinea66()->exists()) {
            $cantidad_meses_ejecucion = $this->proyectoLinea66->max_meses_ejecucion;
        }

        if ($this->proyectoLinea70()->exists()) {
            $cantidad_meses_ejecucion = $this->proyectoLinea70->max_meses_ejecucion;
        }

        if ($this->proyectoLinea69()->exists()) {
            $cantidad_meses_ejecucion = $this->proyectoLinea69->max_meses_ejecucion;
        }

        if ($this->proyectoLinea68()->exists()) {
            $cantidad_meses_ejecucion = $this->proyectoLinea68->max_meses_ejecucion;
        }

        if ($this->proyectoLinea65()->exists()) {
            $cantidad_meses_ejecucion = $this->proyectoLinea65->max_meses_ejecucion;
        }

        return $cantidad_meses_ejecucion;
    }

    /**
     * getTotalProyectoPresupuestoAttribute
     *
     * @return int
     */
    public function getTotalProyectoPresupuestoAttribute()
    {
        $total = 0;

        $rubros_suman_al_presupuesto = true;
        foreach ($this->proyectoPresupuesto as $proyecto_presupuesto) {
            $data = $proyecto_presupuesto->convocatoriaProyectoRubrosPresupuestales()->select('convocatoria_presupuesto.id', 'convocatoria_presupuesto.sumar_al_presupuesto')->get()->pluck(['sumar_al_presupuesto']);

            foreach ($data as $item) {
                if (!$item) {
                    $rubros_suman_al_presupuesto = false;
                    break;
                }
            }

            if ($rubros_suman_al_presupuesto) {
                $total += $proyecto_presupuesto->valor_total;
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

        foreach ($this->proyectoRolesSennova as $proyecto_rol_sennova) {
            if ($proyecto_rol_sennova->convocatoriaRolSennova->rolSennova->sumar_al_presupuesto) {
                $total += $proyecto_rol_sennova->getTotalRolSennova();
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

        $rubros_suman_al_presupuesto = true;
        foreach ($this->proyectoPresupuesto as $proyecto_presupuesto) {
            $data = $proyecto_presupuesto->convocatoriaProyectoRubrosPresupuestales()->select('convocatoria_presupuesto.id', 'convocatoria_presupuesto.sumar_al_presupuesto')->get()->pluck(['sumar_al_presupuesto']);

            foreach ($data as $item) {
                if (!$item) {
                    $rubros_suman_al_presupuesto = false;
                    break;
                }
            }

            if ($rubros_suman_al_presupuesto && $proyecto_presupuesto->getPresupuestoAprobadoAttribute()) {
                $total += $proyecto_presupuesto->valor_total;
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

        foreach ($this->proyectoRolesSennova as $proyecto_rol_sennova) {
            if ($proyecto_rol_sennova->convocatoriaRolSennova->rolSennova->sumar_al_presupuesto && $proyecto_rol_sennova->getRolAprobadoAttribute()) {
                $total += $proyecto_rol_sennova->getTotalRolSennova();
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
        $numero_objetivos = 0;

        foreach ($this->causasDirectas as $causa_directa) {
            strlen($causa_directa->objetivoEspecifico->descripcion) > 10 ? $numero_objetivos++ : null;
        }

        return $numero_objetivos;
    }

    /**
     * getEstadoEvaluacionProyectoLinea66Attribute - Estrategia regional
     *
     * @return void
     */
    public function getEstadoEvaluacionProyectoLinea66Attribute()
    {
        if ($this->proyectoLinea66()->exists()) {
            $convocatoria = Convocatoria::select('fase')->where('esta_activa', true)->first();
            $evaluaciones = $this->evaluaciones()->where('habilitado', true)->get();
            $evaluaciones_finalizadas = $this->evaluaciones()->where('habilitado', true)->where('finalizado', true)->count();

            $puntaje_total = 0;
            $total_recomendaciones = 0;
            $estado_evaluacion = '';
            $causal_rechazo  = null;
            $requiere_subsanar = false;
            $total_presupuestos_evaluados = 0;

            $estados = array(1, 2);

            foreach ($evaluaciones as $key => $evaluacion) {
                $puntaje_total += $evaluacion->total_evaluacion;
                $total_recomendaciones += $evaluacion->total_recomendaciones;

                array_push($estados, $this->estadoEvaluacionProyectoLinea66($evaluacion->total_evaluacion, $total_recomendaciones, $requiere_subsanar, null)['id']);

                if ($causal_rechazo == null) {

                    switch ($evaluacion) {
                        case $evaluacion->evaluacionProyectoLinea66()->exists():

                            if ($evaluacion->evaluacionCausalesRechazo()->where('causal_rechazo', '=', 4)->first()) {
                                $causal_rechazo = 'En revisión por Cord. SENNOVA';
                            } else if ($evaluacion->evaluacionCausalesRechazo()->whereIn('causal_rechazo', [1, 2, 3])->first()) {
                                $causal_rechazo = 'Rechazado - Por causal de rechazo';
                            }

                            if ($evaluacion->evaluacionProyectoLinea66->anexos_comentario != null) {
                                $requiere_subsanar = true;
                            }
                            break;

                        default:
                            break;
                    }
                }

                if ($causal_rechazo == null && $evaluacion->proyectoPresupuestosEvaluaciones()->count() > 0 && $convocatoria->fase == 5) {
                    $this->precio_proyecto - $this->getPrecioProyectoAprobadoAttribute() >= floor($this->precio_proyecto * 0.8) ? $causal_rechazo = 'Rechazado - No cumple con el presupuesto' : $causal_rechazo = null;
                }
            }

            $cantidad_evaluaciones = count($evaluaciones);

            $sq = 0;
            $sq = $this->getDesviacionEstandarAttribute();
            $alerta = null;
            if (in_array(2, $estados) && $sq >= 25  || in_array(3, $estados) && $sq >= 25) {
                if (in_array(2, $estados)) {
                    $estadoArr = 'Pre-aprobado';
                } else if (in_array(3, $estados)) {
                    $estadoArr = 'Pre-aprobado con observaciones';
                }
                $alerta = "Hay una evaluación en estado '{$estadoArr}' y la desviación estándar de las {$cantidad_evaluaciones} evaluaciones es {$sq}.";
            }

            $cantidad_evaluaciones > 0 ? $puntaje_total = $puntaje_total / $cantidad_evaluaciones : $puntaje_total = 0;

            if ($causal_rechazo == null && $cantidad_evaluaciones > 0) {
                $estado_evaluacion = $this->estadoEvaluacionProyectoLinea66($puntaje_total, $total_recomendaciones, $requiere_subsanar, null)['estado'];
                $requiere_subsanar = $this->estadoEvaluacionProyectoLinea66($puntaje_total, $total_recomendaciones, $requiere_subsanar, null)['requiere_subsanar'];
            } else {
                $estado_evaluacion = $causal_rechazo;
            }

            if ($cantidad_evaluaciones == 0) {
                $estados_evaluacion = collect(json_decode(Storage::get('json/estados_evaluacion.json'), true));
                $estado_evaluacion  = $estados_evaluacion->where('value', 1)->first()['label'];
            }

            if ($this->estado_cord_sennova != NULL && request()->isMethod('GET')) {
                $estados_evaluacion = collect(json_decode($this->estado_cord_sennova, true));
                $estado_evaluacion  = $estados_evaluacion['estado'];
            }

            return collect(['estado' => $estado_evaluacion, 'puntaje' => $puntaje_total, 'numero_recomendaciones' => $total_recomendaciones, 'evaluaciones_habilitadas' => $cantidad_evaluaciones, 'evaluaciones_finalizadas' => $evaluaciones_finalizadas, 'requiere_subsanar' => $requiere_subsanar, 'alerta' => $alerta]);
        }
    }

    /**
     * getEstadoEvaluacionProyectoLinea65Attribute
     *
     * @return void
     */
    public function getEstadoEvaluacionProyectoLinea65Attribute()
    {
        if ($this->proyectoLinea65()->exists()) {

            $evaluaciones                   = $this->evaluaciones()->where('habilitado', true)->get();
            $evaluaciones_finalizadas       = $this->evaluaciones()->where('habilitado', true)->where('finalizado', true)->count();

            $puntaje_total                  = 0;
            $total_recomendaciones          = 0;
            $estado_evaluacion              = '';
            $causal_rechazo                 = null;
            $requiere_subsanar              = false;
            $total_presupuestos_evaluados   = 0;
            $count_presupuesto_no_aprobado  = 0;

            $estados = array(1, 2);

            foreach ($evaluaciones as $evaluacion) {
                $puntaje_total += $evaluacion->total_evaluacion;
                $total_recomendaciones += $evaluacion->total_recomendaciones;

                // Sumar los presupuesto no aprobados
                $total_presupuestos_evaluados += $evaluacion->proyectoPresupuestosEvaluaciones()->count();

                foreach ($evaluacion->proyectoPresupuestosEvaluaciones()->get() as $presupuesto_evaluacion) {
                    $presupuesto_evaluacion->correcto == false ? $count_presupuesto_no_aprobado++ : null;
                }

                array_push($estados, $this->estadoEvaluacionProyectoLinea65($evaluacion->total_evaluacion, $total_recomendaciones, $requiere_subsanar)['id']);

                if ($causal_rechazo == null) {
                    switch ($evaluacion) {
                        case $evaluacion->evaluacionProyectoLinea65()->exists():
                            if ($evaluacion->evaluacionProyectoLinea65->anexos_comentario != null) {
                                $requiere_subsanar = true;
                            }
                            break;

                        default:
                            break;
                    }
                }

                // if ($causal_rechazo == null && $evaluacion->proyectoPresupuestosEvaluaciones()->count() > 0) {
                //     $count_presupuesto_no_aprobado >= floor($total_presupuestos_evaluados * 0.8) ? $causal_rechazo = 'Rechazado - No cumple con el presupuesto' : $causal_rechazo = null;
                // }
            }

            $cantidad_evaluaciones = count($evaluaciones);

            $sq = 0;
            $sq = $this->getDesviacionEstandarAttribute();
            $alerta = null;
            if (in_array(2, $estados) && $sq >= 25  || in_array(3, $estados) && $sq >= 25) {
                if (in_array(2, $estados)) {
                    $estadoArr = 'Pre-aprobado';
                } else if (in_array(3, $estados)) {
                    $estadoArr = 'Pre-aprobado con observaciones';
                }
                $alerta = "Hay una evaluación en estado '{$estadoArr}' y la desviación estándar de las {$cantidad_evaluaciones} evaluaciones es {$sq}.";
            }

            $cantidad_evaluaciones > 0 ? $puntaje_total = $puntaje_total / $cantidad_evaluaciones : $puntaje_total = 0;

            if ($causal_rechazo == null && $cantidad_evaluaciones > 0) {
                $estado_evaluacion = $this->estadoEvaluacionProyectoLinea65($puntaje_total, $total_recomendaciones, $requiere_subsanar)['estado'];
                $requiere_subsanar = $this->estadoEvaluacionProyectoLinea65($puntaje_total, $total_recomendaciones, $requiere_subsanar)['requiere_subsanar'];
            } else {
                $estado_evaluacion = $causal_rechazo;
            }

            if ($cantidad_evaluaciones == 0) {
                $estados_evaluacion = collect(json_decode(Storage::get('json/estados_evaluacion.json'), true));
                $estado_evaluacion  = $estados_evaluacion->where('value', 1)->first()['label'];
            }

            if ($this->estado_cord_sennova != NULL && request()->isMethod('GET')) {
                $estados_evaluacion = collect(json_decode($this->estado_cord_sennova, true));
                $estado_evaluacion  = $estados_evaluacion['estado'];
            }

            return collect(['estado' => $estado_evaluacion, 'puntaje' => $puntaje_total, 'numero_recomendaciones' => $total_recomendaciones, 'evaluaciones_habilitadas' => $cantidad_evaluaciones, 'evaluaciones_finalizadas' => $evaluaciones_finalizadas, 'requiere_subsanar' => $requiere_subsanar, 'alerta' => $alerta]);
        }
    }

    /**
     * getEstadoEvaluacionProyectoLinea68Attribute - Estrategia regional
     *
     * @return void
     */
    public function getEstadoEvaluacionProyectoLinea68Attribute()
    {
        if ($this->proyectoLinea68()->exists()) {

            $evaluaciones                   = $this->evaluaciones()->where('habilitado', true)->get();
            $evaluaciones_finalizadas       = $this->evaluaciones()->where('habilitado', true)->where('finalizado', true)->count();

            $puntaje_total                  = 0;
            $total_recomendaciones          = 0;
            $estado_evaluacion              = '';
            $causal_rechazo                 = null;
            $requiere_subsanar              = false;
            $total_presupuestos_evaluados   = 0;
            $count_presupuesto_no_aprobado  = 0;

            $estados = array(1, 2);

            foreach ($evaluaciones as $evaluacion) {
                $puntaje_total += $evaluacion->total_evaluacion;
                $total_recomendaciones += $evaluacion->total_recomendaciones;

                // Sumar los presupuesto no aprobados
                $total_presupuestos_evaluados += $evaluacion->proyectoPresupuestosEvaluaciones()->count();
                foreach ($evaluacion->proyectoPresupuestosEvaluaciones()->get() as $presupuesto_evaluacion) {
                    $presupuesto_evaluacion->correcto == false ? $count_presupuesto_no_aprobado++ : null;
                }

                array_push($estados, $this->estadoEvaluacionProyectoLinea68($evaluacion->total_evaluacion, $total_recomendaciones, $requiere_subsanar)['id']);

                if ($causal_rechazo == null) {
                    switch ($evaluacion) {
                        case $evaluacion->evaluacionProyectoLinea68()->exists():
                            // if ($evaluacion->evaluacionCausalesRechazo()->where('causal_rechazo', '=', 4)->first()) {
                            //     $causal_rechazo = 'En revisión por Cord. SENNOVA';
                            // } else if ($evaluacion->evaluacionCausalesRechazo()->whereIn('causal_rechazo', [1, 2, 3])->first()) {
                            //     $causal_rechazo = 'Rechazado - Causal de rechazo';
                            // }

                            if ($evaluacion->evaluacionProyectoLinea68->anexos_comentario != null) {
                                $requiere_subsanar = true;
                            }
                            break;

                        default:
                            break;
                    }
                }

                // if ($causal_rechazo == null && $evaluacion->proyectoPresupuestosEvaluaciones()->count() > 0) {
                //     $count_presupuesto_no_aprobado >= floor($total_presupuestos_evaluados * 0.8) ? $causal_rechazo = 'Rechazado - No cumple con el presupuesto' : $causal_rechazo = null;
                // }
            }

            $cantidad_evaluaciones = count($evaluaciones);

            $sq = 0;
            $sq = $this->getDesviacionEstandarAttribute();
            $alerta = null;
            if (in_array(2, $estados) && $sq >= 25  || in_array(3, $estados) && $sq >= 25) {
                if (in_array(2, $estados)) {
                    $estadoArr = 'Pre-aprobado';
                } else if (in_array(3, $estados)) {
                    $estadoArr = 'Pre-aprobado con observaciones';
                }
                $alerta = "Hay una evaluación en estado '{$estadoArr}' y la desviación estándar de las {$cantidad_evaluaciones} evaluaciones es {$sq}.";
            }

            $cantidad_evaluaciones > 0 ? $puntaje_total = $puntaje_total / $cantidad_evaluaciones : $puntaje_total = 0;

            if ($causal_rechazo == null && $cantidad_evaluaciones > 0) {
                $estado_evaluacion = $this->estadoEvaluacionProyectoLinea68($puntaje_total, $total_recomendaciones, $requiere_subsanar)['estado'];
                $requiere_subsanar = $this->estadoEvaluacionProyectoLinea68($puntaje_total, $total_recomendaciones, $requiere_subsanar)['requiere_subsanar'];
            } else {
                $estado_evaluacion = $causal_rechazo;
            }

            if ($cantidad_evaluaciones == 0) {
                $estados_evaluacion = collect(json_decode(Storage::get('json/estados_evaluacion_st.json'), true));
                $estado_evaluacion = $estados_evaluacion->where('value', 1)->first()['label'];
            }

            if ($this->estado_cord_sennova != NULL && request()->isMethod('GET')) {
                $estados_evaluacion = collect(json_decode($this->estado_cord_sennova, true));
                $estado_evaluacion = $estados_evaluacion['estado'];
            }

            return collect(['estado' => $estado_evaluacion, 'puntaje' => $puntaje_total, 'numero_recomendaciones' => $total_recomendaciones, 'evaluaciones_habilitadas' => $cantidad_evaluaciones, 'evaluaciones_finalizadas' => $evaluaciones_finalizadas, 'requiere_subsanar' => $requiere_subsanar, 'alerta' => $alerta]);
        }
    }

    /**
     * getEstadoEvaluacionProyectoLinea70Attribute - Tecnoacademia
     *
     * @return void
     */
    public function getEstadoEvaluacionProyectoLinea70Attribute()
    {
        if ($this->proyectoLinea70()->exists()) {

            $evaluaciones = $this->evaluaciones()->where('habilitado', true)->get();
            $evaluaciones_finalizadas = $this->evaluaciones()->where('habilitado', true)->where('finalizado', true)->count();
            $cantidad_evaluaciones = count($evaluaciones);

            $total_recomendaciones = 0;
            $requiere_subsanar = false;
            $total_presupuestos_evaluados = 0;
            $count_presupuesto_no_aprobado = 0;

            foreach ($evaluaciones as $evaluacion) {
                $total_recomendaciones += $evaluacion->total_recomendaciones;

                if ($evaluacion->evaluacionProyectoLinea70->anexos_comentario != null) {
                    $requiere_subsanar = true;
                }

                // Sumar los presupuestos no aprobados
                $total_presupuestos_evaluados += $evaluacion->proyectoPresupuestosEvaluaciones()->count();
                foreach ($evaluacion->proyectoPresupuestosEvaluaciones()->get() as $presupuesto_evaluacion) {
                    $presupuesto_evaluacion->correcto == false ? $count_presupuesto_no_aprobado++ : null;
                }
            }

            $estado_evaluacion = null;

            $estado_evaluacion = $total_recomendaciones == 0 &&  $evaluaciones_finalizadas > 0 ? 'Cumple' : ($total_recomendaciones == 0 &&  $evaluaciones_finalizadas == 0 ? 'No priorizado' : 'Proyecto con asignación de apoyo técnico para la formulación');
            $requiere_subsanar = $total_recomendaciones == 0 &&  $evaluaciones_finalizadas > 0 ? false : ($total_recomendaciones == 0 &&  $evaluaciones_finalizadas == 0 ? false : true);

            if ($this->estado_cord_sennova != NULL && request()->isMethod('GET')) {
                $estados_evaluacion = collect(json_decode($this->estado_cord_sennova, true));
                $estado_evaluacion = $estados_evaluacion['estado'];
            }

            return collect(['estado' => $estado_evaluacion, 'numero_recomendaciones' => $total_recomendaciones, 'evaluaciones_habilitadas' => $cantidad_evaluaciones, 'evaluaciones_finalizadas' => $evaluaciones_finalizadas, 'requiere_subsanar' => $requiere_subsanar, 'alerta' => null]);
        }
    }

    /**
     * getEstadoEvaluacionProyectoLinea69Attribute - Tecnoacademia
     *
     * @return void
     */
    public function getEstadoEvaluacionProyectoLinea69Attribute()
    {
        if ($this->proyectoLinea69()->exists()) {
            $evaluaciones               = $this->evaluaciones()->where('habilitado', true)->get();
            $evaluaciones_finalizadas   = $this->evaluaciones()->where('habilitado', true)->where('finalizado', true)->count();
            $cantidad_evaluaciones      = count($evaluaciones);

            $total_recomendaciones          = 0;
            $requiere_subsanar              = false;
            $total_presupuestos_evaluados   = 0;
            $count_presupuesto_no_aprobado  = 0;


            foreach ($evaluaciones as $evaluacion) {
                $total_recomendaciones += $evaluacion->total_recomendaciones;

                if ($evaluacion->evaluacionProyectoLinea69->anexos_comentario != null) {
                    $requiere_subsanar = true;
                }

                // Sumar los presupuestos no aprobados
                $total_presupuestos_evaluados += $evaluacion->proyectoPresupuestosEvaluaciones()->count();
                foreach ($evaluacion->proyectoPresupuestosEvaluaciones()->get() as $presupuesto_evaluacion) {
                    $presupuesto_evaluacion->correcto == false ? $count_presupuesto_no_aprobado++ : null;
                }
            }

            $estado_evaluacion = null;

            $estado_evaluacion = $total_recomendaciones == 0 &&  $evaluaciones_finalizadas > 0 ? 'Cumple' : ($total_recomendaciones == 0 &&  $evaluaciones_finalizadas == 0 ? 'No priorizado' : 'Proyecto con asignación de apoyo técnico para la formulación');
            $requiere_subsanar = $total_recomendaciones == 0 &&  $evaluaciones_finalizadas > 0 ? false : ($total_recomendaciones == 0 &&  $evaluaciones_finalizadas == 0 ? false : true);

            if ($this->estado_cord_sennova != NULL && request()->isMethod('GET')) {
                $estados_evaluacion = collect(json_decode($this->estado_cord_sennova, true));
                $estado_evaluacion = $estados_evaluacion['estado'];
            }

            return collect(['estado' => $estado_evaluacion, 'numero_recomendaciones' => $total_recomendaciones, 'evaluaciones_habilitadas' => $cantidad_evaluaciones, 'evaluaciones_finalizadas' => $evaluaciones_finalizadas, 'requiere_subsanar' => $requiere_subsanar, 'alerta' => null]);
        }
    }

    /**
     * estadoEvaluacionProyectoLinea66
     *
     * @param  mixed $puntaje_total
     * @param  mixed $total_recomendaciones
     * @param  mixed $requiere_subsanar
     * @param  mixed $causal_rechazo
     * @return void
     */
    public function estadoEvaluacionProyectoLinea66($puntaje_total, $total_recomendaciones, $requiere_subsanar, $causal_rechazo)
    {
        $estados_evaluacion = collect(json_decode(Storage::get('json/estados_evaluacion.json'), true));

        $id = null;
        $estado_evaluacion = '';
        if ($puntaje_total == 0 && $total_recomendaciones == 0) {
            $estado_evaluacion = $estados_evaluacion->where('value', 1)->first()['label'];
            $id = $estados_evaluacion->where('value', 1)->first()['value'];
        } elseif ($puntaje_total >= 91 && $total_recomendaciones == 0) { // Preaprobado - No requiere ser subsanado
            $estado_evaluacion = $estados_evaluacion->where('value', 2)->first()['label'];
            $id = $estados_evaluacion->where('value', 2)->first()['value'];
        } elseif ($puntaje_total >= 91 && $total_recomendaciones > 0) { // Pre-aprobado con observaciones
            $estado_evaluacion = $estados_evaluacion->where('value', 3)->first()['label'];
            $id = $estados_evaluacion->where('value', 3)->first()['value'];
            $requiere_subsanar = true;
        } elseif ($puntaje_total >= 70 && $puntaje_total < 91 && $total_recomendaciones == 0) { // Pre-aprobado con observaciones
            $estado_evaluacion = $estados_evaluacion->where('value', 3)->first()['label'];
            $id = $estados_evaluacion->where('value', 3)->first()['value'];
            $requiere_subsanar = true;
        } elseif ($puntaje_total >= 70 && $puntaje_total < 91 && $total_recomendaciones > 0) { // Pre-aprobado con observaciones
            $estado_evaluacion = $estados_evaluacion->where('value', 3)->first()['label'];
            $id = $estados_evaluacion->where('value', 3)->first()['value'];
            $requiere_subsanar = true;
        } elseif ($puntaje_total < 70) { // Rechazado - No requiere ser subsanado
            $estado_evaluacion = $estados_evaluacion->where('value', 4)->first()['label'];
            $id = $estados_evaluacion->where('value', 4)->first()['value'];
            $requiere_subsanar = false;
        }

        if ($causal_rechazo) {
            $estado_evaluacion = $causal_rechazo;
        }

        return collect(['id' => $id, 'estado' => $estado_evaluacion, 'requiere_subsanar' => $requiere_subsanar]);
    }

    /**
     * estadoEvaluacionProyectoLinea66
     *
     * @param  mixed $puntaje_total
     * @param  mixed $total_recomendaciones
     * @param  mixed $requiere_subsanar
     * @return void
     */
    public function estadoEvaluacionProyectoLinea68($puntaje_total, $total_recomendaciones, $requiere_subsanar)
    {
        $estados_evaluacion = collect(json_decode(Storage::get('json/estados_evaluacion_st.json'), true));

        $id = null;
        $estado_evaluacion = '';
        if ($puntaje_total == 0 && $total_recomendaciones == 0) {
            $estado_evaluacion = $estados_evaluacion->where('value', 1)->first()['label'];
            $id = $estados_evaluacion->where('value', 1)->first()['value'];
        } elseif ($puntaje_total >= 90 && $total_recomendaciones == 0) { // Pre-aprobado
            $estado_evaluacion = $estados_evaluacion->where('value', 2)->first()['label'];
            $id = $estados_evaluacion->where('value', 2)->first()['value'];
        } elseif ($puntaje_total >= 90 && $total_recomendaciones >= 0) { // Pre-aprobado con observaciones
            $estado_evaluacion = $estados_evaluacion->where('value', 5)->first()['label'];
            $id = $estados_evaluacion->where('value', 5)->first()['value'];
            $requiere_subsanar = true;
        } elseif ($puntaje_total >= 70 && $puntaje_total < 90 && $total_recomendaciones >= 0) { // Pre-aprobado con observaciones
            $estado_evaluacion = $estados_evaluacion->where('value', 5)->first()['label'];
            $id = $estados_evaluacion->where('value', 5)->first()['value'];
            $requiere_subsanar = true;
        } elseif ($puntaje_total >= 0 && $puntaje_total <= 69 && $total_recomendaciones >= 0) { // Rechazado
            $estado_evaluacion = $estados_evaluacion->where('value', 3)->first()['label'];
            $id = $estados_evaluacion->where('value', 3)->first()['value'];
        }

        return collect(['id' => $id, 'estado' => $estado_evaluacion, 'requiere_subsanar' => $requiere_subsanar]);
    }


    /**
     * estadoEvaluacionProyectoLinea65
     *
     * @param  mixed $puntaje_total
     * @param  mixed $total_recomendaciones
     * @param  mixed $requiere_subsanar
     * @return void
     */
    public function estadoEvaluacionProyectoLinea65($puntaje_total, $total_recomendaciones, $requiere_subsanar)
    {
        $id = null;
        $estado_evaluacion = '';
        if ($puntaje_total == 0 && $total_recomendaciones == 0) {
            $estado_evaluacion = 'No priorizado anexo 1C. Comuníquese con el Dinamizador SENNOVA.';
            $id = 1;
        } elseif ($puntaje_total >= 70) { // Cumple
            $estado_evaluacion = 'Cumple';
            $id = 2;
        } elseif ($puntaje_total >= 0 && $puntaje_total <= 69) { // Cumple
            $estado_evaluacion = 'Proyecto con asignación de apoyo técnico para la formulación';
            $id = 2;
        }

        $requiere_subsanar = $total_recomendaciones > 0 ? true : false;

        return collect(['id' => $id, 'estado' => $estado_evaluacion, 'requiere_subsanar' => $requiere_subsanar]);
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
            case $proyecto->estado_evaluacion_proyecto_linea_66 != null:
                $proyecto->update(['estado' => $proyecto->estado_evaluacion_proyecto_linea_66]);
                break;
            case $proyecto->estado_evaluacion_proyecto_linea_65 != null:
                $proyecto->update(['estado' => $proyecto->estado_evaluacion_proyecto_linea_65]);
                break;
            case $proyecto->estado_evaluacion_proyecto_linea_70 != null:
                $proyecto->update(['estado' => $proyecto->estado_evaluacion_proyecto_linea_70]);
                break;
            case $proyecto->estado_evaluacion_proyecto_linea_69 != null:
                $proyecto->update(['estado' => $proyecto->estado_evaluacion_proyecto_linea_69]);
                break;
            case $proyecto->estado_evaluacion_proyecto_linea_68 != null:
                $proyecto->update(['estado' => $proyecto->estado_evaluacion_proyecto_linea_68]);
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
            foreach ($presupuesto->soportesEstudioMercado()->get() as $estudio_mercado) {
                $collect->push(['id' => $estudio_mercado->id, 'tipo_archivo' => 'soporte', 'empresa' => $estudio_mercado->empresa, 'ruta_soporte' => $estudio_mercado->soporte]);
            }
        }

        foreach ($this->entidadesAliadas()->get() as $entidad_aliada) {
            if ($entidad_aliada->entidadAliadaLinea66()->exists()) {
                $collect->push(['id' => $entidad_aliada->id, 'tipo_archivo' => 'carta_intencion', 'entidad_aliada' => $entidad_aliada->nombre, 'ruta_carta_intencion' => $entidad_aliada->entidadAliadaLinea66->carta_intencion]);
                $collect->push(['id' => $entidad_aliada->id, 'tipo_archivo' => 'carta_propiedad_intelectual', 'entidad_aliada' => $entidad_aliada->nombre, 'ruta_carta_propiedad_intelectual' => $entidad_aliada->entidadAliadaLinea66->carta_propiedad_intelectual]);
            } else if ($entidad_aliada->entidadAliadaLinea69()->exists()) {
                $collect->push(['id' => $entidad_aliada->id, 'tipo_archivo' => 'soporte_convenio', 'entidad_aliada' => $entidad_aliada->nombre, 'ruta_soporte_convenio' => $entidad_aliada->entidadAliadaLinea69->soporte_convenio]);
            } else if ($entidad_aliada->entidadAliadaLinea70()->exists()) {
                $collect->push(['id' => $entidad_aliada->id, 'tipo_archivo' => 'soporte_convenio', 'entidad_aliada' => $entidad_aliada->nombre, 'ruta_soporte_convenio' => $entidad_aliada->entidadAliadaLinea70->soporte_convenio]);
            }
        }

        foreach ($this->proyectoAnexo()->get() as $proyecto_anexo) {
            $collect->push(['id' => $proyecto_anexo->id, 'tipo_archivo' => 'archivo', 'anexo' => $proyecto_anexo->anexo->nombre, 'ruta_archivo' => $proyecto_anexo->archivo]);
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
        $allowed_to_view      = Gate::inspect('visualizar-proyecto-autor', $this);
        $allowed_to_update    = Gate::inspect('modificar-proyecto-autor', $this);
        $allowed_to_destroy   = Gate::inspect('eliminar-proyecto-autor', $this);

        return collect(['to_view' => $allowed_to_view->allowed(), 'to_update' => $allowed_to_update->allowed(), 'to_destroy' => $allowed_to_destroy->allowed()]);
    }
}
