<?php

namespace App\Http\Controllers;

use App\Helpers\SelectHelper;
use App\Models\Convocatoria;
use App\Models\TopeRolSennovaTecnoacademia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class TopeRolSennovaTecnoacademiaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Convocatoria $convocatoria)
    {
        $this->authorize('viewAny', [TopeRolSennovaTecnoacademia::class]);

        return Inertia::render('Convocatorias/TopesRolesSennovaTecnoacademia/Index', [
            'convocatoria'          => $convocatoria,
            'topes_roles_sennova'   => TopeRolSennovaTecnoacademia::select('topes_roles_tecnoacademias.*')->with('tecnoacademia', 'convocatoriaRolSennova.rolSennova')->join('convocatoria_rol_sennova', 'topes_roles_tecnoacademias.convocatoria_rol_sennova_id', 'convocatoria_rol_sennova.id')->where('convocatoria_rol_sennova.convocatoria_id', $convocatoria->id)->orderBy('topes_roles_tecnoacademias.tecnoacademia_id')->get(),
            'tecnoacademias'        => SelectHelper::tecnoacademias(),
            'roles_sennova'         => SelectHelper::convocatoriaRolesSennova($convocatoria->id, 4),
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
        TopeRolSennovaTecnoacademia::create($request->all());

        return back()->with('success', 'El recurso se ha creado correctamente.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Convocatoria $convocatoria, TopeRolSennovaTecnoacademia $tope_rol_tecnoacademia)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Convocatoria $convocatoria, TopeRolSennovaTecnoacademia $tope_rol_tecnoacademia)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Convocatoria $convocatoria, TopeRolSennovaTecnoacademia $tope_rol_tecnoacademia)
    {
        $tope_rol_tecnoacademia->update($request->all());

        return back()->with('success', 'El recurso se ha modificado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Convocatoria $convocatoria, TopeRolSennovaTecnoacademia $tope_rol_tecnoacademia)
    {
        $tope_rol_tecnoacademia->delete();

        return back()->with('success', 'El recurso se ha eliminado correctamente.');
    }
}
