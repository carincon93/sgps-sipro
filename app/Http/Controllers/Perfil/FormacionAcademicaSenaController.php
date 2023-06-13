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

        return Inertia::render('Users/Perfil/FormacionesAcademicasSena/Create', [
            'nivelesFormacion'      => json_decode(Storage::get('json/niveles-formacion.json'), true),
            'modalidadesEstudio'    => json_decode(Storage::get('json/modalidades-estudio.json'), true),
        ]);
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

        $request->merge(['user_id' => Auth::user()->id]);

        $formacionAcademicaSena = FormacionAcademicaSena::create($request->all());

        if ($request->hasFile('certificado_formacion')) {
            // CENSO2023 Quemado
            $this->saveFilesSharepoint($request->certificado_formacion, 'CENSO2023', $formacionAcademicaSena, 'certificado_formacion');
        }

        return redirect()->route('users.change-user-profile')->with('success', 'El recurso se ha creado correctamente.');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\FormacionAcademicaSena  $formacionAcademicaSena
     * @return \Illuminate\Http\Response
     */
    public function show(FormacionAcademicaSena $formacionAcademicaSena)
    {
        // 
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\FormacionAcademicaSena  $formacionAcademicaSena
     * @return \Illuminate\Http\Response
     */
    public function edit(FormacionAcademicaSena $formacionAcademicaSena)
    {
        $this->authorize('update', [FormacionAcademicaSena::class, $formacionAcademicaSena]);

        $formacionAcademicaSena->egresado_sena = $formacionAcademicaSena->egresado_sena ? 1 : 2;

        return Inertia::render('Users/Perfil/FormacionesAcademicasSena/Edit', [
            'formacionAcademicaSena'    => $formacionAcademicaSena,
            'nivelesFormacion'          => json_decode(Storage::get('json/niveles-formacion.json'), true),
            'modalidadesEstudio'        => json_decode(Storage::get('json/modalidades-estudio.json'), true),
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\FormacionAcademicaSena  $formacionAcademicaSena
     * @return \Illuminate\Http\Response
     */
    public function update(FormacionAcademicaSenaRequest $request, FormacionAcademicaSena $formacionAcademicaSena)
    {
        $this->authorize('update', [FormacionAcademicaSena::class, $formacionAcademicaSena]);

        $formacionAcademicaSena->update($request->validated());

        if ($request->hasFile('certificado_formacion')) {
            // CENSO2023 Quemado
            $this->saveFilesSharepoint($request->certificado_formacion, 'CENSO2023', $formacionAcademicaSena, 'certificado_formacion');
        }

        return redirect()->back()->with('success', 'El recurso se ha actualizado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\FormacionAcademicaSena  $formacionAcademicaSena
     * @return \Illuminate\Http\Response
     */
    public function destroy(FormacionAcademicaSena $formacionAcademicaSena)
    {
        $this->authorize('delete', [FormacionAcademicaSena::class, $formacionAcademicaSena]);

        $formacionAcademicaSena->delete();

        return redirect()->route('users.change-user-profile')->with('success', 'El recurso se ha eliminado correctamente.');
    }

    public function saveFilesSharepoint($tmpFile, $modulo, $modelo, $campoBd)
    {
        $user = Auth::user();
        
        $centroFormacionSharePoint = $user->centroFormacion->nombre_carpeta_sharepoint;

        $sharePointPath = "$modulo/$centroFormacionSharePoint/$user->nombre_carpeta_sharepoint";
        SharepointHelper::saveFilesSharepoint($tmpFile, $modelo, $sharePointPath, $campoBd);
    }
}
