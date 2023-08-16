<?php

namespace App\Http\Controllers;

use App\Http\Requests\RolSennovaRequest;
use App\Models\LineaProgramatica;
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
            'roles_sennova'         => RolSennova::orderBy('nombre', 'ASC')
                                        ->with('lineaProgramatica')
                                        ->filterRolSennova(request()->only('search'))->paginate()->appends(['search' => request()->search]),
            'lineas_programaticas'  => LineaProgramatica::selectRaw("id as value, CONCAT(nombre, ' - ', codigo) as label")->orderBy('nombre', 'ASC')->get()

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

        //
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

        $rolSennova = RolSennova::create($request->validated());

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

        //
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

        //
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

        $rolSennova->update($request->validated());

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
