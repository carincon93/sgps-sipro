<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\EdtRequest;
use App\Models\Convocatoria;
use App\Models\Edt;
use App\Models\Evaluacion\Evaluacion;
use App\Models\Evaluacion\TaEvaluacion;
use App\Models\Proyecto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class EdtController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Convocatoria $convocatoria, Proyecto $proyecto)
    {
        $this->authorize('visualizar-proyecto-autor', $proyecto);

        $proyecto->load('evaluaciones.taEvaluacion');

        $proyecto->codigo_linea_programatica = $proyecto->lineaProgramatica->codigo;

        /**
         * Si el proyecto es diferente de la línea programática 70 se prohibe el acceso. No requiere de edt
         */
        if ($proyecto->codigo_linea_programatica != 70) {
            return redirect()->route('convocatorias.proyectos.edit', [$convocatoria, $proyecto])->with('error', 'Esta línea programática no requiere de edt');
        }

        $proyecto->servicios_organizacion = false;
        // foreach ($proyecto->proyectoPresupuesto as $presupuesto) {
        //     if ($presupuesto->convocatoriaPresupuesto->presupuestoSennova->usoPresupuestal->codigo == '020202008005096') {
        //         $proyecto->servicios_organizacion = true;
        //     }
        // }

        return Inertia::render('Convocatorias/Proyectos/EDT/Index', [
            'convocatoria'     => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria'),
            'proyecto'         => $proyecto->only('id', 'codigo_linea_programatica', 'precio_proyecto', 'modificable', 'servicios_organizacion', 'evaluaciones', 'mostrar_recomendaciones', 'PdfVersiones', 'all_files', 'allowed'),
            'filters'          => request()->all('search'),
            'eventos'          => Edt::with('proyectoPresupuesto')->orderBy('descripcion_evento', 'ASC')->where('ta_id', $proyecto->id)
                ->filterEdt(request()->only('search'))->select('edt.id', 'edt.descripcion_evento', 'edt.numero_asistentes', 'edt.proyecto_presupuesto_id')->paginate(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create(Convocatoria $convocatoria, Proyecto $proyecto)
    {
        $this->authorize('visualizar-proyecto-autor', $proyecto);

        $proyecto->servicios_organizacion = false;
        // foreach ($proyecto->proyectoPresupuesto as $presupuesto) {
        //     if ($presupuesto->convocatoriaPresupuesto->presupuestoSennova->usoPresupuestal->codigo == '020202008005096') {
        //         $proyecto->servicios_organizacion = true;
        //     }
        // }

        /**
         * Si el proyecto es diferente de la línea programática 70 se prohibe el acceso. No requiere de edt
         */
        if ($proyecto->lineaProgramatica->codigo != 70) {
            return redirect()->route('convocatorias.proyectos.edit', [$convocatoria, $proyecto])->with('error', 'Esta línea programática no requiere de edt');
        } else if ($proyecto->servicios_organizacion == false) {
            return back()->with('error', 'Debe generar primero el uso presupuestal "Servicios de organización y asistencia de convenciones y ferias".');
        }

        return Inertia::render('Convocatorias/Proyectos/EDT/Create', [
            'convocatoria'          => $convocatoria,
            'proyecto'              => $proyecto,
            'tiposEvento'           => json_decode(Storage::get('json/tipos-edt.json'), true),
            // 'proyectoPresupuesto'   => $proyecto->proyectoPresupuesto()->selectRaw('id as value, concat(\'Servicios de organización y asistencia de convenciones y ferias\', chr(10), \'∙ Presupuesto: $\', valor_total) as label')->whereHas('convocatoriaPresupuesto.presupuestoSennova.usoPresupuestal', function ($query) {
            //     $query->where('codigo', '=', '020202008005096');
            // })->get()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(EdtRequest $request, Convocatoria $convocatoria, Proyecto $proyecto)
    {
        $this->authorize('modificar-proyecto-autor', $proyecto);

        $edt = new Edt();
        $edt->tipo_evento                           = $request->tipo_evento;
        $edt->descripcion_evento                    = $request->descripcion_evento;
        $edt->descripcion_participacion_entidad     = $request->descripcion_participacion_entidad;
        $edt->publico_objetivo                      = $request->publico_objetivo;
        $edt->numero_asistentes                     = $request->numero_asistentes;
        $edt->estrategia_comunicacion               = $request->estrategia_comunicacion;
        $edt->nombre_evento                         = $request->nombre_evento;
        $edt->fecha_evento                          = $request->fecha_evento;
        $edt->organizador                           = $request->organizador;

        $edt->proyectoPresupuesto()->associate($request->proyecto_presupuesto_id);
        $edt->ta()->associate($proyecto);

        $edt->save();

        return redirect()->route('convocatorias.proyectos.edt.index', [$convocatoria, $proyecto])->with('success', 'El recurso se ha creado correctamente.');
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(Convocatoria $convocatoria, Proyecto $proyecto, Edt $edt)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit(Convocatoria $convocatoria, Proyecto $proyecto, Edt $edt)
    {
        $this->authorize('visualizar-proyecto-autor', $proyecto);

        // foreach ($proyecto->proyectoPresupuesto as $presupuesto) {
        //     if ($presupuesto->convocatoriaPresupuesto->presupuestoSennova->usoPresupuestal->codigo == '020202008005096') {
        //         $proyecto->servicios_organizacion = true;
        //     }
        // }

        /**
         * Si el proyecto es diferente de la línea programática 70 se prohibe el acceso. No requiere de edt
         */
        if ($proyecto->lineaProgramatica->codigo != 70) {
            return redirect()->route('convocatorias.proyectos.edit', [$convocatoria, $proyecto])->with('error', 'Esta línea programática no requiere de edt');
        } else if ($proyecto->servicios_organizacion == false) {
            return back()->with('error', 'Debe generar primero el uso presupuestal "Servicios de organización y asistencia de convenciones y ferias".');
        }

        return Inertia::render('Convocatorias/Proyectos/EDT/Edit', [
            'convocatoria'          => $convocatoria,
            'proyecto'              => $proyecto,
            'edt'                   => $edt,
            'tiposEvento'           => json_decode(Storage::get('json/tipos-edt.json'), true),
            // 'proyectoPresupuesto'   => $proyecto->proyectoPresupuesto()->selectRaw('id as value, concat(\'Servicios de organización y asistencia de convenciones y ferias\', chr(10), \'∙ Presupuesto: $\', valor_total) as label')->whereHas('convocatoriaPresupuesto.presupuestoSennova.usoPresupuestal', function ($query) {
            //     $query->where('codigo', '=', '020202008005096');
            // })->get()
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(EdtRequest $request, Convocatoria $convocatoria, Proyecto $proyecto, Edt $edt)
    {
        $edt->tipo_evento                           = $request->tipo_evento;
        $edt->descripcion_evento                    = $request->descripcion_evento;
        $edt->descripcion_participacion_entidad     = $request->descripcion_participacion_entidad;
        $edt->publico_objetivo                      = $request->publico_objetivo;
        $edt->numero_asistentes                     = $request->numero_asistentes;
        $edt->estrategia_comunicacion               = $request->estrategia_comunicacion;
        $edt->nombre_evento                         = $request->nombre_evento;
        $edt->fecha_evento                          = $request->fecha_evento;
        $edt->organizador                           = $request->organizador;
        $edt->proyectoPresupuesto()->associate($request->proyecto_presupuesto_id);

        $edt->save();

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Convocatoria $convocatoria, Proyecto $proyecto, Edt $edt)
    {
        $this->authorize('modificar-proyecto-autor', $proyecto);

        $edt->delete();

        return redirect()->route('convocatorias.proyectos.edt.index', [$convocatoria, $proyecto])->with('success', 'El recurso se ha eliminado correctamente.');
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function showEdtEvaluacion(Convocatoria $convocatoria, Evaluacion $evaluacion)
    {
        $this->authorize('visualizar-evaluacion-autor', $evaluacion);

        $evaluacion->proyecto->codigo_linea_programatica = $evaluacion->proyecto->lineaProgramatica->codigo;

        /**
         * Si el proyecto es diferente de la línea programática 70 se prohibe el acceso. No requiere de edt
         */
        if ($evaluacion->proyecto->codigo_linea_programatica != 70) {
            return redirect()->route('convocatorias.proyectos.edit', [$convocatoria, $evaluacion->proyecto])->with('error', 'Esta línea programática no requiere de edt');
        }

        $evaluacion->proyecto->servicios_organizacion = false;
        // foreach ($evaluacion->proyecto->proyectoPresupuesto as $presupuesto) {
        //     if ($presupuesto->convocatoriaPresupuesto->presupuestoSennova->usoPresupuestal->codigo == '020202008005096') {
        //         $evaluacion->proyecto->servicios_organizacion = true;
        //     }
        // }

        $otrasEvaluaciones = null;
        switch ($evaluacion->proyecto) {
            case $evaluacion->proyecto->ta()->exists():
                $ta = $evaluacion->proyecto->ta;

                $otrasEvaluaciones = TaEvaluacion::with('evaluacion.evaluador')->whereHas('evaluacion', function ($query) use ($ta) {
                    $query->where('evaluaciones.proyecto_id', $ta->id)->where('evaluaciones.habilitado', true);
                })->where('ta_evaluaciones.id', '!=', $evaluacion->taEvaluacion->id)->get();
                break;
            default:
                break;
        }

        return Inertia::render('Convocatorias/Evaluaciones/EDT/Index', [
            'convocatoria'      => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria'),
            'evaluacion'        => $evaluacion,
            'otrasEvaluaciones' => $otrasEvaluaciones,
            'proyecto'          => $evaluacion->proyecto->only('id', 'codigo_linea_programatica', 'precio_proyecto', 'modificable', 'servicios_organizacion'),
            'filters'           => request()->all('search'),
            'eventos'           => Edt::with('proyectoPresupuesto')->orderBy('descripcion_evento', 'ASC')->where('ta_id', $evaluacion->proyecto->id)
                ->filterEdt(request()->only('search'))->select('edt.id', 'edt.descripcion_evento', 'edt.numero_asistentes', 'edt.proyecto_presupuesto_id')->paginate(),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function showEdtEvaluacionForm(Convocatoria $convocatoria, Evaluacion $evaluacion, Edt $edt)
    {
        $this->authorize('visualizar-evaluacion-autor', $evaluacion);

        // foreach ($evaluacion->proyecto->proyectoPresupuesto as $presupuesto) {
        //     if ($presupuesto->convocatoriaPresupuesto->presupuestoSennova->usoPresupuestal->codigo == '020202008005096') {
        //         $evaluacion->proyecto->servicios_organizacion = true;
        //     }
        // }

        /**
         * Si el proyecto es diferente de la línea programática 70 se prohibe el acceso. No requiere de edt
         */
        if ($evaluacion->proyecto->lineaProgramatica->codigo != 70) {
            return redirect()->route('convocatorias.evaluaciones.edit', [$convocatoria, $evaluacion->proyecto])->with('error', 'Esta línea programática no requiere de edt');
        } else if ($evaluacion->proyecto->servicios_organizacion == false) {
            return back()->with('error', 'Debe generar primero el uso presupuestal "Servicios de organización y asistencia de convenciones y ferias".');
        }

        return Inertia::render('Convocatorias/Evaluaciones/EDT/Edit', [
            'convocatoria'          => $convocatoria,
            'proyecto'              => $evaluacion->proyecto,
            'evaluacion'            => $evaluacion,
            'edt'                   => $edt,
            'tiposEvento'           => json_decode(Storage::get('json/tipos-edt.json'), true),
            // 'proyectoPresupuesto'   => $evaluacion->proyecto->proyectoPresupuesto()->selectRaw('id as value, concat(\'Servicios de organización y asistencia de convenciones y ferias\', chr(10), \'∙ Presupuesto: $\', valor_total) as label')->whereHas('convocatoriaPresupuesto.presupuestoSennova.usoPresupuestal', function ($query) {
            //     $query->where('codigo', '=', '020202008005096');
            // })->get()
        ]);
    }

    /**
     * updateEdtEvaluacion
     *
     * @param  mixed $request
     * @param  mixed $convocatoria
     * @param  mixed $evaluacion
     * @return void
     */
    public function updateEdtEvaluacion(Request $request, Convocatoria $convocatoria, Evaluacion $evaluacion)
    {
        $this->authorize('modificar-evaluacion-autor', $evaluacion);

        $evaluacion->taEvaluacion()->update([
            'edt_comentario'   => $request->edt_requiere_comentario == false ? $request->edt_comentario : null
        ]);

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }
}
