<?php

namespace App\Http\Controllers;

use App\Http\Requests\LineaInvestigacionRequest;
use App\Models\GrupoInvestigacion;
use App\Models\LineaInvestigacion;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class LineaInvestigacionController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(GrupoInvestigacion $grupo_investigacion)
    {
        $this->authorize('viewAny', [LineaInvestigacion::class]);

        return Inertia::render('LineasInvestigacion/Index', [
            'lineas_investigacion'  => $grupo_investigacion->lineasInvestigacion()->with('grupoInvestigacion.centroFormacion')->filterLineaInvestigacion(request()->only('search', 'grupoInvestigacion'))->select('lineas_investigacion.id', 'lineas_investigacion.nombre', 'lineas_investigacion.grupo_investigacion_id')->orderBy('lineas_investigacion.nombre', 'ASC')->paginate(),
            'grupo_investigacion'   => $grupo_investigacion,
            'allowed_to_create'     => Gate::inspect('create', [LineaInvestigacion::class])->allowed()
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create(GrupoInvestigacion $grupo_investigacion)
    {
        $this->authorize('create', [LineaInvestigacion::class]);

        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(LineaInvestigacionRequest $request, GrupoInvestigacion $grupo_investigacion)
    {
        $this->authorize('create', [LineaInvestigacion::class]);

        $grupo_investigacion->lineasInvestigacion()->create($request->validated());

        return back()->with('success', 'El recurso se ha creado correctamente.');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\LineaInvestigacion  $linea_investigacion
     * @return \Illuminate\Http\Response
     */
    public function show(GrupoInvestigacion $grupo_investigacion, LineaInvestigacion $linea_investigacion)
    {
        $this->authorize('view', [LineaInvestigacion::class, $linea_investigacion]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\LineaInvestigacion  $linea_investigacion
     * @return \Illuminate\Http\Response
     */
    public function edit(GrupoInvestigacion $grupo_investigacion, LineaInvestigacion $linea_investigacion)
    {
        $this->authorize('view', [LineaInvestigacion::class, $linea_investigacion]);

        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\LineaInvestigacion  $linea_investigacion
     * @return \Illuminate\Http\Response
     */
    public function update(LineaInvestigacionRequest $request, GrupoInvestigacion $grupo_investigacion, LineaInvestigacion $linea_investigacion)
    {
        $this->authorize('update', [LineaInvestigacion::class, $linea_investigacion]);

        $linea_investigacion->update($request->validated());
        $linea_investigacion->save();

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\LineaInvestigacion  $linea_investigacion
     * @return \Illuminate\Http\Response
     */
    public function destroy(GrupoInvestigacion $grupo_investigacion, LineaInvestigacion $linea_investigacion)
    {
        $this->authorize('delete', [LineaInvestigacion::class, $linea_investigacion]);

        try {
            $linea_investigacion->delete();
        } catch (QueryException $e) {
            return back()->with('error', 'No se puede eliminar el recurso debido a que está asociado a uno o varios proyectos.');
        }

        return redirect()->route('grupos-investigacion.lineas-investigacion.index', $grupo_investigacion)->with('success', 'El recurso se ha eliminado correctamente.');
    }
}
