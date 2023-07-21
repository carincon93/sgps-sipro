<?php

namespace App\Http\Controllers;

use App\Helpers\SharepointHelper;
use App\Helpers\SelectHelper;
use App\Models\Convocatoria;
use App\Models\Proyecto;
use App\Models\Tp;
use App\Http\Controllers\Controller;
use App\Http\Requests\TpLongColumnRequest;
use App\Http\Requests\TpRequest;
use App\Models\Actividad;
use App\Models\LineaProgramatica;
use App\Models\Municipio;
use App\Models\NodoTecnoparque;
use App\Models\RolSennova;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
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
            'convocatoria'      => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria', 'tipo_convocatoria'),
            'filters'           => request()->all('search', 'estructuracion_proyectos'),
            'proyectosTp'       => Tp::getProyectosPorRol($convocatoria)->appends(['search' => request()->search, 'estructuracion_proyectos' => request()->estructuracion_proyectos]),
            'allowedToCreate'   => Gate::inspect('formular-proyecto', [4, $convocatoria])->allowed()
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

        /** @var \App\Models\User */
        $authUser = Auth::user();

        if ($authUser->hasRole(16)) {
            $nodosTecnoParque = SelectHelper::nodosTecnoparque()->where('regional_id', $authUser->centroFormacion->regional_id)->values()->all();
        } else {
            $nodosTecnoParque = SelectHelper::nodosTecnoparque();
        }

        return Inertia::render('Convocatorias/Proyectos/ProyectosLinea69/Create', [
            'convocatoria'          => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria', 'min_fecha_inicio_proyectos_linea_69', 'max_fecha_finalizacion_proyectos_linea_69', 'fecha_maxima_tp'),
            'nodosTecnoParque'      => $nodosTecnoParque,
            'rolesSennova'          => RolSennova::select('id as value', 'nombre as label')->orderBy('nombre', 'ASC')->get(),
            'allowedToCreate'       => Gate::inspect('formular-proyecto', [4, $convocatoria])->allowed()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(TpRequest $request, Convocatoria $convocatoria, Tp $tp)
    {
        $this->authorize('formular-proyecto', [4, $convocatoria]);

        $nodoTecnoParque = NodoTecnoparque::find($request->nodo_tecnoparque_id);

        $proyecto = new Proyecto();
        $proyecto->arboles_completos = true;
        $proyecto->centroFormacion()->associate($nodoTecnoParque->centro_formacion_id);
        $proyecto->lineaProgramatica()->associate(4);
        $proyecto->convocatoria()->associate($convocatoria);
        $proyecto->save();

        $tp->nodoTecnoparque()->associate($request->nodo_tecnoparque_id);

        $proyecto->participantes()->attach(
            Auth::user()->id,
            [
                'es_formulador'     => true,
                'cantidad_meses'    => $request->cantidad_meses,
                'cantidad_horas'    => $request->cantidad_horas,
                'rol_sennova'       => $request->rol_sennova,
            ]
        );

        $proyectoAReplicar = Tp::where('proyecto_base', true)->first();

        $nuevoProyectoTp = $this->replicateRow($request, $proyectoAReplicar, $proyecto);

        if ($nuevoProyectoTp) {
            return redirect()->route('convocatorias.tp.edit', [$convocatoria, $nuevoProyectoTp])->with('success', 'El recurso se ha creado correctamente.');
        } else {
            return back()->with('error', 'No hay un proyecto base generado. Por favor notifique al activador(a) de la línea.');
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Tp  $tp
     * @return \Illuminate\Http\Response
     */
    public function show(Convocatoria $convocatoria, Tp $tp)
    {
        $this->authorize('visualizar-proyecto-autor', [$tp->proyecto]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Tp  $tp
     * @return \Illuminate\Http\Response
     */
    public function edit(Convocatoria $convocatoria, Tp $tp)
    {
        $this->authorize('visualizar-proyecto-autor', [$tp->proyecto]);

        /** @var \App\Models\User */
        $authUser = Auth::user();

        $tp->load('proyecto.evaluaciones.tpEvaluacion');

        $tp->codigo_linea_programatica      = $tp->proyecto->lineaProgramatica->codigo;
        $tp->precio_proyecto                = $tp->proyecto->precioProyecto;
        $tp->proyecto->centroFormacion;
        $tp->proyecto->allowed;

        $tp->mostrar_recomendaciones        = $tp->proyecto->mostrar_recomendaciones;
        $tp->mostrar_requiere_subsanacion   = $tp->proyecto->mostrar_requiere_subsanacion;

          if ($authUser->hasRole(16)) {
            $nodosTecnoParque = SelectHelper::nodosTecnoparque()->where('regional_id', $authUser->centroFormacion->regional_id)->values()->all();
        } else {
            $nodosTecnoParque = SelectHelper::nodosTecnoparque();
        }

        return Inertia::render('Convocatorias/Proyectos/ProyectosLinea69/Edit', [
            'convocatoria'          => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria', 'min_fecha_inicio_proyectos_linea_69', 'max_fecha_finalizacion_proyectos_linea_69', 'fecha_maxima_tp', 'mostrar_recomendaciones', 'year', 'descripcion'),
            'proyectoLinea69'       => $tp,
            'regionales'            => SelectHelper::regionales(),
            'lineasProgramaticas'   => LineaProgramatica::selectRaw('id as value, concat(nombre, \' ∙ \', codigo) as label, codigo')->where('lineas_programaticas.categoria_proyecto', 1)->get(),
            'nodosTecnoparque'      => SelectHelper::nodosTecnoparque()->where('centro_formacion_id', $tp->proyecto->centroFormacion->id)->values()->all(),
            'municipios'            => Municipio::select('municipios.id as value', 'municipios.nombre as label', 'regionales.nombre as group', 'regionales.codigo')->join('regionales', 'regionales.id', 'municipios.regional_id')->get(),
            'proyectoMunicipios'    => $tp->proyecto->municipios()->select('municipios.id as value', 'municipios.nombre as label', 'regionales.nombre as group', 'regionales.codigo')->join('regionales', 'regionales.id', 'municipios.regional_id')->get(),
            'rolesSennova'          => RolSennova::select('id as value', 'nombre as label')->orderBy('nombre', 'ASC')->get(),
            'versiones'             => $tp->proyecto->PdfVersiones,
            'nodosTecnoParque'      => $nodosTecnoParque,
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Tp  $tp
     * @return \Illuminate\Http\Response
     */
    public function update(TpRequest $request, Convocatoria $convocatoria, Tp $tp)
    {
        $this->authorize('modificar-proyecto-autor', [$tp->proyecto]);
        $request->validate([

        ]);

        $tp->fecha_inicio                           = $request->fecha_inicio;
        $tp->fecha_finalizacion                     = $request->fecha_finalizacion;
        $tp->max_meses_ejecucion                    = $request->max_meses_ejecucion;
        $tp->resumen                                = $request->resumen;
        $tp->resumen_regional                       = $request->resumen_regional;
        $tp->antecedentes                           = $request->antecedentes;
        $tp->antecedentes_regional                  = $request->antecedentes_regional;
        $tp->marco_conceptual                       = $request->marco_conceptual;
        $tp->bibliografia                           = $request->bibliografia;
        $tp->impacto_municipios                     = $request->impacto_municipios;
        $tp->impacto_centro_formacion               = $request->impacto_centro_formacion;
        $tp->retos_oportunidades                    = $request->retos_oportunidades;
        $tp->pertinencia_territorio                 = $request->pertinencia_territorio;
        $tp->articulacion_agenda_competitividad     = $request->articulacion_agenda_competitividad;
        $tp->aportes_linea_ocho_conpes              = $request->aportes_linea_ocho_conpes;
        $tp->estado_ecosistema_ctel                 = $request->estado_ecosistema_ctel;
        $tp->logros_vigencia_anterior               = $request->logros_vigencia_anterior;
        $tp->nodoTecnoparque()->associate($request->nodo_tecnoparque_id);

        $tp->save();

        if ($request->hasFile('pdf_proyecto_general')) {
            $this->saveFilesSharepoint($request->pdf_proyecto_general, mb_strtoupper($convocatoria->descripcion) . ' ' . $convocatoria->year, $tp, 'pdf_proyecto_general');
        }

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }

    public function updateLongColumn(TpLongColumnRequest $request, Convocatoria $convocatoria, Tp $tp, $column)
    {
        $this->authorize('modificar-proyecto-autor', [$tp->proyecto]);

        $tp->update($request->only($column));

        return back();
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Tp  $tp
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, Convocatoria $convocatoria, Tp $tp)
    {
        // Proyecto base
        if ($tp->proyecto_base) {
            return back()->with('error', 'Este proyecto no se puede eliminar.');
        }

        $this->authorize('eliminar-proyecto-autor', [$tp->proyecto]);

        if (!Hash::check($request->password, Auth::user()->password)) {
            return back()
                ->withErrors(['password' => __('The password is incorrect.')]);
        }

        $tp->proyecto()->delete();

        return redirect()->route('convocatorias.tp.index', [$convocatoria])->with('success', 'El recurso se ha eliminado correctamente.');
    }

    /**
     *
     */
    public function replicateRow($request, $tp, $proyecto)
    {
        if ($tp) {
            $clone = $tp->replicate()->fill([
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
            $objetivosEspecificos = collect([]);
            $nuevasActividades = [];
            foreach ($tp->proyecto->causasDirectas as $causaDirecta) {
                $nuevaCausaDirecta = $clone->proyecto->causasDirectas()->create($causaDirecta->toArray());
                $nuevoObjetivoEspecifico = $nuevaCausaDirecta->objetivoEspecifico()->create($causaDirecta->objetivoEspecifico->toArray());
                $objetivosEspecificos->push($nuevoObjetivoEspecifico);

                foreach ($causaDirecta->causasIndirectas as $causaIndirecta) {
                    $nuevaCausaIndirecta = $nuevaCausaDirecta->causasIndirectas()->create($causaIndirecta->toArray());
                    $nuevaActividad = $nuevaCausaIndirecta->actividad()->create([
                        'objetivo_especifico_id'    => $nuevoObjetivoEspecifico->id,
                        'resultado_id'              => null,
                        'causa_indirecta_id'        => $nuevaCausaIndirecta->id,
                        'fecha_inicio'              => $causaIndirecta->actividad->fecha_inicio,
                        'fecha_finalizacion'        => $causaIndirecta->actividad->fecha_finalizacion,
                        'descripcion'               => $causaIndirecta->actividad->descripcion,
                    ]);

                    array_push(
                        $nuevasActividades,
                        [
                            'actividad_id'                  => $nuevaActividad->id,
                            'objetivo_especifico_id'        => $nuevaActividad->objetivo_especifico_id,
                            'resultado_antiguo'             => $causaIndirecta->actividad->resultado->descripcion,
                            'objetivo_especifico_antiguo'   => $causaIndirecta->actividad->objetivoEspecifico->numero,
                            'causa_indirecta_id'            => $nuevaActividad->causa_indirecta_id,
                            'descripcion_actividad'         => $nuevaActividad->descripcion
                        ]
                    );
                }
            }

            //re-sync everything hasMany
            $resultados = collect([]);
            foreach ($tp->proyecto->efectosDirectos as $key => $efectoDirecto) {
                $nuevoEfectoDirecto = $clone->proyecto->efectosDirectos()->create($efectoDirecto->toArray());
                if ($objetivosEspecificos->where('numero', $efectoDirecto->resultado->objetivoEspecifico->numero)->where('descripcion', $efectoDirecto->resultado->objetivoEspecifico->descripcion)->first()) {
                    $nuevoResultado = $nuevoEfectoDirecto->resultado()->create([
                        'objetivo_especifico_id'    => $objetivosEspecificos->where('numero', $efectoDirecto->resultado->objetivoEspecifico->numero)->where('descripcion', $efectoDirecto->resultado->objetivoEspecifico->descripcion)->first()->id,
                        'descripcion'               => $efectoDirecto->resultado->descripcion,
                        'trl'                       => $efectoDirecto->resultado->trl,
                    ]);
                    $resultados->push($nuevoResultado);
                }

                foreach ($efectoDirecto->resultado->productos as $producto) {
                    $nuevoProducto = $nuevoResultado->productos()->create($producto->toArray());

                    $nuevoProducto->productoTaTp()->create($producto->productoTaTp->toArray());
                }

                foreach ($efectoDirecto->efectosIndirectos as $efectoIndirecto) {
                    $nuevoEfectoIndirecto = $nuevoEfectoDirecto->efectosIndirectos()->create($efectoIndirecto->toArray());
                    $nuevoEfectoIndirecto->impacto()->create($efectoIndirecto->impacto->toArray());
                }
            }

            foreach ($nuevasActividades as $key => $actividad) {
                Actividad::where('id', $actividad['actividad_id'])->update([
                    'resultado_id' => $resultados->where('descripcion', $actividad['resultado_antiguo'])->first() ? $resultados->where('descripcion', $actividad['resultado_antiguo'])->first()->id : null
                ]);
            }

            //re-sync everything hasMany
            foreach ($tp->proyecto->analisisRiesgos as $analisisRiesgo) {
                $clone->proyecto->analisisRiesgos()->create($analisisRiesgo->toArray());
            }

            //re-sync everything belongsToMany
            foreach ($tp->proyecto->municipios as $municipio => $values) {
                $clone->proyecto->municipios()->sync($values);
            }

            //re-sync everything belongsToMany
            foreach ($tp->proyecto->municipiosAImpactar as $municipio => $values) {
                $clone->proyecto->municipiosAImpactar()->sync($values);
            }

            //re-sync everything belongsToMany
            foreach ($tp->proyecto->municipiosAImpactar as $municipio => $values) {
                $clone->proyecto->municipiosAImpactar()->sync($values);
            }

            $clone->save();

            return $clone;
        } else {
            return false;
        }
    }

    public function saveFilesSharepoint($tmpFile, $modulo, $modelo, $campoBd)
    {
        $tp             = $modelo;
        $proyecto       = Proyecto::find($tp->proyecto->id);

        $tpSharePoint   = $proyecto->centroFormacion->nombre_carpeta_sharepoint . '/' . $proyecto->lineaProgramatica->codigo . '/' . $proyecto->codigo . '/PDF Proyecto';

        $sharePointPath = "$modulo/$tpSharePoint";

        SharepointHelper::saveFilesSharepoint($tmpFile, $modelo, $sharePointPath, $campoBd);
    }

    public function downloadFileSharepoint(Convocatoria $convocatoria, Tp $tp, $tipoArchivo)
    {
        $sharePointPath = $tp[$tipoArchivo];

        return SharepointHelper::downloadFile($sharePointPath);
    }
}
