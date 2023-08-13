<?php

namespace App\Http\Controllers;

use App\Helpers\SelectHelper;
use App\Models\NodoTecnoparque;
use App\Http\Controllers\Controller;
use App\Http\Requests\NodoTecnoparqueRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class NodoTecnoparqueController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $this->authorize('viewAny', [NodoTecnoparque::class]);

        return Inertia::render('NodosTecnoparque/Index', [
            'nodos_tecnoparque'  => NodoTecnoparque::with('centroFormacion')->orderBy('nombre', 'ASC')
                                    ->filterNodoTecnoparque(request()->only('search'))->paginate(),
            'centros_formacion'  => SelectHelper::centrosFormacion(),
            'allowed_to_create'  => Gate::inspect('create', [NodoTecnoparque::class])->allowed()

        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        $this->authorize('create', [NodoTecnoparque::class]);

        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(NodoTecnoparqueRequest $request)
    {
        $this->authorize('create', [NodoTecnoparque::class]);

        $nodo_tecnoparque = NodoTecnoparque::create($request->validated());

        return back()->with('success', 'El recurso se ha creado correctamente.');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\NodoTecnoparque  $nodo_tecnoparque
     * @return \Illuminate\Http\Response
     */
    public function show(NodoTecnoparque $nodo_tecnoparque)
    {
        $this->authorize('view', [NodoTecnoparque::class, $nodo_tecnoparque]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\NodoTecnoparque  $nodo_tecnoparque
     * @return \Illuminate\Http\Response
     */
    public function edit(NodoTecnoparque $nodo_tecnoparque)
    {
        $this->authorize('update', [NodoTecnoparque::class, $nodo_tecnoparque]);

        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\NodoTecnoparque  $nodo_tecnoparque
     * @return \Illuminate\Http\Response
     */
    public function update(NodoTecnoparqueRequest $request, NodoTecnoparque $nodo_tecnoparque)
    {
        $this->authorize('update', [NodoTecnoparque::class, $nodo_tecnoparque]);

        $nodo_tecnoparque->update($request->validated());

        $nodo_tecnoparque->save();

        return redirect()->back()->with('success', 'El recurso se ha actualizado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\NodoTecnoparque  $nodo_tecnoparque
     * @return \Illuminate\Http\Response
     */
    public function destroy(NodoTecnoparque $nodo_tecnoparque)
    {
        $this->authorize('delete', [NodoTecnoparque::class, $nodo_tecnoparque]);

        $nodo_tecnoparque->delete();

        return redirect()->route('nodos-tecnoparque.index')->with('success', 'El recurso se ha eliminado correctamente.');
    }
}
