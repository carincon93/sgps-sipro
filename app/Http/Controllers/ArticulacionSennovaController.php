<?php

namespace App\Http\Controllers;

use App\Helpers\SelectHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\ArticulacionSennovaRequest;
use App\Models\Convocatoria;
use App\Models\Evaluacion\Evaluacion;
use App\Models\Evaluacion\TaEvaluacion;
use App\Models\LineaInvestigacion;
use App\Models\Proyecto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ArticulacionSennovaController extends Controller
{
    /**
     * showArticulacionSennova
     *
     * @param  mixed $convocatoria
     * @param  mixed $proyecto
     * @return void
     */
    public function showArticulacionSennova(Convocatoria $convocatoria, Proyecto $proyecto)
    {
        $this->authorize('visualizar-proyecto-autor', [$proyecto]);

        $proyecto->load('evaluaciones.taEvaluacion');
        $proyecto->load('participantes.centroFormacion.regional');

        if ($proyecto->lineaProgramatica->codigo != 69 && $proyecto->lineaProgramatica->codigo != 70) {
            return back()->with('error', 'No puede acceder a este módulo.');
        }

        $proyecto->participantes;
        $proyecto->codigo_linea_programatica = $proyecto->lineaProgramatica->codigo;
        $proyecto->precio_proyecto           = $proyecto->precioProyecto;

        $rolesSennova = null;
        switch ($proyecto->lineaProgramatica->codigo) {
            case 70:
                $rolesSennova = collect(json_decode(Storage::get('json/roles-sennova-ta.json'), true));

                $proyecto->proyectos_ejecucion                  = $proyecto->ta->proyectos_ejecucion;
                $proyecto->articulacion_semillero               = $proyecto->ta->articulacion_semillero;
                $proyecto->semilleros_en_formalizacion          = $proyecto->ta->semilleros_en_formalizacion;
                $proyecto->articulacion_centro_formacion        = $proyecto->ta->articulacion_centro_formacion;
                $proyecto->lineas_medulares_centro              = $proyecto->ta->lineas_medulares_centro;
                $proyecto->articulacion_programas_centro        = $proyecto->ta->articulacion_programas_centro;
                $proyecto->articulacion_bienestar_aprendiz      = $proyecto->ta->articulacion_bienestar_aprendiz;
                $proyecto->favorecimiento_ruta_formacion        = $proyecto->ta->favorecimiento_ruta_formacion;

                $disciplinasSubareaConocimientoRelacionadas     = $proyecto->ta->disciplinasSubareaConocimiento()->select('disciplinas_subarea_conocimiento.id as value', 'disciplinas_subarea_conocimiento.nombre as label')->get();
                $redesConocimientoRelacionadas                  = $proyecto->ta->redesConocimiento()->select('redes_conocimiento.id as value', 'redes_conocimiento.nombre as label')->get();
                $tematicasEstrategicasRelacionadas              = $proyecto->ta->tematicasEstrategicas()->select('tematicas_estrategicas.id as value', 'tematicas_estrategicas.nombre as label')->get();
                $actividadesEconomicasRelacionadas              = $proyecto->ta->actividadesEconomicas()->select('actividades_economicas.id as value', 'actividades_economicas.nombre as label')->get();
                $proyectosIdiTecnoacademiaRelacionados          = $proyecto->ta->proyectosIdiTecnoacademia()->selectRaw('proyectos_idi_tecnoacademia.id as value, concat(\'IDITA-\', proyectos_idi_tecnoacademia.id, \' ∙ \', proyectos_idi_tecnoacademia.titulo) as label, proyectos_idi_tecnoacademia.tecnoacademia_id as tecnoacademia_id')->get();
                break;

            case 69:
                $rolesSennova = collect(json_decode(Storage::get('json/roles-sennova-tp.json'), true));

                $proyecto->impacto_centro_formacion             = $proyecto->tp->impacto_centro_formacion;
                $proyecto->aportacion_semilleros_grupos         = $proyecto->tp->aportacion_semilleros_grupos;
                $proyecto->proyeccion_con_st                    = $proyecto->tp->proyeccion_con_st;
                $proyecto->proyeccion_extensionismo_tecnologico = $proyecto->tp->proyeccion_extensionismo_tecnologico;
                $proyecto->proyeccion_centros_desarrollo        = $proyecto->tp->proyeccion_centros_desarrollo;
                $proyecto->proyeccion_formacion_regional        = $proyecto->tp->proyeccion_formacion_regional;
                break;

            default:
                break;
        }

        return Inertia::render('Convocatorias/Proyectos/ArticulacionSennova/Index', [
            'convocatoria'                                  => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria', 'year', 'min_fecha_inicio_proyectos_ta', 'max_fecha_finalizacion_proyectos_ta'),
            'proyecto'                                      => $proyecto->only(
                'id',
                'precio_proyecto',
                'codigo_linea_programatica',
                'proyectos_ejecucion',
                'modificable',
                'articulacion_semillero',
                'semilleros_en_formalizacion',
                'mostrar_recomendaciones',
                'PdfVersiones',
                'all_files',
                'allowed',
                'evaluaciones',
                'articulacion_centro_formacion',
                'lineas_medulares_centro',
                'articulacion_programas_centro',
                'articulacion_bienestar_aprendiz',
                'favorecimiento_ruta_formacion',
                'impacto_centro_formacion',
                'aportacion_semilleros_grupos',
                'proyeccion_con_st',
                'proyeccion_extensionismo_tecnologico',
                'proyeccion_centros_desarrollo',
                'proyeccion_formacion_regional',
                'participantes',
                'diff_meses'
            ),
            'lineasInvestigacion'                           => LineaInvestigacion::selectRaw('lineas_investigacion.id as value, concat(lineas_investigacion.nombre, chr(10), \'∙ Grupo de investigación: \', grupos_investigacion.nombre, chr(10)) as label')->join('grupos_investigacion', 'lineas_investigacion.grupo_investigacion_id', 'grupos_investigacion.id')->where('grupos_investigacion.centro_formacion_id', $proyecto->centroFormacion->id)->get(),
            'gruposInvestigacion'                           => SelectHelper::gruposInvestigacion()->where('regional_id', $proyecto->centroFormacion->regional->id)->values()->all(),
            'semillerosInvestigacion'                       => SelectHelper::semillerosInvestigacion()->where('centro_formacion_id', $proyecto->centroFormacion->id)->values()->all(),
            'redesConocimiento'                             => SelectHelper::redesConocimiento(),
            'tematicasEstrategicas'                         => SelectHelper::tematicasEstrategicas(),
            'actividadesEconomicas'                         => SelectHelper::actividadesEconomicas(),
            'areasConocimiento'                             => SelectHelper::areasConocimiento(),
            'subareasConocimiento'                          => SelectHelper::subareasConocimiento(),
            'disciplinasSubareaConocimiento'                => SelectHelper::disciplinasSubareaConocimiento(),
            'proyectosIdiTecnoacademia'                     => SelectHelper::proyectosIdiTecnoacademia(),
            'gruposInvestigacionRelacionados'               => $proyecto->gruposInvestigacion()->select('grupos_investigacion.id as value', 'grupos_investigacion.nombre as label')->get(),
            'lineasInvestigacionRelacionadas'               => $proyecto->lineasInvestigacion()->select('lineas_investigacion.id as value', 'lineas_investigacion.nombre as label')->get(),
            'semillerosInvestigacionRelacionados'           => $proyecto->semillerosInvestigacion()->select('semilleros_investigacion.id as value', 'semilleros_investigacion.nombre as label')->get(),
            'disciplinasSubareaConocimientoRelacionadas'    => $disciplinasSubareaConocimientoRelacionadas ?? null,
            'redesConocimientoRelacionadas'                 => $redesConocimientoRelacionadas ?? null,
            'tematicasEstrategicasRelacionadas'             => $tematicasEstrategicasRelacionadas ?? null,
            'actividadesEconomicasRelacionadas'             => $actividadesEconomicasRelacionadas ?? null,
            'proyectosIdiTecnoacademiaRelacionados'         => $proyectosIdiTecnoacademiaRelacionados ?? null,
            'tiposDocumento'                                => json_decode(Storage::get('json/tipos-documento.json'), true),
            'tiposVinculacion'                              => json_decode(Storage::get('json/tipos-vinculacion.json'), true),
            'centrosFormacion'                              => SelectHelper::centrosFormacion(),
            'roles'                                         => $rolesSennova,
            'autorPrincipal'                                => $proyecto->participantes()->where('proyecto_participantes.es_formulador', true)->first(),
        ]);
    }

    /**
     * showArticulacionSennovaEvaluacion
     *
     * @param  mixed $convocatoria
     * @param  mixed $proyecto
     * @return void
     */
    public function showArticulacionSennovaEvaluacion(Convocatoria $convocatoria, Evaluacion $evaluacion)
    {
        $this->authorize('visualizar-evaluacion-autor', $evaluacion);

        if ($evaluacion->proyecto->lineaProgramatica->codigo != 69 && $evaluacion->proyecto->lineaProgramatica->codigo != 70) {
            return back()->with('error', 'No puede acceder a este módulo.');
        }

        $evaluacion->proyecto->participantes;
        $evaluacion->proyecto->codigo_linea_programatica = $evaluacion->proyecto->lineaProgramatica->codigo;
        $evaluacion->proyecto->precio_proyecto           = $evaluacion->proyecto->precioProyecto;

        $rolesSennova = null;
        switch ($evaluacion->proyecto->lineaProgramatica->codigo) {
            case 70:
                $evaluacion->taEvaluacion;

                $rolesSennova = collect(json_decode(Storage::get('json/roles-sennova-ta.json'), true));

                $evaluacion->proyecto->proyectos_ejecucion                  = $evaluacion->proyecto->ta->proyectos_ejecucion;
                $evaluacion->proyecto->articulacion_semillero               = $evaluacion->proyecto->ta->articulacion_semillero;
                $evaluacion->proyecto->semilleros_en_formalizacion          = $evaluacion->proyecto->ta->semilleros_en_formalizacion;
                $evaluacion->proyecto->articulacion_centro_formacion        = $evaluacion->proyecto->ta->articulacion_centro_formacion;
                $evaluacion->proyecto->lineas_medulares_centro              = $evaluacion->proyecto->ta->lineas_medulares_centro;
                $evaluacion->proyecto->articulacion_programas_centro        = $evaluacion->proyecto->ta->articulacion_programas_centro;
                $evaluacion->proyecto->articulacion_bienestar_aprendiz      = $evaluacion->proyecto->ta->articulacion_bienestar_aprendiz;
                $evaluacion->proyecto->favorecimiento_ruta_formacion        = $evaluacion->proyecto->ta->favorecimiento_ruta_formacion;

                $disciplinasSubareaConocimientoRelacionadas                 = $evaluacion->proyecto->ta->disciplinasSubareaConocimiento()->select('disciplinas_subarea_conocimiento.id as value', 'disciplinas_subarea_conocimiento.nombre as label')->get();
                $redesConocimientoRelacionadas                              = $evaluacion->proyecto->ta->redesConocimiento()->select('redes_conocimiento.id as value', 'redes_conocimiento.nombre as label')->get();
                $tematicasEstrategicasRelacionadas                          = $evaluacion->proyecto->ta->tematicasEstrategicas()->select('tematicas_estrategicas.id as value', 'tematicas_estrategicas.nombre as label')->get();
                $actividadesEconomicasRelacionadas                          = $evaluacion->proyecto->ta->actividadesEconomicas()->select('actividades_economicas.id as value', 'actividades_economicas.nombre as label')->get();
                $evaluacion->proyectosIdiTecnoacademiaRelacionados          = $evaluacion->proyecto->ta->proyectosIdiTecnoacademia()->selectRaw('proyectos_idi_tecnoacademia.id as value, concat(\'IDITA-\', proyectos_idi_tecnoacademia.id, \' ∙ \', proyectos_idi_tecnoacademia.titulo) as label, proyectos_idi_tecnoacademia.tecnoacademia_id as tecnoacademia_id')->get();
                break;

            case 69:
                $evaluacion->tpEvaluacion;

                $rolesSennova = collect(json_decode(Storage::get('json/roles-sennova-tp.json'), true));

                $evaluacion->proyecto->impacto_centro_formacion             = $evaluacion->proyecto->tp->impacto_centro_formacion;
                $evaluacion->proyecto->aportacion_semilleros_grupos         = $evaluacion->proyecto->tp->aportacion_semilleros_grupos;
                $evaluacion->proyecto->proyeccion_con_st                    = $evaluacion->proyecto->tp->proyeccion_con_st;
                $evaluacion->proyecto->proyeccion_extensionismo_tecnologico = $evaluacion->proyecto->tp->proyeccion_extensionismo_tecnologico;
                $evaluacion->proyecto->proyeccion_centros_desarrollo        = $evaluacion->proyecto->tp->proyeccion_centros_desarrollo;
                $evaluacion->proyecto->proyeccion_formacion_regional        = $evaluacion->proyecto->tp->proyeccion_formacion_regional;
                break;

            default:
                break;
        }

        return Inertia::render('Convocatorias/Evaluaciones/ArticulacionSennova/Index', [
            'convocatoria'                                  => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria', 'year', 'min_fecha_inicio_proyectos_ta', 'max_fecha_finalizacion_proyectos_ta'),
            'evaluacion'                                    => $evaluacion,
            'proyecto'                                      => $evaluacion->proyecto->only(
                'id',
                'precio_proyecto',
                'codigo_linea_programatica',
                'proyectos_ejecucion',
                'modificable',
                'articulacion_semillero',
                'semilleros_en_formalizacion',
                'mostrar_recomendaciones',
                'PdfVersiones',
                'all_files',
                'allowed',
                'evaluaciones',
                'articulacion_centro_formacion',
                'lineas_medulares_centro',
                'articulacion_programas_centro',
                'articulacion_bienestar_aprendiz',
                'favorecimiento_ruta_formacion',
                'impacto_centro_formacion',
                'aportacion_semilleros_grupos',
                'proyeccion_con_st',
                'proyeccion_extensionismo_tecnologico',
                'proyeccion_centros_desarrollo',
                'proyeccion_formacion_regional',
                'participantes',
                'diff_meses'
            ),
            'lineasInvestigacion'                           => LineaInvestigacion::selectRaw('lineas_investigacion.id as value, concat(lineas_investigacion.nombre, chr(10), \'∙ Grupo de investigación: \', grupos_investigacion.nombre, chr(10)) as label')->join('grupos_investigacion', 'lineas_investigacion.grupo_investigacion_id', 'grupos_investigacion.id')->where('grupos_investigacion.centro_formacion_id', $evaluacion->proyecto->centroFormacion->id)->get(),
            'gruposInvestigacion'                           => SelectHelper::gruposInvestigacion()->where('regional_id', $evaluacion->proyecto->centroFormacion->regional->id)->values()->all(),
            'semillerosInvestigacion'                       => SelectHelper::semillerosInvestigacion()->where('centro_formacion_id', $evaluacion->proyecto->centroFormacion->id)->values()->all(),
            'redesConocimiento'                             => SelectHelper::redesConocimiento(),
            'tematicasEstrategicas'                         => SelectHelper::tematicasEstrategicas(),
            'actividadesEconomicas'                         => SelectHelper::actividadesEconomicas(),
            'areasConocimiento'                             => SelectHelper::areasConocimiento(),
            'subareasConocimiento'                          => SelectHelper::subareasConocimiento(),
            'disciplinasSubareaConocimiento'                => SelectHelper::disciplinasSubareaConocimiento(),
            'proyectosIdiTecnoacademia'                     => SelectHelper::proyectosIdiTecnoacademia(),
            'gruposInvestigacionRelacionados'               => $evaluacion->proyecto->gruposInvestigacion()->select('grupos_investigacion.id as value', 'grupos_investigacion.nombre as label')->get(),
            'lineasInvestigacionRelacionadas'               => $evaluacion->proyecto->lineasInvestigacion()->select('lineas_investigacion.id as value', 'lineas_investigacion.nombre as label')->get(),
            'semillerosInvestigacionRelacionados'           => $evaluacion->proyecto->semillerosInvestigacion()->select('semilleros_investigacion.id as value', 'semilleros_investigacion.nombre as label')->get(),
            'disciplinasSubareaConocimientoRelacionadas'    => $disciplinasSubareaConocimientoRelacionadas ?? null,
            'redesConocimientoRelacionadas'                 => $redesConocimientoRelacionadas ?? null,
            'tematicasEstrategicasRelacionadas'             => $tematicasEstrategicasRelacionadas ?? null,
            'actividadesEconomicasRelacionadas'             => $actividadesEconomicasRelacionadas ?? null,
            'proyectosIdiTecnoacademiaRelacionados'         => $evaluacion->proyectosIdiTecnoacademiaRelacionados ?? null,
            'tiposDocumento'                                => json_decode(Storage::get('json/tipos-documento.json'), true),
            'tiposVinculacion'                              => json_decode(Storage::get('json/tipos-vinculacion.json'), true),
            'centrosFormacion'                              => SelectHelper::centrosFormacion(),
            'roles'                                         => $rolesSennova,
            'autorPrincipal'                                => $evaluacion->proyecto->participantes()->where('proyecto_participantes.es_formulador', true)->first(),
        ]);
    }

    /**
     * storeArticulacionSennova
     *
     * @param  mixed $request
     * @param  mixed $convocatoria
     * @param  mixed $proyecto
     * @return void
     */
    public function storeArticulacionSennova(Request $request, Convocatoria $convocatoria, Proyecto $proyecto)
    {
        if (is_array($request->grupos_investigacion)) {
            if (isset($request->grupos_investigacion['value']) && is_numeric($request->grupos_investigacion['value'])) {
                $request->merge([
                    'grupos_investigacion' => $request->grupos_investigacion['value'],
                ]);
            } else {
                $gruposInvestigacion = [];
                foreach ($request->grupos_investigacion as $grupoInvestigacion) {
                    if (is_array($grupoInvestigacion)) {
                        array_push($gruposInvestigacion, $grupoInvestigacion['value']);
                    }
                }
                $request->merge(['grupos_investigacion' => $gruposInvestigacion]);
            }
        }

        if (is_array($request->semilleros_investigacion)) {
            if (isset($request->semilleros_investigacion['value']) && is_numeric($request->semilleros_investigacion['value'])) {
                $request->merge([
                    'semilleros_investigacion' => $request->semilleros_investigacion['value'],
                ]);
            } else {
                $semillerosInvestigacion = [];
                foreach ($request->semilleros_investigacion as $semilleroInvestigacion) {
                    if (is_array($semilleroInvestigacion)) {
                        array_push($semillerosInvestigacion, $semilleroInvestigacion['value']);
                    }
                }
                $request->merge(['semilleros_investigacion' => $semillerosInvestigacion]);
            }
        }

        switch ($proyecto->lineaProgramatica->codigo) {
            case 70:
                if (is_array($request->lineas_investigacion)) {
                    if (isset($request->lineas_investigacion['value']) && is_numeric($request->lineas_investigacion['value'])) {
                        $request->merge([
                            'lineas_investigacion' => $request->lineas_investigacion['value'],
                        ]);
                    } else {
                        $lineasInvestigacion = [];
                        foreach ($request->lineas_investigacion as $lineaInvestigacion) {
                            if (is_array($lineaInvestigacion)) {
                                array_push($lineasInvestigacion, $lineaInvestigacion['value']);
                            }
                        }
                        $request->merge(['lineas_investigacion' => $lineasInvestigacion]);
                    }
                }

                if (is_array($request->disciplinas_subarea_conocimiento)) {
                    if (isset($request->disciplinas_subarea_conocimiento['value']) && is_numeric($request->disciplinas_subarea_conocimiento['value'])) {
                        $request->merge([
                            'disciplinas_subarea_conocimiento' => $request->disciplinas_subarea_conocimiento['value'],
                        ]);
                    } else {
                        $disciplinasSubareaConocimiento = [];
                        foreach ($request->disciplinas_subarea_conocimiento as $lineaInvestigacion) {
                            if (is_array($lineaInvestigacion)) {
                                array_push($disciplinasSubareaConocimiento, $lineaInvestigacion['value']);
                            }
                        }
                        $request->merge(['disciplinas_subarea_conocimiento' => $disciplinasSubareaConocimiento]);
                    }
                }

                if (is_array($request->tematicas_estrategicas)) {
                    if (isset($request->tematicas_estrategicas['value']) && is_numeric($request->tematicas_estrategicas['value'])) {
                        $request->merge([
                            'tematicas_estrategicas' => $request->tematicas_estrategicas['value'],
                        ]);
                    } else {
                        $tematicasEstrategicas = [];
                        foreach ($request->tematicas_estrategicas as $lineaInvestigacion) {
                            if (is_array($lineaInvestigacion)) {
                                array_push($tematicasEstrategicas, $lineaInvestigacion['value']);
                            }
                        }
                        $request->merge(['tematicas_estrategicas' => $tematicasEstrategicas]);
                    }
                }

                if (is_array($request->proyecto_idi_tecnoacademia_id)) {
                    if (isset($request->proyecto_idi_tecnoacademia_id['value']) && is_numeric($request->proyecto_idi_tecnoacademia_id['value'])) {
                        $request->merge([
                            'proyecto_idi_tecnoacademia_id' => $request->proyecto_idi_tecnoacademia_id['value'],
                        ]);
                    } else {
                        $proyectos = [];
                        foreach ($request->proyecto_idi_tecnoacademia_id as $proyectoIdi) {
                            if (is_array($proyectoIdi)) {
                                array_push($proyectos, $proyectoIdi['value']);
                            }
                        }
                        $request->merge(['proyecto_idi_tecnoacademia_id' => $proyectos]);
                    }
                }

                if (is_array($request->actividades_economicas)) {
                    if (isset($request->actividades_economicas['value']) && is_numeric($request->actividades_economicas['value'])) {
                        $request->merge([
                            'actividades_economicas' => $request->actividades_economicas['value'],
                        ]);
                    } else {
                        $actividadesEconomicas = [];
                        foreach ($request->actividades_economicas as $lineaInvestigacion) {
                            if (is_array($lineaInvestigacion)) {
                                array_push($actividadesEconomicas, $lineaInvestigacion['value']);
                            }
                        }
                        $request->merge(['actividades_economicas' => $actividadesEconomicas]);
                    }
                }

                if (is_array($request->redes_conocimiento)) {
                    if (isset($request->redes_conocimiento['value']) && is_numeric($request->redes_conocimiento['value'])) {
                        $request->merge([
                            'redes_conocimiento' => $request->redes_conocimiento['value'],
                        ]);
                    } else {
                        $redesConocimiento = [];
                        foreach ($request->redes_conocimiento as $lineaInvestigacion) {
                            if (is_array($lineaInvestigacion)) {
                                array_push($redesConocimiento, $lineaInvestigacion['value']);
                            }
                        }
                        $request->merge(['redes_conocimiento' => $redesConocimiento]);
                    }
                }

                if (is_array($request->articulacion_semillero)) {
                    $request->merge([
                        'articulacion_semillero' => $request->articulacion_semillero['value'],
                    ]);
                }

                $request->validate([
                    'lineas_investigacion*'             => 'required|integer|min:0|max:2147483647|exists:lineas_investigacion,id',
                    'grupos_investigacion*'             => 'required|integer|min:0|max:2147483647|exists:grupos_investigacion,id',
                    'semilleros_investigacion*'         => 'nullable|integer|min:0|max:2147483647|exists:semilleros_investigacion,id',
                    'disciplinas_subarea_conocimiento*' => 'required|integer|min:0|max:2147483647|exists:disciplinas_subarea_conocimiento,id',
                    'redes_conocimiento*'               => 'required|integer|min:0|max:2147483647|exists:redes_conocimiento,id',
                    'tematicas_estrategicas*'           => 'required|integer|min:0|max:2147483647|exists:tematicas_estrategicas,id',
                    'proyecto_idi_tecnoacademia_id*'    => 'required|integer|min:0|max:2147483647|exists:proyectos_idi_tecnoacademia,id',
                    'actividades_economicas*'           => 'required|integer|min:0|max:2147483647|exists:actividades_economicas,id',
                    'articulacion_semillero'            => 'required|min:0|max:2|integer',
                    'semilleros_en_formalizacion'       => 'nullable|json',
                ]);

                $proyecto->ta->update([
                    'proyectos_ejecucion'               => $request->proyectos_ejecucion,
                    'articulacion_semillero'            => $request->articulacion_semillero,
                    'semilleros_en_formalizacion'       => $request->semilleros_en_formalizacion,
                    'articulacion_centro_formacion'     => $request->articulacion_centro_formacion,
                    'lineas_medulares_centro'           => $request->lineas_medulares_centro,
                    'articulacion_programas_centro'     => $request->articulacion_programas_centro,
                    'articulacion_bienestar_aprendiz'   => $request->articulacion_bienestar_aprendiz,
                    'favorecimiento_ruta_formacion'     => $request->favorecimiento_ruta_formacion,
                ]);

                if ($request->articulacion_semillero == 1) {
                    $proyecto->semillerosInvestigacion()->sync($request->semilleros_investigacion);
                } else {
                    $proyecto->semillerosInvestigacion()->sync([]);
                }

                $proyecto->gruposInvestigacion()->sync($request->grupos_investigacion);
                $proyecto->lineasInvestigacion()->sync($request->lineas_investigacion);
                $proyecto->ta->actividadesEconomicas()->sync($request->actividades_economicas);
                $proyecto->ta->disciplinasSubareaConocimiento()->sync($request->disciplinas_subarea_conocimiento);
                $proyecto->ta->redesConocimiento()->sync($request->redes_conocimiento);
                $proyecto->ta->tematicasEstrategicas()->sync($request->tematicas_estrategicas);
                $proyecto->ta->proyectosIdiTecnoacademia()->sync($request->proyecto_idi_tecnoacademia_id);

                break;

            case 69:
                $proyecto->gruposInvestigacion()->sync($request->grupos_investigacion);
                $proyecto->semillerosInvestigacion()->sync($request->semilleros_investigacion);

                $proyecto->tp->update([
                    'impacto_centro_formacion'              => $request->impacto_centro_formacion,
                    'aportacion_semilleros_grupos'          => $request->aportacion_semilleros_grupos,
                    'proyeccion_con_st'                     => $request->proyeccion_con_st,
                    'proyeccion_extensionismo_tecnologico'  => $request->proyeccion_extensionismo_tecnologico,
                    'proyeccion_centros_desarrollo'         => $request->proyeccion_centros_desarrollo,
                    'proyeccion_formacion_regional'         => $request->proyeccion_formacion_regional,
                ]);
                break;

            default:
                break;
        }

        return back()->with('success', 'El recurso se ha guardado correctamente.');
    }

    /**
     * updatedArticulacionSennovaEvaluacion
     *
     * @param  mixed $request
     * @param  mixed $convocatoria
     * @param  mixed $evaluacion
     * @return void
     */
    public function updatedArticulacionSennovaEvaluacion(Request $request, Convocatoria $convocatoria, Evaluacion $evaluacion)
    {
        $this->authorize('modificar-evaluacion-autor', $evaluacion);

        if ($evaluacion->taEvaluacion()->exists()) {
            $evaluacion->taEvaluacion()->update([
                'articulacion_sennova_comentario'       => $request->articulacion_sennova_requiere_comentario == false ? $request->articulacion_sennova_comentario : null,
                'impacto_centro_formacion_comentario'   => $request->impacto_centro_formacion_requiere_comentario == false ? $request->impacto_centro_formacion_comentario : null,
            ]);
        } else if ($evaluacion->tpEvaluacion()->exists()) {

            $evaluacion->tpEvaluacion()->update([
                'articulacion_sennova_comentario'       => $request->articulacion_sennova_requiere_comentario == false ? $request->articulacion_sennova_comentario : null,
                'impacto_centro_formacion_comentario'   => $request->impacto_centro_formacion_requiere_comentario == false ? $request->impacto_centro_formacion_comentario : null,
            ]);
        }

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }
}
