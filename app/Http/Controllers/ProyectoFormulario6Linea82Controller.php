<?php

namespace App\Http\Controllers;

use App\Helpers\FunctionsHelper;
use App\Helpers\SelectHelper;
use App\Http\Requests\Evaluacion\EvaluacionProyectoFormulario6Linea82Request;
use App\Http\Requests\ProyectoFormulario6Linea82ColumnRequest;
use App\Models\Proyecto;
use App\Models\ProyectoFormulario6Linea82;
use App\Models\Convocatoria;
use App\Http\Requests\ProyectoFormulario6Linea82Request;
use App\Models\Evaluacion\Evaluacion;
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
            'allowed_to_create'                 => Gate::inspect('formular-proyecto', [1, $convocatoria])->allowed()
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

        if ($auth_user->hasRole([1, 5, 17, 18, 19, 20])) {
            $centros_formacion = SelectHelper::centrosFormacion();
        } else {
            $centros_formacion = SelectHelper::centrosFormacion()->where('regional_id', $auth_user->centroFormacion->regional->id)->values()->all();
        }

        return Inertia::render('Convocatorias/Proyectos/ProyectosFormulario6Linea82/Create', [
            'convocatoria'                      => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria', 'year', 'campos_convocatoria'),
            'centros_formacion'                 => $centros_formacion,
            'areas_conocimiento'                => SelectHelper::areasConocimiento(),
            'subareas_conocimiento'             => SelectHelper::subareasConocimiento(),
            'disciplinas_subarea_conocimiento'  => SelectHelper::disciplinasSubareaConocimiento(),
            'lineas_investigacion'              => SelectHelper::lineasInvestigacion(),
            'actividades_economicas'            => SelectHelper::actividadesEconomicas(),
            'tematicas_estrategicas'            => SelectHelper::tematicasEstrategicas(),
            'redes_conocimiento'                => SelectHelper::redesConocimiento(),
            'grupos_investigacion'              => SelectHelper::gruposInvestigacion()->where('value', 126)->values()->all(),
            'areas_cualificacion_mnc'           => json_decode(Storage::get('json/areas-cualificacion-mnc.json'), true),
            'lineas_estrategicas'               => json_decode(Storage::get('json/lineas-estrategicas.json'), true),
            'roles_sennova'                     => RolSennova::select('id as value', 'nombre as label')->orderBy('nombre', 'ASC')->get(),
            'allowed_to_create'                 => Gate::inspect('formular-proyecto', [1, $convocatoria])->allowed()
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
        $this->authorize('formular-proyecto', [1, $convocatoria]);

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
        $proyecto_formulario_6_linea_82->areas_cualificacion_mnc                           = $request->areas_cualificacion_mnc;
        $proyecto_formulario_6_linea_82->lineas_estrategicas_beneficiadas                  = $request->lineas_estrategicas_beneficiadas;
        $proyecto_formulario_6_linea_82->justificacion_lineas_estrategicas_beneficiadas    = $request->justificacion_lineas_estrategicas_beneficiadas;

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

        $proyecto->proyectoFormulario6Linea82()->save($proyecto_formulario_6_linea_82);

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

        return redirect()->route('convocatorias.proyectos-formulario-6-linea-82.edit', [$convocatoria, $proyecto_formulario_6_linea_82])->with('success', 'El recurso se ha creado correctamente. Por favor continue diligenciando la información.');
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

        if (request()->filled('evaluacion_id')) {
            $evaluacion = Evaluacion::find(request()->evaluacion_id);

            $this->authorize('modificar-evaluacion-autor', [$evaluacion]);

            $items_evaluacion = $evaluacion->getItemsAEvaluar($convocatoria->id, $proyecto_formulario_6_linea_82->proyecto->tipo_formulario_convocatoria_id);
        }

        if ($proyecto_formulario_6_linea_82->proyecto->convocatoria_id != $convocatoria->id) {
            return abort(404);
        }

        $proyecto_formulario_6_linea_82->load('proyecto.proyectoRolesSennova.proyectoRolesEvaluaciones', 'proyecto.proyectoPresupuesto.proyectoPresupuestosEvaluaciones');
        // $proyecto_formulario_6_linea_82->load('proyecto.evaluaciones.evaluacionProyectoFormulario6Linea82');

        $proyecto_formulario_6_linea_82->proyecto->precio_proyecto = $proyecto_formulario_6_linea_82->proyecto->precioProyecto;

        $proyecto_formulario_6_linea_82->proyecto->centroFormacion;
        $proyecto_formulario_6_linea_82->proyecto->programasFormacion;
        $proyecto_formulario_6_linea_82->proyecto->participantes;
        $proyecto_formulario_6_linea_82->proyecto->tipoFormularioConvocatoria->lineaProgramatica;
        $proyecto_formulario_6_linea_82->proyecto->municipios;
        $proyecto_formulario_6_linea_82->proyecto->tecnoacademiaLineasTecnoacademia;

        $proyecto_formulario_6_linea_82->disciplinaSubareaConocimiento->subareaConocimiento->areaConocimiento;
        $proyecto_formulario_6_linea_82->proyecto->mesasSectoriales;
        $proyecto_formulario_6_linea_82->areasTematicasEni;
        $proyecto_formulario_6_linea_82->lineasInvestigacionEni;

        $proyecto_formulario_6_linea_82->mostrar_recomendaciones        = $proyecto_formulario_6_linea_82->proyecto->mostrar_recomendaciones;
        $proyecto_formulario_6_linea_82->mostrar_requiere_subsanacion   = $proyecto_formulario_6_linea_82->proyecto->mostrar_requiere_subsanacion;



        return Inertia::render('Convocatorias/Proyectos/ProyectosFormulario6Linea82/Edit', [
            'convocatoria'                                      => $convocatoria,
            'proyecto_formulario_6_linea_82'                    => $proyecto_formulario_6_linea_82,
            'centros_formacion'                                 => SelectHelper::centrosFormacion(),
            'evaluacion'                                        => $items_evaluacion ?? [],
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
            'lineas_investigacion'                              => SelectHelper::lineasInvestigacion(),
            'tecnoacademias'                                    => SelectHelper::tecnoacademias(),
            'municipios'                                        => SelectHelper::municipios(),
            'grupos_investigacion'                              => SelectHelper::gruposInvestigacion()->where('value', 126)->values()->all(),
            'programas_formacion_con_registro_calificado'       => SelectHelper::programasFormacion()->where('registro_calificado', true)->values()->all(),
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

        $proyecto_formulario_6_linea_82->update($request->validated());

        $proyecto_formulario_6_linea_82->save();

        $proyecto_formulario_6_linea_82->proyecto->centroFormacion()->associate($request->centro_formacion_id);
        $proyecto_formulario_6_linea_82->proyecto->municipios()->sync($request->municipios);
        $proyecto_formulario_6_linea_82->proyecto->programasFormacion()->sync(array_merge($request->programas_formacion ? $request->programas_formacion : [], $request->programas_formacion_articulados ? $request->programas_formacion_articulados : []));

        $request->relacionado_mesas_sectoriales == 1 ? $proyecto_formulario_6_linea_82->proyecto->mesasSectoriales()->sync($request->mesa_sectorial_id) : $proyecto_formulario_6_linea_82->proyecto->mesasSectoriales()->detach();
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

    public function updateEvaluacion(EvaluacionProyectoFormulario6Linea82Request $request, Convocatoria $convocatoria,)
    {
        $evaluacion = Evaluacion::find($request->evaluacion_id);

        $this->authorize('modificar-evaluacion-autor', $evaluacion);

        $items_evaluacion_filtrados = [];
        $temp_array = [];

        foreach ($request->all() as $key => $value) {
            // Check if the key starts with "form_"
            if (strpos($key, "form_") === 0) {
                $temp_array[$key] = $value;

                // When tempArray has 4 items, add it to the resultArray and reset tempArray
                if (count($temp_array) === 5) {
                    $items_evaluacion_filtrados[] = $temp_array;
                    $temp_array = [];
                }
            }
        }

        // If there are any remaining items in tempArray, add it to the resultArray
        if (!empty($temp_array)) {
            $items_evaluacion_filtrados[] = $temp_array;
        }

        $evaluacion->update([
            'iniciado'                  => true,
            'clausula_confidencialidad' => $request->clausula_confidencialidad
        ]);

        foreach ($items_evaluacion_filtrados as $item) {
            $pregunta_id = last($item);

            EvaluacionProyectoFormulario6Linea82::updateOrCreate(
                [
                    'id'            => $item['form_evaluacion_id_pregunta_id_' . $pregunta_id],
                    'pregunta_id'   => $pregunta_id,
                    'evaluacion_id' => $request->evaluacion_id
                ],
                [
                    'comentario'    => $item['form_comentario_pregunta_id_' . $pregunta_id],
                    'puntaje'       => $item['form_puntaje_pregunta_id_' . $pregunta_id],
                ],
            );
        }

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }


    public function updateLongColumn(ProyectoFormulario6Linea82ColumnRequest $request, Convocatoria $convocatoria, ProyectoFormulario6Linea82 $proyecto_formulario_6_linea_82, $column)
    {
        $this->authorize('modificar-proyecto-autor', [$proyecto_formulario_6_linea_82->proyecto]);

        if ($column == 'fecha_inicio') {
            $proyecto_formulario_6_linea_82->update([
                'max_meses_ejecucion' => FunctionsHelper::diffMonths($request->fecha_inicio, $proyecto_formulario_6_linea_82->fecha_finalizacion)
            ]);
        } elseif ($column == 'fecha_finalizacion') {
            $proyecto_formulario_6_linea_82->update([
                'max_meses_ejecucion' => FunctionsHelper::diffMonths($proyecto_formulario_6_linea_82->fecha_inicio, $request->fecha_finalizacion)
            ]);
        }

        if ($column == 'centro_formacion_id') {
            $proyecto_formulario_6_linea_82->proyecto->update($request->only($column));
            return back();
        }

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
            $proyecto_formulario_6_linea_82->proyecto->mesasSectoriales()->sync($request->only($column)[$column]);
            return back();
        }

        if ($column == 'linea_tecnologica_id') {
            $proyecto_formulario_6_linea_82->proyecto->tecnoacademiaLineasTecnoacademia()->sync($request->only($column)[$column]);
            return back();
        }

        $proyecto_formulario_6_linea_82->update($request->only($column));

        return back();
    }
}
