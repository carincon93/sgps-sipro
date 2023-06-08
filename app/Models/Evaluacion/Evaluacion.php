<?php

namespace App\Models\Evaluacion;

use App\Models\Convocatoria;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Gate;

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
    protected $appends = ['total_evaluacion', 'validar_evaluacion', 'total_recomendaciones', 'verificar_estado_evaluacion', 'estado_proyecto_por_evaluador', 'causal_rechazo_idi', 'allowed'];

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
     * Relationship with IdiEvaluacion
     *
     * @return object
     */
    public function idiEvaluacion()
    {
        return $this->hasOne(IdiEvaluacion::class, 'id');
    }

    /**
     * Relationship with CulturaInnovacionEvaluacion
     *
     * @return object
     */
    public function culturaInnovacionEvaluacion()
    {
        return $this->hasOne(CulturaInnovacionEvaluacion::class, 'id');
    }

    /**
     * Relationship with TaEvaluacion
     *
     * @return object
     */
    public function taEvaluacion()
    {
        return $this->hasOne(TaEvaluacion::class, 'id');
    }

    /**
     * Relationship with TpEvaluacion
     *
     * @return object
     */
    public function tpEvaluacion()
    {
        return $this->hasOne(TpEvaluacion::class, 'id');
    }

    /**
     * Relationship with ServicioTecnologicoEvaluacion
     *
     * @return object
     */
    public function servicioTecnologicoEvaluacion()
    {
        return $this->hasOne(ServicioTecnologicoEvaluacion::class, 'id');
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

    /**
     * getVerificarEstadoEvaluacionAttribute
     *
     * @return void
     */
    public function getVerificarEstadoEvaluacionAttribute()
    {
        $estado = null;
        if ($this->idiEvaluacion && $this->proyecto->idi()->exists()) {
            $estado = $this->finalizado ? 'Finalizado' : ($this->idiEvaluacion->updated_at == null ? 'Sin evaluar' : 'Evaluación iniciada');
        } else if ($this->culturaInnovacionEvaluacion && $this->proyecto->culturaInnovacion()->exists()) {
            $estado = $this->finalizado ? 'Finalizado' : ($this->culturaInnovacionEvaluacion->updated_at == null ? 'Sin evaluar' : 'Evaluación iniciada');
        } else if ($this->taEvaluacion && $this->proyecto->ta()->exists()) {
            $estado = $this->finalizado ? 'Finalizado' : ($this->taEvaluacion->updated_at == null ? 'Sin evaluar' : 'Evaluación iniciada');
        } else if ($this->tpEvaluacion && $this->proyecto->tp()->exists()) {
            $estado = $this->finalizado ? 'Finalizado' : ($this->tpEvaluacion->updated_at == null ? 'Sin evaluar' : 'Evaluación iniciada');
        } else if ($this->servicioTecnologicoEvaluacion && $this->proyecto->servicioTecnologico()->exists()) {
            $estado = $this->finalizado ? 'Finalizado' : ($this->servicioTecnologicoEvaluacion->updated_at == null ? 'Sin evaluar' : 'Evaluación iniciada');
        }

        return $estado;
    }

    /**
     * getTotalEvaluacionAttribute
     *
     * @return void
     */
    public function getTotalEvaluacionAttribute()
    {
        $total = 0;
        if ($this->idiEvaluacion && $this->proyecto->idi()->exists()) {
            $total = $this->idiEvaluacion->titulo_puntaje +
                $this->idiEvaluacion->video_puntaje +
                $this->idiEvaluacion->resumen_puntaje +
                $this->idiEvaluacion->problema_central_puntaje +
                $this->idiEvaluacion->objetivos_puntaje +
                $this->idiEvaluacion->metodologia_puntaje +
                $this->idiEvaluacion->entidad_aliada_puntaje +
                $this->idiEvaluacion->resultados_puntaje +
                $this->idiEvaluacion->productos_puntaje +
                $this->idiEvaluacion->cadena_valor_puntaje +
                $this->idiEvaluacion->analisis_riesgos_puntaje +
                $this->idiEvaluacion->ortografia_puntaje +
                $this->idiEvaluacion->redaccion_puntaje +
                $this->idiEvaluacion->normas_apa_puntaje;
        } else if ($this->culturaInnovacionEvaluacion && $this->proyecto->culturaInnovacion()->exists()) {
            $total = $this->culturaInnovacionEvaluacion->titulo_puntaje +
                $this->culturaInnovacionEvaluacion->video_puntaje +
                $this->culturaInnovacionEvaluacion->resumen_puntaje +
                $this->culturaInnovacionEvaluacion->problema_central_puntaje +
                $this->culturaInnovacionEvaluacion->objetivos_puntaje +
                $this->culturaInnovacionEvaluacion->metodologia_puntaje +
                $this->culturaInnovacionEvaluacion->entidad_aliada_puntaje +
                $this->culturaInnovacionEvaluacion->resultados_puntaje +
                $this->culturaInnovacionEvaluacion->productos_puntaje +
                $this->culturaInnovacionEvaluacion->cadena_valor_puntaje +
                $this->culturaInnovacionEvaluacion->analisis_riesgos_puntaje +
                $this->culturaInnovacionEvaluacion->ortografia_puntaje +
                $this->culturaInnovacionEvaluacion->redaccion_puntaje +
                $this->culturaInnovacionEvaluacion->normas_apa_puntaje;
        } else if ($this->servicioTecnologicoEvaluacion && $this->proyecto->servicioTecnologico()->exists()) {
            $total = $this->servicioTecnologicoEvaluacion->titulo_puntaje +
                $this->servicioTecnologicoEvaluacion->resumen_puntaje +
                $this->servicioTecnologicoEvaluacion->antecedentes_puntaje +
                $this->servicioTecnologicoEvaluacion->problema_central_puntaje +
                $this->servicioTecnologicoEvaluacion->justificacion_problema_puntaje +
                $this->servicioTecnologicoEvaluacion->pregunta_formulacion_problema_puntaje +
                $this->servicioTecnologicoEvaluacion->identificacion_problema_puntaje +
                $this->servicioTecnologicoEvaluacion->arbol_problemas_puntaje +
                $this->servicioTecnologicoEvaluacion->propuesta_sostenibilidad_puntaje +
                $this->servicioTecnologicoEvaluacion->impacto_ambiental_puntaje +
                $this->servicioTecnologicoEvaluacion->impacto_social_centro_puntaje +
                $this->servicioTecnologicoEvaluacion->impacto_social_productivo_puntaje +
                $this->servicioTecnologicoEvaluacion->impacto_tecnologico_puntaje +

                $this->servicioTecnologicoEvaluacion->riesgos_objetivo_general_puntaje +
                $this->servicioTecnologicoEvaluacion->riesgos_productos_puntaje +
                $this->servicioTecnologicoEvaluacion->riesgos_actividades_puntaje +

                $this->servicioTecnologicoEvaluacion->objetivo_general_puntaje +

                $this->servicioTecnologicoEvaluacion->primer_objetivo_puntaje +
                $this->servicioTecnologicoEvaluacion->segundo_objetivo_puntaje +
                $this->servicioTecnologicoEvaluacion->tercer_objetivo_puntaje +
                $this->servicioTecnologicoEvaluacion->cuarto_objetivo_puntaje +

                $this->servicioTecnologicoEvaluacion->resultados_primer_obj_puntaje +
                $this->servicioTecnologicoEvaluacion->resultados_segundo_obj_puntaje +
                $this->servicioTecnologicoEvaluacion->resultados_tercer_obj_puntaje +
                $this->servicioTecnologicoEvaluacion->resultados_cuarto_obj_puntaje +

                $this->servicioTecnologicoEvaluacion->metodologia_puntaje +

                $this->servicioTecnologicoEvaluacion->actividades_primer_obj_puntaje +
                $this->servicioTecnologicoEvaluacion->actividades_segundo_obj_puntaje +
                $this->servicioTecnologicoEvaluacion->actividades_tercer_obj_puntaje +
                $this->servicioTecnologicoEvaluacion->actividades_cuarto_obj_puntaje +

                $this->servicioTecnologicoEvaluacion->productos_primer_obj_puntaje +
                $this->servicioTecnologicoEvaluacion->productos_segundo_obj_puntaje +
                $this->servicioTecnologicoEvaluacion->productos_tercer_obj_puntaje +
                $this->servicioTecnologicoEvaluacion->productos_cuarto_obj_puntaje;
        }

        return round($total, 2);
    }

    public function getTotalRecomendacionesAttribute()
    {
        $total = 0;
        if ($this->idiEvaluacion && $this->proyecto->idi()->exists()) {
            $this->idiEvaluacion->titulo_comentario != null ? $total++ : null;
            $this->idiEvaluacion->video_comentario != null ? $total++ : null;
            $this->idiEvaluacion->resumen_comentario != null ? $total++ : null;
            $this->idiEvaluacion->problema_central_comentario != null ? $total++ : null;
            $this->idiEvaluacion->objetivos_comentario != null ? $total++ : null;
            $this->idiEvaluacion->metodologia_comentario != null ? $total++ : null;
            $this->idiEvaluacion->entidad_aliada_comentario != null ? $total++ : null;
            $this->idiEvaluacion->resultados_comentario != null ? $total++ : null;
            $this->idiEvaluacion->productos_comentario != null ? $total++ : null;
            $this->idiEvaluacion->cadena_valor_comentario != null ? $total++ : null;
            $this->idiEvaluacion->analisis_riesgos_comentario != null ? $total++ : null;
            $this->idiEvaluacion->justificacion_economia_naranja_requiere_comentario != null ? $total++ : null;
            $this->idiEvaluacion->justificacion_economia_naranja_comentario != null ? $total++ : null;
            $this->idiEvaluacion->justificacion_industria_4_requiere_comentario != null ? $total++ : null;
            $this->idiEvaluacion->justificacion_industria_4_comentario != null ? $total++ : null;
            $this->idiEvaluacion->bibliografia_requiere_comentario != null ? $total++ : null;
            $this->idiEvaluacion->bibliografia_comentario != null ? $total++ : null;
            $this->idiEvaluacion->fechas_requiere_comentario != null ? $total++ : null;
            $this->idiEvaluacion->fechas_comentario != null ? $total++ : null;
            $this->idiEvaluacion->justificacion_politica_discapacidad_requiere_comentario != null ? $total++ : null;
            $this->idiEvaluacion->justificacion_politica_discapacidad_comentario != null ? $total++ : null;
            $this->idiEvaluacion->actividad_economica_requiere_comentario != null ? $total++ : null;
            $this->idiEvaluacion->actividad_economica_comentario != null ? $total++ : null;
            $this->idiEvaluacion->disciplina_subarea_conocimiento_requiere_comentario != null ? $total++ : null;
            $this->idiEvaluacion->disciplina_subarea_conocimiento_comentario != null ? $total++ : null;
            $this->idiEvaluacion->red_conocimiento_requiere_comentario != null ? $total++ : null;
            $this->idiEvaluacion->red_conocimiento_comentario != null ? $total++ : null;
            $this->idiEvaluacion->tematica_estrategica_requiere_comentario != null ? $total++ : null;
            $this->idiEvaluacion->tematica_estrategica_comentario != null ? $total++ : null;

            $this->idiEvaluacion->ortografia_comentario != null ? $total++ : null;
            $this->idiEvaluacion->redaccion_comentario != null ? $total++ : null;
            $this->idiEvaluacion->normas_apa_comentario != null ? $total++ : null;

            $this->comentario_evaluador != null ? $total++ : null;
        } else if ($this->culturaInnovacionEvaluacion && $this->proyecto->culturaInnovacion()->exists()) {
            $this->culturaInnovacionEvaluacion->titulo_comentario != null ? $total++ : null;
            $this->culturaInnovacionEvaluacion->video_comentario != null ? $total++ : null;
            $this->culturaInnovacionEvaluacion->resumen_comentario != null ? $total++ : null;
            $this->culturaInnovacionEvaluacion->problema_central_comentario != null ? $total++ : null;
            $this->culturaInnovacionEvaluacion->objetivos_comentario != null ? $total++ : null;
            $this->culturaInnovacionEvaluacion->metodologia_comentario != null ? $total++ : null;
            $this->culturaInnovacionEvaluacion->entidad_aliada_comentario != null ? $total++ : null;
            $this->culturaInnovacionEvaluacion->resultados_comentario != null ? $total++ : null;
            $this->culturaInnovacionEvaluacion->productos_comentario != null ? $total++ : null;
            $this->culturaInnovacionEvaluacion->cadena_valor_comentario != null ? $total++ : null;
            $this->culturaInnovacionEvaluacion->analisis_riesgos_comentario != null ? $total++ : null;
            $this->culturaInnovacionEvaluacion->justificacion_economia_naranja_requiere_comentario != null ? $total++ : null;
            $this->culturaInnovacionEvaluacion->justificacion_economia_naranja_comentario != null ? $total++ : null;
            $this->culturaInnovacionEvaluacion->justificacion_industria_4_requiere_comentario != null ? $total++ : null;
            $this->culturaInnovacionEvaluacion->justificacion_industria_4_comentario != null ? $total++ : null;
            $this->culturaInnovacionEvaluacion->bibliografia_requiere_comentario != null ? $total++ : null;
            $this->culturaInnovacionEvaluacion->bibliografia_comentario != null ? $total++ : null;
            $this->culturaInnovacionEvaluacion->fechas_requiere_comentario != null ? $total++ : null;
            $this->culturaInnovacionEvaluacion->fechas_comentario != null ? $total++ : null;
            $this->culturaInnovacionEvaluacion->justificacion_politica_discapacidad_requiere_comentario != null ? $total++ : null;
            $this->culturaInnovacionEvaluacion->justificacion_politica_discapacidad_comentario != null ? $total++ : null;
            $this->culturaInnovacionEvaluacion->actividad_economica_requiere_comentario != null ? $total++ : null;
            $this->culturaInnovacionEvaluacion->actividad_economica_comentario != null ? $total++ : null;
            $this->culturaInnovacionEvaluacion->disciplina_subarea_conocimiento_requiere_comentario != null ? $total++ : null;
            $this->culturaInnovacionEvaluacion->disciplina_subarea_conocimiento_comentario != null ? $total++ : null;
            $this->culturaInnovacionEvaluacion->red_conocimiento_requiere_comentario != null ? $total++ : null;
            $this->culturaInnovacionEvaluacion->red_conocimiento_comentario != null ? $total++ : null;
            $this->culturaInnovacionEvaluacion->tematica_estrategica_requiere_comentario != null ? $total++ : null;
            $this->culturaInnovacionEvaluacion->tematica_estrategica_comentario != null ? $total++ : null;

            $this->culturaInnovacionEvaluacion->ortografia_comentario != null ? $total++ : null;
            $this->culturaInnovacionEvaluacion->redaccion_comentario != null ? $total++ : null;
            $this->culturaInnovacionEvaluacion->normas_apa_comentario != null ? $total++ : null;

            $this->comentario_evaluador != null ? $total++ : null;
        } else if ($this->taEvaluacion && $this->proyecto->ta()->exists()) {
            $this->taEvaluacion->resumen_regional_comentario != null ? $total++ : null;
            $this->taEvaluacion->antecedentes_tecnoacademia_comentario != null ? $total++ : null;
            $this->taEvaluacion->retos_oportunidades_comentario != null ? $total++ : null;
            $this->taEvaluacion->metodologia_comentario != null ? $total++ : null;
            $this->taEvaluacion->lineas_medulares_centro_comentario != null ? $total++ : null;
            $this->taEvaluacion->lineas_tecnologicas_centro_comentario != null ? $total++ : null;
            $this->taEvaluacion->articulacion_sennova_comentario != null ? $total++ : null;
            $this->taEvaluacion->productos_comentario != null ? $total++ : null;
            $this->taEvaluacion->municipios_comentario != null ? $total++ : null;
            $this->taEvaluacion->instituciones_comentario != null ? $total++ : null;
            $this->taEvaluacion->fecha_ejecucion_comentario != null ? $total++ : null;
            $this->taEvaluacion->cadena_valor_comentario != null ? $total++ : null;
            $this->taEvaluacion->analisis_riesgos_comentario != null ? $total++ : null;
            $this->taEvaluacion->anexos_comentario != null ? $total++ : null;
            $this->taEvaluacion->proyectos_macro_comentario != null ? $total++ : null;
            $this->taEvaluacion->bibliografia_comentario != null ? $total++ : null;
            $this->taEvaluacion->entidad_aliada_comentario != null ? $total++ : null;
            $this->taEvaluacion->edt_comentario != null ? $total++ : null;
            $this->taEvaluacion->articulacion_centro_formacion_comentario != null ? $total++ : null;
            $this->taEvaluacion->impacto_centro_formacion_comentario != null ? $total++ : null;

            $this->taEvaluacion->ortografia_comentario != null ? $total++ : null;
            $this->taEvaluacion->redaccion_comentario != null ? $total++ : null;
            $this->taEvaluacion->normas_apa_comentario != null ? $total++ : null;

            $this->comentario_evaluador != null ? $total++ : null;
        } else if ($this->tpEvaluacion && $this->proyecto->tp()->exists()) {
            $this->tpEvaluacion->resumen_regional_comentario != null ? $total++ : null;
            $this->tpEvaluacion->antecedentes_regional_comentario != null ? $total++ : null;
            $this->tpEvaluacion->municipios_comentario != null ? $total++ : null;
            $this->tpEvaluacion->fecha_ejecucion_comentario != null ? $total++ : null;
            $this->tpEvaluacion->cadena_valor_comentario != null ? $total++ : null;
            $this->tpEvaluacion->impacto_centro_formacion_comentario != null ? $total++ : null;
            $this->tpEvaluacion->bibliografia_comentario != null ? $total++ : null;
            $this->tpEvaluacion->retos_oportunidades_comentario != null ? $total++ : null;
            $this->tpEvaluacion->pertinencia_territorio_comentario != null ? $total++ : null;
            $this->tpEvaluacion->metodologia_comentario != null ? $total++ : null;
            $this->tpEvaluacion->analisis_riesgos_comentario != null ? $total++ : null;
            $this->tpEvaluacion->anexos_comentario != null ? $total++ : null;
            $this->tpEvaluacion->productos_comentario != null ? $total++ : null;
            $this->tpEvaluacion->ortografia_comentario != null ? $total++ : null;
            $this->tpEvaluacion->redaccion_comentario != null ? $total++ : null;
            $this->tpEvaluacion->normas_apa_comentario != null ? $total++ : null;
            $this->tpEvaluacion->arbol_problemas_comentario != null ? $total++ : null;
            $this->tpEvaluacion->arbol_objetivos_comentario != null ? $total++ : null;
            $this->tpEvaluacion->articulacion_sennova_comentario != null ? $total++ : null;

            $this->comentario_evaluador != null ? $total++ : null;
        } else if ($this->servicioTecnologicoEvaluacion && $this->proyecto->servicioTecnologico()->exists()) {
            $this->servicioTecnologicoEvaluacion->titulo_comentario != null ? $total++ : null;
            $this->servicioTecnologicoEvaluacion->resumen_comentario != null ? $total++ : null;
            $this->servicioTecnologicoEvaluacion->antecedentes_comentario != null ? $total++ : null;
            $this->servicioTecnologicoEvaluacion->problema_central_comentario != null ? $total++ : null;
            $this->servicioTecnologicoEvaluacion->justificacion_problema_comentario != null ? $total++ : null;
            $this->servicioTecnologicoEvaluacion->pregunta_formulacion_problema_comentario != null ? $total++ : null;
            $this->servicioTecnologicoEvaluacion->fecha_ejecucion_comentario != null ? $total++ : null;
            $this->servicioTecnologicoEvaluacion->propuesta_sostenibilidad_comentario != null ? $total++ : null;
            $this->servicioTecnologicoEvaluacion->identificacion_problema_comentario != null ? $total++ : null;
            $this->servicioTecnologicoEvaluacion->arbol_problemas_comentario != null ? $total++ : null;
            $this->servicioTecnologicoEvaluacion->video_comentario != null ? $total++ : null;
            $this->servicioTecnologicoEvaluacion->especificaciones_area_comentario != null ? $total++ : null;
            $this->servicioTecnologicoEvaluacion->ortografia_comentario != null ? $total++ : null;
            $this->servicioTecnologicoEvaluacion->redaccion_comentario != null ? $total++ : null;
            $this->servicioTecnologicoEvaluacion->normas_apa_comentario != null ? $total++ : null;
            $this->servicioTecnologicoEvaluacion->arbol_objetivos_comentario != null ? $total++ : null;
            $this->servicioTecnologicoEvaluacion->impacto_ambiental_comentario != null ? $total++ : null;
            $this->servicioTecnologicoEvaluacion->impacto_social_centro_comentario != null ? $total++ : null;
            $this->servicioTecnologicoEvaluacion->impacto_social_productivo_comentario != null ? $total++ : null;
            $this->servicioTecnologicoEvaluacion->impacto_tecnologico_comentario != null ? $total++ : null;
            $this->servicioTecnologicoEvaluacion->objetivo_general_comentario != null ? $total++ : null;
            $this->servicioTecnologicoEvaluacion->primer_objetivo_comentario != null ? $total++ : null;
            $this->servicioTecnologicoEvaluacion->segundo_objetivo_comentario != null ? $total++ : null;
            $this->servicioTecnologicoEvaluacion->tercer_objetivo_comentario != null ? $total++ : null;
            $this->servicioTecnologicoEvaluacion->cuarto_objetivo_comentario != null ? $total++ : null;
            $this->servicioTecnologicoEvaluacion->resultados_primer_obj_comentario != null ? $total++ : null;
            $this->servicioTecnologicoEvaluacion->resultados_segundo_obj_comentario != null ? $total++ : null;
            $this->servicioTecnologicoEvaluacion->resultados_tercer_obj_comentario != null ? $total++ : null;
            $this->servicioTecnologicoEvaluacion->resultados_cuarto_obj_comentario != null ? $total++ : null;
            $this->servicioTecnologicoEvaluacion->metodologia_comentario != null ? $total++ : null;
            $this->servicioTecnologicoEvaluacion->actividades_primer_obj_comentario != null ? $total++ : null;
            $this->servicioTecnologicoEvaluacion->actividades_segundo_obj_comentario != null ? $total++ : null;
            $this->servicioTecnologicoEvaluacion->actividades_tercer_obj_comentario != null ? $total++ : null;
            $this->servicioTecnologicoEvaluacion->actividades_cuarto_obj_comentario != null ? $total++ : null;
            $this->servicioTecnologicoEvaluacion->productos_primer_obj_comentario != null ? $total++ : null;
            $this->servicioTecnologicoEvaluacion->productos_segundo_obj_comentario != null ? $total++ : null;
            $this->servicioTecnologicoEvaluacion->productos_tercer_obj_comentario != null ? $total++ : null;
            $this->servicioTecnologicoEvaluacion->productos_cuarto_obj_comentario != null ? $total++ : null;
            $this->servicioTecnologicoEvaluacion->cadena_valor_comentario != null ? $total++ : null;
            $this->servicioTecnologicoEvaluacion->bibliografia_comentario != null ? $total++ : null;
            $this->servicioTecnologicoEvaluacion->anexos_comentario != null ? $total++ : null;
            $this->servicioTecnologicoEvaluacion->riesgos_objetivo_general_comentario != null ? $total++ : null;
            $this->servicioTecnologicoEvaluacion->riesgos_productos_comentario != null ? $total++ : null;
            $this->servicioTecnologicoEvaluacion->riesgos_actividades_comentario != null ? $total++ : null;
            $this->servicioTecnologicoEvaluacion->inventario_equipos_comentario != null ? $total++ : null;

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

        if ($this->idiEvaluacion && $this->proyecto->idi()->exists()) {
            $this->idiEvaluacion->titulo_puntaje == null ? array_push($itemsPorEvaluar, 'Título') : null;
            $this->idiEvaluacion->resumen_puntaje == null ? array_push($itemsPorEvaluar, 'Resumen') : null;
            $this->idiEvaluacion->problema_central_puntaje == null ? array_push($itemsPorEvaluar, 'Problema central') : null;
            $this->idiEvaluacion->objetivos_puntaje == null ? array_push($itemsPorEvaluar, 'Objetivos') : null;
            $this->idiEvaluacion->metodologia_puntaje == null ? array_push($itemsPorEvaluar, 'Metodología') : null;
            $this->idiEvaluacion->resultados_puntaje == null ? array_push($itemsPorEvaluar, 'Resultados') : null;
            $this->idiEvaluacion->productos_puntaje == null ? array_push($itemsPorEvaluar, 'Productos') : null;
            $this->idiEvaluacion->cadena_valor_puntaje == null ? array_push($itemsPorEvaluar, 'Cadena de valor') : null;
            $this->idiEvaluacion->analisis_riesgos_puntaje == null ? array_push($itemsPorEvaluar, 'Análisis de riesgos') : null;

            $this->idiEvaluacion->ortografia_puntaje == null ? array_push($itemsPorEvaluar, 'Ortografía') : null;
            $this->idiEvaluacion->redaccion_puntaje == null ? array_push($itemsPorEvaluar, 'Redacción') : null;
            $this->idiEvaluacion->normas_apa_puntaje == null ? array_push($itemsPorEvaluar, 'Normas APA') : null;
        } else if ($this->culturaInnovacionEvaluacion && $this->proyecto->culturaInnovacion()->exists()) {
            $this->culturaInnovacionEvaluacion->titulo_puntaje == null ? array_push($itemsPorEvaluar, 'Título') : null;
            $this->culturaInnovacionEvaluacion->resumen_puntaje == null ? array_push($itemsPorEvaluar, 'Resumen') : null;
            $this->culturaInnovacionEvaluacion->problema_central_puntaje == null ? array_push($itemsPorEvaluar, 'Problema central') : null;
            $this->culturaInnovacionEvaluacion->objetivos_puntaje == null ? array_push($itemsPorEvaluar, 'Objetivos') : null;
            $this->culturaInnovacionEvaluacion->metodologia_puntaje == null ? array_push($itemsPorEvaluar, 'Metodología') : null;
            $this->culturaInnovacionEvaluacion->resultados_puntaje == null ? array_push($itemsPorEvaluar, 'Resultados') : null;
            $this->culturaInnovacionEvaluacion->productos_puntaje == null ? array_push($itemsPorEvaluar, 'Productos') : null;
            $this->culturaInnovacionEvaluacion->cadena_valor_puntaje == null ? array_push($itemsPorEvaluar, 'Cadena de valor') : null;
            $this->culturaInnovacionEvaluacion->analisis_riesgos_puntaje == null ? array_push($itemsPorEvaluar, 'Análisis de riesgos') : null;

            $this->culturaInnovacionEvaluacion->ortografia_puntaje == null ? array_push($itemsPorEvaluar, 'Ortografía') : null;
            $this->culturaInnovacionEvaluacion->redaccion_puntaje == null ? array_push($itemsPorEvaluar, 'Redacción') : null;
            $this->culturaInnovacionEvaluacion->normas_apa_puntaje == null ? array_push($itemsPorEvaluar, 'Normas APA') : null;
        }

        if ($this->proyecto && $this->proyecto->lineaProgramatica->codigo != 23) {
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
        if ($this->idiEvaluacion()->exists()) {
            $causalRechazo = null;
            if ($this->evaluacionCausalesRechazo()->where('causal_rechazo', '=', 4)->first()) {
                $causalRechazo = 'En revisión por Cord. SENNOVA';
            } else if ($this->evaluacionCausalesRechazo()->whereIn('causal_rechazo', [1, 2, 3])->first()) {
                $causalRechazo = 'Rechazado - Por causal de rechazo';
            }
            return $this->proyecto->estadoEvaluacionIdi($this->total_evaluacion, $this->total_recomendaciones, null, $causalRechazo);
        } else if ($this->servicioTecnologicoEvaluacion()->exists()) {
            return $this->proyecto->estadoEvaluacionServiciosTecnologicos($this->total_evaluacion, $this->total_recomendaciones, null);
        } else if ($this->culturaInnovacionEvaluacion()->exists()) {
            return $this->proyecto->estadoEvaluacionCulturaInnovacion($this->total_evaluacion, $this->total_recomendaciones, null);
        }
    }

    public function getCausalRechazoIdiAttribute()
    {
        $causalRechazo = null;
        if ($this->idiEvaluacion()->exists()) {
            if ($this->evaluacionCausalesRechazo()->where('causal_rechazo', '=', 4)->first()) {
                $causalRechazo = 'En revisión por Cord. SENNOVA';
            } else if ($this->evaluacionCausalesRechazo()->whereIn('causal_rechazo', [1, 2, 3])->first()) {
                $causalRechazo = 'Rechazado - Por causal de rechazo';
            }
        }
        return $causalRechazo;
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
                $query->join('idi_evaluaciones', 'evaluaciones.id', 'idi_evaluaciones.id');
                $query->where('evaluaciones.finalizado', true);
            } else if ($estado == 'finalizados cultira innovacion') {
                $query->join('cultura_innovacion_evaluaciones', 'evaluaciones.id', 'cultura_innovacion_evaluaciones.id');
                $query->where('evaluaciones.finalizado', true);
            } else if ($estado == 'finalizados ta') {
                $query->join('ta_evaluaciones', 'evaluaciones.id', 'ta_evaluaciones.id');
                $query->where('evaluaciones.finalizado', true);
            } else if ($estado == 'finalizados tp') {
                $query->join('tp_evaluaciones', 'evaluaciones.id', 'tp_evaluaciones.id');
                $query->where('evaluaciones.finalizado', true);
            } else if ($estado == 'finalizados st') {
                $query->join('servicios_tecnologicos_evaluaciones', 'evaluaciones.id', 'servicios_tecnologicos_evaluaciones.id');
                $query->where('evaluaciones.finalizado', true);
            } else if ($estado == 'sin evaluar idi') {
                $query->join('idi_evaluaciones', 'evaluaciones.id', 'idi_evaluaciones.id');
                $query->where('idi_evaluaciones.updated_at', null);
            } else if ($estado == 'sin evaluar cultura innovacion') {
                $query->join('cultura_innovacion_evaluaciones', 'evaluaciones.id', 'cultura_innovacion_evaluaciones.id');
                $query->where('cultura_innovacion_evaluaciones.updated_at', null);
            } else if ($estado == 'sin evaluar ta') {
                $query->join('ta_evaluaciones', 'evaluaciones.id', 'ta_evaluaciones.id');
                $query->where('ta_evaluaciones.updated_at', null);
            } else if ($estado == 'sin evaluar tp') {
                $query->join('tp_evaluaciones', 'evaluaciones.id', 'tp_evaluaciones.id');
                $query->where('tp_evaluaciones.updated_at', null);
            } else if ($estado == 'sin evaluar st') {
                $query->join('servicios_tecnologicos_evaluaciones', 'evaluaciones.id', 'servicios_tecnologicos_evaluaciones.id');
                $query->where('servicios_tecnologicos_evaluaciones.updated_at', null);
            }
        });
    }

    public function getAllowedAttribute()
    {
        $allowedToView      = Gate::inspect('visualizar-evaluacion-autor', $this);
        $allowedToUpdate    = Gate::inspect('modificar-evaluacion-autor', $this);
        $allowedToDestroy   = $allowedToUpdate;

        return collect(['to_view' => $allowedToView->allowed(), 'to_update' => $allowedToUpdate->allowed(), 'to_destroy' => $allowedToDestroy->allowed()]);
    }
}
