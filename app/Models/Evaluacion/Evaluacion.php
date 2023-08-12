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

    /**
     * getTotalEvaluacionAttribute
     *
     * @return void
     */
    public function getTotalEvaluacionAttribute()
    {
        $total = 0;
        if ($this->evaluacionProyectoFormulario8Linea66 && $this->proyecto->proyectoFormulario8Linea66()->exists()) {
            $total = $this->evaluacionProyectoFormulario8Linea66->titulo_puntaje +
                $this->evaluacionProyectoFormulario8Linea66->video_puntaje +
                $this->evaluacionProyectoFormulario8Linea66->resumen_puntaje +
                $this->evaluacionProyectoFormulario8Linea66->problema_central_puntaje +
                $this->evaluacionProyectoFormulario8Linea66->objetivos_puntaje +
                $this->evaluacionProyectoFormulario8Linea66->metodologia_puntaje +
                $this->evaluacionProyectoFormulario8Linea66->entidad_aliada_puntaje +
                $this->evaluacionProyectoFormulario8Linea66->resultados_puntaje +
                $this->evaluacionProyectoFormulario8Linea66->productos_puntaje +
                $this->evaluacionProyectoFormulario8Linea66->cadena_valor_puntaje +
                $this->evaluacionProyectoFormulario8Linea66->analisis_riesgos_puntaje +
                $this->evaluacionProyectoFormulario8Linea66->ortografia_puntaje +
                $this->evaluacionProyectoFormulario8Linea66->redaccion_puntaje +
                $this->evaluacionProyectoFormulario8Linea66->normas_apa_puntaje;
        } else if ($this->evaluacionProyectoFormulario1Linea65 && $this->proyecto->proyectoFormulario1Linea65()->exists()) {
            $total = $this->evaluacionProyectoFormulario1Linea65->titulo_puntaje +
                $this->evaluacionProyectoFormulario1Linea65->video_puntaje +
                $this->evaluacionProyectoFormulario1Linea65->resumen_puntaje +
                $this->evaluacionProyectoFormulario1Linea65->problema_central_puntaje +
                $this->evaluacionProyectoFormulario1Linea65->objetivos_puntaje +
                $this->evaluacionProyectoFormulario1Linea65->metodologia_puntaje +
                $this->evaluacionProyectoFormulario1Linea65->entidad_aliada_puntaje +
                $this->evaluacionProyectoFormulario1Linea65->resultados_puntaje +
                $this->evaluacionProyectoFormulario1Linea65->productos_puntaje +
                $this->evaluacionProyectoFormulario1Linea65->cadena_valor_puntaje +
                $this->evaluacionProyectoFormulario1Linea65->analisis_riesgos_puntaje +
                $this->evaluacionProyectoFormulario1Linea65->ortografia_puntaje +
                $this->evaluacionProyectoFormulario1Linea65->redaccion_puntaje +
                $this->evaluacionProyectoFormulario1Linea65->normas_apa_puntaje;
        } else if ($this->evaluacionProyectoFormulario12Linea68 && $this->proyecto->proyectoFormulario12Linea68()->exists()) {
            $total = $this->evaluacionProyectoFormulario12Linea68->titulo_puntaje +
                $this->evaluacionProyectoFormulario12Linea68->resumen_puntaje +
                $this->evaluacionProyectoFormulario12Linea68->antecedentes_puntaje +
                $this->evaluacionProyectoFormulario12Linea68->problema_central_puntaje +
                $this->evaluacionProyectoFormulario12Linea68->justificacion_problema_puntaje +
                $this->evaluacionProyectoFormulario12Linea68->pregunta_formulacion_problema_puntaje +
                $this->evaluacionProyectoFormulario12Linea68->identificacion_problema_puntaje +
                $this->evaluacionProyectoFormulario12Linea68->arbol_problemas_puntaje +
                $this->evaluacionProyectoFormulario12Linea68->propuesta_sostenibilidad_puntaje +
                $this->evaluacionProyectoFormulario12Linea68->impacto_ambiental_puntaje +
                $this->evaluacionProyectoFormulario12Linea68->impacto_social_centro_puntaje +
                $this->evaluacionProyectoFormulario12Linea68->impacto_social_productivo_puntaje +
                $this->evaluacionProyectoFormulario12Linea68->impacto_tecnologico_puntaje +

                $this->evaluacionProyectoFormulario12Linea68->riesgos_objetivo_general_puntaje +
                $this->evaluacionProyectoFormulario12Linea68->riesgos_productos_puntaje +
                $this->evaluacionProyectoFormulario12Linea68->riesgos_actividades_puntaje +

                $this->evaluacionProyectoFormulario12Linea68->objetivo_general_puntaje +

                $this->evaluacionProyectoFormulario12Linea68->primer_objetivo_puntaje +
                $this->evaluacionProyectoFormulario12Linea68->segundo_objetivo_puntaje +
                $this->evaluacionProyectoFormulario12Linea68->tercer_objetivo_puntaje +
                $this->evaluacionProyectoFormulario12Linea68->cuarto_objetivo_puntaje +

                $this->evaluacionProyectoFormulario12Linea68->resultados_primer_obj_puntaje +
                $this->evaluacionProyectoFormulario12Linea68->resultados_segundo_obj_puntaje +
                $this->evaluacionProyectoFormulario12Linea68->resultados_tercer_obj_puntaje +
                $this->evaluacionProyectoFormulario12Linea68->resultados_cuarto_obj_puntaje +

                $this->evaluacionProyectoFormulario12Linea68->metodologia_puntaje +

                $this->evaluacionProyectoFormulario12Linea68->actividades_primer_obj_puntaje +
                $this->evaluacionProyectoFormulario12Linea68->actividades_segundo_obj_puntaje +
                $this->evaluacionProyectoFormulario12Linea68->actividades_tercer_obj_puntaje +
                $this->evaluacionProyectoFormulario12Linea68->actividades_cuarto_obj_puntaje +

                $this->evaluacionProyectoFormulario12Linea68->productos_primer_obj_puntaje +
                $this->evaluacionProyectoFormulario12Linea68->productos_segundo_obj_puntaje +
                $this->evaluacionProyectoFormulario12Linea68->productos_tercer_obj_puntaje +
                $this->evaluacionProyectoFormulario12Linea68->productos_cuarto_obj_puntaje;
        }

        return round($total, 2);
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
        $allowed_to_view      = Gate::inspect('visualizar-evaluacion-autor', $this);
        $allowed_to_update    = Gate::inspect('modificar-evaluacion-autor', $this);
        $allowed_To_destroy   = $allowed_to_update;

        return collect(['to_view' => $allowed_to_view->allowed(), 'to_update' => $allowed_to_update->allowed(), 'to_destroy' => $allowed_To_destroy->allowed()]);
    }
}
