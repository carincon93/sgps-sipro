<?php

namespace App\Http\Controllers;

use App\Helpers\SharepointHelper;
use App\Helpers\SelectHelper;
use App\Models\Convocatoria;
use App\Models\Proyecto;
use App\Http\Controllers\Controller;
use App\Http\Requests\Evaluacion\EvaluacionProyectoHubLinea69Request;
use App\Http\Requests\ProyectoHubLinea69Request;
use App\Http\Requests\TpLongColumnRequest;
use App\Models\Actividad;
use App\Models\Evaluacion\EvaluacionProyectoHubLinea69;
use App\Models\LineaProgramatica;
use App\Models\NodoTecnoparque;
use App\Models\ProyectoHubLinea69;
use App\Models\RolSennova;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class ProyectoHubLinea69Controller extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Convocatoria $convocatoria)
    {
        return Inertia::render('Convocatorias/Proyectos/ProyectosHubLinea69/Index', [
            'convocatoria'              => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria', 'year'),
            'proyectos_hub_linea_69'    => ProyectoHubLinea69::getProyectosPorRol($convocatoria)->appends(['search' => request()->search]),
            'allowed_to_create'         => Gate::inspect('formular-proyecto', [35, $convocatoria])->allowed()
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create(Convocatoria $convocatoria)
    {
        $this->authorize('formular-proyecto', [35, $convocatoria]);

        return Inertia::render('Convocatorias/Proyectos/ProyectosHubLinea69/Create', [
            'convocatoria'          => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria', 'year'),
            'nodos_tecnoparque'     => SelectHelper::nodosTecnoparque(),
            'roles_sennova'         => RolSennova::select('id as value', 'nombre as label')->orderBy('nombre', 'ASC')->get(),
            'allowed_to_create'     => Gate::inspect('formular-proyecto', [35, $convocatoria])->allowed()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(ProyectoHubLinea69Request $request, Convocatoria $convocatoria)
    {
        $this->authorize('formular-proyecto', [35, $convocatoria]);

        $nodo_tecnoparque = NodoTecnoparque::find($request->nodo_tecnoparque_id);

        $proyecto = new Proyecto();
        $proyecto->arboles_completos = false;
        $proyecto->centroFormacion()->associate($nodo_tecnoparque->centro_formacion_id);
        $proyecto->lineaProgramatica()->associate(35);
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

        $proyecto->proyectoHubLinea69()->create([
            'nodo_tecnoparque_id'   => $request->nodo_tecnoparque_id,
            'fecha_inicio'          => $request->fecha_inicio,
            'fecha_finalizacion'    => $request->fecha_finalizacion,
        ]);

        $proyecto_a_replicar = ProyectoHubLinea69::where('proyecto_base', true)->first();

        // $nuevo_proyecto_hub_linea_69 = $this->replicateRow($request, $proyecto_a_replicar, $proyecto);
        // $nuevo_proyecto_hub_linea_69->nodoTecnoparque()->associate($request->nodo_tecnoparque_id);
        // $nuevo_proyecto_hub_linea_69->proyecto()->update(['arboles_completos' => true]);

        // if ($nuevo_proyecto_hub_linea_69) {
            return redirect()->route('convocatorias.proyectos-hub-linea-69.edit', [$convocatoria, $proyecto])->with('success', 'El recurso se ha creado correctamente.');
        // } else {
        //     return back()->with('error', 'No hay un proyecto base generado. Por favor notifique al activador(a) de la línea.');
        // }
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\ProyectoHubLinea69 $proyecto_hub_linea_69
     * @return \Illuminate\Http\Response
     */
    public function show(Convocatoria $convocatoria, ProyectoHubLinea69 $proyecto_hub_linea_69)
    {
        $this->authorize('visualizar-proyecto-autor', [$proyecto_hub_linea_69->proyecto]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\ProyectoHubLinea69 $proyecto_hub_linea_69
     * @return \Illuminate\Http\Response
     */
    public function edit(Convocatoria $convocatoria, ProyectoHubLinea69 $proyecto_hub_linea_69)
    {
        $this->authorize('visualizar-proyecto-autor', [$proyecto_hub_linea_69->proyecto]);

        /** @var \App\Models\User */
        $auth_user = Auth::user();

        $proyecto_hub_linea_69->load('proyecto.evaluaciones.evaluacionProyectoHubLinea69');

        $proyecto_hub_linea_69->proyecto->codigo_linea_programatica      = $proyecto_hub_linea_69->proyecto->lineaProgramatica->codigo;
        $proyecto_hub_linea_69->proyecto->precio_proyecto                = $proyecto_hub_linea_69->proyecto->precioProyecto;
        $proyecto_hub_linea_69->proyecto->centroFormacion;
        $proyecto_hub_linea_69->proyecto->allowed;

        $proyecto_hub_linea_69->mostrar_recomendaciones        = $proyecto_hub_linea_69->proyecto->mostrar_recomendaciones;
        $proyecto_hub_linea_69->mostrar_requiere_subsanacion   = $proyecto_hub_linea_69->proyecto->mostrar_requiere_subsanacion;

          if ($auth_user->hasRole(16)) {
            $nodos_tecnoparque = SelectHelper::nodosTecnoparque()->where('regional_id', $auth_user->centroFormacion->regional_id)->values()->all();
        } else {
            $nodos_tecnoparque = SelectHelper::nodosTecnoparque();
        }

        return Inertia::render('Convocatorias/Proyectos/ProyectosHubLinea69/Edit', [
            'convocatoria'          => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria', 'mostrar_recomendaciones', 'year', 'descripcion'),
            'proyecto_hub_linea_69'     => $proyecto_hub_linea_69,
            // 'evaluacion'            => EvaluacionProyectoHubLinea69::find(request()->evaluacion_id),
            'regionales'            => SelectHelper::regionales(),
            'lineas_programaticas'  => LineaProgramatica::selectRaw('id as value, concat(nombre, \' ∙ \', codigo) as label, codigo')->where('lineas_programaticas.categoria_proyecto', 1)->get(),
            'nodos_tecnoparque'     => SelectHelper::nodosTecnoparque()->where('centro_formacion_id', $proyecto_hub_linea_69->proyecto->centroFormacion->id)->values()->all(),
            'roles_sennova'         => RolSennova::select('id as value', 'nombre as label')->orderBy('nombre', 'ASC')->get(),
            'nodos_tecnoparque'     => $nodos_tecnoparque,
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\ProyectoHubLinea69 $proyecto_hub_linea_69
     * @return \Illuminate\Http\Response
     */
    public function update(ProyectoHubLinea69Request $request, Convocatoria $convocatoria, ProyectoHubLinea69 $proyecto_hub_linea_69)
    {
        $this->authorize('modificar-proyecto-autor', [$proyecto_hub_linea_69->proyecto]);

        $proyecto_hub_linea_69->resumen                                         = $request->resumen;
        $proyecto_hub_linea_69->fecha_inicio                                    = $request->fecha_inicio;
        $proyecto_hub_linea_69->fecha_finalizacion                              = $request->fecha_finalizacion;
        $proyecto_hub_linea_69->resumen_regional                                = $request->resumen_regional;
        $proyecto_hub_linea_69->antecedentes                                    = $request->antecedentes;
        $proyecto_hub_linea_69->antecedentes_regional                           = $request->antecedentes_regional;
        $proyecto_hub_linea_69->logros_vigencia_anterior                        = $request->logros_vigencia_anterior;
        $proyecto_hub_linea_69->contexto_general                                = $request->contexto_general;
        $proyecto_hub_linea_69->retos_locales_regionales                        = $request->retos_locales_regionales;
        $proyecto_hub_linea_69->estado_actual_departamento                      = $request->estado_actual_departamento;
        $proyecto_hub_linea_69->contribucion_desarrollo_empresas                = $request->contribucion_desarrollo_empresas;
        $proyecto_hub_linea_69->contribucion_agenda_regional_competitividad     = $request->contribucion_agenda_regional_competitividad;
        $proyecto_hub_linea_69->aportes_conpes_4011                             = $request->aportes_conpes_4011;
        $proyecto_hub_linea_69->aportes_conpes_4080                             = $request->aportes_conpes_4080;
        $proyecto_hub_linea_69->situacion_actual_produccion_agricola            = $request->situacion_actual_produccion_agricola;
        $proyecto_hub_linea_69->aportes_alternativas_generacion_electrica       = $request->aportes_alternativas_generacion_electrica;
        $proyecto_hub_linea_69->aportes_impulso_economia_popular                = $request->aportes_impulso_economia_popular;
        $proyecto_hub_linea_69->justificacion_pertinencia                       = $request->justificacion_pertinencia;
        $proyecto_hub_linea_69->acciones_estrategias_campesena                  = $request->acciones_estrategias_campesena;
        $proyecto_hub_linea_69->bibliografia                                    = $request->bibliografia;
        $proyecto_hub_linea_69->nodoTecnoparque()->associate($request->nodo_tecnoparque_id);

        $proyecto_hub_linea_69->save();

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }

    public function updateLongColumn(TpLongColumnRequest $request, Convocatoria $convocatoria, ProyectoHubLinea69 $proyecto_hub_linea_69, $column)
    {
        $this->authorize('modificar-proyecto-autor', [$proyecto_hub_linea_69->proyecto]);

        $proyecto_hub_linea_69->update($request->only($column));

        return back();
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\ProyectoHubLinea69 $proyecto_hub_linea_69
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, Convocatoria $convocatoria, ProyectoHubLinea69 $proyecto_hub_linea_69)
    {
        // Proyecto base
        if ($proyecto_hub_linea_69->proyecto_base) {
            return back()->with('error', 'Este proyecto no se puede eliminar.');
        }

        $this->authorize('eliminar-proyecto-autor', [$proyecto_hub_linea_69->proyecto]);

        // if (!Hash::check($request->password, Auth::user()->password)) {
        //     return back()
        //         ->withErrors(['password' => __('The password is incorrect.')]);
        // }

        $proyecto_hub_linea_69->proyecto()->delete();

        return redirect()->route('convocatorias.proyectos-hub-linea-69.index', [$convocatoria])->with('success', 'El recurso se ha eliminado correctamente.');
    }

    public function updateEvaluacion(EvaluacionProyectoHubLinea69Request $request, Convocatoria $convocatoria, EvaluacionProyectoHubLinea69 $evaluacion_proyecto_hub_linea_69)
    {
        $this->authorize('modificar-evaluacion-autor', $evaluacion_proyecto_hub_linea_69->evaluacion);

        $evaluacion_proyecto_hub_linea_69->evaluacion()->update([
            'iniciado' => true,
            'clausula_confidencialidad' => $request->clausula_confidencialidad
        ]);

        $evaluacion_proyecto_hub_linea_69->resumen_regional_comentario = $request->resumen_regional_requiere_comentario == false ? $request->resumen_regional_comentario : null;
        $evaluacion_proyecto_hub_linea_69->antecedentes_regional_comentario = $request->antecedentes_regional_requiere_comentario == false ? $request->antecedentes_regional_comentario : null;
        $evaluacion_proyecto_hub_linea_69->municipios_comentario = $request->municipios_requiere_comentario == false ? $request->municipios_comentario : null;
        $evaluacion_proyecto_hub_linea_69->fecha_ejecucion_comentario = $request->fecha_ejecucion_requiere_comentario == false ? $request->fecha_ejecucion_comentario : null;
        $evaluacion_proyecto_hub_linea_69->cadena_valor_comentario = $request->cadena_valor_requiere_comentario == false ? $request->cadena_valor_comentario : null;
        $evaluacion_proyecto_hub_linea_69->bibliografia_comentario = $request->bibliografia_requiere_comentario == false ? $request->bibliografia_comentario : null;
        $evaluacion_proyecto_hub_linea_69->retos_oportunidades_comentario = $request->retos_oportunidades_requiere_comentario == false ? $request->retos_oportunidades_comentario : null;
        $evaluacion_proyecto_hub_linea_69->pertinencia_territorio_comentario = $request->pertinencia_territorio_requiere_comentario == false ? $request->pertinencia_territorio_comentario : null;
        $evaluacion_proyecto_hub_linea_69->ortografia_comentario = $request->ortografia_requiere_comentario == false ? $request->ortografia_comentario : null;
        $evaluacion_proyecto_hub_linea_69->redaccion_comentario = $request->redaccion_requiere_comentario == false ? $request->redaccion_comentario : null;
        $evaluacion_proyecto_hub_linea_69->normas_apa_comentario = $request->normas_apa_requiere_comentario == false ? $request->normas_apa_comentario : null;

        $evaluacion_proyecto_hub_linea_69->save();

        return redirect()->back()->with('success', 'El recurso ha sido actualizado correctamente.');
    }

    /**
     *
     */
    public function replicateRow($request, $proyecto_hub_linea_69, $proyecto)
    {
        if ($proyecto_hub_linea_69) {
            $clone = $proyecto_hub_linea_69->replicate()->fill([
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
            $nuevas_actividades = [];
            foreach ($proyecto_hub_linea_69->proyecto->causasDirectas as $causa_directa) {
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

                    array_push(
                        $nuevas_actividades,
                        [
                            'actividad_id'                  => $nueva_actividad->id,
                            'objetivo_especifico_id'        => $nueva_actividad->objetivo_especifico_id,
                            'resultado_antiguo'             => $causa_indirecta->actividad->resultado->descripcion,
                            'objetivo_especifico_antiguo'   => $causa_indirecta->actividad->objetivoEspecifico->numero,
                            'causa_indirecta_id'            => $nueva_actividad->causa_indirecta_id,
                            'descripcion_actividad'         => $nueva_actividad->descripcion
                        ]
                    );
                }
            }

            //re-sync everything hasMany
            $resultados = collect([]);
            foreach ($proyecto_hub_linea_69->proyecto->efectosDirectos as $key => $efecto_directo) {
                $nuevo_efecto_directo = $clone->proyecto->efectosDirectos()->create($efecto_directo->toArray());
                if ($objetivos_especificos->where('numero', $efecto_directo->resultado->objetivoEspecifico->numero)->where('descripcion', $efecto_directo->resultado->objetivoEspecifico->descripcion)->first()) {
                    $nuevo_resultado = $nuevo_efecto_directo->resultado()->create([
                        'objetivo_especifico_id'    => $objetivos_especificos->where('numero', $efecto_directo->resultado->objetivoEspecifico->numero)->where('descripcion', $efecto_directo->resultado->objetivoEspecifico->descripcion)->first()->id,
                        'descripcion'               => $efecto_directo->resultado->descripcion,
                    ]);
                    $resultados->push($nuevo_resultado);
                }

                foreach ($efecto_directo->resultado->productos as $producto) {
                    $nuevo_producto = $nuevo_resultado->productos()->create($producto->toArray());

                    $nuevo_producto->productoHubLinea69()->create($producto->productoHubLinea69->toArray());
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
            foreach ($proyecto_hub_linea_69->proyecto->analisisRiesgos as $analisis_riesgo) {
                $clone->proyecto->analisisRiesgos()->create($analisis_riesgo->toArray());
            }

            //re-sync everything belongsToMany
            foreach ($proyecto_hub_linea_69->proyecto->municipios as $municipio => $values) {
                $clone->proyecto->municipios()->sync($values);
            }

            //re-sync everything belongsToMany
            foreach ($proyecto_hub_linea_69->proyecto->municipiosAImpactar as $municipio => $values) {
                $clone->proyecto->municipiosAImpactar()->sync($values);
            }

            //re-sync everything belongsToMany
            foreach ($proyecto_hub_linea_69->proyecto->municipiosAImpactar as $municipio => $values) {
                $clone->proyecto->municipiosAImpactar()->sync($values);
            }

            $clone->save();

            return $clone;
        } else {
            return false;
        }
    }

    public function saveFilesSharepoint($tmp_file, $modulo, $modelo, $campo_bd)
    {
        $proyecto_hub_linea_69              = $modelo;
        $proyecto                           = Proyecto::find($proyecto_hub_linea_69->proyecto->id);

        $sharepoint_proyecto_hub_linea_69   = $proyecto->centroFormacion->nombre_carpeta_sharepoint . '/' . $proyecto->lineaProgramatica->codigo . '/' . $proyecto->codigo . '/PDF Proyecto';

        $sharepoint_path                    = "$modulo/$sharepoint_proyecto_hub_linea_69";

        SharepointHelper::saveFilesSharepoint($tmp_file, $modelo, $sharepoint_path, $campo_bd);
    }

    public function downloadFileSharepoint(Convocatoria $convocatoria, ProyectoHubLinea69 $proyecto_hub_linea_69, $tipo_archivo)
    {
        $sharepoint_path = $proyecto_hub_linea_69[$tipo_archivo];

        return SharepointHelper::downloadFile($sharepoint_path);
    }
}
