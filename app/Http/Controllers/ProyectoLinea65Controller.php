<?php

namespace App\Http\Controllers;

use App\Helpers\SelectHelper;
use App\Models\Proyecto;
use App\Models\ProyectoLinea65;
use App\Models\Convocatoria;
use App\Models\MesaSectorial;
use App\Http\Requests\ProyectoLinea65LongColumnRequest;
use App\Http\Requests\Evaluacion\EvaluacionProyectoLinea65Request;
use App\Http\Requests\ProyectoLinea65Request;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use App\Models\CentroFormacion;
use App\Models\Evaluacion\EvaluacionProyectoLinea65;
use App\Models\RolSennova;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class ProyectoLinea65Controller extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Convocatoria $convocatoria)
    {
        return Inertia::render('Convocatorias/Proyectos/ProyectosLinea65/Index', [
            'convocatoria'          => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria', 'fase'),
            'proyectos_linea_65'    => ProyectoLinea65::getProyectosPorRol($convocatoria)->appends(['search' => request()->search, 'estructuracion_proyectos' => request()->estructuracion_proyectos]),
            'allowed_to_create'     => Gate::inspect('formular-proyecto', [9, $convocatoria])->allowed()
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create(Convocatoria $convocatoria)
    {
        $this->authorize('formular-proyecto', [9, $convocatoria]);

        $centros_formacion = CentroFormacion::selectRaw('centros_formacion.id as value, concat(centros_formacion.nombre, chr(10), \'∙ Código: \', centros_formacion.codigo) as label')->orderBy('centros_formacion.nombre', 'ASC')->get();

        return Inertia::render('Convocatorias/Proyectos/ProyectosLinea65/Create', [
            'convocatoria'          => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria', 'min_fecha_inicio_proyectos_linea_65', 'max_fecha_finalizacion_proyectos_cultura', 'fecha_maxima_cultura'),
            'roles'                 => collect(json_decode(Storage::get('json/roles-sennova-idi.json'), true)),
            'centros_formacion'     => $centros_formacion,
            'lineas_investigacion'  => SelectHelper::lineasInvestigacion(),
            'lineas_programaticas'  => SelectHelper::lineasProgramaticas()->where('categoria_proyecto', 5)->values()->all(),
            'areas_conocimiento'    => SelectHelper::areasConocimiento(),
            'actividades_economicas'=> SelectHelper::actividadesEconomicas(),
            'tematicas_estrategicas'=> SelectHelper::tematicasEstrategicas(),
            'tipos_proyectos'       => json_decode(Storage::get('json/tipos-proyectos-cultura.json'), true),
            'tipos_eventos'         => json_decode(Storage::get('json/tipos-eventos-cultura.json'), true),
            'roles_sennova'         => RolSennova::select('id as value', 'nombre as label')->orderBy('nombre', 'ASC')->get(),
            'allowed_to_create'     => Gate::inspect('formular-proyecto', [9, $convocatoria])->allowed()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(ProyectoLinea65Request $request, Convocatoria $convocatoria)
    {
        $this->authorize('formular-proyecto', [$request->linea_programatica_id, $convocatoria]);

        $proyecto = new Proyecto();
        $proyecto->centroFormacion()->associate($request->centro_formacion_id);
        $proyecto->lineaProgramatica()->associate($request->linea_programatica_id);
        $proyecto->convocatoria()->associate($convocatoria);
        $proyecto->save();

        $proyecto_linea_65 = new ProyectoLinea65();
        $proyecto_linea_65->titulo                              = $request->titulo;
        $proyecto_linea_65->fecha_inicio                        = $request->fecha_inicio;
        $proyecto_linea_65->fecha_finalizacion                  = $request->fecha_finalizacion;
        $proyecto_linea_65->max_meses_ejecucion                 = $request->max_meses_ejecucion;
        $proyecto_linea_65->tipo_proyecto                       = $request->tipo_proyecto;
        $proyecto_linea_65->tipo_evento                         = $request->tipo_evento;
        $proyecto_linea_65->video                               = null;
        $proyecto_linea_65->justificacion_industria_4           = null;
        $proyecto_linea_65->justificacion_economia_naranja      = null;
        $proyecto_linea_65->justificacion_politica_discapacidad = null;
        $proyecto_linea_65->resumen                             = '';
        $proyecto_linea_65->antecedentes                        = '';
        $proyecto_linea_65->marco_conceptual                    = '';
        $proyecto_linea_65->metodologia                         = '';
        $proyecto_linea_65->propuesta_sostenibilidad            = '';
        $proyecto_linea_65->bibliografia                        = '';
        $proyecto_linea_65->numero_aprendices                   = 0;
        $proyecto_linea_65->impacto_municipios                  = '';
        $proyecto_linea_65->impacto_centro_formacion            = '';

        $proyecto_linea_65->muestreo                            = 6;
        $proyecto_linea_65->actividades_muestreo                = null;
        $proyecto_linea_65->objetivo_muestreo                   = null;
        $proyecto_linea_65->recoleccion_especimenes             = 2;

        $proyecto_linea_65->relacionado_plan_tecnologico        = 2;
        $proyecto_linea_65->relacionado_agendas_competitividad  = 2;
        $proyecto_linea_65->relacionado_mesas_sectoriales       = 2;
        $proyecto_linea_65->relacionado_tecnoacademia           = 2;

        $proyecto_linea_65->lineaInvestigacion()->associate($request->linea_investigacion_id);
        $proyecto_linea_65->areaConocimiento()->associate($request->area_conocimiento_id);
        $proyecto_linea_65->tematicaEstrategica()->associate($request->tematica_estrategica_id);
        $proyecto_linea_65->actividadEconomica()->associate($request->actividad_economica_id);

        $proyecto->proyectoLinea65()->save($proyecto_linea_65);

        $proyecto->participantes()->attach(
            Auth::user()->id,
            [
                'es_formulador'     => true,
                'cantidad_meses'    => $request->cantidad_meses,
                'cantidad_horas'    => $request->cantidad_horas,
                'rol_sennova'       => $request->rol_sennova,
            ]
        );

        return redirect()->route('convocatorias.proyectos-linea-65.edit', [$convocatoria, $proyecto_linea_65])->with('success', 'El recurso se ha creado correctamente. Por favor continue diligenciando la información.');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\ProyectoLinea65  $proyecto_linea_65
     * @return \Illuminate\Http\Response
     */
    public function show(Convocatoria $convocatoria, ProyectoLinea65 $proyecto_linea_65)
    {
        $this->authorize('visualizar-proyecto-autor', [$proyecto_linea_65->proyecto]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\ProyectoLinea65  $proyecto_linea_65
     * @return \Illuminate\Http\Response
     */
    public function edit(Convocatoria $convocatoria, ProyectoLinea65 $proyecto_linea_65)
    {
        $this->authorize('visualizar-proyecto-autor', [$proyecto_linea_65->proyecto]);

        $proyecto_linea_65->load('proyecto.evaluaciones.evaluacionProyectoLinea65');

        $proyecto_linea_65->proyecto->codigo_linea_programatica = $proyecto_linea_65->proyecto->lineaProgramatica->codigo;
        $proyecto_linea_65->proyecto->precio_proyecto           = $proyecto_linea_65->proyecto->precioProyecto;
        $proyecto_linea_65->proyecto->centroFormacion;

        $proyecto_linea_65->mostrar_recomendaciones = $proyecto_linea_65->proyecto->mostrar_recomendaciones;
        $proyecto_linea_65->mostrar_requiere_subsanacion = $proyecto_linea_65->proyecto->mostrar_requiere_subsanacion;

        return Inertia::render('Convocatorias/Proyectos/ProyectosLinea65/Edit', [
            'convocatoria'                                  => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria', 'min_fecha_inicio_proyectos_linea_65', 'max_fecha_finalizacion_proyectos_cultura', 'fecha_maxima_cultura', 'mostrar_recomendaciones', 'campos_convocatoria'),
            'proyecto_linea65'                              => $proyecto_linea_65,
            'tecnoacademia'                                 => $proyecto_linea_65->tecnoacademiaLineasTecnoacademia()->first() ? $proyecto_linea_65->tecnoacademiaLineasTecnoacademia()->first()->tecnoacademia->only('id', 'nombre') : null,
            'mesas_sectoriales'                             => MesaSectorial::select('id as value', 'nombre as label')->get('id'),
            'lineas_investigacion'                          => SelectHelper::lineasInvestigacion()->where('centro_formacion_id', $proyecto_linea_65->proyecto->centro_formacion_id)->values()->all(),
            'lineas_programaticas'                          => SelectHelper::lineasProgramaticas()->where('categoria_proyecto', 5)->values()->all(),
            'areas_conocimiento'                            => SelectHelper::areasConocimiento(),
            'actividades_economicas'                        => SelectHelper::actividadesEconomicas(),
            'tematicas_estrategicas'                        => SelectHelper::tematicasEstrategicas(),
            'tecnoacademias'                                => SelectHelper::tecnoacademias(),
            'municipios'                                    => SelectHelper::municipios(),
            'lineas_tecnoacademia'                          => SelectHelper::lineasTecnoacademia(),
            'programas_formacion_con_registro_calificado'   => SelectHelper::programasFormacion()->where('registro_calificado', true)->where('centro_formacion_id', $proyecto_linea_65->proyecto->centro_formacion_id)->values()->all(),
            'programas_formacion_sin_registro_calificado'   => SelectHelper::programasFormacion()->where('registro_calificado', false)->values()->all(),
            'roles_sennova'                                 => RolSennova::select('id as value', 'nombre as label')->orderBy('nombre', 'ASC')->get(),
            'tipos_proyectos'                               => json_decode(Storage::get('json/tipos-proyectos-cultura.json'), true),
            'tipos_eventos'                                 => json_decode(Storage::get('json/tipos-eventos-cultura.json'), true),
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\ProyectoLinea65  $proyecto_linea_65
     * @return \Illuminate\Http\Response
     */
    public function update(ProyectoLinea65Request $request, Convocatoria $convocatoria, ProyectoLinea65 $proyecto_linea_65)
    {
        $this->authorize('modificar-proyecto-autor', [$proyecto_linea_65->proyecto]);

        $proyecto_linea_65->titulo                              = $request->titulo;
        $proyecto_linea_65->fecha_inicio                        = $request->fecha_inicio;
        $proyecto_linea_65->fecha_finalizacion                  = $request->fecha_finalizacion;
        $proyecto_linea_65->max_meses_ejecucion                 = $request->max_meses_ejecucion;
        $proyecto_linea_65->video                               = $request->video;
        $proyecto_linea_65->tipo_proyecto                       = $request->tipo_proyecto;
        $proyecto_linea_65->tipo_evento                         = $request->tipo_evento;
        $proyecto_linea_65->numero_aprendices                   = $request->numero_aprendices;
        $proyecto_linea_65->muestreo                            = $request->muestreo;
        $proyecto_linea_65->actividades_muestreo                = $request->muestreo == 1 ? $request->actividades_muestreo : null;
        $proyecto_linea_65->objetivo_muestreo                   = $request->muestreo == 1 ? $request->objetivo_muestreo  : null;
        $proyecto_linea_65->recoleccion_especimenes             = $request->recoleccion_especimenes;

        $proyecto_linea_65->resumen                             = $request->resumen;
        $proyecto_linea_65->antecedentes                        = $request->antecedentes;
        $proyecto_linea_65->marco_conceptual                    = $request->marco_conceptual;
        $proyecto_linea_65->justificacion_industria_4           = $request->justificacion_industria_4;
        $proyecto_linea_65->justificacion_economia_naranja      = $request->justificacion_economia_naranja;
        $proyecto_linea_65->justificacion_politica_discapacidad = $request->justificacion_politica_discapacidad;
        $proyecto_linea_65->impacto_municipios                  = $request->impacto_municipios;
        $proyecto_linea_65->impacto_centro_formacion            = $request->impacto_centro_formacion;
        $proyecto_linea_65->bibliografia                        = $request->bibliografia;
        $proyecto_linea_65->atencion_pluralista_diferencial     = $request->atencion_pluralista_diferencial;
        $proyecto_linea_65->impacto_sector_agricola             = $request->impacto_sector_agricola;

        $proyecto_linea_65->relacionado_plan_tecnologico         = $request->relacionado_plan_tecnologico;
        $proyecto_linea_65->relacionado_agendas_competitividad   = $request->relacionado_agendas_competitividad;
        $proyecto_linea_65->relacionado_mesas_sectoriales        = $request->relacionado_mesas_sectoriales;
        $proyecto_linea_65->relacionado_tecnoacademia            = $request->relacionado_tecnoacademia;

        $proyecto_linea_65->lineaInvestigacion()->associate($request->linea_investigacion_id);
        $proyecto_linea_65->areaConocimiento()->associate($request->area_conocimiento_id);
        $proyecto_linea_65->tematicaEstrategica()->associate($request->tematica_estrategica_id);
        $proyecto_linea_65->actividadEconomica()->associate($request->actividad_economica_id);

        $proyecto_linea_65->proyecto->municipios()->sync($request->municipios);
        $proyecto_linea_65->proyecto->programasFormacion()->sync(array_merge($request->programas_formacion ? $request->programas_formacion : [], $request->programas_formacion_articulados ? $request->programas_formacion_articulados : []));

        $proyecto_linea_65->save();

        $request->relacionado_mesas_sectoriales == 1 ? $proyecto_linea_65->mesasSectoriales()->sync($request->mesa_sectorial_id) : $proyecto_linea_65->mesasSectoriales()->detach();
        $request->relacionado_tecnoacademia == 1 ? $proyecto_linea_65->tecnoacademiaLineasTecnoacademia()->sync($request->linea_tecnologica_id) : $proyecto_linea_65->tecnoacademiaLineasTecnoacademia()->detach();


        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }

    public function updateLongColumn(ProyectoLinea65LongColumnRequest $request, Convocatoria $convocatoria, ProyectoLinea65 $proyecto_linea_65, $column)
    {
        $this->authorize('modificar-proyecto-autor', [$proyecto_linea_65->proyecto]);

        $proyecto_linea_65->update($request->only($column));

        return back();
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\ProyectoLinea65  $proyecto_linea_65
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, Convocatoria $convocatoria, ProyectoLinea65 $proyecto_linea_65)
    {
        $this->authorize('eliminar-proyecto-autor', [$proyecto_linea_65->proyecto]);

        if (!Hash::check($request->password, Auth::user()->password)) {
            return back()
                ->withErrors(['password' => __('The password is incorrect.')]);
        }

        $proyecto_linea_65->proyecto()->delete();

        return back()->with('success', 'El recurso se ha eliminado correctamente.');
    }

    public function updateEvaluacion(EvaluacionProyectoLinea65Request $request, Convocatoria $convocatoria, EvaluacionProyectoLinea65 $evaluacionProyectoLinea65)
    {
        $this->authorize('modificar-evaluacion-autor', $evaluacionProyectoLinea65->evaluacion);

        $evaluacionProyectoLinea65->evaluacion()->update([
            'iniciado' => true,
            'clausula_confidencialidad' => $request->clausula_confidencialidad

        ]);

        $evaluacionProyectoLinea65->titulo_puntaje                                      = $request->titulo_puntaje;
        $evaluacionProyectoLinea65->titulo_comentario                                   = $request->titulo_requiere_comentario == false ? $request->titulo_comentario : null;
        $evaluacionProyectoLinea65->video_puntaje                                       = $request->video_puntaje;
        $evaluacionProyectoLinea65->video_comentario                                    = $request->video_requiere_comentario == false ? $request->video_comentario : null;

        $evaluacionProyectoLinea65->antecedentes_puntaje                                = $request->antecedentes_puntaje;
        $evaluacionProyectoLinea65->antecedentes_comentario                             = $request->antecedentes_requiere_comentario == false ? $request->antecedentes_comentario : null;

        $evaluacionProyectoLinea65->resumen_puntaje                                     = $request->resumen_puntaje;
        $evaluacionProyectoLinea65->resumen_comentario                                  = $request->resumen_requiere_comentario == false ? $request->resumen_comentario : null;
        $evaluacionProyectoLinea65->ortografia_puntaje                                  = $request->ortografia_puntaje;
        $evaluacionProyectoLinea65->ortografia_comentario                               = $request->ortografia_requiere_comentario == false ? $request->ortografia_comentario : null;
        $evaluacionProyectoLinea65->redaccion_puntaje                                   = $request->redaccion_puntaje;
        $evaluacionProyectoLinea65->redaccion_comentario                                = $request->redaccion_requiere_comentario == false ? $request->redaccion_comentario : null;
        $evaluacionProyectoLinea65->normas_apa_puntaje                                  = $request->normas_apa_puntaje;
        $evaluacionProyectoLinea65->normas_apa_comentario                               = $request->normas_apa_requiere_comentario == false ? $request->normas_apa_comentario : null;

        $evaluacionProyectoLinea65->justificacion_economia_naranja_comentario           = $request->justificacion_economia_naranja_requiere_comentario == false ? $request->justificacion_economia_naranja_comentario : null;
        $evaluacionProyectoLinea65->justificacion_industria_4_comentario                = $request->justificacion_industria_4_requiere_comentario == false ? $request->justificacion_industria_4_comentario : null;
        $evaluacionProyectoLinea65->bibliografia_comentario                             = $request->bibliografia_requiere_comentario == false ? $request->bibliografia_comentario : null;
        $evaluacionProyectoLinea65->fechas_comentario                                   = $request->fechas_requiere_comentario == false ? $request->fechas_comentario : null;
        $evaluacionProyectoLinea65->justificacion_politica_discapacidad_comentario      = $request->justificacion_politica_discapacidad_requiere_comentario == false ? $request->justificacion_politica_discapacidad_comentario : null;
        $evaluacionProyectoLinea65->actividad_economica_comentario                      = $request->actividad_economica_requiere_comentario == false ? $request->actividad_economica_comentario : null;
        $evaluacionProyectoLinea65->area_conocimiento_comentario                        = $request->area_conocimiento_requiere_comentario == false ? $request->area_conocimiento_comentario : null;
        $evaluacionProyectoLinea65->tematica_estrategica_comentario                     = $request->tematica_estrategica_requiere_comentario == false ? $request->tematica_estrategica_comentario : null;

        $evaluacionProyectoLinea65->save();

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }
}
