<?php

namespace App\Http\Controllers;

use App\Http\Requests\ConvocatoriaPresupuestoRequest;
use App\Models\Convocatoria;
use App\Models\ConvocatoriaPresupuesto;
use App\Models\RubroPresupuestal;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ConvocatoriaPresupuestoController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Convocatoria $convocatoria)
    {
        $this->authorize('viewAny', [ConvocatoriaPresupuesto::class]);

        return Inertia::render('Convocatorias/ConvocatoriaPresupuesto/Index', [
            'filters'                   => request()->all('search'),
            'convocatoria'              => $convocatoria,
            'convocatoriaPresupuesto'   => $convocatoria->convocatoriaPresupuestos()->select('convocatoria_presupuesto.id', 'convocatoria_presupuesto.rubro_presupuestal_id')
                ->join('rubros_presupuestales', 'convocatoria_presupuesto.rubro_presupuestal_id', 'rubros_presupuestales.id')
                ->join('lineas_programaticas', 'convocatoria_presupuesto.linea_programatica_id', 'lineas_programaticas.id')
                ->join('segundo_grupo_presupuestal', 'rubros_presupuestales.segundo_grupo_presupuestal_id', 'segundo_grupo_presupuestal.id')
                ->orderBy('convocatoria_presupuesto.linea_programatica_id', 'DESC')
                ->with('rubrosPresupuestales.segundoGrupoPresupuestal', 'rubrosPresupuestales.tercerGrupoPresupuestal', 'rubrosPresupuestales.usoPresupuestal', 'lineaProgramatica')
                ->filterConvocatoriaPresupuesto(request()->only('search'))->paginate()->appends(['search' => request()->search]),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create(Convocatoria $convocatoria)
    {
        $this->authorize('create', [ConvocatoriaPresupuesto::class]);

        return Inertia::render('Convocatorias/ConvocatoriaPresupuesto/Create', [
            'convocatoria'          => $convocatoria,
            'rubros_presupuestales' => RubroPresupuestal::selectRaw("rubros_presupuestales.id as value, CONCAT('PS-',to_char(rubros_presupuestales.id, 'fm0000'), '-', date_part('year', rubros_presupuestales.created_at), chr(10), '∙ Uso presupuestal: ', usos_presupuestales.descripcion as label")
                                        ->join('usos_presupuestales', 'rubros_presupuestales.uso_presupuestal_id', 'usos_presupuestales.id')
                                        ->orderBy('rubros_presupuestales.id', 'ASC')
                                        ->get()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(ConvocatoriaPresupuestoRequest $request, Convocatoria $convocatoria)
    {
        $this->authorize('create', [ConvocatoriaPresupuesto::class]);

        $convocatoriaPresupuesto = new ConvocatoriaPresupuesto();
        $convocatoriaPresupuesto->convocatoria()->associate($convocatoria);
        $convocatoriaPresupuesto->rubrosPresupuestales()->associate($request->rubro_presupuestal_id);

        $convocatoriaPresupuesto->save();

        return redirect()->route('convocatorias.convocatoria-presupuesto.index', [$convocatoria])->with('success', 'El recurso se ha creado correctamente.');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\ConvocatoriaPresupuesto  $convocatoriaPresupuesto
     * @return \Illuminate\Http\Response
     */
    public function show(Convocatoria $convocatoria, ConvocatoriaPresupuesto $convocatoriaPresupuesto)
    {
        $this->authorize('view', [ConvocatoriaPresupuesto::class, $convocatoriaPresupuesto]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\ConvocatoriaPresupuesto  $convocatoriaPresupuesto
     * @return \Illuminate\Http\Response
     */
    public function edit(Convocatoria $convocatoria, ConvocatoriaPresupuesto $convocatoriaPresupuesto)
    {
        $this->authorize('update', [ConvocatoriaPresupuesto::class, $convocatoriaPresupuesto]);

        $convocatoriaPresupuesto->rubroPresupuestal;

        return Inertia::render('Convocatorias/ConvocatoriaPresupuesto/Edit', [
            'convocatoria'              => $convocatoria,
            'convocatoriaPresupuesto'   => $convocatoriaPresupuesto,
            'rubros_presupuestales'     => RubroPresupuestal::selectRaw("rubros_presupuestales.id as value, CONCAT('PS-',to_char(rubros_presupuestales.id, 'fm0000'), '-', date_part('year', rubros_presupuestales.created_at), chr(10), '∙ Uso presupuestal: ', usos_presupuestales.descripcion as label")
                                            ->join('usos_presupuestales', 'rubros_presupuestales.uso_presupuestal_id', 'usos_presupuestales.id')
                                            ->orderBy('rubros_presupuestales.id', 'ASC')
                                            ->get()
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\ConvocatoriaPresupuesto  $convocatoriaPresupuesto
     * @return \Illuminate\Http\Response
     */
    public function update(ConvocatoriaPresupuestoRequest $request, Convocatoria $convocatoria, ConvocatoriaPresupuesto $convocatoriaPresupuesto)
    {
        $this->authorize('update', [ConvocatoriaPresupuesto::class, $convocatoriaPresupuesto]);

        $convocatoriaPresupuesto->convocatoria()->associate($convocatoria);
        $convocatoriaPresupuesto->rubrosPresupuestales()->associate($request->rubro_presupuestal_id);

        $convocatoriaPresupuesto->save();

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\ConvocatoriaPresupuesto  $convocatoriaPresupuesto
     * @return \Illuminate\Http\Response
     */
    public function destroy(Convocatoria $convocatoria, ConvocatoriaPresupuesto $convocatoriaPresupuesto)
    {
        $this->authorize('delete', [ConvocatoriaPresupuesto::class, $convocatoriaPresupuesto]);

        $convocatoriaPresupuesto->delete();

        return back()->with('success', 'El recurso se ha eliminado correctamente.');
    }
}
