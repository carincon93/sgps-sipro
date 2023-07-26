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

        return Inertia::render('Users/Perfil/EstudiosAcademicos/Create', [
            'nivelesAcademicos' => json_decode(Storage::get('json/niveles-academicos.json'), true),
        ]);
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

        $request->merge(['user_id' => Auth::user()->id]);

        $estudioAcademico = EstudioAcademico::create($request->all());

        if ($request->hasFile('soporte_titulo_obtenido')) {
            // CENSO2023 Quemado
            $this->saveFilesSharepoint($request->soporte_titulo_obtenido, 'CENSO2023', $estudioAcademico, 'soporte_titulo_obtenido');
        }

        return redirect()->route('users.change-user-profile')->with('success', 'El recurso se ha creado correctamente.');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\EstudioAcademico  $estudioAcademico
     * @return \Illuminate\Http\Response
     */
    public function show(EstudioAcademico $estudioAcademico)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\EstudioAcademico  $estudioAcademico
     * @return \Illuminate\Http\Response
     */
    public function edit(EstudioAcademico $estudioAcademico)
    {
        $this->authorize('update', [EstudioAcademico::class, $estudioAcademico]);

        return Inertia::render('Users/Perfil/EstudiosAcademicos/Edit', [
            'estudioAcademico'  => $estudioAcademico,
            'nivelesAcademicos' => json_decode(Storage::get('json/niveles-academicos.json'), true),
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\EstudioAcademico  $estudioAcademico
     * @return \Illuminate\Http\Response
     */
    public function update(EstudioAcademicoRequest $request, EstudioAcademico $estudioAcademico)
    {
        $this->authorize('update', [EstudioAcademico::class, $estudioAcademico]);

        $estudioAcademico->update($request->validated());

        if ($request->hasFile('soporte_titulo_obtenido')) {
            // CENSO2023 Quemado
            $this->saveFilesSharepoint($request->soporte_titulo_obtenido, 'CENSO2023', $estudioAcademico, 'soporte_titulo_obtenido');
        }

        return redirect()->back()->with('success', 'El recurso se ha actualizado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\EstudioAcademico  $estudioAcademico
     * @return \Illuminate\Http\Response
     */
    public function destroy(EstudioAcademico $estudioAcademico)
    {
        $this->authorize('delete', [EstudioAcademico::class, $estudioAcademico]);

        $estudioAcademico->delete();

        return redirect()->route('users.change-user-profile')->with('success', 'El recurso se ha eliminado correctamente.');
    }

    public function saveFilesSharepoint($tmp_file, $modulo, $modelo, $campo_bd)
    {
        $user = Auth::user();

        $centroFormacionSharePoint = $user->centroFormacion->nombre_carpeta_sharepoint;

        $sharepoint_path = "$modulo/$centroFormacionSharePoint/$user->nombre_carpeta_sharepoint";
        SharepointHelper::saveFilesSharepoint($tmp_file, $modelo, $sharepoint_path, $campo_bd);
    }
}
