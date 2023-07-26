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
            'filters'               => request()->all('search'),
            'programasFormacion'    => ProgramaFormacion::getProgramasFormacionByRol()->appends(['search' => request()->search]),
            'allowed_to_create'       => Gate::inspect('create', [ProgramaFormacion::class])->allowed()
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

        return Inertia::render('ProgramasFormacion/Create', [
            'centrosFormacion'      => CentroFormacion::selectRaw('centros_formacion.id as value, concat(centros_formacion.nombre, chr(10), \'∙ Código: \', centros_formacion.codigo, chr(10), \'∙ Regional: \', regionales.nombre) as label')->join('regionales', 'centros_formacion.regional_id', 'regionales.id')->orderBy('centros_formacion.nombre', 'ASC')->get(),
            'modalidades'           => json_decode(Storage::get('json/modalidades-estudio.json'), true),
            'nivelesFormacion'      => json_decode(Storage::get('json/nivel-formacion.json'), true),
            'allowed_to_create'       => Gate::inspect('create', [ProgramaFormacion::class])->allowed()
        ]);
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

        $programaFormacion = new ProgramaFormacion();
        $programaFormacion->nombre              = $request->nombre;
        $programaFormacion->codigo              = $request->codigo;
        $programaFormacion->modalidad           = $request->modalidad;
        $programaFormacion->nivel_formacion     = $request->nivel_formacion;
        $programaFormacion->registro_calificado = $request->registro_calificado;
        $programaFormacion->centroFormacion()->associate($request->centro_formacion_id);

        $programaFormacion->save();

        return redirect()->route('programas-formacion.index')->with('success', 'El recurso se ha creado correctamente.');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\ProgramaFormacion  $programaFormacion
     * @return \Illuminate\Http\Response
     */
    public function show(ProgramaFormacion $programaFormacion)
    {
        $this->authorize('view', [ProgramaFormacion::class, $programaFormacion]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\ProgramaFormacion  $programaFormacion
     * @return \Illuminate\Http\Response
     */
    public function edit(ProgramaFormacion $programaFormacion)
    {
        $this->authorize('update', [ProgramaFormacion::class, $programaFormacion]);

        return Inertia::render('ProgramasFormacion/Edit', [
            'programaFormacion'     => $programaFormacion,
            'centrosFormacion'      => CentroFormacion::selectRaw('centros_formacion.id as value, concat(centros_formacion.nombre, chr(10), \'∙ Código: \', centros_formacion.codigo, chr(10), \'∙ Regional: \', regionales.nombre) as label')->join('regionales', 'centros_formacion.regional_id', 'regionales.id')->orderBy('centros_formacion.nombre', 'ASC')->get(),
            'modalidades'           => json_decode(Storage::get('json/modalidades-estudio.json'), true),
            'nivelesFormacion'      => json_decode(Storage::get('json/nivel-formacion.json'), true)
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\ProgramaFormacion  $programaFormacion
     * @return \Illuminate\Http\Response
     */
    public function update(ProgramaFormacionRequest $request, ProgramaFormacion $programaFormacion)
    {
        $this->authorize('update', [ProgramaFormacion::class, $programaFormacion]);

        $programaFormacion->nombre              = $request->nombre;
        $programaFormacion->codigo              = $request->codigo;
        $programaFormacion->modalidad           = $request->modalidad;
        $programaFormacion->nivel_formacion     = $request->nivel_formacion;
        $programaFormacion->registro_calificado = $request->registro_calificado;
        $programaFormacion->centroFormacion()->associate($request->centro_formacion_id);

        $programaFormacion->save();

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\ProgramaFormacion  $programaFormacion
     * @return \Illuminate\Http\Response
     */
    public function destroy(ProgramaFormacion $programaFormacion)
    {
        $this->authorize('delete', [ProgramaFormacion::class, $programaFormacion]);

        $programaFormacion->delete();

        return redirect()->route('programas-formacion.index')->with('success', 'El recurso se ha eliminado correctamente.');
    }
}
