<?php

namespace App\Http\Controllers;

use App\Helpers\SelectHelper;
use App\Http\Requests\ConvocatoriaRequest;
use App\Models\Convocatoria;
use App\Models\ConvocatoriaPresupuesto;
use App\Models\ConvocatoriaRolSennova;
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

        $convocatoria->tiposFormularioConvocatoria()->sync($request->tipos_formulario_convocatoria);

        DB::select('SELECT public."crear_convocatoria_presupuesto"(' . $request->convocatoria_id . ',' . $convocatoria->id . ')');
        DB::select('SELECT public."crear_convocatoria_rol_sennova"(' . $request->convocatoria_id . ',' . $convocatoria->id . ')');

        $rubros_convocatoria_por_formulario     = ConvocatoriaPresupuesto::selectRaw('DISTINCT(tipo_formulario_convocatoria_id)')->where('convocatoria_id', $request->convocatoria_id)->pluck('tipo_formulario_convocatoria_id')->toArray();

        $rubro_formulario_fuera_convocatoria    = array_diff($request->tipos_formulario_convocatoria, $rubros_convocatoria_por_formulario);

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

        $rol_formulario_fuera_convocatoria = array_diff($request->tipos_formulario_convocatoria, $roles_convocatoria_por_formulario);

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
            $convocatoria->proyectos()->update(['finalizado' => false, 'modificable' => true, 'habilitado_para_evaluar' => false]);
            // $convocatoria->evaluaciones()->update(['modificable' => false, 'finalizado' => true, 'iniciado' => false]);
        } else if ($request->fase == 2) { // Primera evaluación
            $convocatoria->proyectos()->update(['modificable' => false, 'habilitado_para_evaluar' => true, 'finalizado' => true]);
        }

        // else if ($request->fase == 3) { // Subsanación

        //     foreach ($convocatoria->proyectos()->get() as $proyecto) {
        //         switch ($proyecto) {
        //             case $proyecto->estado_evaluacion_proyecto_formulario_8_linea_66 != null:
        //                 if (json_decode($proyecto->estado_evaluacion_proyecto_formulario_8_linea_66)->requiereSubsanar) {
        //                     $proyecto->update(['finalizado' => false, 'modificable' => true, 'habilitado_para_evaluar' => false, 'estado' => $proyecto->estado_evaluacion_proyecto_formulario_8_linea_66, 'mostrar_recomendaciones' => true]);
        //                 } else {
        //                     $proyecto->update(['finalizado' => true, 'modificable' => false, 'habilitado_para_evaluar' => false, 'estado' => $proyecto->estado_evaluacion_proyecto_formulario_8_linea_66]);
        //                 }
        //                 break;

        //             case $proyecto->estado_evaluacion_proyecto_formulario_1_linea_65 != null:
        //                 if (json_decode($proyecto->estado_evaluacion_proyecto_formulario_1_linea_65)->requiereSubsanar) {
        //                     $proyecto->update(['finalizado' => false, 'modificable' => true, 'habilitado_para_evaluar' => false, 'estado' => $proyecto->estado_evaluacion_proyecto_formulario_1_linea_65, 'mostrar_recomendaciones' => true]);
        //                 } else {
        //                     $proyecto->update(['finalizado' => true, 'modificable' => false, 'habilitado_para_evaluar' => false, 'estado' => $proyecto->estado_evaluacion_proyecto_formulario_1_linea_65]);
        //                 }
        //                 break;

        //             case $proyecto->estado_evaluacion_proyecto_formulario_5_linea_70 != null:
        //                 if (json_decode($proyecto->estado_evaluacion_proyecto_formulario_5_linea_70)->requiereSubsanar) {
        //                     $proyecto->update(['finalizado' => false, 'modificable' => true, 'habilitado_para_evaluar' => false, 'estado' => $proyecto->estado_evaluacion_proyecto_formulario_5_linea_70, 'mostrar_recomendaciones' => true]);
        //                 } else {
        //                     $proyecto->update(['finalizado' => true, 'modificable' => false, 'habilitado_para_evaluar' => false, 'estado' => $proyecto->estado_evaluacion_proyecto_formulario_5_linea_70]);
        //                 }
        //                 break;

        //             case $proyecto->estado_evaluacion_proyecto_formulario_4_linea_69 != null:
        //                 if (json_decode($proyecto->estado_evaluacion_proyecto_formulario_4_linea_69)->requiereSubsanar) {
        //                     $proyecto->update(['finalizado' => false, 'modificable' => true, 'habilitado_para_evaluar' => false, 'estado' => $proyecto->estado_evaluacion_proyecto_formulario_4_linea_69, 'mostrar_recomendaciones' => true]);
        //                 } else {
        //                     $proyecto->update(['finalizado' => true, 'modificable' => false, 'habilitado_para_evaluar' => false, 'estado' => $proyecto->estado_evaluacion_proyecto_formulario_4_linea_69]);
        //                 }
        //                 break;

        //             case $proyecto->estado_evaluacion_proyecto_formulario_12_linea_68 != null:
        //                 if (json_decode($proyecto->estado_evaluacion_proyecto_formulario_12_linea_68)->requiereSubsanar) {
        //                     $proyecto->update(['finalizado' => false, 'modificable' => true, 'habilitado_para_evaluar' => false, 'estado' => $proyecto->estado_evaluacion_proyecto_formulario_12_linea_68, 'mostrar_recomendaciones' => true]);
        //                 } else {
        //                     $proyecto->update(['finalizado' => true, 'modificable' => false, 'habilitado_para_evaluar' => false, 'estado' => $proyecto->estado_evaluacion_proyecto_formulario_12_linea_68]);
        //                 }
        //                 break;

        //             default:
        //                 break;
        //         }
        //     }

        //     $convocatoria->evaluaciones()->where('clausula_confidencialidad', true)->update(['modificable' => false, 'finalizado' => true, 'iniciado' => false]);
        // } else if ($request->fase == 4) { // Segunda evaluación

        //     foreach ($convocatoria->proyectos()->get() as $proyecto) {
        //         switch ($proyecto) {
        //             case $proyecto->estado_evaluacion_proyecto_formulario_8_linea_66 != null:
        //                 if (json_decode($proyecto->estado_evaluacion_proyecto_formulario_8_linea_66)->requiereSubsanar) {
        //                     $proyecto->update(['finalizado' => true, 'modificable' => false, 'habilitado_para_evaluar' => true, 'estado' => $proyecto->estado_evaluacion_proyecto_formulario_8_linea_66, 'mostrar_recomendaciones' => false, 'en_evaluacion' => true]);
        //                 }
        //                 break;

        //             case $proyecto->estado_evaluacion_proyecto_formulario_1_linea_65 != null:
        //                 if (json_decode($proyecto->estado_evaluacion_proyecto_formulario_1_linea_65)->requiereSubsanar) {
        //                     $proyecto->update(['finalizado' => true, 'modificable' => false, 'habilitado_para_evaluar' => true, 'estado' => $proyecto->estado_evaluacion_proyecto_formulario_1_linea_65, 'mostrar_recomendaciones' => false, 'en_evaluacion' => true]);
        //                 }
        //                 break;

        //             case $proyecto->estado_evaluacion_proyecto_formulario_5_linea_70 != null:
        //                 if (json_decode($proyecto->estado_evaluacion_proyecto_formulario_5_linea_70)->requiereSubsanar) {
        //                     $proyecto->update(['finalizado' => true, 'modificable' => false, 'habilitado_para_evaluar' => true, 'estado' => $proyecto->estado_evaluacion_proyecto_formulario_5_linea_70, 'mostrar_recomendaciones' => false, 'en_evaluacion' => true]);
        //                 }
        //                 break;

        //             case $proyecto->estado_evaluacion_proyecto_formulario_4_linea_69 != null:
        //                 if (json_decode($proyecto->estado_evaluacion_proyecto_formulario_4_linea_69)->requiereSubsanar) {
        //                     $proyecto->update(['finalizado' => true, 'modificable' => false, 'habilitado_para_evaluar' => true, 'estado' => $proyecto->estado_evaluacion_proyecto_formulario_4_linea_69, 'mostrar_recomendaciones' => false, 'en_evaluacion' => true]);
        //                 }
        //                 break;

        //             case $proyecto->estado_evaluacion_proyecto_formulario_12_linea_68 != null:
        //                 if (json_decode($proyecto->estado_evaluacion_proyecto_formulario_12_linea_68)->requiereSubsanar) {
        //                     $proyecto->update(['finalizado' => true, 'modificable' => false, 'habilitado_para_evaluar' => true, 'estado' => $proyecto->estado_evaluacion_proyecto_formulario_12_linea_68, 'mostrar_recomendaciones' => false, 'en_evaluacion' => true]);
        //                 }
        //                 break;

        //             default:
        //                 break;
        //         }
        //     }

        //     $convocatoria->evaluaciones()->where('clausula_confidencialidad', true)->update(['modificable' => true, 'finalizado' => false, 'iniciado' => false]);
        // } else if ($request->fase == 5) { // Finalizar convocatoria
        //     $convocatoria->proyectos()->update(['modificable' => false]);
        //     $convocatoria->evaluaciones()->where('clausula_confidencialidad', true)->update(['modificable' => false, 'finalizado' => true, 'iniciado' => false]);
        // }

        // $convocatoria->evaluaciones()->where('estado', 'LIKE', 'Sin evaluar')->update(['habilitado' => false]);

        // return back()->with('success', 'El recurso se ha actualizado correctamente.');
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
