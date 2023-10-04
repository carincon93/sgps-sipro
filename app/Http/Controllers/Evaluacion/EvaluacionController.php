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
            'evaluaciones'      => Evaluacion::with(
                'proyecto.proyectoFormulario1Linea65:id,titulo,fecha_inicio,fecha_finalizacion',
                'proyecto.proyectoFormulario3Linea61:id,titulo,fecha_inicio,fecha_finalizacion',
                'proyecto.proyectoFormulario4Linea70:id,tecnoacademia_id,fecha_inicio,fecha_finalizacion',
                'proyecto.proyectoFormulario5Linea69:id,nodo_tecnoparque_id,fecha_inicio,fecha_finalizacion',
                'proyecto.proyectoFormulario6Linea82:id,titulo,fecha_inicio,fecha_finalizacion',
                'proyecto.proyectoFormulario7Linea23:id,titulo,fecha_inicio,fecha_finalizacion',
                'proyecto.proyectoFormulario8Linea66:id,titulo,fecha_inicio,fecha_finalizacion',
                'proyecto.proyectoFormulario9Linea23:id,titulo,fecha_inicio,fecha_finalizacion',
                'proyecto.proyectoFormulario10Linea69:id,hub_innovacion_id,fecha_inicio,fecha_finalizacion',
                'proyecto.proyectoFormulario11Linea83:id,titulo,fecha_inicio,fecha_finalizacion',
                'proyecto.proyectoFormulario12Linea68:id,titulo,fecha_inicio,fecha_finalizacion',
                'proyecto.proyectoFormulario13Linea65:id,titulo,fecha_inicio,fecha_finalizacion',
                'proyecto.proyectoFormulario15Linea65:id,titulo,fecha_inicio,fecha_finalizacion',
                'proyecto.proyectoFormulario16Linea65:id,titulo,fecha_inicio,fecha_finalizacion',
                'proyecto.proyectoFormulario17Linea69:id,nodo_tecnoparque_id,fecha_inicio,fecha_finalizacion',
                'proyecto.convocatoria',
                'proyecto.centroFormacion',
                'evaluador:id,nombre'
            )
                ->orderBy('habilitado', 'Desc')
                ->orderBy('iniciado', 'ASC')
                ->orderBy('proyecto_id', 'ASC')
                ->filterEvaluacion(request()->only('search', 'estado'))->paginate()->appends(['search' => request()->search, 'estado' => request()->estado]),
            'allowed_to_create'   => Gate::inspect('create', [Evaluacion::class])->allowed()
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
            'proyectos'         => Proyecto::selectRaw("id as value, concat('SGPS-', id + 8000, '-SIPRO') as label")->with('proyectosFormulario8Linea66', 'proyectosFormulario4Linea70', 'proyectosFormulario5Linea69', 'proyectosFormulario12Linea68', 'proyectosFormulario1Linea65')->orderBy('id', 'ASC')->get(),
            'evaluadores'       => User::select('users.id as value', 'users.nombre as label')->join('model_has_roles', 'users.id', 'model_has_roles.model_id')->join('roles', 'model_has_roles.role_id', 'roles.id')->where('roles.id', 11)->get(),
            'allowed_to_create'   => Gate::inspect('create', [Evaluacion::class])->allowed()
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
        $evaluacion->habilitado         = $request->habilitado;
        $evaluacion->modificable        = $request->modificable;
        $evaluacion->convocatoria_id    = $proyecto->convocatoria_id;
        $evaluacion->iniciado           = false;
        $evaluacion->finalizado         = $request->finalizado;
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
            case $proyecto->proyectoFormulario8Linea66()->exists():
                $evaluacion->evaluacionProyectoFormulario8Linea66()->create([
                    'id' => $evaluacion->id
                ]);
                break;
            case $proyecto->proyectoFormulario4Linea70()->exists():
                $evaluacion->evaluacionProyectoFormulario4Linea70()->create([
                    'id' => $evaluacion->id
                ]);
                break;
            case $proyecto->proyectoFormulario5Linea69()->exists():
                $evaluacion->evaluacionProyectoFormulario5Linea69()->create([
                    'id' => $evaluacion->id
                ]);
                break;
            case $proyecto->proyectoFormulario12Linea68()->exists():
                $evaluacion->evaluacionProyectoFormulario12Linea68()->create([
                    'id' => $evaluacion->id
                ]);
                break;
            case $proyecto->proyectoFormulario1Linea65()->exists():
                $evaluacion->evaluacionProyectoFormulario1Linea65()->create([
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
            'proyectos'     => Proyecto::selectRaw("id as value, concat('SGPS-', id + 8000, '-SIPRO') as label")->with('proyectosFormulario8Linea66', 'proyectosFormulario4Linea70', 'proyectosFormulario5Linea69', 'proyectosFormulario12Linea68', 'proyectosFormulario1Linea65')->orderBy('id', 'ASC')->get(),
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
            'evaluaciones'  => Evaluacion::where('modificable', true)->with('proyecto.tecnoacademiaLineasTecnoacademia.tecnoacademia', 'proyecto.proyectoFormulario4Linea70:id,fecha_inicio,fecha_finalizacion', 'proyecto.proyectoFormulario8Linea66:id,titulo,fecha_inicio,fecha_finalizacion', 'proyecto.proyectoFormulario5Linea69:id,nodo_tecnoparque_id,fecha_inicio,fecha_finalizacion', 'proyecto.proyectoFormulario1Linea65:id,titulo,fecha_inicio,fecha_finalizacion', 'proyecto.proyectoFormulario12Linea68:id,titulo,fecha_inicio,fecha_finalizacion', 'proyecto.centroFormacion', 'evaluador:id,nombre')->orderBy('proyecto_id', 'ASC')->paginate(),
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
     * udpdateComentariosGenerales
     *
     * @param  mixed $convocatoria
     * @param  mixed $evaluacion
     * @return void
     */
    public function udpdateComentariosGenerales(Request $request, Convocatoria $convocatoria, Evaluacion $evaluacion)
    {
        $this->authorize('modificar-evaluacion-autor', $evaluacion);

        if ($request->filled('comentario_evaluador')) {
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

    public function evaluadores()
    {
        $this->authorize('viewAny', [User::class]);

        return Inertia::render('Evaluaciones/Evaluadores/Index', [
            'evaluadores'   =>  User::select('users.id', 'users.nombre', 'users.email', 'users.habilitado', 'users.informacion_completa', 'centro_formacion_id')->whereHas('roles', function ($query) {
                $query->whereIn('id', [11, 33]);
            })->with('roles', 'centroFormacion.regional')->orderBy('habilitado', 'DESC')->orderBy('nombre', 'ASC')
                ->filterUser(request()->only('search', 'roles'))->paginate()
        ]);
    }
}
