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
    public function index(GrupoInvestigacion $grupoInvestigacion)
    {
        $this->authorize('viewAny', [LineaInvestigacion::class]);

        return Inertia::render('LineasInvestigacion/Index', [
            'filters'               => request()->all('search'),
            'gruposInvestigacion'   => GrupoInvestigacion::orderBy('nombre')->get(),
            'grupoInvestigacion'    => $grupoInvestigacion,
            'lineasInvestigacion'   => $grupoInvestigacion->lineasInvestigacion()->with('grupoInvestigacion.centroFormacion')->filterLineaInvestigacion(request()->only('search', 'grupoInvestigacion'))->select('lineas_investigacion.id', 'lineas_investigacion.nombre', 'lineas_investigacion.grupo_investigacion_id')->orderBy('lineas_investigacion.nombre', 'ASC')->paginate(),
            'allowedToCreate'       => Gate::inspect('create', [LineaInvestigacion::class])->allowed()
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create(GrupoInvestigacion $grupoInvestigacion)
    {
        $this->authorize('create', [LineaInvestigacion::class]);

        return Inertia::render('LineasInvestigacion/Create', [
            'grupoInvestigacion' => $grupoInvestigacion,
            'programasFormacion' => $grupoInvestigacion->centroFormacion->programasFormacion()->selectRaw("programas_formacion.id as value, CONCAT('Código: ', programas_formacion.codigo, ' - ', programas_formacion.nombre) as label")->get(),
            'allowedToCreate'    => Gate::inspect('create', [LineaInvestigacion::class])->allowed()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(LineaInvestigacionRequest $request, GrupoInvestigacion $grupoInvestigacion)
    {
        $this->authorize('create', [LineaInvestigacion::class]);

        $lineaInvestigacion = new LineaInvestigacion();
        $lineaInvestigacion->nombre = $request->nombre;
        $lineaInvestigacion->grupoInvestigacion()->associate($grupoInvestigacion);

        $lineaInvestigacion->save();

        $lineaInvestigacion->programasFormacion()->attach($request->programas_formacion);

        return redirect()->route('grupos-investigacion.lineas-investigacion.index', $grupoInvestigacion)->with('success', 'El recurso se ha creado correctamente.');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\LineaInvestigacion  $lineaInvestigacion
     * @return \Illuminate\Http\Response
     */
    public function show(GrupoInvestigacion $grupoInvestigacion, LineaInvestigacion $lineaInvestigacion)
    {
        $this->authorize('view', [LineaInvestigacion::class, $lineaInvestigacion]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\LineaInvestigacion  $lineaInvestigacion
     * @return \Illuminate\Http\Response
     */
    public function edit(GrupoInvestigacion $grupoInvestigacion, LineaInvestigacion $lineaInvestigacion)
    {
        $this->authorize('view', [LineaInvestigacion::class, $lineaInvestigacion]);

        return Inertia::render('LineasInvestigacion/Edit', [
            'grupoInvestigacion' => $grupoInvestigacion,
            'lineaInvestigacion' => $lineaInvestigacion,
            'programasFormacion' => $lineaInvestigacion->grupoInvestigacion->centroFormacion->programasFormacion()->selectRaw("programas_formacion.id as value, CONCAT('Código: ', programas_formacion.codigo,' - ', programas_formacion.nombre) as label")->get(),
            'programasFormacionLineaInvestigacion' => $lineaInvestigacion->programasFormacion()->select('programas_formacion.id as value', 'programas_formacion.nombre as label')->get(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\LineaInvestigacion  $lineaInvestigacion
     * @return \Illuminate\Http\Response
     */
    public function update(LineaInvestigacionRequest $request, GrupoInvestigacion $grupoInvestigacion, LineaInvestigacion $lineaInvestigacion)
    {
        $this->authorize('update', [LineaInvestigacion::class, $lineaInvestigacion]);

        $lineaInvestigacion->nombre = $request->nombre;
        $lineaInvestigacion->grupoInvestigacion()->associate($grupoInvestigacion);

        $lineaInvestigacion->programasFormacion()->sync($request->programas_formacion);

        $lineaInvestigacion->save();

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\LineaInvestigacion  $lineaInvestigacion
     * @return \Illuminate\Http\Response
     */
    public function destroy(GrupoInvestigacion $grupoInvestigacion, LineaInvestigacion $lineaInvestigacion)
    {
        $this->authorize('delete', [LineaInvestigacion::class, $lineaInvestigacion]);

        try {
            $lineaInvestigacion->delete();
        } catch (QueryException $e) {
            return back()->with('error', 'No se puede eliminar el recurso debido a que está asociado a uno o varios proyectos.');
        }

        return redirect()->route('grupos-investigacion.lineas-investigacion.index', $grupoInvestigacion)->with('success', 'El recurso se ha eliminado correctamente.');
    }
}
