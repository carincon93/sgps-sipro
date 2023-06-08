<?php

namespace App\Http\Controllers;

use App\Http\Requests\RolSennovaRequest;
use App\Models\RolSennova;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RolSennovaController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $this->authorize('viewAny', [RolSennova::class]);

        return Inertia::render('RolesSennova/Index', [
            'filters'       => request()->all('search'),
            'rolesSennova'  => RolSennova::orderBy('nombre', 'ASC')
                ->filterRolSennova(request()->only('search'))->paginate()->appends(['search' => request()->search]),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        $this->authorize('create', [RolSennova::class]);

        return Inertia::render('RolesSennova/Create');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(RolSennovaRequest $request)
    {
        $this->authorize('create', [RolSennova::class]);

        $rolSennova = new RolSennova();
        $rolSennova->nombre                 = $request->nombre;
        $rolSennova->sumar_al_presupuesto   = $request->sumar_al_presupuesto;

        $rolSennova->save();

        return redirect()->route('roles-sennova.index')->with('success', 'El recurso se ha creado correctamente.');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\RolSennova  $rolSennova
     * @return \Illuminate\Http\Response
     */
    public function show(RolSennova $rolSennova)
    {
        $this->authorize('view', [RolSennova::class, $rolSennova]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\RolSennova  $rolSennova
     * @return \Illuminate\Http\Response
     */
    public function edit(RolSennova $rolSennova)
    {
        $this->authorize('update', [RolSennova::class, $rolSennova]);

        return Inertia::render('RolesSennova/Edit', [
            'rolSennova' => $rolSennova,
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\RolSennova  $rolSennova
     * @return \Illuminate\Http\Response
     */
    public function update(RolSennovaRequest $request, RolSennova $rolSennova)
    {
        $this->authorize('update', [RolSennova::class, $rolSennova]);

        $rolSennova->nombre                 = $request->nombre;
        $rolSennova->sumar_al_presupuesto   = $request->sumar_al_presupuesto;

        $rolSennova->save();

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\RolSennova  $rolSennova
     * @return \Illuminate\Http\Response
     */
    public function destroy(RolSennova $rolSennova)
    {
        $this->authorize('delete', [RolSennova::class, $rolSennova]);

        $rolSennova->delete();

        return redirect()->route('roles-sennova.index')->with('success', 'El recurso se ha eliminado correctamente.');
    }
}
