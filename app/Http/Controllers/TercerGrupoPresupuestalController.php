<?php

namespace App\Http\Controllers;

use App\Http\Requests\TercerGrupoPresupuestalRequest;
use App\Models\TercerGrupoPresupuestal;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TercerGrupoPresupuestalController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $this->authorize('viewAny', [TercerGrupoPresupuestal::class]);

        return Inertia::render('Presupuesto/TercerGrupoPresupuestal/Index', [
            'filters'                   => request()->all('search'),
            'tercerGrupoPresupuestal'   => TercerGrupoPresupuestal::orderBy('nombre', 'ASC')
                ->filterTercerGrupoPresupuestal(request()->only('search'))->paginate()->appends(['search' => request()->search]),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        $this->authorize('create', [TercerGrupoPresupuestal::class]);

        return Inertia::render('Presupuesto/TercerGrupoPresupuestal/Create');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(TercerGrupoPresupuestalRequest $request)
    {
        $this->authorize('create', [TercerGrupoPresupuestal::class]);

        $tercerGrupoPresupuestal = new TercerGrupoPresupuestal();
        $tercerGrupoPresupuestal->nombre = $request->nombre;
        $tercerGrupoPresupuestal->codigo = $request->codigo;

        $tercerGrupoPresupuestal->save();

        return redirect()->route('tercer-grupo-presupuestal.index')->with('success', 'El recurso se ha creado correctamente.');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\TercerGrupoPresupuestal  $tercerGrupoPresupuestal
     * @return \Illuminate\Http\Response
     */
    public function show(TercerGrupoPresupuestal $tercerGrupoPresupuestal)
    {
        $this->authorize('view', [TercerGrupoPresupuestal::class, $tercerGrupoPresupuestal]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\TercerGrupoPresupuestal  $tercerGrupoPresupuestal
     * @return \Illuminate\Http\Response
     */
    public function edit(TercerGrupoPresupuestal $tercerGrupoPresupuestal)
    {
        $this->authorize('update', [TercerGrupoPresupuestal::class, $tercerGrupoPresupuestal]);

        return Inertia::render('Presupuesto/TercerGrupoPresupuestal/Edit', [
            'rubroTercerGrupoPresupuestal' => $tercerGrupoPresupuestal
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\TercerGrupoPresupuestal  $tercerGrupoPresupuestal
     * @return \Illuminate\Http\Response
     */
    public function update(TercerGrupoPresupuestalRequest $request, TercerGrupoPresupuestal $tercerGrupoPresupuestal)
    {
        $this->authorize('update', [TercerGrupoPresupuestal::class, $tercerGrupoPresupuestal]);

        $tercerGrupoPresupuestal->nombre = $request->nombre;
        $tercerGrupoPresupuestal->codigo = $request->codigo;

        $tercerGrupoPresupuestal->save();

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\TercerGrupoPresupuestal  $tercerGrupoPresupuestal
     * @return \Illuminate\Http\Response
     */
    public function destroy(TercerGrupoPresupuestal $tercerGrupoPresupuestal)
    {
        $this->authorize('delete', [TercerGrupoPresupuestal::class, $tercerGrupoPresupuestal]);

        $tercerGrupoPresupuestal->delete();

        return redirect()->route('tercer-grupo-presupuestal.index')->with('success', 'El recurso se ha eliminado correctamente.');
    }
}
