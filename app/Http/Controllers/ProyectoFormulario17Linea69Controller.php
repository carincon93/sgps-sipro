<?php

namespace App\Http\Controllers;

use App\Helpers\FunctionsHelper;
use App\Helpers\SharepointHelper;
use App\Helpers\SelectHelper;
use App\Models\Convocatoria;
use App\Models\Proyecto;
use App\Http\Controllers\Controller;
use App\Http\Requests\Evaluacion\EvaluacionProyectoFormulario17Linea69Request;
use App\Http\Requests\ProyectoFormulario17Linea69ColumnRequest;
use App\Http\Requests\ProyectoFormulario17Linea69Request;
use App\Models\Actividad;
use App\Models\Evaluacion\Evaluacion;
use App\Models\Evaluacion\EvaluacionProyectoFormulario17Linea69;
use App\Models\LineaProgramatica;
use App\Models\NodoTecnoparque;
use App\Models\ProyectoFormulario17Linea69;
use App\Models\RolSennova;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class ProyectoFormulario17Linea69Controller extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Convocatoria $convocatoria)
    {
        return Inertia::render('Convocatorias/Proyectos/ProyectosFormulario17Linea69/Index', [
            'convocatoria'                      => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria', 'year'),
            'proyectos_formulario_17_linea_69'  => ProyectoFormulario17Linea69::getProyectosPorRol($convocatoria)->appends(['search' => request()->search]),
            'allowed_to_create'                 => Gate::inspect('formular-proyecto', [4, $convocatoria])->allowed()
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create(Convocatoria $convocatoria)
    {
        $this->authorize('formular-proyecto', [4, $convocatoria]);

        return Inertia::render('Convocatorias/Proyectos/ProyectosFormulario17Linea69/Create', [
            'convocatoria'          => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria', 'year'),
            'nodos_tecnoparque'     => SelectHelper::nodosTecnoparque(),
            'roles_sennova'         => RolSennova::select('id as value', 'nombre as label')->orderBy('nombre', 'ASC')->get(),
            'allowed_to_create'     => Gate::inspect('formular-proyecto', [4, $convocatoria])->allowed()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(ProyectoFormulario17Linea69Request $request, Convocatoria $convocatoria)
    {
        $this->authorize('formular-proyecto', [4, $convocatoria]);

        $nodo_tecnoparque = NodoTecnoparque::find($request->nodo_tecnoparque_id);

        $proyecto = new Proyecto();
        $proyecto->arboles_completos = true;
        $proyecto->centroFormacion()->associate($nodo_tecnoparque->centro_formacion_id);
        $proyecto->tipoFormularioConvocatoria()->associate(17);
        $proyecto->convocatoria()->associate($convocatoria);
        $proyecto->save();

        $proyecto->participantes()->attach(
            Auth::user()->id,
            [
                'es_formulador'     => true,
                'cantidad_meses'    => $request->cantidad_meses,
                'cantidad_horas'    => $request->cantidad_horas,
                'rol_sennova'       => $request->rol_sennova,
            ]
        );

        if ($convocatoria->proyectos()->whereHas('proyectoFormulario17Linea69')->count() == 0) {
            $proyecto->proyectoFormulario17Linea69()->create([
                'nodo_tecnoparque_id'   => $request->nodo_tecnoparque_id,
                'fecha_inicio'          => $request->fecha_inicio,
                'fecha_finalizacion'    => $request->fecha_finalizacion,
                'proyecto_base'         => true
            ]);
            return redirect()->route('convocatorias.proyectos-formulario-17-linea-69.edit', [$convocatoria, $proyecto])->with('success', 'El recurso se ha creado correctamente. Este es el proyecto base, por favor defina los campos con información precargada.');
        }

        $proyecto_a_replicar = $convocatoria->proyectos()
            ->whereHas('proyectoFormulario17Linea69', function ($query) {
                $query->where('proyecto_base', true);
            })
            ->first();

        $nuevo_proyecto_formulario_17_linea_69 = $this->replicateRow($request, $proyecto_a_replicar->proyectoFormulario17Linea69, $proyecto);

        if ($nuevo_proyecto_formulario_17_linea_69) {
            return redirect()->route('convocatorias.proyectos-formulario-17-linea-69.edit', [$convocatoria, $proyecto])->with('success', 'El recurso se ha creado correctamente.');
        } else {
            return back()->with('error', 'No hay un proyecto base generado. Por favor notifique al activador(a) de la línea.');
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\ProyectoFormulario17Linea69 $proyecto_formulario_17_linea_69
     * @return \Illuminate\Http\Response
     */
    public function show(Convocatoria $convocatoria, ProyectoFormulario17Linea69 $proyecto_formulario_17_linea_69)
    {
        $this->authorize('visualizar-proyecto-autor', [$proyecto_formulario_17_linea_69->proyecto]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\ProyectoFormulario17Linea69 $proyecto_formulario_17_linea_69
     * @return \Illuminate\Http\Response
     */
    public function edit(Convocatoria $convocatoria, ProyectoFormulario17Linea69 $proyecto_formulario_17_linea_69)
    {
        $this->authorize('visualizar-proyecto-autor', [$proyecto_formulario_17_linea_69->proyecto]);

        if ($proyecto_formulario_17_linea_69->proyecto->convocatoria_id != $convocatoria->id) {
            return abort(404);
        }

        if (request()->filled('evaluacion_id')) {
            $evaluacion = Evaluacion::find(request()->evaluacion_id);

            $this->authorize('modificar-evaluacion-autor', [$evaluacion]);

            $items_evaluacion = $evaluacion->getItemsAEvaluar($convocatoria->id, $proyecto_formulario_17_linea_69->proyecto->tipo_formulario_convocatoria_id);
        }

        // $proyecto_formulario_17_linea_69->load('proyecto.evaluaciones.evaluacionProyectoFormulario17Linea69');

        $proyecto_formulario_17_linea_69->proyecto->precio_proyecto      = $proyecto_formulario_17_linea_69->proyecto->precioProyecto;
        $proyecto_formulario_17_linea_69->proyecto->centroFormacion;
        $proyecto_formulario_17_linea_69->proyecto->participantes;
        $proyecto_formulario_17_linea_69->proyecto->tipoFormularioConvocatoria->lineaProgramatica;

        $proyecto_formulario_17_linea_69->mostrar_recomendaciones        = $proyecto_formulario_17_linea_69->proyecto->mostrar_recomendaciones;
        $proyecto_formulario_17_linea_69->mostrar_requiere_subsanacion   = $proyecto_formulario_17_linea_69->proyecto->mostrar_requiere_subsanacion;

        /** @var \App\Models\User */
        $auth_user = Auth::user();

        if ($auth_user->hasRole(16)) {
            $nodos_tecnoparque = SelectHelper::nodosTecnoparque()->where('regional_id', $auth_user->centroFormacion->regional_id)->values()->all();
        } else {
            $nodos_tecnoparque = SelectHelper::nodosTecnoparque();
        }

        return Inertia::render('Convocatorias/Proyectos/ProyectosFormulario17Linea69/Edit', [
            'convocatoria'                      => $convocatoria,
            'proyecto_formulario_17_linea_69'   => $proyecto_formulario_17_linea_69,
            'evaluacion'                        => $items_evaluacion ?? [],
            'regionales'                        => SelectHelper::regionales(),
            'nodos_tecnoparque'                 => SelectHelper::nodosTecnoparque()->where('centro_formacion_id', $proyecto_formulario_17_linea_69->proyecto->centroFormacion->id)->values()->all(),
            'roles_sennova'                     => RolSennova::select('id as value', 'nombre as label')->orderBy('nombre', 'ASC')->get(),
            'nodos_tecnoparque'                 => $nodos_tecnoparque,
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\ProyectoFormulario17Linea69 $proyecto_formulario_17_linea_69
     * @return \Illuminate\Http\Response
     */
    public function update(ProyectoFormulario17Linea69Request $request, Convocatoria $convocatoria, ProyectoFormulario17Linea69 $proyecto_formulario_17_linea_69)
    {
        $this->authorize('modificar-proyecto-autor', [$proyecto_formulario_17_linea_69->proyecto]);

        $proyecto_formulario_17_linea_69->update($request->validated());


        $proyecto_formulario_17_linea_69->save();

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\ProyectoFormulario17Linea69 $proyecto_formulario_17_linea_69
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, Convocatoria $convocatoria, ProyectoFormulario17Linea69 $proyecto_formulario_17_linea_69)
    {
        // Proyecto base
        if ($proyecto_formulario_17_linea_69->proyecto_base) {
            return back()->with('error', 'Este proyecto no se puede eliminar.');
        }

        $this->authorize('eliminar-proyecto-autor', [$proyecto_formulario_17_linea_69->proyecto]);

        // if (!Hash::check($request->password, Auth::user()->password)) {
        //     return back()
        //         ->withErrors(['password' => __('The password is incorrect.')]);
        // }

        $proyecto_formulario_17_linea_69->proyecto()->delete();

        return back()->with('success', 'El recurso se ha eliminado correctamente.');
    }

    public function updateEvaluacion(EvaluacionProyectoFormulario17Linea69Request $request, Convocatoria $convocatoria)
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

            EvaluacionProyectoFormulario17Linea69::updateOrCreate(
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

    /**
     *
     */
    public function replicateRow($request, $proyecto_formulario_17_linea_69, $proyecto)
    {
        if ($proyecto_formulario_17_linea_69) {
            $clone = $proyecto_formulario_17_linea_69->replicate()->fill([
                'id'                    => $proyecto->id,
                'fecha_inicio'          => $request->fecha_inicio,
                'fecha_finalizacion'    => $request->fecha_finalizacion,
                'max_meses_ejecucion'   => $request->max_meses_ejecucion,
                'nodo_tecnoparque_id'   => $request->nodo_tecnoparque_id,
                'proyecto_base'         => false
            ]);
            $clone->push();

            //re-sync everything hasMany
            $objetivos_especificos = collect([]);
            $nuevas_actividades = collect([]);
            foreach ($proyecto_formulario_17_linea_69->proyecto->causasDirectas as $causa_directa) {
                $nueva_causa_directa = $clone->proyecto->causasDirectas()->create($causa_directa->toArray());
                $nuevo_objetivo_especifico = $nueva_causa_directa->objetivoEspecifico()->create($causa_directa->objetivoEspecifico->toArray());
                $objetivos_especificos->push($nuevo_objetivo_especifico);

                foreach ($causa_directa->causasIndirectas as $causa_indirecta) {
                    $nueva_causa_indirecta = $nueva_causa_directa->causasIndirectas()->create($causa_indirecta->toArray());
                    $nueva_actividad = $nueva_causa_indirecta->actividad()->create([
                        'objetivo_especifico_id'    => $nuevo_objetivo_especifico->id,
                        'resultado_id'              => null,
                        'causa_indirecta_id'        => $nueva_causa_indirecta->id,
                        'fecha_inicio'              => $causa_indirecta->actividad->fecha_inicio,
                        'fecha_finalizacion'        => $causa_indirecta->actividad->fecha_finalizacion,
                        'descripcion'               => $causa_indirecta->actividad->descripcion,
                    ]);

                    $nuevas_actividades->push([
                        'actividad_id'                  => $nueva_actividad->id,
                        'objetivo_especifico_id'        => $nueva_actividad->objetivo_especifico_id,
                        'resultado_antiguo'             => optional($causa_indirecta->actividad->resultado)->descripcion,
                        'objetivo_especifico_antiguo'   => optional($causa_indirecta->actividad->objetivoEspecifico)->numero,
                        'causa_indirecta_id'            => $nueva_actividad->causa_indirecta_id,
                        'descripcion_actividad'         => $nueva_actividad->descripcion
                    ]);
                }
            }

            //re-sync everything hasMany
            $resultados = collect([]);
            $productos = collect([]);
            $nuevos_productos = collect([]);
            foreach ($proyecto_formulario_17_linea_69->proyecto->efectosDirectos as $key => $efecto_directo) {
                $nuevo_efecto_directo = $clone->proyecto->efectosDirectos()->create($efecto_directo->toArray());
                if ($objetivos_especificos->where('numero', $efecto_directo->resultado->objetivoEspecifico->numero)->where('descripcion', $efecto_directo->resultado->objetivoEspecifico->descripcion)->first()) {
                    $nuevo_resultado = $nuevo_efecto_directo->resultado()->create([
                        'objetivo_especifico_id'    => $objetivos_especificos->where('numero', $efecto_directo->resultado->objetivoEspecifico->numero)->where('descripcion', $efecto_directo->resultado->objetivoEspecifico->descripcion)->first()->id,
                        'descripcion'               => $efecto_directo->resultado->descripcion,
                    ]);
                    $resultados->push($nuevo_resultado);
                }

                foreach ($efecto_directo->resultado->productos as $producto) {
                    $productos->push($producto->load('actividades'));
                    $nuevo_producto = $nuevo_resultado->productos()->create($producto->toArray());
                    $nuevos_productos->push($nuevo_producto);

                    if ($producto->productoMinciencias()->exists()) {
                        $nuevo_producto->productoMinciencias()->create($producto->productoMinciencias->toArray());
                    }
                }

                foreach ($efecto_directo->efectosIndirectos as $efecto_indirecto) {
                    $nuevo_efecto_indirecto = $nuevo_efecto_directo->efectosIndirectos()->create($efecto_indirecto->toArray());
                    $nuevo_efecto_indirecto->impacto()->create($efecto_indirecto->impacto->toArray());
                }
            }

            foreach ($nuevas_actividades as $key => $actividad) {
                Actividad::where('id', $actividad['actividad_id'])->update([
                    'resultado_id' => $resultados->where('descripcion', $actividad['resultado_antiguo'])->first() ? $resultados->where('descripcion', $actividad['resultado_antiguo'])->first()->id : null
                ]);
            }

            //re-sync everything hasMany
            foreach ($proyecto_formulario_17_linea_69->proyecto->analisisRiesgos as $analisis_riesgo) {
                $clone->proyecto->analisisRiesgos()->create($analisis_riesgo->toArray());
            }

            // re-sync productos->actividades
            foreach ($nuevos_productos as $nuevo_producto) {
                if ($nuevas_actividades->whereIn('descripcion_actividad', $productos->where('nombre', $nuevo_producto->nombre)->first())) {
                    $nuevo_producto->actividades()->sync($nuevas_actividades->whereIn('descripcion_actividad', $productos->where('nombre', $nuevo_producto->nombre)->first()->actividades->pluck('descripcion')->toArray())->pluck('actividad_id')->toArray());
                }
            }

            //re-sync everything belongsToMany
            $clone->proyecto->semillerosInvestigacion()->sync($proyecto_formulario_17_linea_69->proyecto->semillerosInvestigacion()->pluck('semilleros_investigacion.id'));

            //re-sync everything belongsToMany
            $clone->proyecto->gruposInvestigacion()->sync($proyecto_formulario_17_linea_69->proyecto->gruposInvestigacion()->pluck('grupos_investigacion.id'));

            //re-sync everything belongsToMany
            $clone->proyecto->municipios()->sync($proyecto_formulario_17_linea_69->proyecto->municipios()->pluck('municipios.id'));

            //re-sync everything belongsToMany
            $clone->proyecto->municipiosAImpactar()->sync($proyecto_formulario_17_linea_69->proyecto->municipiosAImpactar()->pluck('municipios.id'));

            $clone->save();

            return $clone;
        } else {
            return false;
        }
    }

    public function saveFilesSharepoint($tmp_file, $modulo, $modelo, $campo_bd)
    {
        $proyecto_formulario_17_linea_69                = $modelo;
        $proyecto                                       = Proyecto::find($proyecto_formulario_17_linea_69->proyecto->id);

        $sharepoint_proyecto_formulario_17_linea_69     = $proyecto->centroFormacion->nombre_carpeta_sharepoint . '/' . $proyecto->tipoFormularioConvocatoria->lineaProgramatica->codigo . '/' . $proyecto->codigo . '/PDF Proyecto';

        $sharepoint_path                                = "$modulo/$sharepoint_proyecto_formulario_17_linea_69";

        SharepointHelper::saveFilesSharepoint($tmp_file, $modelo, $sharepoint_path, $campo_bd);
    }

    public function downloadFileSharepoint(Convocatoria $convocatoria, ProyectoFormulario17Linea69 $proyecto_formulario_17_linea_69, $tipo_archivo)
    {
        $sharepoint_path = $proyecto_formulario_17_linea_69[$tipo_archivo];

        return SharepointHelper::downloadFile($sharepoint_path);
    }

    public function updateMetodologiaProyectoFormulario17Linea69(Request $request, Convocatoria $convocatoria, Proyecto $proyecto)
    {
        $this->authorize('modificar-proyecto-autor', $proyecto);

        $proyecto->proyectoFormulario17Linea69()->update($request->all());

        $proyecto->save();

        return back()->with('success', 'El recurso se ha guardado correctamente.');
    }

    public function updateLongColumn(ProyectoFormulario17Linea69ColumnRequest $request, Convocatoria $convocatoria, ProyectoFormulario17Linea69 $proyecto_formulario_17_linea_69, $column)
    {
        $this->authorize('modificar-proyecto-autor', [$proyecto_formulario_17_linea_69->proyecto]);

        if ($column == 'fecha_inicio') {
            $proyecto_formulario_17_linea_69->update([
                'max_meses_ejecucion' => FunctionsHelper::diffMonths($request->fecha_inicio, $proyecto_formulario_17_linea_69->fecha_finalizacion)
            ]);
        } elseif ($column == 'fecha_finalizacion') {
            $proyecto_formulario_17_linea_69->update([
                'max_meses_ejecucion' => FunctionsHelper::diffMonths($proyecto_formulario_17_linea_69->fecha_inicio, $request->fecha_finalizacion)
            ]);
        }

        $proyecto_formulario_17_linea_69->update($request->only($column));

        return back();
    }
}
