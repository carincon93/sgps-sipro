<?php

namespace App\Http\Controllers;

use App\Helpers\SelectHelper;
use App\Http\Requests\TecnoacademiaRequest;
use App\Models\LineaTecnoacademia;
use App\Models\Tecnoacademia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class TecnoacademiaController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $this->authorize('viewAny', [Tecnoacademia::class]);

        return Inertia::render('Tecnoacademias/Index', [
            'tecnoacademias'        => Tecnoacademia::select('tecnoacademias.*')->with('centroFormacion', 'lineasTecnoacademia')
                                        ->orderBy('tecnoacademias.nombre', 'ASC')
                                        ->filterTecnoacademia(request()->only('search'))->paginate()->appends(['search' => request()->search]),
            'lineas_tecnoacademia'  => LineaTecnoacademia::select('id as value', 'nombre as label')->orderBy('nombre', 'ASC')->get(),
            'modalidades'           => json_decode(Storage::get('json/modalidades-tecnoacademia.json'), true),
            'centros_formacion'     => SelectHelper::centrosFormacion(),
            'allowed_to_create'     => Gate::inspect('create', [Tecnoacademia::class])->allowed()
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        $this->authorize('create', [Tecnoacademia::class]);

        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(TecnoacademiaRequest $request)
    {
        $this->authorize('create', [Tecnoacademia::class]);

        $tecnoacademia = Tecnoacademia::create($request->validated());
        $tecnoacademia->save();

        $tecnoacademia->lineasTecnoacademia()->attach($request->linea_tecnoacademia_id);

        return back()->with('success', 'El recurso se ha creado correctamente.');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Tecnoacademia  $tecnoacademia
     * @return \Illuminate\Http\Response
     */
    public function show(Tecnoacademia $tecnoacademia)
    {
        $this->authorize('view', [Tecnoacademia::class, $tecnoacademia]);

        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Tecnoacademia  $tecnoacademia
     * @return \Illuminate\Http\Response
     */
    public function edit(Tecnoacademia $tecnoacademia)
    {
        $this->authorize('update', [Tecnoacademia::class, $tecnoacademia]);

        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Tecnoacademia  $tecnoacademia
     * @return \Illuminate\Http\Response
     */
    public function update(TecnoacademiaRequest $request, Tecnoacademia $tecnoacademia)
    {
        $this->authorize('update', [Tecnoacademia::class, $tecnoacademia]);

        $tecnoacademia->update($request->validated());

        $tecnoacademia->lineasTecnoacademia()->sync($request->linea_tecnoacademia_id);

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Tecnoacademia  $tecnoacademia
     * @return \Illuminate\Http\Response
     */
    public function destroy(Tecnoacademia $tecnoacademia)
    {
        $this->authorize('delete', [Tecnoacademia::class, $tecnoacademia]);

        $tecnoacademia->delete();

        return back()->with('success', 'El recurso se ha eliminado correctamente.');
    }
}
