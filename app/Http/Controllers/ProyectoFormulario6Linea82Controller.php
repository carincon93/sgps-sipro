<?php

namespace App\Http\Controllers;

use App\Helpers\SelectHelper;
use App\Http\Requests\Evaluacion\EvaluacionProyectoFormulario6Linea82Request;
use App\Http\Requests\ProyectoFormulario6Linea82ColumnRequest;
use App\Models\Proyecto;
use App\Models\ProyectoFormulario6Linea82;
use App\Models\Convocatoria;
use App\Http\Requests\ProyectoFormulario6Linea82Request;
use App\Models\Evaluacion\EvaluacionProyectoFormulario6Linea82;
use App\Models\RolSennova;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProyectoFormulario6Linea82Controller extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Convocatoria $convocatoria)
    {
        return Inertia::render('Convocatorias/Proyectos/ProyectosFormulario6Linea82/Index', [
            'convocatoria'                      => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria', 'year'),
            'proyectos_formulario_6_linea_82'   => ProyectoFormulario6Linea82::getProyectosPorRol($convocatoria)->appends(['search' => request()->search]),
            'allowed_to_create'                 => Gate::inspect('formular-proyecto', [3, $convocatoria])->allowed()
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create(Convocatoria $convocatoria)
    {
        $this->authorize('formular-proyecto', [3, $convocatoria]);

        /** @var \App\Models\User */
        $auth_user = Auth::user();

        if ($auth_user->hasRole(6)) {
            $centros_formacion = SelectHelper::centrosFormacion()->where('regional_id', $auth_user->centroFormacion->regional->id)->values()->all();
        } else {
            $centros_formacion = SelectHelper::centrosFormacion();
        }

        return Inertia::render('Convocatorias/Proyectos/ProyectosFormulario6Linea82/Create', [
            'convocatoria'                      => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria', 'year'),
            'centros_formacion'                 => $centros_formacion,
            'areas_conocimiento'                => SelectHelper::areasConocimiento(),
            'subareas_conocimiento'             => SelectHelper::subareasConocimiento(),
            'disciplinas_subarea_conocimiento'  => SelectHelper::disciplinasSubareaConocimiento(),
            'lineas_investigacion'              => SelectHelper::lineasInvestigacion(),
            'actividades_economicas'            => SelectHelper::actividadesEconomicas(),
            'tematicas_estrategicas'            => SelectHelper::tematicasEstrategicas(),
            'redes_conocimiento'                => SelectHelper::redesConocimiento(),
            'grupos_investigacion'              => SelectHelper::gruposInvestigacion()->where('value', 126)->values()->all(),
            'areas_tematicas_eni'               => SelectHelper::areasTematicasEni(),
            'lineas_investigacion_eni'          => SelectHelper::lineasInvestigacion()->where('grupo_investigacion_id', 126)->values()->all(),
            'areas_cualificacion_mnc'           => json_decode(Storage::get('json/areas-cualificacion-mnc.json'), true),

            'roles_sennova'                     => RolSennova::select('id as value', 'nombre as label')->orderBy('nombre', 'ASC')->get(),
            'allowed_to_create'                 => Gate::inspect('formular-proyecto', [3, $convocatoria])->allowed()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(ProyectoFormulario6Linea82Request $request, Convocatoria $convocatoria)
    {
        $this->authorize('formular-proyecto', [$request->linea_programatica_id, $convocatoria]);

        $proyecto = new Proyecto();
        $proyecto->centroFormacion()->associate($request->centro_formacion_id);
        $proyecto->tipoFormularioConvocatoria()->associate(6);
        $proyecto->convocatoria()->associate($convocatoria);
        $proyecto->tecnoacademiaLineasTecnoacademia()->sync($request->tecnoacademia_linea_tecnoacademia_id);
        $proyecto->save();

        $proyecto_formulario_6_linea_82 = new ProyectoFormulario6Linea82();
        $proyecto_formulario_6_linea_82->titulo                                            = $request->titulo;
        $proyecto_formulario_6_linea_82->fecha_inicio                                      = $request->fecha_inicio;
        $proyecto_formulario_6_linea_82->fecha_finalizacion                                = $request->fecha_finalizacion;
        $proyecto_formulario_6_linea_82->max_meses_ejecucion                               = $request->max_meses_ejecucion;
        $proyecto_formulario_6_linea_82->proyecto_investigacion_pedagogica                 = $request->proyecto_investigacion_pedagogica;
        $proyecto_formulario_6_linea_82->articulacion_eni                                  = $request->articulacion_eni;
        $proyecto_formulario_6_linea_82->justificacion_proyecto_investigacion_pedagogica   = $request->justificacion_proyecto_investigacion_pedagogica;
        $proyecto_formulario_6_linea_82->proyecto_investigacion_pedagogica                 = $request->proyecto_investigacion_pedagogica;
        $proyecto_formulario_6_linea_82->articulacion_eni                                  = $request->articulacion_eni;
        $proyecto_formulario_6_linea_82->areas_cualificacion_mnc                           = $request->areas_cualificacion_mnc;

        $proyecto_formulario_6_linea_82->video                                             = null;
        $proyecto_formulario_6_linea_82->justificacion_industria_4                         = null;
        $proyecto_formulario_6_linea_82->justificacion_economia_naranja                    = null;
        $proyecto_formulario_6_linea_82->justificacion_politica_discapacidad               = null;
        $proyecto_formulario_6_linea_82->resumen                                           = '';
        $proyecto_formulario_6_linea_82->antecedentes                                      = '';
        $proyecto_formulario_6_linea_82->marco_conceptual                                  = '';
        $proyecto_formulario_6_linea_82->metodologia                                       = '';
        $proyecto_formulario_6_linea_82->propuesta_sostenibilidad                          = '';
        $proyecto_formulario_6_linea_82->bibliografia                                      = '';
        $proyecto_formulario_6_linea_82->numero_aprendices                                 = 0;
        $proyecto_formulario_6_linea_82->impacto_municipios                                = '';
        $proyecto_formulario_6_linea_82->impacto_centro_formacion                          = '';
        $proyecto_formulario_6_linea_82->muestreo                                          = 6;
        $proyecto_formulario_6_linea_82->actividades_muestreo                              = null;
        $proyecto_formulario_6_linea_82->objetivo_muestreo                                 = null;
        $proyecto_formulario_6_linea_82->recoleccion_especimenes                           = 2;
        $proyecto_formulario_6_linea_82->relacionado_plan_tecnologico                      = 2;
        $proyecto_formulario_6_linea_82->relacionado_agendas_competitividad                = 2;
        $proyecto_formulario_6_linea_82->relacionado_mesas_sectoriales                     = 2;
        $proyecto_formulario_6_linea_82->relacionado_tecnoacademia                         = 2;

        $proyecto_formulario_6_linea_82->lineaInvestigacion()->associate($request->linea_investigacion_id);
        $proyecto_formulario_6_linea_82->disciplinaSubareaConocimiento()->associate($request->disciplina_subarea_conocimiento_id);
        $proyecto_formulario_6_linea_82->tematicaEstrategica()->associate($request->tematica_estrategica_id);
        $proyecto_formulario_6_linea_82->redConocimiento()->associate($request->red_conocimiento_id);
        $proyecto_formulario_6_linea_82->actividadEconomica()->associate($request->actividad_economica_id);
        $proyecto_formulario_6_linea_82->grupoInvestigacionEni()->associate($request->grupo_investigacion_eni_id);

        $proyecto->proyectoFormulario8Linea82()->save($proyecto_formulario_6_linea_82);

        if ($convocatoria->tipo_convocatoria == 2) {
            $proyecto->proyectoDemo()->create([
                'proyecto_id' => $proyecto->id
            ]);
        }

        $proyecto->participantes()->attach(
            Auth::user()->id,
            [
                'es_formulador'     => true,
                'cantidad_meses'    => $request->cantidad_meses,
                'cantidad_horas'    => $request->cantidad_horas,
                'rol_sennova'       => $request->rol_sennova,
            ]
        );

        return redirect()->route('convocatorias.proyectos-formulario-8-linea-66.edit', [$convocatoria, $proyecto_formulario_6_linea_82])->with('success', 'El recurso se ha creado correctamente. Por favor continue diligenciando la información.');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\ProyectoFormulario6Linea82  $proyecto_formulario_6_linea_82
     * @return \Illuminate\Http\Response
     */
    public function show(Convocatoria $convocatoria, ProyectoFormulario6Linea82 $proyecto_formulario_6_linea_82)
    {
        $this->authorize('visualizar-proyecto-autor', [$proyecto_formulario_6_linea_82->proyecto]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\ProyectoFormulario6Linea82  $proyecto_formulario_6_linea_82
     * @return \Illuminate\Http\Response
     */
    public function edit(Convocatoria $convocatoria, ProyectoFormulario6Linea82 $proyecto_formulario_6_linea_82)
    {
        $this->authorize('visualizar-proyecto-autor', [$proyecto_formulario_6_linea_82->proyecto]);

        // $proyecto_formulario_6_linea_82->load('proyecto.evaluaciones.evaluacionProyectoFormulario6Linea82');

        $proyecto_formulario_6_linea_82->proyecto->precio_proyecto = $proyecto_formulario_6_linea_82->proyecto->precioProyecto;

        $proyecto_formulario_6_linea_82->proyecto->centroFormacion;
        $proyecto_formulario_6_linea_82->proyecto->programasFormacion;
        $proyecto_formulario_6_linea_82->proyecto->programasFormacion;
        $proyecto_formulario_6_linea_82->proyecto->municipios;
        $proyecto_formulario_6_linea_82->proyecto->tecnoacademiaLineasTecnoacademia;

        // $proyecto_formulario_6_linea_82->proyecto->pdfVersiones;
        // $proyecto_formulario_6_linea_82->proyecto->all_files;

        $proyecto_formulario_6_linea_82->disciplinaSubareaConocimiento->subareaConocimiento->areaConocimiento;
        $proyecto_formulario_6_linea_82->mesasSectoriales;
        $proyecto_formulario_6_linea_82->areasTematicasEni;
        $proyecto_formulario_6_linea_82->lineasInvestigacionEni;

        $proyecto_formulario_6_linea_82->mostrar_recomendaciones = $proyecto_formulario_6_linea_82->proyecto->mostrar_recomendaciones;
        $proyecto_formulario_6_linea_82->mostrar_requiere_subsanacion = $proyecto_formulario_6_linea_82->proyecto->mostrar_requiere_subsanacion;

        return Inertia::render('Convocatorias/Proyectos/ProyectosFormulario6Linea82/Edit', [
            'convocatoria'                                      => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria', 'mostrar_recomendaciones', 'year'),
            'proyecto_formulario_6_linea_82'                    => $proyecto_formulario_6_linea_82,
            'evaluacion'                                        => EvaluacionProyectoFormulario6Linea82::find(request()->evaluacion_id),
            'tecnoacademia'                                     => $proyecto_formulario_6_linea_82->proyecto->tecnoacademiaLineasTecnoacademia()->first() ? $proyecto_formulario_6_linea_82->proyecto->tecnoacademiaLineasTecnoacademia()->first()->tecnoacademia->only('id', 'nombre') : null,
            'mesas_sectoriales'                                 => SelectHelper::mesasSectoriales(),
            'areas_conocimiento'                                => SelectHelper::areasConocimiento(),
            'subareas_conocimiento'                             => SelectHelper::subareasConocimiento(),
            'disciplinas_subarea_conocimiento'                  => SelectHelper::disciplinasSubareaConocimiento(),
            'lineas_programaticas'                              => SelectHelper::lineasProgramaticas()->where('categoria_proyecto', 2)->values()->all(),
            'actividades_economicas'                            => SelectHelper::actividadesEconomicas(),
            'tematicas_estrategicas'                            => SelectHelper::tematicasEstrategicas(),
            'redes_conocimiento'                                => SelectHelper::redesConocimiento(),
            'lineas_tecnoacademia'                              => SelectHelper::lineasTecnoacademia(),
            'lineas_investigacion'                              => SelectHelper::lineasInvestigacion()->where('centro_formacion_id', $proyecto_formulario_6_linea_82->proyecto->centro_formacion_id)->values()->all(),
            'tecnoacademias'                                    => SelectHelper::tecnoacademias(),
            'municipios'                                        => SelectHelper::municipios(),
            'grupos_investigacion'                              => SelectHelper::gruposInvestigacion()->where('value', 126)->values()->all(),
            'areas_tematicas_eni'                               => SelectHelper::areasTematicasEni(),
            'lineas_investigacion_eni'                          => SelectHelper::lineasInvestigacion()->where('grupo_investigacion_id', 126)->values()->all(),
            'programas_formacion_con_registro_calificado'       => SelectHelper::programasFormacion()->where('registro_calificado', true)->where('centro_formacion_id', $proyecto_formulario_6_linea_82->proyecto->centro_formacion_id)->values()->all(),
            'programas_formacion_sin_registro_calificado'       => SelectHelper::programasFormacion()->where('registro_calificado', false)->values()->all(),

            'areas_cualificacion_mnc'                           => json_decode(Storage::get('json/areas-cualificacion-mnc.json'), true),
            'lineas_estrategicas'                               => json_decode(Storage::get('json/lineas-estrategicas.json'), true),

            'roles_sennova'                                     => RolSennova::select('id as value', 'nombre as label')->orderBy('nombre', 'ASC')->get(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\ProyectoFormulario6Linea82  $proyecto_formulario_6_linea_82
     * @return \Illuminate\Http\Response
     */
    public function update(ProyectoFormulario6Linea82Request $request, Convocatoria $convocatoria, ProyectoFormulario6Linea82 $proyecto_formulario_6_linea_82)
    {
        $this->authorize('modificar-proyecto-autor', [$proyecto_formulario_6_linea_82->proyecto]);

        $proyecto_formulario_6_linea_82->titulo                                          = $request->titulo;
        $proyecto_formulario_6_linea_82->fecha_inicio                                    = $request->fecha_inicio;
        $proyecto_formulario_6_linea_82->fecha_finalizacion                              = $request->fecha_finalizacion;
        $proyecto_formulario_6_linea_82->max_meses_ejecucion                             = $request->max_meses_ejecucion;
        $proyecto_formulario_6_linea_82->video                                           = $request->video;
        $proyecto_formulario_6_linea_82->numero_aprendices                               = $request->numero_aprendices;

        $proyecto_formulario_6_linea_82->resumen                                         = $request->resumen;
        $proyecto_formulario_6_linea_82->antecedentes                                    = $request->antecedentes;
        $proyecto_formulario_6_linea_82->marco_conceptual                                = $request->marco_conceptual;
        $proyecto_formulario_6_linea_82->justificacion_industria_4                       = $request->justificacion_industria_4;
        $proyecto_formulario_6_linea_82->justificacion_economia_naranja                  = $request->justificacion_economia_naranja;
        $proyecto_formulario_6_linea_82->justificacion_politica_discapacidad             = $request->justificacion_politica_discapacidad;
        $proyecto_formulario_6_linea_82->atencion_pluralista_diferencial                 = $request->atencion_pluralista_diferencial;
        $proyecto_formulario_6_linea_82->impacto_sector_agricola                         = $request->impacto_sector_agricola;
        $proyecto_formulario_6_linea_82->bibliografia                                    = $request->bibliografia;
        $proyecto_formulario_6_linea_82->impacto_municipios                              = $request->impacto_municipios;
        $proyecto_formulario_6_linea_82->impacto_centro_formacion                        = $request->impacto_centro_formacion;

        $proyecto_formulario_6_linea_82->muestreo                                        = $request->muestreo;
        $proyecto_formulario_6_linea_82->actividades_muestreo                            = $request->muestreo == 1 ? $request->actividades_muestreo : null;
        $proyecto_formulario_6_linea_82->objetivo_muestreo                               = $request->muestreo == 1 ? $request->objetivo_muestreo  : null;
        $proyecto_formulario_6_linea_82->recoleccion_especimenes                         = $request->recoleccion_especimenes;

        $proyecto_formulario_6_linea_82->relacionado_plan_tecnologico                    = $request->relacionado_plan_tecnologico;
        $proyecto_formulario_6_linea_82->relacionado_agendas_competitividad              = $request->relacionado_agendas_competitividad;
        $proyecto_formulario_6_linea_82->relacionado_mesas_sectoriales                   = $request->relacionado_mesas_sectoriales;
        $proyecto_formulario_6_linea_82->relacionado_tecnoacademia                       = $request->relacionado_tecnoacademia;
        $proyecto_formulario_6_linea_82->proyecto_investigacion_pedagogica               = $request->proyecto_investigacion_pedagogica;
        $proyecto_formulario_6_linea_82->articulacion_eni                                = $request->articulacion_eni;
        $proyecto_formulario_6_linea_82->justificacion_proyecto_investigacion_pedagogica = $request->justificacion_proyecto_investigacion_pedagogica;

        $proyecto_formulario_6_linea_82->aporta_a_campesena                              = $request->aporta_a_campesena;
        $proyecto_formulario_6_linea_82->relacionado_estrategia_campesena                = $request->relacionado_estrategia_campesena;
        $proyecto_formulario_6_linea_82->justificacion_relacion_campesena                = $request->justificacion_relacion_campesena;
        $proyecto_formulario_6_linea_82->lineas_estrategicas_convocatoria                = $request->lineas_estrategicas_convocatoria;
        $proyecto_formulario_6_linea_82->justificacion_lineas_estrategicas               = $request->justificacion_lineas_estrategicas;
        $proyecto_formulario_6_linea_82->impacto_regional                                = $request->impacto_regional;
        $proyecto_formulario_6_linea_82->justificacion_impacto_regional                  = $request->justificacion_impacto_regional;
        $proyecto_formulario_6_linea_82->justificacion_mesas_sectoriales                 = $request->justificacion_mesas_sectoriales;
        $proyecto_formulario_6_linea_82->areas_cualificacion_mnc                         = $request->areas_cualificacion_mnc;
        $proyecto_formulario_6_linea_82->lineas_estrategicas_beneficiadas                = $request->lineas_estrategicas_beneficiadas;
        $proyecto_formulario_6_linea_82->justificacion_lineas_estrategicas_beneficiadas  = $request->justificacion_lineas_estrategicas_beneficiadas;
        $proyecto_formulario_6_linea_82->veredas_corregimientos                          = $request->veredas_corregimientos;

        $proyecto_formulario_6_linea_82->lineaInvestigacion()->associate($request->linea_investigacion_id);
        $proyecto_formulario_6_linea_82->disciplinaSubareaConocimiento()->associate($request->disciplina_subarea_conocimiento_id);
        $proyecto_formulario_6_linea_82->tematicaEstrategica()->associate($request->tematica_estrategica_id);
        $proyecto_formulario_6_linea_82->redConocimiento()->associate($request->red_conocimiento_id);
        $proyecto_formulario_6_linea_82->actividadEconomica()->associate($request->actividad_economica_id);
        $proyecto_formulario_6_linea_82->grupoInvestigacionEni()->associate($request->grupo_investigacion_eni_id);

        $proyecto_formulario_6_linea_82->save();

        $proyecto_formulario_6_linea_82->proyecto->municipios()->sync($request->municipios);
        $proyecto_formulario_6_linea_82->areasTematicasEni()->sync($request->area_tematica_eni_id);
        $proyecto_formulario_6_linea_82->lineasInvestigacionEni()->sync($request->linea_investigacion_eni_id);
        $proyecto_formulario_6_linea_82->proyecto->programasFormacion()->sync(array_merge($request->programas_formacion ? $request->programas_formacion : [], $request->programas_formacion_articulados ? $request->programas_formacion_articulados : []));

        $request->relacionado_mesas_sectoriales == 1 ? $proyecto_formulario_6_linea_82->mesasSectoriales()->sync($request->mesa_sectorial_id) : $proyecto_formulario_6_linea_82->mesasSectoriales()->detach();
        $request->relacionado_tecnoacademia == 1 ? $proyecto_formulario_6_linea_82->proyecto->tecnoacademiaLineasTecnoacademia()->sync($request->linea_tecnologica_id) : $proyecto_formulario_6_linea_82->proyecto->tecnoacademiaLineasTecnoacademia()->detach();

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\ProyectoFormulario6Linea82  $proyecto_formulario_6_linea_82
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, Convocatoria $convocatoria, ProyectoFormulario6Linea82 $proyecto_formulario_6_linea_82)
    {
        $this->authorize('eliminar-proyecto-autor', [$proyecto_formulario_6_linea_82->proyecto]);

        // if (!Hash::check($request->password, Auth::user()->password)) {
        //     return back()
        //         ->withErrors(['password' => __('The password is incorrect.')]);
        // }

        $proyecto_formulario_6_linea_82->proyecto()->delete();

        return back()->with('success', 'El recurso se ha eliminado correctamente.');
    }

    public function updateEvaluacion(EvaluacionProyectoFormulario6Linea82Request $request, Convocatoria $convocatoria, EvaluacionProyectoFormulario6Linea82 $evaluacion_proyecto_linea66)
    {
        $this->authorize('modificar-evaluacion-autor', $evaluacion_proyecto_linea66->evaluacion);

        $evaluacion_proyecto_linea66->evaluacion()->update([
            'iniciado' => true,
            'clausula_confidencialidad' => $request->clausula_confidencialidad
        ]);

        $evaluacion_proyecto_linea66->titulo_puntaje              = $request->titulo_puntaje;
        $evaluacion_proyecto_linea66->titulo_comentario           = $request->titulo_requiere_comentario == false ? $request->titulo_comentario : null;
        $evaluacion_proyecto_linea66->video_puntaje               = $request->video_puntaje;
        $evaluacion_proyecto_linea66->video_comentario            = $request->video_requiere_comentario == false ? $request->video_comentario : null;
        $evaluacion_proyecto_linea66->resumen_puntaje             = $request->resumen_puntaje;
        $evaluacion_proyecto_linea66->resumen_comentario          = $request->resumen_requiere_comentario == false ? $request->resumen_comentario : null;
        $evaluacion_proyecto_linea66->ortografia_puntaje          = $request->ortografia_puntaje;
        $evaluacion_proyecto_linea66->ortografia_comentario       = $request->ortografia_requiere_comentario == false ? $request->ortografia_comentario : null;
        $evaluacion_proyecto_linea66->redaccion_puntaje           = $request->redaccion_puntaje;
        $evaluacion_proyecto_linea66->redaccion_comentario        = $request->redaccion_requiere_comentario == false ? $request->redaccion_comentario : null;
        $evaluacion_proyecto_linea66->normas_apa_puntaje          = $request->normas_apa_puntaje;
        $evaluacion_proyecto_linea66->normas_apa_comentario       = $request->normas_apa_requiere_comentario == false ? $request->normas_apa_comentario : null;

        $evaluacion_proyecto_linea66->justificacion_economia_naranja_comentario = $request->justificacion_economia_naranja_requiere_comentario == false ? $request->justificacion_economia_naranja_comentario : null;
        $evaluacion_proyecto_linea66->justificacion_industria_4_comentario = $request->justificacion_industria_4_requiere_comentario == false ? $request->justificacion_industria_4_comentario : null;
        $evaluacion_proyecto_linea66->bibliografia_comentario = $request->bibliografia_requiere_comentario == false ? $request->bibliografia_comentario : null;
        $evaluacion_proyecto_linea66->fechas_comentario = $request->fechas_requiere_comentario == false ? $request->fechas_comentario : null;
        $evaluacion_proyecto_linea66->justificacion_politica_discapacidad_comentario = $request->justificacion_politica_discapacidad_requiere_comentario == false ? $request->justificacion_politica_discapacidad_comentario : null;
        $evaluacion_proyecto_linea66->actividad_economica_comentario = $request->actividad_economica_requiere_comentario == false ? $request->actividad_economica_comentario : null;
        $evaluacion_proyecto_linea66->disciplina_subarea_conocimiento_comentario = $request->disciplina_subarea_conocimiento_requiere_comentario == false ? $request->disciplina_subarea_conocimiento_comentario : null;
        $evaluacion_proyecto_linea66->red_conocimiento_comentario = $request->red_conocimiento_requiere_comentario == false ? $request->red_conocimiento_comentario : null;
        $evaluacion_proyecto_linea66->tematica_estrategica_comentario = $request->tematica_estrategica_requiere_comentario == false ? $request->tematica_estrategica_comentario : null;

        $evaluacion_proyecto_linea66->save();

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }


    public function updateLongColumn(ProyectoFormulario6Linea82ColumnRequest $request, Convocatoria $convocatoria, ProyectoFormulario6Linea82 $proyecto_formulario_6_linea_82, $column)
    {
        $this->authorize('modificar-proyecto-autor', [$proyecto_formulario_6_linea_82->proyecto]);

        if ($column == 'programas_formacion' || $column == 'programas_formacion_articulados') {
            $proyecto_formulario_6_linea_82->proyecto->programasFormacion()->sync(array_merge($request->programas_formacion ? $request->programas_formacion : [], $request->programas_formacion_articulados ? $request->programas_formacion_articulados : []));
            return back();
        }

        if ($column == 'municipios') {
            $proyecto_formulario_6_linea_82->proyecto->municipios()->sync($request->only($column)[$column]);
            return back();
        }

        if ($column == 'area_tematica_eni_id') {
            $proyecto_formulario_6_linea_82->areasTematicasEni()->sync($request->only($column)[$column]);
            return back();
        }

        if ($column == 'linea_investigacion_eni_id') {
            $proyecto_formulario_6_linea_82->lineasInvestigacionEni()->sync($request->only($column)[$column]);
            return back();
        }

        if ($column == 'mesa_sectorial_id') {
            $proyecto_formulario_6_linea_82->mesasSectoriales()->sync($request->only($column)[$column]);
            return back();
        }

        if ($column == 'linea_tecnologica_id') {
            $proyecto_formulario_6_linea_82->proyecto->tecnoacademiaLineasTecnoacademia()->sync($request->only($column)[$column]);
            return back();
        }

        $proyecto_formulario_6_linea_82->update($request->only($column));

        return back();
    }

    public function showIndicadores(Convocatoria $convocatoria, ProyectoFormulario6Linea82 $proyecto_formulario_6_linea_82)
    {
        $this->authorize('visualizar-proyecto-autor', [$proyecto_formulario_6_linea_82->proyecto]);

        $proyecto_formulario_6_linea_82->proyecto->pdfVersiones;

        $proyecto_formulario_6_linea_82->proyecto->precio_proyecto = $proyecto_formulario_6_linea_82->proyecto->precioProyecto;

        $proyecto_formulario_6_linea_82->disciplinaSubareaConocimiento->subareaConocimiento->areaConocimiento;
        $proyecto_formulario_6_linea_82->proyecto->centroFormacion;
        $proyecto_formulario_6_linea_82->proyecto->all_files;
        $proyecto_formulario_6_linea_82->mostrar_recomendaciones = $proyecto_formulario_6_linea_82->proyecto->mostrar_recomendaciones;
        $proyecto_formulario_6_linea_82->mostrar_requiere_subsanacion = $proyecto_formulario_6_linea_82->proyecto->mostrar_requiere_subsanacion;

        return Inertia::render('Convocatorias/Proyectos/Indicadores/Index', [
            'convocatoria'      => $convocatoria,
            'proyecto_formulario_6_linea_82' => $proyecto_formulario_6_linea_82,
            'evaluacion'        => EvaluacionProyectoFormulario6Linea82::find(request()->evaluacion_id),
        ]);
    }

    public function storeIndicadores(Request $request, Convocatoria $convocatoria, ProyectoFormulario6Linea82 $proyecto_formulario_6_linea_82)
    {
        $this->authorize('modificar-proyecto-autor', [$proyecto_formulario_6_linea_82->proyecto]);

        $proyecto_formulario_6_linea_82->productividad_beneficiaros                = $request->productividad_beneficiaros;
        $proyecto_formulario_6_linea_82->generacion_empleo_beneficiarios           = $request->generacion_empleo_beneficiarios;
        $proyecto_formulario_6_linea_82->creacion_nuevos_desarrollos               = $request->creacion_nuevos_desarrollos;
        $proyecto_formulario_6_linea_82->generacion_conocimientos_beneficiarios    = $request->generacion_conocimientos_beneficiarios;
        $proyecto_formulario_6_linea_82->generacion_valor_beneficiarios            = $request->generacion_valor_beneficiarios;
        $proyecto_formulario_6_linea_82->fortalecimiento_programas_formacion       = $request->fortalecimiento_programas_formacion;
        $proyecto_formulario_6_linea_82->transferencia_tecnologias                 = $request->transferencia_tecnologias;
        $proyecto_formulario_6_linea_82->calidad_formacion                         = $request->calidad_formacion;
        $proyecto_formulario_6_linea_82->impacto_ambiental_proyectos               = $request->impacto_ambiental_proyectos;

        $proyecto_formulario_6_linea_82->save();

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }
}
