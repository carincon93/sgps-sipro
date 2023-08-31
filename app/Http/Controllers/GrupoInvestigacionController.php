<?php

namespace App\Http\Controllers;

use App\Helpers\SharepointHelper;
use App\Helpers\SelectHelper;
use App\Http\Requests\StoreGrupoInvestigacionRequest;
use App\Http\Requests\UpdateGrupoInvestigacionRequest;
use App\Models\GrupoInvestigacion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class GrupoInvestigacionController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $this->authorize('viewAny', [GrupoInvestigacion::class]);

        /** @var \App\Models\User */
        $auth_user = Auth::user();

        $grupos_investigacion_centro_formacion = [];

        if ($auth_user->hasRole([2])) {
            $centros_formacion_id = $auth_user->centroFormacion->regional->centrosFormacion()->pluck('id')->toArray();
            $grupos_investigacion_centro_formacion = GrupoInvestigacion::select('grupos_investigacion.*')->whereIn('grupos_investigacion.centro_formacion_id', $centros_formacion_id)->with('centroFormacion.regional', 'redesConocimiento')->get();
        } else {
            $grupos_investigacion_centro_formacion = GrupoInvestigacion::select('grupos_investigacion.*')->where('grupos_investigacion.centro_formacion_id', $auth_user->centro_formacion_id)->with('centroFormacion.regional', 'redesConocimiento')->get();
        }
        return Inertia::render('GruposInvestigacion/Index', [
            'grupos_investigacion'                  => GrupoInvestigacion::select('grupos_investigacion.*')->with('centroFormacion.regional', 'redesConocimiento')->filterGrupoInvestigacion(request()->only('search', 'grupoInvestigacion'))->orderBy('grupos_investigacion.nombre', 'ASC')->paginate(),
            'grupos_investigacion_centro_formacion' => $grupos_investigacion_centro_formacion,
            'categorias_minciencias'                => json_decode(Storage::get('json/categorias-minciencias.json'), true),
            'redes_conocimiento'                    => SelectHelper::redesConocimiento(),
            'centros_formacion'                     => SelectHelper::centrosFormacion(),
            'allowed_to_create'                     => Gate::inspect('create', [GrupoInvestigacion::class])->allowed()
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        $this->authorize('create', [GrupoInvestigacion::class]);

        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreGrupoInvestigacionRequest $request)
    {
        $this->authorize('create', [GrupoInvestigacion::class]);

        $grupo_investigacion = GrupoInvestigacion::create($request->validated());
        $grupo_investigacion->redesConocimiento()->sync($request->redes_conocimiento);

        return back()->with('success', 'El recurso se ha creado correctamente.');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\GrupoInvestigacion  $grupo_investigacion
     * @return \Illuminate\Http\Response
     */
    public function show(GrupoInvestigacion $grupo_investigacion)
    {
        $this->authorize('view', [GrupoInvestigacion::class, $grupo_investigacion]);

        $grupo_investigacion->redesConocimiento;

        return Inertia::render('GruposInvestigacion/Show', [
            'grupo_investigacion'       => $grupo_investigacion,
            'categorias_minciencias'    => json_decode(Storage::get('json/categorias-minciencias.json'), true),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\GrupoInvestigacion  $grupo_investigacion
     * @return \Illuminate\Http\Response
     */
    public function edit(GrupoInvestigacion $grupo_investigacion)
    {
        $this->authorize('view', [GrupoInvestigacion::class, $grupo_investigacion]);

        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\GrupoInvestigacion  $grupo_investigacion
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateGrupoInvestigacionRequest $request, GrupoInvestigacion $grupo_investigacion)
    {
        $this->authorize('update', [GrupoInvestigacion::class, $grupo_investigacion]);

        $grupo_investigacion->update($request->validated());
        $grupo_investigacion->save();
        $grupo_investigacion->redesConocimiento()->sync($request->redes_conocimiento);

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\GrupoInvestigacion  $grupo_investigacion
     * @return \Illuminate\Http\Response
     */
    public function destroy(GrupoInvestigacion $grupo_investigacion)
    {
        $this->authorize('delete', [GrupoInvestigacion::class, $grupo_investigacion]);

        // $grupo_investigacion->delete();

        return back()->with('error', 'No se puede eliminar el recurso debido a que hay información relacionada. Comuníquese con el administrador del sistema.');
    }

    public function uploadFormatoGicF020(Request $request, GrupoInvestigacion $grupo_investigacion)
    {
        if ($request->hasFile('formato_gic_f_020')) {
            $request->validate([
                'formato_gic_f_020' => 'nullable|file|max:10240',
            ]);
            return $this->saveFilesSharepoint($request->formato_gic_f_020, 'GRUPOS LÍNEAS Y SEMILLEROS', $grupo_investigacion, 'formato_gic_f_020');
        }
    }

    public function uploadFormatoGicF032(Request $request, GrupoInvestigacion $grupo_investigacion)
    {
        if ($request->hasFile('formato_gic_f_032')) {
            $request->validate([
                'formato_gic_f_032' => 'nullable|file|max:10240',
            ]);
            return $this->saveFilesSharepoint($request->formato_gic_f_032, 'GRUPOS LÍNEAS Y SEMILLEROS', $grupo_investigacion, 'formato_gic_f_032');
        }
    }

    public function saveFilesSharepoint($tmp_file, $modulo, $modelo, $campo_bd)
    {
        $grupo_investigacion = $modelo;

        $sharepoint_grupo_investigacion = $grupo_investigacion->centroFormacion->nombre_carpeta_sharepoint . '/' . mb_strtoupper($grupo_investigacion->nombre .'/FORMATOS');

        $sharepoint_path                = "$modulo/$sharepoint_grupo_investigacion";

        SharepointHelper::saveFilesSharepoint($tmp_file, $modelo, $sharepoint_path, $campo_bd);
    }

    public function downloadServerFile(Request $request, GrupoInvestigacion $grupo_investigacion)
    {
        SharepointHelper::downloadServerFile($grupo_investigacion, $request->formato);
    }

    public function downloadFileSharepoint(GrupoInvestigacion $grupo_investigacion, $tipo_archivo)
    {
        $sharepoint_path = $grupo_investigacion[$tipo_archivo];

        return SharepointHelper::downloadFile($sharepoint_path);
    }
}
