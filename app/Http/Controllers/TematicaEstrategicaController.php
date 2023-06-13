<?php

namespace App\Http\Controllers;

use App\Http\Requests\TematicaEstrategicaRequest;
use App\Models\TematicaEstrategica;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TematicaEstrategicaController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $this->authorize('viewAny', [TematicaEstrategica::class]);

        return Inertia::render('TematicasEstrategicas/Index', [
            'filters'   => request()->all('search'),
            'tematicasEstrategicas' => TematicaEstrategica::orderBy('nombre', 'ASC')
                ->filterTematicaEstrategica(request()->only('search'))->paginate()->appends(['search' => request()->search]),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        $this->authorize('create', [TematicaEstrategica::class]);

        return Inertia::render('TematicasEstrategicas/Create');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(TematicaEstrategicaRequest $request)
    {
        $this->authorize('create', [TematicaEstrategica::class]);

        $tematicaEstrategica = new TematicaEstrategica();
        $tematicaEstrategica->nombre = $request->nombre;

        $tematicaEstrategica->save();

        return redirect()->route('tematicas-estrategicas.index')->with('success', 'El recurso se ha creado correctamente.');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\TematicaEstrategica  $tematicaEstrategica
     * @return \Illuminate\Http\Response
     */
    public function show(TematicaEstrategica $tematicaEstrategica)
    {
        $this->authorize('view', [TematicaEstrategica::class, $tematicaEstrategica]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\TematicaEstrategica  $tematicaEstrategica
     * @return \Illuminate\Http\Response
     */
    public function edit(TematicaEstrategica $tematicaEstrategica)
    {
        $this->authorize('update', [TematicaEstrategica::class, $tematicaEstrategica]);

        return Inertia::render('TematicasEstrategicas/Edit', [
            'tematicaEstrategica' => $tematicaEstrategica
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\TematicaEstrategica  $tematicaEstrategica
     * @return \Illuminate\Http\Response
     */
    public function update(TematicaEstrategicaRequest $request, TematicaEstrategica $tematicaEstrategica)
    {
        $this->authorize('update', [TematicaEstrategica::class, $tematicaEstrategica]);

        $tematicaEstrategica->nombre = $request->nombre;

        $tematicaEstrategica->save();

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\TematicaEstrategica  $tematicaEstrategica
     * @return \Illuminate\Http\Response
     */
    public function destroy(TematicaEstrategica $tematicaEstrategica)
    {
        $this->authorize('delete', [TematicaEstrategica::class, $tematicaEstrategica]);

        try {
            $tematicaEstrategica->delete();
        } catch (QueryException $e) {
            return back()->with('error', 'No se puede eliminar el recurso debido a que está asociado a uno o varios proyectos.');
        }

        return redirect()->route('tematicas-estrategicas.index')->with('success', 'El recurso se ha eliminado correctamente.');
    }
}
