<?php

namespace App\Http\Controllers\Evaluacion;

use App\Helpers\SelectHelper;
use App\Models\Evaluacion\Evaluacion;
use App\Http\Controllers\Controller;
use App\Http\Controllers\ConvocatoriaController;
use App\Http\Requests\Evaluacion\EvaluacionRequest;
use App\Models\Convocatoria;
use App\Models\Proyecto;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class EvaluacionController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        // $this->authorize('viewAny', [Evaluacion::class]);

        /** @var \App\Models\User */
        $auth_user = Auth::user();

        $evaluaciones = Evaluacion::getEvaluacionesPorRol(preg_replace('/[^0-9]/', '', $request->convocatoria_id))->appends(['search' => request()->search, 'estado' => request()->estado]);

        if ($auth_user->hasRole([1, 5, 17, 18, 19, 20])) {
            $evaluadores = $evaluaciones->pluck('evaluador');

            foreach ($evaluadores as $evaluador) {
                if (!$evaluador->hasRole([11, 33])) {
                    $evaluador->assignRole(11);
                }
            }
        }

        return Inertia::render('Evaluaciones/Index', [
            'convocatorias'         => SelectHelper::convocatorias(),
            'evaluaciones'          => $evaluaciones,
            'proyectos'             => DB::table('proyectos')->selectRaw("id as value, concat('SGPS-', id + 8000, '-SIPRO') as label")->orderBy('id', 'ASC')->get(),
            'evaluadores'           => User::select('users.id as value', 'users.nombre as label')->join('model_has_roles', 'users.id', 'model_has_roles.model_id')->join('roles', 'model_has_roles.role_id', 'roles.id')->where('users.habilitado', true)->whereIn('roles.id', [11, 33])->distinct('users.id', 'users.nombre')->orderBy('users.nombre', 'ASC')->get(),
            'allowed_to_create'     => Gate::inspect('create', [Evaluacion::class])->allowed()
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

        // 
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

        $evaluacion = new Evaluacion();
        $evaluacion->habilitado         = $request->habilitado;
        $evaluacion->modificable        = $request->modificable;
        $evaluacion->convocatoria_id    = $proyecto->convocatoria_id;
        $evaluacion->iniciado           = false;
        $evaluacion->finalizado         = $request->finalizado;
        $evaluacion->evaluador()->associate($request->user_id);
        $evaluacion->proyecto()->associate($request->proyecto_id);

        $evaluacion->save();

        $proyecto->finalizado  = true;
        $proyecto->modificable = false;
        if ($evaluacion->modificable) {
            $proyecto->en_evaluacion = true;
        }

        $proyecto->save();

        $convocatoria = Convocatoria::find($proyecto->convocatoria_id);

        ConvocatoriaController::refreshItemsAEvaluar($convocatoria, $proyecto->tipo_formulario_convocatoria_id);

        return back()->with('success', 'El recurso se ha creado correctamente.');
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

        // 
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

        //    
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

        $evaluacion->habilitado  = $request->habilitado;

        if ($request->filled('modificable')) {
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

        return back()->with('success', 'El recurso se ha eliminado correctamente.');
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function activas()
    {
        $this->authorize('viewAny', [Evaluacion::class]);

        return Inertia::render('Activas', [
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
     * udpdateComentarioEvaluador
     *
     * @param  mixed $convocatoria
     * @param  mixed $evaluacion
     * @return void
     */
    public function udpdateComentarioEvaluador(Request $request, Convocatoria $convocatoria, Evaluacion $evaluacion)
    {
        $this->authorize('modificar-evaluacion-autor', $evaluacion);

        $evaluacion->update(
            ['evaluacion_id' => $evaluacion->id, 'comentario_evaluador' => $request->comentario_evaluador],
        );

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
     * Finalizar evaluación.
     *
     * @param  \App\Models\Proyecto  $proyecto
     * @return \Illuminate\Http\Response
     */
    public function finalizarEvaluacion(Request $request, Convocatoria $convocatoria, Evaluacion $evaluacion)
    {
        if ($request->filled('habilitado')) {
            if ($request->habilitado) {
                $evaluacion->update([
                    'habilitado'  => true,
                ]);
            } else {
                $evaluacion->update([
                    'habilitado'  => false, 'finalizado'  => true,
                ]);
            }
        }

        if ($request->finalizado) {
            $evaluacion->update([
                'iniciado'    => false,
                'finalizado'  => true,
                'modificable' => false,
            ]);
        } else if ($request->modificar) {
            $evaluacion->update([
                'iniciado'    => true,
                'finalizado'  => false,
                'modificable' => true,
            ]);
        }

        if ($evaluacion->proyecto->evaluaciones()->where('evaluaciones.habilitado', true)->count() == $evaluacion->proyecto->evaluaciones()->where('evaluaciones.finalizado', true)->where('evaluaciones.habilitado', true)->count()) {
            $proyecto = $evaluacion->proyecto;

            $proyecto->update([
                'estado' => $evaluacion->proyecto->estado_evaluacion_proyecto_formulario_8_linea_66 ?? $evaluacion->proyecto->estado_evaluacion_proyecto_formulario_6_linea_82
            ]);
        }

        return back()->with('success', 'El estado de la evaluación ha cambiado correctamente.');
    }


    /**
     * udpdateEstadosEvaluaciones
     *
     * @param  mixed $request
     * @return void
     */
    public function udpdateEstadosEvaluaciones(Request $request)
    {
        $proyectos_id = collect([]);
        collect(json_decode($request->proyectos_id))->pluck('value')->map(function ($item) use ($proyectos_id) {
            return $proyectos_id->push($item - 8000);
        });

        if ($request->estado['value'] == 'finalizado') {
            $modificable = false;
            $finalizado = true;
        } else if ($request->estado['value'] == 'modificable') {
            $modificable = true;
            $finalizado = false;
        }

        if ($request->habilitado['value'] == 'habilitado') {
            Evaluacion::whereIn('proyecto_id', $proyectos_id)->update(['habilitado' => true]);
        } else if ($request->habilitado['value'] == 'deshabilitado') {
            Evaluacion::whereIn('proyecto_id', $proyectos_id)->update(['habilitado' => false]);
        }

        Evaluacion::whereIn('proyecto_id', $proyectos_id)->update(['modificable' => $modificable, 'finalizado' => $finalizado]);

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }

    public function evaluadores()
    {
        $this->authorize('viewAny', [User::class]);

        return Inertia::render('Evaluadores/Index', [
            'evaluadores'   =>  User::select('users.id', 'users.nombre', 'users.email', 'users.habilitado', 'users.informacion_completa', 'centro_formacion_id')->whereHas('roles', function ($query) {
                $query->whereIn('id', [11, 33]);
            })->with('roles', 'centroFormacion.regional')->orderBy('habilitado', 'DESC')->orderBy('nombre', 'ASC')
                ->filterUser(request()->only('search', 'roles'))->paginate()
        ]);
    }
}
