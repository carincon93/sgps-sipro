<?php

namespace App\Http\Controllers\Evaluacion;

use App\Models\Evaluacion\Evaluacion;
use App\Http\Controllers\Controller;
use App\Http\Requests\Evaluacion\EvaluacionRequest;
use App\Models\Convocatoria;
use App\Models\Proyecto;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class EvaluacionController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $this->authorize('viewAny', [Evaluacion::class]);

        return Inertia::render('Evaluaciones/Index', [
            'filters'           => request()->all('search'),
            'proyectosId'       => Proyecto::selectRaw("id + 8000 as codigo_only")->orderBy('id', 'ASC')->get()->pluck('codigo_only')->flatten('codigo_only'),
            'evaluaciones'      => Evaluacion::with('proyecto.tecnoacademiaLineasTecnoacademia.tecnoacademia', 'proyecto.ta:id,fecha_inicio,fecha_finalizacion', 'proyecto.idi:id,titulo,fecha_inicio,fecha_finalizacion', 'proyecto.tp:id,nodo_tecnoparque_id,fecha_inicio,fecha_finalizacion', 'proyecto.culturaInnovacion:id,titulo,fecha_inicio,fecha_finalizacion', 'proyecto.servicioTecnologico:id,titulo,fecha_inicio,fecha_finalizacion', 'proyecto.centroFormacion', 'evaluador:id,nombre')->orderBy('proyecto_id', 'ASC')
                ->filterEvaluacion(request()->only('search', 'estado'))->paginate()->appends(['search' => request()->search, 'estado' => request()->estado]),
            'allowedToCreate'   => Gate::inspect('create', [Evaluacion::class])->allowed()
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        $this->authorize('create', [Evaluacion::class]);

        return Inertia::render('Evaluaciones/Create', [
            'proyectos'         => Proyecto::selectRaw("id as value, concat('SGPS-', id + 8000, '-SIPRO') as label")->with('idi', 'ta', 'tp', 'servicioTecnologico', 'culturaInnovacion')->orderBy('id', 'ASC')->get(),
            'evaluadores'       => User::select('users.id as value', 'users.nombre as label')->join('model_has_roles', 'users.id', 'model_has_roles.model_id')->join('roles', 'model_has_roles.role_id', 'roles.id')->where('roles.id', 11)->get(),
            'allowedToCreate'   => Gate::inspect('create', [Evaluacion::class])->allowed()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(EvaluacionRequest $request)
    {
        $this->authorize('create', [Evaluacion::class]);

        $proyecto = Proyecto::find($request->proyecto_id);

        if (Evaluacion::where('proyecto_id', $request->proyecto_id)->where('habilitado', true)->count() == 2 && $request->habilitado && $proyecto->lineaProgramatica->codigo != 68) {
            return redirect()->back()->with('error', 'Este proyecto ya tiene dos evaluaciones habilitadas. Debe modificar alguna evaluación.');
        } else if (Evaluacion::where('proyecto_id', $request->proyecto_id)->where('habilitado', true)->count() == 3 && $request->habilitado && $proyecto->lineaProgramatica->codigo == 68) {
            return redirect()->back()->with('error', 'Este proyecto ya tiene tres evaluaciones habilitadas. Debe modificar alguna evaluación.');
        }

        $evaluacion = new Evaluacion();
        $evaluacion->habilitado  = $request->habilitado;
        $evaluacion->modificable = $request->modificable;
        $evaluacion->iniciado    = false;
        $evaluacion->finalizado  = $request->finalizado;
        $evaluacion->evaluador()->associate($request->user_id);
        $evaluacion->proyecto()->associate($request->proyecto_id);

        $evaluacion->save();

        $proyecto->finalizado = true;
        $proyecto->modificable = false;
        if ($evaluacion->modificable) {
            $proyecto->en_evaluacion = true;
        }
        $proyecto->save();

        switch ($proyecto) {
            case $proyecto->idi()->exists():
                $evaluacion->idiEvaluacion()->create([
                    'id' => $evaluacion->id
                ]);
                break;
            case $proyecto->ta()->exists():
                $evaluacion->taEvaluacion()->create([
                    'id' => $evaluacion->id
                ]);
                break;
            case $proyecto->tp()->exists():
                $evaluacion->tpEvaluacion()->create([
                    'id' => $evaluacion->id
                ]);
                break;
            case $proyecto->servicioTecnologico()->exists():
                $evaluacion->servicioTecnologicoEvaluacion()->create([
                    'id' => $evaluacion->id
                ]);
                break;
            case $proyecto->culturaInnovacion()->exists():
                $evaluacion->culturaInnovacionEvaluacion()->create([
                    'id' => $evaluacion->id
                ]);
                break;
            default:
                break;
        }

        return redirect()->route('evaluaciones.index')->with('success', 'El recurso se ha creado correctamente.');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Evaluacion\Evaluacion  $evaluacion
     * @return \Illuminate\Http\Response
     */
    public function show(Evaluacion $evaluacion)
    {
        $this->authorize('view', [Evaluacion::class, $evaluacion]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Evaluacion\Evaluacion  $evaluacion
     * @return \Illuminate\Http\Response
     */
    public function edit(Evaluacion $evaluacion)
    {
        $this->authorize('update', [Evaluacion::class, $evaluacion]);

        $evaluacion->proyecto->only('codigo');
        $evaluacion->proyecto->convocatoria;

        return Inertia::render('Evaluaciones/Edit', [
            'evaluacion'    => $evaluacion,
            'proyectos'     => Proyecto::selectRaw("id as value, concat('SGPS-', id + 8000, '-SIPRO') as label")->with('idi', 'ta', 'tp', 'servicioTecnologico', 'culturaInnovacion')->orderBy('id', 'ASC')->get(),
            'evaluadores'   => User::select('users.id as value', 'users.nombre as label')->join('model_has_roles', 'users.id', 'model_has_roles.model_id')->join('roles', 'model_has_roles.role_id', 'roles.id')->whereIn('roles.id', [11, 20, 18, 19, 5, 17])->get()
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Evaluacion\Evaluacion  $evaluacion
     * @return \Illuminate\Http\Response
     */
    public function update(EvaluacionRequest $request, Evaluacion $evaluacion)
    {
        $this->authorize('update', [Evaluacion::class, $evaluacion]);

        if (Evaluacion::where('proyecto_id', $request->proyecto_id)->where('habilitado', true)->where('evaluaciones.id', '!=', $evaluacion->id)->count() == 2 && $request->habilitado && $evaluacion->proyecto->lineaProgramatica->codigo != 68) {
            return redirect()->back()->with('error', 'Este proyecto ya tiene dos evaluaciones habilitadas. Debe modificar alguna evaluación.');
        } else if (Evaluacion::where('proyecto_id', $request->proyecto_id)->where('habilitado', true)->where('evaluaciones.id', '!=', $evaluacion->id)->count() == 3 && $request->habilitado && $evaluacion->proyecto->lineaProgramatica->codigo == 68) {
            return redirect()->back()->with('error', 'Este proyecto ya tiene tres evaluaciones habilitadas. Debe modificar alguna evaluación.');
        }

        $evaluacion->habilitado  = $request->habilitado;

        if ($request->modificable) {
            $evaluacion->proyecto()->update(['modificable' => false, 'finalizado' => true, 'habilitado_para_evaluar' => true, 'mostrar_recomendaciones' => false, 'en_evaluacion' => true]);
            $evaluacion->modificable = $request->modificable;
            $evaluacion->finalizado  = false;
        } else {
            $evaluacion->modificable = $request->modificable;
            $evaluacion->finalizado  = true;
        }
        $evaluacion->evaluador()->associate($request->user_id);
        $evaluacion->proyecto()->associate($evaluacion->proyecto_id);

        $evaluacion->save();

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Evaluacion\Evaluacion  $evaluacion
     * @return \Illuminate\Http\Response
     */
    public function destroy(Evaluacion $evaluacion)
    {
        $this->authorize('delete', [Evaluacion::class, $evaluacion]);

        $evaluacion->delete();

        return redirect()->route('evaluaciones.index')->with('success', 'El recurso se ha eliminado correctamente.');
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function activas()
    {
        $this->authorize('viewAny', [Evaluacion::class]);

        return Inertia::render('Evaluaciones/Activas', [
            'evaluaciones'  => Evaluacion::where('modificable', true)->with('proyecto.tecnoacademiaLineasTecnoacademia.tecnoacademia', 'proyecto.ta:id,fecha_inicio,fecha_finalizacion', 'proyecto.idi:id,titulo,fecha_inicio,fecha_finalizacion', 'proyecto.tp:id,nodo_tecnoparque_id,fecha_inicio,fecha_finalizacion', 'proyecto.culturaInnovacion:id,titulo,fecha_inicio,fecha_finalizacion', 'proyecto.servicioTecnologico:id,titulo,fecha_inicio,fecha_finalizacion', 'proyecto.centroFormacion', 'evaluador:id,nombre')->orderBy('proyecto_id', 'ASC')->paginate(),
        ]);
    }

    /**
     * redireccionar
     *
     * @param  mixed $convocatoria
     * @param  mixed $evaluacion
     * @return void
     */
    public function redireccionar(Convocatoria $convocatoria, Evaluacion $evaluacion)
    {
        switch ($evaluacion) {
            case $evaluacion->proyecto->idi()->exists():
                return redirect()->route('convocatorias.idi-evaluaciones.edit', [$convocatoria, $evaluacion]);
                break;
            case $evaluacion->proyecto->ta()->exists():
                return redirect()->route('convocatorias.ta-evaluaciones.edit', [$convocatoria, $evaluacion]);
                break;
            case $evaluacion->proyecto->tp()->exists():
                return redirect()->route('convocatorias.tp-evaluaciones.edit', [$convocatoria, $evaluacion]);
                break;
            case $evaluacion->proyecto->servicioTecnologico()->exists():
                return redirect()->route('convocatorias.servicios-tecnologicos-evaluaciones.edit', [$convocatoria, $evaluacion]);
                break;
            case $evaluacion->proyecto->culturaInnovacion()->exists():
                return redirect()->route('convocatorias.cultura-innovacion-evaluaciones.edit', [$convocatoria, $evaluacion]);
                break;
            default:
                break;
        }
    }

    /**
     * editCausalRechazo
     *
     * @param  mixed $convocatoria
     * @param  mixed $evaluacion
     * @return void
     */
    public function editCausalRechazo(Convocatoria $convocatoria, Evaluacion $evaluacion)
    {
        $this->authorize('visualizar-evaluacion-autor', $evaluacion);

        $evaluacion->proyecto->codigo_linea_programatica = $evaluacion->proyecto->lineaProgramatica->codigo;

        return Inertia::render('Convocatorias/Evaluaciones/CausalRechazo', [
            'convocatoria'                  => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria'),
            'evaluacion'                    => $evaluacion,
            'causalesRechazoRegistradas'    => $evaluacion->evaluacionCausalesRechazo()->pluck('causal_rechazo'),
            'proyecto'                      => $evaluacion->proyecto,
        ]);
    }

    /**
     * updateCausalRechazo
     *
     * @param  mixed $request
     * @param  mixed $convocatoria
     * @param  mixed $evaluacion
     * @return void
     */
    public function updateCausalRechazo(Request $request, Convocatoria $convocatoria, Evaluacion $evaluacion)
    {
        $this->authorize('modificar-evaluacion-autor', $evaluacion);

        $evaluacion->evaluacionCausalesRechazo()->delete();
        $evaluacion->update(['justificacion_causal_rechazo' => $request->justificacion_causal_rechazo]);
        foreach ($request->causal_rechazo as $causalRechazo) {
            $evaluacion->evaluacionCausalesRechazo()->updateOrCreate(
                ['evaluacion_id' => $evaluacion->id, 'causal_rechazo' => $causalRechazo],
            );
        }

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }

    /**
     * showComentariosGeneralesForm
     *
     * @param  mixed $convocatoria
     * @param  mixed $evaluacion
     * @return void
     */
    public function showComentariosGeneralesForm(Convocatoria $convocatoria, Evaluacion $evaluacion)
    {
        $this->authorize('visualizar-evaluacion-autor', $evaluacion);

        $evaluacion->proyecto->codigo_linea_programatica = $evaluacion->proyecto->lineaProgramatica->codigo;

        return Inertia::render('Convocatorias/Evaluaciones/ComentariosGenerales', [
            'convocatoria'                  => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria'),
            'evaluacion'                    => $evaluacion->only('id', 'finalizado', 'habilitado', 'modificable', 'justificacion_causal_rechazo', ' comentario_formulador', 'comentario_evaluador', 'replicas', 'evaluacion_final'),
            'otrasEvaluaciones'             => Evaluacion::where('proyecto_id', $evaluacion->proyecto_id)->where('id', '!=', $evaluacion->id)->with('evaluador')->get(),
            'proyecto'                      => $evaluacion->proyecto,
        ]);
    }

    /**
     * udpdateComentariosGenerales
     *
     * @param  mixed $convocatoria
     * @param  mixed $evaluacion
     * @return void
     */
    public function udpdateComentariosGenerales(Request $request, Convocatoria $convocatoria, Evaluacion $evaluacion)
    {
        $this->authorize('modificar-evaluacion-autor', $evaluacion);

        if ($request->has('comentario_evaluador')) {
            $evaluacion->update(
                ['evaluacion_id' => $evaluacion->id, 'comentario_evaluador' => $request->comentario_evaluador],
            );
        }

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }

    public function deshabilitarEvaluacionesNoIniciadas()
    {
        $convocatoria = Convocatoria::where('esta_activa', true)->where('tipo_convocatoria', 1)->first();

        foreach ($convocatoria->evaluaciones()->get() as $evaluacion) {
            if ($evaluacion->verificar_estado_evaluacion == 'Sin evaluar') {
                $evaluacion->update(['habilitado' => false, 'modificable' => false]);
            }
        }

        return back()->with('success', 'Se han deshabilitado las evaluaciones NO iniciadas.');
    }

    /**
     * udpdateEstadosEvaluaciones
     *
     * @param  mixed $request
     * @return void
     */
    public function udpdateEstadosEvaluaciones(Request $request)
    {
        $proyectosId = collect([]);
        collect(json_decode($request->proyectos_id))->pluck('value')->map(function ($item) use ($proyectosId) {
            return $proyectosId->push($item - 8000);
        });

        if ($request->estado['value'] == 'finalizado') {
            $modificable = false;
            $finalizado = true;
        } else if ($request->estado['value'] == 'modificable') {
            $modificable = true;
            $finalizado = false;
        }

        if ($request->habilitado['value'] == 'habilitado') {
            Evaluacion::whereIn('proyecto_id', $proyectosId)->update(['habilitado' => true]);
        } else if ($request->habilitado['value'] == 'deshabilitado') {
            Evaluacion::whereIn('proyecto_id', $proyectosId)->update(['habilitado' => false]);
        }

        Evaluacion::whereIn('proyecto_id', $proyectosId)->update(['modificable' => $modificable, 'finalizado' => $finalizado]);

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }
}
