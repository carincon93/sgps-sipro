<?php

namespace App\Http\Controllers;

use App\Helpers\SelectHelper;
use App\Http\Requests\ProyectoRolSennovaRequest;
use App\Models\Convocatoria;
use App\Models\Proyecto;
use App\Models\ProyectoRolSennova;
use Illuminate\Http\Request;
use App\Http\Traits\ProyectoRolSennovaValidationTrait;
use App\Http\Traits\ProyectoRolStValidationTrait;
use App\Http\Traits\ProyectoRolTaValidationTrait;
use App\Http\Traits\ProyectoRolTpValidationTrait;
use App\Models\Actividad;
use App\Models\Evaluacion\Evaluacion;
use App\Models\Evaluacion\ProyectoRolEvaluacion;
use App\Models\LineaTecnoacademia;
use App\Models\LineaTecnoparque;
use Inertia\Inertia;

class ProyectoRolSennovaController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Convocatoria $convocatoria, Proyecto $proyecto)
    {
        $this->authorize('visualizar-proyecto-autor', $proyecto);

        $proyecto->codigo_linea_programatica = $proyecto->lineaProgramatica->codigo;

        if ($proyecto->ta()->exists()) {
            $proyecto->cantidad_instructores_planta     = $proyecto->ta->cantidad_instructores_planta;
            $proyecto->cantidad_dinamizadores_planta    = $proyecto->ta->cantidad_dinamizadores_planta;
            $proyecto->cantidad_psicopedagogos_planta   = $proyecto->ta->cantidad_psicopedagogos_planta;
        }

        /**
         * Si el proyecto es de la línea programática 23 se prohibe el acceso. No requiere de roles SENNOVA
         */
        if ($proyecto->codigo_linea_programatica == 23 || $proyecto->culturaInnovacion()->exists() && $proyecto->culturaInnovacion->tipo_proyecto == 2) {
            return redirect()->route('convocatorias.proyectos.arbol-objetivos', [$convocatoria, $proyecto])->with('error', 'Esta línea programática no requiere de roles SENNOVA');
        }

        return Inertia::render('Convocatorias/Proyectos/RolesSennova/Index', [
            'convocatoria'           => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria', 'year'),
            'proyecto'               => $proyecto->only('id', 'codigo_linea_programatica', 'precio_proyecto', 'modificable', 'total_roles_sennova', 'cantidad_instructores_planta', 'cantidad_dinamizadores_planta', 'cantidad_psicopedagogos_planta', 'en_subsanacion', 'mostrar_recomendaciones', 'PdfVersiones', 'all_files', 'allowed'),
            'filters'                => request()->all('search'),
            'proyectoRolesSennova'   => ProyectoRolSennova::where('proyecto_id', $proyecto->id)->filterProyectoRolSennova(request()->only('search'))->with('convocatoriaRolSennova.rolSennova')->paginate(),
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

        $proyecto->codigo_linea_programatica = $proyecto->lineaProgramatica->codigo;

        if ($proyecto->codigo_linea_programatica == 68) {
            $proyecto->max_meses_ejecucion = $proyecto->servicioTecnologico->max_meses_ejecucion;
        }

        $lineasTecnologicas = [];
        if ($proyecto->codigo_linea_programatica == 70) {
            $lineasTecnologicas = LineaTecnoacademia::select('id', 'nombre')->get();
        } else if ($proyecto->codigo_linea_programatica == 69) {
            $lineasTecnologicas = LineaTecnoparque::select('id', 'nombre')->get();
        }

        $objetivosEspecificos = $proyecto->causasDirectas()->with('objetivoEspecifico')->get()->pluck('objetivoEspecifico')->flatten()->filter();

        return Inertia::render('Convocatorias/Proyectos/RolesSennova/Create', [
            'convocatoria'              => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria'),
            'proyecto'                  => $proyecto->only('id', 'diff_meses', 'modificable', 'max_meses_ejecucion', 'codigo_linea_programatica', 'mostrar_recomendaciones', 'allowed', 'fecha_inicio', 'fecha_finalizacion'),
            'lineaProgramatica'         => $proyecto->lineaProgramatica->only('id'),
            'convocatoriaRolesSennova'  => SelectHelper::convocatoriaRolesSennova($convocatoria->id, $proyecto->id, $proyecto->lineaProgramatica->id),
            'actividades'               => Actividad::whereIn(
                'objetivo_especifico_id',
                $objetivosEspecificos->map(function ($objetivoEspecifico) {
                    return $objetivoEspecifico->id;
                })
            )->with('objetivoEspecifico')->get(),
            'lineasTecnologicas'        => $lineasTecnologicas ?? null
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(ProyectoRolSennovaRequest $request, Convocatoria $convocatoria, Proyecto $proyecto)
    {
        $this->authorize('modificar-proyecto-autor', $proyecto);

        /**
         * Línea programática 65
         */
        // if ($proyecto->lineaProgramatica->codigo == 65) {
        //     if (ProyectoRolSennovaValidationTrait::culturaInnovacionRoles($proyecto, $request->convocatoria_rol_sennova_id, null, $request->numero_roles)) {
        //         return back()->with('error', 'No se ha podido agregar este rol SENNOVA. Razones: Ha superado el límite permitido o el rol no está disponible para este centro de formación. Revise los lineamientos de la convocatoria.');
        //     }
        // }

        /**
         * Línea programática 68
         */
        // if ($proyecto->lineaProgramatica->codigo == 68) {
        //     if (ProyectoRolStValidationTrait::rolStValidation($proyecto, $proyecto->servicioTecnologico->tipoProyectoSt->id, $request->convocatoria_rol_sennova_id, null, $request->numero_roles)) {
        //         return back()->with('error', 'No se ha podido agregar este rol SENNOVA. Razones: Ha superado el límite permitido o el rol no está disponible para este tipo de proyecto. Revise los lineamientos de la convocatoria.');
        //     }
        // }

        /**
         * Línea programática 69
         */
        // if ($proyecto->lineaProgramatica->codigo == 69) {
        //     if (ProyectoRolTpValidationTrait::rolTpValidation($proyecto, $proyecto->tp->nodoTecnoparque->id, $request->convocatoria_rol_sennova_id, null, $request->numero_roles)) {
        //         return back()->with('error', 'No se ha podido agregar este rol SENNOVA. Razones: Ha superado el límite permitido o el rol no está disponible para este nodo. Revise los lineamientos de la convocatoria.');
        //     }
        // }

        /**
         * Línea programática 70
         */
        // if ($proyecto->lineaProgramatica->codigo == 70) {
        //     if (ProyectoRolTaValidationTrait::rolTaValidation($proyecto, $proyecto->tecnoacademiaLineasTecnoacademia()->first()->tecnoacademia->id, $request->convocatoria_rol_sennova_id, null, $request->numero_roles)) {
        //         return back()->with('error', 'No se ha podido agregar este rol SENNOVA. Razones: Ha superado el límite permitido o el rol no está disponible para esta tecnoacademia. Revise los lineamientos de la convocatoria.');
        //     }
        // }

        /**
         * Todas las líneas
         */
        if (ProyectoRolSennovaValidationTrait::monitoriaValidation($request->convocatoria_rol_sennova_id, $proyecto, null, $request->numero_meses, $request->numero_roles)) {
            return back()->with('error', 'Ha superado el máximo de de 4 monitorías');
        }

        if (ProyectoRolSennovaValidationTrait::contratoAprendizajeValidation($request->convocatoria_rol_sennova_id, $proyecto, null, $request->numero_meses, $request->numero_roles)) {
            return back()->with('error', 'Máximo 1 contrato de aprendizaje por 6 meses');
        }

        $proyectoRolSennova = new ProyectoRolSennova();

        $proyectoRolSennova->descripcion        = $request->descripcion;
        $proyectoRolSennova->educacion          = $request->educacion;
        $proyectoRolSennova->formacion          = $request->formacion;
        $proyectoRolSennova->experiencia        = $request->experiencia;
        $proyectoRolSennova->numero_meses       = $request->numero_meses;
        $proyectoRolSennova->numero_roles       = $request->numero_roles;

        $proyectoRolSennova->proyecto()->associate($proyecto->id);
        $proyectoRolSennova->convocatoriaRolSennova()->associate($request->convocatoria_rol_sennova_id);

        $proyectoRolSennova->save();

        $proyectoRolSennova->actividades()->sync($request->actividad_id);

        if ($proyecto->lineaProgramatica->codigo == 70) {
            $request->validate(
                [
                    'linea_tecnologica_id*' => 'nullable|min:0|max:2147483647|exists:lineas_tecnoacademia,id'
                ]
            );
            $proyectoRolSennova->lineasTecnoacademia()->sync($request->linea_tecnologica_id);
        } else if ($proyecto->lineaProgramatica->codigo == 69) {
            $request->validate(
                [
                    'linea_tecnologica_id*' => 'nullable|min:0|max:2147483647|exists:lineas_tecnoparque,id'
                ]
            );
            $proyectoRolSennova->lineasTecnoparque()->sync($request->linea_tecnologica_id);
        }

        return redirect()->route('convocatorias.proyectos.proyecto-rol-sennova.index', [$convocatoria, $proyecto])->with('success', 'El recurso se ha creado correctamente.');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\ProyectoRolSennova  $proyectoRolSennova
     * @return \Illuminate\Http\Response
     */
    public function show(Convocatoria $convocatoria, Proyecto $proyecto, ProyectoRolSennova $proyectoRolSennova)
    {
        $this->authorize('visualizar-proyecto-autor', $proyecto);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\ProyectoRolSennova  $proyectoRolSennova
     * @return \Illuminate\Http\Response
     */
    public function edit(Convocatoria $convocatoria, Proyecto $proyecto, ProyectoRolSennova $proyectoRolSennova)
    {
        $this->authorize('visualizar-proyecto-autor', $proyecto);

        $proyectoRolSennova->load('proyectoRolesEvaluaciones.evaluacion');

        $proyecto->codigo_linea_programatica = $proyecto->lineaProgramatica->codigo;

        $objetivosEspecificos = $proyecto->causasDirectas()->with('objetivoEspecifico')->get()->pluck('objetivoEspecifico')->flatten()->filter();

        if ($proyecto->codigo_linea_programatica == 68) {
            $proyecto->max_meses_ejecucion = $proyecto->servicioTecnologico->max_meses_ejecucion;
        }

        $lineasTecnologicas = [];
        if ($proyecto->codigo_linea_programatica == 70) {
            $lineasTecnologicas = LineaTecnoacademia::select('id', 'nombre')->get();
            $lineasTecnologicasRelacionadas = $proyectoRolSennova->lineasTecnoacademia()->pluck('lineas_tecnoacademia.id');
        } else if ($proyecto->codigo_linea_programatica == 69) {
            $lineasTecnologicas = LineaTecnoparque::select('id', 'nombre')->get();
            $lineasTecnologicasRelacionadas = $proyectoRolSennova->lineasTecnoparque()->pluck('lineas_tecnoparque.id');
        }

        return Inertia::render('Convocatorias/Proyectos/RolesSennova/Edit', [
            'convocatoria'                              => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria', 'mostrar_recomendaciones'),
            'proyecto'                                  => $proyecto->only('id', 'diff_meses', 'modificable', 'max_meses_ejecucion', 'codigo_linea_programatica', 'en_subsanacion', 'mostrar_recomendaciones', 'allowed', 'fecha_inicio', 'fecha_finalizacion'),
            'proyectoRolSennova'                        => $proyectoRolSennova,
            'rolSennova'                                => $proyectoRolSennova->convocatoriaRolSennova->rolSennova->only('nombre'),
            'convocatoriaRolesSennova'                  => SelectHelper::convocatoriaRolesSennova($convocatoria->id, $proyecto->id, $proyecto->lineaProgramatica->id),
            'actividades'                               => Actividad::whereIn(
                'objetivo_especifico_id',
                $objetivosEspecificos->map(function ($objetivoEspecifico) {
                    return $objetivoEspecifico->id;
                })
            )->with('objetivoEspecifico')->get(),
            'proyectoActividadesRelacionadas'           => $proyectoRolSennova->actividades()->pluck('actividades.id'),
            'proyectoLineasTecnologicasRelacionadas'    => $lineasTecnologicasRelacionadas ?? null,
            'lineasTecnologicas'                        => $lineasTecnologicas ?? null
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\ProyectoRolSennova  $proyectoRolSennova
     * @return \Illuminate\Http\Response
     */
    public function update(ProyectoRolSennovaRequest $request, Convocatoria $convocatoria, Proyecto $proyecto, ProyectoRolSennova $proyectoRolSennova)
    {
        $this->authorize('modificar-proyecto-autor', $proyecto);

        /**
         * Línea programática 65
         */
        // if ($proyecto->lineaProgramatica->codigo == 65) {
        //     if (ProyectoRolSennovaValidationTrait::culturaInnovacionRoles($proyecto, $request->convocatoria_rol_sennova_id, $proyectoRolSennova->id, $request->numero_roles)) {
        //         return back()->with('error', 'No se ha podido agregar este rol SENNOVA. Razones: Ha superado el límite permitido o el rol no está disponible para este centro de formación. Revise los lineamientos de la convocatoria.');
        //     }
        // }

        /**
         * Línea programática 68
         */
        // if ($proyecto->lineaProgramatica->codigo == 68) {
        //     if (ProyectoRolStValidationTrait::rolStValidation($proyecto, $proyecto->servicioTecnologico->tipoProyectoSt->id, $request->convocatoria_rol_sennova_id, $proyectoRolSennova->id, $request->numero_roles)) {
        //         return back()->with('error', 'No se ha podido agregar este rol SENNOVA. Razones: Ha superado el límite permitido o el rol no está disponible para este tipo de proyecto. Revise los lineamientos de la convocatoria.');
        //     }
        // }

        /**
         * Línea programática 69
         */
        // if ($proyecto->lineaProgramatica->codigo == 69) {
        //     if (ProyectoRolTpValidationTrait::rolTpValidation($proyecto, $proyecto->tp->nodoTecnoparque->id, $request->convocatoria_rol_sennova_id, $proyectoRolSennova->id, $request->numero_roles)) {
        //         return back()->with('error', 'No se ha podido agregar este rol SENNOVA. Razones: Ha superado el límite permitido o el rol no está disponible para este nodo. Revise los lineamientos de la convocatoria.');
        //     }
        // }

        /**
         * Línea programática 70
         */
        // if ($proyecto->lineaProgramatica->codigo == 70) {
        //     if (ProyectoRolTaValidationTrait::rolTaValidation($proyecto, $proyecto->tecnoacademiaLineasTecnoacademia()->first()->tecnoacademia->id, $request->convocatoria_rol_sennova_id, $proyectoRolSennova->id, $request->numero_roles)) {
        //         return back()->with('error', 'No se ha podido agregar este rol SENNOVA. Razones: Ha superado el límite permitido o el rol no está disponible para esta tecnoacademia. Revise los lineamientos de la convocatoria.');
        //     }
        // }

        /**
         * Todas las líneas
         */
        if (ProyectoRolSennovaValidationTrait::monitoriaValidation($request->convocatoria_rol_sennova_id, $proyecto, $proyectoRolSennova, $request->numero_meses, $request->numero_roles)) {
            return back()->with('error', 'Ha superado el máximo de 4 monitorias');
        }

        if (ProyectoRolSennovaValidationTrait::contratoAprendizajeValidation($request->convocatoria_rol_sennova_id, $proyecto, $proyectoRolSennova, $request->numero_meses, $request->numero_roles)) {
            return back()->with('error', 'Máximo 1 contrato de aprendizaje por 6 meses');
        }

        $proyectoRolSennova->descripcion        = $request->descripcion;
        $proyectoRolSennova->educacion          = $request->educacion;
        $proyectoRolSennova->formacion          = $request->formacion;
        $proyectoRolSennova->experiencia        = $request->experiencia;
        $proyectoRolSennova->numero_meses       = $request->numero_meses;
        $proyectoRolSennova->numero_roles       = $request->numero_roles;

        $proyectoRolSennova->proyecto()->associate($proyecto->id);
        $proyectoRolSennova->convocatoriaRolSennova()->associate($request->convocatoria_rol_sennova_id);

        $proyectoRolSennova->save();

        $proyectoRolSennova->actividades()->sync($request->actividad_id);

        if ($proyecto->lineaProgramatica->codigo == 70) {
            $request->validate(
                [
                    'linea_tecnologica_id*' => 'nullable|min:0|max:2147483647|exists:lineas_tecnoacademia,id'
                ]
            );
            $proyectoRolSennova->lineasTecnoacademia()->sync($request->linea_tecnologica_id);
        } else if ($proyecto->lineaProgramatica->codigo == 69) {
            $request->validate(
                [
                    'linea_tecnologica_id*' => 'nullable|min:0|max:2147483647|exists:lineas_tecnoparque,id'
                ]
            );
            $proyectoRolSennova->lineasTecnoparque()->sync($request->linea_tecnologica_id);
        }

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\ProyectoRolSennova  $proyectoRolSennova
     * @return \Illuminate\Http\Response
     */
    public function destroy(Convocatoria $convocatoria, Proyecto $proyecto, ProyectoRolSennova $proyectoRolSennova)
    {
        $this->authorize('modificar-proyecto-autor', $proyecto);

        $proyectoRolSennova->delete();

        return redirect()->route('convocatorias.proyectos.proyecto-rol-sennova.index', [$convocatoria, $proyecto])->with('success', 'El recurso se ha eliminado correctamente.');
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function proyectoRolEvaluacion(Convocatoria $convocatoria, Evaluacion $evaluacion)
    {
        $this->authorize('visualizar-evaluacion-autor', $evaluacion);

        $evaluacion->proyecto->codigo_linea_programatica = $evaluacion->proyecto->lineaProgramatica->codigo;

        if ($evaluacion->proyecto->codigo_linea_programatica == 70) {
            $evaluacion->proyecto->cantidad_instructores_planta = $evaluacion->proyecto->ta->cantidad_instructores_planta;
            $evaluacion->proyecto->cantidad_dinamizadores_planta = $evaluacion->proyecto->ta->cantidad_dinamizadores_planta;
            $evaluacion->proyecto->cantidad_psicopedagogos_planta = $evaluacion->proyecto->ta->cantidad_psicopedagogos_planta;
        }

        /**
         * Si el proyecto es de la línea programática 23 se prohibe el acceso. No requiere de roles SENNOVA
         */
        if ($evaluacion->proyecto->codigo_linea_programatica == 23) {
            return redirect()->route('convocatorias.proyectos.arbol-objetivos', [$convocatoria, $evaluacion->proyecto])->with('error', 'Esta línea programática no requiere de roles SENNOVA');
        }

        return Inertia::render('Convocatorias/Evaluaciones/RolesSennova/Index', [
            'convocatoria'           => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria'),
            'evaluacion'             => $evaluacion->only('id'),
            'proyecto'               => $evaluacion->proyecto->only('id', 'codigo_linea_programatica', 'precio_proyecto', 'finalizado', 'total_roles_sennova', 'cantidad_instructores_planta', 'cantidad_dinamizadores_planta', 'cantidad_psicopedagogos_planta'),
            'filters'                => request()->all('search'),
            'proyectoRolesSennova'   => ProyectoRolSennova::where('proyecto_id', $evaluacion->proyecto->id)->filterProyectoRolSennova(request()->only('search'))->with('convocatoriaRolSennova.rolSennova', 'proyectoRolesEvaluaciones')->paginate(),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\ProyectoRolSennova  $proyectoRolSennova
     * @return \Illuminate\Http\Response
     */
    public function evaluacionForm(Convocatoria $convocatoria, Evaluacion $evaluacion, ProyectoRolSennova $proyectoRolSennova)
    {
        $this->authorize('visualizar-evaluacion-autor', $evaluacion);

        $evaluacion->proyecto->codigo_linea_programatica = $evaluacion->proyecto->lineaProgramatica->codigo;

        if ($evaluacion->proyecto->codigo_linea_programatica == 68) {
            $evaluacion->proyecto->max_meses_ejecucion = $evaluacion->proyecto->servicioTecnologico->max_meses_ejecucion;
        }

        $proyecto = $evaluacion->proyecto;

        $proyectoRolSennova->load('convocatoriaRolSennova.rolSennova');
        $proyectoRolSennova->load('actividades');

        $objetivosEspecificos = $proyecto->causasDirectas()->with('objetivoEspecifico')->get()->pluck('objetivoEspecifico')->flatten()->filter();

        if ($proyecto->codigo_linea_programatica == 68) {
            $proyecto->max_meses_ejecucion = $proyecto->servicioTecnologico->max_meses_ejecucion;
        }

        $lineasTecnologicas = [];
        if ($proyecto->codigo_linea_programatica == 70) {
            $lineasTecnologicas = LineaTecnoacademia::select('id', 'nombre')->get();
            $lineasTecnologicasRelacionadas = $proyectoRolSennova->lineasTecnoacademia()->pluck('lineas_tecnoacademia.id');
        } else if ($proyecto->codigo_linea_programatica == 69) {
            $lineasTecnologicas = LineaTecnoparque::select('id', 'nombre')->get();
            $lineasTecnologicasRelacionadas = $proyectoRolSennova->lineasTecnoparque()->pluck('lineas_tecnoparque.id');
        }

        return Inertia::render('Convocatorias/Evaluaciones/RolesSennova/Edit', [
            'convocatoria'                              => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria', 'campos_convocatoria'),
            'evaluacion'                                => $evaluacion->only('id', 'iniciado', 'finalizado', 'habilitado', 'modificable'),
            'proyecto'                                  => $evaluacion->proyecto->only('id', 'diff_meses', 'finalizado', 'max_meses_ejecucion', 'codigo_linea_programatica'),
            'proyectoRolSennova'                        => $proyectoRolSennova,
            'lineaProgramatica'                         => $evaluacion->proyecto->lineaProgramatica->only('id'),
            'proyectoRolEvaluacion'                     => ProyectoRolEvaluacion::where('evaluacion_id', $evaluacion->id)->where('proyecto_rol_sennova_id', $proyectoRolSennova->id)->first(),
            'convocatoriaRolesSennova'                  => SelectHelper::convocatoriaRolesSennova($convocatoria->id, $proyecto->id, $proyecto->lineaProgramatica->id),
            'actividades'                               => $proyectoRolSennova->actividades,
            'proyectoActividadesRelacionadas'           => $proyectoRolSennova->actividades()->pluck('id'),
            'proyectoLineasTecnologicasRelacionadas'    => $lineasTecnologicasRelacionadas ?? null,
            'lineasTecnologicas'                        => $lineasTecnologicas ?? null
        ]);
    }

    public function updateEvaluacion(Request $request, Convocatoria $convocatoria, Evaluacion $evaluacion, ProyectoRolSennova $proyectoRolSennova)
    {
        $this->authorize('modificar-evaluacion-autor', $evaluacion);

        ProyectoRolEvaluacion::updateOrCreate(
            ['evaluacion_id' => $evaluacion->id, 'proyecto_rol_sennova_id' => $proyectoRolSennova->id],
            ['correcto' => $request->correcto, 'comentario' => $request->correcto == false ? $request->comentario : null]
        );

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }
}
