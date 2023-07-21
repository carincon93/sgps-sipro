<?php

namespace App\Http\Controllers;

use App\Helpers\SelectHelper;
use App\Models\Proyecto;
use App\Models\Idi;
use App\Models\Convocatoria;
use App\Models\MesaSectorial;
use App\Http\Requests\IdiRequest;
use App\Http\Requests\IdiLongColumnRequest;
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
            'convocatoria'      => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria', 'tipo_convocatoria'),
            'filters'           => request()->all('search', 'estructuracion_proyectos'),
            'idi'               => Idi::getProyectosPorRol($convocatoria)->appends(['search' => request()->search, 'estructuracion_proyectos' => request()->estructuracion_proyectos]),
            'allowedToCreate'   => Gate::inspect('formular-proyecto', [3, $convocatoria])->allowed()
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
        $authUser = Auth::user();

        if ($authUser->hasRole(6)) {
            $centrosFormacion = SelectHelper::centrosFormacion()->where('regional_id', $authUser->centroFormacion->regional->id)->values()->all();
        } else {
            $centrosFormacion = SelectHelper::centrosFormacion();
        }

        return Inertia::render('Convocatorias/Proyectos/ProyectosLinea66/Create', [
            'convocatoria'                      => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria', 'min_fecha_inicio_proyectos_idi', 'max_fecha_finalizacion_proyectos_idi', 'fecha_maxima_idi', 'campos_convocatoria'),
            'centrosFormacion'                  => $centrosFormacion,
            'areasConocimiento'                 => SelectHelper::areasConocimiento(),
            'subareasConocimiento'              => SelectHelper::subareasConocimiento(),
            'disciplinasSubareaConocimiento'    => SelectHelper::disciplinasSubareaConocimiento(),
            'lineasInvestigacion'               => SelectHelper::lineasInvestigacion(),
            'lineasProgramaticas'               => SelectHelper::lineasProgramaticas()->where('categoria_proyecto', 2)->values()->all(),
            'actividadesEconomicas'             => SelectHelper::actividadesEconomicas(),
            'tematicasEstrategicas'             => SelectHelper::tematicasEstrategicas(),
            'redesConocimiento'                 => SelectHelper::redesConocimiento(),
            'gruposInvestigacion'               => SelectHelper::gruposInvestigacion()->where('value', 126)->values()->all(),
            'areasTematicasEni'                 => SelectHelper::areasTematicasEni(),
            'lineasInvestigacionEni'            => SelectHelper::lineasInvestigacion()->where('grupo_investigacion_id', 126)->values()->all(),
            'rolesSennova'                      => RolSennova::select('id as value', 'nombre as label')->orderBy('nombre', 'ASC')->get(),
            'allowedToCreate'                   => Gate::inspect('formular-proyecto', [3, $convocatoria])->allowed()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(IdiRequest $request, Convocatoria $convocatoria)
    {
        $this->authorize('formular-proyecto', [$request->linea_programatica_id, $convocatoria]);

        $proyecto = new Proyecto();
        $proyecto->centroFormacion()->associate($request->centro_formacion_id);
        $proyecto->lineaProgramatica()->associate($request->linea_programatica_id);
        $proyecto->convocatoria()->associate($convocatoria);
        $proyecto->tecnoacademiaLineasTecnoacademia()->sync($request->tecnoacademia_linea_tecnoacademia_id);
        $proyecto->save();

        $idi = new Idi();
        $idi->titulo                                            = $request->titulo;
        $idi->fecha_inicio                                      = $request->fecha_inicio;
        $idi->fecha_finalizacion                                = $request->fecha_finalizacion;
        $idi->max_meses_ejecucion                               = $request->max_meses_ejecucion;
        $idi->proyecto_investigacion_pedagogica                 = $request->proyecto_investigacion_pedagogica;
        $idi->articulacion_eni                                  = $request->articulacion_eni;
        $idi->justificacion_proyecto_investigacion_pedagogica   = $request->justificacion_proyecto_investigacion_pedagogica;
        $idi->proyecto_investigacion_pedagogica                 = $request->proyecto_investigacion_pedagogica;
        $idi->articulacion_eni                                  = $request->articulacion_eni;

        $idi->video                                             = null;
        $idi->justificacion_industria_4                         = null;
        $idi->justificacion_economia_naranja                    = null;
        $idi->justificacion_politica_discapacidad               = null;
        $idi->resumen                                           = '';
        $idi->antecedentes                                      = '';
        $idi->marco_conceptual                                  = '';
        $idi->metodologia                                       = '';
        $idi->propuesta_sostenibilidad                          = '';
        $idi->bibliografia                                      = '';
        $idi->numero_aprendices                                 = 0;
        $idi->impacto_municipios                                = '';
        $idi->impacto_centro_formacion                          = '';
        $idi->muestreo                                          = 6;
        $idi->actividades_muestreo                              = null;
        $idi->objetivo_muestreo                                 = null;
        $idi->recoleccion_especimenes                           = 2;
        $idi->relacionado_plan_tecnologico                      = 2;
        $idi->relacionado_agendas_competitividad                = 2;
        $idi->relacionado_mesas_sectoriales                     = 2;
        $idi->relacionado_tecnoacademia                         = 2;

        $idi->lineaInvestigacion()->associate($request->linea_investigacion_id);
        $idi->disciplinaSubareaConocimiento()->associate($request->disciplina_subarea_conocimiento_id);
        $idi->tematicaEstrategica()->associate($request->tematica_estrategica_id);
        $idi->redConocimiento()->associate($request->red_conocimiento_id);
        $idi->actividadEconomica()->associate($request->actividad_economica_id);
        $idi->grupoInvestigacionEni()->associate($request->grupo_investigacion_eni_id);

        $proyecto->idi()->save($idi);

        $idi->areasTematicasEni()->sync($request->area_tematica_eni_id);
        $idi->lineasInvestigacionEni()->sync($request->linea_investigacion_eni_id);


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

        return redirect()->route('convocatorias.idi.edit', [$convocatoria, $idi])->with('success', 'El recurso se ha creado correctamente. Por favor continue diligenciando la información.');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Idi  $idi
     * @return \Illuminate\Http\Response
     */
    public function show(Convocatoria $convocatoria, Idi $idi)
    {
        $this->authorize('visualizar-proyecto-autor', [$idi->proyecto]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Idi  $idi
     * @return \Illuminate\Http\Response
     */
    public function edit(Convocatoria $convocatoria, Idi $idi)
    {
        $this->authorize('visualizar-proyecto-autor', [$idi->proyecto]);

        $idi->load('proyecto.evaluaciones.idiEvaluacion');

        $idi->proyecto->codigo_linea_programatica = $idi->proyecto->lineaProgramatica->codigo;
        $idi->proyecto->precio_proyecto           = $idi->proyecto->precioProyecto;

        $idi->proyecto->pdfVersiones;

        $idi->disciplinaSubareaConocimiento->subareaConocimiento->areaConocimiento;
        $idi->proyecto->centroFormacion;
        $idi->proyecto->all_files;
        $idi->mostrar_recomendaciones = $idi->proyecto->mostrar_recomendaciones;
        $idi->mostrar_requiere_subsanacion = $idi->proyecto->mostrar_requiere_subsanacion;


        return Inertia::render('Convocatorias/Proyectos/ProyectosLinea66/Edit', [
            'convocatoria'                              => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria', 'min_fecha_inicio_proyectos_idi', 'max_fecha_finalizacion_proyectos_idi', 'fecha_maxima_idi', 'mostrar_recomendaciones', 'campos_convocatoria'),
            'proyectoLinea66'                           => $idi,
            'mesasSectorialesRelacionadas'              => $idi->mesasSectoriales()->pluck('mesas_sectoriales.id'),
            'lineasTecnoacademiaRelacionadas'           => $idi->proyecto->tecnoacademiaLineasTecnoacademia()->pluck('tecnoacademia_linea_tecnoacademia.id'),
            'tecnoacademia'                             => $idi->proyecto->tecnoacademiaLineasTecnoacademia()->first() ? $idi->proyecto->tecnoacademiaLineasTecnoacademia()->first()->tecnoacademia->only('id', 'nombre') : null,
            'mesasSectoriales'                          => SelectHelper::mesasSectoriales(),
            'areasConocimiento'                         => SelectHelper::areasConocimiento(),
            'subareasConocimiento'                      => SelectHelper::subareasConocimiento(),
            'disciplinasSubareaConocimiento'            => SelectHelper::disciplinasSubareaConocimiento(),
            'lineasProgramaticas'                       => SelectHelper::lineasProgramaticas()->where('categoria_proyecto', 2)->values()->all(),
            'actividadesEconomicas'                     => SelectHelper::actividadesEconomicas(),
            'tematicasEstrategicas'                     => SelectHelper::tematicasEstrategicas(),
            'redesConocimiento'                         => SelectHelper::redesConocimiento(),
            'lineasTecnoacademia'                       => SelectHelper::lineasTecnoacademia(),
            'lineasInvestigacion'                       => SelectHelper::lineasInvestigacion()->where('centro_formacion_id', $idi->proyecto->centro_formacion_id)->values()->all(),
            'tecnoacademias'                            => SelectHelper::tecnoacademias(),
            'municipios'                                => SelectHelper::municipios(),
            'gruposInvestigacion'                       => SelectHelper::gruposInvestigacion()->where('value', 126)->values()->all(),
            'areasTematicasEni'                         => SelectHelper::areasTematicasEni(),
            'lineasInvestigacionEni'                    => SelectHelper::lineasInvestigacion()->where('grupo_investigacion_id', 126)->values()->all(),
            'programasFormacionConRegistroCalificado'   => SelectHelper::programasFormacion()->where('registro_calificado', true)->where('centro_formacion_id', $idi->proyecto->centro_formacion_id)->values()->all(),
            'programasFormacionSinRegistroCalificado'   => SelectHelper::programasFormacion()->where('registro_calificado', false)->values()->all(),
            'opcionesIDiDropdown'                       => json_decode(Storage::get('json/opciones-aplica-no-aplica.json'), true),
            'proyectoMunicipios'                        => $idi->proyecto->municipios()->select('municipios.id as value', 'municipios.nombre as label', 'regionales.nombre as group')->join('regionales', 'regionales.id', 'municipios.regional_id')->pluck('value'),
            'proyectoAreasTematicasEni'                 => $idi->areasTematicasEni()->select('areas_tematicas_eni.id as value', 'areas_tematicas_eni.nombre as label')->get(),
            'proyectoLineasInvestigacionEni'            => $idi->lineasInvestigacionEni()->select('lineas_investigacion.id as value', 'lineas_investigacion.nombre as label')->get(),
            'programasFormacionConRegistroRelacionados' => $idi->proyecto->programasFormacion()->selectRaw('programas_formacion.id as value, concat(programas_formacion.nombre, chr(10), \'∙ Código: \', programas_formacion.codigo) as label')->where('registro_calificado', true)->pluck('value'),
            'programasFormacionSinRegistroRelacionados' => $idi->proyecto->programasFormacion()->selectRaw('programas_formacion.id as value, concat(programas_formacion.nombre, chr(10), \'∙ Código: \', programas_formacion.codigo) as label')->where('registro_calificado', false)->pluck('value'),
            'rolesSennova'                              => RolSennova::select('id as value', 'nombre as label')->orderBy('nombre', 'ASC')->get(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Idi  $idi
     * @return \Illuminate\Http\Response
     */
    public function update(IdiRequest $request, Convocatoria $convocatoria, Idi $idi)
    {
        $this->authorize('modificar-proyecto-autor', [$idi->proyecto]);

        $idi->titulo                                = $request->titulo;
        $idi->fecha_inicio                          = $request->fecha_inicio;
        $idi->fecha_finalizacion                    = $request->fecha_finalizacion;
        $idi->max_meses_ejecucion                   = $request->max_meses_ejecucion;
        $idi->video                                 = $request->video;
        $idi->numero_aprendices                     = $request->numero_aprendices;

        $idi->resumen                               = $request->resumen;
        $idi->antecedentes                          = $request->antecedentes;
        $idi->marco_conceptual                      = $request->marco_conceptual;
        $idi->justificacion_industria_4             = $request->justificacion_industria_4;
        $idi->justificacion_economia_naranja        = $request->justificacion_economia_naranja;
        $idi->justificacion_politica_discapacidad   = $request->justificacion_politica_discapacidad;
        $idi->atencion_pluralista_diferencial       = $request->atencion_pluralista_diferencial;
        $idi->impacto_sector_agricola               = $request->impacto_sector_agricola;
        $idi->bibliografia                          = $request->bibliografia;
        $idi->impacto_municipios                    = $request->impacto_municipios;
        $idi->impacto_centro_formacion              = $request->impacto_centro_formacion;

        $idi->muestreo                              = $request->muestreo;
        $idi->actividades_muestreo                  = $request->muestreo == 1 ? $request->actividades_muestreo : null;
        $idi->objetivo_muestreo                     = $request->muestreo == 1 ? $request->objetivo_muestreo  : null;
        $idi->recoleccion_especimenes               = $request->recoleccion_especimenes;

        $idi->relacionado_plan_tecnologico          = $request->relacionado_plan_tecnologico;
        $idi->relacionado_agendas_competitividad    = $request->relacionado_agendas_competitividad;
        $idi->relacionado_mesas_sectoriales         = $request->relacionado_mesas_sectoriales;
        $idi->relacionado_tecnoacademia             = $request->relacionado_tecnoacademia;
        $idi->proyecto_investigacion_pedagogica     = $request->proyecto_investigacion_pedagogica;
        $idi->articulacion_eni                      = $request->articulacion_eni;
        $idi->justificacion_proyecto_investigacion_pedagogica = $request->justificacion_proyecto_investigacion_pedagogica;

        $idi->lineaInvestigacion()->associate($request->linea_investigacion_id);
        $idi->disciplinaSubareaConocimiento()->associate($request->disciplina_subarea_conocimiento_id);
        $idi->tematicaEstrategica()->associate($request->tematica_estrategica_id);
        $idi->redConocimiento()->associate($request->red_conocimiento_id);
        $idi->actividadEconomica()->associate($request->actividad_economica_id);
        $idi->grupoInvestigacionEni()->associate($request->grupo_investigacion_eni_id);

        $idi->proyecto->municipios()->sync($request->municipios);
        $idi->areasTematicasEni()->sync($request->area_tematica_eni_id);
        $idi->lineasInvestigacionEni()->sync($request->linea_investigacion_eni_id);
        $idi->proyecto->programasFormacion()->sync(array_merge($request->programas_formacion ? $request->programas_formacion : [], $request->programas_formacion_articulados ? $request->programas_formacion_articulados : []));

        $idi->save();

        $request->relacionado_mesas_sectoriales == 1 ? $idi->mesasSectoriales()->sync($request->mesa_sectorial_id) : $idi->mesasSectoriales()->detach();
        $request->relacionado_tecnoacademia == 1 ? $idi->proyecto->tecnoacademiaLineasTecnoacademia()->sync($request->linea_tecnologica_id) : $idi->proyecto->tecnoacademiaLineasTecnoacademia()->detach();

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Idi  $idi
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, Convocatoria $convocatoria, Idi $idi)
    {
        $this->authorize('eliminar-proyecto-autor', [$idi->proyecto]);

        if (!Hash::check($request->password, Auth::user()->password)) {
            return back()
                ->withErrors(['password' => __('The password is incorrect.')]);
        }

        $idi->proyecto()->delete();

        return back()->with('success', 'El recurso se ha eliminado correctamente.');
    }


    public function updateLongColumn(IdiLongColumnRequest $request, Convocatoria $convocatoria, Idi $idi, $column)
    {
        $this->authorize('modificar-proyecto-autor', [$idi->proyecto]);

        $idi->update($request->only($column));

        return back();
    }

    public function showIndicadores(Convocatoria $convocatoria, Idi $idi)
    {
        $this->authorize('visualizar-proyecto-autor', [$idi->proyecto]);

        $idi->proyecto->pdfVersiones;

        $idi->codigo_linea_programatica = $idi->proyecto->lineaProgramatica->codigo;
        $idi->precio_proyecto           = $idi->proyecto->precioProyecto;

        $idi->disciplinaSubareaConocimiento->subareaConocimiento->areaConocimiento;
        $idi->proyecto->centroFormacion;
        $idi->proyecto->all_files;
        $idi->mostrar_recomendaciones = $idi->proyecto->mostrar_recomendaciones;
        $idi->mostrar_requiere_subsanacion = $idi->proyecto->mostrar_requiere_subsanacion;

        return Inertia::render('Convocatorias/Proyectos/Indicadores/Index', [
            'convocatoria' => $convocatoria,
            'idi'          => $idi
        ]);
    }

    public function storeIndicadores(Request $request, Convocatoria $convocatoria, Idi $idi)
    {
        $this->authorize('modificar-proyecto-autor', [$idi->proyecto]);

        $idi->productividad_beneficiaros                = $request->productividad_beneficiaros;
        $idi->generacion_empleo_beneficiarios           = $request->generacion_empleo_beneficiarios;
        $idi->creacion_nuevos_desarrollos               = $request->creacion_nuevos_desarrollos;
        $idi->generacion_conocimientos_beneficiarios    = $request->generacion_conocimientos_beneficiarios;
        $idi->generacion_valor_beneficiarios            = $request->generacion_valor_beneficiarios;
        $idi->fortalecimiento_programas_formacion       = $request->fortalecimiento_programas_formacion;
        $idi->transferencia_tecnologias                 = $request->transferencia_tecnologias;
        $idi->calidad_formacion                         = $request->calidad_formacion;
        $idi->impacto_ambiental_proyectos               = $request->impacto_ambiental_proyectos;

        $idi->save();

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }
}
