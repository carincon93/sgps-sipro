<?php

namespace App\Http\Controllers;

use App\Helpers\SelectHelper;
use App\Models\Convocatoria;
use App\Models\TopePresupuestalFormulario7;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class TopePresupuestalFormulario7Controller extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Convocatoria $convocatoria)
    {
        $this->authorize('viewAny', [TopePresupuestalFormulario7::class]);

        $topes_presupuestales_formulario_7 = TopePresupuestalFormulario7::select('topes_presupuestales_formulario_7_concepto_sena.*', 'segundo_grupo_presupuestal.codigo')->with('convocatoria', 'segundoGrupoPresupuestal')->join('segundo_grupo_presupuestal', 'topes_presupuestales_formulario_7_concepto_sena.segundo_grupo_presupuestal_id', 'segundo_grupo_presupuestal.id')->where('topes_presupuestales_formulario_7_concepto_sena.convocatoria_id', $convocatoria->id)->orderBy('topes_presupuestales_formulario_7_concepto_sena.segundo_grupo_presupuestal_id')->get();

        return Inertia::render('Convocatorias/TopesRubrosPresupuestalesFormulario7/Index', [
            'convocatoria'                              => $convocatoria,
            'topes_presupuestales_formulario_7'         => $topes_presupuestales_formulario_7,
            'segundo_grupo_presupuestal'                => SelectHelper::segundoGrupoPresupuestal($convocatoria->id, 7)->whereNotIn('codigo', $topes_presupuestales_formulario_7->pluck('codigo'))->values()->all(),
            'conceptos_internos_sena'                   => SelectHelper::segundoGrupoPresupuestal($convocatoria->id, 7)
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
        $tope_presupuestal_formulario_7 = TopePresupuestalFormulario7::create($request->all());

        return back()->with('success', 'El recurso se ha creado correctamente.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Convocatoria $convocatoria, TopePresupuestalFormulario7 $tope_presupuestal_formulario_7)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Convocatoria $convocatoria, TopePresupuestalFormulario7 $tope_presupuestal_formulario_7)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Convocatoria $convocatoria, TopePresupuestalFormulario7 $tope_presupuestal_formulario_7)
    {
        $tope_presupuestal_formulario_7->update($request->all());

        return back()->with('success', 'El recurso se ha modificado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Convocatoria $convocatoria, TopePresupuestalFormulario7 $tope_presupuestal_formulario_7)
    {
        $tope_presupuestal_formulario_7->delete();

        return back()->with('success', 'El recurso se ha eliminado correctamente.');
    }
}
