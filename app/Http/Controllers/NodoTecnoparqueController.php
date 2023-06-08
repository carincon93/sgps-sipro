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
            'filters'           => request()->all('search'),
            'nodosTecnoparque'  => NodoTecnoparque::with('centroFormacion')->orderBy('nombre', 'ASC')
                ->filterNodoTecnoparque(request()->only('search'))->paginate(),
            'allowedToCreate'   => Gate::inspect('create', [NodoTecnoparque::class])->allowed()

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

        return Inertia::render('NodosTecnoparque/Create', [
            'centrosFormacion'  => SelectHelper::centrosFormacion(),
            'allowedToCreate'   => Gate::inspect('create', [NodoTecnoparque::class])->allowed()
        ]);
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

        $nodoTecnoparque = new NodoTecnoparque();
        $nodoTecnoparque->nombre                = $request->nombre;
        $nodoTecnoparque->centroFormacion()->associate($request->centro_formacion_id);

        $nodoTecnoparque->save();

        return redirect()->route('nodos-tecnoparque.index')->with('success', 'El recurso se ha creado correctamente.');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\NodoTecnoparque  $nodoTecnoparque
     * @return \Illuminate\Http\Response
     */
    public function show(NodoTecnoparque $nodoTecnoparque)
    {
        $this->authorize('view', [NodoTecnoparque::class, $nodoTecnoparque]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\NodoTecnoparque  $nodoTecnoparque
     * @return \Illuminate\Http\Response
     */
    public function edit(NodoTecnoparque $nodoTecnoparque)
    {
        $this->authorize('update', [NodoTecnoparque::class, $nodoTecnoparque]);

        return Inertia::render('NodosTecnoparque/Edit', [
            'nodoTecnoparque'   => $nodoTecnoparque,
            'centrosFormacion'  => SelectHelper::centrosFormacion()
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\NodoTecnoparque  $nodoTecnoparque
     * @return \Illuminate\Http\Response
     */
    public function update(NodoTecnoparqueRequest $request, NodoTecnoparque $nodoTecnoparque)
    {
        $this->authorize('update', [NodoTecnoparque::class, $nodoTecnoparque]);

        $nodoTecnoparque->nombre                = $request->nombre;
        $nodoTecnoparque->centroFormacion()->associate($request->centro_formacion_id);

        $nodoTecnoparque->save();

        return redirect()->back()->with('success', 'El recurso se ha actualizado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\NodoTecnoparque  $nodoTecnoparque
     * @return \Illuminate\Http\Response
     */
    public function destroy(NodoTecnoparque $nodoTecnoparque)
    {
        $this->authorize('delete', [NodoTecnoparque::class, $nodoTecnoparque]);

        $nodoTecnoparque->delete();

        return redirect()->route('nodos-tecnoparque.index')->with('success', 'El recurso se ha eliminado correctamente.');
    }
}
