<?php

namespace App\Http\Controllers;

use App\Exports\InventarioEquiposExport;
use App\Models\InventarioEquipo;
use App\Http\Controllers\Controller;
use App\Http\Requests\InventarioEquipoRequest;
use App\Models\Convocatoria;
use App\Models\Evaluacion\Evaluacion;
use App\Models\Proyecto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class InventarioEquipoController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Convocatoria $convocatoria, Proyecto $proyecto)
    {
        $this->authorize('visualizar-proyecto-autor', $proyecto);

        if ($proyecto->convocatoria_id != $convocatoria->id) {
            return abort(404);
        }

        $proyecto->load('evaluaciones');

        return Inertia::render('Convocatorias/Proyectos/InventarioEquipos/Index', [
            'convocatoria'      => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria'),
            'proyecto'          => $proyecto->only('id', 'precio_proyecto', 'modificable', 'mostrar_recomendaciones', 'evaluaciones', 'PdfVersiones', 'lista_archivos', 'allowed'),
            'filters'           => request()->all('search'),
            'inventarioEquipos' => InventarioEquipo::where('proyecto_id', $proyecto->id)->orderBy('nombre', 'ASC')
                ->filterInventarioEquipo(request()->only('search'))->paginate(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create(Convocatoria $convocatoria, Proyecto $proyecto)
    {
        $this->authorize('visualizar-proyecto-autor', $proyecto);

        return Inertia::render('Convocatorias/Proyectos/InventarioEquipos/Create', [
            'convocatoria'              => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria'),
            'proyecto'                  => $proyecto->only('id', 'precio_proyecto', 'modificable', 'mostrar_recomendaciones', 'allowed'),
            'estadosInventarioEquipos'  => json_decode(Storage::get('json/estados-inventario-equipos.json'), true),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(InventarioEquipoRequest $request, Convocatoria $convocatoria, Proyecto $proyecto)
    {
        $this->authorize('modificar-proyecto-autor', $proyecto);

        $inventarioEquipo = new InventarioEquipo();
        $inventarioEquipo->nombre                   = $request->nombre;
        $inventarioEquipo->marca                    = $request->marca;
        $inventarioEquipo->serial                   = $request->serial;
        $inventarioEquipo->codigo_interno           = $request->codigo_interno;
        $inventarioEquipo->fecha_adquisicion        = $request->fecha_adquisicion;
        $inventarioEquipo->estado                   = $request->estado;
        $inventarioEquipo->uso_st                   = $request->uso_st;
        $inventarioEquipo->uso_otra_dependencia     = $request->uso_otra_dependencia;
        $inventarioEquipo->dependencia              = $request->dependencia;
        $inventarioEquipo->descripcion              = $request->descripcion;
        $inventarioEquipo->mantenimiento_prox_year  = $request->mantenimiento_prox_year;
        $inventarioEquipo->calibracion_prox_year    = $request->calibracion_prox_year;
        $inventarioEquipo->proyecto()->associate($proyecto->id);

        $inventarioEquipo->save();

        return redirect()->route('convocatorias.proyectos.inventario-equipos.index', [$convocatoria, $proyecto])->with('success', 'El recurso se ha creado correctamente.');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\InventarioEquipo  $inventarioEquipo
     * @return \Illuminate\Http\Response
     */
    public function show(Convocatoria $convocatoria, Proyecto $proyecto, InventarioEquipo $inventarioEquipo)
    {
        $this->authorize('visualizar-proyecto-autor', $proyecto);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\InventarioEquipo  $inventarioEquipo
     * @return \Illuminate\Http\Response
     */
    public function edit(Convocatoria $convocatoria, Proyecto $proyecto, InventarioEquipo $inventarioEquipo)
    {
        $this->authorize('visualizar-proyecto-autor', $proyecto);

        return Inertia::render('Convocatorias/Proyectos/InventarioEquipos/Edit', [
            'convocatoria'              => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria'),
            'proyecto'                  => $proyecto->only('id', 'precio_proyecto', 'modificable', 'mostrar_recomendaciones', 'allowed'),
            'inventarioEquipo'          => $inventarioEquipo,
            'estadosInventarioEquipos'  => json_decode(Storage::get('json/estados-inventario-equipos.json'), true),

        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\InventarioEquipo  $inventarioEquipo
     * @return \Illuminate\Http\Response
     */
    public function update(InventarioEquipoRequest $request, Convocatoria $convocatoria, Proyecto $proyecto, InventarioEquipo $inventarioEquipo)
    {
        $this->authorize('modificar-proyecto-autor', $proyecto);

        $inventarioEquipo->nombre                   = $request->nombre;
        $inventarioEquipo->marca                    = $request->marca;
        $inventarioEquipo->serial                   = $request->serial;
        $inventarioEquipo->codigo_interno           = $request->codigo_interno;
        $inventarioEquipo->fecha_adquisicion        = $request->fecha_adquisicion;
        $inventarioEquipo->estado                   = $request->estado;
        $inventarioEquipo->uso_st                   = $request->uso_st;
        $inventarioEquipo->uso_otra_dependencia     = $request->uso_otra_dependencia;
        $inventarioEquipo->dependencia              = $request->dependencia;
        $inventarioEquipo->descripcion              = $request->descripcion;
        $inventarioEquipo->mantenimiento_prox_year  = $request->mantenimiento_prox_year;
        $inventarioEquipo->calibracion_prox_year    = $request->calibracion_prox_year;

        $inventarioEquipo->save();

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\InventarioEquipo  $inventarioEquipo
     * @return \Illuminate\Http\Response
     */
    public function destroy(Convocatoria $convocatoria, Proyecto $proyecto, InventarioEquipo $inventarioEquipo)
    {
        $this->authorize('modificar-proyecto-autor', $proyecto);

        $inventarioEquipo->delete();

        return redirect()->route('convocatorias.proyectos.inventario-equipos.index', [$convocatoria, $proyecto])->with('success', 'El recurso se ha eliminado correctamente.');
    }

    /**
     * inventarioEquiposExcel
     *
     * @param  mixed $proyecto
     * @return void
     */
    public function inventarioEquiposExcel(Proyecto $proyecto)
    {
        return Excel::download(new InventarioEquiposExport($proyecto), 'Inventario-equipos' . $proyecto->codigo . time() . '.xlsx');
    }
}
