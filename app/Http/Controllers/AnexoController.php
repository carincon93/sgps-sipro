<?php

namespace App\Http\Controllers;

use App\Http\Requests\AnexoRequest;
use App\Models\Anexo;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AnexoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $this->authorize('viewAny', [Anexo::class]);

        return Inertia::render('Anexos/Index', [
            'anexos' => Anexo::orderBy('nombre', 'ASC')->filterAnexo(request()->only('search'))->paginate()->appends(['search' => request()->search]),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(AnexoRequest $request)
    {
        $this->authorize('create', [Anexo::class]);

        Anexo::create($request->validated());

        return back()->with('success', 'El recurso se ha creado correctamente.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Anexo $anexo)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Anexo $anexo)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(AnexoRequest $request, Anexo $anexo)
    {
        $this->authorize('update', [Anexo::class, $anexo]);

        $anexo->update($request->validated());

        return back()->with('success', 'El recurso se ha modificado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Anexo $anexo)
    {
        $this->authorize('delete', [Anexo::class, $anexo]);

        $anexo->delete();

        return back()->with('success', 'El recurso se ha eliminado correctamente.');
    }
}
