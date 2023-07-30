<?php

namespace App\Http\Controllers;

use App\Helpers\SelectHelper;
use App\Http\Requests\PresupuestoSennovaRequest;
use App\Models\PresupuestoSennova;
use App\Models\SegundoGrupoPresupuestal;
use App\Models\TercerGrupoPresupuestal;
use App\Models\UsoPresupuestal;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PresupuestoSennovaController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $this->authorize('viewAny', [PresupuestoSennova::class]);

        return Inertia::render('Presupuesto/PresupuestoSennova/Index', [
            'filters'               => request()->all('search'),
            'presupuestoSennova'    => PresupuestoSennova::select('presupuesto_sennova.*')
                ->join('lineas_programaticas', 'presupuesto_sennova.linea_programatica_id', 'lineas_programaticas.id')
                ->orderBy('presupuesto_sennova.linea_programatica_id', 'ASC')->orderBy('segundo_grupo_presupuestal_id', 'ASC')->with('usoPresupuestal', 'segundoGrupoPresupuestal', 'tercerGrupoPresupuestal', 'lineaProgramatica')
                ->filterPresupuestoSennova(request()->only('search'))->paginate()->appends(['search' => request()->search]),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        $this->authorize('create', [PresupuestoSennova::class]);

        return Inertia::render('Presupuesto/PresupuestoSennova/Create', [
            'primerGrupoPresupuestal'   =>  SelectHelper::primerGrupoPresupuestal(),
            'segundoGrupoPresupuestal'  =>  SegundoGrupoPresupuestal::select('segundo_grupo_presupuestal.id as value', 'segundo_grupo_presupuestal.nombre as label')
                                                ->orderBy('segundo_grupo_presupuestal.nombre', 'ASC')
                                                ->get(),
            'tercerGrupoPresupuestal'   =>  TercerGrupoPresupuestal::select('tercer_grupo_presupuestal.id as value', 'tercer_grupo_presupuestal.nombre as label')
                                                ->orderBy('tercer_grupo_presupuestal.nombre', 'ASC')
                                                ->get(),
            'usosPresupuestales'        =>  UsoPresupuestal::select('usos_presupuestales.id as value', 'usos_presupuestales.descripcion as label')
                                                ->orderBy('usos_presupuestales.descripcion', 'ASC')
                                                ->get(),
            'lineasProgramaticas'       =>  SelectHelper::lineasProgramaticas(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(PresupuestoSennovaRequest $request)
    {
        $this->authorize('create', [PresupuestoSennova::class]);

        $presupuestoSennova = new PresupuestoSennova();

        $presupuestoSennova->requiere_estudio_mercado   = $request->requiere_estudio_mercado;
        $presupuestoSennova->sumar_al_presupuesto       = $request->sumar_al_presupuesto;
        $presupuestoSennova->mensaje                    = $request->mensaje;
        $presupuestoSennova->habilitado                 = $request->habilitado;

        $presupuestoSennova->primerGrupoPresupuestal()->associate($request->primer_grupo_presupuestal_id);
        $presupuestoSennova->segundoGrupoPresupuestal()->associate($request->segundo_grupo_presupuestal_id);
        $presupuestoSennova->tercerGrupoPresupuestal()->associate($request->tercer_grupo_presupuestal_id);
        $presupuestoSennova->usoPresupuestal()->associate($request->uso_presupuestal_id);
        $presupuestoSennova->lineaProgramatica()->associate($request->linea_programatica_id);

        $presupuestoSennova->save();

        return redirect()->route('presupuesto-sennova.index')->with('success', 'El recurso se ha creado correctamente.');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\PresupuestoSennova  $presupuestoSennova
     * @return \Illuminate\Http\Response
     */
    public function show(PresupuestoSennova $presupuestoSennova)
    {
        $this->authorize('view', [PresupuestoSennova::class, $presupuestoSennova]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\PresupuestoSennova  $presupuestoSennova
     * @return \Illuminate\Http\Response
     */
    public function edit(PresupuestoSennova $presupuestoSennova)
    {
        $this->authorize('update', [PresupuestoSennova::class, $presupuestoSennova]);

        return Inertia::render('Presupuesto/PresupuestoSennova/Edit', [
            'presupuestoSennova'        => $presupuestoSennova,
            'primerGrupoPresupuestal'   => SelectHelper::primerGrupoPresupuestal(),
            'segundoGrupoPresupuestal'  => SegundoGrupoPresupuestal::select('segundo_grupo_presupuestal.id as value', 'segundo_grupo_presupuestal.nombre as label')
            ->orderBy('segundo_grupo_presupuestal.nombre', 'ASC')
            ->get(),
            'tercerGrupoPresupuestal'   => TercerGrupoPresupuestal::select('tercer_grupo_presupuestal.id as value', 'tercer_grupo_presupuestal.nombre as label')
            ->orderBy('tercer_grupo_presupuestal.nombre', 'ASC')
            ->get(),
            'usosPresupuestales'        => UsoPresupuestal::select('usos_presupuestales.id as value', 'usos_presupuestales.descripcion as label')
            ->orderBy('usos_presupuestales.descripcion', 'ASC')
            ->get(),
            'lineasProgramaticas'       => SelectHelper::lineasProgramaticas(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\PresupuestoSennova  $presupuestoSennova
     * @return \Illuminate\Http\Response
     */
    public function update(PresupuestoSennovaRequest $request, PresupuestoSennova $presupuestoSennova)
    {
        $this->authorize('update', [PresupuestoSennova::class, $presupuestoSennova]);

        $presupuestoSennova->requiere_estudio_mercado   = $request->requiere_estudio_mercado;
        $presupuestoSennova->sumar_al_presupuesto       = $request->sumar_al_presupuesto;
        $presupuestoSennova->mensaje                    = $request->mensaje;
        $presupuestoSennova->habilitado                 = $request->habilitado;

        $presupuestoSennova->primerGrupoPresupuestal()->associate($request->primer_grupo_presupuestal_id);
        $presupuestoSennova->segundoGrupoPresupuestal()->associate($request->segundo_grupo_presupuestal_id);
        $presupuestoSennova->tercerGrupoPresupuestal()->associate($request->tercer_grupo_presupuestal_id);
        $presupuestoSennova->usoPresupuestal()->associate($request->uso_presupuestal_id);
        $presupuestoSennova->lineaProgramatica()->associate($request->linea_programatica_id);

        $presupuestoSennova->save();

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\PresupuestoSennova  $presupuestoSennova
     * @return \Illuminate\Http\Response
     */
    public function destroy(PresupuestoSennova $presupuestoSennova)
    {
        $this->authorize('delete', [PresupuestoSennova::class, $presupuestoSennova]);

        $presupuestoSennova->delete();

        return redirect()->route('presupuesto-sennova.index')->with('success', 'El recurso se ha eliminado correctamente.');
    }


    /**
     * configuracionPresupuestoSennova
     *
     * @return void
     */
    public function configuracionPresupuestoSennova()
    {
        $this->authorize('viewAny', [PresupuestoSennova::class]);

        return Inertia::render('Presupuesto/Dashboard');
    }
}
