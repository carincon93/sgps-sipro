<?php

namespace App\Http\Controllers;

use App\Http\Requests\ConvocatoriaPresupuestoRequest;
use App\Models\Convocatoria;
use App\Models\ConvocatoriaPresupuesto;
use App\Models\PresupuestoSennova;
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
            'convocatoriaPresupuesto'   => $convocatoria->convocatoriaPresupuestos()->select('convocatoria_presupuesto.id', 'convocatoria_presupuesto.presupuesto_sennova_id')
                ->join('presupuesto_sennova', 'convocatoria_presupuesto.presupuesto_sennova_id', 'presupuesto_sennova.id')
                ->join('lineas_programaticas', 'presupuesto_sennova.linea_programatica_id', 'lineas_programaticas.id')
                ->join('segundo_grupo_presupuestal', 'presupuesto_sennova.segundo_grupo_presupuestal_id', 'segundo_grupo_presupuestal.id')
                ->orderBy('presupuesto_sennova.linea_programatica_id', 'DESC')
                ->with('presupuestoSennova.segundoGrupoPresupuestal', 'presupuestoSennova.tercerGrupoPresupuestal', 'presupuestoSennova.usoPresupuestal', 'presupuestoSennova.lineaProgramatica')
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
            'presupuestosSennova'   => PresupuestoSennova::selectRaw("presupuesto_sennova.id as value, CONCAT('PS-',to_char(presupuesto_sennova.id, 'fm0000'), '-', date_part('year', presupuesto_sennova.created_at), chr(10), '∙ Uso presupuestal: ', usos_presupuestales.descripcion, chr(10), '∙ Línea programática: ', lineas_programaticas.codigo) as label")->join('usos_presupuestales', 'presupuesto_sennova.uso_presupuestal_id', 'usos_presupuestales.id')->join('lineas_programaticas', 'presupuesto_sennova.linea_programatica_id', 'lineas_programaticas.id')->orderBy('presupuesto_sennova.id', 'ASC')->get()
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
        $convocatoriaPresupuesto->presupuestoSennova()->associate($request->presupuesto_sennova_id);

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

        $convocatoriaPresupuesto->presupuestoSennova;

        return Inertia::render('Convocatorias/ConvocatoriaPresupuesto/Edit', [
            'convocatoria'              => $convocatoria,
            'convocatoriaPresupuesto'   => $convocatoriaPresupuesto,
            'presupuestosSennova'       => PresupuestoSennova::selectRaw("presupuesto_sennova.id as value, CONCAT('PS-',to_char(presupuesto_sennova.id, 'fm0000'), '-', date_part('year', presupuesto_sennova.created_at), chr(10), '∙ Uso presupuestal: ', usos_presupuestales.descripcion, chr(10), '∙ Línea programática: ', lineas_programaticas.codigo) as label")->join('usos_presupuestales', 'presupuesto_sennova.uso_presupuestal_id', 'usos_presupuestales.id')->join('lineas_programaticas', 'presupuesto_sennova.linea_programatica_id', 'lineas_programaticas.id')->orderBy('presupuesto_sennova.id', 'ASC')->get()
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
        $convocatoriaPresupuesto->presupuestoSennova()->associate($request->presupuesto_sennova_id);

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
