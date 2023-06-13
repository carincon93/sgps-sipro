<?php

namespace App\Http\Controllers;

use App\Http\Requests\RedConocimientoRequest;
use App\Models\RedConocimiento;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RedConocimientoController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $this->authorize('viewAny', [RedConocimiento::class]);

        return Inertia::render('RedesConocimiento/Index', [
            'filters'           => request()->all('search'),
            'redesConocimiento' => RedConocimiento::orderBy('nombre', 'ASC')
                ->filterRedConocimiento(request()->only('search'))->paginate()->appends(['search' => request()->search]),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        $this->authorize('create', [RedConocimiento::class]);

        return Inertia::render('RedesConocimiento/Create');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(RedConocimientoRequest $request)
    {
        $this->authorize('create', [RedConocimiento::class]);

        $redConocimiento = new RedConocimiento();
        $redConocimiento->nombre = $request->nombre;

        $redConocimiento->save();

        return redirect()->route('redes-conocimiento.index')->with('success', 'El recurso se ha creado correctamente.');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\RedConocimiento  $redConocimiento
     * @return \Illuminate\Http\Response
     */
    public function show(RedConocimiento $redConocimiento)
    {
        $this->authorize('view', [RedConocimiento::class, $redConocimiento]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\RedConocimiento  $redConocimiento
     * @return \Illuminate\Http\Response
     */
    public function edit(RedConocimiento $redConocimiento)
    {
        $this->authorize('update', [RedConocimiento::class, $redConocimiento]);

        return Inertia::render('RedesConocimiento/Edit', [
            'redConocimiento' => $redConocimiento
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\RedConocimiento  $redConocimiento
     * @return \Illuminate\Http\Response
     */
    public function update(RedConocimientoRequest $request, RedConocimiento $redConocimiento)
    {
        $this->authorize('update', [RedConocimiento::class, $redConocimiento]);

        $redConocimiento->nombre = $request->nombre;

        $redConocimiento->save();

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\RedConocimiento  $redConocimiento
     * @return \Illuminate\Http\Response
     */
    public function destroy(RedConocimiento $redConocimiento)
    {
        $this->authorize('delete', [RedConocimiento::class, $redConocimiento]);

        try {
            $redConocimiento->delete();
        } catch (QueryException $e) {
            return back()->with('error', 'No se puede eliminar el recurso debido a que está asociado a uno o varios proyectos.');
        }

        return redirect()->route('redes-conocimiento.index')->with('success', 'El recurso se ha eliminado correctamente.');
    }
}
