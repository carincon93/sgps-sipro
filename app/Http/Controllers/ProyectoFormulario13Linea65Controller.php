<?php

namespace App\Http\Controllers;

use App\Helpers\SelectHelper;
use App\Models\Proyecto;
use App\Models\ProyectoFormulario13Linea65;
use App\Models\Convocatoria;
use App\Models\MesaSectorial;
use App\Http\Requests\Evaluacion\EvaluacionProyectoFormulario13Linea65Request;
use App\Http\Requests\ProyectoFormulario13Linea65ColumnRequest;
use App\Http\Requests\ProyectoFormulario13Linea65Request;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use App\Models\CentroFormacion;
use App\Models\Evaluacion\EvaluacionProyectoFormulario13Linea65;
use App\Models\RolSennova;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class ProyectoFormulario13Linea65Controller extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Convocatoria $convocatoria)
    {
        return Inertia::render('Convocatorias/Proyectos/ProyectosFormulario13Linea65/Index', [
            'convocatoria'                      => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria', 'year'),
            'proyectos_formulario_13_linea_65'  => ProyectoFormulario13Linea65::getProyectosPorRol($convocatoria)->appends(['search' => request()->search, 'estructuracion_proyectos' => request()->estructuracion_proyectos]),
            'allowed_to_create'                 => Gate::inspect('formular-proyecto', [9, $convocatoria])->allowed()
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

        return Inertia::render('Convocatorias/Proyectos/ProyectosFormulario13Linea65/Create', [
            'convocatoria'              => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'year'),
            'centros_formacion'         => $centros_formacion,
            'lineas_investigacion'      => SelectHelper::lineasInvestigacion(),
            'areas_cualificacion_mnc'   => json_decode(Storage::get('json/areas-cualificacion-mnc.json'), true),
            'ejes_sennova'              => json_decode(Storage::get('json/ejes-sennova.json'), true),
            'areas_conocimiento'        => SelectHelper::areasConocimiento(),
            'actividades_economicas'    => SelectHelper::actividadesEconomicas(),
            'tematicas_estrategicas'    => SelectHelper::tematicasEstrategicas(),
            'roles_sennova'             => RolSennova::select('id as value', 'nombre as label')->orderBy('nombre', 'ASC')->get(),
            'allowed_to_create'         => Gate::inspect('formular-proyecto', [9, $convocatoria])->allowed()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(ProyectoFormulario13Linea65Request $request, Convocatoria $convocatoria)
    {
        $this->authorize('formular-proyecto', [9, $convocatoria]);

        $proyecto = new Proyecto();
        $proyecto->centroFormacion()->associate($request->centro_formacion_id);
        $proyecto->tipoFormularioConvocatoria()->associate(13);
        $proyecto->convocatoria()->associate($convocatoria);
        $proyecto->save();

        $proyecto_formulario_13_linea_65 = new ProyectoFormulario13Linea65();
        $proyecto_formulario_13_linea_65->titulo                              = $request->titulo;
        $proyecto_formulario_13_linea_65->fecha_inicio                        = $request->fecha_inicio;
        $proyecto_formulario_13_linea_65->fecha_finalizacion                  = $request->fecha_finalizacion;
        $proyecto_formulario_13_linea_65->eje_sennova                         = $request->eje_sennova;
        $proyecto_formulario_13_linea_65->areas_cualificacion_mnc             = $request->areas_cualificacion_mnc;

        $proyecto_formulario_13_linea_65->max_meses_ejecucion                 = $request->max_meses_ejecucion;
        $proyecto_formulario_13_linea_65->video                               = null;
        $proyecto_formulario_13_linea_65->justificacion_industria_4           = null;
        $proyecto_formulario_13_linea_65->justificacion_politica_discapacidad = null;
        $proyecto_formulario_13_linea_65->resumen                             = '';
        $proyecto_formulario_13_linea_65->antecedentes                        = '';
        $proyecto_formulario_13_linea_65->marco_conceptual                    = '';
        $proyecto_formulario_13_linea_65->metodologia                         = '';
        $proyecto_formulario_13_linea_65->propuesta_sostenibilidad            = '';
        $proyecto_formulario_13_linea_65->bibliografia                        = '';
        $proyecto_formulario_13_linea_65->numero_aprendices                   = 0;
        $proyecto_formulario_13_linea_65->impacto_municipios                  = '';
        $proyecto_formulario_13_linea_65->impacto_centro_formacion            = '';

        $proyecto_formulario_13_linea_65->relacionado_plan_tecnologico        = 2;
        $proyecto_formulario_13_linea_65->relacionado_agendas_competitividad  = 2;
        $proyecto_formulario_13_linea_65->relacionado_mesas_sectoriales       = 2;

        $proyecto_formulario_13_linea_65->lineaInvestigacion()->associate($request->linea_investigacion_id);
        $proyecto_formulario_13_linea_65->areaConocimiento()->associate($request->area_conocimiento_id);
        $proyecto_formulario_13_linea_65->tematicaEstrategica()->associate($request->tematica_estrategica_id);
        $proyecto_formulario_13_linea_65->actividadEconomica()->associate($request->actividad_economica_id);

        $proyecto->proyectoFormulario13Linea65()->save($proyecto_formulario_13_linea_65);

        $proyecto->participantes()->attach(
            Auth::user()->id,
            [
                'es_formulador'     => true,
                'cantidad_meses'    => $request->cantidad_meses,
                'cantidad_horas'    => $request->cantidad_horas,
                'rol_sennova'       => $request->rol_sennova,
            ]
        );

        return redirect()->route('convocatorias.proyectos-formulario-13-linea-65.edit', [$convocatoria, $proyecto_formulario_13_linea_65])->with('success', 'El recurso se ha creado correctamente. Por favor continue diligenciando la información.');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\ProyectoFormulario13Linea65  $proyecto_formulario_13_linea_65
     * @return \Illuminate\Http\Response
     */
    public function show(Convocatoria $convocatoria, ProyectoFormulario13Linea65 $proyecto_formulario_13_linea_65)
    {
        $this->authorize('visualizar-proyecto-autor', [$proyecto_formulario_13_linea_65->proyecto]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\ProyectoFormulario13Linea65  $proyecto_formulario_13_linea_65
     * @return \Illuminate\Http\Response
     */
    public function edit(Convocatoria $convocatoria, ProyectoFormulario13Linea65 $proyecto_formulario_13_linea_65)
    {
        $this->authorize('visualizar-proyecto-autor', [$proyecto_formulario_13_linea_65->proyecto]);

        // $proyecto_formulario_13_linea_65->load('proyecto.evaluaciones.evaluacionProyectoFormulario13Linea65');

        $proyecto_formulario_13_linea_65->proyecto->precio_proyecto           = $proyecto_formulario_13_linea_65->proyecto->precioProyecto;
        $proyecto_formulario_13_linea_65->proyecto->centroFormacion;
        $proyecto_formulario_13_linea_65->proyecto->municipios;
        $proyecto_formulario_13_linea_65->proyecto->programasFormacion;
        $proyecto_formulario_13_linea_65->proyecto->mesasSectoriales;
        $proyecto_formulario_13_linea_65->proyecto->tecnoacademiaLineasTecnoacademia;
        $proyecto_formulario_13_linea_65->proyecto->tipoFormularioConvocatoria->lineaProgramatica;

        $proyecto_formulario_13_linea_65->mostrar_recomendaciones             = $proyecto_formulario_13_linea_65->proyecto->mostrar_recomendaciones;
        $proyecto_formulario_13_linea_65->mostrar_requiere_subsanacion        = $proyecto_formulario_13_linea_65->proyecto->mostrar_requiere_subsanacion;

        return Inertia::render('Convocatorias/Proyectos/ProyectosFormulario13Linea65/Edit', [
            'convocatoria'                                  => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'year', 'tipo_convocatoria', 'mostrar_recomendaciones', 'campos_convocatoria'),
            'proyecto_formulario_13_linea_65'               => $proyecto_formulario_13_linea_65,
            'evaluacion'                                    => EvaluacionProyectoFormulario13Linea65::find(request()->evaluacion_id),
            'tecnoacademia'                                 => $proyecto_formulario_13_linea_65->proyecto->tecnoacademiaLineasTecnoacademia()->first() ? $proyecto_formulario_13_linea_65->proyecto->tecnoacademiaLineasTecnoacademia()->first()->tecnoacademia->only('id', 'nombre') : null,
            'mesas_sectoriales'                             => MesaSectorial::select('id as value', 'nombre as label')->get('id'),
            'lineas_investigacion'                          => SelectHelper::lineasInvestigacion()->where('centro_formacion_id', $proyecto_formulario_13_linea_65->proyecto->centro_formacion_id)->values()->all(),
            'areas_conocimiento'                            => SelectHelper::areasConocimiento(),
            'lineas_programaticas'                          => SelectHelper::lineasProgramaticas(),
            'areas_cualificacion_mnc'                       => json_decode(Storage::get('json/areas-cualificacion-mnc.json'), true),
            'lineas_estrategicas_sena'                      => json_decode(Storage::get('json/lineas-estrategicas.json'), true),
            'ejes_sennova'                                  => json_decode(Storage::get('json/ejes-sennova.json'), true),
            'actividades_economicas'                        => SelectHelper::actividadesEconomicas(),
            'tematicas_estrategicas'                        => SelectHelper::tematicasEstrategicas(),
            'tecnoacademias'                                => SelectHelper::tecnoacademias(),
            'nodos_tecnoparques'                            => SelectHelper::nodosTecnoparque(),
            'hubs_innovacion'                               => SelectHelper::hubsInnovacion(),
            'laboratorios_st'                               => SelectHelper::laboratoriosServiciosTecnologicos(),
            'municipios'                                    => SelectHelper::municipios(),
            'lineas_tecnoacademia'                          => SelectHelper::lineasTecnoacademia(),
            'programas_formacion_con_registro_calificado'   => SelectHelper::programasFormacion()->where('registro_calificado', true)->where('centro_formacion_id', $proyecto_formulario_13_linea_65->proyecto->centro_formacion_id)->values()->all(),
            'programas_formacion_sin_registro_calificado'   => SelectHelper::programasFormacion()->where('registro_calificado', false)->values()->all(),
            'roles_sennova'                                 => RolSennova::select('id as value', 'nombre as label')->orderBy('nombre', 'ASC')->get(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\ProyectoFormulario13Linea65  $proyecto_formulario_13_linea_65
     * @return \Illuminate\Http\Response
     */
    public function update(ProyectoFormulario13Linea65Request $request, Convocatoria $convocatoria, ProyectoFormulario13Linea65 $proyecto_formulario_13_linea_65)
    {
        $this->authorize('modificar-proyecto-autor', [$proyecto_formulario_13_linea_65->proyecto]);

        $proyecto_formulario_13_linea_65->update($request->validated());

        $proyecto_formulario_13_linea_65->save();

        $proyecto_formulario_13_linea_65->proyecto->municipios()->sync($request->municipios);
        $proyecto_formulario_13_linea_65->proyecto->programasFormacion()->sync(array_merge($request->programas_formacion ? $request->programas_formacion : [], $request->programas_formacion_articulados ? $request->programas_formacion_articulados : []));

        $request->relacionado_mesas_sectoriales == 1 ? $proyecto_formulario_13_linea_65->proyecto->mesasSectoriales()->sync($request->mesa_sectorial_id) : $proyecto_formulario_13_linea_65->proyecto->mesasSectoriales()->detach();

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\ProyectoFormulario13Linea65  $proyecto_formulario_13_linea_65
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, Convocatoria $convocatoria, ProyectoFormulario13Linea65 $proyecto_formulario_13_linea_65)
    {
        $this->authorize('eliminar-proyecto-autor', [$proyecto_formulario_13_linea_65->proyecto]);

        // if (!Hash::check($request->password, Auth::user()->password)) {
        //     return back()
        //         ->withErrors(['password' => __('The password is incorrect.')]);
        // }

        $proyecto_formulario_13_linea_65->proyecto()->delete();

        return back()->with('success', 'El recurso se ha eliminado correctamente.');
    }

    public function updateEvaluacion(EvaluacionProyectoFormulario13Linea65Request $request, Convocatoria $convocatoria, EvaluacionProyectoFormulario13Linea65 $evaluacionProyectoFormulario13Linea65)
    {
        $this->authorize('modificar-evaluacion-autor', $evaluacionProyectoFormulario13Linea65->evaluacion);

        $evaluacionProyectoFormulario13Linea65->evaluacion()->update([
            'iniciado' => true,
            'clausula_confidencialidad' => $request->clausula_confidencialidad

        ]);

        $evaluacionProyectoFormulario13Linea65->titulo_puntaje                                      = $request->titulo_puntaje;
        $evaluacionProyectoFormulario13Linea65->titulo_comentario                                   = $request->titulo_requiere_comentario == false ? $request->titulo_comentario : null;
        $evaluacionProyectoFormulario13Linea65->video_puntaje                                       = $request->video_puntaje;
        $evaluacionProyectoFormulario13Linea65->video_comentario                                    = $request->video_requiere_comentario == false ? $request->video_comentario : null;

        $evaluacionProyectoFormulario13Linea65->antecedentes_puntaje                                = $request->antecedentes_puntaje;
        $evaluacionProyectoFormulario13Linea65->antecedentes_comentario                             = $request->antecedentes_requiere_comentario == false ? $request->antecedentes_comentario : null;

        $evaluacionProyectoFormulario13Linea65->resumen_puntaje                                     = $request->resumen_puntaje;
        $evaluacionProyectoFormulario13Linea65->resumen_comentario                                  = $request->resumen_requiere_comentario == false ? $request->resumen_comentario : null;
        $evaluacionProyectoFormulario13Linea65->ortografia_puntaje                                  = $request->ortografia_puntaje;
        $evaluacionProyectoFormulario13Linea65->ortografia_comentario                               = $request->ortografia_requiere_comentario == false ? $request->ortografia_comentario : null;
        $evaluacionProyectoFormulario13Linea65->redaccion_puntaje                                   = $request->redaccion_puntaje;
        $evaluacionProyectoFormulario13Linea65->redaccion_comentario                                = $request->redaccion_requiere_comentario == false ? $request->redaccion_comentario : null;
        $evaluacionProyectoFormulario13Linea65->normas_apa_puntaje                                  = $request->normas_apa_puntaje;
        $evaluacionProyectoFormulario13Linea65->normas_apa_comentario                               = $request->normas_apa_requiere_comentario == false ? $request->normas_apa_comentario : null;

        $evaluacionProyectoFormulario13Linea65->justificacion_economia_naranja_comentario           = $request->justificacion_economia_naranja_requiere_comentario == false ? $request->justificacion_economia_naranja_comentario : null;
        $evaluacionProyectoFormulario13Linea65->justificacion_industria_4_comentario                = $request->justificacion_industria_4_requiere_comentario == false ? $request->justificacion_industria_4_comentario : null;
        $evaluacionProyectoFormulario13Linea65->bibliografia_comentario                             = $request->bibliografia_requiere_comentario == false ? $request->bibliografia_comentario : null;
        $evaluacionProyectoFormulario13Linea65->fechas_comentario                                   = $request->fechas_requiere_comentario == false ? $request->fechas_comentario : null;
        $evaluacionProyectoFormulario13Linea65->justificacion_politica_discapacidad_comentario      = $request->justificacion_politica_discapacidad_requiere_comentario == false ? $request->justificacion_politica_discapacidad_comentario : null;
        $evaluacionProyectoFormulario13Linea65->actividad_economica_comentario                      = $request->actividad_economica_requiere_comentario == false ? $request->actividad_economica_comentario : null;
        $evaluacionProyectoFormulario13Linea65->area_conocimiento_comentario                        = $request->area_conocimiento_requiere_comentario == false ? $request->area_conocimiento_comentario : null;
        $evaluacionProyectoFormulario13Linea65->tematica_estrategica_comentario                     = $request->tematica_estrategica_requiere_comentario == false ? $request->tematica_estrategica_comentario : null;

        $evaluacionProyectoFormulario13Linea65->save();

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }

    public function updateLongColumn(ProyectoFormulario13Linea65ColumnRequest $request, Convocatoria $convocatoria, ProyectoFormulario13Linea65 $proyecto_formulario_13_linea_65, $column)
    {
        $this->authorize('modificar-proyecto-autor', [$proyecto_formulario_13_linea_65->proyecto]);

        if ($column == 'programas_formacion' || $column == 'programas_formacion_articulados') {
            $proyecto_formulario_13_linea_65->proyecto->programasFormacion()->sync(array_merge($request->programas_formacion ? $request->programas_formacion : [], $request->programas_formacion_articulados ? $request->programas_formacion_articulados : []));
            return back();
        }

        if ($column == 'municipios') {
            $proyecto_formulario_13_linea_65->proyecto->municipios()->sync($request->only($column)[$column]);
            return back();
        }

        if ($column == 'mesa_sectorial_id') {
            $proyecto_formulario_13_linea_65->proyecto->mesasSectoriales()->sync($request->only($column)[$column]);
            return back();
        }

        if ($column == 'linea_tecnologica_id') {
            $proyecto_formulario_13_linea_65->proyecto->tecnoacademiaLineasTecnoacademia()->sync($request->only($column)[$column]);
            return back();
        }

        $proyecto_formulario_13_linea_65->update($request->only($column));

        return back();
    }
}
