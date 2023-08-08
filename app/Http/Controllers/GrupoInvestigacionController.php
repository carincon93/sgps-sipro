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

        return Inertia::render('GruposInvestigacion/Index', [
            'filters'                               => request()->all('search'),
            'grupos_investigacion'                  => GrupoInvestigacion::select('grupos_investigacion.*')->with('centroFormacion.regional')->filterGrupoInvestigacion(request()->only('search', 'grupoInvestigacion'))->orderBy('grupos_investigacion.nombre', 'ASC')->paginate(),
            'grupos_investigacion_centro_formacion' => GrupoInvestigacion::select('grupos_investigacion.*')->where('grupos_investigacion.centro_formacion_id', $auth_user->centro_formacion_id)->with('centroFormacion.regional', 'redesConocimiento')->get(),
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

        $grupo_investigacion = new GrupoInvestigacion();
        $grupo_investigacion->nombre                                 = $request->nombre;
        $grupo_investigacion->acronimo                               = $request->acronimo;
        $grupo_investigacion->email                                  = $request->email;
        $grupo_investigacion->enlace_gruplac                         = $request->enlace_gruplac;
        $grupo_investigacion->codigo_minciencias                     = $request->codigo_minciencias;
        $grupo_investigacion->categoria_minciencias                  = $request->categoria_minciencias;
        $grupo_investigacion->mision                                 = $request->mision;
        $grupo_investigacion->vision                                 = $request->vision;
        $grupo_investigacion->fecha_creacion_grupo                   = $request->fecha_creacion_grupo;
        $grupo_investigacion->nombre_lider_grupo                     = $request->nombre_lider_grupo;
        $grupo_investigacion->email_contacto                         = $request->email_contacto;
        $grupo_investigacion->programa_nal_ctei_principal            = $request->programa_nal_ctei_principal;
        $grupo_investigacion->programa_nal_ctei_secundaria           = $request->programa_nal_ctei_secundaria;
        $grupo_investigacion->reconocimientos_grupo_investigacion    = $request->reconocimientos_grupo_investigacion;
        $grupo_investigacion->objetivo_general                       = $request->objetivo_general;
        $grupo_investigacion->objetivos_especificos                  = $request->objetivos_especificos;
        $grupo_investigacion->link_propio_grupo                      = $request->link_propio_grupo;

        $grupo_investigacion->centroFormacion()->associate($request->centro_formacion_id);

        if ($grupo_investigacion->save()) {
            $this->saveFilesSharepoint($request, $grupo_investigacion);
        }

        $grupo_investigacion->redesConocimiento()->attach($request->redes_conocimiento);

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

        $grupo_investigacion->nombre                                 = $request->nombre;
        $grupo_investigacion->acronimo                               = $request->acronimo;
        $grupo_investigacion->email                                  = $request->email;
        $grupo_investigacion->enlace_gruplac                         = $request->enlace_gruplac;
        $grupo_investigacion->codigo_minciencias                     = $request->codigo_minciencias;
        $grupo_investigacion->categoria_minciencias                  = $request->categoria_minciencias;
        $grupo_investigacion->mision                                 = $request->mision;
        $grupo_investigacion->vision                                 = $request->vision;
        $grupo_investigacion->fecha_creacion_grupo                   = $request->fecha_creacion_grupo;
        $grupo_investigacion->nombre_lider_grupo                     = $request->nombre_lider_grupo;
        $grupo_investigacion->email_contacto                         = $request->email_contacto;
        $grupo_investigacion->programa_nal_ctei_principal            = $request->programa_nal_ctei_principal;
        $grupo_investigacion->programa_nal_ctei_secundaria           = $request->programa_nal_ctei_secundaria;
        $grupo_investigacion->reconocimientos_grupo_investigacion    = $request->reconocimientos_grupo_investigacion;
        $grupo_investigacion->objetivo_general                       = $request->objetivo_general;
        $grupo_investigacion->objetivos_especificos                  = $request->objetivos_especificos;
        $grupo_investigacion->link_propio_grupo                      = $request->link_propio_grupo;

        $grupo_investigacion->centroFormacion()->associate($request->centro_formacion_id);

        if ($grupo_investigacion->save()) {
            if ($request->hasFile('formato_gic_f_020') || $request->hasFile('formato_gic_f_032')) {
                $this->saveFilesSharepoint($request, $grupo_investigacion);
            }
        }

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

    public function saveFilesSharepoint(Request $request, GrupoInvestigacion $grupo_investigacion)
    {
        $request->validate([
            'formato_gic_f_020' => 'nullable|file|max:10240',
            'formato_gic_f_032' => 'nullable|file|max:10240',
        ]);

        $response = [];

        if ($request->hasFile('formato_gic_f_020')) {
            $response = SharepointHelper::saveFilesSharepoint($request, 'formato_gic_f_020', $grupo_investigacion, $grupo_investigacion->id . 'formato_gic_f_020');
        }

        if ($request->hasFile('formato_gic_f_032')) {
            $response = SharepointHelper::saveFilesSharepoint($request, 'formato_gic_f_032', $grupo_investigacion, $grupo_investigacion->id . 'formato_gic_f_032');
        }

        if (count($response) > 0 && $response['success']) {
            return back()->with('success', 'Los archivos se han cargado correctamente');
        } else if (count($response) > 0 && $response['success'] == false) {
            return back()->with('error', 'No se han podido cargar los archivos. Por favor vuelva a intentar');
        }
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
