<?php

namespace App\Http\Controllers;

use App\Helpers\SelectHelper;
use App\Http\Requests\ConvocatoriaRequest;
use App\Models\Convocatoria;
use App\Models\ConvocatoriaPresupuesto;
use App\Models\ConvocatoriaRolSennova;
use App\Models\Evaluacion\Evaluacion;
use App\Models\Evaluacion\EvaluacionProyectoFormulario10Linea69;
use App\Models\Evaluacion\EvaluacionProyectoFormulario12Linea68;
use App\Models\Evaluacion\EvaluacionProyectoFormulario13Linea65;
use App\Models\Evaluacion\EvaluacionProyectoFormulario15Linea65;
use App\Models\Evaluacion\EvaluacionProyectoFormulario16Linea65;
use App\Models\Evaluacion\EvaluacionProyectoFormulario17Linea69;
use App\Models\Evaluacion\EvaluacionProyectoFormulario1Linea65;
use App\Models\Evaluacion\EvaluacionProyectoFormulario3Linea61;
use App\Models\Evaluacion\EvaluacionProyectoFormulario4Linea70;
use App\Models\Evaluacion\EvaluacionProyectoFormulario5Linea69;
use App\Models\Evaluacion\EvaluacionProyectoFormulario6Linea82;
use App\Models\Evaluacion\EvaluacionProyectoFormulario7Linea23;
use App\Models\Evaluacion\EvaluacionProyectoFormulario8Linea66;
use App\Models\Evaluacion\EvaluacionProyectoFormulario9Linea23;
use App\Models\Evaluacion\PreguntaEvaluacionFormulario10Linea69;
use App\Models\Evaluacion\PreguntaEvaluacionFormulario12Linea68;
use App\Models\Evaluacion\PreguntaEvaluacionFormulario13Linea65;
use App\Models\Evaluacion\PreguntaEvaluacionFormulario15Linea65;
use App\Models\Evaluacion\PreguntaEvaluacionFormulario16Linea65;
use App\Models\Evaluacion\PreguntaEvaluacionFormulario17Linea69;
use App\Models\Evaluacion\PreguntaEvaluacionFormulario1Linea65;
use App\Models\Evaluacion\PreguntaEvaluacionFormulario3Linea61;
use App\Models\Evaluacion\PreguntaEvaluacionFormulario4Linea70;
use App\Models\Evaluacion\PreguntaEvaluacionFormulario5Linea69;
use App\Models\Evaluacion\PreguntaEvaluacionFormulario6Linea82;
use App\Models\Evaluacion\PreguntaEvaluacionFormulario7Linea23;
use App\Models\Evaluacion\PreguntaEvaluacionFormulario8Linea66;
use App\Models\Evaluacion\PreguntaEvaluacionFormulario9Linea23;
use App\Models\Idi;
use App\Models\LineaProgramatica;
use App\Models\RolSennova;
use App\Models\RubroPresupuestal;
use App\Models\TipoFormularioConvocatoria;
use App\Models\TopeRolSennovaTecnoparque;
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
        try {
            $this->authorize('listar-convocatorias');
        } catch (\Illuminate\Auth\Access\AuthorizationException $e) {
            return redirect()->route('users.perfil')->with('error', 'Error: No está autorizado(a) para ingresar a las convocatorias. En este formulario diríjase a la sección "Roles de sistema" y seleccione un rol de proponente.');
        }

        return Inertia::render('Convocatorias/Index', [
            'convocatorias' => Convocatoria::orderBy('id', 'DESC')->filterConvocatoria(request()->only('search'))->paginate()->appends(['search' => request()->search]),
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
            'tipos_formulario_convocatoria' => TipoFormularioConvocatoria::selectRaw("tipos_formulario_convocatoria.id as value, CONCAT(tipos_formulario_convocatoria.nombre, ' - Línea: ', lineas_programaticas.codigo) as label")
                ->join('lineas_programaticas', 'tipos_formulario_convocatoria.linea_programatica_id', 'lineas_programaticas.id')
                ->where('tipos_formulario_convocatoria.habilitado', true)
                ->orderBy('tipos_formulario_convocatoria.id', 'ASC')->get(),
            'convocatorias'                 => SelectHelper::convocatorias(),
            'fases'                         => collect(json_decode(Storage::get('json/fases-convocatoria.json'), true)),
            'tipos_convocatoria'            => collect(json_decode(Storage::get('json/tipos-convocatoria.json'), true)),
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

        $tipos_formulario_convocatoria = TipoFormularioConvocatoria::select('id')->get()->pluck('id')->toArray();

        $convocatoria->tiposFormularioConvocatoria()->sync($tipos_formulario_convocatoria);

        DB::select('SELECT public."crear_convocatoria_presupuesto"(' . $request->convocatoria_id . ',' . $convocatoria->id . ')');
        DB::select('SELECT public."crear_convocatoria_rol_sennova"(' . $request->convocatoria_id . ',' . $convocatoria->id . ')');

        $rubros_convocatoria_por_formulario     = ConvocatoriaPresupuesto::selectRaw('DISTINCT(tipo_formulario_convocatoria_id)')->where('convocatoria_id', $request->convocatoria_id)->pluck('tipo_formulario_convocatoria_id')->toArray();

        $rubro_formulario_fuera_convocatoria    = array_diff($tipos_formulario_convocatoria, $rubros_convocatoria_por_formulario);

        if (count($rubro_formulario_fuera_convocatoria) > 0) {
            foreach ($rubro_formulario_fuera_convocatoria as $value) {
                $rubros_a_agregar = RubroPresupuestal::all();

                $insert_data = $rubros_a_agregar->map(function ($rubro) use ($value, $convocatoria) {
                    return [
                        'convocatoria_id'                   => $convocatoria->id,
                        'rubro_presupuestal_id'             => $rubro->id,
                        'tipo_formulario_convocatoria_id'   => $value,
                        'sumar_al_presupuesto'              => true,
                        'requiere_estudio_mercado'          => true,
                        'habilitado'                        => true,
                    ];
                });

                ConvocatoriaPresupuesto::insert($insert_data->toArray());
            }
        }

        $roles_convocatoria_por_formulario = ConvocatoriaRolSennova::selectRaw('DISTINCT(tipo_formulario_convocatoria_id)')->where('convocatoria_id', $request->convocatoria_id)->pluck('tipo_formulario_convocatoria_id')->toArray();

        $rol_formulario_fuera_convocatoria = array_diff($tipos_formulario_convocatoria, $roles_convocatoria_por_formulario);

        if (count($rol_formulario_fuera_convocatoria) > 0) {
            foreach ($rol_formulario_fuera_convocatoria as $value) {
                $roles_a_agregar = RolSennova::all();

                $insert_data = $roles_a_agregar->map(function ($rol) use ($value, $convocatoria) {
                    return [
                        'tipo_formulario_convocatoria_id'   => $value,
                        'convocatoria_id'                   => $convocatoria->id,
                        'rol_sennova_id'                    => $rol->id,
                        'asignacion_mensual'                => null,
                        'experiencia'                       => null,
                        'nivel_academico'                   => null,
                        'perfil'                            => null,
                        'mensaje'                           => null,
                        'sumar_al_presupuesto'              => true,
                        'habilitado'                        => true,
                    ];
                });

                ConvocatoriaRolSennova::insert($insert_data->toArray());
            }
        }

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

        $convocatoria->tiposFormularioConvocatoria;

        return Inertia::render('Convocatorias/Edit', [
            'convocatoria'                  => $convocatoria,
            'tipos_formulario_convocatoria' => TipoFormularioConvocatoria::selectRaw("tipos_formulario_convocatoria.id as value, CONCAT(tipos_formulario_convocatoria.nombre, ' - Línea: ', lineas_programaticas.codigo) as label")
                ->join('lineas_programaticas', 'tipos_formulario_convocatoria.linea_programatica_id', 'lineas_programaticas.id')
                ->where('tipos_formulario_convocatoria.habilitado', true)
                ->orderBy('tipos_formulario_convocatoria.nombre', 'ASC')->get(),
            'fases'                         => collect(json_decode(Storage::get('json/fases-convocatoria.json'), true)),
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

        $convocatoria->tiposFormularioConvocatoria()->sync($request->tipos_formulario_convocatoria);

        if ($request->filled('fase')) {
            self::updateFase($request, $convocatoria);
        }

        foreach ($convocatoria->tiposFormularioConvocatoria as $tipo_formulario_convocatoria) {
            if (in_array($tipo_formulario_convocatoria->id, $request->formularios_visibles)) {
                $convocatoria->tiposFormularioConvocatoria()->updateExistingPivot($tipo_formulario_convocatoria->id, ['visible' => true]);
            } else {
                $convocatoria->tiposFormularioConvocatoria()->updateExistingPivot($tipo_formulario_convocatoria->id, ['visible' => false]);
            }
        }

        // $rubros_convocatoria_por_formulario     = ConvocatoriaPresupuesto::selectRaw('DISTINCT(tipo_formulario_convocatoria_id)')->where('convocatoria_id', $convocatoria->id)->pluck('tipo_formulario_convocatoria_id')->toArray();

        // $rubro_formulario_fuera_convocatoria    = array_diff($request->tipos_formulario_convocatoria, $rubros_convocatoria_por_formulario);

        // if (count($rubro_formulario_fuera_convocatoria) > 0) {
        //     foreach ($rubro_formulario_fuera_convocatoria as $value) {
        //         $rubros_a_agregar = RubroPresupuestal::all();

        //         $insert_data = $rubros_a_agregar->map(function ($rubro) use ($value, $convocatoria) {
        //             return [
        //                 'convocatoria_id'                   => $convocatoria->id,
        //                 'rubro_presupuestal_id'             => $rubro->id,
        //                 'tipo_formulario_convocatoria_id'   => $value,
        //                 'sumar_al_presupuesto'              => true,
        //                 'requiere_estudio_mercado'          => true,
        //                 'habilitado'                        => true,
        //             ];
        //         });

        //         ConvocatoriaPresupuesto::insert($insert_data->toArray());
        //     }
        // }

        // $roles_convocatoria_por_formulario = ConvocatoriaRolSennova::selectRaw('DISTINCT(tipo_formulario_convocatoria_id)')->where('convocatoria_id', $convocatoria->id)->pluck('tipo_formulario_convocatoria_id')->toArray();


        // $rol_formulario_fuera_convocatoria = array_diff($request->tipos_formulario_convocatoria, $roles_convocatoria_por_formulario);


        // if (count($rol_formulario_fuera_convocatoria) > 0) {
        //     foreach ($rol_formulario_fuera_convocatoria as $value) {
        //         $roles_a_agregar = RolSennova::all();

        //         $insert_data = $roles_a_agregar->map(function ($rol) use ($value, $convocatoria) {
        //             return [
        //                 'tipo_formulario_convocatoria_id'   => $value,
        //                 'convocatoria_id'                   => $convocatoria->id,
        //                 'rol_sennova_id'                    => $rol->id,
        //                 'asignacion_mensual'                => null,
        //                 'experiencia'                       => null,
        //                 'nivel_academico'                   => null,
        //                 'perfil'                            => null,
        //                 'mensaje'                           => null,
        //                 'sumar_al_presupuesto'              => true,
        //                 'habilitado'                        => true,
        //             ];
        //         });

        //         ConvocatoriaRolSennova::insert($insert_data->toArray());
        //     }
        // }

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
        // if (!Hash::check($request->password, Auth::user()->password)) {
        //     return back()
        //         ->withErrors(['password' => 'Contraseña incorrecta']);
        // }

        $convocatoria->delete();

        return redirect()->route('convocatorias.index')->with('success', 'El recurso se ha eliminado correctamente.');
    }

    /**
     * Display the tiposFormularioConvocatoria.
     *
     * @return \Illuminate\Http\Response
     */
    public function tiposFormularioConvocatoria(Convocatoria $convocatoria)
    {
        return Inertia::render('Convocatorias/TiposFormularioConvocatoria', [
            'convocatoria'                  => $convocatoria,
            'tipos_formulario_convocatoria' => $convocatoria->tiposFormularioConvocatoria()->with('lineaProgramatica')->orderBy('tipos_formulario_convocatoria.id')->get()
        ]);
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function proyectosPorTipoFormulario(Convocatoria $convocatoria, TipoFormularioConvocatoria $tipo_formulario_convocatoria)
    {
        switch ($tipo_formulario_convocatoria->id) {
            case 1:
                return redirect()->route('convocatorias.proyectos-formulario-1-linea-65.index', [$convocatoria]);
                break;
            case 3:
                return redirect()->route('convocatorias.proyectos-formulario-3-linea-61.index', [$convocatoria]);
                break;
            case 4:
                return redirect()->route('convocatorias.proyectos-formulario-4-linea-70.index', [$convocatoria]);
                break;
            case 5:
                return redirect()->route('convocatorias.proyectos-formulario-5-linea-69.index', [$convocatoria]);
                break;
            case 6:
                return redirect()->route('convocatorias.proyectos-formulario-6-linea-82.index', [$convocatoria]);
                break;
            case 7:
                return redirect()->route('convocatorias.proyectos-formulario-7-linea-23.index', [$convocatoria]);
                break;
            case 8:
                return redirect()->route('convocatorias.proyectos-formulario-8-linea-66.index', [$convocatoria]);
                break;
            case 9:
                return redirect()->route('convocatorias.proyectos-formulario-9-linea-23.index', [$convocatoria]);
                break;
            case 10:
                return redirect()->route('convocatorias.proyectos-formulario-10-linea-69.index', [$convocatoria]);
                break;
            case 11:
                return redirect()->route('convocatorias.proyectos-formulario-11-linea-83.index', [$convocatoria]);
                break;
            case 12:
                return redirect()->route('convocatorias.proyectos-formulario-12-linea-68.index', [$convocatoria]);
                break;
            case 13:
                return redirect()->route('convocatorias.proyectos-formulario-13-linea-65.index', [$convocatoria]);
                break;
            case 15:
                return redirect()->route('convocatorias.proyectos-formulario-15-linea-65.index', [$convocatoria]);
                break;
            case 16:
                return redirect()->route('convocatorias.proyectos-formulario-16-linea-65.index', [$convocatoria]);
                break;
            case 17:
                return redirect()->route('convocatorias.proyectos-formulario-17-linea-69.index', [$convocatoria]);
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
    public static function updateFase(Request $request, Convocatoria $convocatoria)
    {
        // foreach ($convocatoria->evaluaciones()->get() as $evaluacion) {
        //     $evaluacion->update(['estado' => $evaluacion->verificar_estado_evaluacion]);
        // }

        if ($request->fase == 1) { // Formulación
            $convocatoria->proyectos()->update(['finalizado' => false, 'modificable' => true]);
        } else if ($request->fase == 2) { // Primera evaluación
            $convocatoria->proyectos()->update(['modificable' => false, 'finalizado' => true]);
        } else if ($request->fase == 3) { // Subsanación
            foreach ($convocatoria->proyectos as $proyecto) {
                $evaluacion_proyecto = $proyecto->estadoEvaluacionProyecto;

                if ($evaluacion_proyecto && $evaluacion_proyecto['requiere_subsanar'] && $evaluacion_proyecto['evaluaciones_finalizadas'] > 0) {
                    $proyecto->update([
                        'finalizado_en_primera_fase'    => $proyecto->finalizado,
                        'finalizado'                    => false,
                        'modificable'                   => true,
                        'estado'                        => $evaluacion_proyecto,
                        'mostrar_recomendaciones'       => true
                    ]);
                }
            }

            foreach ($convocatoria->evaluaciones as $evaluacion) {
                $evaluacion->update([
                    'finalizado_en_primera_fase'    => $evaluacion->finalizado,
                    'finalizado'                    => true,
                    'modificable'                   => false,
                    'iniciado'                      => false
                ]);
            }
        } else if ($request->fase == 4) { // Segunda evaluación
            foreach ($convocatoria->proyectos as $proyecto) {
                $evaluacion_proyecto = $proyecto->estadoEvaluacionProyecto;

                if ($evaluacion_proyecto && $evaluacion_proyecto['requiere_subsanar']) {
                    $proyecto->update([
                        'finalizado'                => true,
                        'modificable'               => false,
                        'estado'                    => $evaluacion_proyecto,
                        'mostrar_recomendaciones'   => false
                    ]);

                    $proyecto->evaluaciones()->where('habilitado', true)->update(['modificable' => true, 'finalizado' => false, 'iniciado' => false]);
                }
            }
        } else if ($request->fase == 5) { // Finalizar convocatoria
            $convocatoria->proyectos()->update(['modificable' => false]);
            $convocatoria->evaluaciones()->update(['modificable' => false, 'finalizado' => true, 'iniciado' => false]);
        }

        // $convocatoria->evaluaciones()->where('estado', 'LIKE', 'Sin evaluar')->update(['habilitado' => false]);

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

    public function formularioEvaluacion(Convocatoria $convocatoria, $tipo_formulario_convocatoria_id)
    {
        $db_items_evaluacion = [];

        switch ($tipo_formulario_convocatoria_id) {
            case 1:
                $db_items_evaluacion = PreguntaEvaluacionFormulario1Linea65::whereJsonContains('convocatorias_id', $convocatoria->id)->orderBy('id', 'ASC')->get();
                break;
            case 3:
                $db_items_evaluacion = PreguntaEvaluacionFormulario3Linea61::whereJsonContains('convocatorias_id', $convocatoria->id)->orderBy('id', 'ASC')->get();
                break;
            case 4:
                $db_items_evaluacion = PreguntaEvaluacionFormulario4Linea70::whereJsonContains('convocatorias_id', $convocatoria->id)->orderBy('id', 'ASC')->get();
                break;
            case 5:
                $db_items_evaluacion = PreguntaEvaluacionFormulario5Linea69::whereJsonContains('convocatorias_id', $convocatoria->id)->orderBy('id', 'ASC')->get();
                break;
            case 6:
                $db_items_evaluacion = PreguntaEvaluacionFormulario6Linea82::whereJsonContains('convocatorias_id', $convocatoria->id)->orderBy('id', 'ASC')->get();
                break;
            case 7:
                $db_items_evaluacion = PreguntaEvaluacionFormulario7Linea23::whereJsonContains('convocatorias_id', $convocatoria->id)->orderBy('id', 'ASC')->get();
                break;
            case 8:
                $db_items_evaluacion = PreguntaEvaluacionFormulario8Linea66::whereJsonContains('convocatorias_id', $convocatoria->id)->orderBy('id', 'ASC')->get();
                break;
            case 9:
                $db_items_evaluacion = PreguntaEvaluacionFormulario9Linea23::whereJsonContains('convocatorias_id', $convocatoria->id)->orderBy('id', 'ASC')->get();
                break;
            case 10:
                $db_items_evaluacion = PreguntaEvaluacionFormulario10Linea69::whereJsonContains('convocatorias_id', $convocatoria->id)->orderBy('id', 'ASC')->get();
                break;
            case 12:
                $db_items_evaluacion = PreguntaEvaluacionFormulario12Linea68::whereJsonContains('convocatorias_id', $convocatoria->id)->orderBy('id', 'ASC')->get();
                break;
            case 13:
                $db_items_evaluacion = PreguntaEvaluacionFormulario13Linea65::whereJsonContains('convocatorias_id', $convocatoria->id)->orderBy('id', 'ASC')->get();
                break;
            case 15:
                $db_items_evaluacion = PreguntaEvaluacionFormulario15Linea65::whereJsonContains('convocatorias_id', $convocatoria->id)->orderBy('id', 'ASC')->get();
                break;
            case 16:
                $db_items_evaluacion = PreguntaEvaluacionFormulario16Linea65::whereJsonContains('convocatorias_id', $convocatoria->id)->orderBy('id', 'ASC')->get();
                break;
            case 17:
                $db_items_evaluacion = PreguntaEvaluacionFormulario17Linea69::whereJsonContains('convocatorias_id', $convocatoria->id)->orderBy('id', 'ASC')->get();
                break;
            default:
                break;
        }

        return Inertia::render('Convocatorias/FormularioEvaluacion/Index', [
            'convocatoria'                      => $convocatoria,
            'tipo_formulario_convocatoria_id'   => $tipo_formulario_convocatoria_id,
            'items_evaluacion'                  => $db_items_evaluacion ?? [],
            'convocatorias'                     => SelectHelper::convocatorias(),
        ]);
    }

    public function storeItemFormularioEvaluacion(Request $request, Convocatoria $convocatoria, $tipo_formulario_convocatoria_id)
    {
        $request->validate([
            'campo'             => 'required|string',
            'criterio'          => 'nullable|string',
            'puntaje_maximo'    => 'nullable|numeric|max:100',
            'convocatorias_id'  => 'required',
        ]);

        $request->merge([
            'convocatorias_id'  => json_encode($request->convocatorias_id)
        ]);

        switch ($tipo_formulario_convocatoria_id) {
            case 1:
                $db_items_evaluacion = PreguntaEvaluacionFormulario1Linea65::create($request->all());
                self::createEvaluacionProyectoRecords($convocatoria, $tipo_formulario_convocatoria_id, collect([$db_items_evaluacion]), EvaluacionProyectoFormulario1Linea65::class);
                break;
            case 3:
                $db_items_evaluacion = PreguntaEvaluacionFormulario3Linea61::create($request->all());
                self::createEvaluacionProyectoRecords($convocatoria, $tipo_formulario_convocatoria_id, collect([$db_items_evaluacion]), EvaluacionProyectoFormulario3Linea61::class);
                break;
            case 4:
                $db_items_evaluacion = PreguntaEvaluacionFormulario4Linea70::create($request->all());
                self::createEvaluacionProyectoRecords($convocatoria, $tipo_formulario_convocatoria_id, collect([$db_items_evaluacion]), EvaluacionProyectoFormulario4Linea70::class);
                break;
            case 5:
                $db_items_evaluacion = PreguntaEvaluacionFormulario5Linea69::create($request->all());
                self::createEvaluacionProyectoRecords($convocatoria, $tipo_formulario_convocatoria_id, collect([$db_items_evaluacion]), EvaluacionProyectoFormulario5Linea69::class);
                break;
            case 6:
                $db_items_evaluacion = PreguntaEvaluacionFormulario6Linea82::create($request->all());
                self::createEvaluacionProyectoRecords($convocatoria, $tipo_formulario_convocatoria_id, collect([$db_items_evaluacion]), EvaluacionProyectoFormulario6Linea82::class);
                break;
            case 7:
                $db_items_evaluacion = PreguntaEvaluacionFormulario7Linea23::create($request->all());
                self::createEvaluacionProyectoRecords($convocatoria, $tipo_formulario_convocatoria_id, collect([$db_items_evaluacion]), EvaluacionProyectoFormulario7Linea23::class);
                break;
            case 8:
                $db_items_evaluacion = PreguntaEvaluacionFormulario8Linea66::create($request->all());
                self::createEvaluacionProyectoRecords($convocatoria, $tipo_formulario_convocatoria_id, collect([$db_items_evaluacion]), EvaluacionProyectoFormulario8Linea66::class);
                break;
            case 9:
                $db_items_evaluacion = PreguntaEvaluacionFormulario9Linea23::create($request->all());
                self::createEvaluacionProyectoRecords($convocatoria, $tipo_formulario_convocatoria_id, collect([$db_items_evaluacion]), EvaluacionProyectoFormulario9Linea23::class);
                break;
            case 10:
                $db_items_evaluacion = PreguntaEvaluacionFormulario10Linea69::create($request->all());
                self::createEvaluacionProyectoRecords($convocatoria, $tipo_formulario_convocatoria_id, collect([$db_items_evaluacion]), EvaluacionProyectoFormulario10Linea69::class);
                break;
            case 12:
                $db_items_evaluacion = PreguntaEvaluacionFormulario12Linea68::create($request->all());
                self::createEvaluacionProyectoRecords($convocatoria, $tipo_formulario_convocatoria_id, collect([$db_items_evaluacion]), EvaluacionProyectoFormulario12Linea68::class);
                break;
            case 13:
                $db_items_evaluacion = PreguntaEvaluacionFormulario13Linea65::create($request->all());
                self::createEvaluacionProyectoRecords($convocatoria, $tipo_formulario_convocatoria_id, collect([$db_items_evaluacion]), EvaluacionProyectoFormulario13Linea65::class);
                break;
            case 15:
                $db_items_evaluacion = PreguntaEvaluacionFormulario15Linea65::create($request->all());
                self::createEvaluacionProyectoRecords($convocatoria, $tipo_formulario_convocatoria_id, collect([$db_items_evaluacion]), EvaluacionProyectoFormulario15Linea65::class);
                break;
            case 16:
                $db_items_evaluacion = PreguntaEvaluacionFormulario16Linea65::create($request->all());
                self::createEvaluacionProyectoRecords($convocatoria, $tipo_formulario_convocatoria_id, collect([$db_items_evaluacion]), EvaluacionProyectoFormulario16Linea65::class);
                break;
            case 17:
                $db_items_evaluacion = PreguntaEvaluacionFormulario17Linea69::create($request->all());
                self::createEvaluacionProyectoRecords($convocatoria, $tipo_formulario_convocatoria_id, collect([$db_items_evaluacion]), EvaluacionProyectoFormulario17Linea69::class);
                break;
            default:
                break;
        }

        return back()->with('success', 'El recurso se ha creado correctamente.');
    }

    public function updateItemFormularioEvaluacion(Request $request, Convocatoria $convocatoria, $tipo_formulario_convocatoria_id, $item_id)
    {
        $request->validate([
            'campo'             => 'required|string',
            'criterio'          => 'nullable|string',
            'puntaje_maximo'    => 'nullable|numeric|max:100',
            'convocatorias_id'  => 'required',
        ]);

        $request->merge([
            'convocatorias_id'  => json_encode($request->convocatorias_id)
        ]);

        switch ($tipo_formulario_convocatoria_id) {
            case 1:
                PreguntaEvaluacionFormulario1Linea65::find($item_id)->update($request->all());
                break;
            case 3:
                PreguntaEvaluacionFormulario3Linea61::find($item_id)->update($request->all());
                break;
            case 4:
                PreguntaEvaluacionFormulario4Linea70::find($item_id)->update($request->all());
                break;
            case 5:
                PreguntaEvaluacionFormulario5Linea69::find($item_id)->update($request->all());
                break;
            case 6:
                PreguntaEvaluacionFormulario6Linea82::find($item_id)->update($request->all());
                break;
            case 7:
                PreguntaEvaluacionFormulario7Linea23::find($item_id)->update($request->all());
                break;
            case 8:
                PreguntaEvaluacionFormulario8Linea66::find($item_id)->update($request->all());
                break;
            case 9:
                PreguntaEvaluacionFormulario9Linea23::find($item_id)->update($request->all());
                break;
            case 10:
                PreguntaEvaluacionFormulario10Linea69::find($item_id)->update($request->all());
                break;
            case 12:
                PreguntaEvaluacionFormulario12Linea68::find($item_id)->update($request->all());
                break;
            case 13:
                PreguntaEvaluacionFormulario13Linea65::find($item_id)->update($request->all());
                break;
            case 15:
                PreguntaEvaluacionFormulario15Linea65::find($item_id)->update($request->all());
                break;
            case 16:
                PreguntaEvaluacionFormulario16Linea65::find($item_id)->update($request->all());
                break;
            case 17:
                PreguntaEvaluacionFormulario17Linea69::find($item_id)->update($request->all());
                break;
            default:
                break;
        }

        return back()->with('success', 'El recurso se ha modificado correctamente.');
    }

    public function destroyItemFormularioEvaluacion(Request $request, Convocatoria $convocatoria, $tipo_formulario_convocatoria_id, $item_id)
    {
        switch ($tipo_formulario_convocatoria_id) {
            case 1:
                PreguntaEvaluacionFormulario1Linea65::find($item_id)->delete();
                break;
            case 3:
                PreguntaEvaluacionFormulario3Linea61::find($item_id)->delete();
                break;
            case 4:
                PreguntaEvaluacionFormulario4Linea70::find($item_id)->delete();
                break;
            case 5:
                PreguntaEvaluacionFormulario5Linea69::find($item_id)->delete();
                break;
            case 6:
                PreguntaEvaluacionFormulario6Linea82::find($item_id)->delete();
                break;
            case 7:
                PreguntaEvaluacionFormulario7Linea23::find($item_id)->delete();
                break;
            case 8:
                PreguntaEvaluacionFormulario8Linea66::find($item_id)->delete();
                break;
            case 9:
                PreguntaEvaluacionFormulario9Linea23::find($item_id)->delete();
                break;
            case 10:
                PreguntaEvaluacionFormulario10Linea69::find($item_id)->delete();
                break;
            case 12:
                PreguntaEvaluacionFormulario12Linea68::find($item_id)->delete();
                break;
            case 13:
                PreguntaEvaluacionFormulario13Linea65::find($item_id)->delete();
                break;
            case 15:
                PreguntaEvaluacionFormulario15Linea65::find($item_id)->delete();
                break;
            case 16:
                PreguntaEvaluacionFormulario16Linea65::find($item_id)->delete();
                break;
            case 17:
                PreguntaEvaluacionFormulario17Linea69::find($item_id)->delete();
                break;
            default:
                break;
        }

        return back()->with('success', 'El recurso se ha eliminado correctamente.');
    }

    public static function refreshItemsAEvaluar(Convocatoria $convocatoria, $tipo_formulario_convocatoria_id)
    {
        switch ($tipo_formulario_convocatoria_id) {
            case 1:
                $db_items_evaluacion = PreguntaEvaluacionFormulario1Linea65::whereJsonContains('convocatorias_id', $convocatoria->id)->get();
                self::createEvaluacionProyectoRecords($convocatoria, $tipo_formulario_convocatoria_id, $db_items_evaluacion, EvaluacionProyectoFormulario1Linea65::class);
                break;
            case 3:
                $db_items_evaluacion = PreguntaEvaluacionFormulario3Linea61::whereJsonContains('convocatorias_id', $convocatoria->id)->get();
                self::createEvaluacionProyectoRecords($convocatoria, $tipo_formulario_convocatoria_id, $db_items_evaluacion, EvaluacionProyectoFormulario3Linea61::class);
                break;
            case 4:
                $db_items_evaluacion = PreguntaEvaluacionFormulario4Linea70::whereJsonContains('convocatorias_id', $convocatoria->id)->get();
                self::createEvaluacionProyectoRecords($convocatoria, $tipo_formulario_convocatoria_id, $db_items_evaluacion, EvaluacionProyectoFormulario4Linea70::class);
                break;
            case 5:
                $db_items_evaluacion = PreguntaEvaluacionFormulario5Linea69::whereJsonContains('convocatorias_id', $convocatoria->id)->get();
                self::createEvaluacionProyectoRecords($convocatoria, $tipo_formulario_convocatoria_id, $db_items_evaluacion, EvaluacionProyectoFormulario5Linea69::class);
                break;
            case 6:
                $db_items_evaluacion = PreguntaEvaluacionFormulario6Linea82::whereJsonContains('convocatorias_id', $convocatoria->id)->get();
                self::createEvaluacionProyectoRecords($convocatoria, $tipo_formulario_convocatoria_id, $db_items_evaluacion, EvaluacionProyectoFormulario6Linea82::class);
                break;
            case 7:
                $db_items_evaluacion = PreguntaEvaluacionFormulario7Linea23::whereJsonContains('convocatorias_id', $convocatoria->id)->get();
                self::createEvaluacionProyectoRecords($convocatoria, $tipo_formulario_convocatoria_id, $db_items_evaluacion, EvaluacionProyectoFormulario7Linea23::class);
                break;
            case 8:
                $db_items_evaluacion = PreguntaEvaluacionFormulario8Linea66::whereJsonContains('convocatorias_id', $convocatoria->id)->get();
                self::createEvaluacionProyectoRecords($convocatoria, $tipo_formulario_convocatoria_id, $db_items_evaluacion, EvaluacionProyectoFormulario8Linea66::class);
                break;
            case 9:
                $db_items_evaluacion = PreguntaEvaluacionFormulario9Linea23::whereJsonContains('convocatorias_id', $convocatoria->id)->get();
                self::createEvaluacionProyectoRecords($convocatoria, $tipo_formulario_convocatoria_id, $db_items_evaluacion, EvaluacionProyectoFormulario9Linea23::class);
                break;
            case 10:
                $db_items_evaluacion = PreguntaEvaluacionFormulario10Linea69::whereJsonContains('convocatorias_id', $convocatoria->id)->get();
                self::createEvaluacionProyectoRecords($convocatoria, $tipo_formulario_convocatoria_id, $db_items_evaluacion, EvaluacionProyectoFormulario10Linea69::class);
                break;
            case 12:
                $db_items_evaluacion = PreguntaEvaluacionFormulario12Linea68::whereJsonContains('convocatorias_id', $convocatoria->id)->get();
                self::createEvaluacionProyectoRecords($convocatoria, $tipo_formulario_convocatoria_id, $db_items_evaluacion, EvaluacionProyectoFormulario12Linea68::class);
                break;
            case 13:
                $db_items_evaluacion = PreguntaEvaluacionFormulario13Linea65::whereJsonContains('convocatorias_id', $convocatoria->id)->get();
                self::createEvaluacionProyectoRecords($convocatoria, $tipo_formulario_convocatoria_id, $db_items_evaluacion, EvaluacionProyectoFormulario13Linea65::class);
                break;
            case 15:
                $db_items_evaluacion = PreguntaEvaluacionFormulario15Linea65::whereJsonContains('convocatorias_id', $convocatoria->id)->get();
                self::createEvaluacionProyectoRecords($convocatoria, $tipo_formulario_convocatoria_id, $db_items_evaluacion, EvaluacionProyectoFormulario15Linea65::class);
                break;
            case 16:
                $db_items_evaluacion = PreguntaEvaluacionFormulario16Linea65::whereJsonContains('convocatorias_id', $convocatoria->id)->get();
                self::createEvaluacionProyectoRecords($convocatoria, $tipo_formulario_convocatoria_id, $db_items_evaluacion, EvaluacionProyectoFormulario16Linea65::class);
                break;
            case 17:
                $db_items_evaluacion = PreguntaEvaluacionFormulario17Linea69::whereJsonContains('convocatorias_id', $convocatoria->id)->get();
                self::createEvaluacionProyectoRecords($convocatoria, $tipo_formulario_convocatoria_id, $db_items_evaluacion, EvaluacionProyectoFormulario17Linea69::class);
                break;
            default:
                break;
        }

        return back()->with('success', 'Se han actualizado los ítems de cada una de las evaluaciones habilitadas.');
    }

    public static function createEvaluacionProyectoRecords($convocatoria, $tipo_formulario_convocatoria_id, $db_items_evaluacion, $model_class_name)
    {
        if ($db_items_evaluacion->isNotEmpty()) {
            // Get the evaluation IDs based on the convocatoria and tipo_formulario_convocatoria_id
            $evaluaciones_ids = Evaluacion::select('evaluaciones.id')
                ->join('proyectos', 'evaluaciones.proyecto_id', 'proyectos.id')
                ->where('evaluaciones.convocatoria_id', $convocatoria->id)
                ->where('proyectos.tipo_formulario_convocatoria_id', $tipo_formulario_convocatoria_id)
                ->get()
                ->pluck('id');

            // Create new records
            $items_to_create = [];
            foreach ($db_items_evaluacion as $item) {
                foreach ($evaluaciones_ids as $evaluacion_id) {
                    if (!$model_class_name::where('pregunta_id', $item->id)->where('evaluacion_id', $evaluacion_id)->exists()) {
                        $items_to_create[] = [
                            'evaluacion_id' => $evaluacion_id,
                            'pregunta_id' => $item->id,
                        ];
                    }
                }
            }

            if (!empty($items_to_create)) {
                $model_class_name::insert($items_to_create);
            }
        }
    }
}
