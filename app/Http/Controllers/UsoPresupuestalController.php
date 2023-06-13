<?php

namespace App\Http\Controllers;

use App\Http\Requests\UsoPresupuestalRequest;
use App\Models\UsoPresupuestal;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UsoPresupuestalController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $this->authorize('viewAny', [UsoPresupuestal::class]);

        return Inertia::render('Presupuesto/UsosPresupuestales/Index', [
            'filters'               => request()->all('search'),
            'usosPresupuestales'    => UsoPresupuestal::orderBy('descripcion', 'ASC')
                ->filterUsoPresupuestal(request()->only('search'))->paginate()->appends(['search' => request()->search]),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        $this->authorize('create', [UsoPresupuestal::class]);

        return Inertia::render('Presupuesto/UsosPresupuestales/Create');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(UsoPresupuestalRequest $request)
    {
        $this->authorize('create', [UsoPresupuestal::class]);

        $usoPresupuestal = new UsoPresupuestal();
        $usoPresupuestal->descripcion   = $request->descripcion;
        $usoPresupuestal->codigo        = $request->codigo;

        $usoPresupuestal->save();

        return redirect()->route('usos-presupuestales.index')->with('success', 'El recurso se ha creado correctamente.');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\UsoPresupuestal  $usoPresupuestal
     * @return \Illuminate\Http\Response
     */
    public function show(UsoPresupuestal $usoPresupuestal)
    {
        $this->authorize('view', [UsoPresupuestal::class, $usoPresupuestal]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\UsoPresupuestal  $usoPresupuestal
     * @return \Illuminate\Http\Response
     */
    public function edit(UsoPresupuestal $usoPresupuestal)
    {
        $this->authorize('update', [UsoPresupuestal::class, $usoPresupuestal]);

        return Inertia::render('Presupuesto/UsosPresupuestales/Edit', [
            'usoPresupuestal' => $usoPresupuestal
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\UsoPresupuestal  $usoPresupuestal
     * @return \Illuminate\Http\Response
     */
    public function update(UsoPresupuestalRequest $request, UsoPresupuestal $usoPresupuestal)
    {
        $this->authorize('update', [UsoPresupuestal::class, $usoPresupuestal]);

        $usoPresupuestal->descripcion   = $request->descripcion;
        $usoPresupuestal->codigo        = $request->codigo;

        $usoPresupuestal->save();

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\UsoPresupuestal  $usoPresupuestal
     * @return \Illuminate\Http\Response
     */
    public function destroy(UsoPresupuestal $usoPresupuestal)
    {
        $this->authorize('delete', [UsoPresupuestal::class, $usoPresupuestal]);

        $usoPresupuestal->delete();

        return redirect()->route('usos-presupuestales.index')->with('success', 'El recurso se ha eliminado correctamente.');
    }
}
