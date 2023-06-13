<?php

namespace App\Http\Controllers;

use App\Http\Requests\SegundoGrupoPresupuestalRequest;
use App\Models\SegundoGrupoPresupuestal;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SegundoGrupoPresupuestalController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $this->authorize('viewAny', [SegundoGrupoPresupuestal::class]);

        return Inertia::render('Presupuesto/SegundoGrupoPresupuestal/Index', [
            'filters'   => request()->all('search'),
            'segundoGrupoPresupuestal' => SegundoGrupoPresupuestal::orderBy('nombre', 'ASC')
                ->filterSegundoGrupoPresupuestal(request()->only('search'))->paginate()->appends(['search' => request()->search]),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        $this->authorize('create', [SegundoGrupoPresupuestal::class]);

        return Inertia::render('Presupuesto/SegundoGrupoPresupuestal/Create');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(SegundoGrupoPresupuestalRequest $request)
    {
        $this->authorize('create', [SegundoGrupoPresupuestal::class]);

        $segundoGrupoPresupuestal = new SegundoGrupoPresupuestal();
        $segundoGrupoPresupuestal->nombre = $request->nombre;
        $segundoGrupoPresupuestal->codigo = $request->codigo;

        $segundoGrupoPresupuestal->save();

        return redirect()->route('segundo-grupo-presupuestal.index')->with('success', 'El recurso se ha creado correctamente.');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\SegundoGrupoPresupuestal  $segundoGrupoPresupuestal
     * @return \Illuminate\Http\Response
     */
    public function show(SegundoGrupoPresupuestal $segundoGrupoPresupuestal)
    {
        $this->authorize('view', [SegundoGrupoPresupuestal::class, $segundoGrupoPresupuestal]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\SegundoGrupoPresupuestal  $segundoGrupoPresupuestal
     * @return \Illuminate\Http\Response
     */
    public function edit(SegundoGrupoPresupuestal $segundoGrupoPresupuestal)
    {
        $this->authorize('update', [SegundoGrupoPresupuestal::class, $segundoGrupoPresupuestal]);

        return Inertia::render('Presupuesto/SegundoGrupoPresupuestal/Edit', [
            'rubroSegundoGrupoPresupuestal' => $segundoGrupoPresupuestal
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\SegundoGrupoPresupuestal  $segundoGrupoPresupuestal
     * @return \Illuminate\Http\Response
     */
    public function update(SegundoGrupoPresupuestalRequest $request, SegundoGrupoPresupuestal $segundoGrupoPresupuestal)
    {
        $this->authorize('update', [SegundoGrupoPresupuestal::class, $segundoGrupoPresupuestal]);

        $segundoGrupoPresupuestal->nombre = $request->nombre;
        $segundoGrupoPresupuestal->codigo = $request->codigo;

        $segundoGrupoPresupuestal->save();

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\SegundoGrupoPresupuestal  $segundoGrupoPresupuestal
     * @return \Illuminate\Http\Response
     */
    public function destroy(SegundoGrupoPresupuestal $segundoGrupoPresupuestal)
    {
        $this->authorize('delete', [SegundoGrupoPresupuestal::class, $segundoGrupoPresupuestal]);

        $segundoGrupoPresupuestal->delete();

        return redirect()->route('segundo-grupo-presupuestal.index')->with('success', 'El recurso se ha eliminado correctamente.');
    }
}
