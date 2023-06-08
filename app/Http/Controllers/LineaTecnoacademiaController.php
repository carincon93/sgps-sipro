<?php

namespace App\Http\Controllers;

use App\Http\Requests\LineaTecnoacademiaRequest;
use App\Models\LineaTecnoacademia;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LineaTecnoacademiaController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $this->authorize('viewAny', [LineaTecnoacademia::class]);

        return Inertia::render('LineasTecnoacademia/Index', [
            'filters'               => request()->all('search'),
            'lineasTecnoacademia'   => LineaTecnoacademia::orderBy('nombre', 'ASC')
                ->filterLineaTecnoacademia(request()->only('search'))->paginate()->appends(['search' => request()->search]),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        $this->authorize('create', [LineaTecnoacademia::class]);

        return Inertia::render('LineasTecnoacademia/Create');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(LineaTecnoacademiaRequest $request)
    {
        $this->authorize('create', [LineaTecnoacademia::class]);

        $lineaTecnoacademia = new LineaTecnoacademia();
        $lineaTecnoacademia->nombre = $request->nombre;

        $lineaTecnoacademia->save();

        return redirect()->route('lineas-tecnoacademia.index')->with('success', 'El recurso se ha creado correctamente.');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\LineaTecnoacademia  $lineaTecnoacademia
     * @return \Illuminate\Http\Response
     */
    public function show(LineaTecnoacademia $lineaTecnoacademia)
    {
        $this->authorize('view', [LineaTecnoacademia::class, $lineaTecnoacademia]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\LineaTecnoacademia  $lineaTecnoacademia
     * @return \Illuminate\Http\Response
     */
    public function edit(LineaTecnoacademia $lineaTecnoacademia)
    {
        $this->authorize('update', [LineaTecnoacademia::class, $lineaTecnoacademia]);

        return Inertia::render('LineasTecnoacademia/Edit', [
            'lineaTecnoacademia' => $lineaTecnoacademia
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\LineaTecnoacademia  $lineaTecnoacademia
     * @return \Illuminate\Http\Response
     */
    public function update(LineaTecnoacademiaRequest $request, LineaTecnoacademia $lineaTecnoacademia)
    {
        $this->authorize('update', [LineaTecnoacademia::class, $lineaTecnoacademia]);

        $lineaTecnoacademia->nombre = $request->nombre;

        $lineaTecnoacademia->save();

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\LineaTecnoacademia  $lineaTecnoacademia
     * @return \Illuminate\Http\Response
     */
    public function destroy(LineaTecnoacademia $lineaTecnoacademia)
    {
        $this->authorize('delete', [LineaTecnoacademia::class, $lineaTecnoacademia]);

        $lineaTecnoacademia->delete();

        return redirect()->route('lineas-tecnoacademia.index')->with('success', 'El recurso se ha eliminado correctamente.');
    }
}
