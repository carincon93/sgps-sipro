<?php

namespace App\Http\Controllers;

use App\Http\Requests\LineaProgramaticaRequest;
use App\Models\LineaProgramatica;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class LineaProgramaticaController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $this->authorize('viewAny', [LineaProgramatica::class]);

        return Inertia::render('LineasProgramaticas/Index', [
            'filters'               => request()->all('search'),
            'lineasProgramaticas'   => LineaProgramatica::select('lineas_programaticas.id', 'lineas_programaticas.nombre', 'lineas_programaticas.codigo', 'lineas_programaticas.categoria_proyecto')
                ->orderBy('nombre', 'ASC')
                ->filterLineaProgramatica(request()->only('search'))->paginate()->appends(['search' => request()->search]),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        $this->authorize('create', [LineaProgramatica::class]);

        return Inertia::render('LineasProgramaticas/Create', [
            'categoriasProyectos' => json_decode(Storage::get('json/categorias-proyectos.json'), true),
            'activadores'         => User::select('id as value', 'nombre as label')->whereHas('roles', function (Builder $query) {
                return $query->where('name', 'ilike', '%activador%');
            })->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(LineaProgramaticaRequest $request)
    {
        $this->authorize('create', [LineaProgramatica::class]);

        $lineaProgramatica = LineaProgramatica::create($request->validated());
        $lineaProgramatica->activadores()->sync($request->activadores);

        return redirect()->route('lineas-programaticas.index')->with('success', 'El recurso se ha creado correctamente.');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\LineaProgramatica  $lineaProgramatica
     * @return \Illuminate\Http\Response
     */
    public function show(LineaProgramatica $lineaProgramatica)
    {
        $this->authorize('view', [LineaProgramatica::class, $lineaProgramatica]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\LineaProgramatica  $lineaProgramatica
     * @return \Illuminate\Http\Response
     */
    public function edit(LineaProgramatica $lineaProgramatica)
    {
        $this->authorize('update', [LineaProgramatica::class, $lineaProgramatica]);

        return Inertia::render('LineasProgramaticas/Edit', [
            'lineaProgramatica'         => $lineaProgramatica,
            'categoriasProyectos'       => json_decode(Storage::get('json/categorias-proyectos.json'), true),
            'activadores'               => User::select('id as value', 'nombre as label')->whereHas('roles', function (Builder $query) {
                return $query->where('name', 'ilike', '%activador%');
            })->get(),
            'activadoresLineaProgramatica'  => $lineaProgramatica->activadores()->select('users.id as value', 'users.nombre as label')->get(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\LineaProgramatica  $lineaProgramatica
     * @return \Illuminate\Http\Response
     */
    public function update(LineaProgramaticaRequest $request, LineaProgramatica $lineaProgramatica)
    {
        $this->authorize('update', [LineaProgramatica::class, $lineaProgramatica]);

        $lineaProgramatica->update($request->validated());

        $lineaProgramatica->save();

        $lineaProgramatica->activadores()->sync($request->activadores);

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\LineaProgramatica  $lineaProgramatica
     * @return \Illuminate\Http\Response
     */
    public function destroy(LineaProgramatica $lineaProgramatica)
    {
        $this->authorize('delete', [LineaProgramatica::class, $lineaProgramatica]);

        try {
            $lineaProgramatica->delete();
        } catch (QueryException $e) {
            return back()->with('error', 'No se puede eliminar el recurso debido a que está asociado a uno o varios proyectos.');
        }

        return back()->with('success', 'El recurso se ha eliminado correctamente.');
    }
}
