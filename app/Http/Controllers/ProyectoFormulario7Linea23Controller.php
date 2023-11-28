<?php

namespace App\Http\Controllers;

use App\Helpers\FunctionsHelper;
use App\Helpers\SelectHelper;
use App\Http\Requests\Evaluacion\EvaluacionProyectoFormulario7Linea23Request;
use App\Http\Requests\ProyectoFormulario7Linea23ColumnRequest;
use App\Models\Proyecto;
use App\Models\ProyectoFormulario7Linea23;
use App\Models\Convocatoria;
use App\Http\Requests\ProyectoFormulario7Linea23Request;
use App\Models\Evaluacion\Evaluacion;
use App\Models\Evaluacion\EvaluacionProyectoFormulario7Linea23;
use App\Models\RolSennova;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProyectoFormulario7Linea23Controller extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Convocatoria $convocatoria)
    {
        return Inertia::render('Convocatorias/Proyectos/ProyectosFormulario7Linea23/Index', [
            'convocatoria'                      => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria', 'year'),
            'proyectos_formulario_7_linea_23'   => ProyectoFormulario7Linea23::getProyectosPorRol($convocatoria)->appends(['search' => request()->search]),
            'allowed_to_create'                 => Gate::inspect('formular-proyecto', [2, $convocatoria])->allowed()
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create(Convocatoria $convocatoria)
    {
        $this->authorize('formular-proyecto', [2, $convocatoria]);

        /** @var \App\Models\User */
        $auth_user = Auth::user();

        if ($auth_user->hasRole([1, 5, 17, 18, 19, 20])) {
            $centros_formacion = SelectHelper::centrosFormacion();
        } else {
            $centros_formacion = SelectHelper::centrosFormacion()->where('regional_id', $auth_user->centroFormacion->regional->id)->values()->all();
        }

        return Inertia::render('Convocatorias/Proyectos/ProyectosFormulario7Linea23/Create', [
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
            'allowed_to_create'                 => Gate::inspect('formular-proyecto', [3, $convocatoria])->allowed()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(ProyectoFormulario7Linea23Request $request, Convocatoria $convocatoria)
    {
        $this->authorize('formular-proyecto', [2, $convocatoria]);

        $proyecto = new Proyecto();
        $proyecto->centroFormacion()->associate($request->centro_formacion_id);
        $proyecto->tipoFormularioConvocatoria()->associate(7);
        $proyecto->convocatoria()->associate($convocatoria);
        $proyecto->tecnoacademiaLineasTecnoacademia()->sync($request->tecnoacademia_linea_tecnoacademia_id);
        $proyecto->save();

        $proyecto_formulario_7_linea_23 = new ProyectoFormulario7Linea23();
        $proyecto_formulario_7_linea_23->titulo                                            = $request->titulo;
        $proyecto_formulario_7_linea_23->fecha_inicio                                      = $request->fecha_inicio;
        $proyecto_formulario_7_linea_23->fecha_finalizacion                                = $request->fecha_finalizacion;
        $proyecto_formulario_7_linea_23->max_meses_ejecucion                               = $request->max_meses_ejecucion;
        $proyecto_formulario_7_linea_23->areas_cualificacion_mnc                           = $request->areas_cualificacion_mnc;
        $proyecto_formulario_7_linea_23->lineas_estrategicas_beneficiadas                  = $request->lineas_estrategicas_beneficiadas;
        $proyecto_formulario_7_linea_23->justificacion_lineas_estrategicas_beneficiadas    = $request->justificacion_lineas_estrategicas_beneficiadas;

        $proyecto_formulario_7_linea_23->video                                             = null;
        $proyecto_formulario_7_linea_23->justificacion_industria_4                         = null;
        $proyecto_formulario_7_linea_23->justificacion_economia_naranja                    = null;
        $proyecto_formulario_7_linea_23->justificacion_politica_discapacidad               = null;
        $proyecto_formulario_7_linea_23->resumen                                           = '';
        $proyecto_formulario_7_linea_23->antecedentes                                      = '';
        $proyecto_formulario_7_linea_23->marco_conceptual                                  = '';
        $proyecto_formulario_7_linea_23->metodologia                                       = '';
        $proyecto_formulario_7_linea_23->propuesta_sostenibilidad                          = '';
        $proyecto_formulario_7_linea_23->bibliografia                                      = '';
        $proyecto_formulario_7_linea_23->numero_aprendices                                 = 0;
        $proyecto_formulario_7_linea_23->impacto_municipios                                = '';
        $proyecto_formulario_7_linea_23->impacto_centro_formacion                          = '';
        $proyecto_formulario_7_linea_23->relacionado_plan_tecnologico                      = 2;
        $proyecto_formulario_7_linea_23->relacionado_agendas_competitividad                = 2;
        $proyecto_formulario_7_linea_23->relacionado_mesas_sectoriales                     = 2;
        $proyecto_formulario_7_linea_23->relacionado_tecnoacademia                         = 2;

        $proyecto_formulario_7_linea_23->lineaInvestigacion()->associate($request->linea_investigacion_id);
        $proyecto_formulario_7_linea_23->disciplinaSubareaConocimiento()->associate($request->disciplina_subarea_conocimiento_id);
        $proyecto_formulario_7_linea_23->tematicaEstrategica()->associate($request->tematica_estrategica_id);
        $proyecto_formulario_7_linea_23->redConocimiento()->associate($request->red_conocimiento_id);
        $proyecto_formulario_7_linea_23->actividadEconomica()->associate($request->actividad_economica_id);

        $proyecto->proyectoFormulario7Linea23()->save($proyecto_formulario_7_linea_23);

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

        return redirect()->route('convocatorias.proyectos-formulario-7-linea-23.edit', [$convocatoria, $proyecto_formulario_7_linea_23])->with('success', 'El recurso se ha creado correctamente. Por favor continue diligenciando la información.');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\ProyectoFormulario7Linea23  $proyecto_formulario_7_linea_23
     * @return \Illuminate\Http\Response
     */
    public function show(Convocatoria $convocatoria, ProyectoFormulario7Linea23 $proyecto_formulario_7_linea_23)
    {
        $this->authorize('visualizar-proyecto-autor', [$proyecto_formulario_7_linea_23->proyecto]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\ProyectoFormulario7Linea23  $proyecto_formulario_7_linea_23
     * @return \Illuminate\Http\Response
     */
    public function edit(Convocatoria $convocatoria, ProyectoFormulario7Linea23 $proyecto_formulario_7_linea_23)
    {
        $this->authorize('visualizar-proyecto-autor', [$proyecto_formulario_7_linea_23->proyecto]);

        if ($proyecto_formulario_7_linea_23->proyecto->convocatoria_id != $convocatoria->id) {
            return abort(404);
        }

        if (request()->filled('evaluacion_id')) {
            $evaluacion = Evaluacion::find(request()->evaluacion_id);

            $this->authorize('modificar-evaluacion-autor', [$evaluacion]);

            $items_evaluacion = $evaluacion->getItemsAEvaluar($convocatoria->id, $proyecto_formulario_7_linea_23->proyecto->tipo_formulario_convocatoria_id);
        }

        $proyecto_formulario_7_linea_23->load('proyecto.evaluaciones.evaluacionesProyectoFormulario7Linea23', 'proyecto.proyectoRolesSennova.proyectoRolesEvaluaciones', 'proyecto.proyectoPresupuesto.proyectoPresupuestosEvaluaciones');

        $proyecto_formulario_7_linea_23->proyecto->precio_proyecto = $proyecto_formulario_7_linea_23->proyecto->precioProyecto;

        $proyecto_formulario_7_linea_23->proyecto->centroFormacion;
        $proyecto_formulario_7_linea_23->proyecto->programasFormacion;
        $proyecto_formulario_7_linea_23->proyecto->participantes;
        $proyecto_formulario_7_linea_23->proyecto->tipoFormularioConvocatoria->lineaProgramatica;
        $proyecto_formulario_7_linea_23->proyecto->municipios;
        $proyecto_formulario_7_linea_23->proyecto->tecnoacademiaLineasTecnoacademia;

        $proyecto_formulario_7_linea_23->disciplinaSubareaConocimiento->subareaConocimiento->areaConocimiento;
        $proyecto_formulario_7_linea_23->proyecto->mesasSectoriales;

        $proyecto_formulario_7_linea_23->mostrar_recomendaciones      = $proyecto_formulario_7_linea_23->proyecto->mostrar_recomendaciones;
        $proyecto_formulario_7_linea_23->mostrar_requiere_subsanacion = $proyecto_formulario_7_linea_23->proyecto->mostrar_requiere_subsanacion;

        return Inertia::render('Convocatorias/Proyectos/ProyectosFormulario7Linea23/Edit', [
            'convocatoria'                                      => $convocatoria,
            'proyecto_formulario_7_linea_23'                    => $proyecto_formulario_7_linea_23,
            'centros_formacion'                                 => SelectHelper::centrosFormacion(),
            'evaluacion'                                        => $items_evaluacion ?? [],
            'tecnoacademia'                                     => $proyecto_formulario_7_linea_23->proyecto->tecnoacademiaLineasTecnoacademia()->first() ? $proyecto_formulario_7_linea_23->proyecto->tecnoacademiaLineasTecnoacademia()->first()->tecnoacademia->only('id', 'nombre') : null,
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
     * @param  \App\Models\ProyectoFormulario7Linea23  $proyecto_formulario_7_linea_23
     * @return \Illuminate\Http\Response
     */
    public function update(ProyectoFormulario7Linea23Request $request, Convocatoria $convocatoria, ProyectoFormulario7Linea23 $proyecto_formulario_7_linea_23)
    {
        $this->authorize('modificar-proyecto-autor', [$proyecto_formulario_7_linea_23->proyecto]);

        $proyecto_formulario_7_linea_23->update($request->validated());

        $proyecto_formulario_7_linea_23->save();

        $proyecto_formulario_7_linea_23->proyecto->centroFormacion()->associate($request->centro_formacion_id);
        $proyecto_formulario_7_linea_23->proyecto->municipios()->sync($request->municipios);
        $proyecto_formulario_7_linea_23->proyecto->programasFormacion()->sync(array_merge($request->programas_formacion ? $request->programas_formacion : [], $request->programas_formacion_articulados ? $request->programas_formacion_articulados : []));

        $request->relacionado_mesas_sectoriales == 1 ? $proyecto_formulario_7_linea_23->proyecto->mesasSectoriales()->sync($request->mesa_sectorial_id) : $proyecto_formulario_7_linea_23->proyecto->mesasSectoriales()->detach();
        $request->relacionado_tecnoacademia == 1 ? $proyecto_formulario_7_linea_23->proyecto->tecnoacademiaLineasTecnoacademia()->sync($request->linea_tecnologica_id) : $proyecto_formulario_7_linea_23->proyecto->tecnoacademiaLineasTecnoacademia()->detach();

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\ProyectoFormulario7Linea23  $proyecto_formulario_7_linea_23
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, Convocatoria $convocatoria, ProyectoFormulario7Linea23 $proyecto_formulario_7_linea_23)
    {
        $this->authorize('eliminar-proyecto-autor', [$proyecto_formulario_7_linea_23->proyecto]);

        // if (!Hash::check($request->password, Auth::user()->password)) {
        //     return back()
        //         ->withErrors(['password' => __('The password is incorrect.')]);
        // }

        $proyecto_formulario_7_linea_23->proyecto()->delete();

        return back()->with('success', 'El recurso se ha eliminado correctamente.');
    }

    public function updateEvaluacion(EvaluacionProyectoFormulario7Linea23Request $request, Convocatoria $convocatoria)
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

            EvaluacionProyectoFormulario7Linea23::updateOrCreate(
                [
                    'id'            => $item['form_evaluacion_id_pregunta_id_' . $pregunta_id],
                    'pregunta_id'   => $pregunta_id,
                    'evaluacion_id' => $request->evaluacion_id
                ],
                [
                    'comentario'    => $item['form_requiere_comentario_pregunta_id_' . $pregunta_id] ? $item['form_comentario_pregunta_id_' . $pregunta_id] : null,
                    'puntaje'       => $item['form_puntaje_pregunta_id_' . $pregunta_id],
                ],
            );
        }

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }


    public function updateLongColumn(ProyectoFormulario7Linea23ColumnRequest $request, Convocatoria $convocatoria, ProyectoFormulario7Linea23 $proyecto_formulario_7_linea_23, $column)
    {
        $this->authorize('modificar-proyecto-autor', [$proyecto_formulario_7_linea_23->proyecto]);

        if ($column == 'fecha_inicio') {
            $proyecto_formulario_7_linea_23->update([
                'max_meses_ejecucion' => FunctionsHelper::diffMonths($request->fecha_inicio, $proyecto_formulario_7_linea_23->fecha_finalizacion)
            ]);
        } elseif ($column == 'fecha_finalizacion') {
            $proyecto_formulario_7_linea_23->update([
                'max_meses_ejecucion' => FunctionsHelper::diffMonths($proyecto_formulario_7_linea_23->fecha_inicio, $request->fecha_finalizacion)
            ]);
        }

        if ($column == 'centro_formacion_id') {
            $proyecto_formulario_7_linea_23->proyecto->update($request->only($column));
            return back();
        }

        if ($column == 'programas_formacion' || $column == 'programas_formacion_articulados') {
            $proyecto_formulario_7_linea_23->proyecto->programasFormacion()->sync(array_merge($request->programas_formacion ? $request->programas_formacion : [], $request->programas_formacion_articulados ? $request->programas_formacion_articulados : []));
            return back();
        }

        if ($column == 'municipios') {
            $proyecto_formulario_7_linea_23->proyecto->municipios()->sync($request->only($column)[$column]);
            return back();
        }

        if ($column == 'area_tematica_eni_id') {
            $proyecto_formulario_7_linea_23->areasTematicasEni()->sync($request->only($column)[$column]);
            return back();
        }

        if ($column == 'linea_investigacion_eni_id') {
            $proyecto_formulario_7_linea_23->lineasInvestigacionEni()->sync($request->only($column)[$column]);
            return back();
        }

        if ($column == 'mesa_sectorial_id') {
            $proyecto_formulario_7_linea_23->proyecto->mesasSectoriales()->sync($request->only($column)[$column]);
            return back();
        }

        if ($column == 'linea_tecnologica_id') {
            $proyecto_formulario_7_linea_23->proyecto->tecnoacademiaLineasTecnoacademia()->sync($request->only($column)[$column]);
            return back();
        }

        $proyecto_formulario_7_linea_23->update($request->only($column));

        return back();
    }

    public function showIndicadores(Convocatoria $convocatoria, ProyectoFormulario7Linea23 $proyecto_formulario_7_linea_23)
    {
        $this->authorize('visualizar-proyecto-autor', [$proyecto_formulario_7_linea_23->proyecto]);

        if ($proyecto_formulario_7_linea_23->proyecto->convocatoria_id != $convocatoria->id) {
            return abort(404);
        }

        if (request()->filled('evaluacion_id')) {
            $evaluacion = Evaluacion::find(request()->evaluacion_id);

            $this->authorize('modificar-evaluacion-autor', [$evaluacion]);

            $items_evaluacion = $evaluacion->getItemsAEvaluar($convocatoria->id, $proyecto_formulario_7_linea_23->proyecto->tipo_formulario_convocatoria_id);
        }

        $proyecto_formulario_7_linea_23->proyecto->pdfVersiones;

        $proyecto_formulario_7_linea_23->proyecto->precio_proyecto = $proyecto_formulario_7_linea_23->proyecto->precioProyecto;

        $proyecto_formulario_7_linea_23->disciplinaSubareaConocimiento->subareaConocimiento->areaConocimiento;
        $proyecto_formulario_7_linea_23->proyecto->centroFormacion;
        $proyecto_formulario_7_linea_23->proyecto->lista_archivos;
        $proyecto_formulario_7_linea_23->mostrar_recomendaciones = $proyecto_formulario_7_linea_23->proyecto->mostrar_recomendaciones;
        $proyecto_formulario_7_linea_23->mostrar_requiere_subsanacion = $proyecto_formulario_7_linea_23->proyecto->mostrar_requiere_subsanacion;

        return Inertia::render('Convocatorias/Proyectos/Indicadores/Index', [
            'convocatoria'                      => $convocatoria,
            'proyecto_formulario_7_linea_23'    => $proyecto_formulario_7_linea_23,
            'evaluacion'                        => $items_evaluacion ?? [],
        ]);
    }

    public function storeIndicadores(Request $request, Convocatoria $convocatoria, ProyectoFormulario7Linea23 $proyecto_formulario_7_linea_23)
    {
        $this->authorize('modificar-proyecto-autor', [$proyecto_formulario_7_linea_23->proyecto]);

        $proyecto_formulario_7_linea_23->productividad_beneficiaros                = $request->productividad_beneficiaros;
        $proyecto_formulario_7_linea_23->generacion_empleo_beneficiarios           = $request->generacion_empleo_beneficiarios;
        $proyecto_formulario_7_linea_23->creacion_nuevos_desarrollos               = $request->creacion_nuevos_desarrollos;
        $proyecto_formulario_7_linea_23->generacion_conocimientos_beneficiarios    = $request->generacion_conocimientos_beneficiarios;
        $proyecto_formulario_7_linea_23->generacion_valor_beneficiarios            = $request->generacion_valor_beneficiarios;
        $proyecto_formulario_7_linea_23->fortalecimiento_programas_formacion       = $request->fortalecimiento_programas_formacion;
        $proyecto_formulario_7_linea_23->transferencia_tecnologias                 = $request->transferencia_tecnologias;
        $proyecto_formulario_7_linea_23->calidad_formacion                         = $request->calidad_formacion;
        $proyecto_formulario_7_linea_23->impacto_ambiental_proyectos               = $request->impacto_ambiental_proyectos;

        $proyecto_formulario_7_linea_23->save();

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }
}
