<?php

namespace App\Http\Controllers;

use App\Helpers\SelectHelper;
use App\Http\Requests\ConvocatoriaRequest;
use App\Models\Convocatoria;
use App\Models\Idi;
use App\Models\LineaProgramatica;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ConvocatoriaController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $this->authorize('listar-convocatorias');

        return Inertia::render('Convocatorias/Index', [
            'filters'               => request()->all('search'),
            'convocatorias'         => Convocatoria::orderBy('id', 'DESC')->filterConvocatoria(request()->only('search'))->paginate()->appends(['search' => request()->search]),
            'convocatoria_activa'   => Convocatoria::where('esta_activa', 1)->first(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        $this->authorize('create', [Convocatoria::class]);

        return Inertia::render('Convocatorias/Create', [
            'fases'             => collect(json_decode(Storage::get('json/fases-convocatoria.json'), true)),
            'tiposConvocatoria' => collect(json_decode(Storage::get('json/tipos-convocatoria.json'), true)),
            'convocatorias'     => SelectHelper::convocatorias(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(ConvocatoriaRequest $request)
    {
        $this->authorize('create', [Convocatoria::class]);

        $convocatoria = Convocatoria::create($request->validated());

        $convocatoriaFormulacionActiva = Convocatoria::where('esta_activa', true)->where('tipo_convocatoria', 1)->first();
        if ($convocatoriaFormulacionActiva && $request->esta_activa && $request->tipo_convocatoria == 1) {
            $convocatoriaFormulacionActiva->esta_activa = false;
            $convocatoriaFormulacionActiva->save();
        }

        $convocatoriaDemoActiva = Convocatoria::where('esta_activa', true)->where('tipo_convocatoria', 2)->first();
        if ($convocatoriaDemoActiva && $request->esta_activa && $request->tipo_convocatoria == 2) {
            $convocatoriaDemoActiva->esta_activa = false;
            $convocatoriaDemoActiva->save();
        }

        $convocatoriaTaTpActiva = Convocatoria::where('esta_activa', true)->where('tipo_convocatoria', 3)->first();
        if ($convocatoriaTaTpActiva && $convocatoriaTaTpActiva->id != $convocatoria->id && $convocatoria->tipo_convocatoria == 3) {
            $convocatoriaTaTpActiva->esta_activa = false;
            $convocatoriaTaTpActiva->save();
        }

        DB::select('SELECT public."crear_convocatoria_presupuesto"(' . $request->convocatoria_id['value'] . ',' . $convocatoria->id . ')');
        DB::select('SELECT public."crear_convocatoria_rol_sennova"(' . $request->convocatoria_id['value'] . ',' . $convocatoria->id . ')');

        return redirect()->route('convocatorias.index')->with('success', 'El recurso se ha creado correctamente.');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Convocatoria  $convocatoria
     * @return \Illuminate\Http\Response
     */
    public function show(Convocatoria $convocatoria)
    {
        $this->authorize('view', [Convocatoria::class, $convocatoria]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Convocatoria  $convocatoria
     * @return \Illuminate\Http\Response
     */
    public function edit(Convocatoria $convocatoria)
    {
        $this->authorize('update', [Convocatoria::class, $convocatoria]);

        return Inertia::render('Convocatorias/Edit', [
            'convocatoria'                               => $convocatoria,
            'lineas_programaticas'                       => LineaProgramatica::selectRaw("id as value, CONCAT(nombre, ' - Código: ', codigo) as label")->orderBy('nombre', 'ASC')->get(),
            'lineasProgramaticasActivasRelacionadas'     => LineaProgramatica::select("id")->whereIn('id', $convocatoria->lineas_programaticas_activas ? json_decode($convocatoria->lineas_programaticas_activas) : [])->pluck('id')->flatten(),
            'fases'                                      => collect(json_decode(Storage::get('json/fases-convocatoria.json'), true)),
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Convocatoria  $convocatoria
     * @return \Illuminate\Http\Response
     */
    public function update(ConvocatoriaRequest $request, Convocatoria $convocatoria)
    {
        $this->authorize('update', [Convocatoria::class, $convocatoria]);

        $convocatoria->update($request->validated());

        if ($request->esta_activa) {
            $convocatoriaFormulacionActiva = Convocatoria::where('esta_activa', true)->where('tipo_convocatoria', 1)->first();
            if ($convocatoriaFormulacionActiva && $convocatoriaFormulacionActiva->id != $convocatoria->id && $convocatoria->tipo_convocatoria == 1) {
                $convocatoriaFormulacionActiva->esta_activa = false;
                $convocatoriaFormulacionActiva->save();
            }

            $convocatoriaDemoActiva = Convocatoria::where('esta_activa', true)->where('tipo_convocatoria', 2)->first();
            if ($convocatoriaDemoActiva && $convocatoriaDemoActiva->id != $convocatoria->id && $convocatoria->tipo_convocatoria == 2) {
                $convocatoriaDemoActiva->esta_activa = false;
                $convocatoriaDemoActiva->save();
            }

            $convocatoriaTaTpActiva = Convocatoria::where('esta_activa', true)->where('tipo_convocatoria', 3)->first();
            if ($convocatoriaTaTpActiva && $convocatoriaTaTpActiva->id != $convocatoria->id && $convocatoria->tipo_convocatoria == 3) {
                $convocatoriaTaTpActiva->esta_activa = false;
                $convocatoriaTaTpActiva->save();
            }
        }

        if ($request->mostrar_recomendaciones == true) {
            $convocatoria->proyectos()->update(['mostrar_recomendaciones' => true]);
        } else {
            $convocatoria->proyectos()->update(['mostrar_recomendaciones' => false]);
        }

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Convocatoria  $convocatoria
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, Convocatoria $convocatoria)
    {
        $this->authorize('delete', [Convocatoria::class, $convocatoria]);
        if (!Hash::check($request->password, Auth::user()->password)) {
            return back()
                ->withErrors(['password' => 'Contraseña incorrecta']);
        }

        $convocatoria->delete();

        return redirect()->route('convocatorias.index')->with('success', 'El recurso se ha eliminado correctamente.');
    }

    /**
     * Display the lineasProgramaticas.
     *
     * @return \Illuminate\Http\Response
     */
    public function lineasProgramaticas(Convocatoria $convocatoria)
    {
        if ($convocatoria->tipo_convocatoria == 3) {
            return redirect()->route('nuevos-proyectos-ta-tp', $convocatoria);
        }

        return Inertia::render('Convocatorias/LineasProgramaticas', [
            'convocatoria'          => $convocatoria,
            'lineas_programaticas'  => LineaProgramatica::select('id', 'nombre', 'codigo')->get()
        ]);
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function proyectosPorLineaProgramatica(Convocatoria $convocatoria, LineaProgramatica $lineaProgramatica)
    {
        switch ($lineaProgramatica->id) {
            case 1:
            case 2:
            case 3:
            case 29:
                return redirect()->route('convocatorias.idi.index', [$convocatoria]);
                break;

            case 4:
                return redirect()->route('convocatorias.tp.index', [$convocatoria]);
                break;

            case 5:
                return redirect()->route('convocatorias.ta.index', [$convocatoria]);
                break;

            case 9:
                return redirect()->route('convocatorias.cultura-innovacion.index', [$convocatoria]);
                break;

            case 10:
                return redirect()->route('convocatorias.st.index', [$convocatoria]);
                break;
            default:
                return back();
                break;
        }
    }

    /**
     * updateFase
     *
     * @param  mixed $request
     * @param  mixed $convocatoria
     * @return void
     */
    public function updateFase(Request $request, Convocatoria $convocatoria)
    {
        foreach ($convocatoria->evaluaciones()->get() as $evaluacion) {
            $evaluacion->update(['estado' => $evaluacion->verificar_estado_evaluacion]);
        }

        $convocatoria->fase                     = $request->fase['value'];
        $convocatoria->fecha_finalizacion_fase  = $request->fecha_finalizacion_fase;
        $convocatoria->hora_finalizacion_fase   = $request->hora_finalizacion_fase;
        $convocatoria->save();

        if ($request->fase['value'] == 1) { // Formulación
            $convocatoria->proyectos()->update(['finalizado' => false, 'modificable' => true, 'habilitado_para_evaluar' => false]);
            $convocatoria->evaluaciones()->update(['modificable' => false, 'finalizado' => true, 'iniciado' => false]);
        } else if ($request->fase['value'] == 2) { // Primera evaluación
            $convocatoria->proyectos()->update(['modificable' => false, 'habilitado_para_evaluar' => true, 'radicado' => true]);
        } else if ($request->fase['value'] == 3) { // Subsanación

            foreach ($convocatoria->proyectos()->get() as $proyecto) {
                switch ($proyecto) {
                    case $proyecto->estado_evaluacion_idi != null:
                        if (json_decode($proyecto->estado_evaluacion_idi)->requiereSubsanar) {
                            $proyecto->update(['finalizado' => false, 'modificable' => true, 'habilitado_para_evaluar' => false, 'estado' => $proyecto->estado_evaluacion_idi, 'mostrar_recomendaciones' => true]);
                        } else {
                            $proyecto->update(['finalizado' => true, 'modificable' => false, 'habilitado_para_evaluar' => false, 'estado' => $proyecto->estado_evaluacion_idi]);
                        }
                        break;

                    case $proyecto->estado_evaluacion_cultura_innovacion != null:
                        if (json_decode($proyecto->estado_evaluacion_cultura_innovacion)->requiereSubsanar) {
                            $proyecto->update(['finalizado' => false, 'modificable' => true, 'habilitado_para_evaluar' => false, 'estado' => $proyecto->estado_evaluacion_cultura_innovacion, 'mostrar_recomendaciones' => true]);
                        } else {
                            $proyecto->update(['finalizado' => true, 'modificable' => false, 'habilitado_para_evaluar' => false, 'estado' => $proyecto->estado_evaluacion_cultura_innovacion]);
                        }
                        break;

                    case $proyecto->estado_evaluacion_ta != null:
                        if (json_decode($proyecto->estado_evaluacion_ta)->requiereSubsanar) {
                            $proyecto->update(['finalizado' => false, 'modificable' => true, 'habilitado_para_evaluar' => false, 'estado' => $proyecto->estado_evaluacion_ta, 'mostrar_recomendaciones' => true]);
                        } else {
                            $proyecto->update(['finalizado' => true, 'modificable' => false, 'habilitado_para_evaluar' => false, 'estado' => $proyecto->estado_evaluacion_ta]);
                        }
                        break;

                    case $proyecto->estado_evaluacion_tp != null:
                        if (json_decode($proyecto->estado_evaluacion_tp)->requiereSubsanar) {
                            $proyecto->update(['finalizado' => false, 'modificable' => true, 'habilitado_para_evaluar' => false, 'estado' => $proyecto->estado_evaluacion_tp, 'mostrar_recomendaciones' => true]);
                        } else {
                            $proyecto->update(['finalizado' => true, 'modificable' => false, 'habilitado_para_evaluar' => false, 'estado' => $proyecto->estado_evaluacion_tp]);
                        }
                        break;

                    case $proyecto->estado_evaluacion_servicios_tecnologicos != null:
                        if (json_decode($proyecto->estado_evaluacion_servicios_tecnologicos)->requiereSubsanar) {
                            $proyecto->update(['finalizado' => false, 'modificable' => true, 'habilitado_para_evaluar' => false, 'estado' => $proyecto->estado_evaluacion_servicios_tecnologicos, 'mostrar_recomendaciones' => true]);
                        } else {
                            $proyecto->update(['finalizado' => true, 'modificable' => false, 'habilitado_para_evaluar' => false, 'estado' => $proyecto->estado_evaluacion_servicios_tecnologicos]);
                        }
                        break;

                    default:
                        break;
                }
            }

            $convocatoria->evaluaciones()->where('clausula_confidencialidad', true)->update(['modificable' => false, 'finalizado' => true, 'iniciado' => false]);
        } else if ($request->fase['value'] == 4) { // Segunda evaluación

            foreach ($convocatoria->proyectos()->get() as $proyecto) {
                switch ($proyecto) {
                    case $proyecto->estado_evaluacion_idi != null:
                        if (json_decode($proyecto->estado_evaluacion_idi)->requiereSubsanar) {
                            $proyecto->update(['finalizado' => true, 'modificable' => false, 'habilitado_para_evaluar' => true, 'estado' => $proyecto->estado_evaluacion_idi, 'mostrar_recomendaciones' => false, 'en_evaluacion' => true]);
                        }
                        break;

                    case $proyecto->estado_evaluacion_cultura_innovacion != null:
                        if (json_decode($proyecto->estado_evaluacion_cultura_innovacion)->requiereSubsanar) {
                            $proyecto->update(['finalizado' => true, 'modificable' => false, 'habilitado_para_evaluar' => true, 'estado' => $proyecto->estado_evaluacion_cultura_innovacion, 'mostrar_recomendaciones' => false, 'en_evaluacion' => true]);
                        }
                        break;

                    case $proyecto->estado_evaluacion_ta != null:
                        if (json_decode($proyecto->estado_evaluacion_ta)->requiereSubsanar) {
                            $proyecto->update(['finalizado' => true, 'modificable' => false, 'habilitado_para_evaluar' => true, 'estado' => $proyecto->estado_evaluacion_ta, 'mostrar_recomendaciones' => false, 'en_evaluacion' => true]);
                        }
                        break;

                    case $proyecto->estado_evaluacion_tp != null:
                        if (json_decode($proyecto->estado_evaluacion_tp)->requiereSubsanar) {
                            $proyecto->update(['finalizado' => true, 'modificable' => false, 'habilitado_para_evaluar' => true, 'estado' => $proyecto->estado_evaluacion_tp, 'mostrar_recomendaciones' => false, 'en_evaluacion' => true]);
                        }
                        break;

                    case $proyecto->estado_evaluacion_servicios_tecnologicos != null:
                        if (json_decode($proyecto->estado_evaluacion_servicios_tecnologicos)->requiereSubsanar) {
                            $proyecto->update(['finalizado' => true, 'modificable' => false, 'habilitado_para_evaluar' => true, 'estado' => $proyecto->estado_evaluacion_servicios_tecnologicos, 'mostrar_recomendaciones' => false, 'en_evaluacion' => true]);
                        }
                        break;

                    default:
                        break;
                }
            }

            $convocatoria->evaluaciones()->where('clausula_confidencialidad', true)->update(['modificable' => true, 'finalizado' => false, 'iniciado' => false]);
        } else if ($request->fase['value'] == 5) { // Finalizar convocatoria
            $convocatoria->proyectos()->update(['modificable' => false]);
            $convocatoria->evaluaciones()->where('clausula_confidencialidad', true)->update(['modificable' => false, 'finalizado' => true, 'iniciado' => false]);
        }

        $convocatoria->evaluaciones()->where('estado', 'LIKE', 'Sin evaluar')->update(['habilitado' => false]);

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }

    public function nuevosProyectosTaTp()
    {
        $convocatoria = Convocatoria::where('esta_activa', true)->where('tipo_convocatoria', 3)->first();

        if ($convocatoria) {
            return Inertia::render('NuevasTecnoAcademiasTecnoparques/Index', [
                'convocatoria' => $convocatoria,
            ]);
        } else {
            return back()->with('error', 'No es posible ingresar a este módulo.');
        }
    }
}
