<?php

namespace App\Http\Controllers;

use App\Helpers\FunctionsHelper;
use App\Helpers\SelectHelper;
use App\Models\Proyecto;
use App\Models\ProyectoFormulario15Linea65;
use App\Models\Convocatoria;
use App\Models\MesaSectorial;
use App\Http\Requests\Evaluacion\EvaluacionProyectoFormulario15Linea65Request;
use App\Http\Requests\ProyectoFormulario15Linea65ColumnRequest;
use App\Http\Requests\ProyectoFormulario15Linea65Request;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use App\Models\CentroFormacion;
use App\Models\Evaluacion\Evaluacion;
use App\Models\Evaluacion\EvaluacionProyectoFormulario15Linea65;
use App\Models\RolSennova;
use App\Models\TopeRolSennovaFormulario15;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class ProyectoFormulario15Linea65Controller extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Convocatoria $convocatoria)
    {
        return Inertia::render('Convocatorias/Proyectos/ProyectosFormulario15Linea65/Index', [
            'convocatoria'                      => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria', 'year'),
            'proyectos_formulario_15_linea_65'  => ProyectoFormulario15Linea65::getProyectosPorRol($convocatoria)->appends(['search' => request()->search, 'estructuracion_proyectos' => request()->estructuracion_proyectos]),
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

        $centros_formacion_ids = TopeRolSennovaFormulario15::select('topes_roles_formulario_15.centro_formacion_id')->join('convocatoria_rol_sennova', 'topes_roles_formulario_15.convocatoria_rol_sennova_id', 'convocatoria_rol_sennova.id')->where('convocatoria_rol_sennova.convocatoria_id', $convocatoria->id)->get()->pluck('centro_formacion_id')->flatten();

        /** @var \App\Models\User */
        $auth_user = Auth::user();

        if ($auth_user->hasRole([1, 5, 17, 18, 19, 20])) {
            $centros_formacion = SelectHelper::centrosFormacion()->whereIn('value', $centros_formacion_ids)->values()->all();
        } else {
            $centros_formacion = SelectHelper::centrosFormacion()->where('regional_id', $auth_user->centroFormacion->regional->id)->whereIn('value', $centros_formacion_ids)->values()->all();
        }

        return Inertia::render('Convocatorias/Proyectos/ProyectosFormulario15Linea65/Create', [
            'convocatoria'              => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'year'),
            'centros_formacion'         => $centros_formacion,
            'lineas_investigacion'      => SelectHelper::lineasInvestigacion(),
            'areas_cualificacion_mnc'   => json_decode(Storage::get('json/areas-cualificacion-mnc.json'), true),
            'ejes_sennova'              => json_decode(Storage::get('json/ejes-sennova.json'), true),
            'areas_conocimiento'        => SelectHelper::areasConocimiento(),
            'actividades_economicas'    => SelectHelper::actividadesEconomicas(),
            'tematicas_estrategicas'    => SelectHelper::tematicasEstrategicas(),
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
    public function store(ProyectoFormulario15Linea65Request $request, Convocatoria $convocatoria)
    {
        $this->authorize('formular-proyecto', [9, $convocatoria]);

        $proyecto = new Proyecto();
        $proyecto->centroFormacion()->associate($request->centro_formacion_id);
        $proyecto->tipoFormularioConvocatoria()->associate(15);
        $proyecto->convocatoria()->associate($convocatoria);
        $proyecto->save();

        $proyecto_formulario_15_linea_65 = new ProyectoFormulario15Linea65();
        $proyecto_formulario_15_linea_65->titulo                              = $request->titulo;
        $proyecto_formulario_15_linea_65->fecha_inicio                        = $request->fecha_inicio;
        $proyecto_formulario_15_linea_65->fecha_finalizacion                  = $request->fecha_finalizacion;
        $proyecto_formulario_15_linea_65->eje_sennova                         = $request->eje_sennova;
        $proyecto_formulario_15_linea_65->areas_cualificacion_mnc             = $request->areas_cualificacion_mnc;

        $proyecto_formulario_15_linea_65->max_meses_ejecucion                 = $request->max_meses_ejecucion;
        $proyecto_formulario_15_linea_65->video                               = null;
        $proyecto_formulario_15_linea_65->justificacion_politica_discapacidad = null;
        $proyecto_formulario_15_linea_65->resumen                             = '';
        $proyecto_formulario_15_linea_65->antecedentes                        = '';
        $proyecto_formulario_15_linea_65->marco_conceptual                    = '';
        $proyecto_formulario_15_linea_65->metodologia                         = '';
        $proyecto_formulario_15_linea_65->propuesta_sostenibilidad            = '';
        $proyecto_formulario_15_linea_65->bibliografia                        = '';
        $proyecto_formulario_15_linea_65->numero_aprendices                   = 0;
        $proyecto_formulario_15_linea_65->impacto_municipios                  = '';
        $proyecto_formulario_15_linea_65->impacto_centro_formacion            = '';

        $proyecto_formulario_15_linea_65->relacionado_plan_tecnologico        = 2;
        $proyecto_formulario_15_linea_65->relacionado_agendas_competitividad  = 2;
        $proyecto_formulario_15_linea_65->relacionado_mesas_sectoriales       = 2;

        $proyecto_formulario_15_linea_65->lineaInvestigacion()->associate($request->linea_investigacion_id);
        $proyecto_formulario_15_linea_65->areaConocimiento()->associate($request->area_conocimiento_id);
        $proyecto_formulario_15_linea_65->tematicaEstrategica()->associate($request->tematica_estrategica_id);
        $proyecto_formulario_15_linea_65->actividadEconomica()->associate($request->actividad_economica_id);

        $proyecto->proyectoFormulario15Linea65()->save($proyecto_formulario_15_linea_65);

        $proyecto->participantes()->attach(
            Auth::user()->id,
            [
                'es_formulador'     => true,
                'cantidad_meses'    => $request->cantidad_meses,
                'cantidad_horas'    => $request->cantidad_horas,
                'rol_sennova'       => $request->rol_sennova,
            ]
        );

        return redirect()->route('convocatorias.proyectos-formulario-15-linea-65.edit', [$convocatoria, $proyecto_formulario_15_linea_65])->with('success', 'El recurso se ha creado correctamente. Por favor continue diligenciando la información.');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\ProyectoFormulario15Linea65  $proyecto_formulario_15_linea_65
     * @return \Illuminate\Http\Response
     */
    public function show(Convocatoria $convocatoria, ProyectoFormulario15Linea65 $proyecto_formulario_15_linea_65)
    {
        $this->authorize('visualizar-proyecto-autor', [$proyecto_formulario_15_linea_65->proyecto]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\ProyectoFormulario15Linea65  $proyecto_formulario_15_linea_65
     * @return \Illuminate\Http\Response
     */
    public function edit(Convocatoria $convocatoria, ProyectoFormulario15Linea65 $proyecto_formulario_15_linea_65)
    {
        $this->authorize('visualizar-proyecto-autor', [$proyecto_formulario_15_linea_65->proyecto]);

        if ($proyecto_formulario_15_linea_65->proyecto->convocatoria_id != $convocatoria->id) {
            return abort(404);
        }

        if (request()->filled('evaluacion_id')) {
            $evaluacion = Evaluacion::find(request()->evaluacion_id);

            $this->authorize('modificar-evaluacion-autor', [$evaluacion]);

            $items_evaluacion = $evaluacion->getItemsAEvaluar($convocatoria->id, $proyecto_formulario_15_linea_65->proyecto->tipo_formulario_convocatoria_id);
        }

        $proyecto_formulario_15_linea_65->load('proyecto.evaluaciones.evaluacionesProyectoFormulario1Linea65', 'proyecto.proyectoRolesSennova.proyectoRolesEvaluaciones', 'proyecto.proyectoPresupuesto.proyectoPresupuestosEvaluaciones');

        $proyecto_formulario_15_linea_65->proyecto->precio_proyecto           = $proyecto_formulario_15_linea_65->proyecto->precioProyecto;
        $proyecto_formulario_15_linea_65->proyecto->centroFormacion;
        $proyecto_formulario_15_linea_65->proyecto->municipios;
        $proyecto_formulario_15_linea_65->proyecto->programasFormacion;
        $proyecto_formulario_15_linea_65->proyecto->participantes;
        $proyecto_formulario_15_linea_65->proyecto->tipoFormularioConvocatoria->lineaProgramatica;
        $proyecto_formulario_15_linea_65->proyecto->mesasSectoriales;

        $proyecto_formulario_15_linea_65->mostrar_recomendaciones             = $proyecto_formulario_15_linea_65->proyecto->mostrar_recomendaciones;
        $proyecto_formulario_15_linea_65->mostrar_requiere_subsanacion        = $proyecto_formulario_15_linea_65->proyecto->mostrar_requiere_subsanacion;

        $centros_formacion_ids = TopeRolSennovaFormulario15::select('topes_roles_formulario_15.centro_formacion_id')->join('convocatoria_rol_sennova', 'topes_roles_formulario_15.convocatoria_rol_sennova_id', 'convocatoria_rol_sennova.id')->where('convocatoria_rol_sennova.convocatoria_id', $convocatoria->id)->get()->pluck('centro_formacion_id')->flatten();

        return Inertia::render('Convocatorias/Proyectos/ProyectosFormulario15Linea65/Edit', [
            'convocatoria'                                  => $convocatoria,
            'proyecto_formulario_15_linea_65'               => $proyecto_formulario_15_linea_65,
            'centros_formacion'                             => SelectHelper::centrosFormacion()->whereIn('value', $centros_formacion_ids)->values()->all(),
            'evaluacion'                                    => $items_evaluacion ?? [],
            'mesas_sectoriales'                             => MesaSectorial::select('id as value', 'nombre as label')->get('id'),
            'lineas_investigacion'                          => SelectHelper::lineasInvestigacion(),
            'areas_conocimiento'                            => SelectHelper::areasConocimiento(),
            'lineas_programaticas'                          => SelectHelper::lineasProgramaticas(),
            'areas_cualificacion_mnc'                       => json_decode(Storage::get('json/areas-cualificacion-mnc.json'), true),
            'lineas_estrategicas_sena'                      => json_decode(Storage::get('json/lineas-estrategicas.json'), true),
            'ejes_sennova'                                  => json_decode(Storage::get('json/ejes-sennova.json'), true),
            'actividades_economicas'                        => SelectHelper::actividadesEconomicas(),
            'tematicas_estrategicas'                        => SelectHelper::tematicasEstrategicas(),
            'municipios'                                    => SelectHelper::municipios(),
            'lineas_tecnoacademia'                          => SelectHelper::lineasTecnoacademia(),
            'programas_formacion_con_registro_calificado'   => SelectHelper::programasFormacion()->where('registro_calificado', true)->values()->all(),
            'programas_formacion_sin_registro_calificado'   => SelectHelper::programasFormacion()->where('registro_calificado', false)->values()->all(),
            'roles_sennova'                                 => RolSennova::select('id as value', 'nombre as label')->orderBy('nombre', 'ASC')->get(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\ProyectoFormulario15Linea65  $proyecto_formulario_15_linea_65
     * @return \Illuminate\Http\Response
     */
    public function update(ProyectoFormulario15Linea65Request $request, Convocatoria $convocatoria, ProyectoFormulario15Linea65 $proyecto_formulario_15_linea_65)
    {
        $this->authorize('modificar-proyecto-autor', [$proyecto_formulario_15_linea_65->proyecto]);

        $proyecto_formulario_15_linea_65->update($request->validated());

        $proyecto_formulario_15_linea_65->save();

        $proyecto_formulario_15_linea_65->proyecto->centroFormacion()->associate($request->centro_formacion_id);
        $proyecto_formulario_15_linea_65->proyecto->municipios()->sync($request->municipios);
        $proyecto_formulario_15_linea_65->proyecto->programasFormacion()->sync(array_merge($request->programas_formacion ? $request->programas_formacion : [], $request->programas_formacion_articulados ? $request->programas_formacion_articulados : []));

        $request->relacionado_mesas_sectoriales == 1 ? $proyecto_formulario_15_linea_65->proyecto->mesasSectoriales()->sync($request->mesa_sectorial_id) : $proyecto_formulario_15_linea_65->proyecto->mesasSectoriales()->detach();

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\ProyectoFormulario15Linea65  $proyecto_formulario_15_linea_65
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, Convocatoria $convocatoria, ProyectoFormulario15Linea65 $proyecto_formulario_15_linea_65)
    {
        $this->authorize('eliminar-proyecto-autor', [$proyecto_formulario_15_linea_65->proyecto]);

        // if (!Hash::check($request->password, Auth::user()->password)) {
        //     return back()
        //         ->withErrors(['password' => __('The password is incorrect.')]);
        // }

        $proyecto_formulario_15_linea_65->proyecto()->delete();

        return back()->with('success', 'El recurso se ha eliminado correctamente.');
    }

    public function updateEvaluacion(EvaluacionProyectoFormulario15Linea65Request $request, Convocatoria $convocatoria)
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

            EvaluacionProyectoFormulario15Linea65::updateOrCreate(
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

    public function updateLongColumn(ProyectoFormulario15Linea65ColumnRequest $request, Convocatoria $convocatoria, ProyectoFormulario15Linea65 $proyecto_formulario_15_linea_65, $column)
    {
        $this->authorize('modificar-proyecto-autor', [$proyecto_formulario_15_linea_65->proyecto]);

        if ($column == 'fecha_inicio') {
            $proyecto_formulario_15_linea_65->update([
                'max_meses_ejecucion' => FunctionsHelper::diffMonths($request->fecha_inicio, $proyecto_formulario_15_linea_65->fecha_finalizacion)
            ]);
        } elseif ($column == 'fecha_finalizacion') {
            $proyecto_formulario_15_linea_65->update([
                'max_meses_ejecucion' => FunctionsHelper::diffMonths($proyecto_formulario_15_linea_65->fecha_inicio, $request->fecha_finalizacion)
            ]);
        }

        if ($column == 'centro_formacion_id') {
            $proyecto_formulario_15_linea_65->proyecto->update($request->only($column));
            return back();
        }

        if ($column == 'programas_formacion' || $column == 'programas_formacion_articulados') {
            $proyecto_formulario_15_linea_65->proyecto->programasFormacion()->sync(array_merge($request->programas_formacion ? $request->programas_formacion : [], $request->programas_formacion_articulados ? $request->programas_formacion_articulados : []));
            return back();
        }

        if ($column == 'municipios') {
            $proyecto_formulario_15_linea_65->proyecto->municipios()->sync($request->only($column)[$column]);
            return back();
        }

        if ($column == 'mesa_sectorial_id') {
            $proyecto_formulario_15_linea_65->proyecto->mesasSectoriales()->sync($request->only($column)[$column]);
            return back();
        }

        $proyecto_formulario_15_linea_65->update($request->only($column));

        return back();
    }
}
