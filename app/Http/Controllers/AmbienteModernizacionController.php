<?php

namespace App\Http\Controllers;

use App\Helpers\SharepointHelper;
use App\Helpers\SelectHelper;
use App\Models\AmbienteModernizacion;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAmbienteModernizacionRequest;
use App\Http\Requests\EquipoAmbienteModernizacionRequest;
use App\Http\Requests\UpdateAmbienteModernizacionRequest;
use App\Models\CodigoProyectoSgps;
use App\Models\EquipoAmbienteModernizacion;
use App\Models\MesaSectorial;
use App\Models\RolSennova;
use App\Models\SeguimientoAmbienteModernizacion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use PDF;

class AmbienteModernizacionController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $this->authorize('viewAny', [AmbienteModernizacion::class]);

        /** @var \App\Models\User */
        $auth_user = Auth::user();

        return Inertia::render('AmbientesModernizacion/Index', [
            'ambientes_modernizacion'   => AmbienteModernizacion::select('ambientes_modernizacion.*')
                                            ->with('seguimientoAmbienteModernizacion.ambientesModernizacion', 'seguimientoAmbienteModernizacion.centroFormacion.regional', 'seguimientoAmbienteModernizacion.codigoProyectoSgps')
                                            ->join('seguimientos_ambiente_modernizacion', 'ambientes_modernizacion.seguimiento_ambiente_modernizacion_id', '=', 'seguimientos_ambiente_modernizacion.id')
                                            ->join('centros_formacion', 'seguimientos_ambiente_modernizacion.centro_formacion_id', '=', 'centros_formacion.id')
                                            ->whereHas('seguimientoAmbienteModernizacion.centroFormacion', function ($query) use ($auth_user) {
                                                if ($auth_user->directorRegional) {
                                                    $query->where('centros_formacion.regional_id', $auth_user->directorRegional->id);
                                                }

                                                if ($auth_user->hasRole([3, 4, 21, 27])) {
                                                    $centro_formacion_id = $auth_user->centro_formacion_id;
                                                    $query->where('centros_formacion.id', $centro_formacion_id);
                                                }
                                            })
                                            ->groupBy('ambientes_modernizacion.seguimiento_ambiente_modernizacion_id', 'ambientes_modernizacion.id')
                                            ->select('ambientes_modernizacion.*')
                                            ->selectRaw('MAX(ambientes_modernizacion.id) AS max_id')
                                            ->orderByDesc('max_id')
                                            ->filterAmbienteModernizacion(request()->only('search'))->paginate(),
            'codigos_sgps_faltantes'    => SelectHelper::codigoProyectoSgps()
                                            ->where('codigo', 23)
                                            ->where('centro_formacion_id', $auth_user->centro_formacion_id)
                                            ->where('codigo_proyecto_sgps_id', NULL)->values()->all(),
            'allowed_to_create'         => Gate::inspect('create', [AmbienteModernizacion::class])->allowed()
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create(Request $request)
    {
        $this->authorize('create', [AmbienteModernizacion::class]);

        $seguimiento_id = str_replace('=', '', $request->seguimiento_id);
        $ambiente_modernizacion = $seguimiento_id ? AmbienteModernizacion::where('seguimiento_ambiente_modernizacion_id', $seguimiento_id)->orderBy('created_at', 'DESC')->first() : null;
        if ($ambiente_modernizacion) {
            // Se hace el clonado y se redirige al edit
            DB::table('ambientes_modernizacion')->where('seguimiento_ambiente_modernizacion_id', $seguimiento_id)->update(['finalizado' => true]);
            $nuevo_seguimiento_ambiente = $this->replicateRow($ambiente_modernizacion);
            $nuevo_seguimiento_ambiente->update(['finalizado' => false]);
            $this->generatePdfAmbienteModernizacion($ambiente_modernizacion);

            return redirect()->route('ambientes-modernizacion.edit', $nuevo_seguimiento_ambiente)->with('success', 'Se ha generado un nuevo seguimiento.');
        }

        /** @var \App\Models\User */
        $auth_user = Auth::user();

        return Inertia::render('AmbientesModernizacion/Create', [
            'seguimiento_id'                     => $seguimiento_id,
            'centros_formacion'                  => SelectHelper::centrosFormacion(),
            'codigos_sgps'                       => CodigoProyectoSgps::selectRaw('codigos_proyectos_sgps.id as value, concat(codigos_proyectos_sgps.titulo, chr(10), \'∙ Código: SGPS-\', codigos_proyectos_sgps.codigo_sgps, chr(10), \'∙ Año: \', codigos_proyectos_sgps.year_ejecucion) as label')->leftJoin('seguimientos_ambiente_modernizacion', 'codigos_proyectos_sgps.id', 'seguimientos_ambiente_modernizacion.codigo_proyecto_sgps_id')
                                                    ->join('lineas_programaticas', 'codigos_proyectos_sgps.linea_programatica_id', 'lineas_programaticas.id')
                                                    ->where('lineas_programaticas.codigo', 23)
                                                    ->where('codigos_proyectos_sgps.centro_formacion_id', $auth_user->centro_formacion_id)
                                                    ->where('seguimientos_ambiente_modernizacion.codigo_proyecto_sgps_id', NULL)
                                                    ->get(),
            'mesas_sectoriales'                  => MesaSectorial::select('id', 'nombre')->get('id'),
            'tipologias_ambientes'               => SelectHelper::tipologiasAmbiente(),
            'disciplinas_subarea_conocimiento'   => SelectHelper::disciplinasSubareaConocimiento(),
            'redes_conocimiento'                 => SelectHelper::redesConocimiento(),
            'actividades_economicas'             => SelectHelper::actividadesEconomicas(),
            'lineas_investigacion'               => SelectHelper::lineasInvestigacion(),
            'tematicas_estrategicas'             => SelectHelper::tematicasEstrategicas(),
            'allowed_to_create'                  => Gate::inspect('create', [AmbienteModernizacion::class])->allowed()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreAmbienteModernizacionRequest $request)
    {
        $this->authorize('create', [AmbienteModernizacion::class]);

        /** @var \App\Models\User */
        $auth_user = Auth::user();

        $codigo_proyecto_sgps = CodigoProyectoSgps::find($request->codigo_proyecto_sgps_id);

        $seguimiento_ambiente_modernizacion = new SeguimientoAmbienteModernizacion();

        $seguimiento_ambiente_modernizacion->centroFormacion()->associate($codigo_proyecto_sgps->centro_formacion_id);
        $seguimiento_ambiente_modernizacion->codigoProyectoSgps()->associate($request->codigo_proyecto_sgps_id);

        $seguimiento_ambiente_modernizacion->save();

        $ambiente_modernizacion = new AmbienteModernizacion();
        $ambiente_modernizacion->nombre_ambiente                     = $request->nombre_ambiente;
        $ambiente_modernizacion->alineado_mesas_sectoriales          = $request->alineado_mesas_sectoriales;
        $ambiente_modernizacion->financiado_anteriormente            = $request->financiado_anteriormente;

        $ambiente_modernizacion->redConocimiento()->associate($request->red_conocimiento_id);
        $ambiente_modernizacion->lineaInvestigacion()->associate($request->linea_investigacion_id);
        $ambiente_modernizacion->disciplinaSubareaConocimiento()->associate($request->disciplina_subarea_conocimiento_id);
        $ambiente_modernizacion->tematicaEstrategica()->associate($request->tematica_estrategica_id);
        $ambiente_modernizacion->tipologiaAmbiente()->associate($request->tipologia_ambiente_id);
        $ambiente_modernizacion->actividadEconomica()->associate($request->actividad_economica_id);
        $ambiente_modernizacion->dinamizadorSennova()->associate($auth_user->id);
        $ambiente_modernizacion->seguimientoAmbienteModernizacion()->associate($seguimiento_ambiente_modernizacion->id);

        if ($ambiente_modernizacion->save()) {
            $ambiente_modernizacion->mesasSectoriales()->sync($request->mesa_sectorial_id);
        }

        return back()->with('success', 'El recurso se ha creado correctamente.');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\AmbienteModernizacion  $ambiente_modernizacion
     * @return \Illuminate\Http\Response
     */
    public function show(AmbienteModernizacion $ambiente_modernizacion)
    {
        $this->authorize('view', [AmbienteModernizacion::class, $ambiente_modernizacion]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\AmbienteModernizacion  $ambiente_modernizacion
     * @return \Illuminate\Http\Response
     */
    public function edit(AmbienteModernizacion $ambiente_modernizacion)
    {
        $this->authorize('update', [AmbienteModernizacion::class, $ambiente_modernizacion]);

        $ambiente_modernizacion->seguimientoAmbienteModernizacion;
        $ambiente_modernizacion->seguimientoAmbienteModernizacion->codigoProyectoSgps;
        $ambiente_modernizacion->disciplinaSubareaConocimiento->subareaConocimiento->areaConocimiento;
        $ambiente_modernizacion->seguimientoAmbienteModernizacion->centroFormacion->regional;
        $ambiente_modernizacion->programasFormacion;
        $ambiente_modernizacion->mesasSectoriales;
        $ambiente_modernizacion->codigosProyectosSgps;
        $ambiente_modernizacion->semillerosInvestigacion;

        /** @var \App\Models\User */
        $auth_user = Auth::user();

        return Inertia::render('AmbientesModernizacion/Edit', [
            'centros_formacion'                             =>  SelectHelper::centrosFormacion(),
            'ambiente_modernizacion'                        =>  $ambiente_modernizacion,
            'codigos_sgps'                                  =>  CodigoProyectoSgps::selectRaw('codigos_proyectos_sgps.id as value, CONCAT(codigos_proyectos_sgps.titulo, chr(10), \'∙ Código: SGPS-\', codigos_proyectos_sgps.codigo_sgps, chr(10), \'∙ Año: \', codigos_proyectos_sgps.year_ejecucion) as label')
                                                                    ->leftJoin('seguimientos_ambiente_modernizacion', 'codigos_proyectos_sgps.id', 'seguimientos_ambiente_modernizacion.codigo_proyecto_sgps_id')
                                                                    ->join('lineas_programaticas', 'codigos_proyectos_sgps.linea_programatica_id', 'lineas_programaticas.id')
                                                                    ->where(function ($query) use ($auth_user) {
                                                                        $query->where('lineas_programaticas.codigo', 23);
                                                                        if ($auth_user->hasRole([4])) {
                                                                            $query->where('codigos_proyectos_sgps.centro_formacion_id', $auth_user->centro_formacion_id);
                                                                        }
                                                                        $query->where('seguimientos_ambiente_modernizacion.codigo_proyecto_sgps_id', NULL);
                                                                    })
                                                                    ->get(),
            'tipologias_ambientes'                          =>  SelectHelper::tipologiasAmbiente(),
            'disciplinas_subarea_conocimiento'              =>  SelectHelper::disciplinasSubareaConocimiento(),
            'redes_conocimiento'                            =>  SelectHelper::redesConocimiento(),
            'actividades_economicas'                        =>  SelectHelper::actividadesEconomicas(),
            'lineas_investigacion'                          =>  SelectHelper::lineasInvestigacion(),
            'tematicas_estrategicas'                        =>  SelectHelper::tematicasEstrategicas(),
            'mesas_sectoriales'                             =>  SelectHelper::mesasSectoriales(),
            'semilleros_investigacion'                      =>  SelectHelper::semillerosInvestigacion(),
            'programas_formacion_con_registro'              =>  SelectHelper::programasFormacion()->where('registro_calificado', true)->values()->all(),
            'programas_formacion_sin_registro'              =>  SelectHelper::programasFormacion()->where('registro_calificado', false)->values()->all(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\AmbienteModernizacion  $ambiente_modernizacion
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateAmbienteModernizacionRequest $request, AmbienteModernizacion $ambiente_modernizacion)
    {
        $this->authorize('update', [AmbienteModernizacion::class, $ambiente_modernizacion]);

        $ambiente_modernizacion->update($request->validated());

        if ($ambiente_modernizacion->save()) {
            $ambiente_modernizacion->seguimientoAmbienteModernizacion()->update(['codigo_proyecto_sgps_id' => $request->codigo_proyecto_sgps_id]);

            $request->alineado_mesas_sectoriales    == 1 ? $ambiente_modernizacion->mesasSectoriales()->sync($request->mesa_sectorial_id) : $ambiente_modernizacion->mesasSectoriales()->detach();
            $request->financiado_anteriormente      == 1 ? $ambiente_modernizacion->codigosProyectosSgps()->sync($request->codigos_proyectos_id) : $ambiente_modernizacion->codigosProyectosSgps()->detach();
            $request->ambiente_activo               == 1 ? $ambiente_modernizacion->programasFormacion()->sync(array_merge($request->programas_formacion_calificados ? $request->programas_formacion_calificados : [], $request->programas_formacion ? $request->programas_formacion : [])) : null;
            $request->ambiente_activo_procesos_idi  == 1 ? $ambiente_modernizacion->semillerosInvestigacion()->sync($request->semilleros_investigacion_id) : $ambiente_modernizacion->semillerosInvestigacion()->detach();
        }

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\AmbienteModernizacion  $ambiente_modernizacion
     * @return \Illuminate\Http\Response
     */
    public function destroy(AmbienteModernizacion $ambiente_modernizacion)
    {
        $this->authorize('delete', [AmbienteModernizacion::class, $ambiente_modernizacion]);

        $ambiente_modernizacion->delete();

        return redirect()->route('ambientes-modernizacion.index')->with('success', 'El recurso se ha eliminado correctamente.');
    }

    /**
     * download
     *
     * @param  mixed $ambiente_modernizacion
     * @return void
     */
    public function download(AmbienteModernizacion $ambiente_modernizacion)
    {
        $this->authorize('update', $ambiente_modernizacion);

        $path = $ambiente_modernizacion->soporte_fotos_ambiente;

        return response()->download(storage_path("app/$path"));
    }

    public function listaEquipos(AmbienteModernizacion $ambiente_modernizacion)
    {
        $this->authorize('viewAny', [AmbienteModernizacion::class]);

        $ambiente_modernizacion->seguimientoAmbienteModernizacion->codigoProyectoSgps;

        return Inertia::render('AmbientesModernizacion/Equipos/Index', [
            'ambiente_modernizacion'            => $ambiente_modernizacion,
            'equipos_ambiente_modernizacion'    => $ambiente_modernizacion->equiposAmbienteModernizacion,
            'equipos_ambiente_modernizacion'    => EquipoAmbienteModernizacion::where('ambiente_modernizacion_id', $ambiente_modernizacion->id)->get(),
            'roles_sennova'                     => RolSennova::select('id as value', 'nombre as label')->orderBy('nombre', 'ASC')->get(),
        ]);
    }

    public function updateCreateEquipo(EquipoAmbienteModernizacionRequest $request, AmbienteModernizacion $ambiente_modernizacion)
    {
        $message = '';

        if ($request->filled('id')) {
            $equipoAmbienteModernizacion = EquipoAmbienteModernizacion::find($request->id);
            $equipoAmbienteModernizacion->update($request->validated());

            $message = 'El recurso se ha modificado correctamente.';
        } else {
            $equipoAmbienteModernizacion = EquipoAmbienteModernizacion::create($request->validated());

            $message = 'El recurso se ha creado correctamente.';
        }

        return back()->with('success', $message);
    }

    public function destroyEquipo(EquipoAmbienteModernizacion $equipoAmbienteModernizacion)
    {
        $this->authorize('delete', [EquipoAmbienteModernizacion::class, $equipoAmbienteModernizacion]);

        $equipoAmbienteModernizacion->delete();

        return back()->with('success', 'El recurso se ha eliminado correctamente.');
    }

    /**
     *
     */
    public function replicateRow($ambiente_modernizacion)
    {
        $clone = $ambiente_modernizacion->replicate();
        $clone->push();

        //load relations on EXISTING MODEL
        $ambiente_modernizacion->load(
            'mesasSectoriales',
            'codigosProyectosSgps',
            'programasFormacion',
            'semillerosInvestigacion'
        );

        //re-sync everything
        foreach ($ambiente_modernizacion->getRelations() as $relationName => $values) {
            if ($relationName != 'equiposAmbienteModernizacion') {
                $clone->{$relationName}()->sync($values);
            }
        }

        foreach ($ambiente_modernizacion->equiposAmbienteModernizacion as $equipo) {
            $clone->equiposAmbienteModernizacion()->create($equipo->toArray());
        }

        $clone->save();

        return $clone;
    }

    /**
     * generatePdfAmbienteModernizacion
     *
     * @param  mixed $proyecto
     * @return void
     */
    function generatePdfAmbienteModernizacion(AmbienteModernizacion $ambiente_modernizacion)
    {
        ini_set('max_execution_time', 0);
        ini_set('memory_limit', -1);

        $pdf = PDF::loadView('AmbienteModernizacionPdf', [
            'ambienteModernizacion' => $ambiente_modernizacion,
        ]);

        // return $pdf->stream("dompdf_out.pdf", array("Attachment" => false));

        $output = $pdf->setWarnings(false)->output();
        $random    = Str::random(10);
        $fileName = $ambiente_modernizacion->seguimientoAmbienteModernizacion->codigo . $random;
        $path = 'ambientes-modernizacion/' . $fileName . '.pdf';
        Storage::put($path, $output);

        $ambiente_modernizacion->update(['pdf_path' => $path]);
    }

    /**
     * descargarPdfAmbienteModernizacion
     *
     * @param  mixed $ambiente_modernizacion
     * @return void
     */
    function descargarPdfAmbienteModernizacion(AmbienteModernizacion $ambiente_modernizacion)
    {
        return Storage::download($ambiente_modernizacion->pdf_path);
    }

    public function updateLongColumn(Request $request, AmbienteModernizacion $ambiente_modernizacion, $column)
    {
        try {
            $ambiente_modernizacion->update($request->only($column));
            return back();
        } catch (\Throwable $th) {
            Log::debug($th);
        }
    }

    public function saveFilesSharepoint(Request $request, AmbienteModernizacion $ambiente_modernizacion)
    {
        $request->validate([
            'soporte_fotos_ambiente' => 'nullable|file|max:10240',
        ]);

        $response = [];

        if ($request->hasFile('soporte_fotos_ambiente')) {
            $response = SharepointHelper::saveFilesSharepoint($request, 'soporte_fotos_ambiente', $ambiente_modernizacion, $ambiente_modernizacion->id . 'soporte_fotos_ambiente');
        }

        if (count($response) > 0 && $response['success']) {
            return back()->with('success', 'Los archivos se han cargado correctamente');
        } else if (count($response) > 0 && $response['success'] == false) {
            return back()->with('error', 'No se han podido cargar los archivos. Por favor vuelva a intentar');
        }
    }

    public function downloadServerFile(Request $request, AmbienteModernizacion $ambiente_modernizacion)
    {
        SharepointHelper::downloadServerFile($ambiente_modernizacion, $request->formato);
    }

    public function downloadFileSharepoint(AmbienteModernizacion $ambiente_modernizacion, $tipo_archivo)
    {
        $sharepoint_path = $ambiente_modernizacion[$tipo_archivo];

        return SharepointHelper::downloadFile($sharepoint_path);
    }
}
