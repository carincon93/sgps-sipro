<?php

namespace App\Models\Evaluacion;

use App\Models\Convocatoria;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Log;

class Evaluacion extends Model
{
    use HasFactory;

    /**
     * table
     *
     * @var string
     */
    protected $table = 'evaluaciones';

    /**
     * appends
     *
     * @var array
     */
    protected $appends = ['total_evaluacion', 'validar_evaluacion', 'total_recomendaciones', 'verificar_estado_evaluacion', 'estado_proyecto_por_evaluador', 'causal_rechazo_proyecto_formulario_8_linea_66', 'allowed'];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'convocatoria_id',
        'proyecto_id',
        'user_id',
        'finalizado',
        'habilitado',
        'iniciado',
        'modificable',
        'clausula_confidencialidad',
        'justificacion_causal_rechazo',
        'comentario_formulador',
        'comentario_evaluador',
        'replicas',
        'estado',
        'evaluacion_final'
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
     * Relationship with Proyecto
     *
     * @return object
     */
    public function proyecto()
    {
        return $this->belongsTo(\App\Models\Proyecto::class);
    }

    /**
     * Relationship with Convocatoria
     *
     * @return object
     */
    public function convocatoria()
    {
        return $this->belongsTo(\App\Models\Convocatoria::class);
    }

    /**
     * Relationship with EvaluacionProyectoFormulario8Linea66
     *
     * @return object
     */
    public function evaluacionProyectoFormulario8Linea66()
    {
        return $this->hasOne(EvaluacionProyectoFormulario8Linea66::class, 'id');
    }

    /**
     * Relationship with EvaluacionProyectoFormulario1Linea65
     *
     * @return object
     */
    public function evaluacionProyectoFormulario1Linea65()
    {
        return $this->hasOne(EvaluacionProyectoFormulario1Linea65::class, 'id');
    }

    /**
     * Relationship with EvaluacionProyectoFormulario4Linea70
     *
     * @return object
     */
    public function evaluacionProyectoFormulario4Linea70()
    {
        return $this->hasOne(EvaluacionProyectoFormulario4Linea70::class, 'id');
    }

    /**
     * Relationship with EvaluacionProyectoFormulario5Linea69
     *
     * @return object
     */
    public function evaluacionProyectoFormulario5Linea69()
    {
        return $this->hasOne(EvaluacionProyectoFormulario5Linea69::class, 'id');
    }

    /**
     * Relationship with EvaluacionProyectoFormulario6Linea82
     *
     * @return object
     */
    public function evaluacionProyectoFormulario6Linea82()
    {
        return $this->hasOne(EvaluacionProyectoFormulario6Linea82::class, 'id');
    }

    /**
     * Relationship with EvaluacionProyectoFormulario12Linea68
     *
     * @return object
     */
    public function evaluacionProyectoFormulario12Linea68()
    {
        return $this->hasOne(EvaluacionProyectoFormulario12Linea68::class, 'id');
    }

    /**
     * Relationship with ProyectoRolEvaluacion
     *
     * @return object
     */
    public function proyectoRolesEvaluaciones()
    {
        return $this->hasMany(ProyectoRolEvaluacion::class);
    }

    /**
     * Relationship with ProyectoPresupuestoEvaluacion
     *
     * @return object
     */
    public function proyectoPresupuestosEvaluaciones()
    {
        return $this->hasMany(ProyectoPresupuestoEvaluacion::class);
    }

    /**
     * Relationship with User
     *
     * @return object
     */
    public function evaluador()
    {
        return $this->belongsTo(\App\Models\User::class, 'user_id');
    }

    /**
     * Relationship with EvaluacionCausalRechazo
     *
     * @return object
     */
    public function evaluacionCausalesRechazo()
    {
        return $this->hasMany(EvaluacionCausalRechazo::class);
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

    public function getItemsAEvaluar($convocatoria_id, $tipo_formulario_convocatoria_id)
    {
        $items_db_evaluacion = [];

        $relationship_name = '';
        switch ($tipo_formulario_convocatoria_id) {
            case 1:
                $items_db_evaluacion = EvaluacionProyectoFormulario1Linea65::select('evaluaciones_proyectos_formulario_1_linea_65.*')->with('evaluacion.proyecto', 'preguntaEvaluacionFormulario1Linea65')->join('preguntas_evaluacion_formulario_1_linea_65', 'evaluaciones_proyectos_formulario_1_linea_65.pregunta_id',  'preguntas_evaluacion_formulario_1_linea_65.id')->where('evaluacion_id', $this->id)->whereJsonContains('preguntas_evaluacion_formulario_1_linea_65.convocatorias_id', $convocatoria_id)->get();
                $relationship_name = 'preguntaEvaluacionFormulario1Linea65';
                break;
            case 4:
                $items_db_evaluacion = EvaluacionProyectoFormulario4Linea70::select('evaluaciones_proyectos_formulario_4_linea_70.*')->with('preguntaEvaluacionFormulario4Linea70')->join('preguntas_evaluacion_formulario_4_linea_70', 'evaluaciones_proyectos_formulario_4_linea_70.pregunta_id',  'preguntas_evaluacion_formulario_4_linea_70.id')->where('evaluacion_id', $this->id)->whereJsonContains('preguntas_evaluacion_formulario_4_linea_70.convocatorias_id', $convocatoria_id)->get();
                $relationship_name = 'preguntaEvaluacionFormulario4Linea70';
                break;
            case 5:
                $items_db_evaluacion = EvaluacionProyectoFormulario5Linea69::select('evaluaciones_proyectos_formulario_5_linea_69.*')->with('preguntaEvaluacionFormulario5Linea69')->join('preguntas_evaluacion_formulario_5_linea_69', 'evaluaciones_proyectos_formulario_5_linea_69.pregunta_id',  'preguntas_evaluacion_formulario_5_linea_69.id')->where('evaluacion_id', $this->id)->whereJsonContains('preguntas_evaluacion_formulario_5_linea_69.convocatorias_id', $convocatoria_id)->get();
                $relationship_name = 'preguntaEvaluacionFormulario5Linea69';
                break;
            case 6:
                $items_db_evaluacion = EvaluacionProyectoFormulario6Linea82::select('evaluaciones_proyectos_formulario_6_linea_82.*')->with('preguntaEvaluacionFormulario6Linea82')->join('preguntas_evaluacion_formulario_6_linea_82', 'evaluaciones_proyectos_formulario_6_linea_82.pregunta_id',  'preguntas_evaluacion_formulario_6_linea_82.id')->where('evaluacion_id', $this->id)->whereJsonContains('preguntas_evaluacion_formulario_6_linea_82.convocatorias_id', $convocatoria_id)->get();
                $relationship_name = 'preguntaEvaluacionFormulario6Linea82';
                break;
            case 7:
                $items_db_evaluacion = EvaluacionProyectoFormulario7Linea23::select('evaluaciones_proyectos_formulario_7_linea_23.*')->with('preguntaEvaluacionFormulario7Linea23')->join('preguntas_evaluacion_formulario_7_linea_23', 'evaluaciones_proyectos_formulario_7_linea_23.pregunta_id',  'preguntas_evaluacion_formulario_7_linea_23.id')->where('evaluacion_id', $this->id)->whereJsonContains('preguntas_evaluacion_formulario_7_linea_23.convocatorias_id', $convocatoria_id)->get();
                $relationship_name = 'preguntaEvaluacionFormulario7Linea23';
                break;
            case 8:
                $items_db_evaluacion = EvaluacionProyectoFormulario8Linea66::select('evaluaciones_proyectos_formulario_8_linea_66.*')->with('preguntaEvaluacionFormulario8Linea66')->join('preguntas_evaluacion_formulario_8_linea_66', 'evaluaciones_proyectos_formulario_8_linea_66.pregunta_id',  'preguntas_evaluacion_formulario_8_linea_66.id')->where('evaluacion_id', $this->id)->whereJsonContains('preguntas_evaluacion_formulario_8_linea_66.convocatorias_id', $convocatoria_id)->get();
                $relationship_name = 'preguntaEvaluacionFormulario8Linea66';
                break;
            case 9:
                $items_db_evaluacion = EvaluacionProyectoFormulario9Linea23::select('evaluaciones_proyectos_formulario_9_linea_23.*')->with('preguntaEvaluacionFormulario9Linea23')->join('preguntas_evaluacion_formulario_9_linea_23', 'evaluaciones_proyectos_formulario_9_linea_23.pregunta_id',  'preguntas_evaluacion_formulario_9_linea_23.id')->where('evaluacion_id', $this->id)->whereJsonContains('preguntas_evaluacion_formulario_9_linea_23.convocatorias_id', $convocatoria_id)->get();
                $relationship_name = 'preguntaEvaluacionFormulario9Linea23';
                break;
            case 12:
                $items_db_evaluacion = EvaluacionProyectoFormulario12Linea68::select('evaluaciones_proyectos_formulario_12_linea_68.*')->with('preguntaEvaluacionFormulario12Linea68')->join('preguntas_evaluacion_formulario_12_linea_68', 'evaluaciones_proyectos_formulario_12_linea_68.pregunta_id',  'preguntas_evaluacion_formulario_12_linea_68.id')->where('evaluacion_id', $this->id)->whereJsonContains('preguntas_evaluacion_formulario_12_linea_68.convocatorias_id', $convocatoria_id)->get();
                $relationship_name = 'preguntaEvaluacionFormulario12Linea68';
                break;
            default:
                break;
        }

        $items_evaluacion = collect([]);

        foreach ($items_db_evaluacion as $item) {
            $items_evaluacion->push([
                'form_evaluacion_id_pregunta_id_' . $item->pregunta_id          => $item->id,
                'form_puntaje_pregunta_id_' . $item->pregunta_id                => $item->puntaje,
                'form_comentario_pregunta_id_' . $item->pregunta_id             => $item->comentario,
                'form_requiere_comentario_pregunta_id_' . $item->pregunta_id    => $item->comentario ? true : false,
                'form_id_pregunta_id_' . $item->pregunta_id                     => $item->pregunta_id,
                'pregunta_id'                                                   => $item->pregunta_id,
                'tipo_formulario_convocatoria_id'                               => $this->proyecto->tipo_formulario_convocatoria_id,
                'evaluacion_id'                                                 => $this->id,
                'campo_pregunta_id_' . $item->pregunta_id                       => $item->{$relationship_name}->campo,
                'puntaje_maximo_pregunta_id_' . $item->pregunta_id              => $item->{$relationship_name}->puntaje_maximo,
                'criterio_pregunta_id_' . $item->pregunta_id                    => $item->{$relationship_name}->criterio,
                'allowed'                                                       => $this->allowed
            ]);
        }

        return $items_evaluacion;
    }

    /**
     * getProyectosPorRol
     *
     * @return object
     */
    public static function getEvaluacionesPorRol()
    {
        /** @var \App\Models\User */
        $auth_user = Auth::user();

        $query = Evaluacion::with(
            [
                'proyecto.proyectoFormulario1Linea65:id,titulo,fecha_inicio,fecha_finalizacion',
                'proyecto.proyectoFormulario3Linea61:id,titulo,fecha_inicio,fecha_finalizacion',
                'proyecto.proyectoFormulario4Linea70:id,tecnoacademia_id,fecha_inicio,fecha_finalizacion',
                'proyecto.proyectoFormulario5Linea69:id,nodo_tecnoparque_id,fecha_inicio,fecha_finalizacion',
                'proyecto.proyectoFormulario6Linea82:id,titulo,fecha_inicio,fecha_finalizacion',
                'proyecto.proyectoFormulario7Linea23:id,titulo,fecha_inicio,fecha_finalizacion',
                'proyecto.proyectoFormulario8Linea66:id,titulo,fecha_inicio,fecha_finalizacion',
                'proyecto.proyectoFormulario9Linea23:id,titulo,fecha_inicio,fecha_finalizacion',
                'proyecto.proyectoFormulario10Linea69:id,hub_innovacion_id,fecha_inicio,fecha_finalizacion',
                'proyecto.proyectoFormulario11Linea83:id,titulo,fecha_inicio,fecha_finalizacion',
                'proyecto.proyectoFormulario12Linea68:id,titulo,fecha_inicio,fecha_finalizacion',
                'proyecto.proyectoFormulario13Linea65:id,titulo,fecha_inicio,fecha_finalizacion',
                'proyecto.proyectoFormulario15Linea65:id,titulo,fecha_inicio,fecha_finalizacion',
                'proyecto.proyectoFormulario16Linea65:id,titulo,fecha_inicio,fecha_finalizacion',
                'proyecto.proyectoFormulario17Linea69:id,nodo_tecnoparque_id,fecha_inicio,fecha_finalizacion',
                'proyecto.convocatoria',
                'proyecto.centroFormacion',
                'evaluador:id,nombre'
            ]
        );
        if ($auth_user->hasRole([11, 33]) && !$auth_user->hasRole([1, 5, 17, 18, 19])) {
            $query->where('user_id', $auth_user->id);
        }
        $query->orderBy('id', 'DESC');
        $query->orderBy('iniciado', 'ASC');
        $query->orderBy('habilitado', 'DESC');
        $query->filterEvaluacion(request()->only('search', 'estado'));
        $query->paginate();

        return $query->paginate();
    }

    /**
     * getVerificarEstadoEvaluacionAttribute
     *
     * @return void
     */
    public function getVerificarEstadoEvaluacionAttribute()
    {
        $estado = null;
        if ($this->evaluacionProyectoFormulario8Linea66 && $this->proyecto->proyectoFormulario8Linea66()->exists()) {
            $estado = $this->finalizado ? 'Finalizado' : ($this->evaluacionProyectoFormulario8Linea66->updated_at == null ? 'Sin evaluar' : 'Evaluación iniciada');
        } else if ($this->evaluacionProyectoFormulario6Linea82 && $this->proyecto->proyectoFormulario6Linea82()->exists()) {
            $estado = $this->finalizado ? 'Finalizado' : ($this->evaluacionProyectoFormulario6Linea82->updated_at == null ? 'Sin evaluar' : 'Evaluación iniciada');
        } else if ($this->evaluacionProyectoFormulario1Linea65 && $this->proyecto->proyectoFormulario1Linea65()->exists()) {
            $estado = $this->finalizado ? 'Finalizado' : ($this->evaluacionProyectoFormulario1Linea65->updated_at == null ? 'Sin evaluar' : 'Evaluación iniciada');
        } else if ($this->evaluacionProyectoFormulario4Linea70 && $this->proyecto->proyectoFormulario4Linea70()->exists()) {
            $estado = $this->finalizado ? 'Finalizado' : ($this->evaluacionProyectoFormulario4Linea70->updated_at == null ? 'Sin evaluar' : 'Evaluación iniciada');
        } else if ($this->evaluacionProyectoFormulario5Linea69 && $this->proyecto->proyectoFormulario5Linea69()->exists()) {
            $estado = $this->finalizado ? 'Finalizado' : ($this->evaluacionProyectoFormulario5Linea69->updated_at == null ? 'Sin evaluar' : 'Evaluación iniciada');
        } else if ($this->evaluacionProyectoFormulario12Linea68 && $this->proyecto->proyectoFormulario12Linea68()->exists()) {
            $estado = $this->finalizado ? 'Finalizado' : ($this->evaluacionProyectoFormulario12Linea68->updated_at == null ? 'Sin evaluar' : 'Evaluación iniciada');
        }

        return $estado;
    }

    public function getTotalEvaluacionAttribute()
    {
        $nombres_formularios = [
            'Formulario1Linea65',
            'Formulario6Linea82',
            'Formulario8Linea66',
            'Formulario12Linea68',
        ];

        $total = 0;

        foreach ($nombres_formularios as $nombre_formulario) {
            $evaluacion = $this->getEvaluacion($nombre_formulario);

            if ($evaluacion) {
                $total += $this->getFormPuntaje($evaluacion);
            }
        }

        return round($total, 2);
    }

    protected function getEvaluacion($nombre_form)
    {
        $nombre_relacion = 'evaluacionProyecto' . $nombre_form;

        return $this->evaluacionExists($nombre_relacion) ? $this->$nombre_relacion : null;
    }

    protected function evaluacionExists($nombre_relacion)
    {
        return $this->$nombre_relacion && $this->$nombre_relacion()->exists();
    }

    protected function getFormPuntaje($evaluacion)
    {
        $puntaje_campos = [
            'titulo_puntaje',
            'video_puntaje',
            'resumen_puntaje',
            'problema_central_puntaje',
            'objetivos_puntaje',
            'metodologia_puntaje',
            'entidad_aliada_puntaje',
            'resultados_puntaje',
            'productos_puntaje',
            'cadena_valor_puntaje',
            'analisis_riesgos_puntaje',
            'ortografia_puntaje',
            'redaccion_puntaje',
            'normas_apa_puntaje',
            'antecedentes_puntaje',
            'justificacion_problema_puntaje',
            'pregunta_formulacion_problema_puntaje',
            'identificacion_problema_puntaje',
            'arbol_problemas_puntaje',
            'propuesta_sostenibilidad_puntaje',
            'impacto_ambiental_puntaje',
            'impacto_social_centro_puntaje',
            'impacto_social_productivo_puntaje',
            'impacto_tecnologico_puntaje',
            'riesgos_objetivo_general_puntaje',
            'riesgos_productos_puntaje',
            'riesgos_actividades_puntaje',
            'objetivo_general_puntaje',
            'primer_objetivo_puntaje',
            'segundo_objetivo_puntaje',
            'tercer_objetivo_puntaje',
            'cuarto_objetivo_puntaje',
            'resultados_primer_obj_puntaje',
            'resultados_segundo_obj_puntaje',
            'resultados_tercer_obj_puntaje',
            'resultados_cuarto_obj_puntaje',
            'actividades_primer_obj_puntaje',
            'actividades_segundo_obj_puntaje',
            'actividades_tercer_obj_puntaje',
            'actividades_cuarto_obj_puntaje',
            'productos_primer_obj_puntaje',
            'productos_segundo_obj_puntaje',
            'productos_tercer_obj_puntaje',
            'productos_cuarto_obj_puntaje',
        ];

        return collect($puntaje_campos)->sum(fn ($field) => $evaluacion->$field);
    }

    public function getTotalRecomendacionesAttribute()
    {
        $total = 0;
        if ($this->evaluacionProyectoFormulario8Linea66 && $this->proyecto->proyectoFormulario8Linea66()->exists()) {
            $this->evaluacionProyectoFormulario8Linea66->titulo_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario8Linea66->video_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario8Linea66->resumen_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario8Linea66->problema_central_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario8Linea66->objetivos_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario8Linea66->metodologia_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario8Linea66->entidad_aliada_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario8Linea66->resultados_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario8Linea66->productos_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario8Linea66->cadena_valor_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario8Linea66->analisis_riesgos_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario8Linea66->justificacion_economia_naranja_requiere_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario8Linea66->justificacion_economia_naranja_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario8Linea66->justificacion_industria_4_requiere_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario8Linea66->justificacion_industria_4_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario8Linea66->bibliografia_requiere_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario8Linea66->bibliografia_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario8Linea66->fechas_requiere_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario8Linea66->fechas_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario8Linea66->justificacion_politica_discapacidad_requiere_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario8Linea66->justificacion_politica_discapacidad_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario8Linea66->actividad_economica_requiere_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario8Linea66->actividad_economica_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario8Linea66->disciplina_subarea_conocimiento_requiere_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario8Linea66->disciplina_subarea_conocimiento_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario8Linea66->red_conocimiento_requiere_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario8Linea66->red_conocimiento_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario8Linea66->tematica_estrategica_requiere_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario8Linea66->tematica_estrategica_comentario != null ? $total++ : null;

            $this->evaluacionProyectoFormulario8Linea66->ortografia_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario8Linea66->redaccion_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario8Linea66->normas_apa_comentario != null ? $total++ : null;

            $this->comentario_evaluador != null ? $total++ : null;
        } else if ($this->evaluacionProyectoFormulario1Linea65 && $this->proyecto->proyectoFormulario1Linea65()->exists()) {
            $this->evaluacionProyectoFormulario1Linea65->titulo_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario1Linea65->video_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario1Linea65->resumen_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario1Linea65->problema_central_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario1Linea65->objetivos_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario1Linea65->metodologia_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario1Linea65->entidad_aliada_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario1Linea65->resultados_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario1Linea65->productos_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario1Linea65->cadena_valor_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario1Linea65->analisis_riesgos_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario1Linea65->justificacion_economia_naranja_requiere_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario1Linea65->justificacion_economia_naranja_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario1Linea65->justificacion_industria_4_requiere_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario1Linea65->justificacion_industria_4_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario1Linea65->bibliografia_requiere_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario1Linea65->bibliografia_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario1Linea65->fechas_requiere_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario1Linea65->fechas_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario1Linea65->justificacion_politica_discapacidad_requiere_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario1Linea65->justificacion_politica_discapacidad_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario1Linea65->actividad_economica_requiere_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario1Linea65->actividad_economica_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario1Linea65->disciplina_subarea_conocimiento_requiere_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario1Linea65->disciplina_subarea_conocimiento_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario1Linea65->red_conocimiento_requiere_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario1Linea65->red_conocimiento_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario1Linea65->tematica_estrategica_requiere_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario1Linea65->tematica_estrategica_comentario != null ? $total++ : null;

            $this->evaluacionProyectoFormulario1Linea65->ortografia_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario1Linea65->redaccion_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario1Linea65->normas_apa_comentario != null ? $total++ : null;

            $this->comentario_evaluador != null ? $total++ : null;
        } else if ($this->evaluacionProyectoFormulario4Linea70 && $this->proyecto->proyectoFormulario4Linea70()->exists()) {
            $this->evaluacionProyectoFormulario4Linea70->resumen_regional_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario4Linea70->antecedentes_tecnoacademia_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario4Linea70->retos_oportunidades_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario4Linea70->metodologia_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario4Linea70->lineas_medulares_centro_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario4Linea70->lineas_tecnologicas_centro_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario4Linea70->articulacion_sennova_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario4Linea70->productos_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario4Linea70->municipios_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario4Linea70->instituciones_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario4Linea70->fecha_ejecucion_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario4Linea70->cadena_valor_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario4Linea70->analisis_riesgos_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario4Linea70->anexos_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario4Linea70->proyectos_macro_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario4Linea70->bibliografia_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario4Linea70->entidad_aliada_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario4Linea70->edt_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario4Linea70->articulacion_centro_formacion_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario4Linea70->impacto_centro_formacion_comentario != null ? $total++ : null;

            $this->evaluacionProyectoFormulario4Linea70->ortografia_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario4Linea70->redaccion_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario4Linea70->normas_apa_comentario != null ? $total++ : null;

            $this->comentario_evaluador != null ? $total++ : null;
        } else if ($this->evaluacionProyectoFormulario5Linea69 && $this->proyecto->proyectoFormulario5Linea69()->exists()) {
            $this->evaluacionProyectoFormulario5Linea69->resumen_regional_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario5Linea69->antecedentes_regional_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario5Linea69->municipios_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario5Linea69->fecha_ejecucion_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario5Linea69->cadena_valor_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario5Linea69->impacto_centro_formacion_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario5Linea69->bibliografia_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario5Linea69->retos_oportunidades_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario5Linea69->pertinencia_territorio_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario5Linea69->metodologia_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario5Linea69->analisis_riesgos_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario5Linea69->anexos_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario5Linea69->productos_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario5Linea69->ortografia_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario5Linea69->redaccion_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario5Linea69->normas_apa_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario5Linea69->arbol_problemas_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario5Linea69->arbol_objetivos_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario5Linea69->articulacion_sennova_comentario != null ? $total++ : null;

            $this->comentario_evaluador != null ? $total++ : null;
        } else if ($this->evaluacionProyectoFormulario12Linea68 && $this->proyecto->proyectoFormulario12Linea68()->exists()) {
            $this->evaluacionProyectoFormulario12Linea68->titulo_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario12Linea68->resumen_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario12Linea68->antecedentes_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario12Linea68->problema_central_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario12Linea68->justificacion_problema_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario12Linea68->pregunta_formulacion_problema_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario12Linea68->fecha_ejecucion_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario12Linea68->propuesta_sostenibilidad_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario12Linea68->identificacion_problema_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario12Linea68->arbol_problemas_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario12Linea68->video_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario12Linea68->especificaciones_area_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario12Linea68->ortografia_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario12Linea68->redaccion_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario12Linea68->normas_apa_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario12Linea68->arbol_objetivos_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario12Linea68->impacto_ambiental_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario12Linea68->impacto_social_centro_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario12Linea68->impacto_social_productivo_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario12Linea68->impacto_tecnologico_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario12Linea68->objetivo_general_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario12Linea68->primer_objetivo_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario12Linea68->segundo_objetivo_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario12Linea68->tercer_objetivo_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario12Linea68->cuarto_objetivo_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario12Linea68->resultados_primer_obj_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario12Linea68->resultados_segundo_obj_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario12Linea68->resultados_tercer_obj_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario12Linea68->resultados_cuarto_obj_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario12Linea68->metodologia_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario12Linea68->actividades_primer_obj_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario12Linea68->actividades_segundo_obj_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario12Linea68->actividades_tercer_obj_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario12Linea68->actividades_cuarto_obj_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario12Linea68->productos_primer_obj_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario12Linea68->productos_segundo_obj_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario12Linea68->productos_tercer_obj_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario12Linea68->productos_cuarto_obj_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario12Linea68->cadena_valor_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario12Linea68->bibliografia_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario12Linea68->anexos_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario12Linea68->riesgos_objetivo_general_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario12Linea68->riesgos_productos_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario12Linea68->riesgos_actividades_comentario != null ? $total++ : null;
            $this->evaluacionProyectoFormulario12Linea68->inventario_equipos_comentario != null ? $total++ : null;

            $this->comentario_evaluador != null ? $total++ : null;
        }

        $total += $this->proyectoPresupuestosEvaluaciones()->where('correcto', false)->count();
        $total += $this->proyectoRolesEvaluaciones()->where('correcto', false)->count();

        return $total;
    }

    public function getValidarEvaluacionAttribute()
    {
        $itemsPorEvaluar = [];
        $countRolesSinEvaluar = 0;

        if ($this->evaluacionProyectoFormulario8Linea66 && $this->proyecto->proyectoFormulario8Linea66()->exists()) {
            $this->evaluacionProyectoFormulario8Linea66->titulo_puntaje == null ? array_push($itemsPorEvaluar, 'Título') : null;
            $this->evaluacionProyectoFormulario8Linea66->resumen_puntaje == null ? array_push($itemsPorEvaluar, 'Resumen') : null;
            $this->evaluacionProyectoFormulario8Linea66->problema_central_puntaje == null ? array_push($itemsPorEvaluar, 'Problema central') : null;
            $this->evaluacionProyectoFormulario8Linea66->objetivos_puntaje == null ? array_push($itemsPorEvaluar, 'Objetivos') : null;
            $this->evaluacionProyectoFormulario8Linea66->metodologia_puntaje == null ? array_push($itemsPorEvaluar, 'Metodología') : null;
            $this->evaluacionProyectoFormulario8Linea66->resultados_puntaje == null ? array_push($itemsPorEvaluar, 'Resultados') : null;
            $this->evaluacionProyectoFormulario8Linea66->productos_puntaje == null ? array_push($itemsPorEvaluar, 'Productos') : null;
            $this->evaluacionProyectoFormulario8Linea66->cadena_valor_puntaje == null ? array_push($itemsPorEvaluar, 'Cadena de valor') : null;
            $this->evaluacionProyectoFormulario8Linea66->analisis_riesgos_puntaje == null ? array_push($itemsPorEvaluar, 'Análisis de riesgos') : null;

            $this->evaluacionProyectoFormulario8Linea66->ortografia_puntaje == null ? array_push($itemsPorEvaluar, 'Ortografía') : null;
            $this->evaluacionProyectoFormulario8Linea66->redaccion_puntaje == null ? array_push($itemsPorEvaluar, 'Redacción') : null;
            $this->evaluacionProyectoFormulario8Linea66->normas_apa_puntaje == null ? array_push($itemsPorEvaluar, 'Normas APA') : null;
        } else if ($this->evaluacionProyectoFormulario1Linea65 && $this->proyecto->proyectoFormulario1Linea65()->exists()) {
            $this->evaluacionProyectoFormulario1Linea65->titulo_puntaje == null ? array_push($itemsPorEvaluar, 'Título') : null;
            $this->evaluacionProyectoFormulario1Linea65->resumen_puntaje == null ? array_push($itemsPorEvaluar, 'Resumen') : null;
            $this->evaluacionProyectoFormulario1Linea65->problema_central_puntaje == null ? array_push($itemsPorEvaluar, 'Problema central') : null;
            $this->evaluacionProyectoFormulario1Linea65->objetivos_puntaje == null ? array_push($itemsPorEvaluar, 'Objetivos') : null;
            $this->evaluacionProyectoFormulario1Linea65->metodologia_puntaje == null ? array_push($itemsPorEvaluar, 'Metodología') : null;
            $this->evaluacionProyectoFormulario1Linea65->resultados_puntaje == null ? array_push($itemsPorEvaluar, 'Resultados') : null;
            $this->evaluacionProyectoFormulario1Linea65->productos_puntaje == null ? array_push($itemsPorEvaluar, 'Productos') : null;
            $this->evaluacionProyectoFormulario1Linea65->cadena_valor_puntaje == null ? array_push($itemsPorEvaluar, 'Cadena de valor') : null;
            $this->evaluacionProyectoFormulario1Linea65->analisis_riesgos_puntaje == null ? array_push($itemsPorEvaluar, 'Análisis de riesgos') : null;

            $this->evaluacionProyectoFormulario1Linea65->ortografia_puntaje == null ? array_push($itemsPorEvaluar, 'Ortografía') : null;
            $this->evaluacionProyectoFormulario1Linea65->redaccion_puntaje == null ? array_push($itemsPorEvaluar, 'Redacción') : null;
            $this->evaluacionProyectoFormulario1Linea65->normas_apa_puntaje == null ? array_push($itemsPorEvaluar, 'Normas APA') : null;
        }

        if ($this->proyecto && $this->proyecto->tipoFormularioConvocatoria->lineaProgramatica->codigo != 23) {
            foreach ($this->proyecto->proyectoRolesSennova as $proyectoRol) {
                !$proyectoRol->proyectoRolesEvaluaciones()->where('evaluacion_id', $this->id)->first() ? $countRolesSinEvaluar++ : null;
            }
        }

        $countRolesSinEvaluar > 0 ? array_push($itemsPorEvaluar, 'Hay ' . $countRolesSinEvaluar . ' rol(es) sin evaluar') : null;

        $countPresupuestosSinEvaluar = 0;
        if ($this->proyecto) {
            foreach ($this->proyecto->proyectoPresupuesto as $proyectoPresupuesto) {
                !$proyectoPresupuesto->proyectoPresupuestosEvaluaciones()->where('evaluacion_id', $this->id)->first() ? $countPresupuestosSinEvaluar++ : null;
            }
        }

        $countPresupuestosSinEvaluar > 0 ? array_push($itemsPorEvaluar, 'Hay ' . $countPresupuestosSinEvaluar . ' rubro(s) presupuestal(es) sin evaluar') : null;

        return $itemsPorEvaluar;
    }

    public function getEstadoProyectoPorEvaluadorAttribute()
    {
        if ($this->evaluacionProyectoFormulario8Linea66()->exists()) {
            $causal_rechazo = null;
            if ($this->evaluacionCausalesRechazo()->where('causal_rechazo', '=', 4)->first()) {
                $causal_rechazo = 'En revisión por Cord. SENNOVA';
            } else if ($this->evaluacionCausalesRechazo()->whereIn('causal_rechazo', [1, 2, 3])->first()) {
                $causal_rechazo = 'Rechazado - Por causal de rechazo';
            }
            return $this->proyecto->estadoEvaluacionProyectoFormulario8Linea66($this->total_evaluacion, $this->total_recomendaciones, null, $causal_rechazo);
        } else if ($this->evaluacionProyectoFormulario6Linea82()->exists()) {
            $causal_rechazo = null;
            if ($this->evaluacionCausalesRechazo()->where('causal_rechazo', '=', 4)->first()) {
                $causal_rechazo = 'En revisión por Cord. SENNOVA';
            } else if ($this->evaluacionCausalesRechazo()->whereIn('causal_rechazo', [1, 2, 3])->first()) {
                $causal_rechazo = 'Rechazado - Por causal de rechazo';
            }
            return $this->proyecto->estadoEvaluacionProyectoFormulario6Linea82($this->total_evaluacion, $this->total_recomendaciones, null, $causal_rechazo);
        } else if ($this->evaluacionProyectoFormulario12Linea68()->exists()) {
            return $this->proyecto->estadoEvaluacionProyectoFormulario12Linea68($this->total_evaluacion, $this->total_recomendaciones, null);
        } else if ($this->evaluacionProyectoFormulario1Linea65()->exists()) {
            return $this->proyecto->estadoEvaluacionProyectoFormulario1Linea65($this->total_evaluacion, $this->total_recomendaciones, null);
        }
    }

    public function getCausalRechazoProyectoFormulario8Linea66Attribute()
    {
        $causal_rechazo = null;
        if ($this->evaluacionProyectoFormulario8Linea66()->exists()) {
            if ($this->evaluacionCausalesRechazo()->where('causal_rechazo', '=', 4)->first()) {
                $causal_rechazo = 'En revisión por Cord. SENNOVA';
            } else if ($this->evaluacionCausalesRechazo()->whereIn('causal_rechazo', [1, 2, 3])->first()) {
                $causal_rechazo = 'Rechazado - Por causal de rechazo';
            }
        }
        return $causal_rechazo;
    }

    /**
     * Filtrar registros
     *
     * @param  mixed $query
     * @param  mixed $filters
     * @return void
     */
    public function scopeFilterEvaluacion($query, array $filters)
    {
        $query->when($filters['search'] ?? null, function ($query, $search) {
            $search = str_replace('"', "", $search);
            $search = str_replace("'", "", $search);
            $search = str_replace(' ', '%%', $search);

            $query->select('users.nombre', 'evaluaciones.*');
            $query->join('users', 'evaluaciones.user_id', 'users.id');
            $query->where('users.nombre', 'ilike', '%' . $search . '%');
            if (is_numeric($search)) {
                $query->orWhere('evaluaciones.proyecto_id', $search - 8000);
            }
        })->when($filters['estado'] ?? null, function ($query, $estado) {
            if ($estado == 'finalizados idi') {
                $query->join('evaluaciones_proyectos_formulario_8_linea_66', 'evaluaciones.id', 'evaluaciones_proyectos_formulario_8_linea_66.id');
                $query->where('evaluaciones.finalizado', true);
            } else if ($estado == 'finalizados cultira innovacion') {
                $query->join('evaluaciones_proyectos_formulario_1_linea_65', 'evaluaciones.id', 'evaluaciones_proyectos_formulario_1_linea_65.id');
                $query->where('evaluaciones.finalizado', true);
            } else if ($estado == 'finalizados ta') {
                $query->join('evaluaciones_proyectos_formulario_4_linea_70', 'evaluaciones.id', 'evaluaciones_proyectos_formulario_4_linea_70.id');
                $query->where('evaluaciones.finalizado', true);
            } else if ($estado == 'finalizados tp') {
                $query->join('evaluaciones_proyectos_formulario_5_linea_69', 'evaluaciones.id', 'evaluaciones_proyectos_formulario_5_linea_69.id');
                $query->where('evaluaciones.finalizado', true);
            } else if ($estado == 'finalizados st') {
                $query->join('evaluaciones_proyectos_formulario_12_linea_68', 'evaluaciones.id', 'evaluaciones_proyectos_formulario_12_linea_68.id');
                $query->where('evaluaciones.finalizado', true);
            } else if ($estado == 'sin evaluar idi') {
                $query->join('evaluaciones_proyectos_formulario_8_linea_66', 'evaluaciones.id', 'evaluaciones_proyectos_formulario_8_linea_66.id');
                $query->where('evaluaciones_proyectos_formulario_8_linea_66.updated_at', null);
            } else if ($estado == 'sin evaluar cultura innovacion') {
                $query->join('evaluaciones_proyectos_formulario_1_linea_65', 'evaluaciones.id', 'evaluaciones_proyectos_formulario_1_linea_65.id');
                $query->where('evaluaciones_proyectos_formulario_1_linea_65.updated_at', null);
            } else if ($estado == 'sin evaluar ta') {
                $query->join('evaluaciones_proyectos_formulario_4_linea_70', 'evaluaciones.id', 'evaluaciones_proyectos_formulario_4_linea_70.id');
                $query->where('evaluaciones_proyectos_formulario_4_linea_70.updated_at', null);
            } else if ($estado == 'sin evaluar tp') {
                $query->join('evaluaciones_proyectos_formulario_5_linea_69', 'evaluaciones.id', 'evaluaciones_proyectos_formulario_5_linea_69.id');
                $query->where('evaluaciones_proyectos_formulario_5_linea_69.updated_at', null);
            } else if ($estado == 'sin evaluar st') {
                $query->join('evaluaciones_proyectos_formulario_12_linea_68', 'evaluaciones.id', 'evaluaciones_proyectos_formulario_12_linea_68.id');
                $query->where('evaluaciones_proyectos_formulario_12_linea_68.updated_at', null);
            }
        });
    }

    public function getAllowedAttribute()
    {
        $allowed_to_view      = Gate::inspect('visualizar-evaluacion-autor', $this);
        $allowed_to_update    = Gate::inspect('modificar-evaluacion-autor', $this);
        $allowed_To_destroy   = $allowed_to_update;

        return collect(['to_view' => $allowed_to_view->allowed(), 'to_update' => $allowed_to_update->allowed(), 'to_destroy' => $allowed_To_destroy->allowed()]);
    }
}
