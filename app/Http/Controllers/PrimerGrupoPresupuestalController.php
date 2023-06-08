<?php

namespace App\Http\Controllers;

use App\Http\Requests\PrimerGrupoPresupuestalRequest;
use App\Models\PrimerGrupoPresupuestal;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PrimerGrupoPresupuestalController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $this->authorize('viewAny', [PrimerGrupoPresupuestal::class]);

        return Inertia::render('Presupuesto/PrimerGrupoPresupuestal/Index', [
            'filters'   => request()->all('search'),
            'primerGrupoPresupuestal' => PrimerGrupoPresupuestal::orderBy('nombre', 'ASC')
                ->filterPrimerGrupoPresupuestal(request()->only('search'))->paginate()->appends(['search' => request()->search]),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        $this->authorize('create', [PrimerGrupoPresupuestal::class]);

        return Inertia::render('Presupuesto/PrimerGrupoPresupuestal/Create');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(PrimerGrupoPresupuestalRequest $request)
    {
        $this->authorize('create', [PrimerGrupoPresupuestal::class]);

        $primerGrupoPresupuestal = new PrimerGrupoPresupuestal();
        $primerGrupoPresupuestal->nombre   = $request->nombre;
        $primerGrupoPresupuestal->cta      = $request->cta;
        $primerGrupoPresupuestal->bpin     = $request->bpin;

        $primerGrupoPresupuestal->save();

        return redirect()->route('primer-grupo-presupuestal.index')->with('success', 'El recurso se ha creado correctamente.');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\PrimerGrupoPresupuestal  $primerGrupoPresupuestal
     * @return \Illuminate\Http\Response
     */
    public function show(PrimerGrupoPresupuestal $primerGrupoPresupuestal)
    {
        $this->authorize('view', [PrimerGrupoPresupuestal::class, $primerGrupoPresupuestal]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\PrimerGrupoPresupuestal  $primerGrupoPresupuestal
     * @return \Illuminate\Http\Response
     */
    public function edit(PrimerGrupoPresupuestal $primerGrupoPresupuestal)
    {
        $this->authorize('update', [PrimerGrupoPresupuestal::class, $primerGrupoPresupuestal]);

        return Inertia::render('Presupuesto/PrimerGrupoPresupuestal/Edit', [
            'rubroPrimerGrupoPresupuestal' => $primerGrupoPresupuestal
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\PrimerGrupoPresupuestal  $primerGrupoPresupuestal
     * @return \Illuminate\Http\Response
     */
    public function update(PrimerGrupoPresupuestalRequest $request, PrimerGrupoPresupuestal $primerGrupoPresupuestal)
    {
        $this->authorize('update', [PrimerGrupoPresupuestal::class, $primerGrupoPresupuestal]);

        $primerGrupoPresupuestal->nombre   = $request->nombre;
        $primerGrupoPresupuestal->cta      = $request->cta;
        $primerGrupoPresupuestal->bpin     = $request->bpin;

        $primerGrupoPresupuestal->save();

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\PrimerGrupoPresupuestal  $primerGrupoPresupuestal
     * @return \Illuminate\Http\Response
     */
    public function destroy(PrimerGrupoPresupuestal $primerGrupoPresupuestal)
    {
        $this->authorize('delete', [PrimerGrupoPresupuestal::class, $primerGrupoPresupuestal]);

        $primerGrupoPresupuestal->delete();

        return redirect()->route('primer-grupo-presupuestal.index')->with('success', 'El recurso se ha eliminado correctamente.');
    }
}
