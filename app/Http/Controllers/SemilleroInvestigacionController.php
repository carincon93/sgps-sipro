<?php

namespace App\Http\Controllers;

use App\Helpers\SharepointHelper;
use App\Helpers\SelectHelper;
use App\Http\Requests\SemilleroInvestigacionRequest;
use App\Models\GrupoInvestigacion;
use App\Models\ProgramaFormacion;
use App\Models\SemilleroInvestigacion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class SemilleroInvestigacionController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(GrupoInvestigacion $grupoInvestigacion)
    {
        $this->authorize('viewAny', [SemilleroInvestigacion::class]);

        return Inertia::render('SemillerosInvestigacion/Index', [
            'filters'                   => request()->all('search'),
            'allowedToCreate'           => Gate::inspect('create', [SemilleroInvestigacion::class])->allowed(),
            'grupoInvestigacion'        => $grupoInvestigacion,
            'semillerosInvestigacion'   => SemilleroInvestigacion::select('semilleros_investigacion.id', 'semilleros_investigacion.nombre', 'semilleros_investigacion.codigo', 'semilleros_investigacion.linea_investigacion_id', 'lineas_investigacion.nombre as nombre_linea_principal')
                ->join('lineas_investigacion', 'semilleros_investigacion.linea_investigacion_id', 'lineas_investigacion.id')
                ->where('lineas_investigacion.grupo_investigacion_id', $grupoInvestigacion->id)
                ->filterSemilleroInvestigacion(request()->only('search'))
                ->orderBy('semilleros_investigacion.nombre', 'ASC')->paginate(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create(GrupoInvestigacion $grupoInvestigacion)
    {
        $this->authorize('create', [SemilleroInvestigacion::class]);

        return Inertia::render('SemillerosInvestigacion/Create', [
            'grupoInvestigacion'    => $grupoInvestigacion,
            'lineasInvestigacion'   => SelectHelper::lineasInvestigacion()->where('grupo_investigacion_id', $grupoInvestigacion->id)->values()->all(),
            'redesConocimiento'     => SelectHelper::redesConocimiento(),
            'programasFormacion'    => ProgramaFormacion::selectRaw('programas_formacion.id as value, CONCAT(programas_formacion.nombre, chr(10), \'∙ Código: \', programas_formacion.codigo) as label, linea_investigacion_programa_formacion.linea_investigacion_id as linea_investigacion_id')->join('linea_investigacion_programa_formacion', 'programas_formacion.id', 'linea_investigacion_programa_formacion.programa_formacion_id')->where('programas_formacion.centro_formacion_id', $grupoInvestigacion->centro_formacion_id)->orderBy('programas_formacion.nombre', 'ASC')->get(),
            'allowedToCreate'       => Gate::inspect('create', [SemilleroInvestigacion::class])->allowed()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(SemilleroInvestigacionRequest $request, GrupoInvestigacion $grupoInvestigacion)
    {
        $this->authorize('create', [SemilleroInvestigacion::class]);

        $semilleroInvestigacion = new SemilleroInvestigacion();
        $semilleroInvestigacion->nombre                                     = $request->nombre;
        $semilleroInvestigacion->fecha_creacion_semillero                   = $request->fecha_creacion_semillero;
        $semilleroInvestigacion->nombre_lider_semillero                     = $request->nombre_lider_semillero;
        $semilleroInvestigacion->email_contacto                             = $request->email_contacto;
        $semilleroInvestigacion->reconocimientos_semillero_investigacion    = $request->reconocimientos_semillero_investigacion;
        $semilleroInvestigacion->vision                                     = $request->vision;
        $semilleroInvestigacion->mision                                     = $request->mision;
        $semilleroInvestigacion->objetivo_general                           = $request->objetivo_general;
        $semilleroInvestigacion->objetivos_especificos                      = $request->objetivos_especificos;
        $semilleroInvestigacion->link_semillero                             = $request->link_semillero;
        $semilleroInvestigacion->es_semillero_tecnoacademia                 = $request->es_semillero_tecnoacademia;

        $semilleroInvestigacion->lineaInvestigacion()->associate($request->linea_investigacion_id);

        if ($semilleroInvestigacion->save()) {

            SharepointHelper::checkFolderAndCreate($semilleroInvestigacion->ruta_final_sharepoint);

            $semilleroInvestigacion->update(['codigo' => 'SGPS-SEM-' . $semilleroInvestigacion->id]);

            $this->saveFilesSharepoint($request, $grupoInvestigacion, $semilleroInvestigacion);

            $semilleroInvestigacion->redesConocimiento()->attach($request->redes_conocimiento);
            $semilleroInvestigacion->programasFormacion()->attach($request->programas_formacion);
            $semilleroInvestigacion->lineasInvestigacionArticulados()->attach($request->lineas_investigacion);

            return redirect()->route('grupos-investigacion.semilleros-investigacion.edit', [$grupoInvestigacion, $semilleroInvestigacion])->with('success', 'El recurso se ha creado correctamente.');
        } else {
            abort(500, 'No se ha podido crear el semillero de investigación.');
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\SemilleroInvestigacion  $semilleroInvestigacion
     * @return \Illuminate\Http\Response
     */
    public function show(GrupoInvestigacion $grupoInvestigacion, SemilleroInvestigacion $semilleroInvestigacion)
    {
        $this->authorize('view', [SemilleroInvestigacion::class, $semilleroInvestigacion]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\SemilleroInvestigacion  $semilleroInvestigacion
     * @return \Illuminate\Http\Response
     */
    public function edit(GrupoInvestigacion $grupoInvestigacion, SemilleroInvestigacion $semilleroInvestigacion)
    {
        $this->authorize('view', [SemilleroInvestigacion::class, $semilleroInvestigacion]);

        $semilleroInvestigacion->lineaInvestigacion->grupoInvestigacion;

        return Inertia::render('SemillerosInvestigacion/Edit', [
            'semilleroInvestigacion'                    => $semilleroInvestigacion,
            'grupoInvestigacion'                        => $grupoInvestigacion,
            'lineasInvestigacion'                       => SelectHelper::lineasInvestigacion()->where('grupo_investigacion_id', $grupoInvestigacion->id)->values()->all(),
            'redesConocimiento'                         => SelectHelper::redesConocimiento(),
            'programasFormacion'                        => ProgramaFormacion::selectRaw('programas_formacion.id as value, CONCAT(programas_formacion.nombre, chr(10), \'∙ Código: \', programas_formacion.codigo) as label, linea_investigacion_programa_formacion.linea_investigacion_id as linea_investigacion_id')->join('linea_investigacion_programa_formacion', 'programas_formacion.id', 'linea_investigacion_programa_formacion.programa_formacion_id')->where('programas_formacion.centro_formacion_id', $grupoInvestigacion->centro_formacion_id)->orderBy('programas_formacion.nombre', 'ASC')->get(),
            'redesConocimientoSemilleroInvestigacion'   => $semilleroInvestigacion->redesConocimiento()->select('redes_conocimiento.id as value', 'redes_conocimiento.nombre as label')->get(),
            'programasFormacionSemilleroInvestigacion'  => $semilleroInvestigacion->programasFormacion()->select('programas_formacion.id as value', 'programas_formacion.nombre as label')->get(),
            'lineasInvestigacionSemilleroInvestigacion' => $semilleroInvestigacion->lineasInvestigacionArticulados()->select('lineas_investigacion.id as value', 'lineas_investigacion.nombre as label')->get(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\SemilleroInvestigacion  $semilleroInvestigacion
     * @return \Illuminate\Http\Response
     */
    public function update(SemilleroInvestigacionRequest $request, GrupoInvestigacion $grupoInvestigacion, SemilleroInvestigacion $semilleroInvestigacion)
    {
        $this->authorize('update', [SemilleroInvestigacion::class, $semilleroInvestigacion]);

        $semilleroInvestigacion->nombre                                     = $request->nombre;
        $semilleroInvestigacion->fecha_creacion_semillero                   = $request->fecha_creacion_semillero;
        $semilleroInvestigacion->nombre_lider_semillero                     = $request->nombre_lider_semillero;
        $semilleroInvestigacion->email_contacto                             = $request->email_contacto;
        $semilleroInvestigacion->reconocimientos_semillero_investigacion    = $request->reconocimientos_semillero_investigacion;
        $semilleroInvestigacion->vision                                     = $request->vision;
        $semilleroInvestigacion->mision                                     = $request->mision;
        $semilleroInvestigacion->objetivo_general                           = $request->objetivo_general;
        $semilleroInvestigacion->objetivos_especificos                      = $request->objetivos_especificos;
        $semilleroInvestigacion->link_semillero                             = $request->link_semillero;
        $semilleroInvestigacion->es_semillero_tecnoacademia                 = $request->es_semillero_tecnoacademia;

        $semilleroInvestigacion->lineaInvestigacion()->associate($request->linea_investigacion_id);

        if ($semilleroInvestigacion->save()) {
            if ($request->hasFile('formato_gic_f_021') || $request->hasFile('formato_gic_f_032') || $request->hasFile('formato_aval_semillero')) {
                $this->saveFilesSharepoint($request, $grupoInvestigacion, $semilleroInvestigacion);
            }

            $semilleroInvestigacion->redesConocimiento()->sync($request->redes_conocimiento);
            $semilleroInvestigacion->programasFormacion()->sync($request->programas_formacion);
            $semilleroInvestigacion->lineasInvestigacionArticulados()->sync($request->lineas_investigacion);

            return back()->with('success', 'El recurso se ha actualizado correctamente.');
        } else {
            abort(500, 'No se ha podido modificar el semillero de investigación.');
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\SemilleroInvestigacion  $semilleroInvestigacion
     * @return \Illuminate\Http\Response
     */
    public function destroy(GrupoInvestigacion $grupoInvestigacion, SemilleroInvestigacion $semilleroInvestigacion)
    {
        $this->authorize('delete', [SemilleroInvestigacion::class, $semilleroInvestigacion]);

        $semilleroInvestigacion->delete();

        return redirect()->route('grupos-investigacion.semilleros-investigacion.index', [$grupoInvestigacion])->with('success', 'El recurso se ha eliminado correctamente.');
    }

    public function saveFilesSharepoint(Request $request, GrupoInvestigacion $grupoInvestigacion, SemilleroInvestigacion $semilleroInvestigacion)
    {
        $response = [];

        if ($request->hasFile('formato_gic_f_021')) {
            $response = SharepointHelper::saveFilesSharepoint($request, 'formato_gic_f_021', $semilleroInvestigacion, $semilleroInvestigacion->id . 'formato_gic_f_021');
        }

        if ($request->hasFile('formato_gic_f_032')) {
            $response = SharepointHelper::saveFilesSharepoint($request, 'formato_gic_f_032', $semilleroInvestigacion, $semilleroInvestigacion->id . 'formato_gic_f_032');
        }

        if ($request->hasFile('formato_aval_semillero')) {
            $response = SharepointHelper::saveFilesSharepoint($request, 'formato_aval_semillero', $semilleroInvestigacion, $semilleroInvestigacion->id . 'formato_aval_semillero');
        }

        if (count($response) > 0 && $response['success']) {
            return back()->with('success', 'Los archivos se han cargado correctamente');
        } else if (count($response) > 0 && $response['success'] == false) {
            return back()->with('error', 'No se han podido cargar los archivos. Por favor vuelva a intentar');
        }
    }

    public function downloadServerFile(Request $request, GrupoInvestigacion $grupoInvestigacion, SemilleroInvestigacion $semilleroInvestigacion)
    {
        SharepointHelper::downloadServerFile($semilleroInvestigacion, $request->formato);
    }

    public function downloadFileSharepoint(GrupoInvestigacion $grupoInvestigacion, SemilleroInvestigacion $semilleroInvestigacion, $tipoArchivo)
    {
        SharepointHelper::downloadFileSharepoint($semilleroInvestigacion, $tipoArchivo);
    }
}
