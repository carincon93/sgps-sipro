<?php

namespace App\Http\Controllers;

use App\Helpers\SharepointHelper;
use App\Helpers\SelectHelper;
use App\Http\Requests\StoreGrupoInvestigacionRequest;
use App\Http\Requests\UpdateGrupoInvestigacionRequest;
use App\Models\CentroFormacion;
use App\Models\GrupoInvestigacion;
use App\Models\RedConocimiento;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
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
        $authUser = Auth::user();

        return Inertia::render('GruposInvestigacion/Index', [
            'filters'                               => request()->all('search'),
            'gruposInvestigacion'                   => GrupoInvestigacion::select('grupos_investigacion.id', 'grupos_investigacion.nombre', 'grupos_investigacion.centro_formacion_id')->with('centroFormacion.regional')->filterGrupoInvestigacion(request()->only('search', 'grupoInvestigacion'))->orderBy('grupos_investigacion.nombre', 'ASC')->paginate(),
            'gruposInvestigacionCentroFormacion'    => GrupoInvestigacion::select('grupos_investigacion.id', 'grupos_investigacion.nombre', 'grupos_investigacion.centro_formacion_id')->where('grupos_investigacion.centro_formacion_id', $authUser->centro_formacion_id)->with('centroFormacion.regional')->get(),
            'allowedToCreate'                       => Gate::inspect('create', [GrupoInvestigacion::class])->allowed()
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

        return Inertia::render('GruposInvestigacion/Create', [
            'categoriasMinciencias' => json_decode(Storage::get('json/categorias-minciencias.json'), true),
            'redesConocimiento'     => SelectHelper::redesConocimiento(),
            'centrosFormacion'      => SelectHelper::centrosFormacion(),
            'allowedToCreate'       => Gate::inspect('create', [GrupoInvestigacion::class])->allowed()
        ]);
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

        $grupoInvestigacion = new GrupoInvestigacion();
        $grupoInvestigacion->nombre                                 = $request->nombre;
        $grupoInvestigacion->acronimo                               = $request->acronimo;
        $grupoInvestigacion->email                                  = $request->email;
        $grupoInvestigacion->enlace_gruplac                         = $request->enlace_gruplac;
        $grupoInvestigacion->codigo_minciencias                     = $request->codigo_minciencias;
        $grupoInvestigacion->categoria_minciencias                  = $request->categoria_minciencias;
        $grupoInvestigacion->mision                                 = $request->mision;
        $grupoInvestigacion->vision                                 = $request->vision;
        $grupoInvestigacion->fecha_creacion_grupo                   = $request->fecha_creacion_grupo;
        $grupoInvestigacion->nombre_lider_grupo                     = $request->nombre_lider_grupo;
        $grupoInvestigacion->email_contacto                         = $request->email_contacto;
        $grupoInvestigacion->programa_nal_ctei_principal            = $request->programa_nal_ctei_principal;
        $grupoInvestigacion->programa_nal_ctei_secundaria           = $request->programa_nal_ctei_secundaria;
        $grupoInvestigacion->reconocimientos_grupo_investigacion    = $request->reconocimientos_grupo_investigacion;
        $grupoInvestigacion->objetivo_general                       = $request->objetivo_general;
        $grupoInvestigacion->objetivos_especificos                  = $request->objetivos_especificos;
        $grupoInvestigacion->link_propio_grupo                      = $request->link_propio_grupo;

        $grupoInvestigacion->centroFormacion()->associate($request->centro_formacion_id);

        if ($grupoInvestigacion->save()) {
            $this->saveFilesSharepoint($request, $grupoInvestigacion);
        }

        $grupoInvestigacion->redesConocimiento()->attach($request->redes_conocimiento);

        return redirect()->route('grupos-investigacion.edit', [$grupoInvestigacion])->with('success', 'El recurso se ha creado correctamente.');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\GrupoInvestigacion  $grupoInvestigacion
     * @return \Illuminate\Http\Response
     */
    public function show(GrupoInvestigacion $grupoInvestigacion)
    {
        $this->authorize('view', [GrupoInvestigacion::class, $grupoInvestigacion]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\GrupoInvestigacion  $grupoInvestigacion
     * @return \Illuminate\Http\Response
     */
    public function edit(GrupoInvestigacion $grupoInvestigacion)
    {
        $this->authorize('view', [GrupoInvestigacion::class, $grupoInvestigacion]);

        return Inertia::render('GruposInvestigacion/Edit', [
            'grupoInvestigacion'                    => $grupoInvestigacion,
            'redesConocimiento'                     => SelectHelper::redesConocimiento(),
            'centrosFormacion'                      => SelectHelper::centrosFormacion(),
            'categoriasMinciencias'                 => json_decode(Storage::get('json/categorias-minciencias.json'), true),
            'redesConocimientoGrupoInvestigacion'   => $grupoInvestigacion->redesConocimiento()->select('redes_conocimiento.id as value', 'redes_conocimiento.nombre as label')->get(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\GrupoInvestigacion  $grupoInvestigacion
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateGrupoInvestigacionRequest $request, GrupoInvestigacion $grupoInvestigacion)
    {
        $this->authorize('update', [GrupoInvestigacion::class, $grupoInvestigacion]);

        $grupoInvestigacion->nombre                                 = $request->nombre;
        $grupoInvestigacion->acronimo                               = $request->acronimo;
        $grupoInvestigacion->email                                  = $request->email;
        $grupoInvestigacion->enlace_gruplac                         = $request->enlace_gruplac;
        $grupoInvestigacion->codigo_minciencias                     = $request->codigo_minciencias;
        $grupoInvestigacion->categoria_minciencias                  = $request->categoria_minciencias;
        $grupoInvestigacion->mision                                 = $request->mision;
        $grupoInvestigacion->vision                                 = $request->vision;
        $grupoInvestigacion->fecha_creacion_grupo                   = $request->fecha_creacion_grupo;
        $grupoInvestigacion->nombre_lider_grupo                     = $request->nombre_lider_grupo;
        $grupoInvestigacion->email_contacto                         = $request->email_contacto;
        $grupoInvestigacion->programa_nal_ctei_principal            = $request->programa_nal_ctei_principal;
        $grupoInvestigacion->programa_nal_ctei_secundaria           = $request->programa_nal_ctei_secundaria;
        $grupoInvestigacion->reconocimientos_grupo_investigacion    = $request->reconocimientos_grupo_investigacion;
        $grupoInvestigacion->objetivo_general                       = $request->objetivo_general;
        $grupoInvestigacion->objetivos_especificos                  = $request->objetivos_especificos;
        $grupoInvestigacion->link_propio_grupo                      = $request->link_propio_grupo;

        $grupoInvestigacion->centroFormacion()->associate($request->centro_formacion_id);

        if ($grupoInvestigacion->save()) {
            if ($request->hasFile('formato_gic_f_020') || $request->hasFile('formato_gic_f_032')) {
                $this->saveFilesSharepoint($request, $grupoInvestigacion);
            }
        }

        $grupoInvestigacion->redesConocimiento()->sync($request->redes_conocimiento);

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\GrupoInvestigacion  $grupoInvestigacion
     * @return \Illuminate\Http\Response
     */
    public function destroy(GrupoInvestigacion $grupoInvestigacion)
    {
        $this->authorize('delete', [GrupoInvestigacion::class, $grupoInvestigacion]);

        // $grupoInvestigacion->delete();

        return back()->with('error', 'No se puede eliminar el recurso debido a que hay información relacionada. Comuníquese con el administrador del sistema.');
    }

    public function saveFilesSharepoint(Request $request, GrupoInvestigacion $grupoInvestigacion)
    {
        $request->validate([
            'formato_gic_f_020' => 'nullable|file|max:10240',
            'formato_gic_f_032' => 'nullable|file|max:10240',
        ]);

        $response = [];

        if ($request->hasFile('formato_gic_f_020')) {
            $response = SharepointHelper::saveFilesSharepoint($request, 'formato_gic_f_020', $grupoInvestigacion, $grupoInvestigacion->id . 'formato_gic_f_020');
        }

        if ($request->hasFile('formato_gic_f_032')) {
            $response = SharepointHelper::saveFilesSharepoint($request, 'formato_gic_f_032', $grupoInvestigacion, $grupoInvestigacion->id . 'formato_gic_f_032');
        }

        if (count($response) > 0 && $response['success']) {
            return back()->with('success', 'Los archivos se han cargado correctamente');
        } else if (count($response) > 0 && $response['success'] == false) {
            return back()->with('error', 'No se han podido cargar los archivos. Por favor vuelva a intentar');
        }
    }

    public function downloadServerFile(Request $request, GrupoInvestigacion $grupoInvestigacion)
    {
        SharepointHelper::downloadServerFile($grupoInvestigacion, $request->formato);
    }

    public function downloadFileSharepoint(GrupoInvestigacion $grupoInvestigacion, $tipoArchivo)
    {
        SharepointHelper::downloadFileSharepoint($grupoInvestigacion, $tipoArchivo);
    }
}
