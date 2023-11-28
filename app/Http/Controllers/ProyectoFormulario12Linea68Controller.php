<?php

namespace App\Http\Controllers;

use App\Helpers\FunctionsHelper;
use App\Helpers\SelectHelper;
use App\Models\ProyectoFormulario12Linea68;
use App\Http\Controllers\Controller;
use App\Http\Requests\Evaluacion\EvaluacionProyectoFormulario12Linea68Request;
use App\Http\Requests\ProyectoFormulario12Linea68ColumnRequest;
use App\Http\Requests\ProyectoFormulario12Linea68Request;
use App\Models\Convocatoria;
use App\Models\Evaluacion\Evaluacion;
use App\Models\Evaluacion\EvaluacionProyectoFormulario12Linea68;
use App\Models\Proyecto;
use App\Models\RolSennova;
use App\Models\LaboratorioServicioTecnologico;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProyectoFormulario12Linea68Controller extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Convocatoria $convocatoria)
    {
        return Inertia::render('Convocatorias/Proyectos/ProyectosFormulario12Linea68/Index', [
            'convocatoria'                      => $convocatoria,
            'proyectos_formulario_12_linea_68'  => ProyectoFormulario12Linea68::getProyectosPorRol($convocatoria)->appends(['search' => request()->search, 'estructuracion_proyectos' => request()->estructuracion_proyectos]),
            'allowed_to_create'                 => Gate::inspect('formular-proyecto', [10, $convocatoria])->allowed()
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create(Convocatoria $convocatoria)
    {
        $this->authorize('formular-proyecto', [10, $convocatoria]);

        /** @var \App\Models\User */
        $auth_user = Auth::user();

        if ($auth_user->hasRole([1, 5, 17, 18, 19, 20])) {
            $tipo_proyecto_linea_68 = SelectHelper::laboratoriosServiciosTecnologicos();
        } else {
            $tipo_proyecto_linea_68 = SelectHelper::laboratoriosServiciosTecnologicos()->where('regional_id', $auth_user->centroFormacion->regional_id)->values()->all();
        }

        return Inertia::render('Convocatorias/Proyectos/ProyectosFormulario12Linea68/Create', [
            'convocatoria'                => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria', 'year'),
            'sectores_productivos'        => collect(json_decode(Storage::get('json/sectores-productivos.json'), true)),
            'tipos_proyecto_linea_68'     => $tipo_proyecto_linea_68,
            'estados_sistema_gestion'     => SelectHelper::estadosSistemaGestion(),
            'roles_sennova'               => RolSennova::select('id as value', 'nombre as label')->orderBy('nombre', 'ASC')->get(),
            'allowed_to_create'           => Gate::inspect('formular-proyecto', [10, $convocatoria])->allowed()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(ProyectoFormulario12Linea68Request $request, Convocatoria $convocatoria)
    {
        $this->authorize('formular-proyecto', [10, $convocatoria]);

        $tipo_proyecto_linea_68 = LaboratorioServicioTecnologico::find($request->tipo_proyecto_linea_68_id);

        $proyecto = new Proyecto();
        $proyecto->centroFormacion()->associate($tipo_proyecto_linea_68->centro_formacion_id);
        $proyecto->tipoFormularioConvocatoria()->associate(12);
        $proyecto->convocatoria()->associate($convocatoria);
        $proyecto->save();

        $proyecto_formulario_12_linea_68 = new ProyectoFormulario12Linea68();
        $proyecto_formulario_12_linea_68->titulo                                = $request->titulo;
        $proyecto_formulario_12_linea_68->fecha_inicio                          = $request->fecha_inicio;
        $proyecto_formulario_12_linea_68->fecha_finalizacion                    = $request->fecha_finalizacion;
        $proyecto_formulario_12_linea_68->max_meses_ejecucion                   = $request->max_meses_ejecucion;
        $proyecto_formulario_12_linea_68->sector_productivo                     = $request->sector_productivo;
        $proyecto_formulario_12_linea_68->nombre_area_tecnica                   = $request->nombre_area_tecnica;
        $proyecto_formulario_12_linea_68->resumen                               = '';
        $proyecto_formulario_12_linea_68->antecedentes                          = '';
        $proyecto_formulario_12_linea_68->objetivo_general                      = null;
        $proyecto_formulario_12_linea_68->problema_central                      = null;
        $proyecto_formulario_12_linea_68->justificacion_problema                = null;
        $proyecto_formulario_12_linea_68->identificacion_problema               = null;
        $proyecto_formulario_12_linea_68->pregunta_formulacion_problema         = '';
        $proyecto_formulario_12_linea_68->metodologia                           = '';
        $proyecto_formulario_12_linea_68->propuesta_sostenibilidad              = '';
        $proyecto_formulario_12_linea_68->bibliografia                          = '';

        $proyecto_formulario_12_linea_68->tipoProyectoLinea68()->associate($request->tipo_proyecto_linea_68_id);
        $proyecto_formulario_12_linea_68->estadoSistemaGestion()->associate($request->estado_sistema_gestion_id);

        $proyecto->proyectoFormulario12Linea68()->save($proyecto_formulario_12_linea_68);

        $proyecto->participantes()->attach(
            Auth::user()->id,
            [
                'es_formulador'     => true,
                'cantidad_meses'    => $request->max_meses_ejecucion,
                'cantidad_horas'    => 48,
                'rol_sennova'       => $request->rol_sennova,
            ]
        );

        return redirect()->route('convocatorias.proyectos-formulario-12-linea-68.edit', [$convocatoria, $proyecto_formulario_12_linea_68])->with('success', 'El recurso se ha creado correctamente. Por favor continue diligenciando la información.');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\ProyectoFormulario12Linea68  $proyecto_formulario_12_linea_68
     * @return \Illuminate\Http\Response
     */
    public function show(Convocatoria $convocatoria, ProyectoFormulario12Linea68 $proyecto_formulario_12_linea_68)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\ProyectoFormulario12Linea68  $proyecto_formulario_12_linea_68
     * @return \Illuminate\Http\Response
     */
    public function edit(Convocatoria $convocatoria, ProyectoFormulario12Linea68 $proyecto_formulario_12_linea_68)
    {
        $this->authorize('visualizar-proyecto-autor', [$proyecto_formulario_12_linea_68->proyecto]);

        if ($proyecto_formulario_12_linea_68->proyecto->convocatoria_id != $convocatoria->id) {
            return abort(404);
        }

        if (request()->filled('evaluacion_id')) {
            $evaluacion = Evaluacion::find(request()->evaluacion_id);

            $this->authorize('modificar-evaluacion-autor', [$evaluacion]);

            $items_evaluacion = $evaluacion->getItemsAEvaluar($convocatoria->id, $proyecto_formulario_12_linea_68->proyecto->tipo_formulario_convocatoria_id);
        }

        $proyecto_formulario_12_linea_68->load('proyecto.evaluaciones.evaluacionesProyectoFormulario12Linea68', 'proyecto.proyectoRolesSennova.proyectoRolesEvaluaciones', 'proyecto.proyectoPresupuesto.proyectoPresupuestosEvaluaciones');

        $proyecto_formulario_12_linea_68->proyecto->precio_proyecto = $proyecto_formulario_12_linea_68->proyecto->precioProyecto;
        $proyecto_formulario_12_linea_68->proyecto->centroFormacion;
        $proyecto_formulario_12_linea_68->proyecto->programasFormacion;
        $proyecto_formulario_12_linea_68->proyecto->participantes;
        $proyecto_formulario_12_linea_68->proyecto->tipoFormularioConvocatoria->lineaProgramatica;

        $proyecto_formulario_12_linea_68->mostrar_recomendaciones       = $proyecto_formulario_12_linea_68->proyecto->mostrar_recomendaciones;
        $proyecto_formulario_12_linea_68->mostrar_requiere_subsanacion  = $proyecto_formulario_12_linea_68->proyecto->mostrar_requiere_subsanacion;

        return Inertia::render('Convocatorias/Proyectos/ProyectosFormulario12Linea68/Edit', [
            'convocatoria'                                  => $convocatoria,
            'proyecto_formulario_12_linea_68'               => $proyecto_formulario_12_linea_68,
            'evaluacion'                                    => $items_evaluacion ?? [],
            'tipos_proyecto_linea_68'                       => SelectHelper::laboratoriosServiciosTecnologicos(),
            'lineas_programaticas'                          => SelectHelper::lineasProgramaticas()->where('categoria_proyecto', 3)->values()->all(),
            'estados_sistema_gestion'                       => SelectHelper::estadosSistemaGestion(),
            'programas_formacion_sin_registro_calificado'   => SelectHelper::programasFormacion()->where('registro_calificado', false)->values()->all(),
            'programas_formacion_con_registro_calificado'   => SelectHelper::programasFormacion()->where('registro_calificado', true)->values()->all(),
            'sectores_productivos'                          => collect(json_decode(Storage::get('json/sectores-productivos.json'), true)),
            'municipios'                                    => SelectHelper::municipios(),
            'tipos_proyecto_formulario_12_linea_68'         => SelectHelper::laboratoriosServiciosTecnologicos(),
            'roles_sennova'                                 => RolSennova::select('id as value', 'nombre as label')->orderBy('nombre', 'ASC')->get(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\ProyectoFormulario12Linea68  $proyecto_formulario_12_linea_68
     * @return \Illuminate\Http\Response
     */
    public function update(ProyectoFormulario12Linea68Request $request, Convocatoria $convocatoria, ProyectoFormulario12Linea68 $proyecto_formulario_12_linea_68)
    {
        $this->authorize('modificar-proyecto-autor', [$proyecto_formulario_12_linea_68->proyecto]);

        $proyecto_formulario_12_linea_68->update($request->validated());
        $proyecto_formulario_12_linea_68->save();

        $proyecto_formulario_12_linea_68->proyecto->programasFormacion()->sync(array_merge($request->programas_formacion ? $request->programas_formacion : [], $request->programas_formacion_relacionados ? $request->programas_formacion_relacionados : []));

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\ProyectoFormulario12Linea68  $proyecto_formulario_12_linea_68
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, Convocatoria $convocatoria, ProyectoFormulario12Linea68 $proyecto_formulario_12_linea_68)
    {
        $this->authorize('eliminar-proyecto-autor', [$proyecto_formulario_12_linea_68->proyecto]);

        // if (!Hash::check($request->password, Auth::user()->password)) {
        //     return back()
        //         ->withErrors(['password' => __('The password is incorrect.')]);
        // }

        $proyecto_formulario_12_linea_68->proyecto()->delete();

        return back()->with('success', 'El recurso se ha eliminado correctamente.');
    }

    public function updateEvaluacion(EvaluacionProyectoFormulario12Linea68Request $request, Convocatoria $convocatoria)
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

            EvaluacionProyectoFormulario12Linea68::updateOrCreate(
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

        return redirect()->back()->with('success', 'El recurso se ha actualizado correctamente.');
    }

    public function updateLongColumn(ProyectoFormulario12Linea68ColumnRequest $request, Convocatoria $convocatoria, ProyectoFormulario12Linea68 $proyecto_formulario_12_linea_68, $column)
    {
        $this->authorize('modificar-proyecto-autor', [$proyecto_formulario_12_linea_68->proyecto]);

        if ($column == 'fecha_inicio') {
            $proyecto_formulario_12_linea_68->update([
                'max_meses_ejecucion' => FunctionsHelper::diffMonths($request->fecha_inicio, $proyecto_formulario_12_linea_68->fecha_finalizacion)
            ]);
        } elseif ($column == 'fecha_finalizacion') {
            $proyecto_formulario_12_linea_68->update([
                'max_meses_ejecucion' => FunctionsHelper::diffMonths($proyecto_formulario_12_linea_68->fecha_inicio, $request->fecha_finalizacion)
            ]);
        }

        $array_programas_formacion = [];
        if ($column == 'programas_formacion_relacionados') {
            $array_programas_formacion = array_merge($proyecto_formulario_12_linea_68->proyecto->programasFormacion()->where('registro_calificado', true)->get()->pluck('id')->toArray(), $request->programas_formacion_relacionados);
        } else if ($column == 'programas_formacion') {
            $array_programas_formacion = array_merge($proyecto_formulario_12_linea_68->proyecto->programasFormacion()->where('registro_calificado', false)->get()->pluck('id')->toArray(), $request->programas_formacion);
        }

        if ($column == 'programas_formacion' || $column == 'programas_formacion_relacionados') {
            $proyecto_formulario_12_linea_68->proyecto->programasFormacion()->sync($array_programas_formacion);

            return back();
        }

        $proyecto_formulario_12_linea_68->update($request->only($column));

        return back();
    }
}
