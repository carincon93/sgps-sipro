<?php

namespace App\Http\Controllers;

use App\Helpers\FunctionsHelper;
use App\Helpers\SelectHelper;
use App\Models\Proyecto;
use App\Models\ProyectoFormulario3Linea61;
use App\Models\Convocatoria;
use App\Models\MesaSectorial;
use App\Http\Requests\Evaluacion\EvaluacionProyectoFormulario3Linea61Request;
use App\Http\Requests\ProyectoFormulario3Linea61ColumnRequest;
use App\Http\Requests\ProyectoFormulario3Linea61Request;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use App\Models\CentroFormacion;
use App\Models\DisciplinaSubareaConocimiento;
use App\Models\Evaluacion\Evaluacion;
use App\Models\Evaluacion\EvaluacionProyectoFormulario3Linea61;
use App\Models\RolSennova;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class ProyectoFormulario3Linea61Controller extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Convocatoria $convocatoria)
    {
        return Inertia::render('Convocatorias/Proyectos/ProyectosFormulario3Linea61/Index', [
            'convocatoria'                      => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria', 'year'),
            'proyectos_formulario_3_linea_61'   => ProyectoFormulario3Linea61::getProyectosPorRol($convocatoria)->appends(['search' => request()->search, 'estructuracion_proyectos' => request()->estructuracion_proyectos]),
            'allowed_to_create'                 => Gate::inspect('formular-proyecto', [9, $convocatoria])->allowed()
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create(Convocatoria $convocatoria)
    {
        $this->authorize('formular-proyecto', [9, $convocatoria]);

        /** @var \App\Models\User */
        $auth_user = Auth::user();

        if ($auth_user->hasRole([1, 5, 17, 18, 19, 20])) {
            $centros_formacion = SelectHelper::centrosFormacion()->values()->all();
        } else {
            $centros_formacion = SelectHelper::centrosFormacion()->where('regional_id', $auth_user->centroFormacion->regional->id)->values()->all();
        }

        return Inertia::render('Convocatorias/Proyectos/ProyectosFormulario3Linea61/Create', [
            'convocatoria'              => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'year'),
            'centros_formacion'         => $centros_formacion,
            'lineas_investigacion'      => SelectHelper::lineasInvestigacion(),
            'areas_conocimiento'        => SelectHelper::areasConocimiento(),
            'ejes_sennova'              => json_decode(Storage::get('json/ejes-sennova.json'), true),
            'actividades_economicas'    => SelectHelper::actividadesEconomicas(),
            'tematicas_estrategicas'    => SelectHelper::tematicasEstrategicas(),
            'tipos_eventos'             => json_decode(Storage::get('json/tipos-eventos-linea-65.json'), true),
            'roles_sennova'             => RolSennova::select('id as value', 'nombre as label')->orderBy('nombre', 'ASC')->get(),
            'allowed_to_create'         => Gate::inspect('formular-proyecto', [9, $convocatoria])->allowed()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(ProyectoFormulario3Linea61Request $request, Convocatoria $convocatoria)
    {
        $this->authorize('formular-proyecto', [7, $convocatoria]);

        $proyecto = new Proyecto();
        $proyecto->centroFormacion()->associate($request->centro_formacion_id);
        $proyecto->tipoFormularioConvocatoria()->associate(3);
        $proyecto->convocatoria()->associate($convocatoria);
        $proyecto->save();

        $proyecto_formulario_3_linea_61 = new ProyectoFormulario3Linea61();
        $proyecto_formulario_3_linea_61->titulo                              = $request->titulo;
        $proyecto_formulario_3_linea_61->fecha_inicio                        = $request->fecha_inicio;
        $proyecto_formulario_3_linea_61->fecha_finalizacion                  = $request->fecha_finalizacion;

        $proyecto_formulario_3_linea_61->max_meses_ejecucion                 = $request->max_meses_ejecucion;
        $proyecto_formulario_3_linea_61->justificacion_politica_discapacidad = null;
        $proyecto_formulario_3_linea_61->resumen                             = '';
        $proyecto_formulario_3_linea_61->antecedentes                        = '';
        $proyecto_formulario_3_linea_61->marco_conceptual                    = '';
        $proyecto_formulario_3_linea_61->metodologia                         = '';
        $proyecto_formulario_3_linea_61->propuesta_sostenibilidad            = '';
        $proyecto_formulario_3_linea_61->bibliografia                        = '';
        $proyecto_formulario_3_linea_61->numero_beneficiarios                = 0;
        $proyecto_formulario_3_linea_61->impacto_municipios                  = '';
        $proyecto_formulario_3_linea_61->impacto_centro_formacion            = '';

        $proyecto_formulario_3_linea_61->relacionado_plan_tecnologico        = 2;
        $proyecto_formulario_3_linea_61->relacionado_agendas_competitividad  = 2;
        $proyecto_formulario_3_linea_61->relacionado_mesas_sectoriales       = 2;
        $proyecto_formulario_3_linea_61->relacionado_tecnoacademia           = 2;

        $proyecto_formulario_3_linea_61->lineaInvestigacion()->associate($request->linea_investigacion_id);
        $proyecto_formulario_3_linea_61->tematicaEstrategica()->associate($request->tematica_estrategica_id);
        $proyecto_formulario_3_linea_61->actividadEconomica()->associate($request->actividad_economica_id);

        $proyecto_formulario_3_linea_61->disciplinas_conocimiento            = DisciplinaSubareaConocimiento::select('id')->get()->pluck('id')->toJson();

        $proyecto->proyectoFormulario3Linea61()->save($proyecto_formulario_3_linea_61);

        $proyecto->participantes()->attach(
            Auth::user()->id,
            [
                'es_formulador'     => true,
                'cantidad_meses'    => $request->cantidad_meses,
                'cantidad_horas'    => $request->cantidad_horas,
                'rol_sennova'       => $request->rol_sennova,
            ]
        );

        return redirect()->route('convocatorias.proyectos-formulario-3-linea-61.edit', [$convocatoria, $proyecto_formulario_3_linea_61])->with('success', 'El recurso se ha creado correctamente. Por favor continue diligenciando la información.');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\ProyectoFormulario3Linea61  $proyecto_formulario_3_linea_61
     * @return \Illuminate\Http\Response
     */
    public function show(Convocatoria $convocatoria, ProyectoFormulario3Linea61 $proyecto_formulario_3_linea_61)
    {
        $this->authorize('visualizar-proyecto-autor', [$proyecto_formulario_3_linea_61->proyecto]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\ProyectoFormulario3Linea61  $proyecto_formulario_3_linea_61
     * @return \Illuminate\Http\Response
     */
    public function edit(Convocatoria $convocatoria, ProyectoFormulario3Linea61 $proyecto_formulario_3_linea_61)
    {
        $this->authorize('visualizar-proyecto-autor', [$proyecto_formulario_3_linea_61->proyecto]);

        if ($proyecto_formulario_3_linea_61->proyecto->convocatoria_id != $convocatoria->id) {
            return abort(404);
        }

        if (request()->filled('evaluacion_id')) {
            $evaluacion = Evaluacion::find(request()->evaluacion_id);

            $this->authorize('modificar-evaluacion-autor', [$evaluacion]);

            $items_evaluacion = $evaluacion->getItemsAEvaluar($convocatoria->id, $proyecto_formulario_3_linea_61->proyecto->tipo_formulario_convocatoria_id);
        }

        $proyecto_formulario_3_linea_61->load('proyecto.proyectoRolesSennova.proyectoRolesEvaluaciones', 'proyecto.proyectoPresupuesto.proyectoPresupuestosEvaluaciones');
        // $proyecto_formulario_3_linea_61->load('proyecto.evaluaciones.evaluacion_proyecto_formulario_3_linea_61');

        $proyecto_formulario_3_linea_61->proyecto->precio_proyecto           = $proyecto_formulario_3_linea_61->proyecto->precioProyecto;
        $proyecto_formulario_3_linea_61->proyecto->centroFormacion;
        $proyecto_formulario_3_linea_61->proyecto->municipios;
        $proyecto_formulario_3_linea_61->proyecto->programasFormacion;
        $proyecto_formulario_3_linea_61->proyecto->participantes;
        $proyecto_formulario_3_linea_61->proyecto->tipoFormularioConvocatoria->lineaProgramatica;
        $proyecto_formulario_3_linea_61->proyecto->mesasSectoriales;
        $proyecto_formulario_3_linea_61->proyecto->tecnoacademiaLineasTecnoacademia;

        $proyecto_formulario_3_linea_61->mostrar_recomendaciones             = $proyecto_formulario_3_linea_61->proyecto->mostrar_recomendaciones;
        $proyecto_formulario_3_linea_61->mostrar_requiere_subsanacion        = $proyecto_formulario_3_linea_61->proyecto->mostrar_requiere_subsanacion;

        return Inertia::render('Convocatorias/Proyectos/ProyectosFormulario3Linea61/Edit', [
            'convocatoria'                                  => $convocatoria,
            'proyecto_formulario_3_linea_61'                => $proyecto_formulario_3_linea_61,
            'centros_formacion'                             => SelectHelper::centrosFormacion(),
            'evaluacion'                                    => $items_evaluacion ?? [],
            'tecnoacademia'                                 => $proyecto_formulario_3_linea_61->proyecto->tecnoacademiaLineasTecnoacademia()->first() ? $proyecto_formulario_3_linea_61->proyecto->tecnoacademiaLineasTecnoacademia()->first()->tecnoacademia->only('id', 'nombre') : null,
            'mesas_sectoriales'                             => MesaSectorial::select('id as value', 'nombre as label')->get('id'),
            'lineas_investigacion'                          => SelectHelper::lineasInvestigacion(),
            'areas_conocimiento'                            => SelectHelper::areasConocimiento(),
            'actividades_economicas'                        => SelectHelper::actividadesEconomicas(),
            'tematicas_estrategicas'                        => SelectHelper::tematicasEstrategicas(),
            'tecnoacademias'                                => SelectHelper::tecnoacademias(),
            'municipios'                                    => SelectHelper::municipios(),
            'lineas_tecnoacademia'                          => SelectHelper::lineasTecnoacademia(),
            'programas_formacion_con_registro_calificado'   => SelectHelper::programasFormacion()->where('registro_calificado', true)->values()->all(),
            'programas_formacion_sin_registro_calificado'   => SelectHelper::programasFormacion()->where('registro_calificado', false)->values()->all(),
            'roles_sennova'                                 => RolSennova::select('id as value', 'nombre as label')->orderBy('nombre', 'ASC')->get(),
            'tipos_eventos'                                 => json_decode(Storage::get('json/tipos-eventos-linea-65.json'), true),
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\ProyectoFormulario3Linea61  $proyecto_formulario_3_linea_61
     * @return \Illuminate\Http\Response
     */
    public function update(ProyectoFormulario3Linea61Request $request, Convocatoria $convocatoria, ProyectoFormulario3Linea61 $proyecto_formulario_3_linea_61)
    {
        $this->authorize('modificar-proyecto-autor', [$proyecto_formulario_3_linea_61->proyecto]);

        $proyecto_formulario_3_linea_61->update($request->validated());

        $proyecto_formulario_3_linea_61->proyecto->centroFormacion()->associate($request->centro_formacion_id);
        $proyecto_formulario_3_linea_61->save();

        $proyecto_formulario_3_linea_61->proyecto->municipios()->sync($request->municipios);
        $proyecto_formulario_3_linea_61->proyecto->programasFormacion()->sync(array_merge($request->programas_formacion ? $request->programas_formacion : [], $request->programas_formacion_articulados ? $request->programas_formacion_articulados : []));

        $request->relacionado_mesas_sectoriales == 1 ? $proyecto_formulario_3_linea_61->proyecto->mesasSectoriales()->sync($request->mesa_sectorial_id) : $proyecto_formulario_3_linea_61->proyecto->mesasSectoriales()->detach();

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\ProyectoFormulario3Linea61  $proyecto_formulario_3_linea_61
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, Convocatoria $convocatoria, ProyectoFormulario3Linea61 $proyecto_formulario_3_linea_61)
    {
        $this->authorize('eliminar-proyecto-autor', [$proyecto_formulario_3_linea_61->proyecto]);

        // if (!Hash::check($request->password, Auth::user()->password)) {
        //     return back()
        //         ->withErrors(['password' => __('The password is incorrect.')]);
        // }

        $proyecto_formulario_3_linea_61->proyecto()->delete();

        return back()->with('success', 'El recurso se ha eliminado correctamente.');
    }

    public function updateEvaluacion(EvaluacionProyectoFormulario3Linea61Request $request, Convocatoria $convocatoria)
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

            EvaluacionProyectoFormulario3Linea61::updateOrCreate(
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

    public function updateLongColumn(ProyectoFormulario3Linea61ColumnRequest $request, Convocatoria $convocatoria, ProyectoFormulario3Linea61 $proyecto_formulario_3_linea_61, $column)
    {
        $this->authorize('modificar-proyecto-autor', [$proyecto_formulario_3_linea_61->proyecto]);

        if ($column == 'fecha_inicio') {
            $proyecto_formulario_3_linea_61->update([
                'max_meses_ejecucion' => FunctionsHelper::diffMonths($request->fecha_inicio, $proyecto_formulario_3_linea_61->fecha_finalizacion)
            ]);
        } elseif ($column == 'fecha_finalizacion') {
            $proyecto_formulario_3_linea_61->update([
                'max_meses_ejecucion' => FunctionsHelper::diffMonths($proyecto_formulario_3_linea_61->fecha_inicio, $request->fecha_finalizacion)
            ]);
        }

        if ($column == 'centro_formacion_id') {
            $proyecto_formulario_3_linea_61->proyecto->update($request->only($column));
            return back();
        }

        if ($column == 'programas_formacion' || $column == 'programas_formacion_articulados') {
            $proyecto_formulario_3_linea_61->proyecto->programasFormacion()->sync(array_merge($request->programas_formacion ? $request->programas_formacion : [], $request->programas_formacion_articulados ? $request->programas_formacion_articulados : []));
            return back();
        }

        if ($column == 'municipios') {
            $proyecto_formulario_3_linea_61->proyecto->municipios()->sync($request->only($column)[$column]);
            return back();
        }

        if ($column == 'mesa_sectorial_id') {
            $proyecto_formulario_3_linea_61->proyecto->mesasSectoriales()->sync($request->only($column)[$column]);
            return back();
        }

        if ($column == 'linea_tecnologica_id') {
            $proyecto_formulario_3_linea_61->proyecto->tecnoacademiaLineasTecnoacademia()->sync($request->only($column)[$column]);
            return back();
        }

        $proyecto_formulario_3_linea_61->update($request->only($column));

        return back();
    }
}
