<?php

namespace App\Http\Controllers;

use App\Helpers\SelectHelper;
use App\Models\Proyecto;
use App\Models\CulturaInnovacion;
use App\Models\Convocatoria;
use App\Models\MesaSectorial;
use App\Http\Requests\CulturaInnovacionLongColumnRequest;
use App\Http\Requests\CulturaInnovacionRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use App\Http\Traits\ProyectoRolSennovaValidationTrait;
use App\Models\CentroFormacion;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class CulturaInnovacionController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Convocatoria $convocatoria)
    {
        return Inertia::render('Convocatorias/Proyectos/CulturaInnovacion/Index', [
            'convocatoria'      => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria', 'fase'),
            'filters'           => request()->all('search', 'estructuracion_proyectos'),
            'culturaInnovacion' => CulturaInnovacion::getProyectosPorRol($convocatoria)->appends(['search' => request()->search, 'estructuracion_proyectos' => request()->estructuracion_proyectos]),
            'allowedToCreate'   => Gate::inspect('formular-proyecto', [9, $convocatoria])->allowed()
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

        $centrosFormacion = CentroFormacion::selectRaw('centros_formacion.id as value, concat(centros_formacion.nombre, chr(10), \'∙ Código: \', centros_formacion.codigo) as label')->orderBy('centros_formacion.nombre', 'ASC')->get();

        return Inertia::render('Convocatorias/Proyectos/CulturaInnovacion/Create', [
            'convocatoria'          => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria', 'min_fecha_inicio_proyectos_linea_65', 'max_fecha_finalizacion_proyectos_cultura', 'fecha_maxima_cultura'),
            'roles'                 => collect(json_decode(Storage::get('json/roles-sennova-idi.json'), true)),
            'centrosFormacion'      => $centrosFormacion,
            'lineasInvestigacion'   => SelectHelper::lineasInvestigacion(),
            'lineasProgramaticas'   => SelectHelper::lineasProgramaticas()->where('categoria_proyecto', 5)->values()->all(),
            'areasConocimiento'     => SelectHelper::areasConocimiento(),
            'actividadesEconomicas' => SelectHelper::actividadesEconomicas(),
            'tematicasEstrategicas' => SelectHelper::tematicasEstrategicas(),
            'tiposProyectos'        => json_decode(Storage::get('json/tipos-proyectos-cultura.json'), true),
            'tiposEventos'          => json_decode(Storage::get('json/tipos-eventos-cultura.json'), true),
            'allowedToCreate'       => Gate::inspect('formular-proyecto', [9, $convocatoria])->allowed()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CulturaInnovacionRequest $request, Convocatoria $convocatoria)
    {
        $this->authorize('formular-proyecto', [$request->linea_programatica_id, $convocatoria]);

        $proyecto = new Proyecto();
        $proyecto->centroFormacion()->associate($request->centro_formacion_id);
        $proyecto->lineaProgramatica()->associate($request->linea_programatica_id);
        $proyecto->convocatoria()->associate($convocatoria);
        $proyecto->save();

        $culturaInnovacion = new CulturaInnovacion();
        $culturaInnovacion->titulo                              = $request->titulo;
        $culturaInnovacion->fecha_inicio                        = $request->fecha_inicio;
        $culturaInnovacion->fecha_finalizacion                  = $request->fecha_finalizacion;
        $culturaInnovacion->max_meses_ejecucion                 = $request->max_meses_ejecucion;
        $culturaInnovacion->tipo_proyecto                       = $request->tipo_proyecto;
        $culturaInnovacion->tipo_evento                         = $request->tipo_evento;
        $culturaInnovacion->video                               = null;
        $culturaInnovacion->justificacion_industria_4           = null;
        $culturaInnovacion->justificacion_economia_naranja      = null;
        $culturaInnovacion->justificacion_politica_discapacidad = null;
        $culturaInnovacion->resumen                             = '';
        $culturaInnovacion->antecedentes                        = '';
        $culturaInnovacion->marco_conceptual                    = '';
        $culturaInnovacion->metodologia                         = '';
        $culturaInnovacion->propuesta_sostenibilidad            = '';
        $culturaInnovacion->bibliografia                        = '';
        $culturaInnovacion->numero_aprendices                   = 0;
        $culturaInnovacion->impacto_municipios                  = '';
        $culturaInnovacion->impacto_centro_formacion            = '';

        $culturaInnovacion->muestreo                            = 6;
        $culturaInnovacion->actividades_muestreo                = null;
        $culturaInnovacion->objetivo_muestreo                   = null;
        $culturaInnovacion->recoleccion_especimenes             = 2;

        $culturaInnovacion->relacionado_plan_tecnologico        = 2;
        $culturaInnovacion->relacionado_agendas_competitividad  = 2;
        $culturaInnovacion->relacionado_mesas_sectoriales       = 2;
        $culturaInnovacion->relacionado_tecnoacademia           = 2;

        $culturaInnovacion->lineaInvestigacion()->associate($request->linea_investigacion_id);
        $culturaInnovacion->areaConocimiento()->associate($request->area_conocimiento_id);
        $culturaInnovacion->tematicaEstrategica()->associate($request->tematica_estrategica_id);
        $culturaInnovacion->actividadEconomica()->associate($request->actividad_economica_id);

        $proyecto->culturaInnovacion()->save($culturaInnovacion);

        $proyecto->participantes()->attach(
            Auth::user()->id,
            [
                'es_formulador'     => true,
                'cantidad_meses'    => $request->cantidad_meses,
                'cantidad_horas'    => $request->cantidad_horas,
                'rol_sennova'       => $request->rol_sennova,
            ]
        );

        return redirect()->route('convocatorias.cultura-innovacion.edit', [$convocatoria, $culturaInnovacion])->with('success', 'El recurso se ha creado correctamente. Por favor continue diligenciando la información.');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\CulturaInnovacion  $culturaInnovacion
     * @return \Illuminate\Http\Response
     */
    public function show(Convocatoria $convocatoria, CulturaInnovacion $culturaInnovacion)
    {
        $this->authorize('visualizar-proyecto-autor', [$culturaInnovacion->proyecto]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\CulturaInnovacion  $culturaInnovacion
     * @return \Illuminate\Http\Response
     */
    public function edit(Convocatoria $convocatoria, CulturaInnovacion $culturaInnovacion)
    {
        $this->authorize('visualizar-proyecto-autor', [$culturaInnovacion->proyecto]);

        $culturaInnovacion->load('proyecto.evaluaciones.culturaInnovacionEvaluacion');

        $culturaInnovacion->codigo_linea_programatica = $culturaInnovacion->proyecto->lineaProgramatica->codigo;
        $culturaInnovacion->precio_proyecto           = $culturaInnovacion->proyecto->precioProyecto;
        $culturaInnovacion->proyecto->centroFormacion;

        $culturaInnovacion->mostrar_recomendaciones = $culturaInnovacion->proyecto->mostrar_recomendaciones;
        $culturaInnovacion->mostrar_requiere_subsanacion = $culturaInnovacion->proyecto->mostrar_requiere_subsanacion;

        return Inertia::render('Convocatorias/Proyectos/CulturaInnovacion/Edit', [
            'convocatoria'                              => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria', 'min_fecha_inicio_proyectos_linea_65', 'max_fecha_finalizacion_proyectos_cultura', 'fecha_maxima_cultura', 'mostrar_recomendaciones', 'campos_convocatoria'),
            'culturaInnovacion'                         => $culturaInnovacion,
            'mesasSectorialesRelacionadas'              => $culturaInnovacion->mesasSectoriales()->pluck('mesas_sectoriales.id'),
            'lineasTecnoacademiaRelacionadas'           => $culturaInnovacion->tecnoacademiaLineasTecnoacademia()->pluck('tecnoacademia_linea_tecnoacademia.id'),
            'tecnoacademia'                             => $culturaInnovacion->tecnoacademiaLineasTecnoacademia()->first() ? $culturaInnovacion->tecnoacademiaLineasTecnoacademia()->first()->tecnoacademia->only('id', 'nombre') : null,
            'mesasSectoriales'                          => MesaSectorial::select('id', 'nombre')->get('id'),
            'lineasInvestigacion'                       => SelectHelper::lineasInvestigacion()->where('centro_formacion_id', $culturaInnovacion->proyecto->centro_formacion_id)->values()->all(),
            'lineasProgramaticas'                       => SelectHelper::lineasProgramaticas()->where('categoria_proyecto', 5)->values()->all(),
            'areasConocimiento'                         => SelectHelper::areasConocimiento(),
            'actividadesEconomicas'                     => SelectHelper::actividadesEconomicas(),
            'tematicasEstrategicas'                     => SelectHelper::tematicasEstrategicas(),
            'tecnoacademias'                            => SelectHelper::tecnoacademias(),
            'municipios'                                => SelectHelper::municipios(),
            'lineasTecnoacademia'                       => SelectHelper::lineasTecnoacademia(),
            'programasFormacionConRegistroCalificado'   => SelectHelper::programasFormacion()->where('registro_calificado', true)->where('centro_formacion_id', $culturaInnovacion->proyecto->centro_formacion_id)->values()->all(),
            'programasFormacionSinRegistroCalificado'   => SelectHelper::programasFormacion()->where('registro_calificado', false)->values()->all(),
            'proyectoMunicipios'                        => $culturaInnovacion->proyecto->municipios()->select('municipios.id as value', 'municipios.nombre as label', 'regionales.nombre as group')->join('regionales', 'regionales.id', 'municipios.regional_id')->get(),
            'programasFormacionConRegistroRelacionados' => $culturaInnovacion->proyecto->programasFormacion()->selectRaw('programas_formacion.id as value, concat(programas_formacion.nombre, chr(10), \'∙ Código: \', programas_formacion.codigo) as label')->where('registro_calificado', true)->get(),
            'programasFormacionSinRegistroRelacionados' => $culturaInnovacion->proyecto->programasFormacion()->selectRaw('programas_formacion.id as value, concat(programas_formacion.nombre, chr(10), \'∙ Código: \', programas_formacion.codigo) as label')->where('registro_calificado', false)->get(),
            'opcionesAplicaNoAplica'                    => json_decode(Storage::get('json/opciones-aplica-no-aplica.json'), true),
            'tiposProyectos'                            => json_decode(Storage::get('json/tipos-proyectos-cultura.json'), true),
            'tiposEventos'                              => json_decode(Storage::get('json/tipos-eventos-cultura.json'), true),
            'versiones'                                 => $culturaInnovacion->proyecto->PdfVersiones,
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\CulturaInnovacion  $culturaInnovacion
     * @return \Illuminate\Http\Response
     */
    public function update(CulturaInnovacionRequest $request, Convocatoria $convocatoria, CulturaInnovacion $culturaInnovacion)
    {
        $this->authorize('modificar-proyecto-autor', [$culturaInnovacion->proyecto]);

        $culturaInnovacion->titulo                              = $request->titulo;
        $culturaInnovacion->fecha_inicio                        = $request->fecha_inicio;
        $culturaInnovacion->fecha_finalizacion                  = $request->fecha_finalizacion;
        $culturaInnovacion->max_meses_ejecucion                 = $request->max_meses_ejecucion;
        $culturaInnovacion->video                               = $request->video;
        $culturaInnovacion->tipo_proyecto                       = $request->tipo_proyecto;
        $culturaInnovacion->tipo_evento                         = $request->tipo_evento;
        $culturaInnovacion->numero_aprendices                   = $request->numero_aprendices;
        $culturaInnovacion->muestreo                            = $request->muestreo;
        $culturaInnovacion->actividades_muestreo                = $request->muestreo == 1 ? $request->actividades_muestreo : null;
        $culturaInnovacion->objetivo_muestreo                   = $request->muestreo == 1 ? $request->objetivo_muestreo  : null;
        $culturaInnovacion->recoleccion_especimenes             = $request->recoleccion_especimenes;

        $culturaInnovacion->resumen                             = $request->resumen;
        $culturaInnovacion->antecedentes                        = $request->antecedentes;
        $culturaInnovacion->marco_conceptual                    = $request->marco_conceptual;
        $culturaInnovacion->justificacion_industria_4           = $request->justificacion_industria_4;
        $culturaInnovacion->justificacion_economia_naranja      = $request->justificacion_economia_naranja;
        $culturaInnovacion->justificacion_politica_discapacidad = $request->justificacion_politica_discapacidad;
        $culturaInnovacion->impacto_municipios                  = $request->impacto_municipios;
        $culturaInnovacion->impacto_centro_formacion            = $request->impacto_centro_formacion;
        $culturaInnovacion->bibliografia                        = $request->bibliografia;
        $culturaInnovacion->atencion_pluralista_diferencial     = $request->atencion_pluralista_diferencial;
        $culturaInnovacion->impacto_sector_agricola             = $request->impacto_sector_agricola;

        $culturaInnovacion->relacionado_plan_tecnologico         = $request->relacionado_plan_tecnologico;
        $culturaInnovacion->relacionado_agendas_competitividad   = $request->relacionado_agendas_competitividad;
        $culturaInnovacion->relacionado_mesas_sectoriales        = $request->relacionado_mesas_sectoriales;
        $culturaInnovacion->relacionado_tecnoacademia            = $request->relacionado_tecnoacademia;

        $culturaInnovacion->lineaInvestigacion()->associate($request->linea_investigacion_id);
        $culturaInnovacion->areaConocimiento()->associate($request->area_conocimiento_id);
        $culturaInnovacion->tematicaEstrategica()->associate($request->tematica_estrategica_id);
        $culturaInnovacion->actividadEconomica()->associate($request->actividad_economica_id);

        $culturaInnovacion->proyecto->municipios()->sync($request->municipios);
        $culturaInnovacion->proyecto->programasFormacion()->sync(array_merge($request->programas_formacion ? $request->programas_formacion : [], $request->programas_formacion_articulados ? $request->programas_formacion_articulados : []));

        $culturaInnovacion->save();

        $request->relacionado_mesas_sectoriales == 1 ? $culturaInnovacion->mesasSectoriales()->sync($request->mesa_sectorial_id) : $culturaInnovacion->mesasSectoriales()->detach();
        $request->relacionado_tecnoacademia == 1 ? $culturaInnovacion->tecnoacademiaLineasTecnoacademia()->sync($request->linea_tecnologica_id) : $culturaInnovacion->tecnoacademiaLineasTecnoacademia()->detach();


        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }

    public function updateLongColumn(CulturaInnovacionLongColumnRequest $request, Convocatoria $convocatoria, CulturaInnovacion $culturaInnovacion, $column)
    {
        $this->authorize('modificar-proyecto-autor', [$culturaInnovacion->proyecto]);

        $culturaInnovacion->update($request->only($column));

        return back();
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\CulturaInnovacion  $culturaInnovacion
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, Convocatoria $convocatoria, CulturaInnovacion $culturaInnovacion)
    {
        $this->authorize('eliminar-proyecto-autor', [$culturaInnovacion->proyecto]);

        if (!Hash::check($request->password, Auth::user()->password)) {
            return back()
                ->withErrors(['password' => __('The password is incorrect.')]);
        }

        $culturaInnovacion->proyecto()->delete();

        return back()->with('success', 'El recurso se ha eliminado correctamente.');
    }
}
