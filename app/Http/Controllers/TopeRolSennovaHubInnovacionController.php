<?php

namespace App\Http\Controllers;

use App\Helpers\SelectHelper;
use App\Models\Convocatoria;
use App\Models\TopeRolSennovaHubInnovacion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class TopeRolSennovaHubInnovacionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Convocatoria $convocatoria)
    {
        $this->authorize('viewAny', [TopeRolSennovaHubInnovacion::class]);

        return Inertia::render('Convocatorias/TopesRolesSennovaHubInnovacion/Index', [
            'convocatoria'          => $convocatoria,
            'topes_roles_sennova'   => TopeRolSennovaHubInnovacion::select('topes_roles_hubs_innovacion.*')->with('hubInnovacion', 'convocatoriaRolSennova.rolSennova')->join('convocatoria_rol_sennova', 'topes_roles_hubs_innovacion.convocatoria_rol_sennova_id', 'convocatoria_rol_sennova.id')->where('convocatoria_rol_sennova.convocatoria_id', $convocatoria->id)->orderBy('topes_roles_hubs_innovacion.hub_innovacion_id')->get(),
            'hubs_innovacion'       => SelectHelper::hubsInnovacion(),
            'roles_sennova'         => SelectHelper::convocatoriaRolesSennova($convocatoria->id, 10),
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
        TopeRolSennovaHubInnovacion::create($request->all());

        return back()->with('success', 'El recurso se ha creado correctamente.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Convocatoria $convocatoria, TopeRolSennovaHubInnovacion $tope_rol_hub_innovacion)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Convocatoria $convocatoria, TopeRolSennovaHubInnovacion $tope_rol_hub_innovacion)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Convocatoria $convocatoria, TopeRolSennovaHubInnovacion $tope_rol_hub_innovacion)
    {
        $tope_rol_hub_innovacion->update($request->all());

        return back()->with('success', 'El recurso se ha modificado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Convocatoria $convocatoria, TopeRolSennovaHubInnovacion $tope_rol_hub_innovacion)
    {
        $tope_rol_hub_innovacion->delete();

        return back()->with('success', 'El recurso se ha eliminado correctamente.');
    }
}
