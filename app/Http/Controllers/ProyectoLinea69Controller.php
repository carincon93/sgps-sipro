<?php

namespace App\Http\Controllers;

use App\Helpers\SharepointHelper;
use App\Helpers\SelectHelper;
use App\Models\Convocatoria;
use App\Models\Proyecto;
use App\Http\Controllers\Controller;
use App\Http\Requests\Evaluacion\EvaluacionProyectoLinea69Request;
use App\Http\Requests\ProyectoLinea69Request;
use App\Http\Requests\TpLongColumnRequest;
use App\Models\Actividad;
use App\Models\Evaluacion\EvaluacionProyectoLinea69;
use App\Models\LineaProgramatica;
use App\Models\Municipio;
use App\Models\NodoTecnoparque;
use App\Models\ProyectoLinea69;
use App\Models\RolSennova;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class ProyectoLinea69Controller extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Convocatoria $convocatoria)
    {
        return Inertia::render('Convocatorias/Proyectos/ProyectosLinea69/Index', [
            'convocatoria'          => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria', 'year'),
            'proyectos_linea_69'    => ProyectoLinea69::getProyectosPorRol($convocatoria)->appends(['search' => request()->search, 'estructuracion_proyectos' => request()->estructuracion_proyectos]),
            'allowed_to_create'     => Gate::inspect('formular-proyecto', [4, $convocatoria])->allowed()
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

        return Inertia::render('Convocatorias/Proyectos/ProyectosLinea69/Create', [
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
    public function store(ProyectoLinea69Request $request, Convocatoria $convocatoria)
    {
        $this->authorize('formular-proyecto', [4, $convocatoria]);

        $nodo_tecnoparque = NodoTecnoparque::find($request->nodo_tecnoparque_id);

        $proyecto = new Proyecto();
        $proyecto->arboles_completos = true;
        $proyecto->centroFormacion()->associate($nodo_tecnoparque->centro_formacion_id);
        $proyecto->lineaProgramatica()->associate(4);
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

        $proyecto_a_replicar = ProyectoLinea69::where('proyecto_base', true)->first();

        $nuevo_proyecto_linea_69 = $this->replicateRow($request, $proyecto_a_replicar, $proyecto);
        $nuevo_proyecto_linea_69->nodoTecnoparque()->associate($request->nodo_tecnoparque_id);

        if ($nuevo_proyecto_linea_69) {
            return redirect()->route('convocatorias.proyectos-linea-69.edit', [$convocatoria, $nuevo_proyecto_linea_69])->with('success', 'El recurso se ha creado correctamente.');
        } else {
            return back()->with('error', 'No hay un proyecto base generado. Por favor notifique al activador(a) de la línea.');
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\ProyectoLinea69 $proyecto_linea_69
     * @return \Illuminate\Http\Response
     */
    public function show(Convocatoria $convocatoria, ProyectoLinea69 $proyecto_linea_69)
    {
        $this->authorize('visualizar-proyecto-autor', [$proyecto_linea_69->proyecto]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\ProyectoLinea69 $proyecto_linea_69
     * @return \Illuminate\Http\Response
     */
    public function edit(Convocatoria $convocatoria, ProyectoLinea69 $proyecto_linea_69)
    {
        $this->authorize('visualizar-proyecto-autor', [$proyecto_linea_69->proyecto]);

        /** @var \App\Models\User */
        $auth_user = Auth::user();

        $proyecto_linea_69->load('proyecto.evaluaciones.evaluacionProyectoLinea69');

        $proyecto_linea_69->proyecto->codigo_linea_programatica      = $proyecto_linea_69->proyecto->lineaProgramatica->codigo;
        $proyecto_linea_69->proyecto->precio_proyecto                = $proyecto_linea_69->proyecto->precioProyecto;
        $proyecto_linea_69->proyecto->centroFormacion;
        $proyecto_linea_69->proyecto->allowed;

        $proyecto_linea_69->mostrar_recomendaciones        = $proyecto_linea_69->proyecto->mostrar_recomendaciones;
        $proyecto_linea_69->mostrar_requiere_subsanacion   = $proyecto_linea_69->proyecto->mostrar_requiere_subsanacion;

          if ($auth_user->hasRole(16)) {
            $nodos_tecnoparque = SelectHelper::nodosTecnoparque()->where('regional_id', $auth_user->centroFormacion->regional_id)->values()->all();
        } else {
            $nodos_tecnoparque = SelectHelper::nodosTecnoparque();
        }

        return Inertia::render('Convocatorias/Proyectos/ProyectosLinea69/Edit', [
            'convocatoria'          => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria', 'mostrar_recomendaciones', 'year', 'descripcion'),
            'proyecto_linea_69'     => $proyecto_linea_69,
            'evaluacion'            => EvaluacionProyectoLinea69::find(request()->evaluacion_id),
            'regionales'            => SelectHelper::regionales(),
            'lineas_programaticas'  => LineaProgramatica::selectRaw('id as value, concat(nombre, \' ∙ \', codigo) as label, codigo')->where('lineas_programaticas.categoria_proyecto', 1)->get(),
            'nodos_tecnoparque'     => SelectHelper::nodosTecnoparque()->where('centro_formacion_id', $proyecto_linea_69->proyecto->centroFormacion->id)->values()->all(),
            'municipios'            => Municipio::select('municipios.id as value', 'municipios.nombre as label', 'regionales.nombre as group', 'regionales.codigo')->join('regionales', 'regionales.id', 'municipios.regional_id')->get(),
            'roles_sennova'         => RolSennova::select('id as value', 'nombre as label')->orderBy('nombre', 'ASC')->get(),
            'nodos_tecnoparque'     => $nodos_tecnoparque,
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\ProyectoLinea69 $proyecto_linea_69
     * @return \Illuminate\Http\Response
     */
    public function update(ProyectoLinea69Request $request, Convocatoria $convocatoria, ProyectoLinea69 $proyecto_linea_69)
    {
        $this->authorize('modificar-proyecto-autor', [$proyecto_linea_69->proyecto]);

        $proyecto_linea_69->fecha_inicio                           = $request->fecha_inicio;
        $proyecto_linea_69->fecha_finalizacion                     = $request->fecha_finalizacion;
        $proyecto_linea_69->max_meses_ejecucion                    = $request->max_meses_ejecucion;
        $proyecto_linea_69->resumen                                = $request->resumen;
        $proyecto_linea_69->resumen_regional                       = $request->resumen_regional;
        $proyecto_linea_69->antecedentes                           = $request->antecedentes;
        $proyecto_linea_69->antecedentes_regional                  = $request->antecedentes_regional;
        $proyecto_linea_69->marco_conceptual                       = $request->marco_conceptual;
        $proyecto_linea_69->bibliografia                           = $request->bibliografia;
        $proyecto_linea_69->impacto_municipios                     = $request->impacto_municipios;
        $proyecto_linea_69->impacto_centro_formacion               = $request->impacto_centro_formacion;
        $proyecto_linea_69->retos_oportunidades                    = $request->retos_oportunidades;
        $proyecto_linea_69->pertinencia_territorio                 = $request->pertinencia_territorio;
        $proyecto_linea_69->articulacion_agenda_competitividad     = $request->articulacion_agenda_competitividad;
        $proyecto_linea_69->aportes_linea_ocho_conpes              = $request->aportes_linea_ocho_conpes;
        $proyecto_linea_69->estado_ecosistema_ctel                 = $request->estado_ecosistema_ctel;
        $proyecto_linea_69->logros_vigencia_anterior               = $request->logros_vigencia_anterior;
        $proyecto_linea_69->nodoTecnoparque()->associate($request->nodo_tecnoparque_id);

        $proyecto_linea_69->save();

        if ($request->hasFile('pdf_proyecto_general')) {
            $this->saveFilesSharepoint($request->pdf_proyecto_general, mb_strtoupper($convocatoria->descripcion) . ' ' . $convocatoria->year, $proyecto_linea_69, 'pdf_proyecto_general');
        }

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }

    public function updateLongColumn(TpLongColumnRequest $request, Convocatoria $convocatoria, ProyectoLinea69 $proyecto_linea_69, $column)
    {
        $this->authorize('modificar-proyecto-autor', [$proyecto_linea_69->proyecto]);

        $proyecto_linea_69->update($request->only($column));

        return back();
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\ProyectoLinea69 $proyecto_linea_69
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, Convocatoria $convocatoria, ProyectoLinea69 $proyecto_linea_69)
    {
        // Proyecto base
        if ($proyecto_linea_69->proyecto_base) {
            return back()->with('error', 'Este proyecto no se puede eliminar.');
        }

        $this->authorize('eliminar-proyecto-autor', [$proyecto_linea_69->proyecto]);

        // if (!Hash::check($request->password, Auth::user()->password)) {
        //     return back()
        //         ->withErrors(['password' => __('The password is incorrect.')]);
        // }

        $proyecto_linea_69->proyecto()->delete();

        return redirect()->route('convocatorias.proyectos-linea-69.index', [$convocatoria])->with('success', 'El recurso se ha eliminado correctamente.');
    }

    public function updateEvaluacion(EvaluacionProyectoLinea69Request $request, Convocatoria $convocatoria, EvaluacionProyectoLinea69 $evaluacion_proyecto_linea_69)
    {
        $this->authorize('modificar-evaluacion-autor', $evaluacion_proyecto_linea_69->evaluacion);

        $evaluacion_proyecto_linea_69->evaluacion()->update([
            'iniciado' => true,
            'clausula_confidencialidad' => $request->clausula_confidencialidad
        ]);

        $evaluacion_proyecto_linea_69->resumen_regional_comentario = $request->resumen_regional_requiere_comentario == false ? $request->resumen_regional_comentario : null;
        $evaluacion_proyecto_linea_69->antecedentes_regional_comentario = $request->antecedentes_regional_requiere_comentario == false ? $request->antecedentes_regional_comentario : null;
        $evaluacion_proyecto_linea_69->municipios_comentario = $request->municipios_requiere_comentario == false ? $request->municipios_comentario : null;
        $evaluacion_proyecto_linea_69->fecha_ejecucion_comentario = $request->fecha_ejecucion_requiere_comentario == false ? $request->fecha_ejecucion_comentario : null;
        $evaluacion_proyecto_linea_69->cadena_valor_comentario = $request->cadena_valor_requiere_comentario == false ? $request->cadena_valor_comentario : null;
        $evaluacion_proyecto_linea_69->bibliografia_comentario = $request->bibliografia_requiere_comentario == false ? $request->bibliografia_comentario : null;
        $evaluacion_proyecto_linea_69->retos_oportunidades_comentario = $request->retos_oportunidades_requiere_comentario == false ? $request->retos_oportunidades_comentario : null;
        $evaluacion_proyecto_linea_69->pertinencia_territorio_comentario = $request->pertinencia_territorio_requiere_comentario == false ? $request->pertinencia_territorio_comentario : null;
        $evaluacion_proyecto_linea_69->ortografia_comentario = $request->ortografia_requiere_comentario == false ? $request->ortografia_comentario : null;
        $evaluacion_proyecto_linea_69->redaccion_comentario = $request->redaccion_requiere_comentario == false ? $request->redaccion_comentario : null;
        $evaluacion_proyecto_linea_69->normas_apa_comentario = $request->normas_apa_requiere_comentario == false ? $request->normas_apa_comentario : null;

        $evaluacion_proyecto_linea_69->save();

        return redirect()->back()->with('success', 'El recurso ha sido actualizado correctamente.');
    }

    /**
     *
     */
    public function replicateRow($request, $proyecto_linea_69, $proyecto)
    {
        if ($proyecto_linea_69) {
            $clone = $proyecto_linea_69->replicate()->fill([
                'id'                    => $proyecto->id,
                'fecha_inicio'          => $request->fecha_inicio,
                'fecha_finalizacion'    => $request->fecha_finalizacion,
                'max_meses_ejecucion'   => $request->max_meses_ejecucion,
                'tecnoacademia_id'      => $request->tecnoacademia_id,
                'nodo_tecnoparque_id'   => $request->nodo_tecnoparque_id,
                'proyecto_base'         => false
            ]);
            $clone->push();

            //re-sync everything hasMany
            $objetivos_especificos = collect([]);
            $nuevas_actividades = [];
            foreach ($proyecto_linea_69->proyecto->causasDirectas as $causa_directa) {
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
            foreach ($proyecto_linea_69->proyecto->efectosDirectos as $key => $efecto_directo) {
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

                    $nuevo_producto->productoLinea69()->create($producto->productoLinea69->toArray());
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
            foreach ($proyecto_linea_69->proyecto->analisisRiesgos as $analisis_riesgo) {
                $clone->proyecto->analisisRiesgos()->create($analisis_riesgo->toArray());
            }

            //re-sync everything belongsToMany
            foreach ($proyecto_linea_69->proyecto->municipios as $municipio => $values) {
                $clone->proyecto->municipios()->sync($values);
            }

            //re-sync everything belongsToMany
            foreach ($proyecto_linea_69->proyecto->municipiosAImpactar as $municipio => $values) {
                $clone->proyecto->municipiosAImpactar()->sync($values);
            }

            //re-sync everything belongsToMany
            foreach ($proyecto_linea_69->proyecto->municipiosAImpactar as $municipio => $values) {
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
        $proyecto_linea_69                  = $modelo;
        $proyecto                           = Proyecto::find($proyecto_linea_69->proyecto->id);

        $sharepoint_proyecto_linea_69       = $proyecto->centroFormacion->nombre_carpeta_sharepoint . '/' . $proyecto->lineaProgramatica->codigo . '/' . $proyecto->codigo . '/PDF Proyecto';

        $sharepoint_path                    = "$modulo/$sharepoint_proyecto_linea_69";

        SharepointHelper::saveFilesSharepoint($tmp_file, $modelo, $sharepoint_path, $campo_bd);
    }

    public function downloadFileSharepoint(Convocatoria $convocatoria, ProyectoLinea69 $proyecto_linea_69, $tipo_archivo)
    {
        $sharepoint_path = $proyecto_linea_69[$tipo_archivo];

        return SharepointHelper::downloadFile($sharepoint_path);
    }
}
