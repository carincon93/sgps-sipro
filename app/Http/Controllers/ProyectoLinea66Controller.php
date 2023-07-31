<?php

namespace App\Http\Controllers;

use App\Helpers\SelectHelper;
use App\Http\Requests\Evaluacion\EvaluacionProyectoLinea66Request;
use App\Models\Proyecto;
use App\Models\ProyectoLinea66;
use App\Models\Convocatoria;
use App\Http\Requests\ProyectoLinea66Request;
use App\Http\Requests\ProyectoLinea66LongColumnRequest;
use App\Models\Evaluacion\EvaluacionProyectoLinea66;
use App\Models\RolSennova;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProyectoLinea66Controller extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Convocatoria $convocatoria)
    {
        return Inertia::render('Convocatorias/Proyectos/ProyectosLinea66/Index', [
            'convocatoria'          => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria', 'tipo_convocatoria'),
            'proyectos_linea_66'    => ProyectoLinea66::getProyectosPorRol($convocatoria)->appends(['search' => request()->search]),
            'allowed_to_create'     => Gate::inspect('formular-proyecto', [3, $convocatoria])->allowed()
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

        return Inertia::render('Convocatorias/Proyectos/ProyectosLinea66/Create', [
            'convocatoria'                      => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria', 'campos_convocatoria'),
            'centros_formacion'                 => $centros_formacion,
            'areas_conocimiento'                => SelectHelper::areasConocimiento(),
            'subareas_conocimiento'             => SelectHelper::subareasConocimiento(),
            'disciplinas_subarea_conocimiento'  => SelectHelper::disciplinasSubareaConocimiento(),
            'lineas_investigacion'              => SelectHelper::lineasInvestigacion(),
            'lineas_programaticas'              => SelectHelper::lineasProgramaticas()->where('categoria_proyecto', 2)->values()->all(),
            'actividades_economicas'            => SelectHelper::actividadesEconomicas(),
            'tematicas_estrategicas'            => SelectHelper::tematicasEstrategicas(),
            'redes_conocimiento'                => SelectHelper::redesConocimiento(),
            'grupos_investigacion'              => SelectHelper::gruposInvestigacion()->where('value', 126)->values()->all(),
            'areas_tematicas_eni'               => SelectHelper::areasTematicasEni(),
            'lineas_investigacion_eni'          => SelectHelper::lineasInvestigacion()->where('grupo_investigacion_id', 126)->values()->all(),

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
    public function store(ProyectoLinea66Request $request, Convocatoria $convocatoria)
    {
        $this->authorize('formular-proyecto', [$request->linea_programatica_id, $convocatoria]);

        $proyecto = new Proyecto();
        $proyecto->centroFormacion()->associate($request->centro_formacion_id);
        $proyecto->lineaProgramatica()->associate($request->linea_programatica_id);
        $proyecto->convocatoria()->associate($convocatoria);
        $proyecto->tecnoacademiaLineasTecnoacademia()->sync($request->tecnoacademia_linea_tecnoacademia_id);
        $proyecto->save();

        $proyecto_linea_66 = new ProyectoLinea66();
        $proyecto_linea_66->titulo                                            = $request->titulo;
        $proyecto_linea_66->fecha_inicio                                      = $request->fecha_inicio;
        $proyecto_linea_66->fecha_finalizacion                                = $request->fecha_finalizacion;
        $proyecto_linea_66->max_meses_ejecucion                               = $request->max_meses_ejecucion;
        $proyecto_linea_66->proyecto_investigacion_pedagogica                 = $request->proyecto_investigacion_pedagogica;
        $proyecto_linea_66->articulacion_eni                                  = $request->articulacion_eni;
        $proyecto_linea_66->justificacion_proyecto_investigacion_pedagogica   = $request->justificacion_proyecto_investigacion_pedagogica;
        $proyecto_linea_66->proyecto_investigacion_pedagogica                 = $request->proyecto_investigacion_pedagogica;
        $proyecto_linea_66->articulacion_eni                                  = $request->articulacion_eni;
        $proyecto_linea_66->areas_cualificacion_mnc                           = $request->areas_cualificacion_mnc;

        $proyecto_linea_66->video                                             = null;
        $proyecto_linea_66->justificacion_industria_4                         = null;
        $proyecto_linea_66->justificacion_economia_naranja                    = null;
        $proyecto_linea_66->justificacion_politica_discapacidad               = null;
        $proyecto_linea_66->resumen                                           = '';
        $proyecto_linea_66->antecedentes                                      = '';
        $proyecto_linea_66->marco_conceptual                                  = '';
        $proyecto_linea_66->metodologia                                       = '';
        $proyecto_linea_66->propuesta_sostenibilidad                          = '';
        $proyecto_linea_66->bibliografia                                      = '';
        $proyecto_linea_66->numero_aprendices                                 = 0;
        $proyecto_linea_66->impacto_municipios                                = '';
        $proyecto_linea_66->impacto_centro_formacion                          = '';
        $proyecto_linea_66->muestreo                                          = 6;
        $proyecto_linea_66->actividades_muestreo                              = null;
        $proyecto_linea_66->objetivo_muestreo                                 = null;
        $proyecto_linea_66->recoleccion_especimenes                           = 2;
        $proyecto_linea_66->relacionado_plan_tecnologico                      = 2;
        $proyecto_linea_66->relacionado_agendas_competitividad                = 2;
        $proyecto_linea_66->relacionado_mesas_sectoriales                     = 2;
        $proyecto_linea_66->relacionado_tecnoacademia                         = 2;

        $proyecto_linea_66->lineaInvestigacion()->associate($request->linea_investigacion_id);
        $proyecto_linea_66->disciplinaSubareaConocimiento()->associate($request->disciplina_subarea_conocimiento_id);
        $proyecto_linea_66->tematicaEstrategica()->associate($request->tematica_estrategica_id);
        $proyecto_linea_66->redConocimiento()->associate($request->red_conocimiento_id);
        $proyecto_linea_66->actividadEconomica()->associate($request->actividad_economica_id);
        $proyecto_linea_66->grupoInvestigacionEni()->associate($request->grupo_investigacion_eni_id);

        $proyecto->proyectoLinea66()->save($proyecto_linea_66);

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

        return redirect()->route('convocatorias.proyectos-linea-66.edit', [$convocatoria, $proyecto_linea_66])->with('success', 'El recurso se ha creado correctamente. Por favor continue diligenciando la información.');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\ProyectoLinea66  $proyecto_linea_66
     * @return \Illuminate\Http\Response
     */
    public function show(Convocatoria $convocatoria, ProyectoLinea66 $proyecto_linea_66)
    {
        $this->authorize('visualizar-proyecto-autor', [$proyecto_linea_66->proyecto]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\ProyectoLinea66  $proyecto_linea_66
     * @return \Illuminate\Http\Response
     */
    public function edit(Convocatoria $convocatoria, ProyectoLinea66 $proyecto_linea_66)
    {
        $this->authorize('visualizar-proyecto-autor', [$proyecto_linea_66->proyecto]);

        $proyecto_linea_66->load('proyecto.evaluaciones.evaluacionProyectoLinea66');

        $proyecto_linea_66->proyecto->codigo_linea_programatica = $proyecto_linea_66->proyecto->lineaProgramatica->codigo;
        $proyecto_linea_66->proyecto->precio_proyecto           = $proyecto_linea_66->proyecto->precioProyecto;

        $proyecto_linea_66->proyecto->centroFormacion;
        $proyecto_linea_66->proyecto->programasFormacion;
        $proyecto_linea_66->proyecto->programasFormacion;
        $proyecto_linea_66->proyecto->municipios;
        $proyecto_linea_66->proyecto->tecnoacademiaLineasTecnoacademia;

        // $proyecto_linea_66->proyecto->pdfVersiones;
        // $proyecto_linea_66->proyecto->all_files;

        $proyecto_linea_66->disciplinaSubareaConocimiento->subareaConocimiento->areaConocimiento;
        $proyecto_linea_66->mesasSectoriales;
        $proyecto_linea_66->areasTematicasEni;
        $proyecto_linea_66->lineasInvestigacionEni;

        $proyecto_linea_66->mostrar_recomendaciones = $proyecto_linea_66->proyecto->mostrar_recomendaciones;
        $proyecto_linea_66->mostrar_requiere_subsanacion = $proyecto_linea_66->proyecto->mostrar_requiere_subsanacion;

        return Inertia::render('Convocatorias/Proyectos/ProyectosLinea66/Edit', [
            'convocatoria'                                      => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria', 'mostrar_recomendaciones', 'campos_convocatoria'),
            'proyecto_linea_66'                                 => $proyecto_linea_66,
            'evaluacion'                                        => EvaluacionProyectoLinea66::find(request()->evaluacion_id),
            'tecnoacademia'                                     => $proyecto_linea_66->proyecto->tecnoacademiaLineasTecnoacademia()->first() ? $proyecto_linea_66->proyecto->tecnoacademiaLineasTecnoacademia()->first()->tecnoacademia->only('id', 'nombre') : null,
            'mesas_sectoriales'                                 => SelectHelper::mesasSectoriales(),
            'areas_conocimiento'                                => SelectHelper::areasConocimiento(),
            'subareas_conocimiento'                             => SelectHelper::subareasConocimiento(),
            'disciplinas_subarea_conocimiento'                  => SelectHelper::disciplinasSubareaConocimiento(),
            'lineas_programaticas'                              => SelectHelper::lineasProgramaticas()->where('categoria_proyecto', 2)->values()->all(),
            'actividades_economicas'                            => SelectHelper::actividadesEconomicas(),
            'tematicas_estrategicas'                            => SelectHelper::tematicasEstrategicas(),
            'redes_conocimiento'                                => SelectHelper::redesConocimiento(),
            'lineas_tecnoacademia'                              => SelectHelper::lineasTecnoacademia(),
            'lineas_investigacion'                              => SelectHelper::lineasInvestigacion()->where('centro_formacion_id', $proyecto_linea_66->proyecto->centro_formacion_id)->values()->all(),
            'tecnoacademias'                                    => SelectHelper::tecnoacademias(),
            'municipios'                                        => SelectHelper::municipios(),
            'grupos_investigacion'                              => SelectHelper::gruposInvestigacion()->where('value', 126)->values()->all(),
            'areas_tematicas_eni'                               => SelectHelper::areasTematicasEni(),
            'lineas_investigacion_eni'                          => SelectHelper::lineasInvestigacion()->where('grupo_investigacion_id', 126)->values()->all(),
            'programas_formacion_con_registro_calificado'       => SelectHelper::programasFormacion()->where('registro_calificado', true)->where('centro_formacion_id', $proyecto_linea_66->proyecto->centro_formacion_id)->values()->all(),
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
     * @param  \App\Models\ProyectoLinea66  $proyecto_linea_66
     * @return \Illuminate\Http\Response
     */
    public function update(ProyectoLinea66Request $request, Convocatoria $convocatoria, ProyectoLinea66 $proyecto_linea_66)
    {
        $this->authorize('modificar-proyecto-autor', [$proyecto_linea_66->proyecto]);

        $proyecto_linea_66->titulo                                          = $request->titulo;
        $proyecto_linea_66->fecha_inicio                                    = $request->fecha_inicio;
        $proyecto_linea_66->fecha_finalizacion                              = $request->fecha_finalizacion;
        $proyecto_linea_66->max_meses_ejecucion                             = $request->max_meses_ejecucion;
        $proyecto_linea_66->video                                           = $request->video;
        $proyecto_linea_66->numero_aprendices                               = $request->numero_aprendices;

        $proyecto_linea_66->resumen                                         = $request->resumen;
        $proyecto_linea_66->antecedentes                                    = $request->antecedentes;
        $proyecto_linea_66->marco_conceptual                                = $request->marco_conceptual;
        $proyecto_linea_66->justificacion_industria_4                       = $request->justificacion_industria_4;
        $proyecto_linea_66->justificacion_economia_naranja                  = $request->justificacion_economia_naranja;
        $proyecto_linea_66->justificacion_politica_discapacidad             = $request->justificacion_politica_discapacidad;
        $proyecto_linea_66->atencion_pluralista_diferencial                 = $request->atencion_pluralista_diferencial;
        $proyecto_linea_66->impacto_sector_agricola                         = $request->impacto_sector_agricola;
        $proyecto_linea_66->bibliografia                                    = $request->bibliografia;
        $proyecto_linea_66->impacto_municipios                              = $request->impacto_municipios;
        $proyecto_linea_66->impacto_centro_formacion                        = $request->impacto_centro_formacion;

        $proyecto_linea_66->muestreo                                        = $request->muestreo;
        $proyecto_linea_66->actividades_muestreo                            = $request->muestreo == 1 ? $request->actividades_muestreo : null;
        $proyecto_linea_66->objetivo_muestreo                               = $request->muestreo == 1 ? $request->objetivo_muestreo  : null;
        $proyecto_linea_66->recoleccion_especimenes                         = $request->recoleccion_especimenes;

        $proyecto_linea_66->relacionado_plan_tecnologico                    = $request->relacionado_plan_tecnologico;
        $proyecto_linea_66->relacionado_agendas_competitividad              = $request->relacionado_agendas_competitividad;
        $proyecto_linea_66->relacionado_mesas_sectoriales                   = $request->relacionado_mesas_sectoriales;
        $proyecto_linea_66->relacionado_tecnoacademia                       = $request->relacionado_tecnoacademia;
        $proyecto_linea_66->proyecto_investigacion_pedagogica               = $request->proyecto_investigacion_pedagogica;
        $proyecto_linea_66->articulacion_eni                                = $request->articulacion_eni;
        $proyecto_linea_66->justificacion_proyecto_investigacion_pedagogica = $request->justificacion_proyecto_investigacion_pedagogica;

        $proyecto_linea_66->relacionado_estrategia_campesena                = $request->relacionado_estrategia_campesena;
        $proyecto_linea_66->justificacion_relacion_campesena                = $request->justificacion_relacion_campesena;
        $proyecto_linea_66->lineas_estrategicas_convocatoria                = $request->lineas_estrategicas_convocatoria;
        $proyecto_linea_66->justificacion_lineas_estrategicas               = $request->justificacion_lineas_estrategicas;
        $proyecto_linea_66->impacto_regional                                = $request->impacto_regional;
        $proyecto_linea_66->justificacion_impacto_regional                  = $request->justificacion_impacto_regional;
        $proyecto_linea_66->justificacion_mesas_sectoriales                 = $request->justificacion_mesas_sectoriales;
        $proyecto_linea_66->areas_cualificacion_mnc                         = $request->areas_cualificacion_mnc;
        $proyecto_linea_66->lineas_estrategicas_beneficiadas                = $request->lineas_estrategicas_beneficiadas;
        $proyecto_linea_66->justificacion_lineas_estrategicas_beneficiadas  = $request->justificacion_lineas_estrategicas_beneficiadas;
        $proyecto_linea_66->veredas_corregimientos                          = $request->veredas_corregimientos;

        $proyecto_linea_66->lineaInvestigacion()->associate($request->linea_investigacion_id);
        $proyecto_linea_66->disciplinaSubareaConocimiento()->associate($request->disciplina_subarea_conocimiento_id);
        $proyecto_linea_66->tematicaEstrategica()->associate($request->tematica_estrategica_id);
        $proyecto_linea_66->redConocimiento()->associate($request->red_conocimiento_id);
        $proyecto_linea_66->actividadEconomica()->associate($request->actividad_economica_id);
        $proyecto_linea_66->grupoInvestigacionEni()->associate($request->grupo_investigacion_eni_id);

        $proyecto_linea_66->proyecto->municipios()->sync($request->municipios);
        $proyecto_linea_66->areasTematicasEni()->sync($request->area_tematica_eni_id);
        $proyecto_linea_66->lineasInvestigacionEni()->sync($request->linea_investigacion_eni_id);
        $proyecto_linea_66->proyecto->programasFormacion()->sync(array_merge($request->programas_formacion ? $request->programas_formacion : [], $request->programas_formacion_articulados ? $request->programas_formacion_articulados : []));

        $proyecto_linea_66->save();

        $request->relacionado_mesas_sectoriales == 1 ? $proyecto_linea_66->mesasSectoriales()->sync($request->mesa_sectorial_id) : $proyecto_linea_66->mesasSectoriales()->detach();
        $request->relacionado_tecnoacademia == 1 ? $proyecto_linea_66->proyecto->tecnoacademiaLineasTecnoacademia()->sync($request->linea_tecnologica_id) : $proyecto_linea_66->proyecto->tecnoacademiaLineasTecnoacademia()->detach();

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\ProyectoLinea66  $proyecto_linea_66
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, Convocatoria $convocatoria, ProyectoLinea66 $proyecto_linea_66)
    {
        $this->authorize('eliminar-proyecto-autor', [$proyecto_linea_66->proyecto]);

        // if (!Hash::check($request->password, Auth::user()->password)) {
        //     return back()
        //         ->withErrors(['password' => __('The password is incorrect.')]);
        // }

        $proyecto_linea_66->proyecto()->delete();

        return back()->with('success', 'El recurso se ha eliminado correctamente.');
    }

    public function updateEvaluacion(EvaluacionProyectoLinea66Request $request, Convocatoria $convocatoria, EvaluacionProyectoLinea66 $evaluacion_proyecto_linea66)
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


    public function updateLongColumn(ProyectoLinea66LongColumnRequest $request, Convocatoria $convocatoria, ProyectoLinea66 $proyecto_linea_66, $column)
    {
        $this->authorize('modificar-proyecto-autor', [$proyecto_linea_66->proyecto]);

        $proyecto_linea_66->update($request->only($column));

        return back();
    }

    public function showIndicadores(Convocatoria $convocatoria, ProyectoLinea66 $proyecto_linea_66)
    {
        $this->authorize('visualizar-proyecto-autor', [$proyecto_linea_66->proyecto]);

        $proyecto_linea_66->proyecto->pdfVersiones;

        $proyecto_linea_66->proyecto->codigo_linea_programatica = $proyecto_linea_66->proyecto->lineaProgramatica->codigo;
        $proyecto_linea_66->proyecto->precio_proyecto           = $proyecto_linea_66->proyecto->precioProyecto;

        $proyecto_linea_66->disciplinaSubareaConocimiento->subareaConocimiento->areaConocimiento;
        $proyecto_linea_66->proyecto->centroFormacion;
        $proyecto_linea_66->proyecto->all_files;
        $proyecto_linea_66->mostrar_recomendaciones = $proyecto_linea_66->proyecto->mostrar_recomendaciones;
        $proyecto_linea_66->mostrar_requiere_subsanacion = $proyecto_linea_66->proyecto->mostrar_requiere_subsanacion;

        return Inertia::render('Convocatorias/Proyectos/Indicadores/Index', [
            'convocatoria'      => $convocatoria,
            'proyecto_linea_66' => $proyecto_linea_66,
            'evaluacion'        => EvaluacionProyectoLinea66::find(request()->evaluacion_id),
        ]);
    }

    public function storeIndicadores(Request $request, Convocatoria $convocatoria, ProyectoLinea66 $proyecto_linea_66)
    {
        $this->authorize('modificar-proyecto-autor', [$proyecto_linea_66->proyecto]);

        $proyecto_linea_66->productividad_beneficiaros                = $request->productividad_beneficiaros;
        $proyecto_linea_66->generacion_empleo_beneficiarios           = $request->generacion_empleo_beneficiarios;
        $proyecto_linea_66->creacion_nuevos_desarrollos               = $request->creacion_nuevos_desarrollos;
        $proyecto_linea_66->generacion_conocimientos_beneficiarios    = $request->generacion_conocimientos_beneficiarios;
        $proyecto_linea_66->generacion_valor_beneficiarios            = $request->generacion_valor_beneficiarios;
        $proyecto_linea_66->fortalecimiento_programas_formacion       = $request->fortalecimiento_programas_formacion;
        $proyecto_linea_66->transferencia_tecnologias                 = $request->transferencia_tecnologias;
        $proyecto_linea_66->calidad_formacion                         = $request->calidad_formacion;
        $proyecto_linea_66->impacto_ambiental_proyectos               = $request->impacto_ambiental_proyectos;

        $proyecto_linea_66->save();

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }
}
