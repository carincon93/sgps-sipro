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
    protected $appends = ['total_evaluacion', 'validar_evaluacion', 'total_recomendaciones', 'verificar_estado_evaluacion', 'estado_proyecto_por_evaluador', 'causal_rechazo_proyecto_linea_66', 'allowed'];

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
     * Relationship with EvaluacionProyectoLinea66
     *
     * @return object
     */
    public function evaluacionProyectoLinea66()
    {
        return $this->hasOne(EvaluacionProyectoLinea66::class, 'id');
    }

    /**
     * Relationship with EvaluacionProyectoLinea65
     *
     * @return object
     */
    public function evaluacionProyectoLinea65()
    {
        return $this->hasOne(EvaluacionProyectoLinea65::class, 'id');
    }

    /**
     * Relationship with EvaluacionProyectoLinea70
     *
     * @return object
     */
    public function evaluacionProyectoLinea70()
    {
        return $this->hasOne(EvaluacionProyectoLinea70::class, 'id');
    }

    /**
     * Relationship with EvaluacionProyectoLinea69
     *
     * @return object
     */
    public function evaluacionProyectoLinea69()
    {
        return $this->hasOne(EvaluacionProyectoLinea69::class, 'id');
    }

    /**
     * Relationship with EvaluacionProyectoLinea68
     *
     * @return object
     */
    public function evaluacionProyectoLinea68()
    {
        return $this->hasOne(EvaluacionProyectoLinea68::class, 'id');
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
        if ($this->evaluacionProyectoLinea66 && $this->proyecto->proyectoLinea66()->exists()) {
            $estado = $this->finalizado ? 'Finalizado' : ($this->evaluacionProyectoLinea66->updated_at == null ? 'Sin evaluar' : 'Evaluación iniciada');
        } else if ($this->evaluacionProyectoLinea65 && $this->proyecto->proyectoLinea65()->exists()) {
            $estado = $this->finalizado ? 'Finalizado' : ($this->evaluacionProyectoLinea65->updated_at == null ? 'Sin evaluar' : 'Evaluación iniciada');
        } else if ($this->evaluacionProyectoLinea70 && $this->proyecto->proyectoLinea70()->exists()) {
            $estado = $this->finalizado ? 'Finalizado' : ($this->evaluacionProyectoLinea70->updated_at == null ? 'Sin evaluar' : 'Evaluación iniciada');
        } else if ($this->evaluacionProyectoLinea69 && $this->proyecto->proyectoLinea69()->exists()) {
            $estado = $this->finalizado ? 'Finalizado' : ($this->evaluacionProyectoLinea69->updated_at == null ? 'Sin evaluar' : 'Evaluación iniciada');
        } else if ($this->evaluacionProyectoLinea68 && $this->proyecto->proyectoLinea68()->exists()) {
            $estado = $this->finalizado ? 'Finalizado' : ($this->evaluacionProyectoLinea68->updated_at == null ? 'Sin evaluar' : 'Evaluación iniciada');
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
        if ($this->evaluacionProyectoLinea66 && $this->proyecto->proyectoLinea66()->exists()) {
            $total = $this->evaluacionProyectoLinea66->titulo_puntaje +
                $this->evaluacionProyectoLinea66->video_puntaje +
                $this->evaluacionProyectoLinea66->resumen_puntaje +
                $this->evaluacionProyectoLinea66->problema_central_puntaje +
                $this->evaluacionProyectoLinea66->objetivos_puntaje +
                $this->evaluacionProyectoLinea66->metodologia_puntaje +
                $this->evaluacionProyectoLinea66->entidad_aliada_puntaje +
                $this->evaluacionProyectoLinea66->resultados_puntaje +
                $this->evaluacionProyectoLinea66->productos_puntaje +
                $this->evaluacionProyectoLinea66->cadena_valor_puntaje +
                $this->evaluacionProyectoLinea66->analisis_riesgos_puntaje +
                $this->evaluacionProyectoLinea66->ortografia_puntaje +
                $this->evaluacionProyectoLinea66->redaccion_puntaje +
                $this->evaluacionProyectoLinea66->normas_apa_puntaje;
        } else if ($this->evaluacionProyectoLinea65 && $this->proyecto->proyectoLinea65()->exists()) {
            $total = $this->evaluacionProyectoLinea65->titulo_puntaje +
                $this->evaluacionProyectoLinea65->video_puntaje +
                $this->evaluacionProyectoLinea65->resumen_puntaje +
                $this->evaluacionProyectoLinea65->problema_central_puntaje +
                $this->evaluacionProyectoLinea65->objetivos_puntaje +
                $this->evaluacionProyectoLinea65->metodologia_puntaje +
                $this->evaluacionProyectoLinea65->entidad_aliada_puntaje +
                $this->evaluacionProyectoLinea65->resultados_puntaje +
                $this->evaluacionProyectoLinea65->productos_puntaje +
                $this->evaluacionProyectoLinea65->cadena_valor_puntaje +
                $this->evaluacionProyectoLinea65->analisis_riesgos_puntaje +
                $this->evaluacionProyectoLinea65->ortografia_puntaje +
                $this->evaluacionProyectoLinea65->redaccion_puntaje +
                $this->evaluacionProyectoLinea65->normas_apa_puntaje;
        } else if ($this->evaluacionProyectoLinea68 && $this->proyecto->proyectoLinea68()->exists()) {
            $total = $this->evaluacionProyectoLinea68->titulo_puntaje +
                $this->evaluacionProyectoLinea68->resumen_puntaje +
                $this->evaluacionProyectoLinea68->antecedentes_puntaje +
                $this->evaluacionProyectoLinea68->problema_central_puntaje +
                $this->evaluacionProyectoLinea68->justificacion_problema_puntaje +
                $this->evaluacionProyectoLinea68->pregunta_formulacion_problema_puntaje +
                $this->evaluacionProyectoLinea68->identificacion_problema_puntaje +
                $this->evaluacionProyectoLinea68->arbol_problemas_puntaje +
                $this->evaluacionProyectoLinea68->propuesta_sostenibilidad_puntaje +
                $this->evaluacionProyectoLinea68->impacto_ambiental_puntaje +
                $this->evaluacionProyectoLinea68->impacto_social_centro_puntaje +
                $this->evaluacionProyectoLinea68->impacto_social_productivo_puntaje +
                $this->evaluacionProyectoLinea68->impacto_tecnologico_puntaje +

                $this->evaluacionProyectoLinea68->riesgos_objetivo_general_puntaje +
                $this->evaluacionProyectoLinea68->riesgos_productos_puntaje +
                $this->evaluacionProyectoLinea68->riesgos_actividades_puntaje +

                $this->evaluacionProyectoLinea68->objetivo_general_puntaje +

                $this->evaluacionProyectoLinea68->primer_objetivo_puntaje +
                $this->evaluacionProyectoLinea68->segundo_objetivo_puntaje +
                $this->evaluacionProyectoLinea68->tercer_objetivo_puntaje +
                $this->evaluacionProyectoLinea68->cuarto_objetivo_puntaje +

                $this->evaluacionProyectoLinea68->resultados_primer_obj_puntaje +
                $this->evaluacionProyectoLinea68->resultados_segundo_obj_puntaje +
                $this->evaluacionProyectoLinea68->resultados_tercer_obj_puntaje +
                $this->evaluacionProyectoLinea68->resultados_cuarto_obj_puntaje +

                $this->evaluacionProyectoLinea68->metodologia_puntaje +

                $this->evaluacionProyectoLinea68->actividades_primer_obj_puntaje +
                $this->evaluacionProyectoLinea68->actividades_segundo_obj_puntaje +
                $this->evaluacionProyectoLinea68->actividades_tercer_obj_puntaje +
                $this->evaluacionProyectoLinea68->actividades_cuarto_obj_puntaje +

                $this->evaluacionProyectoLinea68->productos_primer_obj_puntaje +
                $this->evaluacionProyectoLinea68->productos_segundo_obj_puntaje +
                $this->evaluacionProyectoLinea68->productos_tercer_obj_puntaje +
                $this->evaluacionProyectoLinea68->productos_cuarto_obj_puntaje;
        }

        return round($total, 2);
    }

    public function getTotalRecomendacionesAttribute()
    {
        $total = 0;
        if ($this->evaluacionProyectoLinea66 && $this->proyecto->proyectoLinea66()->exists()) {
            $this->evaluacionProyectoLinea66->titulo_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea66->video_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea66->resumen_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea66->problema_central_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea66->objetivos_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea66->metodologia_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea66->entidad_aliada_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea66->resultados_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea66->productos_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea66->cadena_valor_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea66->analisis_riesgos_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea66->justificacion_economia_naranja_requiere_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea66->justificacion_economia_naranja_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea66->justificacion_industria_4_requiere_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea66->justificacion_industria_4_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea66->bibliografia_requiere_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea66->bibliografia_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea66->fechas_requiere_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea66->fechas_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea66->justificacion_politica_discapacidad_requiere_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea66->justificacion_politica_discapacidad_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea66->actividad_economica_requiere_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea66->actividad_economica_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea66->disciplina_subarea_conocimiento_requiere_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea66->disciplina_subarea_conocimiento_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea66->red_conocimiento_requiere_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea66->red_conocimiento_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea66->tematica_estrategica_requiere_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea66->tematica_estrategica_comentario != null ? $total++ : null;

            $this->evaluacionProyectoLinea66->ortografia_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea66->redaccion_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea66->normas_apa_comentario != null ? $total++ : null;

            $this->comentario_evaluador != null ? $total++ : null;
        } else if ($this->evaluacionProyectoLinea65 && $this->proyecto->proyectoLinea65()->exists()) {
            $this->evaluacionProyectoLinea65->titulo_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea65->video_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea65->resumen_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea65->problema_central_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea65->objetivos_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea65->metodologia_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea65->entidad_aliada_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea65->resultados_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea65->productos_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea65->cadena_valor_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea65->analisis_riesgos_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea65->justificacion_economia_naranja_requiere_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea65->justificacion_economia_naranja_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea65->justificacion_industria_4_requiere_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea65->justificacion_industria_4_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea65->bibliografia_requiere_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea65->bibliografia_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea65->fechas_requiere_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea65->fechas_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea65->justificacion_politica_discapacidad_requiere_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea65->justificacion_politica_discapacidad_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea65->actividad_economica_requiere_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea65->actividad_economica_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea65->disciplina_subarea_conocimiento_requiere_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea65->disciplina_subarea_conocimiento_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea65->red_conocimiento_requiere_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea65->red_conocimiento_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea65->tematica_estrategica_requiere_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea65->tematica_estrategica_comentario != null ? $total++ : null;

            $this->evaluacionProyectoLinea65->ortografia_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea65->redaccion_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea65->normas_apa_comentario != null ? $total++ : null;

            $this->comentario_evaluador != null ? $total++ : null;
        } else if ($this->evaluacionProyectoLinea70 && $this->proyecto->proyectoLinea70()->exists()) {
            $this->evaluacionProyectoLinea70->resumen_regional_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea70->antecedentes_tecnoacademia_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea70->retos_oportunidades_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea70->metodologia_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea70->lineas_medulares_centro_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea70->lineas_tecnologicas_centro_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea70->articulacion_sennova_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea70->productos_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea70->municipios_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea70->instituciones_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea70->fecha_ejecucion_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea70->cadena_valor_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea70->analisis_riesgos_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea70->anexos_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea70->proyectos_macro_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea70->bibliografia_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea70->entidad_aliada_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea70->edt_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea70->articulacion_centro_formacion_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea70->impacto_centro_formacion_comentario != null ? $total++ : null;

            $this->evaluacionProyectoLinea70->ortografia_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea70->redaccion_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea70->normas_apa_comentario != null ? $total++ : null;

            $this->comentario_evaluador != null ? $total++ : null;
        } else if ($this->evaluacionProyectoLinea69 && $this->proyecto->proyectoLinea69()->exists()) {
            $this->evaluacionProyectoLinea69->resumen_regional_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea69->antecedentes_regional_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea69->municipios_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea69->fecha_ejecucion_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea69->cadena_valor_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea69->impacto_centro_formacion_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea69->bibliografia_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea69->retos_oportunidades_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea69->pertinencia_territorio_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea69->metodologia_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea69->analisis_riesgos_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea69->anexos_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea69->productos_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea69->ortografia_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea69->redaccion_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea69->normas_apa_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea69->arbol_problemas_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea69->arbol_objetivos_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea69->articulacion_sennova_comentario != null ? $total++ : null;

            $this->comentario_evaluador != null ? $total++ : null;
        } else if ($this->evaluacionProyectoLinea68 && $this->proyecto->proyectoLinea68()->exists()) {
            $this->evaluacionProyectoLinea68->titulo_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea68->resumen_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea68->antecedentes_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea68->problema_central_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea68->justificacion_problema_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea68->pregunta_formulacion_problema_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea68->fecha_ejecucion_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea68->propuesta_sostenibilidad_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea68->identificacion_problema_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea68->arbol_problemas_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea68->video_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea68->especificaciones_area_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea68->ortografia_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea68->redaccion_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea68->normas_apa_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea68->arbol_objetivos_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea68->impacto_ambiental_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea68->impacto_social_centro_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea68->impacto_social_productivo_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea68->impacto_tecnologico_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea68->objetivo_general_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea68->primer_objetivo_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea68->segundo_objetivo_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea68->tercer_objetivo_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea68->cuarto_objetivo_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea68->resultados_primer_obj_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea68->resultados_segundo_obj_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea68->resultados_tercer_obj_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea68->resultados_cuarto_obj_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea68->metodologia_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea68->actividades_primer_obj_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea68->actividades_segundo_obj_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea68->actividades_tercer_obj_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea68->actividades_cuarto_obj_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea68->productos_primer_obj_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea68->productos_segundo_obj_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea68->productos_tercer_obj_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea68->productos_cuarto_obj_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea68->cadena_valor_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea68->bibliografia_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea68->anexos_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea68->riesgos_objetivo_general_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea68->riesgos_productos_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea68->riesgos_actividades_comentario != null ? $total++ : null;
            $this->evaluacionProyectoLinea68->inventario_equipos_comentario != null ? $total++ : null;

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

        if ($this->evaluacionProyectoLinea66 && $this->proyecto->proyectoLinea66()->exists()) {
            $this->evaluacionProyectoLinea66->titulo_puntaje == null ? array_push($itemsPorEvaluar, 'Título') : null;
            $this->evaluacionProyectoLinea66->resumen_puntaje == null ? array_push($itemsPorEvaluar, 'Resumen') : null;
            $this->evaluacionProyectoLinea66->problema_central_puntaje == null ? array_push($itemsPorEvaluar, 'Problema central') : null;
            $this->evaluacionProyectoLinea66->objetivos_puntaje == null ? array_push($itemsPorEvaluar, 'Objetivos') : null;
            $this->evaluacionProyectoLinea66->metodologia_puntaje == null ? array_push($itemsPorEvaluar, 'Metodología') : null;
            $this->evaluacionProyectoLinea66->resultados_puntaje == null ? array_push($itemsPorEvaluar, 'Resultados') : null;
            $this->evaluacionProyectoLinea66->productos_puntaje == null ? array_push($itemsPorEvaluar, 'Productos') : null;
            $this->evaluacionProyectoLinea66->cadena_valor_puntaje == null ? array_push($itemsPorEvaluar, 'Cadena de valor') : null;
            $this->evaluacionProyectoLinea66->analisis_riesgos_puntaje == null ? array_push($itemsPorEvaluar, 'Análisis de riesgos') : null;

            $this->evaluacionProyectoLinea66->ortografia_puntaje == null ? array_push($itemsPorEvaluar, 'Ortografía') : null;
            $this->evaluacionProyectoLinea66->redaccion_puntaje == null ? array_push($itemsPorEvaluar, 'Redacción') : null;
            $this->evaluacionProyectoLinea66->normas_apa_puntaje == null ? array_push($itemsPorEvaluar, 'Normas APA') : null;
        } else if ($this->evaluacionProyectoLinea65 && $this->proyecto->proyectoLinea65()->exists()) {
            $this->evaluacionProyectoLinea65->titulo_puntaje == null ? array_push($itemsPorEvaluar, 'Título') : null;
            $this->evaluacionProyectoLinea65->resumen_puntaje == null ? array_push($itemsPorEvaluar, 'Resumen') : null;
            $this->evaluacionProyectoLinea65->problema_central_puntaje == null ? array_push($itemsPorEvaluar, 'Problema central') : null;
            $this->evaluacionProyectoLinea65->objetivos_puntaje == null ? array_push($itemsPorEvaluar, 'Objetivos') : null;
            $this->evaluacionProyectoLinea65->metodologia_puntaje == null ? array_push($itemsPorEvaluar, 'Metodología') : null;
            $this->evaluacionProyectoLinea65->resultados_puntaje == null ? array_push($itemsPorEvaluar, 'Resultados') : null;
            $this->evaluacionProyectoLinea65->productos_puntaje == null ? array_push($itemsPorEvaluar, 'Productos') : null;
            $this->evaluacionProyectoLinea65->cadena_valor_puntaje == null ? array_push($itemsPorEvaluar, 'Cadena de valor') : null;
            $this->evaluacionProyectoLinea65->analisis_riesgos_puntaje == null ? array_push($itemsPorEvaluar, 'Análisis de riesgos') : null;

            $this->evaluacionProyectoLinea65->ortografia_puntaje == null ? array_push($itemsPorEvaluar, 'Ortografía') : null;
            $this->evaluacionProyectoLinea65->redaccion_puntaje == null ? array_push($itemsPorEvaluar, 'Redacción') : null;
            $this->evaluacionProyectoLinea65->normas_apa_puntaje == null ? array_push($itemsPorEvaluar, 'Normas APA') : null;
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
        if ($this->evaluacionProyectoLinea66()->exists()) {
            $causalRechazo = null;
            if ($this->evaluacionCausalesRechazo()->where('causal_rechazo', '=', 4)->first()) {
                $causalRechazo = 'En revisión por Cord. SENNOVA';
            } else if ($this->evaluacionCausalesRechazo()->whereIn('causal_rechazo', [1, 2, 3])->first()) {
                $causalRechazo = 'Rechazado - Por causal de rechazo';
            }
            return $this->proyecto->estadoEvaluacionProyectoLinea66($this->total_evaluacion, $this->total_recomendaciones, null, $causalRechazo);
        } else if ($this->evaluacionProyectoLinea68()->exists()) {
            return $this->proyecto->estadoEvaluacionServiciosTecnologicos($this->total_evaluacion, $this->total_recomendaciones, null);
        } else if ($this->evaluacionProyectoLinea65()->exists()) {
            return $this->proyecto->estadoEvaluacionProyectoLinea65($this->total_evaluacion, $this->total_recomendaciones, null);
        }
    }

    public function getCausalRechazoProyectoLinea66Attribute()
    {
        $causalRechazo = null;
        if ($this->evaluacionProyectoLinea66()->exists()) {
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
                $query->join('evaluaciones_proyectos_linea_66', 'evaluaciones.id', 'evaluaciones_proyectos_linea_66.id');
                $query->where('evaluaciones.finalizado', true);
            } else if ($estado == 'finalizados cultira innovacion') {
                $query->join('evaluaciones_proyectos_linea_65', 'evaluaciones.id', 'evaluaciones_proyectos_linea_65.id');
                $query->where('evaluaciones.finalizado', true);
            } else if ($estado == 'finalizados ta') {
                $query->join('evaluaciones_proyectos_linea_70', 'evaluaciones.id', 'evaluaciones_proyectos_linea_70.id');
                $query->where('evaluaciones.finalizado', true);
            } else if ($estado == 'finalizados tp') {
                $query->join('evaluaciones_proyectos_linea_69', 'evaluaciones.id', 'evaluaciones_proyectos_linea_69.id');
                $query->where('evaluaciones.finalizado', true);
            } else if ($estado == 'finalizados st') {
                $query->join('evaluaciones_proyectos_linea_68', 'evaluaciones.id', 'evaluaciones_proyectos_linea_68.id');
                $query->where('evaluaciones.finalizado', true);
            } else if ($estado == 'sin evaluar idi') {
                $query->join('evaluaciones_proyectos_linea_66', 'evaluaciones.id', 'evaluaciones_proyectos_linea_66.id');
                $query->where('evaluaciones_proyectos_linea_66.updated_at', null);
            } else if ($estado == 'sin evaluar cultura innovacion') {
                $query->join('evaluaciones_proyectos_linea_65', 'evaluaciones.id', 'evaluaciones_proyectos_linea_65.id');
                $query->where('evaluaciones_proyectos_linea_65.updated_at', null);
            } else if ($estado == 'sin evaluar ta') {
                $query->join('evaluaciones_proyectos_linea_70', 'evaluaciones.id', 'evaluaciones_proyectos_linea_70.id');
                $query->where('evaluaciones_proyectos_linea_70.updated_at', null);
            } else if ($estado == 'sin evaluar tp') {
                $query->join('evaluaciones_proyectos_linea_69', 'evaluaciones.id', 'evaluaciones_proyectos_linea_69.id');
                $query->where('evaluaciones_proyectos_linea_69.updated_at', null);
            } else if ($estado == 'sin evaluar st') {
                $query->join('evaluaciones_proyectos_linea_68', 'evaluaciones.id', 'evaluaciones_proyectos_linea_68.id');
                $query->where('evaluaciones_proyectos_linea_68.updated_at', null);
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
