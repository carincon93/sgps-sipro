<?php

namespace App\Http\Controllers;

use App\Helpers\SelectHelper;
use App\Models\Convocatoria;
use App\Models\TopeRolSennovaFormulario16;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class TopeRolSennovaFormulario16Controller extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Convocatoria $convocatoria)
    {
        $this->authorize('viewAny', [TopeRolSennovaFormulario16::class]);

        return Inertia::render('Convocatorias/TopesRolesSennovaFormulario16/Index', [
            'convocatoria'          => $convocatoria,
            'topes_roles_sennova'   => TopeRolSennovaFormulario16::select('topes_roles_formulario_16.*')->with('centroFormacion', 'convocatoriaRolSennova.rolSennova')->join('convocatoria_rol_sennova', 'topes_roles_formulario_16.convocatoria_rol_sennova_id', 'convocatoria_rol_sennova.id')->where('convocatoria_rol_sennova.convocatoria_id', $convocatoria->id)->orderBy('topes_roles_formulario_16.centro_formacion_id')->get(),
            'centros_formacion'     => SelectHelper::centrosFormacion(),
            'roles_sennova'         => SelectHelper::convocatoriaRolesSennova($convocatoria->id, 16),
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
        TopeRolSennovaFormulario16::create($request->all());

        return back()->with('success', 'El recurso se ha creado correctamente.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Convocatoria $convocatoria, TopeRolSennovaFormulario16 $tope_rol_formulario_16)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Convocatoria $convocatoria, TopeRolSennovaFormulario16 $tope_rol_formulario_16)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Convocatoria $convocatoria, TopeRolSennovaFormulario16 $tope_rol_formulario_16)
    {
        $tope_rol_formulario_16->update($request->all());

        return back()->with('success', 'El recurso se ha modificado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Convocatoria $convocatoria, TopeRolSennovaFormulario16 $tope_rol_formulario_16)
    {
        $tope_rol_formulario_16->delete();

        return back()->with('success', 'El recurso se ha eliminado correctamente.');
    }
}
