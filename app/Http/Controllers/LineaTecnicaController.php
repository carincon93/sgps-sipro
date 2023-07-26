<?php

namespace App\Http\Controllers;

use App\Http\Requests\LineaTecnicaRequest;
use App\Models\LineaTecnica;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class LineaTecnicaController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $this->authorize('viewAny', [LineaTecnica::class]);

        return Inertia::render('LineasTecnicas/Index', [
            'filters'           => request()->all('search'),
            'lineasTecnicas'    => LineaTecnica::orderBy('nombre', 'ASC')
                ->filterLineaTecnica(request()->only('search'))->paginate()->appends(['search' => request()->search]),
            'allowed_to_create'   => Gate::inspect('create', [LineaTecnica::class])->allowed()

        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        $this->authorize('create', [LineaTecnica::class]);

        return Inertia::render('LineasTecnicas/Create', [
            'allowed_to_create' => Gate::inspect('create', [LineaTecnica::class])->allowed()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(LineaTecnicaRequest $request)
    {
        $this->authorize('create', [LineaTecnica::class]);

        $lineaTecnica = new LineaTecnica();
        $lineaTecnica->nombre = $request->nombre;

        $lineaTecnica->save();

        return redirect()->route('lineas-tecnicas.index')->with('success', 'El recurso se ha creado correctamente.');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\LineaTecnica  $lineaTecnica
     * @return \Illuminate\Http\Response
     */
    public function show(LineaTecnica $lineaTecnica)
    {
        $this->authorize('view', [LineaTecnica::class, $lineaTecnica]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\LineaTecnica  $lineaTecnica
     * @return \Illuminate\Http\Response
     */
    public function edit(LineaTecnica $lineaTecnica)
    {
        $this->authorize('update', [LineaTecnica::class, $lineaTecnica]);

        return Inertia::render('LineasTecnicas/Edit', [
            'lineaTecnica' => $lineaTecnica
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\LineaTecnica  $lineaTecnica
     * @return \Illuminate\Http\Response
     */
    public function update(LineaTecnicaRequest $request, LineaTecnica $lineaTecnica)
    {
        $this->authorize('update', [LineaTecnica::class, $lineaTecnica]);

        $lineaTecnica->nombre = $request->nombre;

        $lineaTecnica->save();

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\LineaTecnica  $lineaTecnica
     * @return \Illuminate\Http\Response
     */
    public function destroy(LineaTecnica $lineaTecnica)
    {
        $this->authorize('delete', [LineaTecnica::class, $lineaTecnica]);

        $lineaTecnica->delete();

        return redirect()->route('lineas-tecnicas.index')->with('success', 'El recurso se ha eliminado correctamente.');
    }
}
