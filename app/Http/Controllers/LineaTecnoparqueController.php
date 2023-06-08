<?php

namespace App\Http\Controllers;

use App\Http\Requests\LineaTecnoparqueRequest;
use App\Models\LineaTecnoparque;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LineaTecnoparqueController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $this->authorize('viewAny', [LineaTecnoparque::class]);

        return Inertia::render('LineasTecnoparque/Index', [
            'filters'             => request()->all('search'),
            'lineasTecnoparque'   => LineaTecnoparque::orderBy('nombre', 'ASC')
                ->filterLineaTecnoparque(request()->only('search'))->paginate()->appends(['search' => request()->search]),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        $this->authorize('create', [LineaTecnoparque::class]);

        return Inertia::render('LineasTecnoparque/Create');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(LineaTecnoparqueRequest $request)
    {
        $this->authorize('create', [LineaTecnoparque::class]);

        $lineaTecnoparque = new LineaTecnoparque();
        $lineaTecnoparque->nombre = $request->nombre;

        $lineaTecnoparque->save();

        return redirect()->route('lineas-tecnoparque.index')->with('success', 'El recurso se ha creado correctamente.');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\LineaTecnoparque  $lineaTecnoparque
     * @return \Illuminate\Http\Response
     */
    public function show(LineaTecnoparque $lineaTecnoparque)
    {
        $this->authorize('view', [LineaTecnoparque::class, $lineaTecnoparque]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\LineaTecnoparque  $lineaTecnoparque
     * @return \Illuminate\Http\Response
     */
    public function edit(LineaTecnoparque $lineaTecnoparque)
    {
        $this->authorize('update', [LineaTecnoparque::class, $lineaTecnoparque]);

        return Inertia::render('LineasTecnoparque/Edit', [
            'lineaTecnoparque' => $lineaTecnoparque
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\LineaTecnoparque  $lineaTecnoparque
     * @return \Illuminate\Http\Response
     */
    public function update(LineaTecnoparqueRequest $request, LineaTecnoparque $lineaTecnoparque)
    {
        $this->authorize('update', [LineaTecnoparque::class, $lineaTecnoparque]);

        $lineaTecnoparque->nombre = $request->nombre;

        $lineaTecnoparque->save();

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\LineaTecnoparque  $lineaTecnoparque
     * @return \Illuminate\Http\Response
     */
    public function destroy(LineaTecnoparque $lineaTecnoparque)
    {
        $this->authorize('delete', [LineaTecnoparque::class, $lineaTecnoparque]);

        $lineaTecnoparque->delete();

        return redirect()->route('lineas-tecnoparque.index')->with('success', 'El recurso se ha eliminado correctamente.');
    }
}
