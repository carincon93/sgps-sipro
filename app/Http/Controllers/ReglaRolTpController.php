<?php

namespace App\Http\Controllers;

use App\Helpers\SelectHelper;
use App\Models\ReglaRolTp;
use App\Http\Controllers\Controller;
use App\Http\Requests\ReglaRolTpRequest;
use App\Models\ConvocatoriaRolSennova;
use App\Models\NodoTecnoparque;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReglaRolTpController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $this->authorize('viewAny', [ReglaRolTp::class]);

        return Inertia::render('ReglasRolesTp/Index', [
            'filters'       => request()->all('search'),
            'reglasRolesTp' => ReglaRolTp::selectRaw("reglas_roles_tp.id, reglas_roles_tp.maximo, CASE convocatoria_rol_sennova.nivel_academico
                WHEN '7' THEN	concat(roles_sennova.nombre, ' - Nivel académico: Ninguno')
                WHEN '1' THEN	concat(roles_sennova.nombre, ' - Nivel académico: Técnico')
                WHEN '2' THEN	concat(roles_sennova.nombre, ' - Nivel académico: Tecnólogo')
                WHEN '3' THEN	concat(roles_sennova.nombre, ' - Nivel académico: Pregrado')
                WHEN '4' THEN	concat(roles_sennova.nombre, ' - Nivel académico: Especalización')
                WHEN '5' THEN	concat(roles_sennova.nombre, ' - Nivel académico: Maestría')
                WHEN '6' THEN	concat(roles_sennova.nombre, ' - Nivel académico: Doctorado')
                WHEN '8' THEN	concat(roles_sennova.nombre, ' - Nivel académico: Técnico con especialización')
                WHEN '9' THEN	concat(roles_sennova.nombre, ' - Nivel académico: Tecnólogo con especialización')
            END as nombre_rol, nodos_tecnoparque.nombre as nombre_tecnoparque")->join('convocatoria_rol_sennova', 'reglas_roles_tp.convocatoria_rol_sennova_id', 'convocatoria_rol_sennova.id')->join('roles_sennova', 'convocatoria_rol_sennova.rol_sennova_id', 'roles_sennova.id')->join('nodos_tecnoparque', 'reglas_roles_tp.nodo_tecnoparque_id', 'nodos_tecnoparque.id')->orderBy('roles_sennova.nombre', 'ASC')
                ->filterReglaRolTp(request()->only('search'))->paginate()->appends(['search' => request()->search]),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        $this->authorize('create', [ReglaRolTp::class]);

        return Inertia::render('ReglasRolesTp/Create', [
            'rolesTp'           => ConvocatoriaRolSennova::selectRaw("convocatoria_rol_sennova.id as value, CASE convocatoria_rol_sennova.nivel_academico
                WHEN '7' THEN	concat(roles_sennova.nombre, ' - Nivel académico: Ninguno')
                WHEN '1' THEN	concat(roles_sennova.nombre, ' - Nivel académico: Técnico')
                WHEN '2' THEN	concat(roles_sennova.nombre, ' - Nivel académico: Tecnólogo')
                WHEN '3' THEN	concat(roles_sennova.nombre, ' - Nivel académico: Pregrado')
                WHEN '4' THEN	concat(roles_sennova.nombre, ' - Nivel académico: Especalización')
                WHEN '5' THEN	concat(roles_sennova.nombre, ' - Nivel académico: Maestría')
                WHEN '6' THEN	concat(roles_sennova.nombre, ' - Nivel académico: Doctorado')
                WHEN '8' THEN	concat(roles_sennova.nombre, ' - Nivel académico: Técnico con especialización')
                WHEN '9' THEN	concat(roles_sennova.nombre, ' - Nivel académico: Tecnólogo con especialización')
            END as label")->join('roles_sennova', 'convocatoria_rol_sennova.rol_sennova_id', 'roles_sennova.id')->whereIn('roles_sennova.id', [3, 6, 8, 15, 16, 5, 7, 45])->where('convocatoria_rol_sennova.linea_programatica_id', 4)->get(),
            'nodosTecnoparque'  => SelectHelper::nodosTecnoparque()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(ReglaRolTpRequest $request)
    {
        $this->authorize('create', [ReglaRolTp::class]);

        $reglaRolTp = new ReglaRolTp();
        $reglaRolTp->maximo = $request->maximo;
        $reglaRolTp->nodoTecnoparque()->associate($request->nodo_tecnoparque_id);
        $reglaRolTp->convocatoriaRolSennova()->associate($request->convocatoria_rol_sennova_id);

        $reglaRolTp->save();

        return redirect()->route('reglas-roles-tp.index')->with('success', 'El recurso se ha creado correctamente.');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\ReglaRolTp  $reglaRolTp
     * @return \Illuminate\Http\Response
     */
    public function show(ReglaRolTp $reglaRolTp)
    {
        $this->authorize('view', [ReglaRolTp::class, $reglaRolTp]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\ReglaRolTp  $reglaRolTp
     * @return \Illuminate\Http\Response
     */
    public function edit(ReglaRolTp $reglaRolTp)
    {
        $this->authorize('update', [ReglaRolTp::class, $reglaRolTp]);

        return Inertia::render('ReglasRolesTp/Edit', [
            'reglaRolTp'        => $reglaRolTp,
            'rolesTp'           => ConvocatoriaRolSennova::selectRaw("convocatoria_rol_sennova.id as value, CASE convocatoria_rol_sennova.nivel_academico
                WHEN '7' THEN	concat(roles_sennova.nombre, ' - Nivel académico: Ninguno')
                WHEN '1' THEN	concat(roles_sennova.nombre, ' - Nivel académico: Técnico')
                WHEN '2' THEN	concat(roles_sennova.nombre, ' - Nivel académico: Tecnólogo')
                WHEN '3' THEN	concat(roles_sennova.nombre, ' - Nivel académico: Pregrado')
                WHEN '4' THEN	concat(roles_sennova.nombre, ' - Nivel académico: Especalización')
                WHEN '5' THEN	concat(roles_sennova.nombre, ' - Nivel académico: Maestría')
                WHEN '6' THEN	concat(roles_sennova.nombre, ' - Nivel académico: Doctorado')
                WHEN '8' THEN	concat(roles_sennova.nombre, ' - Nivel académico: Técnico con especialización')
                WHEN '9' THEN	concat(roles_sennova.nombre, ' - Nivel académico: Tecnólogo con especialización')
            END as label")->join('roles_sennova', 'convocatoria_rol_sennova.rol_sennova_id', 'roles_sennova.id')->whereIn('roles_sennova.id', [3, 6, 8, 15, 16, 5, 7, 45])->where('convocatoria_rol_sennova.linea_programatica_id', 4)->get(),
            'nodosTecnoparque' => SelectHelper::nodosTecnoparque()
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\ReglaRolTp  $reglaRolTp
     * @return \Illuminate\Http\Response
     */
    public function update(ReglaRolTpRequest $request, ReglaRolTp $reglaRolTp)
    {
        $this->authorize('update', [ReglaRolTp::class, $reglaRolTp]);

        $reglaRolTp->maximo = $request->maximo;
        $reglaRolTp->nodoTecnoparque()->associate($request->nodo_tecnoparque_id);
        $reglaRolTp->convocatoriaRolSennova()->associate($request->convocatoria_rol_sennova_id);

        $reglaRolTp->save();

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\ReglaRolTp  $reglaRolTp
     * @return \Illuminate\Http\Response
     */
    public function destroy(ReglaRolTp $reglaRolTp)
    {
        $this->authorize('delete', [ReglaRolTp::class, $reglaRolTp]);

        $reglaRolTp->delete();

        return redirect()->route('reglas-roles-tp.index')->with('success', 'El recurso se ha eliminado correctamente.');
    }
}
