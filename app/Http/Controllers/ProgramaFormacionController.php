<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProgramaFormacionRequest;
use App\Models\CentroFormacion;
use App\Models\ProgramaFormacion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProgramaFormacionController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $this->authorize('viewAny', [ProgramaFormacion::class]);

        return Inertia::render('ProgramasFormacion/Index', [
            'programas_formacion'   => ProgramaFormacion::getProgramasFormacionByRol()->appends(['search' => request()->search]),
            'modalidades'           => json_decode(Storage::get('json/modalidades-estudio.json'), true),
            'niveles_formacion'     => json_decode(Storage::get('json/nivel-formacion.json'), true),
            'allowed_to_create'     => Gate::inspect('create', [ProgramaFormacion::class])->allowed()
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        $this->authorize('create', [ProgramaFormacion::class]);

        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(ProgramaFormacionRequest $request)
    {
        $this->authorize('create', [ProgramaFormacion::class]);

        $programa_formacion = ProgramaFormacion::create($request->validated());

        return back()->with('success', 'El recurso se ha creado correctamente.');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\ProgramaFormacion  $programa_formacion
     * @return \Illuminate\Http\Response
     */
    public function show(ProgramaFormacion $programa_formacion)
    {
        $this->authorize('view', [ProgramaFormacion::class, $programa_formacion]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\ProgramaFormacion  $programa_formacion
     * @return \Illuminate\Http\Response
     */
    public function edit(ProgramaFormacion $programa_formacion)
    {
        $this->authorize('update', [ProgramaFormacion::class, $programa_formacion]);

        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\ProgramaFormacion  $programa_formacion
     * @return \Illuminate\Http\Response
     */
    public function update(ProgramaFormacionRequest $request, ProgramaFormacion $programa_formacion)
    {
        $this->authorize('update', [ProgramaFormacion::class, $programa_formacion]);

        $programa_formacion->update($request->validated());

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\ProgramaFormacion  $programa_formacion
     * @return \Illuminate\Http\Response
     */
    public function destroy(ProgramaFormacion $programa_formacion)
    {
        $this->authorize('delete', [ProgramaFormacion::class, $programa_formacion]);

        $programa_formacion->delete();

        return back()->with('success', 'El recurso se ha eliminado correctamente.');
    }
}
