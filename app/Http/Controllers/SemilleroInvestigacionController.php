<?php

namespace App\Http\Controllers;

use App\Helpers\SharepointHelper;
use App\Helpers\SelectHelper;
use App\Http\Requests\SemilleroInvestigacionRequest;
use App\Models\GrupoInvestigacion;
use App\Models\LineaInvestigacion;
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
    public function index(GrupoInvestigacion $grupo_investigacion, LineaInvestigacion $linea_investigacion)
    {
        $this->authorize('viewAny', [SemilleroInvestigacion::class]);

        return Inertia::render('SemillerosInvestigacion/Index', [
            'grupo_investigacion'       => $grupo_investigacion,
            'linea_investigacion'       => $linea_investigacion,
            'semilleros_investigacion'  => $linea_investigacion->semillerosInvestigacion()->select('semilleros_investigacion.*')
                                                ->with('redesConocimiento', 'lineasInvestigacionArticulados')
                                                ->filterSemilleroInvestigacion(request()->only('search'))
                                                ->orderBy('semilleros_investigacion.nombre', 'ASC')->paginate(),
            'lineas_investigacion'      => $grupo_investigacion->lineasInvestigacion()->select('lineas_investigacion.id as value', 'lineas_investigacion.nombre as label')->get()->toArray(),
            'redes_conocimiento'        => SelectHelper::redesConocimiento(),
            'allowed_to_create'         => Gate::inspect('create', [SemilleroInvestigacion::class])->allowed(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create(GrupoInvestigacion $grupo_investigacion, LineaInvestigacion $linea_investigacion)
    {
        $this->authorize('create', [SemilleroInvestigacion::class]);

        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(SemilleroInvestigacionRequest $request, GrupoInvestigacion $grupo_investigacion, LineaInvestigacion $linea_investigacion)
    {
        $this->authorize('create', [SemilleroInvestigacion::class]);

        $semillero_investigacion = $linea_investigacion->semillerosInvestigacion()->create($request->validated());

        $semillero_investigacion->update(['codigo' => 'SGPS-SEM-' . $semillero_investigacion->id]);
        $semillero_investigacion->lineaInvestigacion()->associate($request->linea_investigacion_id);
        $semillero_investigacion->lineasInvestigacionArticulados()->sync($request->lineas_investigacion);
        $semillero_investigacion->redesConocimiento()->sync($request->redes_conocimiento);

        if ($request->hasFile('formato_gic_f_021')) {
            $request->validate([
                'formato_gic_f_021' => 'nullable|file|max:10240',
            ]);
            $this->saveFilesSharepoint($request->formato_gic_f_021, 'GRUPOS LÍNEAS Y SEMILLEROS', $semillero_investigacion, 'formato_gic_f_021');
        }

        if ($request->hasFile('formato_gic_f_032')) {
            $request->validate([
                'formato_gic_f_032' => 'nullable|file|max:10240',
            ]);
            $this->saveFilesSharepoint($request->formato_gic_f_032, 'GRUPOS LÍNEAS Y SEMILLEROS', $semillero_investigacion, 'formato_gic_f_032');
        }

        if ($request->hasFile('formato_aval_semillero')) {
            $request->validate([
                'formato_aval_semillero' => 'nullable|file|max:10240',
            ]);
            $this->saveFilesSharepoint($request->formato_aval_semillero, 'GRUPOS LÍNEAS Y SEMILLEROS', $semillero_investigacion, 'formato_aval_semillero');
        }

        return back()->with('success', 'El recurso se ha creado correctamente.');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\SemilleroInvestigacion  $semillero_investigacion
     * @return \Illuminate\Http\Response
     */
    public function show(GrupoInvestigacion $grupo_investigacion, LineaInvestigacion $linea_investigacion, SemilleroInvestigacion $semillero_investigacion)
    {
        $this->authorize('view', [SemilleroInvestigacion::class, $semillero_investigacion]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\SemilleroInvestigacion  $semillero_investigacion
     * @return \Illuminate\Http\Response
     */
    public function edit(GrupoInvestigacion $grupo_investigacion, LineaInvestigacion $linea_investigacion, SemilleroInvestigacion $semillero_investigacion)
    {
        $this->authorize('view', [SemilleroInvestigacion::class, $semillero_investigacion]);

        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\SemilleroInvestigacion  $semillero_investigacion
     * @return \Illuminate\Http\Response
     */
    public function update(SemilleroInvestigacionRequest $request, GrupoInvestigacion $grupo_investigacion, LineaInvestigacion $linea_investigacion, SemilleroInvestigacion $semillero_investigacion)
    {
        $this->authorize('update', [SemilleroInvestigacion::class, $semillero_investigacion]);

        $semillero_investigacion->update($request->validated());
        $semillero_investigacion->save();

        $semillero_investigacion->lineaInvestigacion()->associate($request->linea_investigacion_id);
        $semillero_investigacion->lineasInvestigacionArticulados()->sync($request->lineas_investigacion);
        $semillero_investigacion->redesConocimiento()->sync($request->redes_conocimiento);

        if ($request->hasFile('formato_gic_f_021')) {
            $request->validate([
                'formato_gic_f_021' => 'nullable|file|max:10240',
            ]);
            $this->saveFilesSharepoint($request->formato_gic_f_021, 'GRUPOS LÍNEAS Y SEMILLEROS', $semillero_investigacion, 'formato_gic_f_021');
        }

        if ($request->hasFile('formato_gic_f_032')) {
            $request->validate([
                'formato_gic_f_032' => 'nullable|file|max:10240',
            ]);
            $this->saveFilesSharepoint($request->formato_gic_f_032, 'GRUPOS LÍNEAS Y SEMILLEROS', $semillero_investigacion, 'formato_gic_f_032');
        }

        if ($request->hasFile('formato_aval_semillero')) {
            $request->validate([
                'formato_aval_semillero' => 'nullable|file|max:10240',
            ]);
            $this->saveFilesSharepoint($request->formato_aval_semillero, 'GRUPOS LÍNEAS Y SEMILLEROS', $semillero_investigacion, 'formato_aval_semillero');
        }

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\SemilleroInvestigacion  $semillero_investigacion
     * @return \Illuminate\Http\Response
     */
    public function destroy(GrupoInvestigacion $grupo_investigacion, LineaInvestigacion $linea_investigacion, SemilleroInvestigacion $semillero_investigacion)
    {
        $this->authorize('delete', [SemilleroInvestigacion::class, $semillero_investigacion]);

        $semillero_investigacion->delete();

        return back()->with('success', 'El recurso se ha eliminado correctamente.');
    }

    public function saveFilesSharepoint($tmp_file, $modulo, $modelo, $campo_bd)
    {
        $semillero_investigacion = $modelo;

        $sharepoint_semillero_investigacion = $semillero_investigacion->LineaInvestigacion->grupoInvestigacion->centroFormacion->nombre_carpeta_sharepoint .'/'. mb_strtoupper($semillero_investigacion->LineaInvestigacion->grupoInvestigacion->nombre) . '/SEMILLEROS/' . mb_strtoupper($semillero_investigacion->nombre);

        $sharepoint_path                    = "$modulo/$sharepoint_semillero_investigacion";

        SharepointHelper::saveFilesSharepoint($tmp_file, $modelo, $sharepoint_path, $campo_bd);
    }

    public function downloadServerFile(Request $request, GrupoInvestigacion $grupo_investigacion, SemilleroInvestigacion $semillero_investigacion)
    {
        SharepointHelper::downloadServerFile($semillero_investigacion, $request->formato);
    }

    public function downloadFileSharepoint(GrupoInvestigacion $grupo_investigacion, LineaInvestigacion $linea_investigacion, SemilleroInvestigacion $semillero_investigacion, $tipo_archivo)
    {
        $sharepoint_path = $semillero_investigacion[$tipo_archivo];

        return SharepointHelper::downloadFile($sharepoint_path);
    }
}
