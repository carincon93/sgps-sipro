<?php

namespace App\Http\Controllers;

use App\Helpers\SelectHelper;
use App\Models\Convocatoria;
use App\Models\TopePresupuestalNodoTecnoparque;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class TopePresupuestalNodoTecnoparqueController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Convocatoria $convocatoria)
    {
        $this->authorize('viewAny', [TopePresupuestalNodoTecnoparque::class]);

        return Inertia::render('Convocatorias/TopesRubrosPresupuestalesNodosTecnoparque/Index', [
            'convocatoria'                              => $convocatoria,
            'topes_presupuestales_nodos_tecnoparque'    => TopePresupuestalNodoTecnoparque::select('topes_presupuestales_nodos_tecnoparque.*')->with('nodoTecnoparque', 'segundoGrupoPresupuestal')->where('topes_presupuestales_nodos_tecnoparque.convocatoria_id', $convocatoria->id)->orderBy('topes_presupuestales_nodos_tecnoparque.nodo_tecnoparque_id')->get(),
            'nodos_tecnoparque'                         => SelectHelper::nodosTecnoparque(),
            'segundo_grupo_presupuestal'                => SelectHelper::segundoGrupoPresupuestal($convocatoria->id, 17),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Convocatoria $convocatoria)
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, Convocatoria $convocatoria)
    {
        $tope_presupuestal_tecnoparque = TopePresupuestalNodoTecnoparque::create($request->all());

        $tope_presupuestal_tecnoparque->segundoGrupoPresupuestal()->sync($request->segundo_grupo_presupuestal_id);

        return back()->with('success', 'El recurso se ha creado correctamente.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Convocatoria $convocatoria, TopePresupuestalNodoTecnoparque $tope_presupuestal_tecnoparque)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Convocatoria $convocatoria, TopePresupuestalNodoTecnoparque $tope_presupuestal_tecnoparque)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Convocatoria $convocatoria, TopePresupuestalNodoTecnoparque $tope_presupuestal_tecnoparque)
    {
        $tope_presupuestal_tecnoparque->update($request->all());

        $tope_presupuestal_tecnoparque->segundoGrupoPresupuestal()->sync($request->segundo_grupo_presupuestal_id);

        return back()->with('success', 'El recurso se ha modificado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Convocatoria $convocatoria, TopePresupuestalNodoTecnoparque $tope_presupuestal_tecnoparque)
    {
        $tope_presupuestal_tecnoparque->delete();

        return back()->with('success', 'El recurso se ha eliminado correctamente.');
    }
}
