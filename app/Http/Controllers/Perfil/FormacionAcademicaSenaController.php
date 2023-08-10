<?php

namespace App\Http\Controllers\Perfil;

use App\Helpers\SharepointHelper;
use App\Models\Perfil\FormacionAcademicaSena;
use App\Http\Controllers\Controller;
use App\Http\Requests\Perfil\FormacionAcademicaSenaRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class FormacionAcademicaSenaController extends Controller
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
        $this->authorize('create', [FormacionAcademicaSena::class]);

        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(FormacionAcademicaSenaRequest $request)
    {
        $this->authorize('create', [FormacionAcademicaSena::class]);

        $formacion_academica_sena = FormacionAcademicaSena::create($request->validated());

        if ($request->hasFile('certificado_formacion')) {
            // CENSO2023 Quemado
            return $this->saveFilesSharepoint($request->certificado_formacion, 'CENSO2023', $formacion_academica_sena, 'certificado_formacion');
        }

        return back()->with('success', 'El recurso se ha creado correctamente.');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\FormacionAcademicaSena  $formacion_academica_sena
     * @return \Illuminate\Http\Response
     */
    public function show(FormacionAcademicaSena $formacion_academica_sena)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\FormacionAcademicaSena  $formacion_academica_sena
     * @return \Illuminate\Http\Response
     */
    public function edit(FormacionAcademicaSena $formacion_academica_sena)
    {
        $this->authorize('update', [FormacionAcademicaSena::class, $formacion_academica_sena]);

        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\FormacionAcademicaSena  $formacion_academica_sena
     * @return \Illuminate\Http\Response
     */
    public function update(FormacionAcademicaSenaRequest $request, FormacionAcademicaSena $formacion_academica_sena)
    {
        $this->authorize('update', [FormacionAcademicaSena::class, $formacion_academica_sena]);

        $formacion_academica_sena->update($request->validated());

        if ($request->hasFile('certificado_formacion')) {
            // CENSO2023 Quemado
            return $this->saveFilesSharepoint($request->certificado_formacion, 'CENSO2023', $formacion_academica_sena, 'certificado_formacion');
        }

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\FormacionAcademicaSena  $formacion_academica_sena
     * @return \Illuminate\Http\Response
     */
    public function destroy(FormacionAcademicaSena $formacion_academica_sena)
    {
        $this->authorize('delete', [FormacionAcademicaSena::class, $formacion_academica_sena]);

        $formacion_academica_sena->delete();

        return back()->with('success', 'El recurso se ha eliminado correctamente.');
    }

    public function saveFilesSharepoint($tmp_file, $modulo, $modelo, $campo_bd)
    {
        $user = Auth::user();

        $sharepoint_centro_formacion = $user->centroFormacion->nombre_carpeta_sharepoint;

        $sharepoint_path = "$modulo/$sharepoint_centro_formacion/$user->nombre_carpeta_sharepoint";
        SharepointHelper::saveFilesSharepoint($tmp_file, $modelo, $sharepoint_path, $campo_bd);
    }

    public function downloadFileSharepoint(FormacionAcademicaSena $formacion_academica_sena, $tipo_archivo)
    {
        $sharepoint_path = $formacion_academica_sena[$tipo_archivo];

        return SharepointHelper::downloadFile($sharepoint_path);
    }
}
