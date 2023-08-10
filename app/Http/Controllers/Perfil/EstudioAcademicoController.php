<?php

namespace App\Http\Controllers\Perfil;

use App\Helpers\SharepointHelper;
use App\Models\Perfil\EstudioAcademico;
use App\Http\Controllers\Controller;
use App\Http\Requests\Perfil\EstudioAcademicoRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class EstudioAcademicoController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        $this->authorize('create', [EstudioAcademico::class]);

        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(EstudioAcademicoRequest $request)
    {
        $this->authorize('create', [EstudioAcademico::class]);

        $estudio_academico = EstudioAcademico::create($request->validated());

        if ($request->hasFile('soporte_titulo_obtenido')) {
            // CENSO2023 Quemado
            return $this->saveFilesSharepoint($request->soporte_titulo_obtenido, 'CENSO2023', $estudio_academico, 'soporte_titulo_obtenido');
        }

        return back()->with('success', 'El recurso se ha creado correctamente.');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\EstudioAcademico  $estudio_academico
     * @return \Illuminate\Http\Response
     */
    public function show(EstudioAcademico $estudio_academico)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\EstudioAcademico  $estudio_academico
     * @return \Illuminate\Http\Response
     */
    public function edit(EstudioAcademico $estudio_academico)
    {
        $this->authorize('update', [EstudioAcademico::class, $estudio_academico]);

        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\EstudioAcademico  $estudio_academico
     * @return \Illuminate\Http\Response
     */
    public function update(EstudioAcademicoRequest $request, EstudioAcademico $estudio_academico)
    {
        $this->authorize('update', [EstudioAcademico::class, $estudio_academico]);

        $estudio_academico->update($request->validated());

        if ($request->hasFile('soporte_titulo_obtenido')) {
            // CENSO2023 Quemado
            return $this->saveFilesSharepoint($request->soporte_titulo_obtenido, 'CENSO2023', $estudio_academico, 'soporte_titulo_obtenido');
        }

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\EstudioAcademico  $estudio_academico
     * @return \Illuminate\Http\Response
     */
    public function destroy(EstudioAcademico $estudio_academico)
    {
        $this->authorize('delete', [EstudioAcademico::class, $estudio_academico]);

        $estudio_academico->delete();

        return back()->with('success', 'El recurso se ha eliminado correctamente.');
    }

    public function saveFilesSharepoint($tmp_file, $modulo, $modelo, $campo_bd)
    {
        $user = Auth::user();

        $sharepoint_centro_formacion = $user->centroFormacion->nombre_carpeta_sharepoint;

        $sharepoint_path = "$modulo/$sharepoint_centro_formacion/$user->nombre_carpeta_sharepoint";
        SharepointHelper::saveFilesSharepoint($tmp_file, $modelo, $sharepoint_path, $campo_bd);
    }

    public function downloadFileSharepoint(EstudioAcademico $estudio_academico, $tipo_archivo)
    {
        $sharepoint_path = $estudio_academico[$tipo_archivo];

        return SharepointHelper::downloadFile($sharepoint_path);
    }
}
