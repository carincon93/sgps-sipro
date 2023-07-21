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
        $authUser = Auth::user();

        return Inertia::render('AmbientesModernizacion/Index', [
            'filters'                   => request()->all('search'),
            'ambientesModernizacion'    => AmbienteModernizacion::select('ambientes_modernizacion.*')->distinct('ambientes_modernizacion.seguimiento_ambiente_modernizacion_id')
                ->with('seguimientoAmbienteModernizacion.ambientesModernizacion', 'seguimientoAmbienteModernizacion.centroFormacion.regional', 'seguimientoAmbienteModernizacion.codigoProyectoSgps')
                ->join('seguimientos_ambiente_modernizacion', 'ambientes_modernizacion.seguimiento_ambiente_modernizacion_id', 'seguimientos_ambiente_modernizacion.id')
                ->join('centros_formacion', 'seguimientos_ambiente_modernizacion.centro_formacion_id', 'centros_formacion.id')
                ->whereHas(
                    'seguimientoAmbienteModernizacion.centroFormacion',
                    function ($query) use ($authUser) {
                        if ($authUser->directorRegional) {
                            $query->where('centros_formacion.regional_id', $authUser->directorRegional->id);
                        }

                        if ($authUser->hasRole([3, 4, 21, 27])) {
                            $centroFormacionId = $authUser->centro_formacion_id;
                            $query->where('centros_formacion.id', $centroFormacionId);
                        }
                    }
                )
                ->orderBy('seguimiento_ambiente_modernizacion_id', 'ASC')
                ->filterAmbienteModernizacion(request()->only('search'))->paginate(),
            'codigosSgpsFaltantes'      => SelectHelper::codigoProyectoSgps()
                ->where('codigo', 23)
                ->where('centro_formacion_id', $authUser->centro_formacion_id)
                ->where('codigo_proyecto_sgps_id', NULL)->values()->all(),
            'allowedToCreate'           => Gate::inspect('create', [AmbienteModernizacion::class])->allowed()
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

        $seguimientoId = str_replace('=', '', $request->seguimiento_id);
        $ambienteModernizacion = $seguimientoId ? AmbienteModernizacion::where('seguimiento_ambiente_modernizacion_id', $seguimientoId)->orderBy('created_at', 'DESC')->first() : null;
        if ($ambienteModernizacion) {
            // Se hace el clonado y se redirige al edit
            DB::table('ambientes_modernizacion')->where('seguimiento_ambiente_modernizacion_id', $seguimientoId)->update(['finalizado' => true]);
            $nuevoSeguimientoAmbiente = $this->replicateRow($ambienteModernizacion);
            $nuevoSeguimientoAmbiente->update(['finalizado' => false]);
            $this->generatePdfAmbienteModernizacion($ambienteModernizacion);

            return redirect()->route('ambientes-modernizacion.edit', $nuevoSeguimientoAmbiente)->with('success', 'Se ha generado un nuevo seguimiento.');
        }

        /** @var \App\Models\User */
        $authUser = Auth::user();

        return Inertia::render('AmbientesModernizacion/Create', [
            'seguimientoId'                     => $seguimientoId,
            'centrosFormacion'                  => SelectHelper::centrosFormacion(),
            'codigosSgps'                       => CodigoProyectoSgps::selectRaw('codigos_proyectos_sgps.id as value, concat(codigos_proyectos_sgps.titulo, chr(10), \'∙ Código: SGPS-\', codigos_proyectos_sgps.codigo_sgps, chr(10), \'∙ Año: \', codigos_proyectos_sgps.year_ejecucion) as label')->leftJoin('seguimientos_ambiente_modernizacion', 'codigos_proyectos_sgps.id', 'seguimientos_ambiente_modernizacion.codigo_proyecto_sgps_id')
                ->join('lineas_programaticas', 'codigos_proyectos_sgps.linea_programatica_id', 'lineas_programaticas.id')
                ->where('lineas_programaticas.codigo', 23)
                ->where('codigos_proyectos_sgps.centro_formacion_id', $authUser->centro_formacion_id)
                ->where('seguimientos_ambiente_modernizacion.codigo_proyecto_sgps_id', NULL)
                ->get(),
            'mesasSectoriales'                  => MesaSectorial::select('id', 'nombre')->get('id'),
            'tipologiasAmbientes'               => SelectHelper::tipologiasAmbiente(),
            'areasConocimiento'                 => SelectHelper::areasConocimiento(),
            'subareasConocimiento'              => SelectHelper::subareasConocimiento(),
            'disciplinasSubareaConocimiento'    => SelectHelper::disciplinasSubareaConocimiento(),
            'redesConocimiento'                 => SelectHelper::redesConocimiento(),
            'actividadesEconomicas'             => SelectHelper::actividadesEconomicas(),
            'lineasInvestigacion'               => SelectHelper::lineasInvestigacion(),
            'tematicasEstrategicas'             => SelectHelper::tematicasEstrategicas(),
            'allowedToCreate'                   => Gate::inspect('create', [AmbienteModernizacion::class])->allowed()
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
        $authUser = Auth::user();

        $codigoProyectoSgps = CodigoProyectoSgps::find($request->codigo_proyecto_sgps_id);

        $seguimientoAmbienteModernizacion = new SeguimientoAmbienteModernizacion();

        $seguimientoAmbienteModernizacion->centroFormacion()->associate($codigoProyectoSgps->centro_formacion_id);
        $seguimientoAmbienteModernizacion->codigoProyectoSgps()->associate($request->codigo_proyecto_sgps_id);

        $seguimientoAmbienteModernizacion->save();

        $ambienteModernizacion = new AmbienteModernizacion();
        $ambienteModernizacion->nombre_ambiente                     = $request->nombre_ambiente;
        $ambienteModernizacion->alineado_mesas_sectoriales          = $request->alineado_mesas_sectoriales;
        $ambienteModernizacion->financiado_anteriormente            = $request->financiado_anteriormente;

        $ambienteModernizacion->redConocimiento()->associate($request->red_conocimiento_id);
        $ambienteModernizacion->lineaInvestigacion()->associate($request->linea_investigacion_id);
        $ambienteModernizacion->disciplinaSubareaConocimiento()->associate($request->disciplina_subarea_conocimiento_id);
        $ambienteModernizacion->tematicaEstrategica()->associate($request->tematica_estrategica_id);
        $ambienteModernizacion->tipologiaAmbiente()->associate($request->tipologia_ambiente_id);
        $ambienteModernizacion->actividadEconomica()->associate($request->actividad_economica_id);
        $ambienteModernizacion->dinamizadorSennova()->associate($authUser->id);
        $ambienteModernizacion->seguimientoAmbienteModernizacion()->associate($seguimientoAmbienteModernizacion->id);

        if ($ambienteModernizacion->save()) {
            $ambienteModernizacion->mesasSectoriales()->sync($request->mesa_sectorial_id);
        }

        return redirect()->route('ambientes-modernizacion.edit', $ambienteModernizacion)->with('success', 'El recurso se ha creado correctamente.');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\AmbienteModernizacion  $ambienteModernizacion
     * @return \Illuminate\Http\Response
     */
    public function show(AmbienteModernizacion $ambienteModernizacion)
    {
        $this->authorize('view', [AmbienteModernizacion::class, $ambienteModernizacion]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\AmbienteModernizacion  $ambienteModernizacion
     * @return \Illuminate\Http\Response
     */
    public function edit(AmbienteModernizacion $ambienteModernizacion)
    {
        $this->authorize('update', [AmbienteModernizacion::class, $ambienteModernizacion]);

        $ambienteModernizacion->seguimientoAmbienteModernizacion;
        $ambienteModernizacion->seguimientoAmbienteModernizacion->codigoProyectoSgps;
        $ambienteModernizacion->disciplinaSubareaConocimiento->subareaConocimiento->areaConocimiento;
        $ambienteModernizacion->seguimientoAmbienteModernizacion->centroFormacion->regional;

        /** @var \App\Models\User */
        $authUser = Auth::user();

        return Inertia::render('AmbientesModernizacion/Edit', [
            'centroFormacionId'                             => $authUser->centro_formacion_id,
            'ambienteModernizacion'                         => $ambienteModernizacion,
            'codigosSgps'                                   => CodigoProyectoSgps::selectRaw('codigos_proyectos_sgps.id as value, concat(codigos_proyectos_sgps.titulo, chr(10), \'∙ Código: SGPS-\', codigos_proyectos_sgps.codigo_sgps, chr(10), \'∙ Año: \', codigos_proyectos_sgps.year_ejecucion) as label')
                ->leftJoin('seguimientos_ambiente_modernizacion', 'codigos_proyectos_sgps.id', 'seguimientos_ambiente_modernizacion.codigo_proyecto_sgps_id')
                ->join('lineas_programaticas', 'codigos_proyectos_sgps.linea_programatica_id', 'lineas_programaticas.id')
                ->where(function ($query) use ($authUser) {
                    $query->where('lineas_programaticas.codigo', 23);
                    if (!$authUser->hasRole([4])) {
                        $query->where('codigos_proyectos_sgps.centro_formacion_id', $authUser->centro_formacion_id);
                    }
                    $query->where('seguimientos_ambiente_modernizacion.codigo_proyecto_sgps_id', NULL);
                })
                ->get(),
            'tipologiasAmbientes'                           => SelectHelper::tipologiasAmbiente(),
            'areasConocimiento'                             => SelectHelper::areasConocimiento(),
            'subareasConocimiento'                          => SelectHelper::subareasConocimiento(),
            'disciplinasSubareaConocimiento'                => SelectHelper::disciplinasSubareaConocimiento(),
            'redesConocimiento'                             => SelectHelper::redesConocimiento(),
            'actividadesEconomicas'                         => SelectHelper::actividadesEconomicas(),
            'lineasInvestigacion'                           => SelectHelper::lineasInvestigacion(),
            'tematicasEstrategicas'                         => SelectHelper::tematicasEstrategicas(),
            'mesasSectoriales'                              => MesaSectorial::select('id', 'nombre')->get('id'),
            'semillerosInvestigacion'                       => SelectHelper::semillerosInvestigacion()->where('centro_formacion_id', $authUser->centroFormacion->id)->values()->all(),
            'programasFormacionConRegistro'                 => SelectHelper::programasFormacion()->where('registro_calificado', true)->where('centro_formacion_id', $ambienteModernizacion->seguimientoAmbienteModernizacion->centro_formacion_id)->values()->all(),
            'programasFormacionSinRegistro'                 => SelectHelper::programasFormacion()->where('registro_calificado', false)->where('centro_formacion_id', $ambienteModernizacion->seguimientoAmbienteModernizacion->centro_formacion_id)->values()->all(),
            'codigosProyectosRelacionados'                  => $ambienteModernizacion->codigosProyectosSgps()->selectRaw('codigos_proyectos_sgps.id as value, concat(codigos_proyectos_sgps.titulo, chr(10), \'∙ Código: \', codigos_proyectos_sgps.codigo_sgps) as label')->get(),
            'programasFormacionCalificadosRelacionados'     => $ambienteModernizacion->programasFormacion()->selectRaw('programas_formacion.id as value, concat(programas_formacion.nombre, chr(10), \'∙ Código: \', programas_formacion.codigo) as label')->where('programas_formacion.registro_calificado', true)->get(),
            'programasFormacionNoCalificadosRelacionados'   => $ambienteModernizacion->programasFormacion()->selectRaw('programas_formacion.id as value, concat(programas_formacion.nombre, chr(10), \'∙ Código: \', programas_formacion.codigo) as label')->where('programas_formacion.registro_calificado', false)->get(),
            'semillerosRelacionados'                        => $ambienteModernizacion->semillerosInvestigacion()->select('semilleros_investigacion.nombre as label', 'semilleros_investigacion.id as value')->get(),
            'mesasSectorialesRelacionadas'                  => $ambienteModernizacion->mesasSectoriales()->pluck('mesas_sectoriales.id'),

            'equiposAmbienteModernizacion'                  => EquipoAmbienteModernizacion::where('ambiente_modernizacion_id', $ambienteModernizacion->id)->get(),
            'roles'                                         => collect(json_decode(Storage::get('json/roles-sennova-idi.json'), true)),
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\AmbienteModernizacion  $ambienteModernizacion
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateAmbienteModernizacionRequest $request, AmbienteModernizacion $ambienteModernizacion)
    {
        $this->authorize('update', [AmbienteModernizacion::class, $ambienteModernizacion]);

        /** @var \App\Models\User */
        $authUser = Auth::user();

        $ambienteModernizacion->alineado_mesas_sectoriales              = $request->alineado_mesas_sectoriales;
        $ambienteModernizacion->financiado_anteriormente                = $request->financiado_anteriormente;
        $ambienteModernizacion->estado_general_maquinaria               = $request->estado_general_maquinaria;
        $ambienteModernizacion->razon_estado_general                    = $request->estado_general_maquinaria == '1' ? null : $request->razon_estado_general;
        $ambienteModernizacion->ambiente_activo                         = $request->ambiente_activo;
        $ambienteModernizacion->justificacion_ambiente_inactivo         = $request->ambiente_activo ? null : $request->justificacion_ambiente_inactivo;
        $ambienteModernizacion->ambiente_activo_procesos_idi            = $request->ambiente_activo_procesos_idi;
        $ambienteModernizacion->numero_proyectos_beneficiados           = $request->ambiente_activo_procesos_idi == 1 ? $request->numero_proyectos_beneficiados : 0;
        $ambienteModernizacion->ambiente_formacion_complementaria       = $request->ambiente_formacion_complementaria;
        $ambienteModernizacion->numero_total_cursos_comp                = $request->ambiente_formacion_complementaria == 1 ? $request->numero_total_cursos_comp : 0;
        $ambienteModernizacion->numero_cursos_empresas                  = $request->ambiente_formacion_complementaria == 1 ? $request->numero_cursos_empresas : 0;
        $ambienteModernizacion->datos_empresa                           = $request->ambiente_formacion_complementaria == 1 ? $request->datos_empresa : null;
        $ambienteModernizacion->cursos_complementarios                  = $request->ambiente_formacion_complementaria == 1 ? $request->cursos_complementarios : null;
        $ambienteModernizacion->coordenada_latitud_ambiente             = $request->coordenada_latitud_ambiente;
        $ambienteModernizacion->coordenada_longitud_ambiente            = $request->coordenada_longitud_ambiente;
        $ambienteModernizacion->palabras_clave_ambiente                 = $request->palabras_clave_ambiente;

        $ambienteModernizacion->razon_estado_general                    = $request->razon_estado_general;
        $ambienteModernizacion->justificacion_ambiente_inactivo         = $request->justificacion_ambiente_inactivo;
        $ambienteModernizacion->impacto_procesos_formacion              = $request->impacto_procesos_formacion;
        $ambienteModernizacion->pertinencia_sector_productivo           = $request->pertinencia_sector_productivo;
        $ambienteModernizacion->productividad_beneficiarios             = $request->productividad_beneficiarios;
        $ambienteModernizacion->generacion_empleo                       = $request->generacion_empleo;
        $ambienteModernizacion->creacion_empresas                       = $request->creacion_empresas;
        $ambienteModernizacion->incorporacion_nuevos_conocimientos      = $request->incorporacion_nuevos_conocimientos;
        $ambienteModernizacion->valor_agregado_entidades                = $request->valor_agregado_entidades;
        $ambienteModernizacion->fortalecimiento_programas_formacion     = $request->fortalecimiento_programas_formacion;
        $ambienteModernizacion->transferencia_tecnologias               = $request->transferencia_tecnologias;
        $ambienteModernizacion->cobertura_perntinencia_formacion        = $request->cobertura_perntinencia_formacion;
        $ambienteModernizacion->observaciones_generales_ambiente        = $request->observaciones_generales_ambiente;

        $ambienteModernizacion->numero_personas_certificadas            = $request->numero_personas_certificadas;
        $ambienteModernizacion->numero_tecnicas_tecnologias             = $request->numero_tecnicas_tecnologias;
        $ambienteModernizacion->numero_publicaciones                    = $request->numero_publicaciones;
        $ambienteModernizacion->numero_aprendices_beneficiados          = $request->numero_aprendices_beneficiados;

        $ambienteModernizacion->cod_proyectos_beneficiados              = $request->cod_proyectos_beneficiados;

        $ambienteModernizacion->redConocimiento()->associate($request->red_conocimiento_id);
        $ambienteModernizacion->lineaInvestigacion()->associate($request->linea_investigacion_id);
        $ambienteModernizacion->disciplinaSubareaConocimiento()->associate($request->disciplina_subarea_conocimiento_id);
        $ambienteModernizacion->tematicaEstrategica()->associate($request->tematica_estrategica_id);
        $ambienteModernizacion->tipologiaAmbiente()->associate($request->tipologia_ambiente_id);
        $ambienteModernizacion->actividadEconomica()->associate($request->actividad_economica_id);
        $ambienteModernizacion->dinamizadorSennova()->associate($authUser->id);

        if ($ambienteModernizacion->save()) {
            if ($request->hasFile('soporte_fotos_ambiente')) {
                $this->saveFilesSharepoint($request, $ambienteModernizacion);
            }

            $ambienteModernizacion->seguimientoAmbienteModernizacion()->update(['codigo_proyecto_sgps_id' => $request->codigo_proyecto_sgps_id]);

            $request->alineado_mesas_sectoriales == 1 ? $ambienteModernizacion->mesasSectoriales()->sync($request->mesa_sectorial_id) : $ambienteModernizacion->mesasSectoriales()->detach();
            $request->financiado_anteriormente == 1 ? $ambienteModernizacion->codigosProyectosSgps()->sync($request->codigos_proyectos_id) : $ambienteModernizacion->codigosProyectosSgps()->detach();
            $request->ambiente_activo == 1 ? $ambienteModernizacion->programasFormacion()->sync(array_merge($request->programas_formacion_calificados ? $request->programas_formacion_calificados : [], $request->programas_formacion ? $request->programas_formacion : [])) : null;
            $request->ambiente_activo_procesos_idi == 1 ? $ambienteModernizacion->semillerosInvestigacion()->sync($request->semilleros_investigacion_id) : $ambienteModernizacion->semillerosInvestigacion()->detach();
        }


        return redirect()->back()->with('success', 'El recurso se ha actualizado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\AmbienteModernizacion  $ambienteModernizacion
     * @return \Illuminate\Http\Response
     */
    public function destroy(AmbienteModernizacion $ambienteModernizacion)
    {
        $this->authorize('delete', [AmbienteModernizacion::class, $ambienteModernizacion]);

        $ambienteModernizacion->delete();

        return redirect()->route('ambientes-modernizacion.index')->with('success', 'El recurso se ha eliminado correctamente.');
    }

    /**
     * download
     *
     * @param  mixed $ambienteModernizacion
     * @return void
     */
    public function download(AmbienteModernizacion $ambienteModernizacion)
    {
        $this->authorize('update', $ambienteModernizacion);

        $path = $ambienteModernizacion->soporte_fotos_ambiente;

        return response()->download(storage_path("app/$path"));
    }

    public function equiposStore(EquipoAmbienteModernizacionRequest $request, AmbienteModernizacion $ambienteModernizacion)
    {
        $message = '';

        if ($request->id) {
            $equipoAmbienteModernizacion = EquipoAmbienteModernizacion::find($request->id);
            $equipoAmbienteModernizacion->numero_inventario_equipo      = $request->numero_inventario_equipo;
            $equipoAmbienteModernizacion->nombre_equipo                 = $request->nombre_equipo;
            $equipoAmbienteModernizacion->descripcion_tecnica_equipo    = $request->descripcion_tecnica_equipo;
            $equipoAmbienteModernizacion->estado_equipo                 = $request->estado_equipo;
            $equipoAmbienteModernizacion->equipo_en_funcionamiento      = $request->equipo_en_funcionamiento;
            $equipoAmbienteModernizacion->observaciones_generales       = $request->observaciones_generales;
            $equipoAmbienteModernizacion->marca                         = $request->marca;
            $equipoAmbienteModernizacion->horas_promedio_uso            = $request->horas_promedio_uso;
            $equipoAmbienteModernizacion->frecuencia_mantenimiento      = $request->frecuencia_mantenimiento;
            $equipoAmbienteModernizacion->year_adquisicion              = $request->year_adquisicion;
            $equipoAmbienteModernizacion->nombre_cuentadante            = $request->nombre_cuentadante;
            $equipoAmbienteModernizacion->cedula_cuentadante            = $request->cedula_cuentadante;
            $equipoAmbienteModernizacion->rol_cuentadante               = $request->rol_cuentadante;

            $equipoAmbienteModernizacion->save();

            $message = 'El recurso se ha modificado correctamente.';
        } else {
            $equipoAmbienteModernizacion = new EquipoAmbienteModernizacion();
            $equipoAmbienteModernizacion->numero_inventario_equipo      = $request->numero_inventario_equipo;
            $equipoAmbienteModernizacion->nombre_equipo                 = $request->nombre_equipo;
            $equipoAmbienteModernizacion->descripcion_tecnica_equipo    = $request->descripcion_tecnica_equipo;
            $equipoAmbienteModernizacion->estado_equipo                 = $request->estado_equipo;
            $equipoAmbienteModernizacion->equipo_en_funcionamiento      = $request->equipo_en_funcionamiento;
            $equipoAmbienteModernizacion->observaciones_generales       = $request->observaciones_generales;
            $equipoAmbienteModernizacion->marca                         = $request->marca;
            $equipoAmbienteModernizacion->horas_promedio_uso            = $request->horas_promedio_uso;
            $equipoAmbienteModernizacion->frecuencia_mantenimiento      = $request->frecuencia_mantenimiento;
            $equipoAmbienteModernizacion->year_adquisicion              = $request->year_adquisicion;
            $equipoAmbienteModernizacion->nombre_cuentadante            = $request->nombre_cuentadante;
            $equipoAmbienteModernizacion->cedula_cuentadante            = $request->cedula_cuentadante;
            $equipoAmbienteModernizacion->rol_cuentadante               = $request->rol_cuentadante;
            $equipoAmbienteModernizacion->ambienteModernizacion()->associate($ambienteModernizacion);

            $equipoAmbienteModernizacion->save();

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
    public function replicateRow($ambienteModernizacion)
    {
        $clone = $ambienteModernizacion->replicate();
        $clone->push();

        //load relations on EXISTING MODEL
        $ambienteModernizacion->load(
            'mesasSectoriales',
            'codigosProyectosSgps',
            'programasFormacion',
            'semillerosInvestigacion'
        );

        //re-sync everything
        foreach ($ambienteModernizacion->getRelations() as $relationName => $values) {
            if ($relationName != 'equiposAmbienteModernizacion') {
                $clone->{$relationName}()->sync($values);
            }
        }

        foreach ($ambienteModernizacion->equiposAmbienteModernizacion as $equipo) {
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
    function generatePdfAmbienteModernizacion(AmbienteModernizacion $ambienteModernizacion)
    {
        ini_set('max_execution_time', 0);
        ini_set('memory_limit', -1);

        $pdf = PDF::loadView('AmbienteModernizacionPdf', [
            'ambienteModernizacion' => $ambienteModernizacion,
        ]);

        // return $pdf->stream("dompdf_out.pdf", array("Attachment" => false));

        $output = $pdf->setWarnings(false)->output();
        $random    = Str::random(10);
        $fileName = $ambienteModernizacion->seguimientoAmbienteModernizacion->codigo . $random;
        $path = 'ambientes-modernizacion/' . $fileName . '.pdf';
        Storage::put($path, $output);

        $ambienteModernizacion->update(['pdf_path' => $path]);
    }

    /**
     * descargarPdfAmbienteModernizacion
     *
     * @param  mixed $ambienteModernizacion
     * @return void
     */
    function descargarPdfAmbienteModernizacion(AmbienteModernizacion $ambienteModernizacion)
    {
        return Storage::download($ambienteModernizacion->pdf_path);
    }

    public function updateLongColumn(Request $request, AmbienteModernizacion $ambienteModernizacion, $column)
    {
        try {
            $ambienteModernizacion->update($request->only($column));
            return back();
        } catch (\Throwable $th) {
            Log::debug($th);
        }
    }

    public function saveFilesSharepoint(Request $request, AmbienteModernizacion $ambienteModernizacion)
    {
        $request->validate([
            'soporte_fotos_ambiente' => 'nullable|file|max:10240',
        ]);

        $response = [];

        if ($request->hasFile('soporte_fotos_ambiente')) {
            $response = SharepointHelper::saveFilesSharepoint($request, 'soporte_fotos_ambiente', $ambienteModernizacion, $ambienteModernizacion->id . 'soporte_fotos_ambiente');
        }

        if (count($response) > 0 && $response['success']) {
            return back()->with('success', 'Los archivos se han cargado correctamente');
        } else if (count($response) > 0 && $response['success'] == false) {
            return back()->with('error', 'No se han podido cargar los archivos. Por favor vuelva a intentar');
        }
    }

    public function downloadServerFile(Request $request, AmbienteModernizacion $ambienteModernizacion)
    {
        SharepointHelper::downloadServerFile($ambienteModernizacion, $request->formato);
    }

    public function downloadFileSharepoint(AmbienteModernizacion $ambienteModernizacion, $tipoArchivo)
    {
        $sharePointPath = $ambienteModernizacion[$tipoArchivo];

        return SharepointHelper::downloadFile($sharePointPath);
    }
}
