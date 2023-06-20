<?php

namespace App\Http\Controllers;

use App\Helpers\SharepointHelper;
use App\Helpers\SelectHelper;
use App\Models\Convocatoria;
use App\Models\Proyecto;
use App\Models\Ta;
use App\Models\TecnoAcademia;
use App\Http\Controllers\Controller;
use App\Http\Requests\TaLongColumnRequest;
use App\Http\Requests\TaRequest;
use App\Models\Actividad;
use App\Models\AulaMovil;
use App\Models\Evaluacion\Evaluacion;
use App\Models\Evaluacion\TaEvaluacion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class TaController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Convocatoria $convocatoria)
    {
        return Inertia::render('Convocatorias/Proyectos/Ta/Index', [
            'convocatoria'      => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria', 'tipo_convocatoria'),
            'filters'           => request()->all('search', 'estructuracion_proyectos'),
            'proyectosTa'       => Ta::getProyectosPorRol($convocatoria)->appends(['search' => request()->search, 'estructuracion_proyectos' => request()->estructuracion_proyectos]),
            'allowedToCreate'   => Gate::inspect('formular-proyecto', [5, $convocatoria])->allowed()
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create(Convocatoria $convocatoria)
    {
        $this->authorize('formular-proyecto', [5, $convocatoria]);

        /** @var \App\Models\User */
        $authUser = Auth::user();

        if ($authUser->hasRole([10, 12])) {
            $tecnoacademias = SelectHelper::tecnoacademias()->where('regional_id', $authUser->centroFormacion->regional->id)->values()->all();
        } else {
            $tecnoacademias = SelectHelper::tecnoacademias();
        }

        return Inertia::render('Convocatorias/Proyectos/Ta/Create', [
            'convocatoria'          => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria', 'min_fecha_inicio_proyectos_linea_70', 'max_fecha_finalizacion_proyectos_linea_70', 'fecha_maxima_ta'),
            'tecnoacademias'        => $tecnoacademias,
            'lineasTecnoacademia'   => SelectHelper::lineasTecnoacademia(),
            'allowedToCreate'       => Gate::inspect('formular-proyecto', [5, $convocatoria])->allowed()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(TaRequest $request, Convocatoria $convocatoria, Proyecto $proyecto)
    {
        $this->authorize('formular-proyecto', [5, $convocatoria]);

        $tecnoAcademia = TecnoAcademia::find($request->tecnoacademia_id['value']);

        $proyecto = new Proyecto();
        $proyecto->arboles_completos = true;
        $proyecto->centroFormacion()->associate($tecnoAcademia->centro_formacion_id);
        $proyecto->lineaProgramatica()->associate(5);
        $proyecto->convocatoria()->associate($convocatoria);
        $proyecto->save();

        $proyecto->tecnoacademiaLineasTecnoacademia()->sync($request->tecnoacademia_linea_tecnoacademia_id);

        $proyecto->participantes()->attach(
            Auth::user()->id,
            [
                'es_formulador'     => true,
                'cantidad_meses'    => $request->max_meses_ejecucion,
                'cantidad_horas'    => 48,
                'rol_sennova'       => 3,
            ]
        );

        $proyectoAReplicar = Ta::where('proyecto_base', true)->first();

        $nuevoProyectoTa = $this->replicateRow($request, $proyectoAReplicar, $proyecto);

        if ($nuevoProyectoTa) {
            return redirect()->route('convocatorias.ta.edit', [$convocatoria, $nuevoProyectoTa])->with('success', 'El recurso se ha creado correctamente.');
        } else {
            return back()->with('error', 'No hay un proyecto base generado. Por favor notifique al activador(a) de la línea.');
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Ta  $ta
     * @return \Illuminate\Http\Response
     */
    public function show(Convocatoria $convocatoria, Ta $ta)
    {
        $this->authorize('visualizar-proyecto-autor', [$ta->proyecto]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Ta  $ta
     * @return \Illuminate\Http\Response
     */
    public function edit(Convocatoria $convocatoria, Ta $ta)
    {
        $this->authorize('visualizar-proyecto-autor', [$ta->proyecto]);

        /** @var \App\Models\User */
        $authUser = Auth::user();

        $ta->load('proyecto.evaluaciones.taEvaluacion');

        $ta->codigo_linea_programatica = $ta->proyecto->lineaProgramatica->codigo;
        $ta->precio_proyecto           = $ta->proyecto->precioProyecto;
        $ta->proyecto->centroFormacion;

        $ta->mostrar_recomendaciones        = $ta->proyecto->mostrar_recomendaciones;
        $ta->mostrar_requiere_subsanacion   = $ta->proyecto->mostrar_requiere_subsanacion;

        if ($authUser->hasRole(12) || $authUser->hasRole(5)) {
            $tecnoacademias = SelectHelper::tecnoacademias()->where('tecnoacademias.centro_formacion_id', $authUser->centroFormacion->id)->values()->all();
        } else {
            $tecnoacademias = SelectHelper::tecnoacademias();
        }

        return Inertia::render('Convocatorias/Proyectos/Ta/Edit', [
            'convocatoria'                          => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'year', 'tipo_convocatoria', 'min_fecha_inicio_proyectos_linea_70', 'max_fecha_finalizacion_proyectos_linea_70', 'fecha_maxima_ta', 'mostrar_recomendaciones', 'descripcion'),
            'ta'                                    => $ta,
            'tecnoacademiaRelacionada'              => $ta->proyecto->tecnoacademiaLineasTecnoacademia()->first() ? $ta->proyecto->tecnoacademiaLineasTecnoacademia()->first()->tecnoacademia : null,
            'lineasTecnoacademiaRelacionadas'       => $ta->proyecto->tecnoacademiaLineasTecnoacademia()->select('tecnoacademia_linea_tecnoacademia.id as value', 'lineas_tecnoacademia.nombre')->join('lineas_tecnoacademia', 'tecnoacademia_linea_tecnoacademia.linea_tecnoacademia_id', 'lineas_tecnoacademia.id')->get(),
            'lineasProgramaticas'                   => SelectHelper::lineasProgramaticas(),
            'lineasTecnoacademia'                   => SelectHelper::lineasTecnoacademia(),
            'tecnoacademias'                        => $tecnoacademias,
            'versiones'                             => $ta->proyecto->PdfVersiones,
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Ta  $ta
     * @return \Illuminate\Http\Response
     */
    public function update(TaRequest $request, Convocatoria $convocatoria, Ta $ta)
    {
        $this->authorize('modificar-proyecto-autor', [$ta->proyecto]);

        $ta->fecha_inicio                           = $request->fecha_inicio;
        $ta->fecha_finalizacion                     = $request->fecha_finalizacion;
        $ta->max_meses_ejecucion                    = $request->max_meses_ejecucion;

        $ta->logros_vigencia_anterior               = $request->logros_vigencia_anterior;
        $ta->resumen                                = $request->resumen;
        $ta->resumen_regional                       = $request->resumen_regional;
        $ta->antecedentes                           = $request->antecedentes;
        $ta->antecedentes_tecnoacademia             = $request->antecedentes_tecnoacademia;
        $ta->justificacion_problema                 = $request->justificacion_problema;
        $ta->marco_conceptual                       = $request->marco_conceptual;
        $ta->bibliografia                           = $request->bibliografia;
        $ta->pertinencia_territorio                 = $request->pertinencia_territorio;
        $ta->retos_oportunidades                    = $request->retos_oportunidades;
        $ta->lineas_tecnologicas_centro             = $request->lineas_tecnologicas_centro;
        $ta->logros_vigencia_anterior               = $request->logros_vigencia_anterior;
        $ta->proyecto->tecnoacademiaLineasTecnoacademia()->sync($request->tecnoacademia_linea_tecnoacademia_id);

        if ($request->hasFile('pdf_proyecto_general')) {
            $this->savePdfSharepoint($request, $ta);
        }
        $ta->save();

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }

    public function updateLongColumn(TaLongColumnRequest $request, Convocatoria $convocatoria, Ta $ta, $column)
    {
        $this->authorize('modificar-proyecto-autor', [$ta->proyecto]);

        $ta->update($request->only($column));

        return back();
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Ta  $ta
     * @return \Illuminate\Http\Response
     */
    public function updateInfraestructura(Request $request, Convocatoria $convocatoria, Proyecto $proyecto)
    {
        $this->authorize('modificar-proyecto-autor', [$proyecto]);

        $proyecto->ta()->update([
            'infraestructura_tecnoacademia' => $request->infraestructura_tecnoacademia['value']
        ]);

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Ta  $ta
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, Convocatoria $convocatoria, Ta $ta)
    {
        if ($ta->proyecto_base) {
            return back()->with('error', 'Este proyecto no se puede eliminar.');
        }

        $this->authorize('eliminar-proyecto-autor', [$ta->proyecto]);

        if (!Hash::check($request->password, Auth::user()->password)) {
            return back()
                ->withErrors(['password' => __('The password is incorrect.')]);
        }

        $ta->proyecto()->delete();

        return redirect()->route('convocatorias.ta.index', [$convocatoria])->with('success', 'El recurso se ha eliminado correctamente.');
    }

    /**
     * updateCantidadRolesTa
     *
     * @param  mixed $request
     * @param  mixed $convocatoria
     * @param  mixed $proyecto
     * @return void
     */
    public function updateCantidadRolesTa(Request $request, Convocatoria $convocatoria, Proyecto $proyecto)
    {
        $this->authorize('modificar-proyecto-autor', [$proyecto]);

        $request->validate([
            'cantidad_instructores_planta'    => 'required|integer|min:0|max:32767',
            'cantidad_dinamizadores_planta'   => 'required|integer|min:0|max:32767',
            'cantidad_psicopedagogos_planta'  => 'required|integer|min:0|max:32767'
        ]);

        $proyecto->ta()->update([
            'cantidad_instructores_planta'   => $request->cantidad_instructores_planta,
            'cantidad_dinamizadores_planta'  => $request->cantidad_dinamizadores_planta,
            'cantidad_psicopedagogos_planta' => $request->cantidad_psicopedagogos_planta
        ]);

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }

    public function aulaMovilStore(Request $request, Convocatoria $convocatoria, Ta $ta)
    {
        $message = '';

        if ($request->id) {
            $aulaMovil = AulaMovil::find($request->id);

            $aulaMovil->placa                           = $request->placa;
            $aulaMovil->modelo                          = $request->modelo;
            $aulaMovil->logros_vigencia                 = $request->logros_vigencia;
            $aulaMovil->numero_municipios_visitados     = $request->numero_municipios_visitados;
            $aulaMovil->numero_aprendices_beneficiados  = $request->numero_aprendices_beneficiados;
            $aulaMovil->estado                          = $request->estado;
            $aulaMovil->modulos_interactivos            = $request->modulos_interactivos;
            $aulaMovil->acciones_a_desarrollar          = $request->acciones_a_desarrollar;
            $aulaMovil->numero_aprendices_a_beneficiar  = $request->numero_aprendices_a_beneficiar;
            $aulaMovil->recursos_mantenimiento          = $request->recursos_mantenimiento;

            $aulaMovil->save();

            if ($aulaMovil->save()) {
                if ($request->hasFile('soat')) {
                    $this->saveFilesSharepoint($request, $convocatoria, $ta, $aulaMovil);
                }

                if ($request->hasFile('tecnicomecanica')) {
                    $this->saveFilesSharepoint($request, $convocatoria, $ta, $aulaMovil);
                }
            }

            $message = 'El recurso se ha modificado correctamente.';
        } else {
            $aulaMovil = new AulaMovil();
            $aulaMovil->placa                           = $request->placa;
            $aulaMovil->modelo                          = $request->modelo;
            $aulaMovil->logros_vigencia                 = $request->logros_vigencia;
            $aulaMovil->numero_municipios_visitados     = $request->numero_municipios_visitados;
            $aulaMovil->numero_aprendices_beneficiados  = $request->numero_aprendices_beneficiados;
            $aulaMovil->estado                          = $request->estado;
            $aulaMovil->modulos_interactivos            = $request->modulos_interactivos;
            $aulaMovil->acciones_a_desarrollar          = $request->acciones_a_desarrollar;
            $aulaMovil->numero_aprendices_a_beneficiar  = $request->numero_aprendices_a_beneficiar;
            $aulaMovil->recursos_mantenimiento          = $request->recursos_mantenimiento;
            $aulaMovil->ta()->associate($ta);

            $aulaMovil->save();

            if ($aulaMovil->save()) {
                if ($request->hasFile('soat')) {
                    $this->saveFilesSharepoint($request, $convocatoria, $ta, $aulaMovil);
                }

                if ($request->hasFile('tecnicomecanica')) {
                    $this->saveFilesSharepoint($request, $convocatoria, $ta, $aulaMovil);
                }
            }

            $message = 'El recurso se ha creado correctamente.';
        }

        return back()->with('success', $message);
    }

    public function saveFilesSharepoint(Request $request, Convocatoria $convocatoria, Ta $ta, AulaMovil $aulaMovil)
    {
        $request->validate([
            'soat'              => 'nullable|file|max:10240|mimetypes:application/pdf',
            'tecnicomecanica'   => 'nullable|file|max:10240|mimetypes:application/pdf',
        ]);

        $response = [];

        if ($request->hasFile('soat')) {
            $aulaMovil->ruta_final_sharepoint = $ta->proyecto->centroFormacion->nombre_carpeta_sharepoint . '/' . $ta->proyecto->lineaProgramatica->codigo . '/' . $ta->proyecto->codigo . '/AULAS MOVILES';

            $response = SharepointHelper::saveFilesSharepoint($request, 'soat', $aulaMovil, $aulaMovil->id . 'soat');
            AulaMovil::where('id', $aulaMovil->id)->update(['soat' => $response['sharePointPath']]);
        }

        if ($request->hasFile('tecnicomecanica')) {
            $aulaMovil->ruta_final_sharepoint = $ta->proyecto->centroFormacion->nombre_carpeta_sharepoint . '/' . $ta->proyecto->lineaProgramatica->codigo . '/' . $ta->proyecto->codigo . '/AULAS MOVILES';

            $response = SharepointHelper::saveFilesSharepoint($request, 'tecnicomecanica', $aulaMovil, $aulaMovil->id . 'tecnicomecanica');
            AulaMovil::where('id', $aulaMovil->id)->update(['tecnicomecanica' => $response['sharePointPath']]);
        }

        if (count($response) > 0 && $response['success']) {
            return back()->with('success', 'Los archivos se han cargado correctamente');
        } else if (count($response) > 0 && $response['success'] == false) {
            return back()->with('error', 'No se han podido cargar los archivos. Por favor vuelva a intentar');
        }
    }

    public function downloadFileSharepoint(Convocatoria $convocatoria, Ta $ta, AulaMovil $aulaMovil, $tipoArchivo)
    {
        $aulaMovil->ruta_final_sharepoint = $ta->proyecto->centroFormacion->nombre_carpeta_sharepoint . '/' . $ta->proyecto->lineaProgramatica->codigo . '/' . $ta->proyecto->codigo . '/AULAS MOVILES';

        SharepointHelper::downloadFileSharepoint($aulaMovil, $tipoArchivo);
    }

    public function destroyAulaMovil(Convocatoria $convocatoria, Ta $ta, AulaMovil $aulaMovil)
    {
        $this->authorize('modificar-proyecto-autor', [$ta->proyecto]);

        $aulaMovil->delete();

        return back()->with('success', 'El recurso se ha eliminado correctamente.');
    }

    /**
     *
     */
    public function replicateRow($request, $ta, $proyecto)
    {
        if ($ta) {
            $clone = $ta->replicate()->fill([
                'id'                    => $proyecto->id,
                'fecha_inicio'          => $request->fecha_inicio,
                'fecha_finalizacion'    => $request->fecha_finalizacion,
                'max_meses_ejecucion'   => $request->max_meses_ejecucion,
                'proyecto_base'         => false
            ]);
            $clone->push();

            //load relations on EXISTING MODEL
            $ta->load(
                'tematicasEstrategicas',
                'disciplinasSubareaConocimiento',
                'redesConocimiento',
                'actividadesEconomicas'
            );

            //re-sync everything hasMany
            foreach ($ta->edt as $edt) {
                $clone->edt()->create($edt->toArray());
            }

            //re-sync everything hasMany
            $objetivosEspecificos = collect([]);
            $nuevasActividades = [];
            foreach ($ta->proyecto->causasDirectas as $causaDirecta) {
                $nuevaCausaDirecta = $clone->proyecto->causasDirectas()->create($causaDirecta->toArray());
                $nuevoObjetivoEspecifico = $nuevaCausaDirecta->objetivoEspecifico()->create($causaDirecta->objetivoEspecifico->toArray());
                $objetivosEspecificos->push($nuevoObjetivoEspecifico);

                foreach ($causaDirecta->causasIndirectas as $key => $causaIndirecta) {
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
            foreach ($ta->proyecto->efectosDirectos as $key => $efectoDirecto) {
                $nuevoEfectoDirecto = $clone->proyecto->efectosDirectos()->create($efectoDirecto->toArray());
                $nuevoResultado = $nuevoEfectoDirecto->resultado()->create([
                    'objetivo_especifico_id'    => $objetivosEspecificos->where('numero', $efectoDirecto->resultado->objetivoEspecifico->numero)->where('descripcion', $efectoDirecto->resultado->objetivoEspecifico->descripcion)->first()->id,
                    'descripcion'               => $efectoDirecto->resultado->descripcion,
                    'trl'                       => $efectoDirecto->resultado->trl,
                ]);
                $resultados->push($nuevoResultado);

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
            foreach ($ta->proyecto->analisisRiesgos as $analisisRiesgo) {
                $clone->proyecto->analisisRiesgos()->create($analisisRiesgo->toArray());
            }

            //re-sync everything belongsToMany
            foreach ($ta->getRelations() as $relationName => $values) {
                if ($relationName != 'edt' && $relationName != 'proyecto') {
                    $clone->{$relationName}()->sync($values);
                }
            }

            //re-sync everything belongsToMany
            foreach ($ta->proyecto->municipios as $municipio => $values) {
                $clone->proyecto->municipios()->sync($values);
            }

            //re-sync everything belongsToMany
            foreach ($ta->proyecto->municipiosAImpactar as $municipio => $values) {
                $clone->proyecto->municipiosAImpactar()->sync($values);
            }

            //re-sync everything belongsToMany
            foreach ($ta->proyecto->municipiosAImpactar as $municipio => $values) {
                $clone->proyecto->municipiosAImpactar()->sync($values);
            }

            //re-sync everything belongsToMany
            foreach ($ta->proyecto->disenosCurriculares as $disenoCurricular => $values) {
                $clone->proyecto->disenosCurriculares()->sync($values);
            }

            //re-sync everything belongsToMany
            foreach ($ta->proyecto->taProgramasFormacion as $programaFormacion => $values) {
                $clone->proyecto->taProgramasFormacion()->sync($values);
            }

            $clone->save();

            return $clone;
        } else {
            return false;
        }
    }

    public function savePdfSharepoint(Request $request, Ta $ta)
    {
        $request->validate([
            'pdf_proyecto_general' => 'nullable|file|max:10240',
        ]);

        $response = [];

        if ($request->hasFile('pdf_proyecto_general')) {
            $ta->ruta_final_sharepoint = $ta->proyecto->centroFormacion->nombre_carpeta_sharepoint . '/' . $ta->proyecto->lineaProgramatica->codigo . '/' . $ta->proyecto->codigo . '/PDF Proyecto';

            $response = SharepointHelper::saveFilesSharepoint($request, 'pdf_proyecto_general', $ta, $ta->id . 'pdf_proyecto_general');
        }

        if (count($response) > 0 && $response['success']) {
            return back()->with('success', 'Los archivos se han cargado correctamente');
        } else if (count($response) > 0 && $response['success'] == false) {
            return back()->with('error', 'No se han podido cargar los archivos. Por favor vuelva a intentar');
        }
    }

    public function downloadPdfSharepoint(Convocatoria $convocatoria, Ta $ta, $tipoArchivo)
    {
        $ta->ruta_final_sharepoint = $ta->proyecto->centroFormacion->nombre_carpeta_sharepoint . '/' . $ta->proyecto->lineaProgramatica->codigo . '/' . $ta->proyecto->codigo . '/PDF Proyecto';

        SharepointHelper::downloadFileSharepoint($ta, $tipoArchivo);
    }
}
