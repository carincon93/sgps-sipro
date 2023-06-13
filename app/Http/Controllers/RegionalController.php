<?php

namespace App\Http\Controllers;

use App\Helpers\SelectHelper;
use App\Http\Requests\RegionalRequest;
use App\Models\Regional;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RegionalController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $this->authorize('viewAny', [Regional::class]);

        return Inertia::render('Regionales/Index', [
            'filters'       => request()->all('search'),
            'regionales'    => Regional::orderBy('nombre', 'ASC')
                ->filterRegional(request()->only('search'))->paginate()->appends(['search' => request()->search]),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        $this->authorize('create', [Regional::class]);

        return Inertia::render('Regionales/Create', [
            'regiones'              => SelectHelper::regiones(),
            'directoresRegionales'  => SelectHelper::usuariosPorRol('director regional')
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(RegionalRequest $request)
    {
        $this->authorize('create', [Regional::class]);

        $regional = new Regional();
        $regional->nombre = $request->nombre;
        $regional->codigo = $request->codigo;
        $regional->region()->associate($request->region_id);
        $regional->directorRegional()->associate($request->director_regional_id);

        $regional->save();

        return redirect()->route('regionales.index')->with('success', 'El recurso se ha creado correctamente.');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Regional  $regional
     * @return \Illuminate\Http\Response
     */
    public function show(Regional $regional)
    {
        $this->authorize('view', [Regional::class, $regional]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Regional  $regional
     * @return \Illuminate\Http\Response
     */
    public function edit(Regional $regional)
    {
        $this->authorize('update', [Regional::class, $regional]);

        return Inertia::render('Regionales/Edit', [
            'regional'              => $regional,
            'regiones'              => SelectHelper::regiones(),
            'directoresRegionales'  => SelectHelper::usuariosPorRol('director regional')
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Regional  $regional
     * @return \Illuminate\Http\Response
     */
    public function update(RegionalRequest $request, Regional $regional)
    {
        $this->authorize('update', [Regional::class, $regional]);

        $regional->nombre = $request->nombre;
        $regional->codigo = $request->codigo;
        $regional->region()->associate($request->region_id);
        $regional->directorRegional()->associate($request->director_regional_id);

        $regional->save();

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Regional  $regional
     * @return \Illuminate\Http\Response
     */
    public function destroy(Regional $regional)
    {
        $this->authorize('delete', [Regional::class, $regional]);

        // No se pueden eliminar regionales, solo el admin DB
        // $regional->delete();

        return back()->with('error', 'No se puede eliminar el recurso debido a que hay información relacionada. Comuníquese con el administrador del sistema.');
    }
}
