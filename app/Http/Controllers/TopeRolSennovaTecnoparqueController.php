<?php

namespace App\Http\Controllers;

use App\Helpers\SelectHelper;
use App\Models\Convocatoria;
use App\Models\TopeRolSennovaTecnoparque;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class TopeRolSennovaTecnoparqueController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Convocatoria $convocatoria)
    {
        $this->authorize('viewAny', [TopeRolSennovaTecnoparque::class]);

        return Inertia::render('Convocatorias/TopesRolesSennovaTecnoparque/Index', [
            'convocatoria'          => $convocatoria,
            'topes_roles_sennova'   => TopeRolSennovaTecnoparque::select('topes_roles_nodos_tecnoparque.*')->with('nodoTecnoparque', 'convocatoriaRolSennova.rolSennova')->join('convocatoria_rol_sennova', 'topes_roles_nodos_tecnoparque.convocatoria_rol_sennova_id', 'convocatoria_rol_sennova.id')->where('convocatoria_rol_sennova.convocatoria_id', $convocatoria->id)->orderBy('topes_roles_nodos_tecnoparque.nodo_tecnoparque_id')->get(),
            'nodos_tecnoparque'     => SelectHelper::nodosTecnoparque(),
            'roles_sennova'         => SelectHelper::convocatoriaRolesSennova($convocatoria->id, 17),
            'niveles_academicos'    => json_decode(Storage::get('json/niveles-academicos.json'), true),
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
        TopeRolSennovaTecnoparque::create($request->all());

        return back()->with('success', 'El recurso se ha creado correctamente.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Convocatoria $convocatoria, TopeRolSennovaTecnoparque $tope_rol_sennova_tecnoparque)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Convocatoria $convocatoria, TopeRolSennovaTecnoparque $tope_rol_sennova_tecnoparque)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Convocatoria $convocatoria, TopeRolSennovaTecnoparque $tope_rol_sennova_tecnoparque)
    {
        $tope_rol_sennova_tecnoparque->update($request->all());

        return back()->with('success', 'El recurso se ha modificado correctamente.');

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Convocatoria $convocatoria, TopeRolSennovaTecnoparque $tope_rol_sennova_tecnoparque)
    {
        $tope_rol_sennova_tecnoparque->delete();

        return back()->with('success', 'El recurso se ha eliminado correctamente.');
    }
}
