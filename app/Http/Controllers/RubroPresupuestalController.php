<?php

namespace App\Http\Controllers;

use App\Helpers\SelectHelper;
use App\Http\Requests\RubroPresupuestalRequest;
use App\Models\RubroPresupuestal;
use App\Models\SegundoGrupoPresupuestal;
use App\Models\TercerGrupoPresupuestal;
use App\Models\UsoPresupuestal;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RubroPresupuestalController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $this->authorize('viewAny', [RubroPresupuestal::class]);

        return Inertia::render('Presupuesto/RubroPresupuestal/Index', [
            'rubros_presupuestales'         =>  RubroPresupuestal::select('rubros_presupuestales.*')
                                                    ->orderBy('segundo_grupo_presupuestal_id', 'ASC')->with('usoPresupuestal', 'segundoGrupoPresupuestal', 'tercerGrupoPresupuestal')
                                                    ->filterRubroPresupuestal(request()->only('search'))->paginate()->appends(['search' => request()->search]),
            'primer_grupo_presupuestal'     =>  SelectHelper::primerGrupoPresupuestal(),
            'segundo_grupo_presupuestal'    =>  SegundoGrupoPresupuestal::select('segundo_grupo_presupuestal.id as value', 'segundo_grupo_presupuestal.nombre as label')
                                                    ->orderBy('segundo_grupo_presupuestal.nombre', 'ASC')
                                                    ->get(),
            'tercer_grupo_presupuestal'     =>  TercerGrupoPresupuestal::select('tercer_grupo_presupuestal.id as value', 'tercer_grupo_presupuestal.nombre as label')
                                                    ->orderBy('tercer_grupo_presupuestal.nombre', 'ASC')
                                                    ->get(),
            'usosPresupuestales'            =>  UsoPresupuestal::select('usos_presupuestales.id as value', 'usos_presupuestales.descripcion as label')
                                                    ->orderBy('usos_presupuestales.descripcion', 'ASC')
                                                    ->get(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        $this->authorize('create', [RubroPresupuestal::class]);

        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(RubroPresupuestalRequest $request)
    {
        $this->authorize('create', [RubroPresupuestal::class]);

        $rubro_presupuestal = new RubroPresupuestal();

        $rubro_presupuestal->requiere_estudio_mercado   = $request->requiere_estudio_mercado;
        $rubro_presupuestal->sumar_al_presupuesto       = $request->sumar_al_presupuesto;
        $rubro_presupuestal->mensaje                    = $request->mensaje;
        $rubro_presupuestal->habilitado                 = $request->habilitado;

        $rubro_presupuestal->primerGrupoPresupuestal()->associate($request->primer_grupo_presupuestal_id);
        $rubro_presupuestal->segundoGrupoPresupuestal()->associate($request->segundo_grupo_presupuestal_id);
        $rubro_presupuestal->tercerGrupoPresupuestal()->associate($request->tercer_grupo_presupuestal_id);
        $rubro_presupuestal->usoPresupuestal()->associate($request->uso_presupuestal_id);
        $rubro_presupuestal->lineaProgramatica()->associate($request->linea_programatica_id);

        $rubro_presupuestal->save();

        return redirect()->route('rubros-presupuestales.index')->with('success', 'El recurso se ha creado correctamente.');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\RubroPresupuestal  $rubro_presupuestal
     * @return \Illuminate\Http\Response
     */
    public function show(RubroPresupuestal $rubro_presupuestal)
    {
        $this->authorize('view', [RubroPresupuestal::class, $rubro_presupuestal]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\RubroPresupuestal  $rubro_presupuestal
     * @return \Illuminate\Http\Response
     */
    public function edit(RubroPresupuestal $rubro_presupuestal)
    {
        $this->authorize('update', [RubroPresupuestal::class, $rubro_presupuestal]);

        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\RubroPresupuestal  $rubro_presupuestal
     * @return \Illuminate\Http\Response
     */
    public function update(RubroPresupuestalRequest $request, RubroPresupuestal $rubro_presupuestal)
    {
        $this->authorize('update', [RubroPresupuestal::class, $rubro_presupuestal]);

        $rubro_presupuestal->primerGrupoPresupuestal()->associate($request->primer_grupo_presupuestal_id);
        $rubro_presupuestal->segundoGrupoPresupuestal()->associate($request->segundo_grupo_presupuestal_id);
        $rubro_presupuestal->tercerGrupoPresupuestal()->associate($request->tercer_grupo_presupuestal_id);
        $rubro_presupuestal->usoPresupuestal()->associate($request->uso_presupuestal_id);

        $rubro_presupuestal->save();

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\RubroPresupuestal  $rubro_presupuestal
     * @return \Illuminate\Http\Response
     */
    public function destroy(RubroPresupuestal $rubro_presupuestal)
    {
        $this->authorize('delete', [RubroPresupuestal::class, $rubro_presupuestal]);

        $rubro_presupuestal->delete();

        return redirect()->route('rubros-presupuestales.index')->with('success', 'El recurso se ha eliminado correctamente.');
    }
}
