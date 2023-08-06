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

        return Inertia::render('Convocatorias/ConvocatoriaRubrosPresupuestales/Index', [
            'convocatoria'                          =>  $convocatoria,
            'convocatoria_rubros_presupuestales'    =>  $convocatoria->convocatoriaPresupuestos()->select('convocatoria_presupuesto.*')
                                                            ->join('rubros_presupuestales', 'convocatoria_presupuesto.rubro_presupuestal_id', 'rubros_presupuestales.id')
                                                            ->join('lineas_programaticas', 'convocatoria_presupuesto.linea_programatica_id', 'lineas_programaticas.id')
                                                            ->join('segundo_grupo_presupuestal', 'rubros_presupuestales.segundo_grupo_presupuestal_id', 'segundo_grupo_presupuestal.id')
                                                            ->with('rubroPresupuestal.segundoGrupoPresupuestal', 'rubroPresupuestal.tercerGrupoPresupuestal', 'rubroPresupuestal.usoPresupuestal', 'lineaProgramatica')
                                                            ->where('convocatoria_presupuesto.linea_programatica_id', request()->linea_programatica_id)
                                                            ->orderBy('segundo_grupo_presupuestal.nombre', 'ASC')
                                                            ->orderBy('convocatoria_presupuesto.id', 'ASC')
                                                            ->filterConvocatoriaPresupuesto(request()->only('search'))->paginate(50)->appends(['search' => request()->search]),
            'rubros_presupuestales'                 =>  RubroPresupuestal::selectRaw("rubros_presupuestales.id as value, CONCAT('∙ Concepto interno SENA: ', segundo_grupo_presupuestal.nombre, chr(10), '∙ Concepto ministerio de hacienda: ', tercer_grupo_presupuestal.nombre, chr(10), '∙ Uso presupuestal: ', usos_presupuestales.descripcion) as label")
                                                            ->join('segundo_grupo_presupuestal', 'rubros_presupuestales.segundo_grupo_presupuestal_id', 'segundo_grupo_presupuestal.id')
                                                            ->join('tercer_grupo_presupuestal', 'rubros_presupuestales.tercer_grupo_presupuestal_id', 'tercer_grupo_presupuestal.id')
                                                            ->join('usos_presupuestales', 'rubros_presupuestales.uso_presupuestal_id', 'usos_presupuestales.id')
                                                            ->whereNotIn('rubros_presupuestales.id', $convocatoria->convocatoriaPresupuestos()->where('convocatoria_presupuesto.linea_programatica_id', request()->linea_programatica_id)->pluck('rubro_presupuestal_id')->toArray())
                                                            ->orderBy('rubros_presupuestales.id', 'ASC')
                                                            ->get()
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

        //
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

        $convocatoria_rubro_presupuestal = $convocatoria->convocatoriaPresupuestos()->create($request->validated());

        return back()->with('success', 'El recurso se ha creado correctamente.');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\ConvocatoriaPresupuesto  $convocatoria_rubro_presupuestal
     * @return \Illuminate\Http\Response
     */
    public function show(Convocatoria $convocatoria, ConvocatoriaPresupuesto $convocatoria_rubro_presupuestal)
    {
        $this->authorize('view', [ConvocatoriaPresupuesto::class, $convocatoria_rubro_presupuestal]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\ConvocatoriaPresupuesto  $convocatoria_rubro_presupuestal
     * @return \Illuminate\Http\Response
     */
    public function edit(Convocatoria $convocatoria, ConvocatoriaPresupuesto $convocatoria_rubro_presupuestal)
    {
        $this->authorize('update', [ConvocatoriaPresupuesto::class, $convocatoria_rubro_presupuestal]);

        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\ConvocatoriaPresupuesto  $convocatoria_rubro_presupuestal
     * @return \Illuminate\Http\Response
     */
    public function update(ConvocatoriaPresupuestoRequest $request, Convocatoria $convocatoria, ConvocatoriaPresupuesto $convocatoria_rubro_presupuestal)
    {
        $this->authorize('update', [ConvocatoriaPresupuesto::class, $convocatoria_rubro_presupuestal]);

        $convocatoria_rubro_presupuestal->update($request->validated());
        $convocatoria_rubro_presupuestal->save();

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\ConvocatoriaPresupuesto  $convocatoria_rubro_presupuestal
     * @return \Illuminate\Http\Response
     */
    public function destroy(Convocatoria $convocatoria, ConvocatoriaPresupuesto $convocatoria_rubro_presupuestal)
    {
        $this->authorize('delete', [ConvocatoriaPresupuesto::class, $convocatoria_rubro_presupuestal]);

        $convocatoria_rubro_presupuestal->delete();

        return back()->with('success', 'El recurso se ha eliminado correctamente.');
    }

    public function cambiarEstados(Request $request, Convocatoria $convocatoria, ConvocatoriaPresupuesto $convocatoria_rubro_presupuestal)
    {
        $this->authorize('update', [ConvocatoriaPresupuesto::class, $convocatoria_rubro_presupuestal]);

        if ($request->has('habilitado')) {
            $convocatoria_rubro_presupuestal->update(['habilitado' => $request->habilitado]);

            !$request->habilitado ? $convocatoria_rubro_presupuestal->update(['sumar_al_presupuesto' => false]) : $convocatoria_rubro_presupuestal->update(['sumar_al_presupuesto' => true]);
        }

        if ($request->has('sumar_al_presupuesto')) {
            $convocatoria_rubro_presupuestal->update(['sumar_al_presupuesto' => $request->sumar_al_presupuesto]);
        }

        if ($request->has('requiere_estudio_mercado')) {
            $convocatoria_rubro_presupuestal->update(['requiere_estudio_mercado' => $request->requiere_estudio_mercado]);
        }

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }
}
